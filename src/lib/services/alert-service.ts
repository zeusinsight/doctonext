import { db } from "@/database/db"
import {
    savedSearches,
    alertNotifications,
    listings,
    listingLocations,
    users
} from "@/database/schema"
import { eq, and } from "drizzle-orm"
import { Resend } from "resend"
import { ListingAlertEmail } from "@/components/emails/listing-alert-template"
import { MessageNotificationEmail } from "@/components/emails/message-notification-template"
import type { ListingFilters } from "@/components/listings/listings-filter-modal"
import { renderAsync } from "@react-email/render"
import { createNotification } from "@/lib/actions/notifications"

const resend = new Resend(process.env.RESEND_API_KEY)

interface ListingWithLocation {
    id: string
    title: string
    listingType: string
    specialty?: string
    createdAt: Date
    location: {
        city: string
        region: string
    }
}

export async function checkNewListingAgainstSavedSearches(
    newListingId: string
) {
    try {
        // Get the new listing with location
        const [newListing] = await db
            .select({
                id: listings.id,
                title: listings.title,
                listingType: listings.listingType,
                specialty: listings.specialty,
                createdAt: listings.createdAt,
                isBoostPlus: listings.isBoostPlus,
                city: listingLocations.city,
                region: listingLocations.region
            })
            .from(listings)
            .leftJoin(
                listingLocations,
                eq(listings.id, listingLocations.listingId)
            )
            .where(eq(listings.id, newListingId))
            .limit(1)

        if (!newListing) {
            return { success: false, error: "Listing not found" }
        }

        // Get all active saved searches with email alerts enabled
        const activeSearches = await db
            .select({
                id: savedSearches.id,
                userId: savedSearches.userId,
                name: savedSearches.name,
                searchCriteria: savedSearches.searchCriteria
            })
            .from(savedSearches)
            .where(
                and(
                    eq(savedSearches.isActive, true),
                    eq(savedSearches.emailAlertsEnabled, true)
                )
            )

        if (activeSearches.length === 0) {
            return { success: true, message: "No active searches to check" }
        }

        const matchingSearches = []

        // Check if the new listing matches each saved search
        for (const search of activeSearches) {
            const criteria = search.searchCriteria as ListingFilters
            let matches = true

            // Check listing type
            if (criteria.listingTypes?.length > 0) {
                if (!criteria.listingTypes.includes(newListing.listingType)) {
                    matches = false
                }
            }

            // Check specialty
            if (matches && criteria.specialties?.length > 0) {
                if (
                    !newListing.specialty ||
                    !criteria.specialties.includes(newListing.specialty)
                ) {
                    matches = false
                }
            }

            // Check region
            if (matches && criteria.regions?.length > 0) {
                if (
                    !newListing.region ||
                    !criteria.regions.includes(newListing.region)
                ) {
                    matches = false
                }
            }

            // Check boost plus
            if (matches && criteria.isBoostPlus) {
                if (!newListing.isBoostPlus) {
                    matches = false
                }
            }

            if (matches) {
                matchingSearches.push(search)
            }
        }

        if (matchingSearches.length === 0) {
            return { success: true, message: "No matching searches found" }
        }

        // Group matching searches by user
        const searchesByUser = matchingSearches.reduce(
            (acc, search) => {
                if (!acc[search.userId]) {
                    acc[search.userId] = []
                }
                acc[search.userId].push(search)
                return acc
            },
            {} as Record<string, typeof matchingSearches>
        )

        let emailsSent = 0

        // Send emails to each user
        for (const [userId, userSearches] of Object.entries(searchesByUser)) {
            // Get user info
            const [user] = await db
                .select()
                .from(users)
                .where(eq(users.id, userId))
                .limit(1)

            if (!user) continue

            // Format listing for email
            const formattedListing: ListingWithLocation = {
                id: newListing.id,
                title: newListing.title,
                listingType: newListing.listingType,
                specialty: newListing.specialty || undefined,
                createdAt: newListing.createdAt,
                location: {
                    city: newListing.city || "Non spécifié",
                    region: newListing.region || "Non spécifié"
                }
            }

            // Send one email per user with all matching searches mentioned
            for (const search of userSearches) {
                // Check if we've already sent an alert for this listing-search combination
                const existingNotification = await db
                    .select()
                    .from(alertNotifications)
                    .where(
                        and(
                            eq(alertNotifications.savedSearchId, search.id),
                            eq(alertNotifications.listingId, newListingId)
                        )
                    )
                    .limit(1)

                if (existingNotification.length > 0) {
                    console.log(
                        `Alert already sent for listing ${newListingId} and search ${search.id}`
                    )
                    continue // Skip this one, already sent
                }

                const emailSent = await sendAlertEmail(
                    user.email,
                    user.name,
                    search.name,
                    [formattedListing],
                    search.id
                )

                if (emailSent) {
                    emailsSent++

                    // Update last alert sent timestamp
                    await db
                        .update(savedSearches)
                        .set({ lastAlertSent: new Date() })
                        .where(eq(savedSearches.id, search.id))

                    // Record notification immediately to prevent duplicates
                    await db.insert(alertNotifications).values({
                        id: crypto.randomUUID(),
                        savedSearchId: search.id,
                        listingId: newListingId,
                        userId: userId,
                        emailSent: true
                    })

                    // Create a notification for the user
                    await createNotification(
                        userId,
                        "saved_search_alert",
                        `Nouvelle annonce correspondante`,
                        `Une nouvelle annonce correspond à votre recherche "${search.name}"`,
                        {
                            listingId: newListingId,
                            listingTitle: formattedListing.title,
                            searchName: search.name,
                            searchId: search.id
                        }
                    )
                }
            }
        }

        return {
            success: true,
            message: `Sent ${emailsSent} email(s) to ${Object.keys(searchesByUser).length} user(s)`,
            stats: {
                matchingSearches: matchingSearches.length,
                usersNotified: Object.keys(searchesByUser).length,
                emailsSent
            }
        }
    } catch (error) {
        console.error(
            "Error checking new listing against saved searches:",
            error
        )
        return { success: false, error: "Failed to check listing" }
    }
}

export async function sendAlertEmail(
    userEmail: string,
    userName: string,
    searchName: string,
    listings: ListingWithLocation[],
    savedSearchId: string
): Promise<boolean> {
    try {
        const siteUrl =
            process.env.NEXT_PUBLIC_SITE_URL || "https://careevo.com"
        const unsubscribeUrl = `${siteUrl}/api/alerts/unsubscribe?id=${savedSearchId}`

        const emailHtml = await renderAsync(
            ListingAlertEmail({
                userName,
                searchName,
                listingsCount: listings.length,
                listings,
                unsubscribeUrl
            })
        )

        const { error } = await resend.emails.send({
            from: process.env.MAIL_FROM || "noreply@careevo.com",
            to: userEmail,
            subject: `${listings.length} nouvelle(s) annonce(s) pour "${searchName}"`,
            html: emailHtml
        })

        if (error) {
            console.error("Error sending email:", error)
            return false
        }

        return true
    } catch (error) {
        console.error("Error sending alert email:", error)
        return false
    }
}

export async function sendMessageNotificationEmail(
    recipientEmail: string,
    recipientName: string,
    senderName: string,
    messagePreview: string,
    conversationId: string,
    listingTitle?: string
): Promise<boolean> {
    try {
        const emailHtml = await renderAsync(
            MessageNotificationEmail({
                recipientName,
                senderName,
                messagePreview,
                conversationId,
                listingTitle
            })
        )

        const { error } = await resend.emails.send({
            from: process.env.MAIL_FROM || "noreply@careevo.com",
            to: recipientEmail,
            subject: `Nouveau message de ${senderName}`,
            html: emailHtml
        })

        if (error) {
            console.error("Error sending message notification email:", error)
            return false
        }

        return true
    } catch (error) {
        console.error("Error sending message notification email:", error)
        return false
    }
}

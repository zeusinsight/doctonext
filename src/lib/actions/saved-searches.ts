"use server"

import { auth } from "@/lib/auth"
import { db } from "@/database/db"
import { savedSearches, alertNotifications } from "@/database/schema"
import { eq, and, desc } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import type { ListingFilters } from "@/components/listings/listings-filter-modal"

export async function createSavedSearch(
    name: string,
    searchCriteria: ListingFilters,
    emailAlertsEnabled: boolean = true
) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session) {
            return { success: false, error: "Authentication requise" }
        }

        // Check if user already has a saved search with this name
        const existingSearch = await db
            .select()
            .from(savedSearches)
            .where(
                and(
                    eq(savedSearches.userId, session.user.id),
                    eq(savedSearches.name, name)
                )
            )
            .limit(1)

        if (existingSearch.length > 0) {
            return {
                success: false,
                error: "Une recherche avec ce nom existe déjà"
            }
        }

        // Create new saved search
        const [newSearch] = await db
            .insert(savedSearches)
            .values({
                id: crypto.randomUUID(),
                userId: session.user.id,
                name,
                searchCriteria,
                emailAlertsEnabled,
                isActive: true
            })
            .returning()

        revalidatePath("/dashboard/saved-searches")
        return { success: true, data: newSearch }
    } catch (error) {
        console.error("Error creating saved search:", error)
        return {
            success: false,
            error: "Échec de la sauvegarde de la recherche"
        }
    }
}

export async function getUserSavedSearches() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session) {
            return { success: false, error: "Authentication requise", data: [] }
        }

        const searches = await db
            .select()
            .from(savedSearches)
            .where(eq(savedSearches.userId, session.user.id))
            .orderBy(desc(savedSearches.createdAt))

        return { success: true, data: searches }
    } catch (error) {
        console.error("Error fetching saved searches:", error)
        return {
            success: false,
            error: "Échec de la récupération des recherches",
            data: []
        }
    }
}

export async function updateSavedSearch(
    id: string,
    updates: {
        name?: string
        searchCriteria?: ListingFilters
        emailAlertsEnabled?: boolean
        isActive?: boolean
    }
) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session) {
            return { success: false, error: "Authentication requise" }
        }

        // Verify ownership
        const search = await db
            .select()
            .from(savedSearches)
            .where(
                and(
                    eq(savedSearches.id, id),
                    eq(savedSearches.userId, session.user.id)
                )
            )
            .limit(1)

        if (search.length === 0) {
            return { success: false, error: "Recherche non trouvée" }
        }

        // Update the search
        const [updatedSearch] = await db
            .update(savedSearches)
            .set({
                ...updates,
                updatedAt: new Date()
            })
            .where(eq(savedSearches.id, id))
            .returning()

        revalidatePath("/dashboard/saved-searches")
        return { success: true, data: updatedSearch }
    } catch (error) {
        console.error("Error updating saved search:", error)
        return {
            success: false,
            error: "Échec de la mise à jour de la recherche"
        }
    }
}

export async function deleteSavedSearch(id: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session) {
            return { success: false, error: "Authentication requise" }
        }

        // Delete associated notifications first
        await db
            .delete(alertNotifications)
            .where(eq(alertNotifications.savedSearchId, id))

        // Delete the saved search
        await db
            .delete(savedSearches)
            .where(
                and(
                    eq(savedSearches.id, id),
                    eq(savedSearches.userId, session.user.id)
                )
            )

        revalidatePath("/dashboard/saved-searches")
        return { success: true }
    } catch (error) {
        console.error("Error deleting saved search:", error)
        return {
            success: false,
            error: "Échec de la suppression de la recherche"
        }
    }
}

export async function toggleEmailAlerts(id: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session) {
            return { success: false, error: "Authentication requise" }
        }

        // Get current state
        const [search] = await db
            .select()
            .from(savedSearches)
            .where(
                and(
                    eq(savedSearches.id, id),
                    eq(savedSearches.userId, session.user.id)
                )
            )
            .limit(1)

        if (!search) {
            return { success: false, error: "Recherche non trouvée" }
        }

        // Toggle the state
        const [updatedSearch] = await db
            .update(savedSearches)
            .set({
                emailAlertsEnabled: !search.emailAlertsEnabled,
                updatedAt: new Date()
            })
            .where(eq(savedSearches.id, id))
            .returning()

        revalidatePath("/dashboard/saved-searches")
        return { success: true, data: updatedSearch }
    } catch (error) {
        console.error("Error toggling email alerts:", error)
        return { success: false, error: "Échec de la modification des alertes" }
    }
}

export async function getActiveSavedSearchesCount() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session) {
            return 0
        }

        const result = await db
            .select()
            .from(savedSearches)
            .where(
                and(
                    eq(savedSearches.userId, session.user.id),
                    eq(savedSearches.emailAlertsEnabled, true),
                    eq(savedSearches.isActive, true)
                )
            )

        return result.length
    } catch (error) {
        console.error("Error counting active searches:", error)
        return 0
    }
}

import { EmailTemplate } from "@daveyplate/better-auth-ui/server"
import React from "react"

interface ListingAlertEmailProps {
    userName: string
    searchName: string
    listingsCount: number
    listings: Array<{
        id: string
        title: string
        listingType: string
        specialty?: string
        location: {
            city: string
            region: string
        }
        createdAt: Date
    }>
    unsubscribeUrl: string
}

export function ListingAlertEmail({
    userName,
    searchName,
    listingsCount,
    listings,
    unsubscribeUrl
}: ListingAlertEmailProps) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://doctonext.com"

    const formatListingType = (type: string) => {
        switch (type) {
            case "transfer":
                return "Cession"
            case "replacement":
                return "Remplacement"
            case "collaboration":
                return "Collaboration"
            default:
                return type
        }
    }

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(new Date(date))
    }

    const content = React.createElement(
        React.Fragment,
        null,
        React.createElement(
            "p",
            {
                style: {
                    marginBottom: "24px",
                    fontSize: "16px",
                    color: "#333333"
                }
            },
            `Bonjour ${userName},`
        ),
        React.createElement(
            "p",
            {
                style: {
                    marginBottom: "24px",
                    fontSize: "16px",
                    color: "#333333"
                }
            },
            listingsCount > 1
                ? `${listingsCount} nouvelles annonces correspondent à votre recherche sauvegardée "${searchName}".`
                : `Une nouvelle annonce correspond à votre recherche sauvegardée "${searchName}".`
        ),
        React.createElement(
            "div",
            { style: { marginBottom: "32px" } },
            ...listings.slice(0, 5).map((listing) =>
                React.createElement(
                    "div",
                    {
                        key: listing.id,
                        style: {
                            backgroundColor: "#f9fafb",
                            padding: "16px",
                            borderRadius: "8px",
                            marginBottom: "16px",
                            border: "1px solid #e5e7eb"
                        }
                    },
                    [
                        React.createElement(
                            "h3",
                            {
                                style: {
                                    margin: "0 0 8px 0",
                                    fontSize: "18px",
                                    fontWeight: "600",
                                    color: "#111827"
                                }
                            },
                            listing.title
                        ),
                        React.createElement(
                            "div",
                            {
                                style: {
                                    fontSize: "14px",
                                    color: "#6b7280",
                                    marginBottom: "12px"
                                }
                            },
                            [
                                `📍 ${listing.location.city}, ${listing.location.region}`,
                                ` • 📂 ${formatListingType(listing.listingType)}`,
                                listing.specialty
                                    ? ` • 👨‍⚕️ ${listing.specialty}`
                                    : ""
                            ].join("")
                        ),
                        React.createElement(
                            "div",
                            {
                                style: {
                                    fontSize: "12px",
                                    color: "#9ca3af",
                                    marginBottom: "12px"
                                }
                            },
                            `Publiée le ${formatDate(listing.createdAt)}`
                        ),
                        React.createElement(
                            "a",
                            {
                                href: `${siteUrl}/listings/${listing.id}`,
                                style: {
                                    display: "inline-block",
                                    backgroundColor: "#3b82f6",
                                    color: "white",
                                    padding: "8px 16px",
                                    borderRadius: "6px",
                                    textDecoration: "none",
                                    fontSize: "14px",
                                    fontWeight: "500"
                                }
                            },
                            "Voir l'annonce →"
                        )
                    ]
                )
            )
        ),
        listingsCount > 5
            ? React.createElement(
                  "div",
                  {
                      style: {
                          textAlign: "center",
                          marginBottom: "32px",
                          padding: "16px",
                          backgroundColor: "#eff6ff",
                          borderRadius: "8px"
                      }
                  },
                  [
                      React.createElement(
                          "p",
                          {
                              style: {
                                  margin: "0 0 16px 0",
                                  fontSize: "16px",
                                  color: "#1e40af"
                              }
                          },
                          `Et ${listingsCount - 5} autre(s) annonce(s) disponible(s)`
                      ),
                      React.createElement(
                          "a",
                          {
                              href: `${siteUrl}/listings`,
                              style: {
                                  display: "inline-block",
                                  backgroundColor: "#3b82f6",
                                  color: "white",
                                  padding: "12px 24px",
                                  borderRadius: "6px",
                                  textDecoration: "none",
                                  fontSize: "16px",
                                  fontWeight: "600"
                              }
                          },
                          "Voir toutes les annonces"
                      )
                  ]
              )
            : null,
        React.createElement(
            "div",
            {
                style: {
                    borderTop: "1px solid #e5e7eb",
                    paddingTop: "24px",
                    marginTop: "32px",
                    fontSize: "14px",
                    color: "#6b7280",
                    textAlign: "center"
                }
            },
            [
                React.createElement(
                    "p",
                    { style: { marginBottom: "12px" } },
                    "Vous recevez cet email car vous avez activé les alertes pour cette recherche."
                ),
                React.createElement("p", null, [
                    React.createElement(
                        "a",
                        {
                            href: unsubscribeUrl,
                            style: {
                                color: "#6b7280",
                                textDecoration: "underline"
                            }
                        },
                        "Se désabonner de ces alertes"
                    ),
                    " | ",
                    React.createElement(
                        "a",
                        {
                            href: `${siteUrl}/dashboard/saved-searches`,
                            style: {
                                color: "#6b7280",
                                textDecoration: "underline"
                            }
                        },
                        "Gérer mes recherches sauvegardées"
                    )
                ])
            ]
        )
    )

    return EmailTemplate({
        heading: `Nouvelles annonces pour "${searchName}"`,
        content,
        siteName: "Doctonext",
        baseUrl: siteUrl,
        imageUrl: `${siteUrl}/logo.png`
    })
}

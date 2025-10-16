import { EmailTemplate } from "@daveyplate/better-auth-ui/server"
import React from "react"

interface MessageNotificationEmailProps {
    recipientName: string
    senderName: string
    messagePreview: string
    conversationId: string
    listingTitle?: string
}

export function MessageNotificationEmail({
    recipientName,
    senderName,
    messagePreview,
    conversationId,
    listingTitle
}: MessageNotificationEmailProps) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://careevo.com"
    const conversationUrl = `${siteUrl}/dashboard/messages/${conversationId}`

    // Truncate message preview if too long
    const truncatedPreview =
        messagePreview.length > 150
            ? `${messagePreview.substring(0, 150)}...`
            : messagePreview

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
            `Bonjour ${recipientName},`
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
            `Vous avez reçu un nouveau message de ${senderName}.`
        ),

        // Message preview box
        React.createElement(
            "div",
            {
                style: {
                    backgroundColor: "#f9fafb",
                    padding: "20px",
                    borderRadius: "8px",
                    marginBottom: "24px",
                    border: "1px solid #e5e7eb",
                    borderLeft: "4px solid #3b82f6"
                }
            },
            [
                React.createElement(
                    "div",
                    {
                        style: {
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#1f2937",
                            marginBottom: "8px"
                        }
                    },
                    `💬 Message de ${senderName}`
                ),
                React.createElement(
                    "p",
                    {
                        style: {
                            fontSize: "16px",
                            color: "#374151",
                            lineHeight: "1.5",
                            margin: "0",
                            fontStyle: "italic"
                        }
                    },
                    `"${truncatedPreview}"`
                ),
                listingTitle
                    ? React.createElement(
                          "div",
                          {
                              style: {
                                  fontSize: "12px",
                                  color: "#6b7280",
                                  marginTop: "12px"
                              }
                          },
                          `📋 Concernant: ${listingTitle}`
                      )
                    : null
            ]
        ),

        // Call to action button
        React.createElement(
            "div",
            {
                style: {
                    textAlign: "center",
                    marginBottom: "32px"
                }
            },
            React.createElement(
                "a",
                {
                    href: conversationUrl,
                    style: {
                        display: "inline-block",
                        backgroundColor: "#3b82f6",
                        color: "white",
                        padding: "14px 28px",
                        borderRadius: "8px",
                        textDecoration: "none",
                        fontSize: "16px",
                        fontWeight: "600",
                        boxShadow: "0 2px 4px rgba(59, 130, 246, 0.1)"
                    }
                },
                "Répondre au message →"
            )
        ),

        // Alternative link text
        React.createElement(
            "p",
            {
                style: {
                    fontSize: "14px",
                    color: "#6b7280",
                    textAlign: "center",
                    marginBottom: "32px"
                }
            },
            [
                "Ou copiez ce lien dans votre navigateur : ",
                React.createElement(
                    "a",
                    {
                        href: conversationUrl,
                        style: {
                            color: "#3b82f6",
                            textDecoration: "underline"
                        }
                    },
                    conversationUrl
                )
            ]
        ),

        // Footer
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
                    "Vous recevez cet email car vous avez reçu un nouveau message sur Care Evo."
                ),
                React.createElement("p", null, [
                    React.createElement(
                        "a",
                        {
                            href: `${siteUrl}/dashboard/settings`,
                            style: {
                                color: "#6b7280",
                                textDecoration: "underline"
                            }
                        },
                        "Gérer mes notifications"
                    ),
                    " | ",
                    React.createElement(
                        "a",
                        {
                            href: `${siteUrl}/dashboard/messages`,
                            style: {
                                color: "#6b7280",
                                textDecoration: "underline"
                            }
                        },
                        "Voir toutes mes conversations"
                    )
                ])
            ]
        )
    )

    return EmailTemplate({
        heading: `Nouveau message de ${senderName}`,
        content,
        siteName: "Care Evo",
        baseUrl: siteUrl,
        imageUrl: `${siteUrl}/logo.png`
    })
}

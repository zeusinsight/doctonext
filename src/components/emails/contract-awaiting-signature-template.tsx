import { EmailTemplate } from "@daveyplate/better-auth-ui/server"
import React from "react"

interface ContractAwaitingSignatureEmailProps {
    recipientName: string
    signerName: string
    contractType: string
    listingTitle: string
    location: string
    contractId: string
    conversationId: string
}

export function ContractAwaitingSignatureEmail({
    recipientName,
    signerName,
    contractType,
    listingTitle,
    location,
    contractId,
    conversationId
}: ContractAwaitingSignatureEmailProps) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://doctonext.com"
    const signContractUrl = `${siteUrl}/api/contracts/redirect?contractId=${contractId}&conversationId=${conversationId}`

    const getContractTypeLabel = (type: string) => {
        switch (type) {
            case "replacement":
                return "Contrat de Remplacement"
            case "transfer":
                return "Contrat de Cession"
            case "collaboration":
                return "Contrat de Collaboration"
            default:
                return type
        }
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
            `${signerName} a signé le contrat et attend maintenant votre signature.`
        ),

        // Contract details box
        React.createElement(
            "div",
            {
                style: {
                    backgroundColor: "#f9fafb",
                    padding: "24px",
                    borderRadius: "12px",
                    marginBottom: "28px",
                    border: "2px solid #e5e7eb",
                    borderLeft: "6px solid #3b82f6"
                }
            },
            [
                React.createElement(
                    "div",
                    {
                        style: {
                            fontSize: "18px",
                            fontWeight: "700",
                            color: "#1f2937",
                            marginBottom: "16px",
                            display: "flex",
                            alignItems: "center"
                        }
                    },
                    "📄 Contrat en attente de signature"
                ),
                React.createElement(
                    "div",
                    {
                        style: {
                            fontSize: "16px",
                            color: "#374151",
                            lineHeight: "1.6",
                            marginBottom: "8px"
                        }
                    },
                    `Type: ${getContractTypeLabel(contractType)}`
                ),
                React.createElement(
                    "div",
                    {
                        style: {
                            fontSize: "16px",
                            color: "#374151",
                            lineHeight: "1.6",
                            marginBottom: "8px"
                        }
                    },
                    `Annonce: ${listingTitle}`
                ),
                React.createElement(
                    "div",
                    {
                        style: {
                            fontSize: "14px",
                            color: "#6b7280",
                            marginTop: "12px"
                        }
                    },
                    `📍 ${location}`
                )
            ]
        ),

        // Urgency notice
        React.createElement(
            "div",
            {
                style: {
                    backgroundColor: "#fef2f2",
                    padding: "20px",
                    borderRadius: "8px",
                    marginBottom: "24px",
                    border: "1px solid #fca5a5"
                }
            },
            [
                React.createElement(
                    "div",
                    {
                        style: {
                            fontSize: "16px",
                            fontWeight: "600",
                            color: "#b91c1c",
                            marginBottom: "8px"
                        }
                    },
                    "⏰ Action requise"
                ),
                React.createElement(
                    "p",
                    {
                        style: {
                            fontSize: "15px",
                            color: "#dc2626",
                            lineHeight: "1.5",
                            margin: "0"
                        }
                    },
                    "Votre signature est nécessaire pour finaliser ce contrat. Cliquez sur le bouton ci-dessous pour accéder au document et le signer électroniquement."
                )
            ]
        ),

        // Main call to action button
        React.createElement(
            "div",
            {
                style: {
                    textAlign: "center",
                    marginBottom: "24px"
                }
            },
            React.createElement(
                "a",
                {
                    href: signContractUrl,
                    style: {
                        display: "inline-block",
                        backgroundColor: "#059669",
                        color: "white",
                        padding: "18px 36px",
                        borderRadius: "10px",
                        textDecoration: "none",
                        fontSize: "18px",
                        fontWeight: "700",
                        boxShadow: "0 4px 6px rgba(5, 150, 105, 0.2)",
                        textTransform: "uppercase"
                    }
                },
                "Signer le contrat ✍️"
            )
        ),

        // Alternative access info
        React.createElement(
            "div",
            {
                style: {
                    backgroundColor: "#f3f4f6",
                    padding: "16px",
                    borderRadius: "8px",
                    marginBottom: "24px",
                    textAlign: "center"
                }
            },
            [
                React.createElement(
                    "p",
                    {
                        style: {
                            fontSize: "14px",
                            color: "#4b5563",
                            margin: "0 0 8px 0"
                        }
                    },
                    "Vous pouvez également accéder au contrat depuis votre conversation :"
                ),
                React.createElement(
                    "a",
                    {
                        href: `${siteUrl}/dashboard/messages/${conversationId}`,
                        style: {
                            color: "#3b82f6",
                            textDecoration: "underline",
                            fontSize: "14px"
                        }
                    },
                    "Voir la conversation"
                )
            ]
        ),

        // Process info
        React.createElement(
            "div",
            {
                style: {
                    backgroundColor: "#fffbeb",
                    padding: "16px",
                    borderRadius: "8px",
                    marginBottom: "32px"
                }
            },
            [
                React.createElement(
                    "h3",
                    {
                        style: {
                            fontSize: "16px",
                            fontWeight: "600",
                            color: "#92400e",
                            marginBottom: "12px"
                        }
                    },
                    "ℹ️ Comment ça marche :"
                ),
                React.createElement(
                    "ul",
                    {
                        style: {
                            fontSize: "14px",
                            color: "#a16207",
                            lineHeight: "1.6",
                            paddingLeft: "20px",
                            margin: "0"
                        }
                    },
                    [
                        React.createElement(
                            "li",
                            { style: { marginBottom: "4px" } },
                            "Cliquez sur le lien pour accéder au contrat"
                        ),
                        React.createElement(
                            "li",
                            { style: { marginBottom: "4px" } },
                            "Lisez attentivement le document"
                        ),
                        React.createElement(
                            "li",
                            { style: { marginBottom: "4px" } },
                            "Signez électroniquement aux endroits indiqués"
                        ),
                        React.createElement(
                            "li",
                            null,
                            "Vous et l'autre partie recevrez le contrat signé par email"
                        )
                    ]
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
                    "Vous recevez cet email car un contrat a été créé et nécessite votre signature."
                ),
                React.createElement("p", null, [
                    "Si vous avez des questions, contactez ",
                    React.createElement(
                        "a",
                        {
                            href: `${siteUrl}/dashboard/messages/${conversationId}`,
                            style: {
                                color: "#6b7280",
                                textDecoration: "underline"
                            }
                        },
                        `${signerName} via la conversation`
                    ),
                    " | ",
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
                    )
                ])
            ]
        )
    )

    return EmailTemplate({
        heading: `Contrat à signer de ${signerName}`,
        content,
        siteName: "Doctonext",
        baseUrl: siteUrl,
        imageUrl: `${siteUrl}/logo.png`
    })
}

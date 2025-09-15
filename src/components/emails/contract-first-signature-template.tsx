import { EmailTemplate } from "@daveyplate/better-auth-ui/server"
import React from "react"

interface ContractFirstSignatureEmailProps {
    signerName: string
    recipientName: string
    contractType: string
    listingTitle: string
    location: string
}

export function ContractFirstSignatureEmail({
    signerName,
    recipientName,
    contractType,
    listingTitle,
    location
}: ContractFirstSignatureEmailProps) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://doctonext.com"

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
            `Bonjour ${signerName},`
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
            "Votre signature électronique a été enregistrée avec succès."
        ),

        // Success confirmation box
        React.createElement(
            "div",
            {
                style: {
                    backgroundColor: "#f0f9ff",
                    padding: "24px",
                    borderRadius: "12px",
                    marginBottom: "28px",
                    border: "2px solid #0ea5e9",
                    borderLeft: "6px solid #0ea5e9"
                }
            },
            [
                React.createElement(
                    "div",
                    {
                        style: {
                            fontSize: "18px",
                            fontWeight: "700",
                            color: "#0c4a6e",
                            marginBottom: "16px",
                            display: "flex",
                            alignItems: "center"
                        }
                    },
                    "✅ Signature confirmée"
                ),
                React.createElement(
                    "p",
                    {
                        style: {
                            fontSize: "16px",
                            color: "#0369a1",
                            lineHeight: "1.6",
                            margin: "0 0 12px 0"
                        }
                    },
                    `Vous avez signé le ${getContractTypeLabel(contractType).toLowerCase()} pour "${listingTitle}"`
                ),
                React.createElement(
                    "div",
                    {
                        style: {
                            fontSize: "14px",
                            color: "#075985",
                            marginTop: "12px"
                        }
                    },
                    `📍 ${location}`
                )
            ]
        ),

        // Next steps info
        React.createElement(
            "div",
            {
                style: {
                    backgroundColor: "#fef3c7",
                    padding: "20px",
                    borderRadius: "8px",
                    marginBottom: "24px",
                    border: "1px solid #f59e0b"
                }
            },
            [
                React.createElement(
                    "div",
                    {
                        style: {
                            fontSize: "16px",
                            fontWeight: "600",
                            color: "#92400e",
                            marginBottom: "8px"
                        }
                    },
                    "🔄 Prochaine étape"
                ),
                React.createElement(
                    "p",
                    {
                        style: {
                            fontSize: "15px",
                            color: "#a16207",
                            lineHeight: "1.5",
                            margin: "0"
                        }
                    },
                    `${recipientName} a été notifié(e) et va maintenant procéder à la signature du contrat. Vous recevrez une notification par email dès que le contrat sera complètement signé par toutes les parties.`
                )
            ]
        ),

        // Status tracking
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
                    href: `${siteUrl}/dashboard/contracts`,
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
                "Voir mes contrats →"
            )
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
                    "Vous recevez cet email car vous avez signé un contrat sur Doctonext."
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
                            href: `${siteUrl}/dashboard/contracts`,
                            style: {
                                color: "#6b7280",
                                textDecoration: "underline"
                            }
                        },
                        "Mes contrats"
                    )
                ])
            ]
        )
    )

    return EmailTemplate({
        heading: "Signature confirmée ✅",
        content,
        siteName: "Doctonext",
        baseUrl: siteUrl,
        imageUrl: `${siteUrl}/logo.png`
    })
}

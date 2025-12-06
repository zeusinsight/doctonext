import { EmailTemplate } from "@daveyplate/better-auth-ui/server";
import React from "react";

interface ContractCompletedEmailProps {
  recipientName: string;
  contractType: string;
  listingTitle: string;
  location: string;
  contractId: string;
  documentUrl?: string;
}

export function ContractCompletedEmail({
  recipientName,
  contractType,
  listingTitle,
  location,
  contractId,
  documentUrl,
}: ContractCompletedEmailProps) {
  // For emails, we need a public URL (not localhost)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";
  const siteUrl = appUrl.includes("localhost") ? "https://careevo.fr" : (appUrl || "https://careevo.fr");

  const getContractTypeLabel = (type: string) => {
    switch (type) {
      case "replacement":
        return "Contrat de Remplacement";
      case "transfer":
        return "Contrat de Cession";
      case "collaboration":
        return "Contrat de Collaboration";
      default:
        return type;
    }
  };

  const content = React.createElement(
    React.Fragment,
    null,
    React.createElement(
      "p",
      {
        style: {
          marginBottom: "24px",
          fontSize: "16px",
          color: "#333333",
        },
      },
      `Bonjour ${recipientName},`,
    ),
    React.createElement(
      "p",
      {
        style: {
          marginBottom: "24px",
          fontSize: "16px",
          color: "#333333",
        },
      },
      "Excellente nouvelle ! Le contrat a été signé par toutes les parties et est maintenant finalisé.",
    ),

    // Success completion box
    React.createElement(
      "div",
      {
        style: {
          backgroundColor: "#f0fdf4",
          padding: "24px",
          borderRadius: "12px",
          marginBottom: "28px",
          border: "2px solid #16a34a",
          borderLeft: "6px solid #16a34a",
        },
      },
      [
        React.createElement(
          "div",
          {
            style: {
              fontSize: "18px",
              fontWeight: "700",
              color: "#15803d",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
            },
          },
          "🎉 Contrat complètement signé",
        ),
        React.createElement(
          "p",
          {
            style: {
              fontSize: "16px",
              color: "#166534",
              lineHeight: "1.6",
              margin: "0 0 12px 0",
            },
          },
          `${getContractTypeLabel(contractType)} pour "${listingTitle}" - Toutes les signatures ont été recueillies avec succès.`,
        ),
        React.createElement(
          "div",
          {
            style: {
              fontSize: "14px",
              color: "#15803d",
              marginTop: "12px",
            },
          },
          `📍 ${location}`,
        ),
      ],
    ),

    // Next steps info
    React.createElement(
      "div",
      {
        style: {
          backgroundColor: "#eff6ff",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "24px",
          border: "1px solid #4a8dd9",
        },
      },
      [
        React.createElement(
          "div",
          {
            style: {
              fontSize: "16px",
              fontWeight: "600",
              color: "#206dc5",
              marginBottom: "8px",
            },
          },
          "📋 Prochaines étapes",
        ),
        React.createElement(
          "ul",
          {
            style: {
              fontSize: "15px",
              color: "#1a5ba3",
              lineHeight: "1.6",
              margin: "0",
              paddingLeft: "20px",
            },
          },
          [
            React.createElement(
              "li",
              { style: { marginBottom: "4px" } },
              "Le contrat signé est maintenant juridiquement contraignant",
            ),
            React.createElement(
              "li",
              { style: { marginBottom: "4px" } },
              "Vous pouvez télécharger une copie depuis votre tableau de bord",
            ),
            React.createElement(
              "li",
              { style: { marginBottom: "4px" } },
              "Conservez une copie pour vos dossiers",
            ),
            React.createElement(
              "li",
              null,
              "Contactez-nous en cas de questions",
            ),
          ],
        ),
      ],
    ),

    // Action buttons
    React.createElement(
      "div",
      {
        style: {
          textAlign: "center",
          marginBottom: "24px",
          display: "flex",
          gap: "16px",
          justifyContent: "center",
          flexWrap: "wrap",
        },
      },
      [
        React.createElement(
          "a",
          {
            href: `${siteUrl}/dashboard/contracts`,
            style: {
              display: "inline-block",
              backgroundColor: "#4a8dd9",
              color: "white",
              padding: "14px 28px",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "16px",
              fontWeight: "600",
              boxShadow: "0 2px 4px rgba(59, 130, 246, 0.1)",
            },
          },
          "Voir mes contrats",
        ),
        documentUrl
          ? React.createElement(
              "a",
              {
                href: `${siteUrl}/api/contracts/${contractId}/download`,
                style: {
                  display: "inline-block",
                  backgroundColor: "#059669",
                  color: "white",
                  padding: "14px 28px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontSize: "16px",
                  fontWeight: "600",
                  boxShadow: "0 2px 4px rgba(5, 150, 105, 0.1)",
                },
              },
              "Télécharger le PDF",
            )
          : null,
      ],
    ),

    // Legal notice
    React.createElement(
      "div",
      {
        style: {
          backgroundColor: "#fefce8",
          padding: "16px",
          borderRadius: "8px",
          marginBottom: "32px",
          border: "1px solid #eab308",
        },
      },
      [
        React.createElement(
          "p",
          {
            style: {
              fontSize: "14px",
              color: "#a16207",
              margin: "0",
              fontStyle: "italic",
            },
          },
          "⚖️ Ce contrat est maintenant juridiquement contraignant. Assurez-vous de respecter tous les termes et conditions convenus.",
        ),
      ],
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
          textAlign: "center",
        },
      },
      [
        React.createElement(
          "p",
          { style: { marginBottom: "12px" } },
          "Félicitations pour la finalisation de ce contrat sur Care Evo !",
        ),
        React.createElement("p", null, [
          React.createElement(
            "a",
            {
              href: `${siteUrl}/dashboard/contracts`,
              style: {
                color: "#6b7280",
                textDecoration: "underline",
              },
            },
            "Mes contrats",
          ),
          " | ",
          React.createElement(
            "a",
            {
              href: `${siteUrl}/dashboard/settings`,
              style: {
                color: "#6b7280",
                textDecoration: "underline",
              },
            },
            "Gérer mes notifications",
          ),
          " | ",
          React.createElement(
            "a",
            {
              href: `${siteUrl}/support`,
              style: {
                color: "#6b7280",
                textDecoration: "underline",
              },
            },
            "Support",
          ),
        ]),
      ],
    ),
  );

  return EmailTemplate({
    heading: "🎉 Contrat finalisé avec succès !",
    content,
    siteName: "Care Evo",
    baseUrl: siteUrl,
    imageUrl: `${siteUrl}/logo.png`,
    classNames: {
      image: "!rounded-none !w-auto !h-[40px]",
    },
  });
}

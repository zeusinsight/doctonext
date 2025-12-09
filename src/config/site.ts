const site_url = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const site = {
  name: "CareEvo",
  description: "CareEvo est une plateforme pour les professionnels de santé.",
  longDescription: "CareEvo est la plateforme de référence pour les professionnels de santé en France. Trouvez des opportunités de cession de cabinet médical, de remplacement ou de collaboration.",
  url: site_url,
  ogImage: `${site_url}/og.jpg`,
  logo: "/logo.svg",
  logoPng: "/logo.png",
  mailSupport: "noreply@careevo.fr",
  mailFrom: process.env.MAIL_FROM || "noreply@delicads.com",
  links: {
    twitter: "https://twitter.com/CareEvo",
    github: "https://github.com/CareEvo/CareEvo",
    linkedin: "https://www.linkedin.com/in/CareEvo/",
  },
  seo: {
    defaultTitle: "CareEvo | Plateforme pour Professionnels de Santé",
    titleTemplate: "%s | CareEvo",
    defaultKeywords: [
      "professionnel de santé",
      "cession cabinet médical",
      "remplacement médecin",
      "collaboration médecin",
      "cabinet dentaire",
      "pharmacie",
      "annonces médicales",
      "France",
    ],
    locale: "fr_FR",
    type: "website",
  },
} as const;

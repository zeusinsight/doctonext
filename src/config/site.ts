const site_url = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const site = {
  name: "CareEvo",
  description: "CareEvo est une plateforme pour les professionnels de santé.",
  url: site_url,
  ogImage: `${site_url}/og.jpg`,
  logo: "/logo.svg",
  mailSupport: "noreply@careevo.fr", // Support email address
  mailFrom: process.env.MAIL_FROM || "noreply@delicads.com", // Transactional email address
  links: {
    twitter: "https://twitter.com/CareEvo",
    github: "https://github.com/CareEvo/CareEvo",
    linkedin: "https://www.linkedin.com/in/CareEvo/",
  },
} as const;

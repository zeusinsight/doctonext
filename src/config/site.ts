const site_url = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const site = {
  name: "Doctonext",
  description: "Doctonext est une plateforme pour les professionnels de santé.",
  url: site_url,
  ogImage: `${site_url}/og.jpg`,
  logo: "/logo.svg",
  mailSupport: "hello@delicads.com", // Support email address
  mailFrom: process.env.MAIL_FROM || "noreply@delicads.com", // Transactional email address
  links: {
    twitter: "https://twitter.com/Doctonext",
    github: "https://github.com/Doctonext/Doctonext",
    linkedin: "https://www.linkedin.com/in/Doctonext/",
  }
} as const;
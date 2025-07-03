import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Indie Saas",
        short_name: "Indie Saas",
        description:
            "Boilerplate Template with Postgres, Drizzle, BetterAuth, shadcn/ui and Tanstack Query",
        start_url: "/",
        display: "standalone",
        background_color: "#fff",
        theme_color: "#fff",
        icons: [
            {
                src: "/favicon.ico",
                sizes: "any",
                type: "image/x-icon"
            }
        ]
    }
}

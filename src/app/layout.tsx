import { Providers } from "./providers"
import type { ReactNode } from "react"
import type { Metadata } from "next"
import "@/styles/globals.css"
import "leaflet/dist/leaflet.css"
import { Poppins } from "next/font/google"
import { OrganizationSchema, WebsiteSchema } from "@/components/seo"
import { site } from "@/config/site"

const poppins = Poppins({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-poppins',
})

export const metadata: Metadata = {
    metadataBase: new URL(site.url),
    title: {
        default: site.seo.defaultTitle,
        template: site.seo.titleTemplate,
    },
    description: site.longDescription,
    keywords: [...site.seo.defaultKeywords],
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
    publisher: site.name,
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        type: "website",
        locale: site.seo.locale,
        url: site.url,
        siteName: site.name,
        title: site.seo.defaultTitle,
        description: site.longDescription,
        images: [
            {
                url: site.ogImage,
                width: 1200,
                height: 630,
                alt: site.name,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: site.seo.defaultTitle,
        description: site.description,
        images: [site.ogImage],
        creator: "@CareEvo",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    verification: {
        // Add Google Search Console verification if available
        // google: "verification-code",
    },
}

export default function RootLayout({
    children
}: Readonly<{
    children: ReactNode
}>) {
    return (
        <html lang="fr" suppressHydrationWarning className={poppins.variable}>
            <head>
                <script async src="/seline.js" data-token="24cc7b65ecf3469" />
                <OrganizationSchema />
                <WebsiteSchema />
            </head>
            <body className="flex min-h-svh flex-col antialiased font-sans">
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}

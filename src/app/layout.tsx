import { Providers } from "./providers"
import type { ReactNode } from "react"
import "@/styles/globals.css"
import "leaflet/dist/leaflet.css"
import { Poppins } from "next/font/google"

const poppins = Poppins({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-poppins',
})

export default function RootLayout({
    children
}: Readonly<{
    children: ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning className={poppins.variable}>
            <head>
                <script async src="/seline.js" data-token="24cc7b65ecf3469" />
            </head>
            <body className="flex min-h-svh flex-col antialiased font-sans">
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}

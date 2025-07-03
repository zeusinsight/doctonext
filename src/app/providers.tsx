"use client"

import { AuthUIProvider } from "@daveyplate/better-auth-ui"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ThemeProvider } from "next-themes"
import type { ReactNode } from "react"
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from "sonner"
import { authClient } from "@/lib/auth-client"

export function Providers({ children }: { children: ReactNode }) {
    const router = useRouter()

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <AuthUIProvider
                authClient={authClient}
                navigate={router.push}
                replace={router.replace}
                apiKey={true}
                onSessionChange={() => {
                    router.refresh()
                }}
                settings={{
                    url: "/dashboard/settings"
                }}
                avatar={{
                    upload: async (file: File) => {
                        const formData = new FormData()
                        formData.append("avatar", file)

                        const res = await fetch("/api/uploadAvatar", {
                            method: "POST",
                            body: formData,
                        })

                        const { data } = await res.json()
                        return data.url
                    }
                }}
                Link={Link}
            >
                <NextTopLoader color="var(--primary)" showSpinner={false} />
                {children}
                <Toaster />
            </AuthUIProvider>
        </ThemeProvider>
    )
}

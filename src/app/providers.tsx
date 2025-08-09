"use client"

import { AuthUIProvider } from "@daveyplate/better-auth-ui"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ThemeProvider } from "next-themes"
import type { ReactNode } from "react"
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from "sonner"
import { authClient } from "@/lib/auth-client"
import { useUploadThing } from "@/lib/uploadthing"
import { authLocalizationFr } from "@/lib/auth-localization-fr"

export function Providers({ children }: { children: ReactNode }) {
    const router = useRouter()
    const { startUpload } = useUploadThing("avatarUploader")

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
            <AuthUIProvider
                authClient={authClient}
                navigate={router.push}
                replace={router.replace}
                apiKey={true}
                onSessionChange={(session) => {
                    // If no session (user logged out), redirect to home
                    if (!session?.user) {
                        window.location.href = "/"
                    } else {
                        router.refresh()
                    }
                }}
                settings={{
                    url: "/dashboard/settings"
                }}
                
                avatar={{
                    upload: async (file: File) => {
                        const uploadRes = await startUpload([file])
                        if (!uploadRes?.[0]) throw new Error("Upload failed")
                        return uploadRes[0].ufsUrl
                    }
                }}
                Link={Link}
                localization={authLocalizationFr}
            >
                <NextTopLoader color="var(--primary)" showSpinner={false} />
                {children}
                <Toaster />
            </AuthUIProvider>
        </ThemeProvider>
    )
}

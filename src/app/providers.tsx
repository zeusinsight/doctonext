"use client"

import { AuthUIProvider } from "@daveyplate/better-auth-ui"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ThemeProvider } from "next-themes"
import type { ReactNode } from "react"
import NextTopLoader from "nextjs-toploader"
import { Toaster } from "sonner"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { authClient } from "@/lib/auth-client"
import { useUploadThing } from "@/lib/uploadthing"
import { authLocalizationFr } from "@/lib/auth-localization-fr"
import { FavoritesProvider } from "@/contexts/favorites-context"
import { useState } from "react"

export function Providers({ children }: { children: ReactNode }) {
    const router = useRouter()
    const { startUpload } = useUploadThing("avatarUploader")

    // Create QueryClient instance - this ensures a stable instance across re-renders
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        refetchOnWindowFocus: true, // Refetch when user returns to the page
                        staleTime: 30 * 1000, // Data is fresh for 30 seconds
                        gcTime: 5 * 60 * 1000 // Keep cache for 5 minutes
                    }
                }
            })
    )

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
            >
                <AuthUIProvider
                    authClient={authClient}
                    navigate={router.push}
                    replace={router.replace}
                    apiKey={true}
                    onSessionChange={async () => {
                        // Get the current session
                        const session = await authClient.getSession()
                        // If no session (user logged out), redirect to home
                        if (!session?.data?.user) {
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
                            if (!uploadRes?.[0])
                                throw new Error("Upload failed")
                            return uploadRes[0].ufsUrl
                        }
                    }}
                    Link={Link}
                    localization={authLocalizationFr}
                >
                    <FavoritesProvider>
                        <NextTopLoader
                            color="var(--primary)"
                            showSpinner={false}
                        />
                        {children}
                        <Toaster />
                    </FavoritesProvider>
                </AuthUIProvider>
            </ThemeProvider>
        </QueryClientProvider>
    )
}

"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useState, type ReactNode } from "react"

interface QueryProviderProps {
    children: ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // Stale time for town data (5 minutes)
                        staleTime: 5 * 60 * 1000,
                        // Cache time for town data (10 minutes)
                        gcTime: 10 * 60 * 1000,
                        // Retry failed requests
                        retry: 2,
                        // Retry delay
                        retryDelay: (attemptIndex) =>
                            Math.min(1000 * 2 ** attemptIndex, 30000),
                        // Refetch on window focus for important data
                        refetchOnWindowFocus: false,
                        // Refetch on reconnect
                        refetchOnReconnect: true
                    },
                    mutations: {
                        retry: 1
                    }
                }
            })
    )

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {process.env.NODE_ENV === "development" && (
                <ReactQueryDevtools initialIsOpen={false} />
            )}
        </QueryClientProvider>
    )
}

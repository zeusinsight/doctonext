import { useState, useEffect } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import type { MapListing } from "@/components/map/listing-markers"
import type { PublicListing } from "@/types/listing"

interface ListingDataResponse {
    success: boolean
    data: {
        listings: PublicListing[]
    }
}

interface MapListingDataResponse {
    success: boolean
    data: {
        listings: MapListing[]
    }
}

// Hook for fetching regular listings
export function useListings() {
    return useQuery({
        queryKey: ["listings"],
        queryFn: async (): Promise<ListingDataResponse> => {
            const response = await fetch("/api/listings")
            if (!response.ok) {
                throw new Error(
                    `Failed to load listings: ${response.statusText}`
                )
            }
            const data = await response.json()
            if (!data.success) {
                throw new Error(data.error || "Failed to load listings")
            }
            return data
        },
        staleTime: 2 * 60 * 1000, // 2 minutes - listings change more frequently
        gcTime: 5 * 60 * 1000, // 5 minutes cache
        retry: 2,
        refetchOnWindowFocus: true, // Refetch when user returns to ensure fresh data
        refetchInterval: 5 * 60 * 1000 // Auto-refetch every 5 minutes
    })
}

// Hook for fetching map listings with filters
export function useMapListings(params: {
    type?: string
    specialty?: string
    region?: string
}) {
    const searchParams = new URLSearchParams()

    if (params.type) searchParams.append("type", params.type)
    if (params.specialty) searchParams.append("specialty", params.specialty)
    if (params.region) searchParams.append("region", params.region)

    const queryString = searchParams.toString()

    return useQuery({
        queryKey: ["map-listings", params],
        queryFn: async (): Promise<MapListingDataResponse> => {
            const url = `/api/map/listings${queryString ? `?${queryString}` : ""}`
            const response = await fetch(url)

            if (!response.ok) {
                throw new Error(
                    `Failed to load map listings: ${response.statusText}`
                )
            }

            const data = await response.json()
            if (!data.success) {
                throw new Error(data.error || "Failed to load map listings")
            }

            return data
        },
        staleTime: 60 * 1000, // 1 minute for map data
        gcTime: 3 * 60 * 1000, // 3 minutes cache
        retry: 2,
        // Enable background refetch for fresh map data
        refetchOnWindowFocus: true,
        refetchInterval: 2 * 60 * 1000 // Auto-refetch every 2 minutes
    })
}

// Hook for prefetching listings
export function usePrefetchListings() {
    const queryClient = useQueryClient()

    const prefetchListings = () => {
        queryClient.prefetchQuery({
            queryKey: ["listings"],
            queryFn: async () => {
                const response = await fetch("/api/listings")
                if (!response.ok) throw new Error("Failed to prefetch listings")
                return response.json()
            },
            staleTime: 2 * 60 * 1000
        })
    }

    const prefetchMapListings = (params: {
        type?: string
        specialty?: string
        region?: string
    }) => {
        const searchParams = new URLSearchParams()

        if (params.type) searchParams.append("type", params.type)
        if (params.specialty) searchParams.append("specialty", params.specialty)
        if (params.region) searchParams.append("region", params.region)

        const queryString = searchParams.toString()

        queryClient.prefetchQuery({
            queryKey: ["map-listings", params],
            queryFn: async () => {
                const url = `/api/map/listings${queryString ? `?${queryString}` : ""}`
                const response = await fetch(url)
                if (!response.ok)
                    throw new Error("Failed to prefetch map listings")
                return response.json()
            },
            staleTime: 60 * 1000
        })
    }

    return { prefetchListings, prefetchMapListings }
}

// Hook for invalidating listing data
export function useInvalidateListingData() {
    const queryClient = useQueryClient()

    const invalidateListings = () => {
        queryClient.invalidateQueries({
            queryKey: ["listings"],
            type: "all"
        })
    }

    const invalidateMapListings = () => {
        queryClient.invalidateQueries({
            queryKey: ["map-listings"],
            type: "all"
        })
    }

    const invalidateAllListings = () => {
        queryClient.invalidateQueries({
            queryKey: ["listings"],
            type: "all"
        })
        queryClient.invalidateQueries({
            queryKey: ["map-listings"],
            type: "all"
        })
    }

    return { invalidateListings, invalidateMapListings, invalidateAllListings }
}

// Hook for search functionality with debouncing
export function useSearchListings(
    query: string,
    filters: any,
    debounceMs = 300
) {
    const [debouncedQuery, setDebouncedQuery] = useState(query)

    // Debounce the search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query)
        }, debounceMs)

        return () => clearTimeout(timer)
    }, [query, debounceMs])

    return useQuery({
        queryKey: ["search-listings", debouncedQuery, filters],
        queryFn: async () => {
            if (!debouncedQuery.trim() && !Object.keys(filters).length) {
                return { success: true, data: { listings: [] } }
            }

            const searchParams = new URLSearchParams()
            if (debouncedQuery.trim())
                searchParams.append("search", debouncedQuery)

            Object.entries(filters).forEach(([key, value]) => {
                if (value && (Array.isArray(value) ? value.length > 0 : true)) {
                    if (Array.isArray(value)) {
                        value.forEach((v) => searchParams.append(key, v))
                    } else {
                        searchParams.append(key, String(value))
                    }
                }
            })

            const response = await fetch(
                `/api/listings/search?${searchParams.toString()}`
            )
            if (!response.ok) throw new Error("Search failed")
            return response.json()
        },
        enabled:
            debouncedQuery.trim().length > 0 || Object.keys(filters).length > 0,
        staleTime: 30 * 1000, // 30 seconds for search results
        gcTime: 2 * 60 * 1000 // 2 minutes cache
    })
}

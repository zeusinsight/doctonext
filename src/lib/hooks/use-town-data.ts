import { useQuery, useQueryClient } from "@tanstack/react-query"
import type {
    MedicalProfession,
    ZonageLevel
} from "@/lib/services/town-density-types"

interface TownDensityData {
    code: string
    name: string
    zonage: ZonageLevel
    profession: MedicalProfession
    boundary: {
        name: string
        type: "Polygon" | "MultiPolygon"
        coordinates: number[][][] | number[][][][]
    }
    color: string
    densityScore: number
    label: string
}

interface TownDataResponse {
    success: boolean
    data: {
        profession: MedicalProfession
        towns: TownDensityData[]
        count: number
        meta?: {
            requestedLimit: number
            actualLimit: number
            note?: string
        }
    }
}

// Custom hook for fetching town density data
export function useTownData(profession: MedicalProfession, limit = 50000) {
    return useQuery({
        queryKey: ["town-density", profession, limit],
        queryFn: async (): Promise<TownDataResponse> => {
            const response = await fetch(
                `/api/map/town-density?profession=${profession}&limit=${limit}`
            )

            if (!response.ok) {
                throw new Error(
                    `Failed to load town data: ${response.statusText}`
                )
            }

            const data = await response.json()

            if (!data.success) {
                throw new Error(data.error || "Failed to load town data")
            }

            return data
        },
        staleTime: 10 * 60 * 1000, // 10 minutes - town data doesn't change often
        gcTime: 30 * 60 * 1000, // 30 minutes cache
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
        // Enable background refetch for data freshness
        refetchOnWindowFocus: false,
        refetchOnReconnect: true
    })
}

// Hook for prefetching town data
export function usePrefetchTownData() {
    const queryClient = useQueryClient()

    const prefetchTownData = (profession: MedicalProfession, limit = 50000) => {
        queryClient.prefetchQuery({
            queryKey: ["town-density", profession, limit],
            queryFn: async (): Promise<TownDataResponse> => {
                const response = await fetch(
                    `/api/map/town-density?profession=${profession}&limit=${limit}`
                )
                if (!response.ok)
                    throw new Error("Failed to prefetch town data")
                return response.json()
            },
            staleTime: 10 * 60 * 1000
        })
    }

    return { prefetchTownData }
}

// Hook for town statistics
export function useTownStats(profession: MedicalProfession) {
    return useQuery({
        queryKey: ["town-stats", profession],
        queryFn: async () => {
            const response = await fetch(
                `/api/map/town-density?profession=${profession}&stats=true`
            )
            if (!response.ok) throw new Error("Failed to load town stats")
            return response.json()
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 15 * 60 * 1000 // 15 minutes
    })
}

// Hook for filtered towns by zonage
export function useTownsByZonage(
    profession: MedicalProfession,
    zonage: ZonageLevel,
    limit = 1000
) {
    return useQuery({
        queryKey: ["towns-by-zonage", profession, zonage, limit],
        queryFn: async () => {
            const response = await fetch(
                `/api/map/town-density?profession=${profession}&zonage=${zonage}&limit=${limit}`
            )
            if (!response.ok) throw new Error("Failed to load towns by zonage")
            return response.json()
        },
        staleTime: 10 * 60 * 1000,
        enabled: !!zonage // Only run if zonage is provided
    })
}

// Hook for invalidating town data cache
export function useInvalidateTownData() {
    const queryClient = useQueryClient()

    const invalidateAllTownData = () => {
        queryClient.invalidateQueries({
            queryKey: ["town-density"],
            type: "all"
        })
    }

    const invalidateTownData = (profession: MedicalProfession) => {
        queryClient.invalidateQueries({
            queryKey: ["town-density", profession],
            type: "all"
        })
    }

    return { invalidateAllTownData, invalidateTownData }
}

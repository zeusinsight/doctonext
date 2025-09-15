// IndexedDB caching disabled for build compatibility
// import { openDB, type DBSchema, type IDBPDatabase } from 'idb'

// interface CacheSchema extends DBSchema {
//   townBoundaries: {
//     key: string // profession
//     value: {
//       profession: string
//       data: any
//       timestamp: number
//       version: number
//     }
//   }
//   simplifiedBoundaries: {
//     key: string // `${profession}_${zoomLevel}`
//     value: {
//       key: string
//       data: any
//       timestamp: number
//       zoomLevel: number
//     }
//   }
//   listings: {
//     key: string // filter hash
//     value: {
//       filters: any
//       data: any
//       timestamp: number
//     }
//   }
// }

class IndexedDBCache {
    private db: any = null
    private dbName = "doctonext-map-cache"
    private version = 1

    async initialize(): Promise<void> {
        // Disabled for build compatibility - can be re-enabled with proper schema
        console.log("IndexedDB cache disabled for build compatibility")
    }

    async storeTownBoundaries(profession: string, data: any): Promise<void> {
        // Disabled
    }

    async getTownBoundaries(
        profession: string,
        maxAge = 30 * 60 * 1000
    ): Promise<any | null> {
        return null
    }

    async storeSimplifiedBoundaries(
        profession: string,
        zoomLevel: number,
        data: any
    ): Promise<void> {
        // Disabled
    }

    async getSimplifiedBoundaries(
        profession: string,
        zoomLevel: number,
        maxAge = 60 * 60 * 1000
    ): Promise<any | null> {
        return null
    }

    async storeListings(filters: any, data: any): Promise<void> {
        // Disabled
    }

    async getListings(
        filters: any,
        maxAge = 5 * 60 * 1000
    ): Promise<any | null> {
        return null
    }

    async clearAll(): Promise<void> {
        // Disabled
    }

    async clearExpired(): Promise<void> {
        // Disabled
    }

    private hashObject(obj: any): string {
        const str = JSON.stringify(obj, Object.keys(obj).sort())
        let hash = 0
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i)
            hash = (hash << 5) - hash + char
            hash = hash & hash
        }
        return hash.toString()
    }

    async getStorageSize(): Promise<{
        estimated: number
        quota: number
    } | null> {
        if (!navigator.storage?.estimate) return null

        try {
            const estimate = await navigator.storage.estimate()
            return {
                estimated: estimate.usage || 0,
                quota: estimate.quota || 0
            }
        } catch (error) {
            return null
        }
    }
}

// Singleton instance
export const indexedDBCache = new IndexedDBCache()

// Initialize on module load
if (typeof window !== "undefined") {
    indexedDBCache.initialize().catch(console.warn)
}

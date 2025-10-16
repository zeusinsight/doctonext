"use client"

import { useState, useEffect } from "react"

const SEARCH_HISTORY_KEY = "careevo-search-history"
const MAX_HISTORY_ITEMS = 10

export interface SearchHistoryItem {
    query: string
    timestamp: number
}

export function useSearchHistory() {
    const [history, setHistory] = useState<SearchHistoryItem[]>([])

    // Load history from localStorage on mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem(SEARCH_HISTORY_KEY)
            if (stored) {
                try {
                    const parsed = JSON.parse(stored) as SearchHistoryItem[]
                    setHistory(parsed)
                } catch (error) {
                    console.error("Failed to parse search history:", error)
                }
            }
        }
    }, [])

    // Save history to localStorage whenever it changes
    const saveHistory = (newHistory: SearchHistoryItem[]) => {
        if (typeof window !== "undefined") {
            localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory))
            setHistory(newHistory)
        }
    }

    // Add a new search query to history
    const addToHistory = (query: string) => {
        if (!query.trim()) return

        const newItem: SearchHistoryItem = {
            query: query.trim(),
            timestamp: Date.now()
        }

        // Remove duplicate if exists and add new item at the beginning
        const filtered = history.filter(
            (item) => item.query.toLowerCase() !== query.trim().toLowerCase()
        )

        const newHistory = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS)
        saveHistory(newHistory)
    }

    // Remove a specific item from history
    const removeFromHistory = (query: string) => {
        const newHistory = history.filter(
            (item) => item.query.toLowerCase() !== query.toLowerCase()
        )
        saveHistory(newHistory)
    }

    // Clear all history
    const clearHistory = () => {
        saveHistory([])
    }

    // Get search suggestions based on current input
    const getSuggestions = (input: string): SearchHistoryItem[] => {
        if (!input.trim()) return history.slice(0, 5) // Return recent 5 if no input

        const searchTerm = input.toLowerCase()
        return history
            .filter((item) => item.query.toLowerCase().includes(searchTerm))
            .slice(0, 5)
    }

    return {
        history,
        addToHistory,
        removeFromHistory,
        clearHistory,
        getSuggestions
    }
}

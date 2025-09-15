"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Clock, X, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSearchHistory } from "@/hooks/use-search-history"

interface SearchWithHistoryProps {
    value: string
    onChange: (value: string) => void
    onSubmit: (value: string) => void
    placeholder?: string
    className?: string
    inputClassName?: string
    showIcon?: boolean
}

export function SearchWithHistory({
    value,
    onChange,
    onSubmit,
    placeholder = "Rechercher...",
    className,
    inputClassName,
    showIcon = true
}: SearchWithHistoryProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const { getSuggestions, addToHistory, removeFromHistory } =
        useSearchHistory()

    const suggestions = getSuggestions(value)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () =>
            document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSubmit = (searchValue: string) => {
        if (searchValue.trim()) {
            addToHistory(searchValue)
            onSubmit(searchValue)
            setIsOpen(false)
            setSelectedIndex(-1)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowDown") {
            e.preventDefault()
            setSelectedIndex((prev) =>
                prev < suggestions.length - 1 ? prev + 1 : prev
            )
        } else if (e.key === "ArrowUp") {
            e.preventDefault()
            setSelectedIndex((prev) => (prev > -1 ? prev - 1 : -1))
        } else if (e.key === "Enter") {
            e.preventDefault()
            if (selectedIndex >= 0 && suggestions[selectedIndex]) {
                const selectedQuery = suggestions[selectedIndex].query
                onChange(selectedQuery)
                handleSubmit(selectedQuery)
            } else {
                handleSubmit(value)
            }
        } else if (e.key === "Escape") {
            setIsOpen(false)
            setSelectedIndex(-1)
        }
    }

    const handleSuggestionClick = (query: string) => {
        onChange(query)
        handleSubmit(query)
    }

    const handleRemoveSuggestion = (e: React.MouseEvent, query: string) => {
        e.stopPropagation()
        removeFromHistory(query)
    }

    return (
        <div className={cn("relative", className)}>
            {showIcon && (
                <Search className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 z-10 h-4 w-4 text-gray-500" />
            )}
            <Input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => {
                    onChange(e.target.value)
                    setIsOpen(true)
                    setSelectedIndex(-1)
                }}
                onFocus={() => setIsOpen(true)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className={cn(showIcon && "pl-10", inputClassName)}
            />

            {isOpen && suggestions.length > 0 && (
                <div
                    ref={dropdownRef}
                    className="absolute top-full right-0 left-0 z-50 mt-1 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg"
                >
                    <div className="py-1">
                        {suggestions.map((item, index) => (
                            <div
                                key={item.timestamp}
                                className={cn(
                                    "flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-gray-100",
                                    selectedIndex === index && "bg-gray-100"
                                )}
                                onClick={() =>
                                    handleSuggestionClick(item.query)
                                }
                            >
                                <div className="flex flex-1 items-center gap-2">
                                    <Clock className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                                    <span className="truncate text-gray-700 text-sm">
                                        {item.query}
                                    </span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 hover:bg-gray-200"
                                    onClick={(e) =>
                                        handleRemoveSuggestion(e, item.query)
                                    }
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

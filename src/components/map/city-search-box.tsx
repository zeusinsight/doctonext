"use client"

import { useState, useEffect } from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "cmdk"
import { Search, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { searchCities, type CityInfo } from "@/lib/data/major-cities"

interface CitySearchBoxProps {
  onCitySelect: (city: CityInfo & { code: string }) => void
  className?: string
  placeholder?: string
}

export function CitySearchBox({ onCitySelect, className, placeholder = "Rechercher une ville..." }: CitySearchBoxProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [cities, setCities] = useState<Array<CityInfo & { code: string }>>([])

  // Search cities when value changes
  useEffect(() => {
    if (value.length > 0) {
      const results = searchCities(value)
      setCities(results)
      setOpen(results.length > 0)
    } else {
      setCities([])
      setOpen(false)
    }
  }, [value])

  const handleCitySelect = (city: CityInfo & { code: string }) => {
    setValue("")
    setOpen(false)
    onCitySelect(city)
  }

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1: return "Grande ville"
      case 2: return "Ville régionale"
      case 3: return "Chef-lieu"
      default: return "Commune"
    }
  }

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return "text-blue-600"
      case 2: return "text-green-600"
      case 3: return "text-gray-600"
      default: return "text-gray-500"
    }
  }

  return (
    <div className={cn("relative", className)}>
      <Command className="rounded-lg border shadow-lg bg-white/95 backdrop-blur-sm">
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <CommandInput
            placeholder={placeholder}
            value={value}
            onValueChange={setValue}
            className="flex h-10 w-full rounded-md bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            onFocus={() => {
              if (cities.length > 0) {
                setOpen(true)
              }
            }}
            onBlur={() => {
              // Delay closing to allow for click events
              setTimeout(() => setOpen(false), 200)
            }}
          />
        </div>

        {open && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1">
            <CommandList className="max-h-[300px] overflow-y-auto rounded-md border bg-white/95 backdrop-blur-sm shadow-lg">
              {cities.length === 0 ? (
                <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                  Aucune ville trouvée
                </CommandEmpty>
              ) : (
                <CommandGroup>
                  {cities.map((city) => (
                    <CommandItem
                      key={city.code}
                      value={city.name}
                      onSelect={() => handleCitySelect(city)}
                      className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-50/80"
                    >
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                        <div>
                          <div className="font-medium">{city.name}</div>
                          <div className={cn("text-xs", getPriorityColor(city.priority))}>
                            {getPriorityLabel(city.priority)}
                          </div>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </div>
        )}
      </Command>
    </div>
  )
}
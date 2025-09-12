"use client"

import { useState } from "react"
import { Filter, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { type ZonageLevel, getZonageLabel, getZonageColor } from "@/lib/services/town-density-types"

const ZONAGE_OPTIONS: { level: ZonageLevel; priority: number }[] = [
  { level: '1_Tres_sous_dotee', priority: 1 },
  { level: '2_Sous_dotee', priority: 2 },
  { level: '3_intermediaire', priority: 3 },
  { level: '4_Tres_dotee', priority: 4 },
  { level: '5_Sur_dotee', priority: 5 },
  { level: '5b_Non_prioritaire', priority: 6 }
]

interface ZonageFilterProps {
  selectedZonages: ZonageLevel[]
  onZonageChange: (zonages: ZonageLevel[]) => void
  className?: string
}

export function ZonageFilter({
  selectedZonages,
  onZonageChange,
  className
}: ZonageFilterProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleZonage = (zonage: ZonageLevel) => {
    const newSelection = selectedZonages.includes(zonage)
      ? selectedZonages.filter(z => z !== zonage)
      : [...selectedZonages, zonage]
    
    onZonageChange(newSelection)
  }

  const clearAll = () => {
    onZonageChange([])
  }

  const selectAll = () => {
    onZonageChange(ZONAGE_OPTIONS.map(opt => opt.level))
  }

  return (
    <div className={cn("w-full max-w-sm", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between bg-white/95 backdrop-blur-sm border border-gray-200 shadow-sm relative z-[1002]"
          >
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-blue-600" />
              <span className="text-sm">
                {selectedZonages.length === 0 
                  ? "Filtrer par zonage"
                  : `${selectedZonages.length} zonage${selectedZonages.length > 1 ? 's' : ''} sélectionné${selectedZonages.length > 1 ? 's' : ''}`
                }
              </span>
            </div>
            {selectedZonages.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {selectedZonages.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-80 p-0 z-[1003] bg-white border shadow-lg" 
          sideOffset={5}
        >
          <div className="p-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Filtrer par zonage médical</h4>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="text-xs h-7 px-2"
                >
                  Aucun
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={selectAll}
                  className="text-xs h-7 px-2"
                >
                  Tous
                </Button>
              </div>
            </div>
          </div>
          
          <div className="p-2 space-y-1 max-h-60 overflow-y-auto">
            {ZONAGE_OPTIONS.map((option) => {
              const isSelected = selectedZonages.includes(option.level)
              const color = getZonageColor(option.level)
              const label = getZonageLabel(option.level)
              
              return (
                <div
                  key={option.level}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors",
                    "hover:bg-gray-50",
                    isSelected && "bg-blue-50"
                  )}
                  onClick={() => toggleZonage(option.level)}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <div
                      className="w-4 h-4 rounded-sm border border-gray-300"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                  
                  {isSelected && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </div>
              )
            })}
          </div>
          
          <div className="p-3 border-t border-gray-100 bg-gray-50">
            <div className="text-xs text-gray-600 space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-green-500" />
                <span>Zones sous-dotées (opportunités)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-orange-500" />
                <span>Zones équilibrées</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-red-500" />
                <span>Zones surdotées</span>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
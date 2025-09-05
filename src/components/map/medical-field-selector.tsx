"use client"

import { Activity } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getAvailableMedicalFields, MEDICAL_FIELD_NAMES, getMedicalFieldStats } from "@/lib/medical-density-utils"

interface MedicalFieldSelectorProps {
  selectedField: string
  onFieldChange: (field: string) => void
  className?: string
}

export function MedicalFieldSelector({
  selectedField,
  onFieldChange,
  className
}: MedicalFieldSelectorProps) {
  const availableFields = getAvailableMedicalFields()

  return (
    <div className={cn("w-full max-w-sm", className)}>
      <Select value={selectedField} onValueChange={onFieldChange}>
        <SelectTrigger className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-sm relative z-[1002]">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-600" />
            <SelectValue placeholder="Sélectionner un domaine médical..." />
          </div>
        </SelectTrigger>
        <SelectContent className="max-h-64 z-[1003] bg-white border shadow-lg" sideOffset={5}>
          {availableFields.map((field) => {
            const stats = getMedicalFieldStats(field)
            return (
              <SelectItem key={field} value={field} className="py-3">
                <div className="flex flex-col w-full">
                  <span className="font-medium">
                    {MEDICAL_FIELD_NAMES[field]}
                  </span>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                    <span>
                      {stats.totalProfessionals.toLocaleString()} professionnels
                    </span>
                    <span>
                      {stats.averageDensity.toFixed(1)}/10k hab.
                    </span>
                  </div>
                </div>
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  )
}
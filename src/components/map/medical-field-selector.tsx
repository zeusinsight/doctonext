"use client"

import { Activity, Users, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import type { MedicalProfession } from "@/lib/services/town-density-types"

// Available medical professions from our CSV data
const MEDICAL_PROFESSIONS: Record<
    MedicalProfession,
    { name: string; icon: React.ReactNode }
> = {
    "chirurgiens-dentistes": {
        name: "Chirurgiens-Dentistes",
        icon: <Users className="h-4 w-4" />
    },
    infirmier: {
        name: "Infirmiers",
        icon: <Activity className="h-4 w-4" />
    },
    "masseurs-kinésithérapeutes": {
        name: "Masseurs-Kinésithérapeutes",
        icon: <Activity className="h-4 w-4" />
    },
    orthophonistes: {
        name: "Orthophonistes",
        icon: <Users className="h-4 w-4" />
    },
    "sages-femmes": {
        name: "Sages-femmes",
        icon: <Activity className="h-4 w-4" />
    }
}

interface MedicalFieldSelectorProps {
    selectedProfession: MedicalProfession
    onProfessionChange: (profession: MedicalProfession) => void
    className?: string
    showStats?: boolean
}

export function MedicalFieldSelector({
    selectedProfession,
    onProfessionChange,
    className,
    showStats = false
}: MedicalFieldSelectorProps) {
    const professions = Object.keys(MEDICAL_PROFESSIONS) as MedicalProfession[]

    return (
        <div className={cn("w-full max-w-sm", className)}>
            <Select
                value={selectedProfession}
                onValueChange={onProfessionChange}
            >
                <SelectTrigger className="relative z-[1002] border border-gray-200 bg-white/95 shadow-sm backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <SelectValue placeholder="Sélectionner une profession..." />
                    </div>
                </SelectTrigger>
                <SelectContent
                    className="z-[1003] max-h-64 border bg-white shadow-lg"
                    sideOffset={5}
                >
                    {professions.map((profession) => {
                        const professionInfo = MEDICAL_PROFESSIONS[profession]
                        return (
                            <SelectItem
                                key={profession}
                                value={profession}
                                className="py-3"
                            >
                                <div className="flex w-full items-center gap-3">
                                    <div className="text-blue-600">
                                        {professionInfo.icon}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-medium">
                                            {professionInfo.name}
                                        </span>
                                        {showStats && (
                                            <div className="mt-1 flex items-center gap-4 text-muted-foreground text-xs">
                                                <span>~35,000 communes</span>
                                                <span>Densité variable</span>
                                            </div>
                                        )}
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

// Export the medical professions for use in other components
export { MEDICAL_PROFESSIONS, type MedicalProfession }

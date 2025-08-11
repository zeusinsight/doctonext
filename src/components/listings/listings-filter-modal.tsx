"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { SPECIALTIES, FRENCH_REGIONS } from "@/types/listing"

export interface ListingFilters {
    specialties: string[]
    regions: string[]
    listingTypes: string[]
    collaborationTypes: string[]
    isBoostPlus?: boolean
}

interface ListingsFilterModalProps {
    isOpen: boolean
    onClose: () => void
    filters: ListingFilters
    onFiltersChange: (filters: ListingFilters) => void
}

const LISTING_TYPES = [
    { value: "transfer", label: "Cession" },
    { value: "replacement", label: "Remplacement" },
    { value: "collaboration", label: "Collaboration" }
]

const COLLABORATION_TYPES = [
    { value: "association", label: "Association" },
    { value: "partnership", label: "Partenariat" },
    { value: "group_practice", label: "Cabinet de groupe" },
    { value: "shared_space", label: "Espace partagé" }
]

export function ListingsFilterModal({
    isOpen,
    onClose,
    filters,
    onFiltersChange
}: ListingsFilterModalProps) {
    const [localFilters, setLocalFilters] = useState<ListingFilters>(filters)

    useEffect(() => {
        setLocalFilters(filters)
    }, [filters])

    const handleSpecialtyToggle = (specialty: string) => {
        setLocalFilters(prev => ({
            ...prev,
            specialties: prev.specialties.includes(specialty)
                ? prev.specialties.filter(s => s !== specialty)
                : [...prev.specialties, specialty]
        }))
    }

    const handleRegionToggle = (region: string) => {
        setLocalFilters(prev => ({
            ...prev,
            regions: prev.regions.includes(region)
                ? prev.regions.filter(r => r !== region)
                : [...prev.regions, region]
        }))
    }

    const handleListingTypeToggle = (type: string) => {
        setLocalFilters(prev => ({
            ...prev,
            listingTypes: prev.listingTypes.includes(type)
                ? prev.listingTypes.filter(t => t !== type)
                : [...prev.listingTypes, type]
        }))
    }

    const handleCollaborationTypeToggle = (type: string) => {
        setLocalFilters(prev => ({
            ...prev,
            collaborationTypes: prev.collaborationTypes.includes(type)
                ? prev.collaborationTypes.filter(t => t !== type)
                : [...prev.collaborationTypes, type]
        }))
    }

    const handleBoostPlusToggle = (checked: boolean) => {
        setLocalFilters(prev => ({
            ...prev,
            isBoostPlus: checked ? true : undefined
        }))
    }

    const handleApply = () => {
        onFiltersChange(localFilters)
        onClose()
    }

    const handleClear = () => {
        const emptyFilters: ListingFilters = {
            specialties: [],
            regions: [],
            listingTypes: [],
            collaborationTypes: [],
            isBoostPlus: undefined
        }
        setLocalFilters(emptyFilters)
        onFiltersChange(emptyFilters)
        onClose()
    }

    const activeFiltersCount = 
        localFilters.specialties.length +
        localFilters.regions.length +
        localFilters.listingTypes.length +
        localFilters.collaborationTypes.length +
        (localFilters.isBoostPlus ? 1 : 0)

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Filtrer les annonces</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Listing Types */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Type d'annonce</Label>
                        <div className="flex flex-wrap gap-2">
                            {LISTING_TYPES.map((type) => (
                                <Badge
                                    key={type.value}
                                    variant={localFilters.listingTypes.includes(type.value) ? "default" : "outline"}
                                    className="cursor-pointer hover:bg-primary/80"
                                    onClick={() => handleListingTypeToggle(type.value)}
                                >
                                    {type.label}
                                    {localFilters.listingTypes.includes(type.value) && (
                                        <X className="w-3 h-3 ml-1" />
                                    )}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Collaboration Types */}
                    {localFilters.listingTypes.includes("collaboration") && (
                        <div className="space-y-3">
                            <Label className="text-sm font-medium">Types de collaboration</Label>
                            <div className="flex flex-wrap gap-2">
                                {COLLABORATION_TYPES.map((type) => (
                                    <Badge
                                        key={type.value}
                                        variant={localFilters.collaborationTypes.includes(type.value) ? "default" : "outline"}
                                        className="cursor-pointer hover:bg-primary/80"
                                        onClick={() => handleCollaborationTypeToggle(type.value)}
                                    >
                                        {type.label}
                                        {localFilters.collaborationTypes.includes(type.value) && (
                                            <X className="w-3 h-3 ml-1" />
                                        )}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Specialties */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Spécialités</Label>
                        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded p-3">
                            {SPECIALTIES.map((specialty) => (
                                <div key={specialty} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`specialty-${specialty}`}
                                        checked={localFilters.specialties.includes(specialty)}
                                        onCheckedChange={() => handleSpecialtyToggle(specialty)}
                                    />
                                    <Label
                                        htmlFor={`specialty-${specialty}`}
                                        className="text-sm cursor-pointer"
                                    >
                                        {specialty}
                                    </Label>
                                </div>
                            ))}
                        </div>
                        {localFilters.specialties.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {localFilters.specialties.map((specialty) => (
                                    <Badge
                                        key={specialty}
                                        variant="secondary"
                                        className="text-xs cursor-pointer"
                                        onClick={() => handleSpecialtyToggle(specialty)}
                                    >
                                        {specialty}
                                        <X className="w-3 h-3 ml-1" />
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Regions */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Régions</Label>
                        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded p-3">
                            {FRENCH_REGIONS.map((region) => (
                                <div key={region} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`region-${region}`}
                                        checked={localFilters.regions.includes(region)}
                                        onCheckedChange={() => handleRegionToggle(region)}
                                    />
                                    <Label
                                        htmlFor={`region-${region}`}
                                        className="text-sm cursor-pointer"
                                    >
                                        {region}
                                    </Label>
                                </div>
                            ))}
                        </div>
                        {localFilters.regions.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {localFilters.regions.map((region) => (
                                    <Badge
                                        key={region}
                                        variant="secondary"
                                        className="text-xs cursor-pointer"
                                        onClick={() => handleRegionToggle(region)}
                                    >
                                        {region}
                                        <X className="w-3 h-3 ml-1" />
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Boost Plus */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="boost-plus"
                            checked={localFilters.isBoostPlus === true}
                            onCheckedChange={handleBoostPlusToggle}
                        />
                        <Label htmlFor="boost-plus" className="text-sm cursor-pointer">
                            Afficher uniquement les annonces Boost+
                        </Label>
                    </div>
                </div>

                <DialogFooter>
                    <div className="flex items-center justify-between w-full">
                        <div className="text-sm text-muted-foreground">
                            {activeFiltersCount > 0 && (
                                <span>{activeFiltersCount} filtre(s) actif(s)</span>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={handleClear}>
                                Effacer tout
                            </Button>
                            <Button onClick={handleApply}>
                                Appliquer les filtres
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
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
    DialogFooter
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { X, Bell, Check } from "lucide-react"
import { SPECIALTIES, FRENCH_REGIONS } from "@/types/listing"
import { createSavedSearch } from "@/lib/actions/saved-searches"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"

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
    const [showSaveSearch, setShowSaveSearch] = useState(false)
    const [searchName, setSearchName] = useState("")
    const [emailAlerts, setEmailAlerts] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const { data: session } = authClient.useSession()

    useEffect(() => {
        setLocalFilters(filters)
    }, [filters])

    const handleSpecialtyToggle = (specialty: string) => {
        setLocalFilters((prev) => ({
            ...prev,
            specialties: prev.specialties.includes(specialty)
                ? prev.specialties.filter((s) => s !== specialty)
                : [...prev.specialties, specialty]
        }))
    }

    const handleRegionToggle = (region: string) => {
        setLocalFilters((prev) => ({
            ...prev,
            regions: prev.regions.includes(region)
                ? prev.regions.filter((r) => r !== region)
                : [...prev.regions, region]
        }))
    }

    const handleListingTypeToggle = (type: string) => {
        setLocalFilters((prev) => ({
            ...prev,
            listingTypes: prev.listingTypes.includes(type)
                ? prev.listingTypes.filter((t) => t !== type)
                : [...prev.listingTypes, type]
        }))
    }

    const handleCollaborationTypeToggle = (type: string) => {
        setLocalFilters((prev) => ({
            ...prev,
            collaborationTypes: prev.collaborationTypes.includes(type)
                ? prev.collaborationTypes.filter((t) => t !== type)
                : [...prev.collaborationTypes, type]
        }))
    }

    const handleBoostPlusToggle = (checked: boolean) => {
        setLocalFilters((prev) => ({
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

    const handleSaveSearch = async () => {
        if (!searchName.trim()) {
            toast.error("Veuillez entrer un nom pour votre recherche")
            return
        }

        if (!session?.user) {
            toast.error(
                "Vous devez être connecté pour sauvegarder une recherche"
            )
            return
        }

        setIsSaving(true)
        try {
            const result = await createSavedSearch(
                searchName,
                localFilters,
                emailAlerts
            )
            if (result.success) {
                toast.success("Recherche sauvegardée avec succès")
                setShowSaveSearch(false)
                setSearchName("")
                handleApply()
            } else {
                toast.error(result.error || "Erreur lors de la sauvegarde")
            }
        } catch (error) {
            toast.error("Erreur lors de la sauvegarde de la recherche")
        } finally {
            setIsSaving(false)
        }
    }

    const activeFiltersCount =
        localFilters.specialties.length +
        localFilters.regions.length +
        localFilters.listingTypes.length +
        localFilters.collaborationTypes.length +
        (localFilters.isBoostPlus ? 1 : 0)

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Filtrer les annonces</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Listing Types */}
                    <div className="space-y-3">
                        <Label className="font-medium text-sm">
                            Type d'annonce
                        </Label>
                        <div className="flex flex-wrap gap-2">
                            {LISTING_TYPES.map((type) => (
                                <Badge
                                    key={type.value}
                                    variant={
                                        localFilters.listingTypes.includes(
                                            type.value
                                        )
                                            ? "default"
                                            : "outline"
                                    }
                                    className="cursor-pointer hover:bg-primary/80"
                                    onClick={() =>
                                        handleListingTypeToggle(type.value)
                                    }
                                >
                                    {type.label}
                                    {localFilters.listingTypes.includes(
                                        type.value
                                    ) && <X className="ml-1 h-3 w-3" />}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Collaboration Types */}
                    {localFilters.listingTypes.includes("collaboration") && (
                        <div className="space-y-3">
                            <Label className="font-medium text-sm">
                                Types de collaboration
                            </Label>
                            <div className="flex flex-wrap gap-2">
                                {COLLABORATION_TYPES.map((type) => (
                                    <Badge
                                        key={type.value}
                                        variant={
                                            localFilters.collaborationTypes.includes(
                                                type.value
                                            )
                                                ? "default"
                                                : "outline"
                                        }
                                        className="cursor-pointer hover:bg-primary/80"
                                        onClick={() =>
                                            handleCollaborationTypeToggle(
                                                type.value
                                            )
                                        }
                                    >
                                        {type.label}
                                        {localFilters.collaborationTypes.includes(
                                            type.value
                                        ) && <X className="ml-1 h-3 w-3" />}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Specialties */}
                    <div className="space-y-3">
                        <Label className="font-medium text-sm">
                            Spécialités
                        </Label>
                        <div className="grid max-h-40 grid-cols-2 gap-2 overflow-y-auto rounded border p-3">
                            {SPECIALTIES.map((specialty) => (
                                <div
                                    key={specialty}
                                    className="flex items-center space-x-2"
                                >
                                    <Checkbox
                                        id={`specialty-${specialty}`}
                                        checked={localFilters.specialties.includes(
                                            specialty
                                        )}
                                        onCheckedChange={() =>
                                            handleSpecialtyToggle(specialty)
                                        }
                                    />
                                    <Label
                                        htmlFor={`specialty-${specialty}`}
                                        className="cursor-pointer text-sm"
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
                                        className="cursor-pointer text-xs"
                                        onClick={() =>
                                            handleSpecialtyToggle(specialty)
                                        }
                                    >
                                        {specialty}
                                        <X className="ml-1 h-3 w-3" />
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Regions */}
                    <div className="space-y-3">
                        <Label className="font-medium text-sm">Régions</Label>
                        <div className="grid max-h-40 grid-cols-2 gap-2 overflow-y-auto rounded border p-3">
                            {FRENCH_REGIONS.map((region) => (
                                <div
                                    key={region}
                                    className="flex items-center space-x-2"
                                >
                                    <Checkbox
                                        id={`region-${region}`}
                                        checked={localFilters.regions.includes(
                                            region
                                        )}
                                        onCheckedChange={() =>
                                            handleRegionToggle(region)
                                        }
                                    />
                                    <Label
                                        htmlFor={`region-${region}`}
                                        className="cursor-pointer text-sm"
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
                                        className="cursor-pointer text-xs"
                                        onClick={() =>
                                            handleRegionToggle(region)
                                        }
                                    >
                                        {region}
                                        <X className="ml-1 h-3 w-3" />
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
                        <Label
                            htmlFor="boost-plus"
                            className="cursor-pointer text-sm"
                        >
                            Afficher uniquement les annonces Boost+
                        </Label>
                    </div>

                    {/* Save Search Section */}
                    {session?.user && activeFiltersCount > 0 && (
                        <div className="border-t pt-4">
                            {!showSaveSearch ? (
                                <Button
                                    variant="default"
                                    className="w-full bg-blue-600 text-white hover:bg-blue-700"
                                    onClick={() => setShowSaveSearch(true)}
                                >
                                    <Bell className="mr-2 h-4 w-4" />
                                    Sauvegarder cette recherche et recevoir des
                                    alertes
                                </Button>
                            ) : (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="search-name">
                                            Nom de la recherche
                                        </Label>
                                        <Input
                                            id="search-name"
                                            value={searchName}
                                            onChange={(e) =>
                                                setSearchName(e.target.value)
                                            }
                                            placeholder="Ex: Cabinets de généralistes en Île-de-France"
                                            disabled={isSaving}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label
                                            htmlFor="email-alerts"
                                            className="cursor-pointer"
                                        >
                                            Recevoir des alertes par email
                                        </Label>
                                        <Switch
                                            id="email-alerts"
                                            checked={emailAlerts}
                                            onCheckedChange={setEmailAlerts}
                                            disabled={isSaving}
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setShowSaveSearch(false)
                                                setSearchName("")
                                            }}
                                            disabled={isSaving}
                                        >
                                            Annuler
                                        </Button>
                                        <Button
                                            onClick={handleSaveSearch}
                                            disabled={isSaving}
                                        >
                                            {isSaving ? (
                                                "Sauvegarde..."
                                            ) : (
                                                <>
                                                    <Check className="mr-2 h-4 w-4" />
                                                    Sauvegarder
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <div className="flex w-full items-center justify-between">
                        <div className="text-muted-foreground text-sm">
                            {activeFiltersCount > 0 && (
                                <span>
                                    {activeFiltersCount} filtre(s) actif(s)
                                </span>
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

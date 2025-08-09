import { z } from "zod"
import {
    createListingSchema,
    updateListingSchema,
    locationSchema,
    transferDetailsSchema,
    replacementDetailsSchema,
    basicInfoStepSchema,
    locationStepSchema,
    transferDetailsStepSchema,
    replacementDetailsStepSchema,
    collaborationDetailsStepSchema,
    mediaUploadSchema,
    reviewStepSchema,
    listingFiltersSchema,
    listingStatusSchema
} from "@/lib/validations/listing"

// Database types (inferred from schema)
export type Listing = {
    id: string
    userId: string
    title: string
    description: string | null
    listingType: "transfer" | "replacement" | "collaboration"
    specialty: string | null
    status: "active" | "inactive" | "sold" | "expired"
    isPremium: boolean
    isUrgent: boolean
    viewsCount: number
    contactsCount: number
    createdAt: Date
    updatedAt: Date
    publishedAt: Date | null
    expiresAt: Date | null
}

export type ListingLocation = {
    id: string
    listingId: string
    address: string | null
    postalCode: string
    city: string
    region: string
    department: string | null
    latitude: string | null
    longitude: string | null
    medicalDensityZone: "over_served" | "under_served" | "balanced" | null
    densityScore: number | null
}

export type TransferDetails = {
    id: string
    listingId: string
    practiceType: "solo" | "group" | "clinic" | null
    annualTurnover: number | null
    chargesPercentage: string | null
    salePrice: number | null
    availabilityDate: string | null
    reasonForTransfer: string | null
    softwareUsed: string | null
    accompanimentOffered: boolean
    patientBaseSize: number | null
    equipmentIncluded: boolean
}

export type ReplacementDetails = {
    id: string
    listingId: string
    replacementType: "temporary" | "long_term" | "weekend" | null
    startDate: string | null
    endDate: string | null
    workingDays: string[] | null
    hasAssistant: boolean
    housingProvided: boolean
    feeSharePercentage: string | null
    dailyRate: number | null
    practicalTerms: string | null
}

export type ListingMedia = {
    id: string
    listingId: string
    fileUrl: string
    fileName: string | null
    fileType: string | null
    fileSize: number | null
    uploadKey: string | null
    displayOrder: number
    createdAt: Date
}

// Form data types (inferred from Zod schemas)
export type CreateListingData = z.infer<typeof createListingSchema>
export type UpdateListingData = z.infer<typeof updateListingSchema>
export type LocationData = z.infer<typeof locationSchema>
export type TransferDetailsData = z.infer<typeof transferDetailsSchema>
export type ReplacementDetailsData = z.infer<typeof replacementDetailsSchema>

// Multi-step form types
export type BasicInfoStepData = z.infer<typeof basicInfoStepSchema>
export type LocationStepData = z.infer<typeof locationStepSchema>
export type TransferDetailsStepData = z.infer<typeof transferDetailsStepSchema>
export type ReplacementDetailsStepData = z.infer<typeof replacementDetailsStepSchema>
export type CollaborationDetailsStepData = z.infer<typeof collaborationDetailsStepSchema>
export type MediaUploadData = z.infer<typeof mediaUploadSchema>
export type ReviewStepData = z.infer<typeof reviewStepSchema>

// Combined listing data with relations
export type ListingWithDetails = Listing & {
    location: ListingLocation | null
    details: TransferDetails | ReplacementDetails | null
    media: ListingMedia[]
    user?: {
        name: string
        profession?: string | null
        specialty?: string | null
        isVerifiedProfessional?: boolean
    }
}

export type PublicListing = {
    id: string
    title: string
    description: string | null
    listingType: "transfer" | "replacement" | "collaboration"
    specialty: string | null
    isPremium: boolean
    isUrgent: boolean
    viewsCount: number
    createdAt: Date
    publishedAt: Date | null
    location: {
        city: string | null
        region: string | null
        postalCode: string | null
    } | null
}

export type UserListing = {
    id: string
    title: string
    listingType: "transfer" | "replacement" | "collaboration"
    specialty: string | null
    status: "active" | "inactive" | "sold" | "expired"
    isPremium: boolean
    isUrgent: boolean
    viewsCount: number
    contactsCount: number
    createdAt: Date
    publishedAt: Date | null
    expiresAt: Date | null
}

// Search and filter types
export type ListingFilters = z.infer<typeof listingFiltersSchema>
export type ListingStatusUpdate = z.infer<typeof listingStatusSchema>

// Form wizard types
export type FormStep = "basic-info" | "location" | "details" | "media" | "review"

export type CreateListingFormData = {
    basicInfo?: BasicInfoStepData
    location?: LocationStepData
    transferDetails?: TransferDetailsStepData
    replacementDetails?: ReplacementDetailsStepData
    collaborationDetails?: CollaborationDetailsStepData
    media?: MediaUploadData
    review?: ReviewStepData
}

// API response types
export type ListingActionResult = {
    success: boolean
    error?: string
    listingId?: string
}

export type GetListingsResult = {
    listings: PublicListing[]
    total: number
    hasMore: boolean
}

// Specialty options (could be fetched from database later)
export const SPECIALTIES = [
    "Médecine générale",
    "Cardiologie",
    "Dermatologie",
    "Gastro-entérologie",
    "Gynécologie obstétrique",
    "Neurologie",
    "Ophtalmologie",
    "ORL",
    "Pédiatrie",
    "Pneumologie",
    "Psychiatrie",
    "Radiologie",
    "Rhumatologie",
    "Urologie",
    "Chirurgie générale",
    "Chirurgie orthopédique",
    "Anesthésiologie",
    "Médecine d'urgence",
    "Autre"
] as const

export type Specialty = typeof SPECIALTIES[number]

// French regions for location dropdown
export const FRENCH_REGIONS = [
    "Auvergne-Rhône-Alpes",
    "Bourgogne-Franche-Comté",
    "Bretagne",
    "Centre-Val de Loire",
    "Corse",
    "Grand Est",
    "Hauts-de-France",
    "Île-de-France",
    "Normandie",
    "Nouvelle-Aquitaine",
    "Occitanie",
    "Pays de la Loire",
    "Provence-Alpes-Côte d'Azur",
    "Guadeloupe",
    "Martinique",
    "Guyane",
    "La Réunion",
    "Mayotte"
] as const

export type FrenchRegion = typeof FRENCH_REGIONS[number]
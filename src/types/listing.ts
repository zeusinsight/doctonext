import type { z } from "zod"
import type {
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
    isBoostPlus: boolean
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
}

export type TransferDetails = {
    id: string
    listingId: string
    practiceType: "solo" | "group" | "clinic" | null
    annualTurnover: number | null
    chargesPercentage: string | null
    salePrice: number | null
    availabilityOption: "immediately" | "to_discuss" | null
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

export type CollaborationDetails = {
    id: string
    listingId: string
    collaborationType:
        | "association"
        | "partnership"
        | "group_practice"
        | "shared_space"
        | null
    durationExpectation: "short_term" | "long_term" | "permanent" | null
    activityDistribution: "full_time" | "part_time" | null
    activityDistributionDetails: string | null
    spaceArrangement: "shared_office" | "separate_offices" | "rotation" | null
    patientManagement: "shared" | "separate" | "mixed" | null
    investmentRequired: boolean
    investmentAmount: number | "to_discuss" | null
    remunerationModel: string | null
    specialtiesWanted: string[] | null
    experienceRequired: string | null
    valuesAndGoals: string | null
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
export type ReplacementDetailsStepData = z.infer<
    typeof replacementDetailsStepSchema
>
export type CollaborationDetailsStepData = z.infer<
    typeof collaborationDetailsStepSchema
>
export type MediaUploadData = z.infer<typeof mediaUploadSchema>
export type ReviewStepData = z.infer<typeof reviewStepSchema>

// Combined listing data with relations
export type ListingWithDetails = Listing & {
    location: ListingLocation | null
    details: TransferDetails | ReplacementDetails | CollaborationDetails | null
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
    isBoostPlus: boolean
    viewsCount: number
    createdAt: Date
    publishedAt: Date | null
    location: {
        city: string | null
        region: string | null
        postalCode: string | null
    } | null
    collaborationType?:
        | "association"
        | "partnership"
        | "group_practice"
        | "shared_space"
        | null
    // Pricing data
    salePrice?: number | null
    dailyRate?: number | null
    investmentAmount?: string | null
}

export type UserListing = {
    id: string
    title: string
    listingType: "transfer" | "replacement" | "collaboration"
    specialty: string | null
    status: "active" | "inactive" | "sold" | "expired"
    isBoostPlus: boolean
    viewsCount: number
    contactsCount: number
    createdAt: Date
    publishedAt: Date | null
    expiresAt: Date | null
    firstImage: {
        id: string
        fileUrl: string
        fileName: string | null
    } | null
}

// Search and filter types
export type ListingFilters = z.infer<typeof listingFiltersSchema>
export type ListingStatusUpdate = z.infer<typeof listingStatusSchema>

// Form wizard types
export type FormStep =
    | "basic-info"
    | "location"
    | "details"
    | "media"
    | "review"

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
    "Médecin généraliste",
    "Cardiologue",
    "Dermatologue",
    "Gynécologue",
    "Neurologue",
    "Ophtalmologue",
    "Orthopédiste",
    "Pédiatre",
    "Psychiatre",
    "Radiologue",
    "Chirurgien",
    "Anesthésiste",
    "Endocrinologue",
    "Gastro-entérologue",
    "Pneumologue",
    "Rhumatologue",
    "Urologue",
    "ORL",
    "Dentiste",
    "Pharmacien",
    "Kinésithérapeute",
    "Infirmier(ère)",
    "Sage-femme",
    "Ostéopathe",
    "Podologue",
    "Orthophoniste",
    "Psychologue",
    "Diététicien(ne)"
] as const

export type Specialty = (typeof SPECIALTIES)[number]

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

export type FrenchRegion = (typeof FRENCH_REGIONS)[number]

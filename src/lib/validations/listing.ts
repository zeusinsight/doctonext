import { z } from "zod"

// Base schemas for nested objects
export const locationSchema = z.object({
    address: z.string().optional(),
    postalCode: z.string().min(1, "Le code postal est requis"),
    city: z.string().min(1, "La ville est requise"),
    region: z.string().min(1, "La région est requise"),
    department: z.string().optional(),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
    medicalDensityZone: z.enum(["over_served", "under_served", "balanced"]).optional(),
    densityScore: z.number().int().min(1).max(10).optional()
})

export const transferDetailsSchema = z.object({
    practiceType: z.enum(["solo", "group", "clinic"]).optional(),
    annualTurnover: z.number().positive().optional(),
    chargesPercentage: z.string().optional(),
    salePrice: z.number().positive().optional(),
    availabilityDate: z.string().optional(), // Date string
    reasonForTransfer: z.string().optional(),
    softwareUsed: z.string().optional(),
    accompanimentOffered: z.boolean().optional(),
    patientBaseSize: z.number().positive().optional(),
    equipmentIncluded: z.boolean().optional()
})

export const replacementDetailsSchema = z.object({
    replacementType: z.enum(["temporary", "long_term", "weekend"]).optional(),
    startDate: z.string().optional(), // Date string
    endDate: z.string().optional(), // Date string
    workingDays: z.array(z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"])).optional(),
    hasAssistant: z.boolean().optional(),
    housingProvided: z.boolean().optional(),
    feeSharePercentage: z.string().optional(),
    dailyRate: z.number().positive().optional(),
    practicalTerms: z.string().optional()
})

export const collaborationDetailsSchema = z.object({
    collaborationType: z.enum(["association", "partnership", "group_practice", "shared_space"]).optional(),
    durationExpectation: z.enum(["short_term", "long_term", "permanent"]).optional(),
    workloadShare: z.string().optional(), // e.g., "50/50", "60/40"
    spaceArrangement: z.enum(["shared_office", "separate_offices", "rotation"]).optional(),
    patientManagement: z.enum(["shared", "separate", "mixed"]).optional(),
    investmentRequired: z.boolean().optional(),
    investmentAmount: z.number().positive().optional(),
    revenueSharing: z.string().optional(), // Description of revenue sharing model
    expenseSharing: z.string().optional(), // Description of expense sharing
    decisionMaking: z.enum(["equal", "senior_led", "committee"]).optional(),
    specialtiesWanted: z.array(z.string()).optional(),
    experienceRequired: z.string().optional(),
    valuesAndGoals: z.string().optional()
})

// Main schemas
export const createListingSchema = z.object({
    title: z.string().min(1, "Le titre est requis").max(200, "Le titre ne peut pas dépasser 200 caractères"),
    description: z.string().optional(),
    listingType: z.enum(["transfer", "replacement", "collaboration"]),
    specialty: z.string().optional(),
    isPremium: z.boolean().default(false),
    isUrgent: z.boolean().default(false),
    expiresAt: z.string().optional(), // Date string
    location: locationSchema.optional(),
    transferDetails: transferDetailsSchema.optional(),
    replacementDetails: replacementDetailsSchema.optional()
}).refine((data) => {
    // If listingType is transfer, transferDetails should be provided
    if (data.listingType === "transfer" && !data.transferDetails) {
        return false
    }
    // If listingType is replacement, replacementDetails should be provided
    if (data.listingType === "replacement" && !data.replacementDetails) {
        return false
    }
    return true
}, {
    message: "Les détails spécifiques au type d'annonce sont requis",
    path: ["transferDetails"]
})

export const updateListingSchema = z.object({
    title: z.string().min(1, "Le titre est requis").max(200, "Le titre ne peut pas dépasser 200 caractères"),
    description: z.string().optional(),
    specialty: z.string().optional(),
    isPremium: z.boolean().optional(),
    isUrgent: z.boolean().optional(),
    location: locationSchema.optional(),
    transferDetails: transferDetailsSchema.optional(),
    replacementDetails: replacementDetailsSchema.optional()
})

// Form step schemas for multi-step form
export const basicInfoStepSchema = z.object({
    title: z.string().min(1, "Le titre est requis").max(200, "Le titre ne peut pas dépasser 200 caractères"),
    description: z.string().optional(),
    listingType: z.enum(["transfer", "replacement", "collaboration"]),
    specialty: z.string().optional()
})

export const locationStepSchema = locationSchema

export const transferDetailsStepSchema = transferDetailsSchema

export const replacementDetailsStepSchema = replacementDetailsSchema

export const collaborationDetailsStepSchema = collaborationDetailsSchema

export const mediaUploadSchema = z.object({
    files: z.array(z.object({
        url: z.string().url(),
        name: z.string(),
        type: z.string(),
        size: z.number()
    })).optional()
})

export const reviewStepSchema = z.object({
    isPremium: z.boolean().default(false),
    isUrgent: z.boolean().default(false),
    expiresAt: z.string().optional()
})

// Search and filter schemas
export const listingFiltersSchema = z.object({
    listingType: z.enum(["transfer", "replacement", "collaboration"]).optional(),
    specialty: z.string().optional(),
    region: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
    search: z.string().optional(),
    isPremium: z.boolean().optional(),
    isUrgent: z.boolean().optional(),
    priceMin: z.number().int().positive().optional(),
    priceMax: z.number().int().positive().optional(),
    sortBy: z.enum(["newest", "oldest", "price_low", "price_high", "views"]).default("newest"),
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(50).default(20)
})

// Status update schema
export const listingStatusSchema = z.object({
    status: z.enum(["active", "inactive", "sold", "expired"])
})
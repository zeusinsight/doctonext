import { z } from "zod"

// Base schemas for nested objects
export const locationSchema = z.object({
    address: z.string().optional(),
    postalCode: z.string().min(1, "Le code postal est requis"),
    city: z.string().min(1, "La ville est requise"),
    region: z.string().min(1, "La région est requise"),
    department: z.string().optional(),
    latitude: z.string().optional(),
    longitude: z.string().optional()
})

export const transferDetailsSchema = z.object({
    practiceType: z.enum(["solo", "group", "clinic"]),
    annualTurnover: z.number().positive({
        message: "Le chiffre d'affaires annuel doit être un nombre positif"
    }),
    chargesPercentage: z.string().min(1, "Le pourcentage de charges est requis"),
    salePrice: z.number().positive().optional(),
    availabilityOption: z.enum(["immediately", "to_discuss"]),
    reasonForTransfer: z.string().min(1, "Le motif de la cession est requis"),
    softwareUsed: z.string().optional(),
    accompanimentOffered: z.boolean().optional(),
    patientBaseSize: z.number().positive({
        message: "Le nombre de patients doit être un nombre positif"
    }),
    equipmentIncluded: z.boolean().optional()
})

export const replacementDetailsSchema = z.object({
    replacementType: z.enum(["temporary", "long_term", "weekend"]).optional(),
    startDate: z.string().optional(), // Date string
    endDate: z.string().optional(), // Date string
    workingDays: z.array(z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"])).optional(),
    hasAssistant: z.boolean().optional(),
    housingProvided: z.boolean().optional(),
    feeSharePercentage: z.string().min(1, "Le pourcentage de rétrocession est requis"),
    dailyRate: z.union([
        z.string().transform((val) => {
            if (val === "" || val === undefined) return undefined;
            const num = parseInt(val);
            return isNaN(num) ? undefined : num;
        }).refine((val) => val === undefined || val > 0, {
            message: "La rémunération journalière doit être un nombre positif"
        }),
        z.number().positive(),
        z.undefined()
    ]).optional(),
    practicalTerms: z.string().optional()
})

export const collaborationDetailsSchema = z.object({
    collaborationType: z.enum(["association", "partnership", "group_practice", "shared_space"]),
    durationExpectation: z.enum(["short_term", "long_term", "permanent"]),
    activityDistribution: z.enum(["full_time", "part_time"]),
    activityDistributionDetails: z.string().optional(), // For part-time details
    spaceArrangement: z.enum(["shared_office", "separate_offices", "rotation"]),
    patientManagement: z.enum(["shared", "separate", "mixed"]),
    investmentRequired: z.boolean().optional(),
    investmentAmount: z.union([
        z.string().transform((val) => {
            if (val === "" || val === undefined) return undefined;
            if (val === "to_discuss" || val === "À discuter") return val;
            const num = parseInt(val);
            return isNaN(num) ? val : num;
        }),
        z.number().positive(),
        z.undefined()
    ]).optional(),
    remunerationModel: z.string().min(1, "Le modèle de rémunération est requis"),
    specialtiesWanted: z.array(z.string()).min(1, "Au moins une spécialité recherchée est requise"),
    experienceRequired: z.string().min(1, "L'expérience requise est requise"),
    valuesAndGoals: z.string().min(1, "Les valeurs et objectifs communs sont requis")
})

// Main schemas
export const createListingSchema = z.object({
    title: z.string().min(1, "Le titre est requis").max(200, "Le titre ne peut pas dépasser 200 caractères"),
    description: z.string().optional(),
    listingType: z.enum(["transfer", "replacement", "collaboration"]),
    specialty: z.string().optional(),
    isBoostPlus: z.boolean().default(false),
    expiresAt: z.string().optional(), // Date string
    location: locationSchema.optional(),
    transferDetails: transferDetailsSchema.optional(),
    replacementDetails: replacementDetailsSchema.optional(),
    collaborationDetails: collaborationDetailsSchema.optional(),
    media: z.array(z.object({
        url: z.string().url(),
        name: z.string(),
        type: z.string(),
        size: z.number()
    })).optional()
}).refine((data) => {
    // If listingType is transfer, transferDetails should be provided
    if (data.listingType === "transfer" && !data.transferDetails) {
        return false
    }
    // If listingType is replacement, replacementDetails should be provided
    if (data.listingType === "replacement" && !data.replacementDetails) {
        return false
    }
    // If listingType is collaboration, collaborationDetails should be provided
    if (data.listingType === "collaboration" && !data.collaborationDetails) {
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
    isBoostPlus: z.boolean().optional(),
    location: locationSchema.optional(),
    transferDetails: transferDetailsSchema.optional(),
    replacementDetails: replacementDetailsSchema.optional(),
    collaborationDetails: collaborationDetailsSchema.optional()
})

// Form step schemas for multi-step form
export const basicInfoStepSchema = z.object({
    title: z.string().min(1, "Le titre est requis").max(200, "Le titre ne peut pas dépasser 200 caractères"),
    description: z.string().min(1, "La description est requise"),
    listingType: z.enum(["transfer", "replacement", "collaboration"]),
    specialty: z.string().min(1, "La spécialité est requise")
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
    isBoostPlus: z.boolean().default(false),
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
    isBoostPlus: z.boolean().optional(),
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
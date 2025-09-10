import { pgTable, text, timestamp, boolean, integer, decimal, date, jsonb, bigint } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified")
        .$defaultFn(() => false)
        .notNull(),
    image: text("image"),
    avatar: text("avatar"),
    avatarUrl: text("avatar_url"),
    createdAt: timestamp("created_at")
        .$defaultFn(() => /* @__PURE__ */ new Date())
        .notNull(),
    updatedAt: timestamp("updated_at")
        .$defaultFn(() => /* @__PURE__ */ new Date())
        .notNull(),
    stripeCustomerId: text("stripe_customer_id"),
    profession: text("profession"),
    specialty: text("specialty"),
    rppsNumber: text("rpps_number"),
    adeliNumber: text("adeli_number"),
    phone: text("phone"),
    isVerifiedProfessional: boolean("is_verified_professional")
        .default(false),
    role: text("role").$type<"user" | "admin">().default("user"),
    bio: text("bio")
});



export const sessions = pgTable("sessions", {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" })
})

export const accounts = pgTable("accounts", {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull()
})

export const verifications = pgTable("verifications", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").$defaultFn(
        () => /* @__PURE__ */ new Date()
    ),
    updatedAt: timestamp("updated_at").$defaultFn(
        () => /* @__PURE__ */ new Date()
    )
})

export const subscriptions = pgTable("subscriptions", {
	id: text('id').primaryKey(),
	plan: text('plan').notNull(),
	referenceId: text('reference_id').notNull(),
	stripeCustomerId: text('stripe_customer_id'),
	stripeSubscriptionId: text('stripe_subscription_id'),
	status: text('status').default("incomplete"),
	periodStart: timestamp('period_start'),
    periodEnd: timestamp("period_end"),
    cancelAtPeriodEnd: boolean("cancel_at_period_end"),
    seats: integer("seats"),
    trialStart: timestamp('trial_start'),
    trialEnd: timestamp('trial_end')
});

export const listings = pgTable("listings", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    listingType: text("listing_type").notNull(),
    specialty: text("specialty"),
    status: text("status").default("active").notNull(),
    isBoostPlus: boolean("is_boost_plus")
        .$defaultFn(() => false)
        .notNull(),
    viewsCount: integer("views_count")
        .$defaultFn(() => 0)
        .notNull(),
    contactsCount: integer("contacts_count")
        .$defaultFn(() => 0)
        .notNull(),
    createdAt: timestamp("created_at")
        .$defaultFn(() => new Date())
        .notNull(),
    updatedAt: timestamp("updated_at")
        .$defaultFn(() => new Date())
        .notNull(),
    publishedAt: timestamp("published_at"),
    expiresAt: timestamp("expires_at")
});

export const listingLocations = pgTable("listing_locations", {
    id: text("id").primaryKey(),
    listingId: text("listing_id")
        .notNull()
        .unique()
        .references(() => listings.id, { onDelete: "cascade" }),
    address: text("address"),
    postalCode: text("postal_code").notNull(),
    city: text("city").notNull(),
    region: text("region").notNull(),
    department: text("department"),
    latitude: decimal("latitude"),
    longitude: decimal("longitude")
});

export const transferDetails = pgTable("transfer_details", {
    id: text("id").primaryKey(),
    listingId: text("listing_id")
        .notNull()
        .unique()
        .references(() => listings.id, { onDelete: "cascade" }),
    practiceType: text("practice_type"),
    annualTurnover: bigint("annual_turnover", { mode: "number" }),
    chargesPercentage: decimal("charges_percentage"),
    salePrice: bigint("sale_price", { mode: "number" }),
    availabilityOption: text("availability_option"),
    reasonForTransfer: text("reason_for_transfer"),
    softwareUsed: text("software_used"),
    accompanimentOffered: boolean("accompaniment_offered")
        .$defaultFn(() => false)
        .notNull(),
    patientBaseSize: bigint("patient_base_size", { mode: "number" }),
    equipmentIncluded: boolean("equipment_included")
        .$defaultFn(() => false)
        .notNull()
});

export const replacementDetails = pgTable("replacement_details", {
    id: text("id").primaryKey(),
    listingId: text("listing_id")
        .notNull()
        .unique()
        .references(() => listings.id, { onDelete: "cascade" }),
    replacementType: text("replacement_type"),
    startDate: date("start_date"),
    endDate: date("end_date"),
    workingDays: text("working_days").array(),
    hasAssistant: boolean("has_assistant")
        .$defaultFn(() => false)
        .notNull(),
    housingProvided: boolean("housing_provided")
        .$defaultFn(() => false)
        .notNull(),
    feeSharePercentage: decimal("fee_share_percentage"),
    dailyRate: bigint("daily_rate", { mode: "number" }),
    practicalTerms: text("practical_terms")
});

export const collaborationDetails = pgTable("collaboration_details", {
    id: text("id").primaryKey(),
    listingId: text("listing_id")
        .notNull()
        .unique()
        .references(() => listings.id, { onDelete: "cascade" }),
    collaborationType: text("collaboration_type"),
    durationExpectation: text("duration_expectation"),
    activityDistribution: text("activity_distribution"),
    activityDistributionDetails: text("activity_distribution_details"),
    spaceArrangement: text("space_arrangement"),
    patientManagement: text("patient_management"),
    investmentRequired: boolean("investment_required")
        .$defaultFn(() => false)
        .notNull(),
    investmentAmount: text("investment_amount"),
    remunerationModel: text("remuneration_model"),
    specialtiesWanted: text("specialties_wanted").array(),
    experienceRequired: text("experience_required"),
    valuesAndGoals: text("values_and_goals")
});

export const listingMedia = pgTable("listing_media", {
    id: text("id").primaryKey(),
    listingId: text("listing_id")
        .notNull()
        .references(() => listings.id, { onDelete: "cascade" }),
    fileUrl: text("file_url").notNull(),
    fileName: text("file_name"),
    fileType: text("file_type"),
    fileSize: integer("file_size"),
    uploadKey: text("upload_key"),
    displayOrder: integer("display_order")
        .$defaultFn(() => 0)
        .notNull(),
    createdAt: timestamp("created_at")
        .$defaultFn(() => new Date())
        .notNull()
});

export const conversations = pgTable("conversations", {
    id: text("id").primaryKey(),
    listingId: text("listing_id")
        .references(() => listings.id, { onDelete: "cascade" }),
    participant1Id: text("participant_1_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    participant2Id: text("participant_2_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    lastMessageAt: timestamp("last_message_at"),
    lastMessageContent: text("last_message_content"),
    createdAt: timestamp("created_at")
        .$defaultFn(() => new Date())
        .notNull(),
    updatedAt: timestamp("updated_at")
        .$defaultFn(() => new Date())
        .notNull()
});

export const messages = pgTable("messages", {
    id: text("id").primaryKey(),
    conversationId: text("conversation_id")
        .notNull()
        .references(() => conversations.id, { onDelete: "cascade" }),
    senderId: text("sender_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    recipientId: text("recipient_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    listingId: text("listing_id")
        .references(() => listings.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    isRead: boolean("is_read")
        .$defaultFn(() => false)
        .notNull(),
    createdAt: timestamp("created_at")
        .$defaultFn(() => new Date())
        .notNull(),
    updatedAt: timestamp("updated_at")
        .$defaultFn(() => new Date())
        .notNull()
});

export const favorites = pgTable("favorites", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    listingId: text("listing_id")
        .notNull()
        .references(() => listings.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at")
        .$defaultFn(() => new Date())
        .notNull()
});

export const savedSearches = pgTable("saved_searches", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    searchCriteria: jsonb("search_criteria").notNull(),
    isActive: boolean("is_active")
        .$defaultFn(() => true)
        .notNull(),
    emailAlertsEnabled: boolean("email_alerts_enabled")
        .$defaultFn(() => true)
        .notNull(),
    lastAlertSent: timestamp("last_alert_sent"),
    createdAt: timestamp("created_at")
        .$defaultFn(() => new Date())
        .notNull(),
    updatedAt: timestamp("updated_at")
        .$defaultFn(() => new Date())
        .notNull()
});

export const alertNotifications = pgTable("alert_notifications", {
    id: text("id").primaryKey(),
    savedSearchId: text("saved_search_id")
        .notNull()
        .references(() => savedSearches.id, { onDelete: "cascade" }),
    listingId: text("listing_id")
        .notNull()
        .references(() => listings.id, { onDelete: "cascade" }),
    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    sentAt: timestamp("sent_at")
        .$defaultFn(() => new Date())
        .notNull(),
    emailSent: boolean("email_sent")
        .$defaultFn(() => false)
        .notNull()
});

export const blogArticles = pgTable("blog_articles", {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    content: text("content").notNull(),
    excerpt: text("excerpt"),
    featuredImage: text("featured_image"),
    authorId: text("author_id")
        .references(() => users.id, { onDelete: "set null" }),
    isPublished: boolean("is_published")
        .$defaultFn(() => false)
        .notNull(),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    tags: text("tags").array(),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at")
        .$defaultFn(() => new Date())
        .notNull(),
    updatedAt: timestamp("updated_at")
        .$defaultFn(() => new Date())
        .notNull()
});

export const contractTemplates = pgTable("contract_templates", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    profession: text("profession").notNull(),
    contractType: text("contract_type").notNull(),
    templateContent: text("template_content").notNull(),
    fieldsSchema: jsonb("fields_schema"),
    priceCents: integer("price_cents")
        .$defaultFn(() => 500)
        .notNull(),
    isActive: boolean("is_active")
        .$defaultFn(() => true)
        .notNull(),
    version: text("version")
        .$defaultFn(() => "1.0")
        .notNull(),
    createdAt: timestamp("created_at")
        .$defaultFn(() => new Date())
        .notNull(),
    updatedAt: timestamp("updated_at")
        .$defaultFn(() => new Date())
        .notNull()
});

export const contracts = pgTable("contracts", {
    id: text("id").primaryKey(),
    conversationId: text("conversation_id")
        .references(() => conversations.id, { onDelete: "cascade" }),
    listingId: text("listing_id")
        .notNull()
        .references(() => listings.id, { onDelete: "cascade" }),
    senderId: text("sender_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    recipientId: text("recipient_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    contractType: text("contract_type").notNull(),
    templateId: text("template_id")
        .references(() => contractTemplates.id),
    docusealTemplateId: text("docuseal_template_id"),
    docusealSubmissionId: text("docuseal_submission_id"),
    status: text("status")
        .$type<"pending_payment" | "pending_signature" | "in_progress" | "completed" | "cancelled">()
        .$defaultFn(() => "pending_payment")
        .notNull(),
    contractData: jsonb("contract_data"),
    parties: jsonb("parties"),
    stripePaymentIntentId: text("stripe_payment_intent_id"),
    paidAt: timestamp("paid_at"),
    signedAt: timestamp("signed_at"),
    documentUrl: text("document_url"),
    expiresAt: timestamp("expires_at"),
    createdAt: timestamp("created_at")
        .$defaultFn(() => new Date())
        .notNull(),
    updatedAt: timestamp("updated_at")
        .$defaultFn(() => new Date())
        .notNull()
});

export const listingAnalytics = pgTable("listing_analytics", {
    id: text("id").primaryKey(),
    listingId: text("listing_id")
        .notNull()
        .references(() => listings.id, { onDelete: "cascade" }),
    eventType: text("event_type").notNull(),
    userId: text("user_id")
        .references(() => users.id, { onDelete: "cascade" }),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    referrer: text("referrer"),
    createdAt: timestamp("created_at")
        .$defaultFn(() => new Date())
        .notNull()
});

export const notifications = pgTable("notifications", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    title: text("title").notNull(),
    message: text("message"),
    data: jsonb("data"),
    isRead: boolean("is_read")
        .$defaultFn(() => false)
        .notNull(),
    createdAt: timestamp("created_at")
        .$defaultFn(() => new Date())
        .notNull(),
    readAt: timestamp("read_at")
});

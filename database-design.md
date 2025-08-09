# Doctonext Database Schema Design

## Overview
This document outlines the complete database schema for Doctonext, a medical marketplace platform similar to leboncoin but specialized for healthcare professionals.

## Modified Existing Tables

### 1. Users (Extended)
Extend the existing `users` table with healthcare professional fields:

```sql
users: (existing fields + new fields)
- id (text, primary key) ✓ existing
- name (text, not null) ✓ existing
- email (text, unique, not null) ✓ existing
- emailVerified (boolean, default false) ✓ existing
- image (text) ✓ existing
- avatar (text) ✓ existing
- avatarUrl (text) ✓ existing
- createdAt (timestamp) ✓ existing
- updatedAt (timestamp) ✓ existing
- stripeCustomerId (text) ✓ existing
- profession (text, optional) -- NEW: "doctor", "dentist", "physiotherapist", "nurse"
- specialty (text, optional) -- NEW: medical specialty
- rpps_number (text, optional) -- NEW: Professional registration number
- adeli_number (text, optional) -- NEW: Alternative registration number
- phone (text, optional) -- NEW
- is_verified_professional (boolean, default false) -- NEW
- bio (text, optional) -- NEW
```

### 2. Keep Existing Tables
- `sessions` - Session management ✓
- `accounts` - OAuth and social login accounts ✓
- `verifications` - Email verification tokens ✓
- `subscriptions` - User subscription management ✓

## New Tables Required

### 1. Listings (`listings`)
Core table for all types of listings (transfers, replacements, collaborations).

```sql
listings:
- id (text, primary key)
- user_id (text, references users.id)
- title (text, not null)
- description (text)
- listing_type (text) -- "transfer", "replacement", "collaboration"
- specialty (text)
- status (text, default "active") -- "active", "inactive", "sold", "expired"
- is_premium (boolean, default false)
- is_urgent (boolean, default false)
- views_count (integer, default 0)
- contacts_count (integer, default 0)
- created_at (timestamp)
- updated_at (timestamp)
- published_at (timestamp, optional)
- expires_at (timestamp, optional)
```

### 2. Listing Locations (`listing_locations`)
Geographic information for listings.

```sql
listing_locations:
- id (text, primary key)
- listing_id (text, references listings.id, unique)
- address (text, optional)
- postal_code (text)
- city (text, not null)
- region (text, not null)
- department (text)
- latitude (decimal, optional)
- longitude (decimal, optional)
- medical_density_zone (text) -- "over_served", "under_served", "balanced"
- density_score (integer, optional) -- 1-10 scale
```

### 3. Transfer Details (`transfer_details`)
Specific information for practice transfer listings.

```sql
transfer_details:
- id (text, primary key)
- listing_id (text, references listings.id, unique)
- practice_type (text) -- "solo", "group", "clinic"
- annual_turnover (integer, optional)
- charges_percentage (decimal, optional)
- sale_price (integer, optional)
- availability_date (date, optional)
- reason_for_transfer (text, optional)
- software_used (text, optional)
- accompaniment_offered (boolean, default false)
- patient_base_size (integer, optional)
- equipment_included (boolean, default false)
```

### 4. Replacement Details (`replacement_details`)
Specific information for replacement listings.

```sql
replacement_details:
- id (text, primary key)
- listing_id (text, references listings.id, unique)
- replacement_type (text) -- "temporary", "long_term", "weekend"
- start_date (date, optional)
- end_date (date, optional)
- working_days (text[]) -- array: ["monday", "tuesday", ...]
- has_assistant (boolean, default false)
- housing_provided (boolean, default false)
- fee_share_percentage (decimal, optional)
- daily_rate (integer, optional)
- practical_terms (text, optional)
```

### 5. Media (`listing_media`)
File attachments for listings (photos, documents).

```sql
listing_media:
- id (text, primary key)
- listing_id (text, references listings.id)
- file_url (text, not null)
- file_name (text)
- file_type (text) -- "image", "document"
- file_size (integer, optional)
- upload_key (text) -- UploadThing key
- display_order (integer, default 0)
- created_at (timestamp)
```

### 6. Messages (`messages`)
Internal messaging system between users.

```sql
messages:
- id (text, primary key)
- conversation_id (text, not null)
- sender_id (text, references users.id)
- recipient_id (text, references users.id)
- listing_id (text, references listings.id, optional)
- content (text, not null)
- is_read (boolean, default false)
- created_at (timestamp)
- updated_at (timestamp)
```

### 7. Conversations (`conversations`)
Conversation metadata for messaging.

```sql
conversations:
- id (text, primary key)
- listing_id (text, references listings.id, optional)
- participant_1_id (text, references users.id)
- participant_2_id (text, references users.id)
- last_message_at (timestamp)
- last_message_content (text, optional)
- created_at (timestamp)
- updated_at (timestamp)
```

### 8. Favorites (`favorites`)
User's saved/favorited listings.

```sql
favorites:
- id (text, primary key)
- user_id (text, references users.id)
- listing_id (text, references listings.id)
- created_at (timestamp)
```

### 9. Saved Searches (`saved_searches`)
User's saved search criteria for alerts.

```sql
saved_searches:
- id (text, primary key)
- user_id (text, references users.id)
- name (text, not null)
- search_criteria (jsonb, not null) -- JSON object with filters
- is_active (boolean, default true)
- email_alerts_enabled (boolean, default true)
- last_alert_sent (timestamp, optional)
- created_at (timestamp)
- updated_at (timestamp)
```

### 10. Alert Notifications (`alert_notifications`)
Track sent alert notifications.

```sql
alert_notifications:
- id (text, primary key)
- saved_search_id (text, references saved_searches.id)
- listing_id (text, references listings.id)
- user_id (text, references users.id)
- sent_at (timestamp)
- email_sent (boolean, default false)
```

### 11. Blog Articles (`blog_articles`)
Content management for blog/resource center.

```sql
blog_articles:
- id (text, primary key)
- title (text, not null)
- slug (text, unique, not null)
- content (text, not null) -- MDX content
- excerpt (text, optional)
- featured_image (text, optional)
- author_id (text, references users.id, optional)
- is_published (boolean, default false)
- seo_title (text, optional)
- seo_description (text, optional)
- tags (text[])
- published_at (timestamp, optional)
- created_at (timestamp)
- updated_at (timestamp)
```

### 12. Contracts (`contracts`)
DocuSeal contract generation and e-signature.

```sql
contracts:
- id (text, primary key)
- listing_id (text, references listings.id)
- sender_id (text, references users.id) -- transferor/replaced
- recipient_id (text, references users.id) -- buyer/replacement
- contract_type (text) -- "transfer", "replacement", "collaboration"
- template_id (text) -- reference to contract template
- status (text, default "draft") -- "draft", "pending", "signed", "cancelled"
- docuseal_document_id (text, optional)
- contract_data (jsonb) -- pre-filled data
- payment_intent_id (text, optional) -- Stripe payment intent
- payment_status (text, default "unpaid") -- "unpaid", "paid", "refunded"
- signed_at (timestamp, optional)
- expires_at (timestamp, optional)
- created_at (timestamp)
- updated_at (timestamp)
```

### 13. Contract Templates (`contract_templates`)
Official contract templates by profession.

```sql
contract_templates:
- id (text, primary key)
- name (text, not null)
- profession (text) -- "doctor", "dentist", "physiotherapist", "nurse"
- contract_type (text) -- "transfer", "replacement", "collaboration"
- template_content (text, not null) -- Template with placeholders
- fields_schema (jsonb) -- JSON schema for fillable fields
- price_cents (integer, default 500) -- €5.00 in cents
- is_active (boolean, default true)
- version (text, default "1.0")
- created_at (timestamp)
- updated_at (timestamp)
```

### 14. Analytics (`listing_analytics`)
Track listing performance and user interactions.

```sql
listing_analytics:
- id (text, primary key)
- listing_id (text, references listings.id)
- event_type (text) -- "view", "contact", "favorite", "unfavorite"
- user_id (text, references users.id, optional)
- ip_address (text, optional)
- user_agent (text, optional)
- referrer (text, optional)
- created_at (timestamp)
```

## Indexes and Performance

### Primary Indexes
- All primary keys are automatically indexed
- Foreign key columns should be indexed for join performance

### Additional Indexes Needed
```sql
-- Listings search performance
CREATE INDEX idx_listings_type_specialty ON listings(listing_type, specialty);
CREATE INDEX idx_listings_status_published ON listings(status, published_at);
CREATE INDEX idx_listings_location_search ON listing_locations(region, city, postal_code);

-- Messaging performance
CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at);
CREATE INDEX idx_conversations_participants ON conversations(participant_1_id, participant_2_id);

-- Analytics performance
CREATE INDEX idx_analytics_listing_type ON listing_analytics(listing_id, event_type, created_at);

-- Search alerts
CREATE INDEX idx_saved_searches_active ON saved_searches(user_id, is_active);

-- Users professional search
CREATE INDEX idx_users_profession ON users(profession, specialty);
```

## Data Relationships

### Key Relationships
1. **Users** can have many **Listings** (1:N)
2. **Listings** have one **Location** (1:1)
3. **Listings** can have **Transfer Details** OR **Replacement Details** (1:0..1)
4. **Listings** can have many **Media** files (1:N)
5. **Users** can **Favorite** many **Listings** (N:N)
6. **Users** can have many **Saved Searches** (1:N)
7. **Users** participate in **Conversations** and send **Messages** (N:N)
8. **Listings** can generate **Contracts** between users (1:N)

## Search Implementation Notes

### Full-Text Search
- Implement PostgreSQL full-text search on `listings.title` and `listings.description`
- Create tsvector columns for better performance
- Include location data in search vectors

### Geographic Search
- Use PostGIS extension for advanced geographic queries
- Implement radius-based search using lat/lng coordinates
- Consider implementing medical density zones for opportunity mapping

## Privacy and Security Notes

### Sensitive Data
- RPPS/ADELI numbers should be encrypted at rest
- Phone numbers require explicit consent
- Message content should be encrypted
- Financial data (turnover, prices) requires special handling

### Data Retention
- Implement soft delete for listings (keep for analytics)
- Set retention policies for messages and analytics data
- GDPR compliance for user data deletion

## Migration Strategy

### Phase 1: Core Features
1. Extend users table with professional fields
2. Basic listings with locations
3. Transfer and replacement details
4. Media uploads

### Phase 2: Communication
1. Messaging system
2. Favorites and saved searches
3. Email alerts

### Phase 3: Advanced Features
1. Analytics and performance tracking
2. Blog/content management
3. Contract generation system

### Phase 4: Optimization
1. Search performance optimization
2. Caching strategies
3. Advanced analytics
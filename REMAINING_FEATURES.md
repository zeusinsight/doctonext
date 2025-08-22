# Doctonext - Remaining Features Implementation Guide

## Overview
This document outlines the detailed implementation requirements for the 5 remaining major features of Doctonext. All database schemas are already in place, and the core infrastructure is ready.

---

## 🗺️ 1. Interactive Map Feature

### 1.1 Core Components to Build

#### Map Component (`src/components/map/interactive-map.tsx`)
- **Purpose**: Display medical density map with listings overlay
- **Library**: Use Leaflet.js with React Leaflet
- **Features**:
  - Base map with French regions/departments
  - Color-coded overlay for medical density
  - Clickable listing markers
  - Zoom controls and pan functionality
  - Responsive design for mobile/desktop

#### Medical Density Service (`src/lib/services/medical-density.ts`)
- **Purpose**: Calculate and provide medical density data
- **Data Sources**:
  - French healthcare professional registry data
  - Population density by region/department
  - Specialty-specific density calculations
- **Color Coding Logic**:
  - Green (0-30%): Under-served, high opportunity
  - Yellow (31-70%): Moderate density
  - Red (71-100%): Over-served, saturated
- **API Endpoints Needed**:
  - `GET /api/map/density` - Get density data for all regions
  - `GET /api/map/listings` - Get listings with coordinates for map display

#### Map Integration Pages
1. **Dedicated Map Page** (`src/app/map/page.tsx`)
   - Full-screen map experience
   - Advanced filtering sidebar
   - Search functionality within map view
   - Legend explaining density colors

2. **Map Widget** (`src/components/listings/map-widget.tsx`)
   - Smaller embedded map for listing pages
   - Show specific listing location
   - Nearby listings display

### 1.2 Database Integration
- Use existing `listingLocations` table with latitude/longitude
- Add medical density calculation based on:
  - `users` table with profession/specialty fields
  - Geographic distribution analysis
  - Population data integration

### 1.3 Features Detail
- **Dynamic Filtering**: Filter by specialty, practice type, budget
- **Listing Markers**: Custom icons based on listing type (transfer/replacement/collaboration)
- **Info Popups**: Show listing preview on marker click
- **Search Integration**: Search by city/postal code with map centering
- **Mobile Optimization**: Touch-friendly controls, responsive layout

---

## 📚 2. Blog/Resource Center

### 2.1 Core Components to Build

#### Blog Listing Page (`src/app/blog/page.tsx`)
- **Purpose**: Display all published blog articles
- **Access**: Public read-only
- **Features**:
  - Article grid with featured images
  - Category filtering (procedures, help, testimonials)
  - Search functionality
  - Pagination (10-15 articles per page)
  - SEO optimization with meta tags

#### Individual Article Page (`src/app/blog/[slug]/page.tsx`)
- **Purpose**: Display single article with full content
- **Access**: Public read-only
- **Features**:
  - Markdown/MDX content rendering
  - Author information display
  - Published date and reading time
  - Related articles suggestions
  - SEO optimization (title, description, JSON-LD)

#### Admin Interface (`src/app/dashboard/blog/`)
- **Access Control**: Admin-only routes with role verification
- **Article Management** (`src/app/dashboard/blog/page.tsx`)
  - List all articles with status
  - Create, edit, delete functionality (admin only)
  - Publish/unpublish toggle
  - Draft management

- **Article Editor** (`src/app/dashboard/blog/[id]/edit/page.tsx`)
  - Admin-only access
  - Rich text editor (TipTap)
  - Image upload integration (UploadThing)
  - SEO fields (title, description, tags)
  - Preview functionality
  - Auto-save drafts

#### Blog Components
- **Article Card** (`src/components/blog/article-card.tsx`)
  - Featured image, title, excerpt
  - Author, date, reading time
  - Category badges

- **Article Content** (`src/components/blog/article-content.tsx`)
  - Markdown rendering with syntax highlighting
  - Table of contents generation
  - Image optimization and lazy loading

### 2.2 Database Integration
- Use existing `blogArticles` table with role-based access
- Fields:
  - `title`, `slug`, `content`, `excerpt`
  - `featuredImage`, `authorId`, `isPublished`
  - `seoTitle`, `seoDescription`, `tags`
  - `publishedAt`, `createdAt`, `updatedAt`
  - `authorRole` (must be 'admin')

### 2.3 API Endpoints Needed
- `GET /api/blog` - Get published articles (public)
- `GET /api/blog/[slug]` - Get single article (public)
- `POST /api/blog` - Create new article (admin only)
- `PUT /api/blog/[id]` - Update article (admin only)
- `DELETE /api/blog/[id]` - Delete article (admin only)
- `PATCH /api/blog/[id]/publish` - Publish/unpublish article (admin only)

### 2.4 Content Categories
1. **Procedures**: Legal requirements, administrative steps
2. **Help**: User guides, FAQs, troubleshooting
3. **Testimonials**: Success stories, case studies
4. **News**: Industry updates, platform announcements

---

## 📄 3. Contract Generation & E-signature

### 3.1 Core Components to Build

#### Contract Templates Management (`src/app/dashboard/contracts/templates/`)
- **Template List** (`page.tsx`)
  - Display available templates by profession
  - Template status and pricing
  - Admin controls for template management

- **Template Editor** (`[id]/edit/page.tsx`)
  - Rich text editor for contract content
  - Variable placeholders insertion
  - Field schema definition
  - Template preview functionality

#### Contract Generation Flow
1. **Contract Initialization** (`src/components/contracts/contract-generator.tsx`)
   - Available templates selection
   - Auto-populate from listing/user data
   - Custom field editing interface
   - Contract preview before payment

2. **Payment Integration** (`src/components/contracts/contract-payment.tsx`)
   - Stripe payment intent creation
   - €5 flat fee processing
   - Payment confirmation handling
   - Error handling and retry logic

3. **DocuSeal Integration** (`src/lib/services/docuseal.ts`)
   - Document creation via DocuSeal API
   - Auto-populate contract fields
   - Send for e-signature to both parties
   - Webhook handling for signature events
   - PDF download and storage

#### Contract Management (`src/app/dashboard/contracts/`)
- **Contract List** (`page.tsx`)
  - User's contracts with status
  - Filter by status (draft, pending, signed)
  - Download signed contracts
  - Contract history tracking

- **Contract Detail** (`[id]/page.tsx`)
  - Full contract information
  - Signature status for both parties
  - Timeline of contract events
  - Download options (PDF, documents)

### 3.2 Database Integration
Use existing tables:
- `contractTemplates`: Template storage and management
- `contracts`: Contract instances and status tracking

### 3.3 DocuSeal Integration Details
- **API Endpoints**:
  - Document creation: `POST /documents`
  - Field population: `PUT /documents/{id}`
  - Signature request: `POST /documents/{id}/send`
  - Status check: `GET /documents/{id}`

- **Webhook Handling** (`src/app/api/webhooks/docuseal/route.ts`)
  - Document signed events
  - Status updates
  - Error notifications

### 3.4 Payment Flow (Stripe)
1. Create payment intent for €5
2. Show payment form with contract preview
3. Process payment confirmation
4. Generate contract in DocuSeal
5. Send signature requests
6. Store contract reference and status

### 3.5 Professional Templates
- **Doctors**: Practice transfer, collaboration agreements
- **Dentists**: Cabinet sale, partnership contracts
- **Physiotherapists**: Practice handover, rental agreements
- **Nurses**: Liberal practice transfer, collaboration

### 3.6 API Endpoints Needed
- `GET /api/contracts` - User's contracts list
- `POST /api/contracts` - Create new contract
- `GET /api/contracts/templates` - Available templates
- `POST /api/contracts/[id]/generate` - Generate PDF via DocuSeal
- `POST /api/contracts/[id]/payment` - Process payment
- `POST /api/webhooks/docuseal` - Handle DocuSeal webhooks

---

## 💰 4. Payment System for Premium Features

### 4.1 Core Components to Build

#### Boost Listing Interface (`src/components/listings/boost-listing.tsx`)
- **Boost Options**:
  - Standard boost: €10 for 7 days
- **Payment Integration**: Stripe payment processing
- **Visual Indicators**: Badge display on boosted listings

#### Payment Processing (`src/lib/services/stripe-boost.ts`)
- **Payment Intent Creation**: For different boost types
- **Webhook Handling**: Payment confirmation processing
- **Boost Activation**: Update listing status and visibility
- **Expiration Management**: Auto-remove boost after period

#### Dashboard Integration
- **Boost Management** (`src/app/dashboard/listings/[id]/boost/page.tsx`)
  - Current boost status display
  - Boost options selection
  - Payment form integration
  - Boost history and analytics

- **Boost Analytics** (`src/components/analytics/boost-performance.tsx`)
  - Views increase during boost period
  - Contact rate improvement
  - ROI calculations
  - Boost effectiveness metrics

### 4.2 Database Integration
- Use existing `listings` table `isBoostPlus` field
- Add new fields or use JSON in existing schema:
  - `boostType`: 'standard' | 'premium' | 'urgent'
  - `boostStartDate`, `boostEndDate`
  - `boostPaymentId`: Stripe payment reference

### 4.3 Boost Features Implementation
1. **Enhanced Visibility**:
   - Boosted listings appear first in search results
   - Special badges (🔥 urgent, ⭐ premium)
   - Different border colors in listing cards
   - Featured section on homepage

2. **Analytics Tracking**:
   - Track views during boost vs normal periods
   - Contact rate improvements
   - Revenue attribution to boost campaigns

### 4.4 Payment Pricing Structure
- **Standard Boost**: €10 for 7 days priority placement

### 4.5 API Endpoints Needed
- `POST /api/listings/[id]/boost` - Initiate boost payment
- `POST /api/payments/boost/confirm` - Confirm boost payment
- `GET /api/listings/boosted` - Get boosted listings for homepage
- `POST /api/webhooks/stripe/boost` - Handle boost payment webhooks

---

## 📊 5. Analytics & Reporting

### 5.1 Core Components to Build

#### Dashboard Analytics (`src/app/dashboard/analytics/page.tsx`)
- **Overview Metrics**:
  - Total listings, active listings, views, contacts
  - Performance comparison (week over week)
  - Revenue from boosts and contracts
  - User engagement metrics

- **Listing Performance** (`src/components/analytics/listing-performance.tsx`)
  - Individual listing analytics
  - Views over time (charts)
  - Contact conversion rates
  - Geographic performance data
  - Best performing content analysis

- **Charts Integration** (`src/components/analytics/charts/`)
  - Use Chart.js or Recharts for visualizations
  - Line charts for trends
  - Bar charts for comparisons
  - Pie charts for breakdowns
  - Heatmaps for geographic data

#### User Behavior Analytics
- **Tracking Service** (`src/lib/services/analytics.ts`)
  - Page views, time on page
  - Search queries and filters used
  - Click-through rates on listings
  - Conversion funnel analysis
  - User journey mapping

- **A/B Testing Framework**
  - Test different listing card designs
  - Optimize call-to-action buttons
  - Test boost placement effectiveness
  - Measure feature adoption rates

### 5.2 Database Integration
Use existing `listingAnalytics` table:
- `eventType`: 'view', 'contact', 'favorite', 'share', 'boost_click'
- `userId`, `listingId`, `ipAddress`, `userAgent`
- `referrer`, `createdAt`

Extended analytics data:
- Session duration tracking
- Search behavior analysis
- Conversion event tracking
- Revenue attribution

### 5.3 Analytics Features Detail

#### Real-time Metrics
- **Live Dashboard**: Current active users, recent activities
- **Performance Alerts**: Sudden traffic drops/spikes
- **System Health**: API response times, error rates

#### Reporting System
- **Automated Reports**: Weekly/monthly email reports
- **Custom Date Ranges**: Flexible reporting periods
- **Export Functionality**: PDF/CSV report downloads
- **Benchmarking**: Compare against platform averages

#### Advanced Analytics
- **Cohort Analysis**: User retention over time
- **Geographic Heat Maps**: Popular regions/cities
- **Seasonal Trends**: Identify peak listing periods
- **Revenue Analytics**: Track contract generation success

### 5.4 Key Performance Indicators (KPIs)
1. **Listing Performance**:
   - Views per listing
   - Contact rate (contacts/views)
   - Time to first contact
   - Listing completion rate

2. **User Engagement**:
   - Monthly active users
   - Session duration
   - Pages per session
   - Return visit rate

3. **Revenue Metrics**:
   - Contract generation revenue
   - Boost listing revenue
   - Average revenue per user
   - Conversion from free to paid

4. **Platform Health**:
   - Search success rate
   - Message response rate
   - User satisfaction scores
   - Feature adoption rates

### 5.5 API Endpoints Needed
- `GET /api/analytics/overview` - Dashboard overview data
- `GET /api/analytics/listings/[id]` - Individual listing analytics
- `POST /api/analytics/track` - Track user events
- `GET /api/analytics/reports` - Generate custom reports
- `GET /api/analytics/export` - Export analytics data

---

## 🔧 Implementation Priority & Timeline

### Phase 1: Analytics Foundation (Week 1)
- Set up analytics tracking service
- Implement basic dashboard metrics
- Create listing performance components
- Add event tracking throughout app

### Phase 2: Payment System (Week 1-2)
- Integrate Stripe for boost payments
- Implement boost listing functionality
- Add payment webhooks and confirmations
- Create boost management interface

### Phase 3: Interactive Map (Week 2)
- Set up Leaflet.js integration
- Implement medical density calculations
- Create map components and filtering
- Integrate with existing listing data

### Phase 4: Contract System (Week 2-3)
- DocuSeal API integration
- Contract generation workflow
- Payment processing for contracts
- E-signature and storage system

### Phase 5: Blog System (Week 3)
- Create blog listing and detail pages
- Implement admin content management
- Add SEO optimization
- Set up content categories

## 📋 Technical Requirements

### Dependencies to Add
```json
{
  "react-leaflet": "^4.2.1",
  "leaflet": "^1.9.4",
  "@stripe/stripe-js": "^2.4.0",
  "chart.js": "^4.4.1",
  "react-chartjs-2": "^5.2.0",
  "@tiptap/react": "^2.1.16",
  "@tiptap/starter-kit": "^2.1.16"
}
```

### Environment Variables Needed
```env
DOCUSEAL_API_KEY=your_docuseal_api_key
DOCUSEAL_WEBHOOK_SECRET=your_webhook_secret
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
MEDICAL_DENSITY_API_KEY=your_api_key (if using external service)
```

### External APIs Integration
1. **DocuSeal**: Contract generation and e-signatures
2. **Stripe**: Payment processing for boosts and contracts
3. **Medical Density Data**: French healthcare professional registry
4. **Mapping Service**: Leaflet.js with OpenStreetMap tiles

---

## ✅ Success Criteria

Each feature will be considered complete when:

1. **Interactive Map**: Users can visualize medical density and find listings geographically
2. **Blog System**: Content management is fully functional with SEO optimization
3. **Contract Generation**: End-to-end contract creation, payment, and e-signature workflow
4. **Payment System**: Boost listings with enhanced visibility and payment processing
5. **Analytics**: Comprehensive reporting and performance tracking for users and platform

This implementation will complete the Doctonext platform according to the PRD specifications.
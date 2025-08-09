The app is like a copy of leboncoin, but for the medical field

✅ Specifications – Doctonext

1. 🎯 Project Objective
Develop a modern, responsive, and secure web platform aimed at facilitating:

Connecting medical practitioners transferring or taking over practices.

Publishing and searching listings for the sale of patient bases, businesses, and temporary replacement offers.

Analyzing geographic opportunities through an interactive medical density map.

Managing the entire process via secure messaging, smart alerts, and a personal dashboard.

2. 👤 Target Users
Transferors / Sellers: Practitioners ending their activity or organizations wishing to transfer their patient base or business.

Replacement Practitioners: Seeking temporary assignments.

Buyers / Acquirers: Recent graduates, mobile practitioners, or project holders.

Visitors: Curious users or those exploring opportunities.

3. 🔐 Authentication & Roles
Registration via email + password with captcha.

Authentication managed via BetterAuth.

Roles: A single role to post ads and contact others.

Secure session management (middleware + server).

4. 🔧 Features
4.1. 📢 Listings
Guided multi-step submission form with:

Medical specialty

Location (with map)

Type of practice

Revenue / Turnover / Sale price

Detailed description

Photo or document uploads (via UploadThing)

Premium options (Boost ad, premium/urgent badge)

Public view of listings with dedicated page.

Delete/edit from dashboard.

4.2. 🔍 Smart Search
Search engine with filters:

Specialty

Region / department / city

Type of practice

Budget

Sort: relevance, newest, price.

Save searches (alerts).

4.3. 🗺 Interactive Map
Map of medically over- or under-served areas.

Display listings on map.

Dynamic filtering by specialty and location.

Color gradient: green (opportunity) to red (saturated).

4.4. 💬 Internal Messaging
Private messaging system between buyers and sellers.

Email notifications for new messages.

Conversation history viewable in dashboard.

4.5. 👤 User Area
Secure dashboard (login required) with:

My listings

Favorites

Messages

Saved alerts

Statistics: views, contacts, interest rate

4.6. 🔔 Custom Alerts
Users can save searches.

Automatic email alerts when matching listings appear.

Alerts management interface in dashboard.

4.8. 📚 Blog / Resource Center
List of articles: procedures, help, testimonials.

SEO-friendly individual pages (MDX or database).

👤 User Journey 1 — Searching User (Buyer, Replacement, Collaborator)
Goal: Find a relevant listing, get in touch, possibly initiate quick contact.

Steps:

Homepage or landing page.

Click “Listings”.

Can register immediately or browse as guest (registration required to contact).

Filtered search form:

Type: replacement / transfer / collaboration.

Specialty (dropdown).

Location (postal code, region, city).

Dates (if replacement).

Practice type (solo, group, etc.).

Email alert option (for logged-in users).

Option to favorite listings.

Results page:

Listings list (map + summary).

Dynamic filters (turnover, availability date, full/part time).

Sort by relevance or date.

Listing detail page:

Description, location, turnover, photos, practical info.

“Contact” button → opens secure messaging (if registered).

Messaging:

Direct discussion interface.

Email notification for each message.

👤 User Journey 2 — Posting User (Seller, Outgoing Replacement, Lessor)
Goal: Quickly post a clear, visible, and contactable listing.

Steps:

Homepage → “Post a listing”.

Create account if not already registered.

Provide professional ID (name, specialty, RPPS or ADELI number optional).

Check “I certify I am a healthcare professional”.

Email + password.

Listing form:

Practitioner info: name, profession, specialty, RPPS/ADELI.

Practice location: address, postal code, city, region, density zone (auto-calculated).

Transfer details: type, availability date, reason, practice mode, partners, software used.

Financial info: annual turnover, charges %, sale price, accompaniment option.

Attachments: photos, documents.

Publishing options: immediate/delayed, notifications, premium boost option.

End: “Publish my listing” → confirmation + dashboard access.

Listing goes public, notifications sent for messages.

Dashboard: manage messages, edit/delete listing, boost option.

🧾 Replacement Listing Form
Goal: Let healthcare professionals post clear, complete, and appealing replacement offers.

Practitioner info (prefilled if logged in).

Replacement location: address (optional), postal code, city, region.

Replacement details: type, dates, working days, assistant, practical terms (housing, fee share).

Free description (max 1,000 characters).

Optional economic info (fee share %).

Optional media (photos).

Publication options: immediate/delayed, email alerts, allow later boost.

Preview before publishing.

📄 Contract Generation & E-signature with DocuSeal
Goal: Offer DoctoNext users an automated tool to generate and e-sign official contracts (replacement, patient base transfer, collaboration) compliant with professional boards’ templates.

Price: €5 per contract (paid by the transferor/replaced practitioner).

Features:

Access official templates (by profession: doctors, dentists, physios, nurses).

Auto-generate & pre-fill using user and listing data.

Edit & customize certain fields, preview PDF.

Integrated e-signature with automatic sending to both parties, storage in personal space, and PDF download in triplicate.

Monetization: flat fee via Stripe/PayPal.

Tracking & archiving: dashboard with status (draft, pending, signed) and contract history.

Workflow:

Publish listing → applicant contacts → “Generate contract” button → prefilled form → verification → payment → e-signature → archiving.
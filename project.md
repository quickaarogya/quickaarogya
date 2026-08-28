# Quick Aarogya — Comprehensive Project Master Documentation

**Project Name**: Quick Aarogya  
**Tagline**: Unified Multi-Vendor Healthcare Marketplace + Personal & Family Health Management Platform  
**Target Ecosystem**: India (ABHA/ABDM-ready, vernacular-ready, multi-channel notifications, 24/7 hospital & express pharmacy network)  
**Last Updated**: 2026-08-29  

---

## 1. Executive Summary & Vision

**Quick Aarogya** is an enterprise-grade digital healthcare platform engineered to bridge healthcare discovery and daily personal health management into a unified, high-performance ecosystem.

The platform operates on two interconnected pillars:
1. **The Multi-Vendor Healthcare Marketplace**: Connecting patients with verified medical specialists, multi-specialty hospitals, retail pharmacies, diagnostic laboratories, and emergency care providers.
2. **The Personal & Family Health Management Platform**: Empowering patients and authorized caregivers to track daily medication regimens, store encrypted clinical records, manage family proxies with least-privilege permissions, monitor live OPD queues, and access life-saving emergency medical profiles.

---

## 2. Core Architectural Paradigms

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            QUICK AAROGYA PLATFORM                           │
├─────────────────────┬───────────────────────────┬───────────────────────────┤
│     DOCTORS APP     │         PHARMA APP        │         CARE APP          │
│  (#026dd9 Royal)    │     (#0F766E Deep Teal)   │   (#BE123C / Coral Rose)  │
│ • Specialist OPD    │ • 10-Min Express Dispatch │ • Clinical Bio Profile    │
│ • Popular Carousel  │ • Brand Partners Network  │ • Live Health Vitals Log  │
│ • Live Token Queue  │ • 2x2 Flash Offers        │ • Timed Regimen & Refill  │
│ • Clinic & Hospital │ • OTC & Rx Medicine Cart  │ • Encrypted ABHA Vault    │
│ • Teleconsultations │ • Wishlist Saved Meds     │ • Family Care Delegation  │
├─────────────────────┴───────────────────────────┴───────────────────────────┤
│                          SHARED HEALTH FOUNDATION                           │
│ • Medical Document Vault (Lab Reports, Prescriptions, Biomarkers, Tax 80D)  │
│ • Family Caregiver Delegation & Granular Permissions Engine                 │
│ • Unified Health Inbox & Deterministic Notification Center                  │
│ • Emergency ICE QR Profile (Blood Group, Allergies, Triage PIN Challenge)   │
│ • Healthcare Expense & Out-of-Pocket Insurance Claim Ledger                 │
│ • Global Glassmorphism Design System (Ambient Mesh & Frosted Depth)        │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1. Tri-Cockpit App Mode Architecture
Quick Aarogya utilizes a **Tri-Cockpit architecture** accessible via a floating frosted glass mode switcher:
- **Doctor Mode (`#026dd9`)**: Tailored for doctor discovery, verified specialist carousels, live OPD queue token tracking, private clinic discovery, hospital emergency helplines, and consultation booking.
- **Pharma Mode (`#0F766E`)**: Tailored for 10-minute express doorstep delivery, trusted brand partners (Apollo 24|7, Cipla, GSK, Sun Pharma), curated category photo tiles, flash offers, and digital prescription checkout.
- **Care Mode (`#BE123C` / `#ff645e`)**: Tailored for patient clinical identity, Biological Health Profile (Blood group, BMI, Allergies, Chronic conditions), live sensor health vitals (BP, Blood Glucose, Heart Rate, SpO2), timed pill adherence with 1-tap dose logging, and ABHA encrypted document vault.

### 2. Dynamic Bottom Navigation
- *Doctors Mode*: `Home` (`/`) | `Doctors` (`/doctors`) | `My Tokens` (`/appointments`) | `Menu` (`/more`)
- *Pharma Mode*: `Home` (`/`) | `Shop` (`/pharmacies`) | `Cart` (`/cart`) | `Menu` (`/more`)
- *Care Mode*: `Health Hub` (`/`) | `My Meds` (`/medicines`) | `ABHA Vault` (`/records`) | `Family` (`/family`)

### 3. Technology Stack
- **Framework**: Next.js 16 (App Router with Server Components and Client Interactivity)
- **Language**: TypeScript 5 (Strict type checking, zero `any` leaks in domain models)
- **UI & Styling**: TailwindCSS 4, CSS Custom Properties Design Tokens, Lucide React icons
- **Design Aesthetic**: Ultra-premium **Glassmorphism Design System** with `.ambient-glow-mesh` canvas background, frosted blur layers (`backdrop-blur-xl` / `backdrop-blur-2xl`), luminous border accents (`border-white/80`), and glowing active indicators.
- **State Management**: Zustand stores (`useCareContextStore`, `useAppModeStore`, `useCartStore`)
- **Persistence Layer**:
  - *Current Execution*: `AarogyaStorage` synchronous storage engine supporting local storage persistence with real-time cross-tab and cross-component event bus synchronization.
  - *Schema Specification*: Prisma ORM with 27 PostgreSQL relational models (`prisma/schema.prisma`).
- **Testing Engine**: Vitest test runner with 19 test suites and 121 automated unit/integration tests.

---

## 3. Phase-by-Phase Development Journey

### Phase 0: System Architecture & Foundation
- Initialized project topology, Prisma database schema (27 tables), and core domain TypeScript interfaces (`src/types/index.ts`).
- Created design system tokens (Accessible Teal `#0d9488`, Clinical Blue `#1A73E8`, Slate palette, Dark Mode).
- Built reusable UI atomic component library (Buttons, Cards, Badges, Status Badges, Page Headers, Section Headers, Alerts, Modals, Empty States).

### Phase 1: Authentication, Role-Based Access & Onboarding
- Multi-identifier authentication supporting mobile phone number and email with OTP verification simulation.
- 3-step personalized patient onboarding with ABHA ID linking, blood group selection, height/weight BMI calculation, and chronic health condition profiling (`/onboarding`).
- Care context switcher allowing seamless toggling between primary user profile and managed family member profiles.

### Phase 2: Doctor Discovery & OPD Queue Management
- Specialist directory featuring cardiology, general medicine, pediatrics, orthopedics, dermatology, and ENT.
- Multi-attribute filtering by specialty, consultation fee, rating, and hospital affiliation.
- Live OPD Queue card displaying token number, estimated wait times, and consultation status updates.
- 24/7 Hospital & Emergency Directory with ICU bed counters, trauma care tags, and emergency helpline shortcuts (`/hospitals`).

### Phase 3: Medication Regimen & Adherence Tracker
- Daily medication regimen with morning, afternoon, and evening dose checkpoints (`/medicines`).
- 1-Click "Log Dose Taken" and "Skip Dose" actions updating live inventory counters.
- Automatic low-medicine refill alerts when remaining stock drops below safety threshold (e.g. $\le 5$ days).
- 7-Day medication adherence streak tracker.

### Phase 4: Medical Document Vault & Health Locker
- Encrypted document storage supporting 8 categories: Prescriptions, Lab Reports, Discharge Summaries, Radiology Scans, Vaccination Records, Insurance Policies, Invoices, and Other (`/records`).
- Automated clinical biomarker extraction table (HbA1c, Fasting Blood Glucose, Serum Creatinine, Blood Pressure).
- Filterable document archive by family member, category, and date range.

### Phase 5: Express Pharmacy & Doorstep Delivery
- Pharmacy catalog with medicine search, packaging details, MRP discount calculations, and prescription requirements (`/pharmacies`).
- Dedicated shopping cart (`/cart`) with quantity modifiers, price breakdown, and delivery speed selector (45-min Express vs 2-hr Standard).
- Digital prescription attachment linked directly from the patient's verified document vault.
- Order lifecycle tracking from placement to dispatch and doorstep delivery.

### Phase 6: Family Health Management & Granular Permissions
- Comprehensive family profile management supporting `Parent`, `Child`, `Spouse`, `Relative`, and `Caregiver` (`/family`).
- **8 Granular RBAC Permissions**:
  `VIEW_APPOINTMENTS`, `BOOK_APPOINTMENTS`, `VIEW_MEDICATIONS`, `MANAGE_MEDICATIONS`, `VIEW_RECORDS`, `UPLOAD_RECORDS`, `VIEW_EXPENSES`, `MANAGE_EXPENSES`.
- Enforced caregiver least-privilege defaults (`['VIEW_APPOINTMENTS', 'VIEW_MEDICATIONS']`) preventing unrestricted caregiver access.
- Strict authorization engine (`FamilyService.checkPermission`) preventing horizontal privilege escalation (BOLA/IDOR).
- Unified Family Dashboard live feed aggregating upcoming visits, low refills, dose reminders, and vaccination schedules across all members.

### Phase 7: Health Inbox & Unified Activity Center
- Centralized notification center aggregating events from 7 categories: Appointments, Medicines, Records, Orders, Family, Tests, and Payments (`/inbox`).
- **Deterministic Priority Engine**: Explicit priority rules (`urgent`, `important`, `normal`) with strict prohibition of AI-based medical urgency hallucinations.
- Multi-channel delivery engine tracking status across `in_app`, `push`, `sms`, `email`, and `whatsapp`.
- Live unread badge counters integrated into the top-right header on mobile and desktop layouts.

### Phase 8 – 10: Dual-App Layout & Dynamic Navigation
- Developed the floating mode switch capsule matching healthcare design specifications.
- Implemented mode-adaptive Home Cockpits.
- Prominent top-right Bell notification button across all headers.
- Full shopping cart and checkout page (`/cart`).

### Phase 11: Complete Product Audit & Marketplace Readiness
- Comprehensive audit of the codebase, database schema, security boundaries, and multi-vendor topology.
- Identified multi-tenant data decoupling needs (`User`, `PatientProfile`, `VendorAccount`, `Organization`, `StaffMember`).
- Defined a 6-phase transformation roadmap (Phases 12–17) for transitioning into a commercial multi-vendor marketplace.
- Created master audit report [`PRODUCT_AUDIT_REPORT.md`](file:///c:/Users/thesh/Downloads/Quick%20Aarogya/PRODUCT_AUDIT_REPORT.md).

### Phases 12 – 21: Multi-Tenant Marketplace & Vendor Backend
- **Phase 12 (Server-Side Persistence)**: PostgreSQL database backing with Prisma ORM and dual-mode real-time state synchronization.
- **Phase 13 (Identity & Tenancy Split)**: `Organization` and `StaffMember` models decoupled from patient identity with zero regression to existing user sessions.
- **Phase 14 (Supabase Integration & Migrations)**: Supabase PostgreSQL migration tracking as the single source of truth.
- **Phase 15 (Entity Tenant Ownership)**: Linking all doctors and pharmacies to verified organizations with zero patient-facing disruption.
- **Phase 16 (Vendor Security & RBAC Engine)**: Least-privilege role matrix and PostgreSQL row-level security policies preventing cross-tenant escalation.
- **Phase 17 (Doctor Working Console)**: OPD Queue token advance, clinical timeline notes, and live weekly availability template manager.
- **Phase 18 (Pharmacist Order Desk & Prescription Audit)**: Pharmacist order queue, digital prescription document compliance audit, and live retail stock management.
- **Phase 19 (Vendor Inbox & Notification Stream)**: Tenant-scoped deterministic notification engine for urgent cancellations, prescription audits, and settlement alerts.
- **Phase 20 (Multi-Vendor Cart Splitting)**: Splitting multi-pharmacy checkouts into parent order envelopes with independent sub-order lifecycles and isolated vendor action desks.
- **Phase 21 (Financial Escrow Ledger & Commission Engine)**: Escrow-style ledger entries triggered on consultation completion and order delivery, tenant-scoped earnings views, and platform admin commission aggregation.

---

## 4. UI/UX Evolution & Recent Major Enhancements

### 1. Doctor Side Royal Blue Theme (`#026dd9`)
- Completely unified the Doctor cockpit, doctor discovery directory, doctor profile view, and appointments booking flow to strict royal blue branding (`#026dd9`).
- Replaced mismatched teal/indigo elements across Doctor headers, category badges, specialty selectors, OPD queue status cards, date/time slot selectors, and confirmed consultation tokens.

### 2. Popular Doctor Carousel Component (`TopDoctorCarousel.tsx`)
- Converted top specialist discovery into an interactive **Popular Doctor Carousel** adhering to modern digital healthcare UI standards:
  - **Rating Badge**: Frosted glass rating pill (`⭐ 4.9`) on top-left.
  - **Favorite/Wishlist Button**: Heart toggle button (`🤍` / `❤️`) on top-right linked directly to `AarogyaStorage`.
  - **Dynamic Punchy Headline**: Specialty-tailored headlines (e.g. *Dr. Pure Heart*, *Dr. Fresh Smile*, *Dr. Skin Glow*, *Dr. Gentle Care*).
  - **Doctor Portrait**: Edge-blended high-resolution medical specialist portraits.
  - **Frosted Action Strip**: Translucent bottom glass strip displaying doctor name, consultation fee, and high-contrast solid blue `"Booking Now"` CTA pill.
  - **Auto-Play & Touch Gestures**: Mobile swipe gestures, animated dot indicators, and pause-on-hover mechanics.

### 3. Global Glassmorphism Design System
- Built an extensive glassmorphic design token suite in [`src/app/globals.css`](file:///c:/Users/thesh/Downloads/Quick%20Aarogya/src/app/globals.css) and [`src/app/layout.tsx`](file:///c:/Users/thesh/Downloads/Quick%20Aarogya/src/app/layout.tsx):
  - `.ambient-glow-mesh`: Ambient radial chromatic mesh with glowing blur spheres for physical background depth.
  - `.glass`: Frosted backdrop with `backdrop-filter: blur(16px) saturate(180%)`, luminous border reflections (`rgba(255,255,255,0.65)`), and top highlight borders.
  - `.glass-card`: Card containers with translucent background, subtle border highlight, and soft elevation shadow.
  - `.glass-pill` & `.glass-input`: Translucent badges, chips, and search inputs with active focus illumination.
  - Applied across `AppModeFloatingSwitch`, `MobileNav`, `MobileHeader`, `Card`, `ProductDetailSheet`, `LocationModal`, and all three Home Cockpit modes.

### 4. Dedicated Full-Page Wishlist (`/wishlist`)
- **Single Frosted Sticky Header**: Unified top navigation with back button (`<ChevronLeft />`), title, live count pill, dual tab switcher (**Saved Doctors** vs **Saved Meds**), and in-wishlist search input.
- **Saved Doctors**: Specialists cards with avatars, ratings, qualifications, hospital affiliations, consult fees, 1-tap **"Book Appointment"** actions, and trash remove icons.
- **Saved Meds**: Medicines cards with product images, dosage strengths, discount pills, 10-minute dispatch tags, prices, 1-tap **"+ Add to Cart"** integration, and trash remove icons.
- **Cross-Component Sync**: Real-time cross-tab updates via `AarogyaStorage` and `storage-update` event bus.

### 5. Unified Location Pill & Header Cluster Across All 3 Cockpits
- **Standardized Top Row Layout**: Consistently implemented across **Doctor Mode**, **Pharma Mode**, and **Care Mode**:
  - **Left**: User Profile Avatar / Initial Badge + Greeting (`Hi, Arjun!`) & Mode Context.
  - **Right Cluster**: `[📍 New Delhi]` Location Pill + `[🤍 Wishlist]` Heart Link + `[🔔 Notifications]` Bell Link.
- **Interactive Location Modal**: Clicking the Location pill anywhere opens the interactive `LocationModal` for 1-tap delivery address and region selection.

---

## 5. Application Sitemap & Route Catalog

| Route | View Name | Mode Focus | Primary Features |
| :--- | :--- | :--- | :--- |
| `/` | Home Cockpit | Tri-Mode | Mode-adaptive cockpit for Doctors, Pharma, and Care modes |
| `/doctors` | Specialist Directory | Doctors | Doctor search, specialty filter, slot availability, consultation booking |
| `/appointments` | Appointments Manager | Doctors | Active appointments, live OPD queue token tracking, cancellation/reschedule |
| `/hospitals` | Hospital & ER Directory | Doctors | Multi-specialty hospitals, ICU bed availability, 24/7 trauma emergency helplines |
| `/pharmacies` | Pharmacy & Store | Pharma | Browse medicines, chronic care categories, brand partners, nearby pharmacies |
| `/medicines` | Medication Regimen | Care/Pharma | Daily timed pill schedule, dose logging, refill threshold alerts, adherence stats |
| `/cart` | Medicine Cart & Checkout | Pharma | Cart items, quantity controls, auto-attached prescription, express delivery, checkout |
| `/records` | Medical Document Vault | Care | Encrypted document repository, biomarker extraction, upload modal |
| `/family` | Family Caregiver Hub | Care | Manage family members, granular permissions, caregiver live feed |
| `/inbox` | Health Activity Inbox | Shared | Unified notifications, priority categorization, action buttons |
| `/emergency` | Emergency ICE Profile | Shared | Life-saving medical triage summary, QR code token, PIN challenge |
| `/expenses` | Healthcare Expense Ledger| Shared | Out-of-Pocket tracking, Tax 80D receipt breakdown, insurance claim status |
| `/profile` | Patient Profile | Shared | Personal vitals, ABHA digital health ID card, blood group, BMI |
| `/settings` | Privacy & Settings | Shared | Consent management, security audit log viewer, dark mode toggle |
| `/labs` | Diagnostic Lab Booking | Shared | Home sample collection, phlebotomist tracking, diagnostic packages |
| `/login` | Authentication Portal | Shared | Mobile/Email login, OTP simulation, role selection |
| `/wishlist` | Saved Wishlist | Shared | Dedicated full-page view for saved doctors & express medicines with search |
| `/more` | More Destinations Menu | Shared | Grouped navigation hub linking to all platform modules |

---

## 6. Security, Privacy & Safety Architecture

1. **Zero-AI Clinical Boundaries**:
   - Diagnostic suggestions and urgency classifications are driven by deterministic clinical rules and verified medical workflows. AI is strictly prohibited from autonomously modifying dosages, prescribing drugs, or classifying clinical urgency.
2. **Horizontal Privilege Escalation (BOLA/IDOR) Prevention**:
   - Access to family member records is gated by `FamilyService.checkPermission`, ensuring caregivers cannot view documents or expenses unless explicitly authorized by the grantor.
3. **Emergency Profile Safety**:
   - Public emergency QR codes expose only life-saving triage data (Blood Group, Critical Allergies, Emergency Contacts). Full medical histories require a PIN challenge.
4. **Financial & Data Integrity**:
   - Zero storage of raw credit/debit card numbers. All transactions utilize tokenized UPI references or mock gateway tokens.

---

## 7. Testing & Quality Assurance Summary

```
Test Suites: 19 passed (19 total)
Tests:       121 passed (121 total)
Duration:    5.37s
TypeScript:  0 errors (npx tsc --noEmit passed clean)
```

### Verified Test Suites:
1. `tests/vendor-access-boundaries-audit.test.ts`: Comprehensive cross-tenant boundary verification, patient vs vendor isolation, role-based permission limits, doctor intra-org tampering guard, and deactivated staff enforcement.
2. `tests/vendor-financial-ledger.test.ts`: Automated financial escrow ledger entries on appointment completion and pharmacy sub-order delivery, platform commission fee calculations (10% hospital/doctor, 8% pharmacy), tokenized references (`TXN-ESCROW-...`), and platform admin payout settlement.
3. `tests/multi-vendor-cart-splitting.test.ts`: Multi-vendor cart splitting into parent envelopes and independent sub-orders, isolated pharmacy desk visibility, and asynchronous status progression.
4. `tests/vendor-inbox-stream.test.ts`: Vendor-facing notification stream with deterministic priority resolution and tenant isolation.
5. `tests/pharmacy-cross-session-desk.test.ts`: Pharmacist working order desk, prescription compliance audit dialog, and retail inventory management.
6. `tests/doctor-cross-session-console.test.ts`: Doctor OPD working console, live token progression, availability editor, and cross-session patient visibility.
7. `tests/vendor-security-rbac.test.ts`: Defense-in-depth vendor RBAC permission engine, least-privilege role matrices, and tenant boundary enforcement.
8. `tests/vendor-verification-flow.test.ts`: Vendor onboarding compliance workflow (`PENDING` -> `VERIFIED`/`REJECTED`) and patient directory filtering.
9. `tests/vendor-tenants.test.ts`: Additive `Organization` and `StaffMember` tenancy split and backward-compatible patient authentication.
10. `tests/backend-shared-session.test.ts`: Shared PostgreSQL persistence, cross-session mutations, and real-time state synchronization.
11. `tests/navigation.test.ts`: Dynamic app navigation items, mode transitions, and cart state.
12. `tests/family.test.ts`: Granular permissions, caregiver least-privilege defaults, family dashboard aggregation.
13. `tests/security.test.ts`: Privilege escalation defense, horizontal data isolation, cross-tenant access rejection.
14. `tests/inbox.test.ts`: Deterministic notification priority rules, category filtering, multi-channel logs.
15. `tests/pharmacy.test.ts`: Pharmacy orders, stock deductions, prescription validation, express delivery.
16. `tests/medication.test.ts`: Pill schedule adherence, dose logging, low-refill threshold triggers.
17. `tests/appointment.test.ts`: Doctor slot booking, OPD queue token incrementation, status lifecycles.
18. `tests/document.test.ts`: Document classification, biomarker extraction, encryption simulation.
19. `tests/auth.test.ts`: Multi-factor authentication, phone/email login, role resolution.

---

### UI Polish & Text Wrap Protection
- **Single-Line Button Enforcement**: All action pills, category header links, badge counters, and CTA buttons (`Switch Profile`, `Open ICE`, `View Store >`, `See all >`, `Edit Details >`, `+ Log Vitals`, `Care Hub`, `Take Dose`) enforce `whitespace-nowrap shrink-0` alongside `min-w-0` on companion text containers to prevent multi-line button wrapping on compact mobile displays (down to 320px).
- **Doctor Portrait Cards**: Modern portrait doctor cards with full-width studio portraits, top rating pill & wishlist toggle, and overlapping frosted glass bottom panels (`backdrop-blur-xl bg-white/90`) featuring doctor name, specialty fee, micro-badge icons (specialty, experience, verified badge), and circular `↗` action CTA buttons across Homepage, Doctor Directory, and Wishlist.
- **Edge-to-Edge Filled Product Images**: Medicine thumbnails across the Pharma homepage, Product Detail Sheet, Pharmacy Directory, and Wishlist use full-bleed `w-full h-full object-cover rounded-2xl` containers without letterbox margins or white gaps.
- **Glassmorphism Theme Unification**: Consistent frosted cards (`.glass-card`), ambient lighting backdrops, and interactive controls across Doctor Mode (#026dd9), Pharma Mode (#0F766E), Care Mode (#ff645e), Cart, and More.

---

*Quick Aarogya is designed and maintained as a modern, reliable, and accessible healthcare ecosystem for Bharat.*

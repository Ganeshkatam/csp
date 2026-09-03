# Community Service Project (CSP) — Digital Village Information Portal

A 4-Week (100-Hour Minimum) Field-Driven Community Service Project for B.Tech Computer Science and Engineering (CSE).

---

## Project Overview

- **Project Title**: Digital Village Information Portal — Community Service Project (CSP)
- **Core Principle**: **Survey -> Evidence -> Problem Identification -> Portal Implementation -> Community Testing**
- **Technology Stack**: React 19, Vite 8, Pure CSS Design System, Lucide Vector Icons, Supabase PostgreSQL (RLS Protected).
- **Academic Context**: Developed as a student CSP initiative to assist rural citizens with verified access to welfare scheme rules, public emergency services, healthcare/PHC timings, schools, and local village businesses.

---

## Architecture & Features

1. **Public Citizen Portal (`/`)**:
   - 100% Database-Driven: Loads assigned village, Gram Panchayat, mandal, and district directly from Supabase with zero hardcoding.
   - Citizen Services Corner: Modeled after national public service portals with quick-access hubs.
   - Verified Welfare Schemes: Eligibility criteria, document checklists, and direct `.gov.in` portal links.
   - Emergency & Local Contacts: One-tap direct mobile dialing (`tel:`) for 108 Ambulance, 100 Police, 104 Health, and local panchayat officials.
   - Primary Health Centre (PHC) & Schools: Live operating hours calculator displaying **OPEN NOW** or **CLOSED** in real time.
   - Local Business & Artisans: Directory of village electricians, mechanics, repairers, and SHGs.
   - Citizen Feedback & Correction Desk: Community reporting mechanism directly connected to the Supabase database.
   - Dynamic Mobile Evaluation QR Code: Generates a live QR code allowing evaluators and citizens to test on mobile phones.

2. **Field Survey Module (`/survey`)**:
   - Standardized 18-question questionnaire (21 variables).
   - Offline-first caching in `localStorage` with automated reconnection detection and 1-click cloud sync.
   - Pseudonymous household identifiers (`HH-001`) strictly ensuring zero PII collection.

3. **Analytics Dashboard (`/dashboard`)**:
   - Live metrics (Households surveyed, Smartphone penetration, Scheme document hurdles, Emergency contact void).
   - 1-Click CSV export (`csp_survey_responses_YYYY-MM-DD.csv`) for analytical reports.

4. **Administrative Console (`/admin`)**:
   - Secure Supabase Auth login.
   - Complete CRUD management for village profile, announcements, schemes, contacts, facilities, and citizen feedback.

5. **Accessibility & Localization**:
   - Full bilingual support (English and Telugu) with instant toggle and zero page reloads.
   - GIGW-compliant font-size adjustment (`A` / `A+`).
   - Sticky header with custom 100px scroll margins for unobstructed section viewing.

---

## Repository Structure

```text
e:/csp/
├── app/                           # Production React + Vite Application
│   ├── src/
│   │   ├── components/            # Header, Footer, and navigation
│   │   ├── views/                 # PublicPortalView, SurveyFormView, DashboardView, AdminConsoleView
│   │   ├── lib/                   # Supabase client, bilingual dictionaries (i18n.js)
│   │   ├── App.jsx                # Clean SPA router (zero .html in URLs)
│   │   ├── main.jsx               # React entry point
│   │   └── index.css              # Custom CSS design system
│   ├── index.html                 # Single-page HTML entry template
│   ├── package.json               # App dependencies & scripts
│   └── vite.config.js             # Vite configuration
│
├── survey/                        # Field survey questionnaires, schema & methodology
├── awareness/                     # Week 2 community digital awareness campaign materials
├── database/
│   └── schema.sql                 # Supabase PostgreSQL schema with RLS policies
├── documentation/
│   ├── daily-logbook.md           # 100-hour / 24-day certified daily logbook
│   ├── final-report.md            # Comprehensive academic project report
│   └── viva-guide.md              # Viva defense handbook
│
├── LICENSE                        # Apache License 2.0
├── package.json                   # Root proxy scripts
└── .gitignore                     # Git ignore rules
```

---

## Getting Started

### 1. Install Dependencies
```powershell
npm run build
```
*(Dependencies are already installed in `app/node_modules/`)*

### 2. Run Development Server
From the root repository:
```powershell
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Production Build
```powershell
npm run build
```
Generates production-optimized static assets in `app/dist/`.

---

## License
This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

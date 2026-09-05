# Legacy Code Archive (Pre-Modular Frontend)

This folder contains pre-modular React components and views preserved for historical reference and project submission traceability.

## Archived Contents

### Views (`legacy/views/`)
- `PublicPortalView.jsx`: Initial monolithic public portal view. Superseded by domain-driven routes under `src/pages/` (`HomePage.jsx`, `SchemesPage.jsx`, `ContactsPage.jsx`, etc.) managed via React Router.

### Components (`legacy/components/`)
- `AnnouncementCard.jsx`: Preserved initial announcement card. Superseded by `src/features/announcements/components/AnnouncementCard.jsx`.
- `BusinessCard.jsx`: Preserved initial artisan/business card. Superseded by `src/features/businesses/components/BusinessCard.jsx`.
- `ContactCard.jsx`: Preserved initial contact card. Superseded by `src/features/contacts/components/ContactCard.jsx`.
- `FeedbackForm.jsx`: Preserved initial feedback submission form. Superseded by `src/features/feedback/components/FeedbackForm.jsx`.
- `Footer.jsx`: Preserved initial static footer. Superseded by `src/components/navigation/Footer.jsx`.
- `Header.jsx`: Preserved initial monolithic header. Superseded by `src/components/navigation/Header.jsx`.
- `InstitutionCard.jsx`: Preserved generic institution card. Superseded by `src/features/healthcare/components/HealthcareCard.jsx` and `src/features/education/components/EducationCard.jsx`.
- `MobileBottomNav.jsx`: Preserved initial bottom bar. Superseded by `src/components/navigation/MobileBottomNav.jsx`.
- `SchemeCard.jsx`: Preserved initial welfare scheme card. Superseded by `src/features/schemes/components/SchemeCard.jsx`.
- `SearchBar.jsx`: Preserved initial search box. Superseded by modern filter pills and search inputs across dedicated pages.
- `ServiceGrid.jsx`: Preserved initial service grid. Superseded by Bento hub service cards on `HomePage.jsx`.

### Libraries & Styles (`legacy/lib/`, `legacy/`)
- `lib/i18n.js`: Initial monolithic localization dictionary. Superseded by modular localization structure under `src/i18n/` (`en.js`, `te.js`, `index.js`).
- `App.css`: Default boilerplate styles from initial Vite template. Master styling is handled by `src/styles/tokens.css` and `src/styles/globals.css`.

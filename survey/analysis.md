# Socio-Economic Survey Analysis & Problem Identification Framework

**Habitation**: [Assigned Village Name], [Assigned Gram Panchayat], [Assigned Mandal/Taluk], [Assigned District]  
**Academic Requirement**: CSP Week 1 Deliverable — Problem Analysis and Requirements Justification

---

## 1. Survey Methodology

### 1.1 Sampling Design
- **Target Population**: Permanent resident households of [Assigned Village Name].
- **Sampling Technique**: Systematic random sampling across all major residential streets / wards / habitations to ensure diverse representation of caste groups, occupational categories, and income levels.
- **Sample Size ($N$)**: Minimum 30 to 50 households surveyed in person.
- **Data Integrity Rule**: All statistics in this report must be computed directly from the entries recorded in `raw-responses.csv`. No hypothetical, synthetic, or estimated percentages are permitted.

### 1.2 Computation Formula
For any metric $M$ in question $Q$:
$$\text{Percentage } (\%) = \left(\frac{\text{Count of responses matching criteria for question } Q}{\text{Total valid answers recorded for question } Q}\right) \times 100$$
*Note: Using the question-specific answer count as the denominator prevents statistical distortion if any optional question is skipped by a respondent.*

---

## 2. Survey Analysis & Metric Framework

*(Values in square brackets are calculated from `raw-responses.csv` once the field survey is completed)*

### 2.1 Demographic & Socio-Economic Profile
- **Total Households Surveyed ($N$)**: [Enter actual N]
- **Major Occupations**:
  - Agriculture & Allied Labor: [Count] ([%]%)
  - Small Business & Local Trades: [Count] ([%]%)
  - Salaried / Private Services: [Count] ([%]%)
- **Educational Profile**:
  - Households with at least one member completing Class 12 or higher: [Count] ([%]%)
  - *Analytical Interpretation*: Assesses whether households have a resident "digital mediator" who can navigate mobile web portals on behalf of senior or non-literate members.

### 2.2 Digital Infrastructure Baseline
- **Smartphone Penetration (`TECH1`)**:
  - Households with at least one active smartphone: [Count] ([%]%)
  - Basic phone only or no mobile: [Count] ([%]%)
- **Network Quality (`TECH2`)**:
  - Predominantly 4G/5G mobile data: [Count] ([%]%)
  - Low-bandwidth or intermittent 2G/3G connectivity: [Count] ([%]%)
- *Engineering Constraint Derived*: The portal must function reliably on low-bandwidth networks without large media files, third-party fonts, or heavy JavaScript bundles.

### 2.3 Local Information Gaps & Public Service Access
- **Welfare Scheme Information Gap (`SCH1`, `SCH2`)**:
  - Households relying on informal channels (word of mouth or intermediaries): [Count] ([%]%)
  - Households experiencing repeated visits due to unknown document checklists: [Count] ([%]%)
- **Domain Identification & Fraud Risk (`SCH3`)**:
  - Households unable to distinguish genuine `.gov.in` / `.nic.in` domains from private or fraudulent sites: [Count] ([%]%)
- **Emergency & Official Contact Void (`CON1`, `CON2`)**:
  - Households lacking verified phone number for the Primary Health Centre / Ambulance: [Count] ([%]%)
  - Households lacking direct contact for the Panchayat Secretary / administrative office: [Count] ([%]%)
  - Households forced to rely on neighbor inquiries during emergencies: [Count] ([%]%)
- **Healthcare & Education Transparency (`HLTH1`, `EDU1`)**:
  - Households that must visit the PHC in person simply to check doctor availability: [Count] ([%]%)
  - Households finding school/Anganwadi details scattered: [Count] ([%]%)
- **Local Business & Artisan Visibility (`BIZ1`, `BIZ2`)**:
  - Households willing to utilize a verified village service and artisan phone directory: [Count] ([%]%)

---

## 3. Identified Problems & Root Cause Analysis

Based on the survey data, the key community problems are synthesized into five core challenge statements:

### Problem 1: Welfare Information Asymmetry and Intermediary Dependency
- **Root Cause**: Government welfare guidelines are published on complex, distributed portals that rural citizens struggle to navigate.
- **Field Consequence**: Citizens incur financial costs paying cyber-cafe operators or intermediaries simply to find out which documents are required.

### Problem 2: Fragmented Emergency & Administrative Contacts
- **Root Cause**: Phone numbers of local officials (Panchayat Secretary, ANM, Lineman, Veterinary Doctor) change periodically and are only displayed on faded physical wall notices.
- **Field Consequence**: During acute medical emergencies, power disruptions, or civic issues, residents face severe delays.

### Problem 3: Unpredictable Healthcare Service Access
- **Root Cause**: Absence of a published, accessible OPD schedule and immunization calendar for the local Primary Health Centre (PHC).
- **Field Consequence**: Daily wage earners lose half a day's wage traveling to the PHC only to discover that the doctor is on official duty elsewhere or medicine stock is unavailable.

### Problem 4: Susceptibility to Online Financial Scams and Fake Portals
- **Root Cause**: Low digital literacy regarding the structure of official government URLs (`.gov.in` / `.nic.in`) and safe OTP handling.
- **Field Consequence**: Citizens are vulnerable to WhatsApp scam links promising spurious direct cash subsidies.

### Problem 5: Economic Invisibility of Village Artisans and Micro-Services
- **Root Cause**: Skilled village tradespersons (tailors, electricians, motor mechanics, SHG handicraft producers) have zero digital presence.
- **Field Consequence**: Villagers hire costlier external technicians from nearby towns while local artisans lose livelihood opportunities.

---

## 4. Problem-to-Requirement Traceability Matrix

Every proposed module of the Village Information Portal must be directly justified by the survey evidence above:

| Identified Problem | Field Survey Evidence | Software Requirement | Implemented Portal Module |
| :--- | :--- | :--- | :--- |
| Problem 1: Scheme Confusion | Survey metric `SCH1` & `SCH2` | Centralized list of key welfare schemes with eligibility rules, document checklist, and verified official government application URLs | **Module 2: Government Schemes** |
| Problem 2: Emergency Contact Delays | Survey metric `CON1` & `CON2` | One-touch dial directory with verified telephone numbers and explicit verification dates | **Module 3: Important Contacts** |
| Problem 3: Unpredictable Healthcare | Survey metric `HLTH1` & `EDU1` | Published OPD timings, immunization schedules, school details, and in-charge contact numbers | **Module 4: Education & Healthcare** |
| Problem 4: Online Fraud Susceptibility | Survey metric `SCH3` | Citizen guidance highlighting genuine `.gov.in` domains and official helpline links | **Awareness Campaign & Scheme Links** |
| Problem 5: Artisan Invisibility | Survey metric `BIZ1` & `BIZ2` | Searchable directory of local village trades, shops, and Self-Help Group (SHG) products | **Module 5: Local Businesses / SHGs** |
| General: Habitation Profile | Survey Demographics `D1-D5` | Overview of village geography, administration, and public amenities | **Module 1: Village Profile** |

---

## 5. Instructions for Finalizing Week 1 Deliverables
1. Complete door-to-door interviews using `survey/questionnaire.md`.
2. Enter every completed interview row into `survey/raw-responses.csv`.
3. Calculate summary counts and percentages into `survey/tabulation.csv`.
4. Replace bracketed indicators `[Count]` and `[%]` in this document with actual empirical figures.
5. Transfer these empirical sections into Chapter 2 and Chapter 3 of `documentation/final-report.md`.

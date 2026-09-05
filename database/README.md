# Database Architecture & Supabase Specification

## 1. Overview
The database backend for the Village Information Portal is built on **Supabase PostgreSQL**. It supports both the **Week 1 Field Survey & Dashboard** and the **Week 3 Public Village Portal** with strict academic integrity, respondent privacy, publication lifecycle management, and Row Level Security (RLS).

---

## 2. Table Architecture & Traceability

| Table Name | Primary Function | Publication Lifecycle / Access | Maps to CSP Component |
| :--- | :--- | :--- | :--- |
| `villages` | Master habitation metadata and profile | Public: Read<br>Admin: Write/Update | Module 1: Village Profile |
| `survey_questions` | Database-driven questionnaire definition (21 items) | Public: Read<br>Admin: Manage | Week 1: Survey Form Generation |
| `survey_responses` | Pseudonymous household interview sessions (No direct resident PII) | Public: No access<br>Admin: Full CRUD | Week 1: Household Survey |
| `survey_answers` | Normalized question-code to answer pairs | Public: No access<br>Admin: Full CRUD | Week 1: Survey Dashboard |
| `announcements` | Verified public notices (Grama Sabha, camps) | Public: `status = 'published'` only<br>Admin: All statuses | Module 2: Important Notices |
| `schemes` | Verified welfare schemes with official URLs | Public: `status = 'published'` only<br>Admin: All statuses (draft, verified, published) | Module 3: Government Schemes |
| `contacts` | Verified emergency and administration directory | Public: `status = 'published'` only<br>Admin: All statuses | Module 4: Important Contacts |
| `institutions` | Schools, Anganwadis, and PHC facilities | Public: `status = 'published'` only<br>Admin: All statuses | Module 5: Education & Healthcare |
| `businesses` | Local artisans, mechanics, shops, and SHGs | Public: `status = 'published'` only<br>Admin: All statuses | Module 6: Local Businesses / SHGs |
| `citizen_feedback` | Public correction and listing requests | Public: Insert only<br>Admin: Full CRUD & status update | Citizen Feedback Loop |

---

## 2.1 Privacy & Respondent Identity Specification
The survey schema enforces **pseudonymous household data collection without direct resident PII**:
- **Excluded**: Resident names, mobile numbers, Aadhaar numbers, and street door numbers are strictly prohibited.
- **Included**: Pseudonymous household identifier (e.g. `HH-001`), interviewer attribution (the student surveyor name for auditability), optional broad locality/ward, and interview duration timestamps (`started_at`, `completed_at`).

---

## 3. Publication Lifecycle (`status`)

To ensure unverified field notes are not published prematurely to the community, records in `schemes`, `contacts`, `institutions`, and `businesses` enforce a three-stage lifecycle:

```text
[ Field Collection ] ──> draft ──> [ Source Verification ] ──> verified ──> [ Public Portal ] ──> published
```

- **`draft`**: Information collected from the field, pending verification with officials or owners.
- **`verified`**: Checked against physical notice boards, official gazettes, or direct institutional confirmation.
- **`published`**: Made visible to the public on the Village Information Portal.

---

## 4. Row Level Security (RLS) Policy Design

1. **Public Visitors (Anonymous Role `anon`)**:
   - `SELECT` permission on `villages` and `survey_questions`.
   - `SELECT` permission on `schemes`, `contacts`, `institutions`, and `businesses` restricted strictly to rows where `status = 'published'`.
   - `INSERT` permission on `citizen_feedback` (with status defaulted to `'Pending'`).
   - **Zero access** to `survey_responses`, `survey_answers`, and draft/verified records.
2. **Authenticated Administrator (Student Role `authenticated`)**:
   - Full CRUD (`ALL`) permissions across all 9 tables.
   - Can view and edit records in `draft`, `verified`, and `published` states.
   - Can review raw household survey responses and analyze live dashboard statistics.

---

## 5. Analytical Precision in Dashboard Aggregation

The analytical view `view_survey_metric_counts` calculates percentages relative to the **number of respondents who answered that specific question**, preventing distortion when optional questions are skipped:

$$\text{Percentage} = \left(\frac{\text{Count of responses for value } V \text{ in question } Q}{\text{Total answers recorded for question } Q}\right) \times 100$$

---

## 6. How to Apply the Schema in Supabase

1. Open your Supabase project: `https://supabase.com/dashboard/`.
2. Navigate to **SQL Editor** in the left sidebar.
3. Open `database/schema.sql`, copy the complete text, paste it into the editor, and click **Run**.
4. All 9 tables, indices, RLS policies, analytical view, and the 21 seed survey questions will be created.

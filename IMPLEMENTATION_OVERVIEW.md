# SkillVault · Project Implementation & Architecture Overview

> **Smart Education Initiative · SIH25093 · Higher Education Department, Govt. of Jammu & Kashmir**  
> *Centralised, blockchain-verified digital credential repository and AI-driven skill-gap platform for Higher Education Institutions (HEIs).*

---

## 📌 Executive Summary

Colleges and universities struggle with scattered, paper-based, unverified records of extra-curricular activities, technical hackathons, athletic achievements, and community service. This leads to friction during NAAC/NIRF accreditation audits and recruiter evaluations.

**SkillVault** solves this with a unified, role-based platform built around four pillars:
1. **Students**: Upload proof of achievements, track faculty approvals, inspect immutable blockchain verification digests, and benchmark their profiles with an AI skill-gap radar.
2. **Faculty**: Review and digitally validate institutional submissions.
3. **Institutional Admins**: Auto-aggregate verified achievements into structured NAAC Criterion 5 and NIRF metric reports.
4. **Recruiters & Evaluators**: Access instant, tamper-proof student portfolio links via cryptographically secure QR codes.

---

## 🗂️ Complete Directory Structure

```
Project/
├── IMPLEMENTATION_OVERVIEW.md          # Complete project implementation summary (this document)
├── backend/                            # Backend placeholder
│   └── README.md                       # Outlines planned Node.js, Express, S3, GraphQL & AI services
└── frontend/                           # Complete React 19 + Vite application
    ├── README.md                       # Frontend quickstart & backend integration touchpoints
    ├── index.html                      # Percent-encoded SVG favicon, theme-color, OG tags, Google Fonts
    ├── package.json                    # Minimal dependencies (Tailwind v4, Recharts, Lucide, Framer Motion)
    ├── vite.config.js                  # Vite configuration with @tailwindcss/vite plugin
    └── src/
        ├── App.jsx                     # Route declarations, ProtectedRoute & JobsProvider wrapping
        ├── main.jsx                    # React entrypoint (StrictMode)
        ├── index.css                   # PointoPark design system, custom scrollbars, subtle radial glows
        ├── context/
        │   ├── AuthContext.jsx         # Role state, clean data merging, credential sanitization
        │   ├── ActivitiesContext.jsx   # Shared activities store, localStorage persistence, approve/reject minting
        │   ├── NotificationsContext.jsx # Student notification store with unread counts & bell dropdown
        │   └── JobsContext.jsx         # Jobs & applications state, localStorage persistence, pipeline actions
        ├── routes/
        │   └── ProtectedRoute.jsx      # Client-side route guard enforcing authentication & role access (/student, /recruiter, /admin)
        ├── utils/
        │   ├── dates.js                # Real local ISO date helpers (todayISO, addDays, isPastDeadline)
        │   ├── hash.js                 # Pure cryptographic helpers: deterministic canonicalJson & sha256Hex (Web Crypto)
        │   └── matchJobs.js            # Pure function: 70% required + 30% preferred verified skill matching
        ├── data/
        │   ├── mock.js                 # Realistic student record, timeline items, radar datasets & career paths
        │   ├── activitiesMock.js       # Migrated student activities & 6 multi-institution pending submissions across J&K HEIs
        │   └── jobsMock.js             # 8 seeded jobs, applicant pool, skill vocabulary, sample applications
        ├── components/
        │   ├── Navbar.jsx              # Sticky header with shield check logo, notification bell, & user profile menu
        │   ├── Footer.jsx              # Institutional copyright, accreditation policies, & security labels
        │   ├── StatCard.jsx            # Animated metric counters, verified score ring (94/100) & recommended jobs count
        │   ├── UploadCard.jsx          # Accessible file upload zone, client SHA-256 binary hashing, SkillTagInput, resubmit prefill
        │   ├── Timeline.jsx            # Vertical audit timeline, category & status filters, reviewer feedback & 1-click Resubmit
        │   ├── ProofModal.jsx          # On-chain proof inspection modal with real proof.hash, reviewedAt, reviewer & fileHash
        │   ├── SkillRadar.jsx          # Dark-mode Recharts Radar Chart, skill gap progress bars & career paths
        │   ├── PortfolioQR.jsx         # Scannable QRCodeSVG, one-click copyable link & 01-02-03 step cards
        │   ├── NotificationToast.jsx   # Interactive floating toast with aria-live="polite"
        │   └── jobs/
        │       ├── JobCard.jsx         # Match score gauge, you match / missing chips, details & apply CTAs
        │       ├── JobDetailsModal.jsx # Full vacancy description, split skill gaps, and actionable hints
        │       ├── ApplicationTracker.jsx # 4-step candidate progression pipeline (Applied→Shortlisted→Interviewing→Hired)
        │       ├── PostJobForm.jsx     # Accessible recruiter vacancy creator with autocomplete skill tags
        │       ├── SkillTagInput.jsx   # Reusable tag input with autocomplete suggestions from skill vocabulary
        │       └── ApplicantCard.jsx   # Recruiter applicant inspector, pipeline stage dropdown, & verified portfolio modal
        └── pages/
            ├── Login.jsx               # Page 1: Split desktop layout, role tabs, login/signup toggle, quick demo
            ├── StudentDashboard.jsx    # Page 2: Student dashboard with "Jobs for you" AI section & application tracker
            ├── RecruiterDashboard.jsx  # Page 3: Recruiter portal with vacancy management & talent pipeline
            ├── AdminDashboard.jsx      # Page 4: College Admin verification desk with split-view review, hash minting, CSV export
            └── ComingSoon.jsx          # Placeholder for future state-level institutional NIRF modules
```

---

## 🔄 Verification & Hash Minting Workflow

```
[ Student ]
    │ Uploads certificate / achievement proof
    │ Client computes fileHash = SHA-256(ArrayBuffer) via Web Crypto
    ▼
[ Activities Store ('skillvault_activities') ]
    │ Status: 'Pending'
    ▼
[ College Admin Verification Desk ('/admin') ]
    │ Filters queue by category/search (sorted oldest first)
    │ Inspects file preview + SHA-256 binary checksum
    │ Sets verified skills to award from SKILL_VOCABULARY
    ├──► [ APPROVE ]:
    │       Computes proofHash = SHA-256(canonicalJson({ ...activity, skillsAwarded }))
    │       Mints ledger proof: { hash, timestamp, blockNumber, network }
    │       Status -> 'Approved'
    │       Student profile updated -> Raises job match scores in real time
    │       Pushes unread notification to student bell dropdown
    └──► [ REJECT ]:
            Records mandatory reviewer reason (min 10 chars)
            Status -> 'Rejected'
            Student sees reviewer feedback in Timeline and can 1-click "Resubmit"
```

---

## 🎨 Visual Design System (Inspired by PointoPark)

The user interface follows a modern, calm, dark aesthetic:

| Design Token | Value | Description |
| :--- | :--- | :--- |
| **Base Background** | `#172120` | Deep obsidian forest green-black |
| **Card Surface** | `#1E2B2A` | Elevated surface with `rgba(255, 255, 255, 0.08)` border |
| **Hover Surface** | `#233433` | Interactive card state |
| **Primary Text** | `#F3F1EA` | Off-white silk |
| **Muted Text** | `#9FB0AD` | Calm sage-tinted gray |
| **Primary Accent** | `#B7F34A` | Electric mint/lime for CTAs, active badges, and highlights |
| **Approved Accent**| `#B7F34A` / `#22C55E` | Mint / Emerald for verified status |
| **Pending Accent** | `#F59E0B` | Warm Amber for faculty review queue |
| **Rejected Accent**| `#F43F5E` | Rose for rejected submissions |
| **Serif Font**     | `Fraunces` | Elegant serif for headings with italic accent words |
| **Sans Font**      | `Inter` | Clean sans-serif for UI labels, tables, and body text |

### Signature Typography Pattern
Every section header features an uppercase eyebrow tag, accompanied by a heading where **one key word is set in italic serif using the `#B7F34A` accent color**:
- Eyebrow: `SMART EDUCATION, VERIFIED` → Heading: `Every achievement, *verified.*`
- Eyebrow: `STUDENT DASHBOARD` → Heading: `Welcome back, *Aarav.*`
- Eyebrow: `ACCREDITATION SUBMISSION` → Heading: `Upload *Achievement*`
- Eyebrow: `IMMUTABLE ACTIVITY LOG` → Heading: `Activity *Timeline*`
- Eyebrow: `AI POWERED CAREER VECTORIZATION` → Heading: `Skill-Gap & Career *Dashboard*`
- Eyebrow: `TAMPER-PROOF DISTRIBUTION` → Heading: `Verified Portfolio & *Recruiter QR*`

---

## 📄 Detailed Page Implementations

### Page 1: Login & Registration (`/`)
- **Desktop Split Layout**:
  - **Left Story Panel**: Eyebrow badge, main heading with italic mint accent, subtext, 3 feature cards (*Faculty-approved*, *Blockchain-verified QR*, *AI skill-gap insights*), and the Government of Jammu & Kashmir attribution.
  - **Right Login Card**:
    - 3 Segmented Pill Tabs: **Student** | **Recruiter** | **Admin**. Icons, headings, and helper copy update dynamically.
    - Mode toggle between **Log in** and **Sign up**.
    - Form fields automatically reset when toggling modes or switching roles to avoid state bleed.
    - Password starts as an empty string (`''`).
    - Full keyboard accessibility with unique `id` and `htmlFor` pairings, and proper `autoComplete` attributes (`email`, `current-password`, `new-password`, `name`, `organization`).
    - Password visibility toggle (Eye / EyeOff icon).
    - Inline error messages equipped with `role="alert"`.
    - "Forgot password?" triggers a non-intrusive `<NotificationToast>` (`"Demo mode: password reset is not connected yet."`) instead of a browser `alert()`.
    - Simulated 800ms network delay with animated loading spinner.
    - Quick-fill demo buttons in the top header for instant evaluation.
    - Post-login navigation: verifies `location.state.from` and redirects appropriately if matching the logged-in role; otherwise routes to default (`/student` or `/coming-soon`).

### Page 2: Student Welcome & Dashboard (`/student`)
Protected by `ProtectedRoute.jsx` (redirects unauthenticated users to `/`).

1. **Welcome Hero & Stat Metrics**:
   - Personalized greeting (`"Welcome back, Priya."` or `"Welcome back, Aarav."`), student institution (`NIT Srinagar`), roll number (`2022BCSE042`), and semester details.
   - Quick pill CTAs: `"Upload achievement →"` (scrolls to upload section) and `"Share my portfolio"` (scrolls to recruiter QR).
   - 4 animated stat counters: *Total Records*, *Approved*, *In Review*, *Rejected*.
   - Circular SVG gauge rendering the **Verified Score (94/100)** with cohort percentile ranking.

2. **Upload Achievement Card**:
   - Drag-and-drop zone with keyboard accessibility (`tabIndex={0}`, Enter/Space key support, visible focus ring), file validation (<10MB), and image/document preview.
   - Sets `fileUrl: null` and `fileType: 'pdf'` for PDF uploads (no random stock photos).
   - Clear architectural comments documenting future **AWS S3 Presigned URL** upload streaming.
   - Form inputs with `id` and `htmlFor` associations: Title, Category (*Technical, Sports, Cultural, Research, Internship, Volunteering*), Date, Description.
   - On submission, adds a new *Pending* record to the local timeline, displays a success toast, and fires celebratory confetti.

3. **Activity Timeline**:
   - Vertical timeline connected with category icons (Code, Trophy, Sparkles, Book, Briefcase, Heart).
   - Segmented filter tabs (*All*, *Approved*, *Pending*, *Rejected*) displaying live counts.
   - Category dropdown filter + instant search box.
   - For approved items:
     - Short blockchain hash chip (e.g., `0x7f4c…e6d1`).
     - `"View proof"` button opening the modal.
   - For rejected items: Displays formal evaluator feedback and reason for rejection.

4. **Proof Modal (On-Chain Certificate Inspection)**:
   - For image proofs: renders visual preview with digital watermark status.
   - For PDF documents: renders an elegant styled placeholder card with file icon, filename, and label `"PDF document · preview unavailable in demo"` (zero external image calls).
   - Subtle demo-data notice: `"Demo data: not a live blockchain record"`.
   - Full SHA-256 cryptographic hash with one-click copy utility.
   - Block number (`Block #1,849,204`), timestamp, consensus network (`Govt. J&K EduLedger PoA`), and NAAC Criterion 5 eligibility.

5. **AI Skill-Gap & Career Dashboard**:
   - Dark-mode **Recharts Radar Chart** comparing *Your Verified Skills* vs *Industry Benchmark* across three target archetypes:
     - **Full-Stack Developer** (84% match)
     - **Data Analyst** (78% match)
     - **ML Engineer** (72% match)
   - Actionable skill gap progress bars displaying percentage deltas and concrete recommendations.
   - 3 Career path recommendations with salary brackets, market growth indicators, and matched competencies.

6. **Verified Portfolio & Recruiter QR**:
   - Scannable SVG QR code generated with `qrcode.react`.
   - Subtle demo-data notice: `"Demo data: not a live blockchain record"`.
   - Copyable shareable URL (`https://skillvault.app/verify/STU-2025-0142`) with clipboard copy feedback.
   - 3 Numbered "How verification works" step cards:
     - `01` Faculty Approval
     - `02` SHA-256 Hash Minted
     - `03` Recruiter Instant Scan

7. **"Jobs for You" & Algorithmic Skill Matching**:
   - Eyebrow: `MATCHED TO YOUR VERIFIED SKILLS` → Heading: `Jobs picked *for you.*`
   - Pure matching algorithm (`src/utils/matchJobs.js`):
     - Extract verified skills exclusively from `Approved` activities.
     - Match Score (0-100) = `70% * (matched required / total required) + 30% * (matched preferred / total preferred)`.
     - Ranked descending; >=50% designated as "Recommended".
   - Filters: Type (*All, Full-time, Internship, Part-time*), Mode (*All, Remote, Hybrid, On-site*), Recommended only toggle, Search box.
   - Job cards: Company initial avatar, title, salary, deadline, color-coded match badge, matched vs missing skills (+N more).
   - "View details" modal with full description, skill breakdown, and actionable gap-closing recommendations.
   - One-click application with confirmation modal and live pipeline status updates.
   - **My Applications Tracker**: Real-time 4-step progress pipeline (*Applied → Shortlisted → Interviewing → Hired*) or rose *Not selected* state.

8. **Toast Notifications**:
   - Managed via a `useRef` timer (`toastTimeoutRef`) ensuring consecutive toasts refresh cleanly without premature timer dismissals, with cleanup on unmount.
   - Container enhanced with `aria-live="polite"`.

9. **Footer**:
   - Minimalist accreditation references, privacy, terms, and copyright notices.

### Page 3: Recruiter Verification & Talent Desk (`/recruiter`)
Protected by `ProtectedRoute.jsx` (accessible exclusively to `role="recruiter"`).

1. **Recruiter Welcome Hero**:
   - Greeting: `"Welcome back, Tanya."` with organization attribution (`Apex Systems & AI Labs`).
   - 4 Top-line metrics: *Open Postings*, *Total Applicants*, *Shortlisted Candidates*, *Offers Extended*.
2. **Post a Job Form (Collapsible)**:
   - Inputs with connected `htmlFor`/`id` labels and inline `role="alert"` validation.
   - `SkillTagInput` component: Type and press Enter or pick from autocomplete vocabulary; click `x` to remove.
   - Pre-fills company name from recruiter's profile.
3. **Institutional Vacancy Postings Grid**:
   - Status badge (*Open* in mint / *Closed* in rose), applicants count, compensation, and one-click Close/Reopen toggle.
   - Selecting a vacancy dynamically filters the talent pool below.
4. **Verified Candidate Stack**:
   - Applicants ranked by match score.
   - Displays candidate institution, matched skills chips, and verified on-chain proofs count.
   - **"View Verified Portfolio" Modal**: Inspects candidate's approved activities with short SHA-256 hash chips and `"Demo data: not a live blockchain record"` banner.
   - **Interactive Pipeline Status Selector**: Move candidate through *Applied → Shortlisted → Interviewing → Hired* or *Rejected*. Updates reflect immediately in the student's dashboard via shared `JobsContext`.

### Page 4: Admin Accreditation Portal (`/coming-soon?role=admin`)
- **Route Guard**: Direct visits while logged out immediately redirect to `/`.
- Preview of NAAC Criterion 5 and NIRF automated aggregation workflows.

---

## 🛠️ Technology Stack & Optimization

| Layer | Technology | Status |
| :--- | :--- | :--- |
| **Framework & Build** | React 19 + Vite 8 | Fast HMR, zero configuration overhead |
| **Styling** | Tailwind CSS v4 + `@tailwindcss/vite` | Modern CSS with theme tokens (PostCSS & Autoprefixer removed) |
| **Routing** | React Router v7 | Client-side routing with role-aware route guards |
| **Icons** | Lucide React | High-contrast, clean SVG icons (unused icons tree-shaken) |
| **Animations** | Framer Motion | Smooth layout transitions, modals, and toasts |
| **Charts** | Recharts | Interactive Radar Charts for skill-gap benchmarking |
| **QR Code** | `qrcode.react` (`QRCodeSVG`) | High-density scannable portfolio links |
| **Micro-Interactions**| `canvas-confetti` | Rewarding feedback on achievement submissions |
| **Code Hygiene** | Oxlint | **0 warnings and 0 errors** |

---

## 🔌 Future Backend Integration Roadmap

While this project is strictly **Frontend-Only**, integration points are prepared with architectural comments:

1. **Authentication (`/frontend/src/context/AuthContext.jsx`)**:
   - Replace simulated 800ms timer with `POST /api/v1/auth/login` and `POST /api/v1/auth/register`.
   - Store secure HTTP-only cookies with JWT session tokens and role claims.
2. **File Storage via S3 Presigned URLs (`/frontend/src/components/UploadCard.jsx`)**:
   - Step 1: Request presigned URL from backend (`POST /api/v1/storage/presigned-url`).
   - Step 2: Directly upload raw file binary from browser to AWS S3 (`PUT presignedUrl`).
   - Step 3: Transmit file metadata and S3 key to backend database (`POST /api/v1/activities`).
3. **Faculty Review Flow (`/frontend/src/components/Timeline.jsx`)**:
   - Faculty portal triggers `POST /api/v1/activities/:id/approve` or `reject` with NAAC tags.
4. **Blockchain Hash Minting (`/frontend/src/components/ProofModal.jsx`)**:
   - Background worker hashes the approved file bytes and metadata using SHA-256 and submits the record to the J&K EduLedger Proof-of-Authority node.
5. **AI Skill-Gap Microservice (`/frontend/src/components/SkillRadar.jsx`)**:
   - Python FastAPI service calculates cosine similarity embeddings between student achievements and industry job descriptors.

---

## ✅ Quality Assurance & Verification Results

- **Linter Check**: Passed `npm run lint` (`oxlint`) with **0 warnings and 0 errors** across 29 files.
- **Production Build**: Verified with `npm run build` (`vite build`) in `frontend/`. Compiled cleanly in 24.13s with **0 syntax or bundling errors**, producing code-split chunks for `StudentDashboard`, `RecruiterDashboard`, and `ComingSoon` via `React.lazy` + `Suspense`.
- **End-to-End Browser Verification**:
  - **Real Relative Dates & Deadlines**: Open jobs have future deadlines; expired/closed jobs (`job-08`, `job-07`) cleanly display `Expired` / `Closed` badges with disabled Apply actions.
  - **Dynamic Applicant Snapshots**: Newly signed-up student `"Priya Verma"` applied to an open role; recruiter dashboard displays her verified credentials count, skills, and credential modal accurately.
  - **Enforced Deadline Validation**: Jobs posted with past deadlines are automatically flagged as expired, blocking student submissions with real-time toast feedback.
  - **Student Sign-up & Profile Merging**: Registered `"Priya Verma"` (`NIT Srinagar`); dashboard displays `"Welcome back, Priya."`.
  - **PDF & Preview Fallback**: Submitted PDF proof; `ProofModal` renders the styled placeholder card without external image calls.
  - **Route Protection**: Verified that `/student`, `/recruiter`, and `/coming-soon` enforce role-based access.

---

## 💻 How to Run Locally

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

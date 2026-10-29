# SkillVault · Frontend Client

SkillVault is a centralised digital credentialing and achievement repository designed for Higher Education Institutions under the Government of Jammu & Kashmir (**Smart Education Initiative · SIH25093**).

This frontend application is built with **React (Vite)**, **Tailwind CSS v4**, **React Router v7**, **Lucide React**, **Framer Motion**, **Recharts**, and **QRCode.react**, adopting the sleek, calm, dark aesthetic inspired by PointoPark.

---

## 🚀 Quick Start Instructions

To run the frontend locally:

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies (if not already installed)
npm install

# 3. Launch the Vite development server
npm run dev
```

The application will be accessible at `http://localhost:5173`.

---

## 🎨 Theme & Design Guidelines

- **Base Background**: `#172120` (Deep obsidian forest green-black)
- **Surface Cards**: `#1E2B2A` with `rgba(255, 255, 255, 0.08)` borders & `20px - 28px` rounded corners
- **Primary Text**: `#F3F1EA` (Off-white silk)
- **Muted Text**: `#9FB0AD`
- **Primary Accent**: `#B7F34A` (Vibrant electric mint / lime with subtle glow)
- **Status Accents**:
  - Approved: `#B7F34A` / Emerald `#22c55e`
  - Pending: Amber `#F59E0B`
  - Rejected: Rose `#F43F5E`
- **Typography**:
  - Headings: **Fraunces** serif (Google Fonts) with italic accent word styling
  - Body: **Inter** clean sans-serif

---

## 🗺️ Application Routing

- **`/`**: Split-panel Login & Registration screen with 3 role tabs (Student, Recruiter, Admin), password show/hide toggle, demo quick-fill credentials, and inline validations.
- **`/student`**: Client-side protected Student Dashboard with Welcome Hero, Stat cards (with recommended jobs count), S3-ready Upload card with client SHA-256 hashing, Activity timeline with blockchain audit proofs & 1-click Resubmit on rejected credentials, notification bell with unread badge, AI Skill-Gap Radar chart, "Jobs for you" AI-ranked matching section with live application tracker, and Recruiter QR code generator.
- **`/recruiter`**: Client-side protected Recruiter Dashboard with posting management, dynamic job creation form with autocomplete skill tag inputs, status toggling (Open/Closed), and verified applicant review pipeline (Applied → Shortlisted → Interviewing → Hired / Rejected).
- **`/admin`**: Client-side protected College Admin Verification Desk with live metrics (Pending, Approved, Rejected, Approval Rate, Reviewed Today), queue filtering & search, split-panel review modal with document preview & SHA-256 checksum inspector, skill endorsement tag input, canonical hash minting, inline rejection feedback, and NAAC/NIRF accreditation CSV exporter.
- **`/coming-soon`**: Dedicated placeholder portal for future state-level institutional NIRF modules.

---

## 🔄 Verification & Hash Minting Workflow

```
[ Student ]
    │ Uploads certificate / achievement proof
    │ Client computes fileHash = SHA-256(ArrayBuffer)
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

## 🔌 Backend & API Integration Roadmap

All mock data is currently encapsulated in `src/data/mock.js`, `src/data/jobsMock.js`, and `src/data/activitiesMock.js`, and state is managed via `AuthContext.jsx`, `ActivitiesContext.jsx`, `NotificationsContext.jsx`, and `JobsContext.jsx`. The exact touchpoints where real backend services will be plugged in are detailed below:

### 1. Authentication & Role-Based Access Control (RBAC)
- **Location**: `src/context/AuthContext.jsx` -> `login()` & `logout()`
- **Future Integration**: Replace fake 800ms timer with `POST /api/v1/auth/login` and `POST /api/v1/auth/register`. Store JWT or HTTP-only secure cookie and decode institutional role claims (`student`, `faculty`, `admin`, `recruiter`).

### 2. Jobs Marketplace & Vacancies
- **Location**: `src/context/JobsContext.jsx`
- **Future Integration**:
  - `POST /api/v1/jobs` - Create new vacancy with required/preferred skills.
  - `GET /api/v1/jobs/recommended` - Retrieve jobs scored by student's on-chain skills.
  - `POST /api/v1/jobs/:id/apply` - Submit student verified profile.
  - `PATCH /api/v1/applications/:id` - Advance candidate status in recruiter review pipeline.

### 3. Proof Uploads via AWS S3 Presigned URLs
- **Location**: `src/components/UploadCard.jsx` -> `handleSubmit()`
- **Future Integration**:
  1. Frontend requests an authorized upload ticket: `POST /api/v1/storage/presigned-url` with `{ filename, fileType, category }`.
  2. Frontend streams the raw binary directly to Amazon S3 via `PUT ${presignedUrl}` with standard progress tracking.
  3. Frontend sends metadata and the S3 key `s3FileKey` to the GraphQL mutation / REST endpoint `POST /api/v1/activities`.

### 4. Faculty Verification & Approval Workflow
- **Location**: `src/components/Timeline.jsx` & Backend Microservice
- **Future Integration**: Faculty dashboard will invoke `POST /api/v1/activities/:id/approve` or `POST /api/v1/activities/:id/reject` with structured accreditation feedback (NAAC Criterion 5 tags).

### 5. Blockchain Hashing & EduLedger Minting
- **Location**: `src/components/ProofModal.jsx` & `src/components/PortfolioQR.jsx`
- **Future Integration**: Once faculty approves an achievement, the backend Python/Node.js blockchain worker computes the SHA-256 digest `H = SHA256(certificate_bytes + metadata + issuer_sig)` and submits a state transition to the Govt. of J&K Proof-of-Authority (PoA) Consortium Node. The resulting transaction hash and block number are returned to the client.

### 6. AI Skill Matching & Radar Engine
- **Location**: `src/utils/matchJobs.js` & `src/components/SkillRadar.jsx`
- **Future Integration**: Python ML microservice matching candidate embedding against industry job requirements with exact verified credential checks. Formula: 70% required skills match + 30% preferred skills match.

---

## 🛠️ Tech Stack Summary

- **Bundler & Runtime**: Vite + React 19
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Data Visualization**: Recharts (Radar, PolarGrid, PolarAngleAxis)
- **Cryptographic QR**: QRCode.react (`QRCodeSVG`)
- **Interactive FX**: Canvas-Confetti

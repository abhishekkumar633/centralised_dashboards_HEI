# SkillVault Backend

Express + MongoDB API for SkillVault (auth, activities, jobs, applications, notifications).

## Setup

1. Copy `.env.example` to `.env` and set `MONGODB_URI`.
2. Install and seed demo accounts:

```bash
cd backend
npm install
npm run seed
npm run dev
```

API runs at `http://localhost:5000`. The Vite frontend proxies `/api` there.

## Demo logins

| Role | Email | Password |
| --- | --- | --- |
| Student | aarav.sharma@nitsri.ac.in | vault2025pass |
| Recruiter | tanya.roy@apexsystems.io | recruiterSecure1 |
| Admin | dean.academics@nitsri.ac.in | adminGovtJk2025 |

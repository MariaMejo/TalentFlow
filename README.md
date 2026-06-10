# TalentFlow – Job Board & Application Tracking Platform

Built as part of a Software Developer Internship technical assessment.

## Live Demo
🔗 [https://talent-flow-green.vercel.app/](https://talent-flow-green.vercel.app/)

## GitHub Repository
🔗 [https://github.com/MariaMejo/TalentFlow](https://github.com/MariaMejo/TalentFlow)

---

## Test Credentials

Use these accounts to explore the platform without registering:

| Role      | Email                  | Password   |
|-----------|------------------------|------------|
| Employer  | employer@test.com      | Test@1234  |
| Candidate | candidate@test.com     | Test@1234  |

---

## Project Overview

TalentFlow is a full-stack Job Board and Application Tracking System that connects employers and candidates. Employers can create and manage job listings, while candidates can browse jobs, apply, upload resumes, and track their application status in real time.

---
## Screanshots

<img width="706" height="537" alt="Screenshot 2026-06-10 134812" src="https://github.com/user-attachments/assets/89c05f18-30e5-45bd-82e0-255b7538c9c5" />
<img width="958" height="539" alt="Screenshot 2026-06-10 134710" src="https://github.com/user-attachments/assets/29231a46-c21d-432f-91c3-8e47a568d815" />
<img width="959" height="538" alt="Screenshot 2026-06-10 134658" src="https://github.com/user-attachments/assets/5559d92d-447a-440e-94df-ce9132c938b2" />
<img width="951" height="536" alt="Screenshot 2026-06-10 134731" src="https://github.com/user-attachments/assets/086fff8e-b3fb-4c30-a0f6-bd2ee73195a1" />
<img width="671" height="520" alt="Screenshot 2026-06-10 134857" src="https://github.com/user-attachments/assets/9565488c-8a6e-42d0-b022-239706273ea2" />
<img width="959" height="537" alt="Screenshot 2026-06-10 134757" src="https://github.com/user-attachments/assets/e2cdf976-5806-40f9-99db-8896e7e47027" />



---

## Features

### Employer Features
- Register and login securely
- Create, update, and close job listings
- View applicants for posted jobs
- Shortlist or reject candidates
- View candidate resumes

### Candidate Features
- Register and login securely
- Manage profile and upload resume
- Browse, search, and filter jobs (by role, location, salary)
- Apply for jobs
- Track application status in real time

### Application Status Tracking
- Applied
- Shortlisted
- Rejected

### Email Notifications
- Triggered automatically when an application status changes
- Implemented using Supabase Edge Functions and Resend API
- Currently using Resend's testing domain — delivery is restricted to verified recipients. In production, a verified domain or SMTP provider would remove this restriction.

---

## Tech Stack

| Layer          | Technology                          |
|----------------|--------------------------------------|
| Frontend       | React, TypeScript, Vite, Tailwind CSS |
| Backend        | Supabase Edge Functions              |
| Database       | PostgreSQL (Supabase)                |
| Authentication | Supabase Auth                        |
| Storage        | Supabase Storage (resume uploads)    |
| Email          | Resend API                           |
| Deployment     | Vercel                               |

---

## Installation

### Clone Repository
```bash
git clone https://github.com/MariaMejo/TalentFlow.git
cd job-board
```

### Install Dependencies
```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

---

## Database Schema

- **Users** — stores employer and candidate accounts with role-based access
- **Jobs** — job listings with title, location, salary, description, and status
- **Applications** — tracks candidate applications with status (Applied / Shortlisted / Rejected)
- **Storage** — resume files stored via Supabase Storage

---

## Author

**Maria Mejo**

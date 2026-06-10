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

## Screenshots

><img width="948" height="539" alt="Screenshot 2026-06-10 134628" src="https://github.com/user-attachments/assets/1eae212a-b7ca-4b0e-a976-0b097743a803" />
<img width="959" height="537" alt="Screenshot 2026-06-10 134757" src="https://github.com/user-attachments/assets/6094e911-92b0-4924-b27a-19c7f738498e" />



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

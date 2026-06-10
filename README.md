# TalentFlow – Job Board & Application Tracking Platform

## Live Demo

https://talent-flow-green.vercel.app/

## GitHub Repository

https://github.com/MariaMejo/TalentFlow

---

## Project Overview

TalentFlow is a full-stack Job Board and Application Tracking System that connects employers and candidates. Employers can create and manage job listings, while candidates can browse jobs, apply, upload resumes, and track their application status.

---

## Features

### Employer Features

* Register and login securely
* Create job listings
* Update existing job listings
* Close job listings
* View applicants for posted jobs
* Shortlist or reject candidates
* View candidate resumes

### Candidate Features

* Register and login securely
* Manage profile
* Upload resume
* Browse available jobs
* Search and filter jobs
* Apply for jobs
* Track application status

### Application Tracking

* Applied
* Shortlisted
* Rejected

### Email Notifications

* Email notifications are triggered when application status changes.
* Implemented using Supabase Edge Functions and Resend.

---

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS

### Backend

* Supabase

### Database

* PostgreSQL (Supabase)

### Authentication

* Supabase Authentication

### Storage

* Supabase Storage (Resume Uploads)

### Deployment

* Vercel

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd job-board
```

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build Project

```bash
npm run build
```

---

## Database Features

* User Management
* Role-Based Access Control
* Job Listings
* Applications
* Resume Storage
* Application Status Tracking

---

## Submission Notes

* Resume uploads are stored using Supabase Storage.
* Application status updates are managed through Supabase.
* Email notifications are implemented using Supabase Edge Functions and Resend.
* The current deployment uses Resend's testing domain for email delivery.

---

## Author

Maria Mejo

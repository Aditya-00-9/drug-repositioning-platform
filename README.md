# Drug Repositioning Intelligence

> Research intelligence platform for drug repurposing — evidence-backed drug, disease, and target analysis with PubMed citations, confidence scores, and human-reviewed AI summaries.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Prisma](https://img.shields.io/badge/Prisma-6-blue?logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-teal?logo=tailwind-css)
![Vitest](https://img.shields.io/badge/Tested_with-Vitest-green?logo=vitest)
![Playwright](https://img.shields.io/badge/E2E-Playwright-orange?logo=playwright)
![License](https://img.shields.io/badge/License-MIT-yellow)

**Live Demo:** [drug-repositioning-platform.vercel.app](https://drug-repositioning-platform.vercel.app)

---

## What It Does

A translational research platform that aggregates curated drug–disease evidence records with PubMed citations, ClinicalTrials.gov references, AI-generated summaries, and graded confidence scores. Designed for hypothesis generation and portfolio triage — not patient care.

## Features

- **Drug–disease evidence engine** — Curated evidence records with mechanism of action, clinical trial IDs, PubMed citations, and confidence scoring
- **Evidence grading** — Human-reviewed AI summaries with evidence levels (Phase I–IV, preclinical, observational)
- **Drug, disease, and target explorer** — Browse curated drugs, diseases, and molecular targets with pathway and druggability data
- **Audience-specific solutions** — Tailored views for pharma, biotech, academia, investors, and researchers
- **Admin review workflow** — Reviewer login with audit trail and evidence review staging
- **Medical disclaimer** — Clear research-only positioning throughout the platform

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI | React 19, Tailwind CSS 4, Framer Motion |
| Database | Prisma ORM (SQLite dev / configurable) |
| Auth | Jose (JWT) |
| Icons | Lucide React |
| Testing | Vitest (unit), Playwright (E2E) |
| Deployment | Vercel |

## Project Structure

```
drug-repositioning-platform/
├── app/
│   ├── page.tsx              # Landing page with stats and featured evidence
│   ├── layout.tsx            # Root layout with nav and footer
│   ├── drugs/                # Drug catalog pages
│   ├── diseases/             # Disease catalog pages
│   ├── targets/              # Molecular target pages
│   ├── evidence/             # Evidence record browser
│   ├── audiences/            # Audience-specific solution pages
│   ├── admin/                # Admin review panel
│   ├── login/                # Reviewer authentication
│   ├── api/                  # API routes
│   └── components/            # Shared UI components
├── lib/
│   ├── data.ts               # Data access layer
│   ├── auth.ts               # JWT authentication
│   ├── prisma.ts             # Prisma client
│   ├── grading.ts            # Evidence grading logic
│   ├── audit.ts              # Audit trail
│   ├── env.ts                # Environment validation
│   ├── types.ts              # TypeScript types
│   └── seed-data.ts           # Seed data for development
├── prisma/
│   ├── schema.prisma         # Database schema (Drug, Disease, Target, EvidenceRecord)
│   └── seed.ts               # Database seeder
├── tests/                    # Test files
├── public/                   # Static assets
└── middleware.ts             # Route protection
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
git clone https://github.com/Aditya-00-9/drug-repositioning-platform.git
cd drug-repositioning-platform
npm install
```

### Environment Setup

```bash
cp .env.example .env
```

Configure the following in your `.env`:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Database connection string (SQLite for dev, or PostgreSQL) |
| `JWT_SECRET` | Secret key for JWT token signing |

### Database

```bash
npx prisma db push    # Create tables
npx prisma db seed    # Seed with sample data
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

## Deployment

The project is configured for Vercel deployment:

```bash
npm run build
```

Import the repository in Vercel, set environment variables, and deploy. See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

---

> **Medical Disclaimer:** This platform is a research and decision-support tool for qualified professionals in pharma, biotech, academia, and translational research. It is not intended for patient care, diagnosis, or treatment decisions.

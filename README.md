# Nayam

Nayam is an Indian legal-tech platform designed around a compliance-first model.

## Core Positioning

Nayam is not a lawyer advertising marketplace. It is a legal literacy and legal operations platform with two layers:

1. **Nyaya Guide** — a public legal literacy assistant that simplifies BNS / IPC terminology and routes citizens to an objective, non-ranked advocate directory.
2. **Lawyer Workspace** — a secure B2B SaaS tool for independent advocates to manage consultation channels, documents, and AI-assisted case summaries.

## Compliance Principles

- No public reviews, ratings, ranking, paid promotion, sponsor badges, or "top lawyer" badges.
- Lawyer directory is objective and filter-based only.
- Advocate profiles show verified Bar Council details, specializations, location, languages, and basic contact information.
- AI does not provide formal legal advice.
- Client-lawyer communication and documents are compartmentalized through Supabase Row-Level Security.

## Stack

- Next.js App Router
- React
- Tailwind CSS
- Supabase Auth, PostgreSQL, RLS, Storage
- Vercel deployment
- Server-side AI provider integration

## Key Files

- `docs/PRD.md` — Product requirement document
- `docs/ARCHITECTURE.md` — Code and system architecture blueprint
- `supabase/migrations/0001_initial_schema.sql` — Database schema and RLS policies
- `app/` — Next.js App Router structure

## Environment Variables

Create `.env.local` from `.env.example`.

```bash
cp .env.example .env.local
```

Required variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

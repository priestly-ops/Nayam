# Nayam Architecture Blueprint

## 1. Architecture Goals

Nayam is built as a compliance-first Indian legal-tech platform. The architecture is designed to support two product surfaces without violating legal advertising norms:

1. Public legal literacy and objective advocate discovery.
2. Private lawyer operations workspace for secure documents, consultations, and AI-assisted summaries.

Core principles:

- No public lawyer rankings, reviews, ratings, testimonials, or sponsored placement.
- All confidential consultation data is compartmentalized by channel.
- AI runs through server-side gateways only.
- Supabase Row-Level Security is the primary authorization boundary.
- Supabase Storage files are private and linked to consultation channels.
- Public directory data is exposed only through safe, security-invoker views.

## 2. High-Level System Diagram

```txt
Citizen / Advocate Browser
        |
        v
Next.js App Router on Vercel
        |
        |-- Public Routes
        |     |-- Landing page
        |     |-- Nyaya Guide
        |     |-- Objective lawyer directory
        |
        |-- Secure Routes
        |     |-- /dashboard/client
        |     |-- /dashboard/lawyer
        |     |-- /dashboard/admin
        |
        |-- Route Handlers / Server Actions
              |-- Auth session validation
              |-- Role checks
              |-- AI request orchestration
              |-- Consultation transactions
        |
        |-------------------------------|
        v                               v
Supabase                           AI Provider
Auth                               OpenAI / Anthropic
PostgreSQL + RLS                   Translation
Storage                            Summaries
Realtime-ready DB                  Classification
```

## 3. Runtime Responsibilities

### 3.1 Next.js / Vercel

Used for:

- Public pages.
- Auth pages.
- Client dashboard.
- Lawyer dashboard.
- Admin verification dashboard.
- AI route handlers.
- Consultation route handlers.
- Server-side Supabase session handling.
- Vercel preview and production deployments.

All privileged operations must happen in Server Actions or Route Handlers.

### 3.2 Supabase

Used for:

- Auth users.
- Platform user role mapping.
- Client profiles.
- Lawyer profiles.
- Consultation channels.
- Consultation messages.
- Legal document metadata.
- AI document logs.
- Private legal document storage.
- RLS enforcement.

### 3.3 AI Providers

AI providers are called only from server-side code.

The browser must never receive:

- AI API keys.
- Supabase service role key.
- Full cross-user legal document context.
- Raw confidential data from unrelated channels.

## 4. Next.js App Router Layout

```txt
app/
  layout.tsx
  page.tsx
  globals.css

  (public)/
    layout.tsx
    nyaya-guide/
      page.tsx
    directory/
      page.tsx
      [lawyerId]/
        page.tsx
    compliance/
      page.tsx

  auth/
    login/
      page.tsx
    callback/
      route.ts

  dashboard/
    layout.tsx
    client/
      page.tsx
      consultations/
        page.tsx
        [channelId]/
          page.tsx
      documents/
        page.tsx
    lawyer/
      page.tsx
      consultations/
        page.tsx
        [channelId]/
          page.tsx
      documents/
        page.tsx
      ai-workspace/
        page.tsx
      profile/
        page.tsx
    admin/
      page.tsx
      lawyer-verification/
        page.tsx

  api/
    ai/
      nyaya-guide/
        route.ts
      document-summary/
        route.ts
    consultations/
      create-channel/
        route.ts
```

## 5. Code Organization

```txt
components/
  ui/
    Button.tsx
    Card.tsx
    Input.tsx
    Textarea.tsx
  public/
    NyayaGuideForm.tsx
    LawyerDirectoryFilters.tsx
    LawyerDirectoryCard.tsx
  dashboard/
    DashboardShell.tsx
    ClientChannelList.tsx
    LawyerChannelList.tsx
    SecureMessageThread.tsx
  ai/
    AIConsentNotice.tsx
    LawyerDocumentSummaryTool.tsx

lib/
  supabase/
    client.ts
    server.ts
    admin.ts
  auth/
    requireUser.ts
    requireRole.ts
  ai/
    prompts.ts
    safety.ts
    providers.ts
  validators/
    ai.ts
    consultations.ts
    profiles.ts
  constants/
    legalCategories.ts

types/
  database.ts
  roles.ts
  ai.ts
  consultations.ts

supabase/
  migrations/
    0001_initial_schema.sql
```

## 6. Data Model Summary

### users

Maps Supabase `auth.users` to platform roles.

Roles:

- client
- lawyer
- admin

### profiles_client

Private citizen profile.

Accessible only by:

- The client owner.
- Admin.
- A lawyer only through consultation-specific channel context, not general browsing.

### profiles_lawyer

Advocate profile and verification metadata.

Public directory displays only verified, active lawyers and only compliance-safe fields.

### consultation_channels

The secure matter container.

All sensitive records attach to a channel:

- Messages.
- Document metadata.
- AI document logs.
- Status transitions.

### consultation_messages

Secure message records inside a consultation channel.

### legal_documents

Metadata table for documents stored in Supabase Storage.

### ai_document_logs

AI activity log for public and lawyer-side AI operations.

For confidential lawyer summaries, logs are bound to a consultation channel.

## 7. RLS Authorization Model

### Core rule

If a row contains privileged or consultation-related data, access requires one of:

- Authenticated user is the client on the channel.
- Authenticated user is the lawyer on the channel.
- Authenticated user is an admin.

### Public directory exception

Only verified lawyer data can be publicly readable.

The public directory must exclude:

- Ratings.
- Reviews.
- Testimonials.
- Ranking scores.
- Paid promotion markers.
- Internal verification notes.
- Admin notes.

## 8. Storage Model

Bucket:

```txt
legal-documents
```

Bucket visibility:

```txt
private
```

Recommended path:

```txt
{consultation_channel_id}/{document_id}/{safe_filename}
```

Storage policy:

- User may upload only if they are a participant in the channel represented by the first folder.
- User may read only if they are a participant in the channel represented by the first folder.
- Admin can read for compliance and support if policy allows.

## 9. AI Architecture

### 9.1 Public Nyaya Guide

Flow:

```txt
User issue text
  -> Next.js route handler
  -> Validate payload
  -> Apply safety prompt
  -> AI model
  -> Plain-language explanation
  -> Broad category classification
  -> Non-ranked directory filter suggestion
  -> Store non-privileged AI log if user is authenticated
```

Guardrails:

- Always include disclaimer.
- Never claim to provide legal advice.
- Never guarantee outcome.
- Avoid direct litigation instructions.
- Route only to broad categories such as family, property, criminal, consumer, employment, tenancy, cyber, taxation, corporate, immigration.

### 9.2 Regional Translation Safety

Regional translation must prioritize meaning over literal word-for-word translation.

Rules:

- Preserve legal uncertainty.
- Do not translate legal terms into misleading local equivalents.
- When using a term like BNS, IPC, FIR, bail, cognizable offence, or summons, provide the original term plus a simple explanation.
- Add the disclaimer in the same language where possible.
- If translation confidence is low, say so and include English fallback.

Example output pattern:

```json
{
  "plain_explanation": "Simple explanation here",
  "important_terms": [
    {
      "term": "FIR",
      "simple_meaning": "A first police report of an alleged offence"
    }
  ],
  "suggested_category": "criminal_law",
  "urgency": "medium",
  "disclaimer": "This is general legal information only, not legal advice."
}
```

### 9.3 Lawyer Document Summary

Flow:

```txt
Lawyer selects channel
  -> Confirms client consent / internal work-product use
  -> Uploads or pastes document text
  -> Route handler checks lawyer owns channel
  -> AI summarizes
  -> ai_document_logs row created
  -> Summary visible only to channel participants and admin policy scope
```

Output structure:

```json
{
  "facts": [],
  "parties": [],
  "dates": [],
  "issues": [],
  "missing_information": [],
  "possible_next_steps_for_lawyer_review": [],
  "disclaimer": "Draft AI work-product. Advocate must verify."
}
```

## 10. Consultation Transaction Workflow

### 10.1 Channel Creation

Transactional steps:

1. Validate authenticated user.
2. Confirm user role is client.
3. Confirm target lawyer is verified and active.
4. Create consultation channel with status `requested`.
5. Insert initial system message.
6. Return channel id.

This should be implemented through a Postgres RPC or server-side transactional logic.

### 10.2 Accepting a Channel

1. Validate authenticated user.
2. Confirm user is assigned lawyer.
3. Confirm channel status is `requested`.
4. Update status to `accepted` or `active`.
5. Create system message.

### 10.3 Secure Messaging

1. Validate authenticated user.
2. Confirm user is channel participant.
3. Insert message.
4. Receiver can mark read.

### 10.4 Document Upload

1. Client or lawyer requests upload URL/path.
2. Path starts with channel id.
3. Supabase Storage policy confirms participant access.
4. Insert legal document metadata.
5. Document appears only in that channel.

### 10.5 AI Summary

1. Lawyer opens channel.
2. Lawyer confirms consent.
3. Route handler validates lawyer is channel participant and assigned lawyer.
4. AI provider receives only the selected document text.
5. Summary stored in `ai_document_logs`.
6. Summary is returned to lawyer dashboard.

## 11. API Contracts

### POST /api/ai/nyaya-guide

Request:

```json
{
  "inputText": "My landlord is refusing to return my deposit.",
  "language": "en",
  "state": "Karnataka",
  "consentGiven": true
}
```

Response:

```json
{
  "plainExplanation": "This may involve a tenancy or civil dispute.",
  "suggestedCategory": "property_law",
  "urgency": "medium",
  "directoryFilters": {
    "specialization": "Property Law",
    "state": "Karnataka"
  },
  "disclaimer": "This is general legal information only, not legal advice."
}
```

### POST /api/ai/document-summary

Request:

```json
{
  "channelId": "uuid",
  "documentText": "...",
  "summaryType": "case_summary",
  "consentGiven": true
}
```

Response:

```json
{
  "facts": [],
  "parties": [],
  "dates": [],
  "issues": [],
  "missingInformation": [],
  "disclaimer": "Draft AI work-product. Advocate must verify."
}
```

### POST /api/consultations/create-channel

Request:

```json
{
  "lawyerId": "uuid",
  "legalCategory": "family_law",
  "shortIssueSummary": "Need guidance on mutual divorce process."
}
```

Response:

```json
{
  "channelId": "uuid",
  "status": "requested"
}
```

## 12. Deployment Architecture

### Branches

```txt
main       -> production
staging    -> Vercel preview / pre-production
feature/*  -> individual feature work
hotfix/*   -> urgent production fix
```

### Vercel environments

- Development.
- Preview.
- Production.

### Supabase environments

Recommended:

- Separate production Supabase project.
- Development branches or separate project for staging.
- Never use Quiet Circle project for Nayam data.

## 13. Required Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
NEXT_PUBLIC_APP_URL=
```

## 14. Compliance Checklist Before Launch

- [ ] No ratings or reviews visible on lawyer profiles.
- [ ] No sponsored listing code path.
- [ ] Directory ordering is neutral and documented.
- [ ] All public profile fields reviewed for BCI compliance.
- [ ] AI disclaimers visible on every AI interaction.
- [ ] RLS enabled on all public tables.
- [ ] Storage bucket is private.
- [ ] Storage policies tested.
- [ ] Service role key absent from client bundle.
- [ ] Admin dashboard protected.
- [ ] Lawyer verification process documented.

# Nayam Product Requirement Document

## 1. Product Summary

Nayam is a compliance-first Indian legal-tech web platform built with Next.js, Supabase, and Vercel. It connects everyday citizens with verified independent advocates through an objective legal directory and gives young advocates a secure AI-assisted legal operations workspace.

Nayam is intentionally not designed as an advertising marketplace. The product strategy respects Bar Council of India Rule 36 by avoiding promotional ranking, paid visibility, public ratings, reviews, sponsor badges, or exaggerated lawyer claims.

## 2. Core Value Proposition: The Bridge

Nayam bridges two underserved needs in the Indian legal ecosystem:

1. Citizens need legal literacy, plain-language explanations, and a safe way to identify the right type of advocate.
2. Independent advocates need affordable workflow tools for document organization, consultation channels, and AI-assisted case summarization.

The platform grows through utility rather than solicitation.

## 3. Product Layers

### 3.1 B2C Public Layer: Nyaya Guide

Nyaya Guide is a public legal literacy assistant.

Primary functions:

- Explain BNS, IPC, CrPC, civil, family, property, consumer, employment, tenancy, and cyber-law terms in simple language.
- Translate complex legal terms into citizen-friendly language.
- Support regional language outputs where technically feasible.
- Classify the user issue into a broad legal category.
- Route the user to an objective, non-ranked advocate directory.

Nyaya Guide must not:

- Provide formal legal advice.
- Recommend one lawyer over another based on commercial ranking.
- Promise outcomes.
- Draft litigation strategy for citizens.
- Encourage unnecessary litigation.

Required disclaimer:

> This is general legal information for awareness only. It is not formal legal advice and does not create an advocate-client relationship. Please consult a qualified advocate for advice specific to your matter.

### 3.2 B2B SaaS Layer: Lawyer Workspace

Lawyer Workspace is a secure dashboard for advocates.

Primary functions:

- Manage consultation channels.
- Receive client documents securely.
- Upload case notes and documents.
- Generate AI-assisted document summaries.
- Extract facts, parties, dates, issues, missing information, and possible research points.
- Maintain compartmentalized client matter records.

The AI assistant must not:

- Replace the advocate's professional judgment.
- Invent case law or statutory provisions.
- File or submit documents automatically.
- Generate privileged outputs visible to unrelated users.

Required disclaimer:

> AI-generated summaries are draft work-product aids for advocate review only. The advocate must verify all facts, law, citations, and procedural requirements before use.

## 4. Compliance Requirements

### 4.1 BCI Rule 36 Safeguards

The lawyer directory must remain objective and informational.

Allowed fields:

- Advocate full name.
- Verified Bar Council ID.
- Bar Council state.
- Enrollment number and year.
- Practice areas / specializations.
- City and state.
- Court practice areas.
- Languages.
- Basic contact information.
- Availability status.

Disallowed fields for public profile display:

- Public reviews.
- Ratings.
- Paid promotions.
- Sponsored listings.
- Leaderboards.
- “Top lawyer” labels.
- “Best advocate” claims.
- Success rates.
- Case outcome claims.
- Client testimonials.
- Comparative claims.

### 4.2 Directory Ordering

Directory results must use neutral ordering only.

Permitted ordering examples:

- Alphabetical by advocate name.
- Distance/location relevance.
- Matching specialization filter.
- Recently verified.

Not permitted:

- Paid rank boosts.
- Rating-based ranking.
- Conversion-based ranking.
- Platform-curated “recommended” ranking without objective explanation.

## 5. Target Users

### 5.1 Citizen / Client

Needs:

- Understand legal issue in simple language.
- Find the right category of lawyer.
- Contact or request consultation securely.
- Upload documents safely.
- Message only within a secured consultation channel.

### 5.2 Advocate / Lawyer

Needs:

- Create a verified profile.
- Manage incoming consultation channels.
- Review client documents.
- Summarize case documents.
- Maintain matter-specific records.
- Avoid accidental breach of professional conduct rules.

### 5.3 Admin / Compliance Operator

Needs:

- Verify advocate Bar Council information.
- Approve, reject, suspend, or request more information.
- Monitor abuse.
- Review AI usage logs at a compliance metadata level.
- Avoid reading privileged content unless legally required and authorized.

## 6. MVP Scope

### Included in MVP

- Supabase Auth with email and mobile OTP readiness.
- Role-based onboarding for clients and lawyers.
- Lawyer profile creation.
- Admin verification workflow.
- Objective lawyer directory.
- Consultation channel creation.
- Secure messaging model.
- Legal document metadata model.
- Private Storage policy model.
- Nyaya Guide AI route placeholder.
- Lawyer document summary AI route placeholder.
- AI document logs with consent tracking.
- RLS policies for all core tables.

### Excluded from MVP

- Payment gateway.
- Public reviews and ratings.
- Sponsored lawyer profiles.
- Legal notice filing automation.
- Court e-filing integration.
- Automated lawyer-client matching promises.
- Public success metrics for lawyers.

## 7. Functional Requirements

### FR1: Authentication

Users can sign in using Supabase Auth.

Acceptance criteria:

- Every user maps to `users` table via `auth.users.id`.
- Every user has exactly one platform role.
- Unauthenticated users can access public education and directory pages only.

### FR2: Client Profile

Clients can create and update their profile.

Acceptance criteria:

- Client can read and update only their own profile.
- Lawyers cannot browse private client profiles unless connected through a consultation channel.

### FR3: Lawyer Profile

Lawyers can create advocate profiles.

Acceptance criteria:

- Public directory only shows verified and active lawyers.
- Public lawyer profile does not show ratings, reviews, testimonials, or paid ranking.
- Lawyer can edit own profile but cannot self-verify.

### FR4: Lawyer Verification

Admins verify lawyer profiles.

Acceptance criteria:

- Admin can set verification status.
- Verification status supports pending, verified, rejected, and suspended.
- Verified timestamp and verifier are tracked.

### FR5: Consultation Channel

Clients can initiate a secure consultation channel with a verified lawyer.

Acceptance criteria:

- Client and assigned lawyer can access the channel.
- Non-participants cannot access channel metadata, messages, documents, or AI logs.
- Channel lifecycle supports requested, accepted, active, closed, rejected, and cancelled.

### FR6: Secure Documents

Clients and lawyers can attach documents to a consultation channel.

Acceptance criteria:

- Documents are stored in a private Supabase Storage bucket.
- Metadata is linked to a consultation channel.
- Only channel participants can access metadata and files.

### FR7: AI Document Logs

AI document activity is logged.

Acceptance criteria:

- Logs include actor, channel, query type, consent flag, model metadata, and output.
- Only the actor, channel participants, or admins can access logs as allowed by policy.
- AI use requires explicit consent.

### FR8: Regional Translation

Nyaya Guide can produce simplified explanations in selected regional languages.

Acceptance criteria:

- Output must include an English or regional disclaimer.
- The assistant must preserve uncertainty.
- It must avoid giving legal advice.
- It must route to broad legal categories only.

## 8. Non-Functional Requirements

### Security

- RLS enabled on every public table.
- Private Storage bucket for legal documents.
- Server-side AI calls only.
- Service role key never exposed to browser.
- Audit fields on privileged records.

### Privacy

- Client-lawyer records are matter-compartmentalized.
- AI logs are linked to channels and users.
- Document processing requires consent.
- Avoid public exposure of client identity.

### Performance

- Public directory should support indexed filtering by state, city, specialization, and language.
- AI calls should be asynchronous where needed in later versions.
- Dashboard pages should use server components for secure data fetching.

### Reliability

- All schema changes must be applied as migrations.
- Vercel preview deployments should be used for staging.
- Supabase production data should not be used for local development.

## 9. Key User Journeys

### Journey 1: Citizen Uses Nyaya Guide

1. Citizen visits public Nyaya Guide.
2. Enters issue in simple language.
3. Selects preferred language.
4. AI explains issue at high level.
5. AI classifies broad category.
6. Citizen is shown neutral directory filters.
7. Citizen can request a consultation with a verified lawyer.

### Journey 2: Lawyer Onboards

1. Lawyer signs up.
2. Selects lawyer role.
3. Submits Bar Council details.
4. Profile remains pending.
5. Admin verifies details.
6. Profile becomes visible in objective directory.

### Journey 3: Secure Consultation

1. Client requests channel with a verified lawyer.
2. Channel status is requested.
3. Lawyer accepts or rejects.
4. If accepted, both parties can message and upload documents.
5. Lawyer can generate internal AI summary after consent.
6. Channel can be closed after matter discussion.

## 10. Success Metrics

Compliance-safe metrics:

- Number of Nyaya Guide sessions.
- Number of issue classifications.
- Number of verified lawyers onboarded.
- Number of secure consultation channels created.
- Number of AI summaries generated by lawyers.
- Time saved per lawyer workflow.

Avoid using public ranking metrics such as “top lawyer conversion rate” or public review score.

## 11. Risks and Mitigations

### Risk: BCI Rule 36 violation

Mitigation:

- No public reviews or ratings.
- No sponsored listings.
- Neutral directory ordering.
- Compliance review before launching profile changes.

### Risk: AI gives legal advice

Mitigation:

- Strong system prompts.
- Mandatory disclaimers.
- Category routing instead of legal conclusions.
- No statute/case citation generation for public users unless source-backed in future.

### Risk: Privileged data leak

Mitigation:

- Strict RLS.
- Private Storage bucket.
- Participant-only channel access.
- Server-side data access.
- Consent tracking for AI processing.

### Risk: Hallucinated legal output

Mitigation:

- Lawyer-side AI marked as draft only.
- Require advocate verification.
- Avoid unsupported legal citations in MVP.

## 12. Launch Milestones

### Milestone 1: Foundation

- Repo scaffold.
- Supabase schema and RLS.
- Basic public pages.
- Dashboard route structure.

### Milestone 2: Directory and Onboarding

- Lawyer onboarding.
- Admin verification.
- Public directory.

### Milestone 3: Consultation Channels

- Channel request flow.
- Participant-only access.
- Secure document metadata.

### Milestone 4: AI Utility

- Nyaya Guide endpoint.
- Lawyer summary endpoint.
- AI logs and consent.

### Milestone 5: Production Hardening

- Storage upload flow.
- Rate limiting.
- Monitoring.
- Legal review.
- Security audit.

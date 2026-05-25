-- Nayam initial schema
-- Compliance-first Indian legal-tech platform

create extension if not exists "pgcrypto";

-- Enums
create type public.app_role as enum ('client', 'lawyer', 'admin');
create type public.verification_status as enum ('pending', 'verified', 'rejected', 'suspended');
create type public.channel_status as enum ('requested', 'accepted', 'active', 'closed', 'rejected', 'cancelled');
create type public.message_type as enum ('text', 'system', 'file');
create type public.ai_log_type as enum ('nyaya_guide', 'lawyer_case_summary', 'lawyer_document_points', 'translation');

-- Users table maps auth.users to app role.
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.app_role not null default 'client',
  email text,
  phone text,
  display_name text not null,
  preferred_language text not null default 'en',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles_client (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  full_name text not null,
  city text,
  state text,
  preferred_language text not null default 'en',
  emergency_contact text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles_lawyer (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  full_name text not null,
  bar_council_id text not null unique,
  bar_council_state text not null,
  enrollment_number text not null,
  enrollment_year int,
  verification_status public.verification_status not null default 'pending',
  verified_at timestamptz,
  verified_by uuid references public.users(id),
  specializations text[] not null default '{}',
  courts text[] not null default '{}',
  languages text[] not null default '{}',
  city text,
  state text,
  contact_email text,
  contact_phone text,
  office_address text,
  is_directory_visible boolean not null default false,
  is_accepting_channels boolean not null default true,
  internal_admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint enrollment_year_reasonable check (enrollment_year is null or enrollment_year between 1900 and extract(year from now())::int)
);

create table public.consultation_channels (
  id uuid primary key default gen_random_uuid(),
  client_user_id uuid not null references public.users(id) on delete cascade,
  lawyer_user_id uuid not null references public.users(id) on delete cascade,
  status public.channel_status not null default 'requested',
  legal_category text not null,
  short_issue_summary text,
  client_consent_for_ai boolean not null default false,
  accepted_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint client_and_lawyer_are_different check (client_user_id <> lawyer_user_id)
);

create table public.consultation_messages (
  id uuid primary key default gen_random_uuid(),
  channel_id uuid not null references public.consultation_channels(id) on delete cascade,
  sender_user_id uuid not null references public.users(id) on delete cascade,
  message_type public.message_type not null default 'text',
  body text,
  storage_path text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.legal_documents (
  id uuid primary key default gen_random_uuid(),
  channel_id uuid not null references public.consultation_channels(id) on delete cascade,
  uploaded_by_user_id uuid not null references public.users(id) on delete cascade,
  file_name text not null,
  storage_path text not null unique,
  mime_type text,
  file_size_bytes bigint,
  created_at timestamptz not null default now()
);

create table public.ai_document_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references public.users(id) on delete set null,
  channel_id uuid references public.consultation_channels(id) on delete cascade,
  document_id uuid references public.legal_documents(id) on delete set null,
  log_type public.ai_log_type not null,
  input_language text,
  output_language text,
  prompt_summary text,
  input_text_redacted text,
  output_json jsonb,
  suggested_legal_category text,
  model_provider text,
  model_name text,
  consent_given boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.lawyer_verification_events (
  id uuid primary key default gen_random_uuid(),
  lawyer_profile_id uuid not null references public.profiles_lawyer(id) on delete cascade,
  actor_user_id uuid references public.users(id) on delete set null,
  old_status public.verification_status,
  new_status public.verification_status not null,
  notes text,
  created_at timestamptz not null default now()
);

-- Indexes
create index idx_users_role on public.users(role);
create index idx_profiles_lawyer_public_filters on public.profiles_lawyer(state, city, verification_status, is_directory_visible);
create index idx_profiles_lawyer_specializations on public.profiles_lawyer using gin(specializations);
create index idx_profiles_lawyer_languages on public.profiles_lawyer using gin(languages);
create index idx_channels_client on public.consultation_channels(client_user_id);
create index idx_channels_lawyer on public.consultation_channels(lawyer_user_id);
create index idx_messages_channel on public.consultation_messages(channel_id, created_at);
create index idx_documents_channel on public.legal_documents(channel_id);
create index idx_ai_logs_channel on public.ai_document_logs(channel_id);
create index idx_ai_logs_actor on public.ai_document_logs(actor_user_id);

-- Updated timestamp helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_users_updated_at before update on public.users for each row execute function public.set_updated_at();
create trigger set_profiles_client_updated_at before update on public.profiles_client for each row execute function public.set_updated_at();
create trigger set_profiles_lawyer_updated_at before update on public.profiles_lawyer for each row execute function public.set_updated_at();
create trigger set_channels_updated_at before update on public.consultation_channels for each row execute function public.set_updated_at();

-- Role helpers
create or replace function public.current_app_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.users where id = auth.uid() and is_active = true;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(select 1 from public.users where id = auth.uid() and role = 'admin' and is_active = true);
$$;

create or replace function public.is_lawyer()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(select 1 from public.users where id = auth.uid() and role = 'lawyer' and is_active = true);
$$;

create or replace function public.is_client()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(select 1 from public.users where id = auth.uid() and role = 'client' and is_active = true);
$$;

create or replace function public.is_channel_participant(channel_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(
    select 1 from public.consultation_channels c
    where c.id = channel_uuid
      and (c.client_user_id = auth.uid() or c.lawyer_user_id = auth.uid() or public.is_admin())
  );
$$;

-- Public directory view: no reviews, ratings, sponsorship, admin notes, or ranking metadata.
create or replace view public.public_lawyer_directory
with (security_invoker = true)
as
select
  pl.user_id,
  pl.full_name,
  pl.bar_council_id,
  pl.bar_council_state,
  pl.enrollment_number,
  pl.enrollment_year,
  pl.specializations,
  pl.courts,
  pl.languages,
  pl.city,
  pl.state,
  pl.contact_email,
  pl.contact_phone,
  pl.office_address
from public.profiles_lawyer pl
where pl.verification_status = 'verified'
  and pl.is_directory_visible = true;

-- Enable RLS
alter table public.users enable row level security;
alter table public.profiles_client enable row level security;
alter table public.profiles_lawyer enable row level security;
alter table public.consultation_channels enable row level security;
alter table public.consultation_messages enable row level security;
alter table public.legal_documents enable row level security;
alter table public.ai_document_logs enable row level security;
alter table public.lawyer_verification_events enable row level security;

-- users policies
create policy "users_read_own_or_admin" on public.users
for select to authenticated
using (id = auth.uid() or public.is_admin());

create policy "users_insert_own" on public.users
for insert to authenticated
with check (id = auth.uid());

create policy "users_update_own_basic_or_admin" on public.users
for update to authenticated
using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

-- client profiles
create policy "clients_read_own_or_admin" on public.profiles_client
for select to authenticated
using (user_id = auth.uid() or public.is_admin());

create policy "clients_insert_own" on public.profiles_client
for insert to authenticated
with check (user_id = auth.uid() and public.is_client());

create policy "clients_update_own" on public.profiles_client
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- lawyer profiles
create policy "lawyers_public_verified_read" on public.profiles_lawyer
for select to anon, authenticated
using (verification_status = 'verified' and is_directory_visible = true);

create policy "lawyers_read_own_or_admin" on public.profiles_lawyer
for select to authenticated
using (user_id = auth.uid() or public.is_admin());

create policy "lawyers_insert_own" on public.profiles_lawyer
for insert to authenticated
with check (user_id = auth.uid() and public.is_lawyer());

create policy "lawyers_update_own_non_verification_fields" on public.profiles_lawyer
for update to authenticated
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

-- consultation channels
create policy "channels_participants_read" on public.consultation_channels
for select to authenticated
using (public.is_channel_participant(id));

create policy "clients_create_channels" on public.consultation_channels
for insert to authenticated
with check (
  client_user_id = auth.uid()
  and public.is_client()
  and exists (
    select 1 from public.profiles_lawyer pl
    where pl.user_id = lawyer_user_id
      and pl.verification_status = 'verified'
      and pl.is_accepting_channels = true
  )
);

create policy "channel_participants_update" on public.consultation_channels
for update to authenticated
using (public.is_channel_participant(id))
with check (public.is_channel_participant(id));

-- messages
create policy "messages_participants_read" on public.consultation_messages
for select to authenticated
using (public.is_channel_participant(channel_id));

create policy "messages_participants_insert" on public.consultation_messages
for insert to authenticated
with check (sender_user_id = auth.uid() and public.is_channel_participant(channel_id));

create policy "messages_sender_or_admin_update" on public.consultation_messages
for update to authenticated
using (sender_user_id = auth.uid() or public.is_admin())
with check (sender_user_id = auth.uid() or public.is_admin());

-- legal documents
create policy "documents_participants_read" on public.legal_documents
for select to authenticated
using (public.is_channel_participant(channel_id));

create policy "documents_participants_insert" on public.legal_documents
for insert to authenticated
with check (uploaded_by_user_id = auth.uid() and public.is_channel_participant(channel_id));

create policy "documents_uploader_or_admin_delete" on public.legal_documents
for delete to authenticated
using (uploaded_by_user_id = auth.uid() or public.is_admin());

-- ai logs
create policy "ai_logs_participants_read" on public.ai_document_logs
for select to authenticated
using (
  actor_user_id = auth.uid()
  or (channel_id is not null and public.is_channel_participant(channel_id))
  or public.is_admin()
);

create policy "ai_logs_actor_insert" on public.ai_document_logs
for insert to authenticated
with check (
  actor_user_id = auth.uid()
  and consent_given = true
  and (
    channel_id is null
    or public.is_channel_participant(channel_id)
  )
);

-- verification events
create policy "verification_events_admin_read" on public.lawyer_verification_events
for select to authenticated
using (public.is_admin());

create policy "verification_events_admin_insert" on public.lawyer_verification_events
for insert to authenticated
with check (public.is_admin());

-- Private storage bucket for legal documents
insert into storage.buckets (id, name, public)
values ('legal-documents', 'legal-documents', false)
on conflict (id) do nothing;

-- Storage RLS policies for legal-documents bucket.
-- Folder convention: {consultation_channel_id}/{document_id}/{filename}
create policy "storage_legal_documents_participant_select"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'legal-documents'
  and public.is_channel_participant(((storage.foldername(name))[1])::uuid)
);

create policy "storage_legal_documents_participant_insert"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'legal-documents'
  and public.is_channel_participant(((storage.foldername(name))[1])::uuid)
);

create policy "storage_legal_documents_participant_update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'legal-documents'
  and public.is_channel_participant(((storage.foldername(name))[1])::uuid)
)
with check (
  bucket_id = 'legal-documents'
  and public.is_channel_participant(((storage.foldername(name))[1])::uuid)
);

create policy "storage_legal_documents_participant_delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'legal-documents'
  and public.is_channel_participant(((storage.foldername(name))[1])::uuid)
);

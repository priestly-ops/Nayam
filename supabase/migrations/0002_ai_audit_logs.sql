-- AI audit logs for model routing, billing, latency, and security monitoring.

create table if not exists public.ai_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references public.users(id) on delete set null,
  actor_role public.app_role,
  channel_id uuid references public.consultation_channels(id) on delete set null,
  route_name text not null,
  provider text not null,
  model_name text not null,
  use_case text not null,
  input_language text,
  output_language text,
  prompt_tokens int,
  completion_tokens int,
  total_tokens int,
  latency_ms int,
  finish_reason text,
  generation_id text,
  success boolean not null default true,
  error_message text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_ai_audit_logs_actor on public.ai_audit_logs(actor_user_id, created_at desc);
create index if not exists idx_ai_audit_logs_channel on public.ai_audit_logs(channel_id, created_at desc);
create index if not exists idx_ai_audit_logs_route on public.ai_audit_logs(route_name, created_at desc);
create index if not exists idx_ai_audit_logs_provider on public.ai_audit_logs(provider, model_name, created_at desc);

alter table public.ai_audit_logs enable row level security;

create policy "ai_audit_logs_actor_read_own"
on public.ai_audit_logs
for select
to authenticated
using (
  actor_user_id = auth.uid()
  or (channel_id is not null and public.is_channel_participant(channel_id))
  or public.is_admin()
);

create policy "ai_audit_logs_actor_insert_own"
on public.ai_audit_logs
for insert
to authenticated
with check (
  actor_user_id = auth.uid()
  and (
    channel_id is null
    or public.is_channel_participant(channel_id)
  )
);

create policy "ai_audit_logs_admin_all"
on public.ai_audit_logs
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

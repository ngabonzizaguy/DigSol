-- Phase 2b: leads pipeline + message thread (run after 20260526000001)

update public.leads set status = 'in_progress' where status = 'contacted';
update public.leads set status = 'closed' where status in ('won', 'lost');

alter table public.leads
  add column if not exists replied_at timestamptz,
  add column if not exists closed_at timestamptz,
  add column if not exists first_response_at timestamptz;

create type public.lead_message_direction as enum ('outbound', 'inbound', 'note');
create type public.lead_message_channel as enum ('email', 'internal');
create type public.lead_message_provider as enum ('mock', 'resend');

create table public.lead_messages (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  direction public.lead_message_direction not null,
  channel public.lead_message_channel not null default 'email',
  subject text,
  body text not null,
  to_email text,
  from_email text,
  provider public.lead_message_provider not null default 'mock',
  provider_id text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index lead_messages_lead_id_idx on public.lead_messages (lead_id, created_at desc);

alter table public.lead_messages enable row level security;

create policy "lead_messages: editor read" on public.lead_messages
  for select to authenticated using (public.is_editor());

create policy "lead_messages: editor insert" on public.lead_messages
  for insert to authenticated with check (public.is_editor());

create policy "lead_messages: editor update" on public.lead_messages
  for update to authenticated using (public.is_editor());

create policy "lead_messages: admin delete" on public.lead_messages
  for delete to authenticated using (public.is_admin());

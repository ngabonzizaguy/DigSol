-- Quick Start: extend leads with structured fields and a new lead kind.
-- Phase A migration. Backfills existing rows where possible.

-- 1. Extend lead_kind enum
alter type public.lead_kind add value if not exists 'quick_start';

-- 2. New structured columns on leads
alter table public.leads
  add column if not exists phone text,
  add column if not exists country_code text,             -- ISO 3166-1 alpha-2 (e.g. RW, US)
  add column if not exists phone_dial_code text,          -- e.g. +250
  add column if not exists budget_min integer,
  add column if not exists budget_max integer,
  add column if not exists budget_currency text,
  add column if not exists budget_unsure boolean default false,
  add column if not exists preferred_channel text,
  add column if not exists preferred_window text,
  add column if not exists service_slugs text[] default '{}',
  add column if not exists custom_request text;

-- 3. Constraints (idempotent)
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'leads_budget_currency_check'
  ) then
    alter table public.leads
      add constraint leads_budget_currency_check
      check (budget_currency is null or budget_currency in ('RWF','USD'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'leads_preferred_channel_check'
  ) then
    alter table public.leads
      add constraint leads_preferred_channel_check
      check (preferred_channel is null or preferred_channel in ('email','whatsapp','phone'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'leads_budget_range_check'
  ) then
    alter table public.leads
      add constraint leads_budget_range_check
      check (budget_min is null or budget_max is null or budget_min <= budget_max);
  end if;
end$$;

-- 4. Backfill phone from payload.phone (consultation rows)
update public.leads
set phone = payload->>'phone'
where phone is null
  and payload ? 'phone'
  and length(coalesce(payload->>'phone', '')) > 0;

-- 5. Helpful index for inbox filter by source
create index if not exists leads_kind_status_idx on public.leads (kind, status);
create index if not exists leads_source_idx on public.leads ((payload->>'source'));

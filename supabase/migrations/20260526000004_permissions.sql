-- Phase 2: per-profile permission overrides (null = role preset)

alter table public.profiles
  add column if not exists permissions jsonb default null;

comment on column public.profiles.permissions is 'Optional overrides: { "leads": ["read","reply"], ... }';

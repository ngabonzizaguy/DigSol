-- DigSolutions CMS — initial schema
-- All tables in `public` get RLS enabled. Admin server actions use service role.

-- ============================================================================
-- Extensions
-- ============================================================================
create extension if not exists "uuid-ossp";

-- ============================================================================
-- Enums
-- ============================================================================
create type public.user_role as enum ('admin', 'editor', 'viewer');
create type public.content_status as enum ('draft', 'published', 'archived');
create type public.segment_kind as enum ('smb', 'midmarket', 'enterprise');
create type public.orb_color as enum ('mint', 'peach', 'lavender', 'sky', 'rose');
create type public.lead_kind as enum ('contact', 'consultation', 'newsletter', 'guide');
create type public.lead_status as enum ('new', 'contacted', 'qualified', 'won', 'lost');

-- ============================================================================
-- Profiles (mirrors auth.users)
-- ============================================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  role public.user_role not null default 'viewer',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, role)
  values (
    new.id,
    new.email,
    case when new.email = current_setting('app.bootstrap_admin_email', true) then 'admin'::public.user_role
         else 'viewer'::public.user_role end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper to check if the calling user is an admin or editor
create or replace function public.is_editor()
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role in ('admin', 'editor')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role = 'admin'
  );
$$;

-- ============================================================================
-- Content tables
-- ============================================================================

create table public.services (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  title text not null,
  short text not null,
  long text not null,
  outcomes text[] not null default '{}',
  deliverables text[] not null default '{}',
  capabilities text[] not null default '{}',
  orb public.orb_color not null default 'lavender',
  status public.content_status not null default 'draft',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.industries (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  name text not null,
  short text not null,
  challenges text[] not null default '{}',
  solutions text[] not null default '{}',
  status public.content_status not null default 'draft',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.case_studies (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  client text not null,
  title text not null,
  segment public.segment_kind not null,
  industry text not null,
  summary text not null,
  challenge text not null,
  approach text not null,
  outcome text not null,
  metrics jsonb not null default '[]'::jsonb,
  service_slugs text[] not null default '{}',
  cover_url text,
  orb public.orb_color not null default 'mint',
  status public.content_status not null default 'draft',
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.insights (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  body text[] not null default '{}',
  author text not null,
  author_role text not null,
  category text not null,
  read_time text not null,
  cover_url text,
  status public.content_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.guides (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  format text not null,
  pages integer not null,
  file_url text,
  status public.content_status not null default 'draft',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.testimonials (
  id uuid primary key default uuid_generate_v4(),
  quote text not null,
  name text not null,
  role text not null,
  company text not null,
  status public.content_status not null default 'published',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.team_members (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  role text not null,
  bio text not null,
  avatar_url text,
  status public.content_status not null default 'published',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.open_roles (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  title text not null,
  team text not null,
  location text not null,
  employment_type text not null,
  description text,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- Leads (form submissions)
-- ============================================================================
create table public.leads (
  id uuid primary key default uuid_generate_v4(),
  kind public.lead_kind not null,
  name text,
  email text not null,
  company text,
  role text,
  company_size text,
  timeline text,
  intent text,
  message text,
  payload jsonb not null default '{}'::jsonb,
  status public.lead_status not null default 'new',
  notes text,
  assigned_to uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index leads_created_at_idx on public.leads (created_at desc);
create index leads_status_idx on public.leads (status);

-- ============================================================================
-- Site settings (singleton)
-- ============================================================================
create table public.site_settings (
  id integer primary key default 1,
  brand jsonb not null default '{}'::jsonb,
  contact jsonb not null default '{}'::jsonb,
  social jsonb not null default '{}'::jsonb,
  seo_defaults jsonb not null default '{}'::jsonb,
  pricing_tiers jsonb not null default '[]'::jsonb,
  integrations jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

-- ============================================================================
-- Media library metadata (actual files in Storage)
-- ============================================================================
create table public.media (
  id uuid primary key default uuid_generate_v4(),
  path text not null,
  mime text not null,
  width integer,
  height integer,
  bytes integer not null,
  alt text,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- Activity log (audit trail)
-- ============================================================================
create table public.activity_log (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid references public.profiles(id) on delete set null,
  entity text not null,
  entity_id text,
  action text not null,
  diff jsonb,
  created_at timestamptz not null default now()
);

create index activity_log_created_at_idx on public.activity_log (created_at desc);
create index activity_log_entity_idx on public.activity_log (entity, entity_id);

-- ============================================================================
-- Page views (lightweight analytics)
-- ============================================================================
create table public.page_views (
  id bigserial primary key,
  path text not null,
  referrer text,
  user_agent text,
  country text,
  session_id text,
  created_at timestamptz not null default now()
);

create index page_views_path_idx on public.page_views (path);
create index page_views_created_at_idx on public.page_views (created_at desc);

-- ============================================================================
-- updated_at triggers
-- ============================================================================
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  for t in
    select unnest(array['profiles','services','industries','case_studies','insights','guides',
      'testimonials','team_members','open_roles','leads','site_settings'])
  loop
    execute format('drop trigger if exists touch_updated_at on public.%I', t);
    execute format('create trigger touch_updated_at before update on public.%I for each row execute function public.touch_updated_at()', t);
  end loop;
end$$;

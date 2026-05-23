-- DigSolutions CMS — RLS policies
-- Read: public sees `status = 'published'`. Editors/admins see all.
-- Write: only editors/admins.

-- Enable RLS on every table
alter table public.profiles enable row level security;
alter table public.services enable row level security;
alter table public.industries enable row level security;
alter table public.case_studies enable row level security;
alter table public.insights enable row level security;
alter table public.guides enable row level security;
alter table public.testimonials enable row level security;
alter table public.team_members enable row level security;
alter table public.open_roles enable row level security;
alter table public.leads enable row level security;
alter table public.site_settings enable row level security;
alter table public.media enable row level security;
alter table public.activity_log enable row level security;
alter table public.page_views enable row level security;

-- ============================================================================
-- profiles
-- ============================================================================
create policy "profiles: read own" on public.profiles
  for select to authenticated using (id = auth.uid());

create policy "profiles: admins read all" on public.profiles
  for select to authenticated using (public.is_admin());

create policy "profiles: update own" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "profiles: admin manage" on public.profiles
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ============================================================================
-- Content tables — read published anon; editors manage all
-- ============================================================================

-- Helper macro applied per table via DO block
do $$
declare t text;
begin
  for t in
    select unnest(array['services','industries','case_studies','insights','guides','open_roles'])
  loop
    execute format($f$
      create policy "%1$s: anon read published" on public.%1$I
        for select to anon, authenticated
        using (status = 'published');
    $f$, t);

    execute format($f$
      create policy "%1$s: editor read all" on public.%1$I
        for select to authenticated
        using (public.is_editor());
    $f$, t);

    execute format($f$
      create policy "%1$s: editor write" on public.%1$I
        for all to authenticated
        using (public.is_editor())
        with check (public.is_editor());
    $f$, t);
  end loop;
end$$;

-- testimonials & team_members are always public when status=published
do $$
declare t text;
begin
  for t in select unnest(array['testimonials','team_members']) loop
    execute format($f$
      create policy "%1$s: anon read published" on public.%1$I
        for select to anon, authenticated
        using (status = 'published');
    $f$, t);
    execute format($f$
      create policy "%1$s: editor read all" on public.%1$I
        for select to authenticated using (public.is_editor());
    $f$, t);
    execute format($f$
      create policy "%1$s: editor write" on public.%1$I
        for all to authenticated using (public.is_editor()) with check (public.is_editor());
    $f$, t);
  end loop;
end$$;

-- ============================================================================
-- leads — anon can INSERT (forms); only editors can read/manage
-- ============================================================================
create policy "leads: anon insert" on public.leads
  for insert to anon, authenticated with check (true);

create policy "leads: editor read" on public.leads
  for select to authenticated using (public.is_editor());

create policy "leads: editor update" on public.leads
  for update to authenticated using (public.is_editor()) with check (public.is_editor());

create policy "leads: admin delete" on public.leads
  for delete to authenticated using (public.is_admin());

-- ============================================================================
-- site_settings — read everyone, write admins
-- ============================================================================
create policy "site_settings: read all" on public.site_settings
  for select to anon, authenticated using (true);

create policy "site_settings: admin write" on public.site_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ============================================================================
-- media — editors manage; published referenced URLs served via Storage anon read
-- ============================================================================
create policy "media: editor read" on public.media
  for select to authenticated using (public.is_editor());

create policy "media: editor write" on public.media
  for all to authenticated using (public.is_editor()) with check (public.is_editor());

-- ============================================================================
-- activity_log — editors read, system inserts via service role
-- ============================================================================
create policy "activity: editor read" on public.activity_log
  for select to authenticated using (public.is_editor());

-- ============================================================================
-- page_views — anon insert (server-side relay), editors read
-- ============================================================================
create policy "page_views: anon insert" on public.page_views
  for insert to anon, authenticated with check (true);

create policy "page_views: editor read" on public.page_views
  for select to authenticated using (public.is_editor());

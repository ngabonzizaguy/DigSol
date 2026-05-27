-- Quick Start: lead_attachments table for files, links, and voice notes.
-- Phase B (created in Phase A so the schema is ready, no UI yet).

create table if not exists public.lead_attachments (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  kind text not null check (kind in ('image','document','link','voice')),
  storage_path text,
  url text,
  original_name text,
  mime text,
  size_bytes integer,
  duration_ms integer,
  created_at timestamptz not null default now()
);

create index if not exists lead_attachments_lead_id_idx on public.lead_attachments(lead_id);

alter table public.lead_attachments enable row level security;

-- Editors can read; admins can delete; inserts only via service role (server action).
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'lead_attachments' and policyname = 'lead_attachments: editor read'
  ) then
    create policy "lead_attachments: editor read" on public.lead_attachments
      for select to authenticated using (public.is_editor());
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'lead_attachments' and policyname = 'lead_attachments: admin delete'
  ) then
    create policy "lead_attachments: admin delete" on public.lead_attachments
      for delete to authenticated using (public.is_admin());
  end if;
end$$;

-- Private storage bucket for prospect uploads (voice notes + files).
insert into storage.buckets (id, name, public)
values ('quick-start-uploads', 'quick-start-uploads', false)
on conflict (id) do nothing;

-- Bucket policies: only editors can read; only service role writes.
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'quick-start-uploads: editor read'
  ) then
    create policy "quick-start-uploads: editor read" on storage.objects
      for select to authenticated
      using (bucket_id = 'quick-start-uploads' and public.is_editor());
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'quick-start-uploads: admin delete'
  ) then
    create policy "quick-start-uploads: admin delete" on storage.objects
      for delete to authenticated
      using (bucket_id = 'quick-start-uploads' and public.is_admin());
  end if;
end$$;

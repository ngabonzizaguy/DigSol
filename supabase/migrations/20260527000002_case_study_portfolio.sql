-- Portfolio enrichment: gallery, optional public URL with toggle, and customer comment.
-- All columns are optional so existing rows keep working.

alter table public.case_studies
  add column if not exists project_url text,
  add column if not exists show_project_url boolean not null default false,
  add column if not exists customer_quote text,
  add column if not exists customer_name text,
  add column if not exists customer_role text,
  add column if not exists media_gallery jsonb not null default '[]'::jsonb;

comment on column public.case_studies.media_gallery is
  'Ordered list of media references: [{ url, mime?, alt?, caption? }]';

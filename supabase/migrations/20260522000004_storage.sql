-- DigSolutions — Storage bucket for media library
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Public read for the media bucket
create policy if not exists "media: public read"
  on storage.objects for select
  using (bucket_id = 'media');

-- Editor write
create policy if not exists "media: editor insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.is_editor());

create policy if not exists "media: editor update"
  on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.is_editor())
  with check (bucket_id = 'media' and public.is_editor());

create policy if not exists "media: editor delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.is_editor());

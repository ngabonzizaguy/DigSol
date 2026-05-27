-- Explicit INSERT policies for service-role uploads (belt-and-suspenders with RLS bypass).

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'lead_attachments'
      and policyname = 'lead_attachments: service insert'
  ) then
    create policy "lead_attachments: service insert" on public.lead_attachments
      for insert to service_role
      with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'quick-start-uploads: service insert'
  ) then
    create policy "quick-start-uploads: service insert" on storage.objects
      for insert to service_role
      with check (bucket_id = 'quick-start-uploads');
  end if;
end$$;

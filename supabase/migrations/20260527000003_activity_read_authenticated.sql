-- Allow any authenticated user (admin, editor, viewer) to read the activity log.
-- Route guards already gate access in the app; viewers need read access for the
-- Activity page to show anything. Writes remain service-role only.

drop policy if exists "activity: editor read" on public.activity_log;

create policy "activity: authenticated read" on public.activity_log
  for select to authenticated using (auth.uid() is not null);

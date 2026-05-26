-- Phase 2a: extend lead_status (must commit before data migration)

alter type public.lead_status add value if not exists 'in_progress';
alter type public.lead_status add value if not exists 'replied';
alter type public.lead_status add value if not exists 'closed';

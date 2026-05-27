-- Phase 2: richer page view attribution (renumbered from 000002)

alter table public.page_views
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists device_type text,
  add column if not exists browser text,
  add column if not exists os text,
  add column if not exists region text;

create index if not exists page_views_device_type_idx on public.page_views (device_type);
create index if not exists page_views_utm_source_idx on public.page_views (utm_source);

create or replace function public.get_analytics_summary(since_ts timestamptz)
returns jsonb
language sql
stable
security invoker
as $$
  select jsonb_build_object(
    'total_views', (select count(*)::int from public.page_views where created_at >= since_ts),
    'by_day', (
      select coalesce(jsonb_agg(row_to_json(t) order by t.day), '[]'::jsonb)
      from (
        select date_trunc('day', created_at)::date as day, count(*)::int as views
        from public.page_views
        where created_at >= since_ts
        group by 1
        order by 1
      ) t
    ),
    'top_pages', (
      select coalesce(jsonb_agg(row_to_json(t)), '[]'::jsonb)
      from (
        select path, count(*)::int as views
        from public.page_views
        where created_at >= since_ts
        group by path
        order by views desc
        limit 10
      ) t
    ),
    'top_referrers', (
      select coalesce(jsonb_agg(row_to_json(t)), '[]'::jsonb)
      from (
        select coalesce(nullif(referrer, ''), '(direct)') as referrer, count(*)::int as views
        from public.page_views
        where created_at >= since_ts
        group by 1
        order by views desc
        limit 10
      ) t
    ),
    'devices', (
      select coalesce(jsonb_agg(row_to_json(t)), '[]'::jsonb)
      from (
        select coalesce(device_type, 'unknown') as device_type, count(*)::int as views
        from public.page_views
        where created_at >= since_ts
        group by 1
        order by views desc
      ) t
    ),
    'countries', (
      select coalesce(jsonb_agg(row_to_json(t)), '[]'::jsonb)
      from (
        select coalesce(country, 'unknown') as country, count(*)::int as views
        from public.page_views
        where created_at >= since_ts
        group by 1
        order by views desc
        limit 12
      ) t
    )
  );
$$;

grant execute on function public.get_analytics_summary(timestamptz) to authenticated, anon;

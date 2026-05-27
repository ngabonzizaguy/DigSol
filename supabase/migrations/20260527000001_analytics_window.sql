-- Analytics: support custom date windows on the summary RPC.
-- The previous RPC accepted only `since_ts`. We now accept an optional `until_ts`
-- so admin dashboards can query arbitrary date ranges.

drop function if exists public.get_analytics_summary(timestamptz);

create or replace function public.get_analytics_summary(
  since_ts timestamptz,
  until_ts timestamptz default now()
)
returns jsonb
language sql
stable
security invoker
as $$
  select jsonb_build_object(
    'total_views', (
      select count(*)::int from public.page_views
      where created_at >= since_ts and created_at < until_ts
    ),
    'by_day', (
      select coalesce(jsonb_agg(row_to_json(t) order by t.day), '[]'::jsonb)
      from (
        select date_trunc('day', created_at)::date as day, count(*)::int as views
        from public.page_views
        where created_at >= since_ts and created_at < until_ts
        group by 1
        order by 1
      ) t
    ),
    'top_pages', (
      select coalesce(jsonb_agg(row_to_json(t)), '[]'::jsonb)
      from (
        select path, count(*)::int as views
        from public.page_views
        where created_at >= since_ts and created_at < until_ts
        group by path
        order by views desc
        limit 10
      ) t
    ),
    'top_referrers', (
      select coalesce(jsonb_agg(row_to_json(t)), '[]'::jsonb)
      from (
        select coalesce(nullif(referrer, ''), 'direct') as referrer,
               count(*)::int as views
        from public.page_views
        where created_at >= since_ts and created_at < until_ts
        group by 1
        order by views desc
        limit 10
      ) t
    ),
    'devices', (
      select coalesce(jsonb_agg(row_to_json(t)), '[]'::jsonb)
      from (
        select coalesce(nullif(device_type, ''), 'unknown') as device_type,
               count(*)::int as views
        from public.page_views
        where created_at >= since_ts and created_at < until_ts
        group by 1
        order by views desc
      ) t
    ),
    'countries', (
      select coalesce(jsonb_agg(row_to_json(t)), '[]'::jsonb)
      from (
        select coalesce(nullif(country, ''), 'unknown') as country,
               count(*)::int as views
        from public.page_views
        where created_at >= since_ts and created_at < until_ts
        group by 1
        order by views desc
        limit 10
      ) t
    )
  );
$$;

grant execute on function public.get_analytics_summary(timestamptz, timestamptz) to authenticated, anon;

import { createClient } from "@/lib/supabase/server";

export type AnalyticsRange = "7d" | "30d" | "90d";

function sinceForRange(range: AnalyticsRange): Date {
  const d = new Date();
  const days = range === "7d" ? 7 : range === "90d" ? 90 : 30;
  d.setDate(d.getDate() - days);
  return d;
}

export type AnalyticsSummary = {
  total_views: number;
  by_day: { day: string; views: number }[];
  top_pages: { path: string; views: number }[];
  top_referrers: { referrer: string; views: number }[];
  devices: { device_type: string; views: number }[];
  countries: { country: string; views: number }[];
};

export async function getAnalyticsSummary(range: AnalyticsRange = "30d"): Promise<AnalyticsSummary> {
  const since = sinceForRange(range).toISOString();
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_analytics_summary", { since_ts: since });
  if (error || !data) {
    return {
      total_views: 0,
      by_day: [],
      top_pages: [],
      top_referrers: [],
      devices: [],
      countries: [],
    };
  }
  const raw = data as AnalyticsSummary;
  return {
    total_views: raw.total_views ?? 0,
    by_day: raw.by_day ?? [],
    top_pages: raw.top_pages ?? [],
    top_referrers: raw.top_referrers ?? [],
    devices: raw.devices ?? [],
    countries: raw.countries ?? [],
  };
}

export async function getLeadFunnelCounts(range: AnalyticsRange = "30d") {
  const since = sinceForRange(range).toISOString();
  const supabase = await createClient();
  const { data } = await supabase.from("leads").select("status").gte("created_at", since);
  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    const s = (row as { status: string }).status;
    counts[s] = (counts[s] ?? 0) + 1;
  }
  return counts;
}

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

export type WeeklyDeviceMixRow = {
  week: string;
  desktop: number;
  mobile: number;
  tablet: number;
};

export type PeriodSplitRow = {
  label: string;
  earlier: number;
  recent: number;
};

function midpointForRange(range: AnalyticsRange): Date {
  const since = sinceForRange(range);
  return new Date(since.getTime() + (Date.now() - since.getTime()) / 2);
}

function weekLabel(date: Date) {
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export async function getWeeklyDeviceMix(range: AnalyticsRange = "30d"): Promise<WeeklyDeviceMixRow[]> {
  const since = sinceForRange(range).toISOString();
  const supabase = await createClient();
  const { data } = await supabase
    .from("page_views")
    .select("created_at, device_type")
    .gte("created_at", since);

  const buckets = new Map<string, WeeklyDeviceMixRow>();

  for (const row of data ?? []) {
    const createdAt = new Date((row as { created_at: string }).created_at);
    const weekStart = new Date(createdAt);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const key = weekStart.toISOString();
    const label = weekLabel(weekStart);

    const bucket = buckets.get(key) ?? { week: label, desktop: 0, mobile: 0, tablet: 0 };
    const device = ((row as { device_type: string | null }).device_type ?? "unknown").toLowerCase();

    if (device === "desktop") bucket.desktop += 1;
    else if (device === "mobile") bucket.mobile += 1;
    else if (device === "tablet") bucket.tablet += 1;

    buckets.set(key, bucket);
  }

  return [...buckets.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([, row]) => row);
}

export async function getCountryPeriodSplit(range: AnalyticsRange = "30d"): Promise<PeriodSplitRow[]> {
  const since = sinceForRange(range).toISOString();
  const mid = midpointForRange(range).toISOString();
  const supabase = await createClient();
  const { data } = await supabase
    .from("page_views")
    .select("created_at, country")
    .gte("created_at", since);

  const earlier = new Map<string, number>();
  const recent = new Map<string, number>();

  for (const row of data ?? []) {
    const createdAt = (row as { created_at: string }).created_at;
    const country = (row as { country: string | null }).country ?? "unknown";
    const target = createdAt < mid ? earlier : recent;
    target.set(country, (target.get(country) ?? 0) + 1);
  }

  const labels = new Set([...earlier.keys(), ...recent.keys()]);
  return [...labels]
    .map((label) => ({
      label: label === "unknown" ? "Unknown" : label,
      earlier: earlier.get(label) ?? 0,
      recent: recent.get(label) ?? 0,
    }))
    .filter((row) => row.earlier + row.recent > 0)
    .sort((a, b) => b.earlier + b.recent - (a.earlier + a.recent))
    .slice(0, 6);
}

export async function getLeadFunnelPeriodSplit(range: AnalyticsRange = "30d"): Promise<PeriodSplitRow[]> {
  const since = sinceForRange(range).toISOString();
  const mid = midpointForRange(range).toISOString();
  const supabase = await createClient();
  const { data } = await supabase
    .from("leads")
    .select("created_at, status")
    .gte("created_at", since);

  const earlier = new Map<string, number>();
  const recent = new Map<string, number>();

  for (const row of data ?? []) {
    const createdAt = (row as { created_at: string }).created_at;
    const status = (row as { status: string }).status;
    const target = createdAt < mid ? earlier : recent;
    target.set(status, (target.get(status) ?? 0) + 1);
  }

  const labels = new Set([...earlier.keys(), ...recent.keys()]);
  return [...labels]
    .map((label) => ({
      label: label.replace(/_/g, " "),
      earlier: earlier.get(label) ?? 0,
      recent: recent.get(label) ?? 0,
    }))
    .filter((row) => row.earlier + row.recent > 0)
    .sort((a, b) => b.earlier + b.recent - (a.earlier + a.recent));
}

import { createClient } from "@/lib/supabase/server";

export type AnalyticsRange = "7d" | "30d" | "90d";

export type AnalyticsWindow = {
  from: Date;
  to: Date;
  /** Stable id for cache busting / URL display. */
  key: string;
};

const RANGE_DAYS: Record<AnalyticsRange, number> = { "7d": 7, "30d": 30, "90d": 90 };

const MAX_SPAN_DAYS = 365;

function startOfDay(d: Date) {
  const next = new Date(d);
  next.setHours(0, 0, 0, 0);
  return next;
}

function endOfDay(d: Date) {
  const next = new Date(d);
  next.setHours(23, 59, 59, 999);
  return next;
}

function parseISODate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return null;
  const d = new Date(`${trimmed}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Build a window from search params, falling back to a preset range. */
export function resolveAnalyticsWindow(params: {
  range?: string | null;
  from?: string | null;
  to?: string | null;
}): AnalyticsWindow {
  const from = parseISODate(params.from ?? null);
  const to = parseISODate(params.to ?? null);

  if (from && to) {
    const safeFrom = startOfDay(from);
    const safeTo = endOfDay(to >= from ? to : from);
    const span = (safeTo.getTime() - safeFrom.getTime()) / 86_400_000;
    if (span > MAX_SPAN_DAYS) {
      safeFrom.setTime(safeTo.getTime() - MAX_SPAN_DAYS * 86_400_000);
    }
    return {
      from: safeFrom,
      to: safeTo,
      key: `${safeFrom.toISOString().slice(0, 10)}_${safeTo.toISOString().slice(0, 10)}`,
    };
  }

  const range: AnalyticsRange =
    params.range === "7d" || params.range === "90d" ? params.range : "30d";
  const toDate = endOfDay(new Date());
  const fromDate = startOfDay(new Date(toDate));
  fromDate.setDate(fromDate.getDate() - RANGE_DAYS[range] + 1);
  return { from: fromDate, to: toDate, key: range };
}

export type AnalyticsSummary = {
  total_views: number;
  by_day: { day: string; views: number }[];
  top_pages: { path: string; views: number }[];
  top_referrers: { referrer: string; views: number }[];
  devices: { device_type: string; views: number }[];
  countries: { country: string; views: number }[];
};

export async function getAnalyticsSummary(window: AnalyticsWindow): Promise<AnalyticsSummary> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_analytics_summary", {
    since_ts: window.from.toISOString(),
    until_ts: window.to.toISOString(),
  });
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

export async function getLeadFunnelCounts(window: AnalyticsWindow) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("leads")
    .select("status")
    .gte("created_at", window.from.toISOString())
    .lt("created_at", window.to.toISOString());
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

function midpoint(window: AnalyticsWindow): Date {
  return new Date(window.from.getTime() + (window.to.getTime() - window.from.getTime()) / 2);
}

function weekLabel(date: Date) {
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export async function getWeeklyDeviceMix(window: AnalyticsWindow): Promise<WeeklyDeviceMixRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("page_views")
    .select("created_at, device_type")
    .gte("created_at", window.from.toISOString())
    .lt("created_at", window.to.toISOString());

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

export async function getCountryPeriodSplit(window: AnalyticsWindow): Promise<PeriodSplitRow[]> {
  const mid = midpoint(window).toISOString();
  const supabase = await createClient();
  const { data } = await supabase
    .from("page_views")
    .select("created_at, country")
    .gte("created_at", window.from.toISOString())
    .lt("created_at", window.to.toISOString());

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

export async function getLeadFunnelPeriodSplit(window: AnalyticsWindow): Promise<PeriodSplitRow[]> {
  const mid = midpoint(window).toISOString();
  const supabase = await createClient();
  const { data } = await supabase
    .from("leads")
    .select("created_at, status")
    .gte("created_at", window.from.toISOString())
    .lt("created_at", window.to.toISOString());

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

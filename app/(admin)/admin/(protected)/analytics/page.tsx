import Link from "next/link";
import { BarChart3, LineChart } from "lucide-react";
import {
  getAnalyticsSummary,
  getCountryPeriodSplit,
  getLeadFunnelCounts,
  getLeadFunnelPeriodSplit,
  getWeeklyDeviceMix,
  type AnalyticsRange,
} from "@/lib/admin/analytics";
import { generateAnalyticsInsight } from "@/lib/ai/actions";
import { PageviewsAreaChart } from "@/components/admin/charts/pageviews-area-chart";
import { BreakdownList } from "@/components/admin/charts/breakdown-list";
import { AnalyticsRadarChart } from "@/components/admin/charts/analytics-radar-chart";
import { AnalyticsMultiRadarChart } from "@/components/admin/charts/analytics-multi-radar-chart";
import { AdminEmpty } from "@/components/admin/ui/admin-empty";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { buttonVariants } from "@/components/admin/ui/button";
import { cn } from "@/lib/utils";

export const metadata = { title: "Analytics" };
export const dynamic = "force-dynamic";

const RANGES: { label: string; value: AnalyticsRange }[] = [
  { label: "7 days", value: "7d" },
  { label: "30 days", value: "30d" },
  { label: "90 days", value: "90d" },
];

const DEVICE_SERIES = [
  { key: "desktop", label: "Desktop" },
  { key: "mobile", label: "Mobile" },
  { key: "tablet", label: "Tablet" },
] as const;

const PERIOD_SERIES = [
  { key: "earlier", label: "First half" },
  { key: "recent", label: "Second half" },
] as const;

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range: rangeParam } = await searchParams;
  const range: AnalyticsRange =
    rangeParam === "7d" || rangeParam === "90d" ? rangeParam : "30d";

  const [summary, funnel, weeklyDeviceMix, countrySplit, funnelSplit] = await Promise.all([
    getAnalyticsSummary(range),
    getLeadFunnelCounts(range),
    getWeeklyDeviceMix(range),
    getCountryPeriodSplit(range),
    getLeadFunnelPeriodSplit(range),
  ]);

  const insight = summary.total_views > 0 ? await generateAnalyticsInsight(summary, funnel) : null;
  const funnelRows = Object.entries(funnel).map(([status, count]) => ({ status, count }));
  const hasTraffic = summary.total_views > 0;

  const topPages = summary.top_pages.map((p) => ({
    label: p.path,
    value: p.views,
  }));
  const topReferrers = mergeBreakdownItems(
    summary.top_referrers.map((r) => ({
      label: formatReferrerLabel(r.referrer),
      value: r.views,
    }))
  );
  const deviceRadar = toRadarData(
    summary.devices.map((d) => ({ label: formatDeviceLabel(d.device_type), value: d.views }))
  );
  const deviceMixRadar = weeklyDeviceMix.map((row) => ({
    subject: row.week,
    desktop: row.desktop,
    mobile: row.mobile,
    tablet: row.tablet,
  }));
  const countryRadar = countrySplit.map((row) => ({
    subject: formatCountryLabel(row.label),
    earlier: row.earlier,
    recent: row.recent,
  }));
  const funnelRadar = funnelSplit.map((row) => ({
    subject: row.label,
    earlier: row.earlier,
    recent: row.recent,
  }));
  const funnelTotals = toRadarData(
    funnelRows.map((r) => ({ label: formatLeadStatus(r.status), value: r.count }))
  );

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[20px] font-semibold tracking-tight text-admin-fg">Analytics</h1>
          <p className="text-[13px] text-admin-fg-subtle">
            First-party traffic and lead pipeline for the selected period.
          </p>
        </div>
        <nav className="flex flex-wrap gap-1 rounded-lg border border-admin-border-soft bg-admin-surface p-1">
          {RANGES.map((r) => (
            <Link
              key={r.value}
              href={`/admin/analytics?range=${r.value}`}
              className={`rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors ${
                range === r.value
                  ? "bg-admin-accent text-admin-accent-fg"
                  : "text-admin-fg-muted hover:bg-admin-hover hover:text-admin-fg"
              }`}
            >
              {r.label}
            </Link>
          ))}
        </nav>
      </header>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Pageviews" value={summary.total_views} />
        <Stat label="New leads" value={funnel.new ?? 0} />
        <Stat label="In progress" value={funnel.in_progress ?? 0} />
        <Stat label="Replied" value={funnel.replied ?? 0} />
      </section>

      {!hasTraffic ? (
        <AdminEmpty
          icon={LineChart}
          title="No traffic recorded yet"
          description="Visit pages on the public site while logged out (or in another browser). Page views appear here within a few seconds."
          action={
            <Link
              href="/"
              target="_blank"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Open marketing site
            </Link>
          }
        />
      ) : (
        <>
          {insight ? (
            <Card className="border-admin-border-soft bg-gradient-to-br from-admin-surface to-admin-elevated">
              <CardHeader className="pb-2">
                <CardTitle className="text-[14px]">Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[13px] leading-relaxed text-admin-fg-muted">{insight}</p>
              </CardContent>
            </Card>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle>Traffic over time</CardTitle>
            </CardHeader>
            <CardContent className="min-h-[14rem]">
              <PageviewsAreaChart data={summary.by_day} />
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <ChartCard title="Top pages" empty={topPages.length === 0}>
              <BreakdownList items={topPages} />
            </ChartCard>
            <ChartCard title="Referrers" empty={topReferrers.length === 0}>
              <BreakdownList items={topReferrers} />
            </ChartCard>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <ChartCard
              title="Device mix over time"
              empty={deviceMixRadar.length === 0}
              subtitle="Weekly sessions by device type"
            >
              <AnalyticsMultiRadarChart
                data={deviceMixRadar}
                series={[...DEVICE_SERIES]}
                description="Compare desktop, mobile, and tablet traffic week over week"
              />
            </ChartCard>
            <ChartCard
              title="Device snapshot"
              empty={deviceRadar.length === 0}
              subtitle="Total share for the selected range"
            >
              <AnalyticsRadarChart data={deviceRadar} />
            </ChartCard>
          </div>

          <ChartCard
            title="Countries"
            empty={countryRadar.length === 0}
            subtitle="Geographic spread — first half vs second half of period"
          >
            <AnalyticsMultiRadarChart
              data={countryRadar}
              series={[...PERIOD_SERIES]}
              description="Spot shifts in regional traffic between the two halves of your date range"
            />
          </ChartCard>
        </>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Lead funnel</CardTitle>
        </CardHeader>
        <CardContent>
          {funnelRows.length === 0 || funnelRows.every((r) => r.count === 0) ? (
            <AdminEmpty
              icon={BarChart3}
              title="No leads in this period"
              description="New form submissions will show up here. Try a longer date range or check the Leads inbox."
              action={
                <Link href="/admin/leads" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
                  View leads
                </Link>
              }
            />
          ) : (
            <div className="grid gap-6 xl:grid-cols-3 xl:items-start">
              <div className="xl:col-span-2">
                <AnalyticsMultiRadarChart
                  data={funnelRadar}
                  series={[...PERIOD_SERIES]}
                  description="Pipeline momentum — compare lead statuses across the first and second half of the period"
                />
              </div>
              <div className="space-y-4">
                <AnalyticsRadarChart
                  data={funnelTotals}
                  description="Total counts by status"
                />
                <BreakdownList
                  items={funnelRows.map((r) => ({
                    label: formatLeadStatus(r.status),
                    value: r.count,
                  }))}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  empty,
  children,
}: {
  title: string;
  subtitle?: string;
  empty: boolean;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="space-y-0.5">
        <CardTitle className="text-[14px]">{title}</CardTitle>
        {subtitle ? <p className="text-[11px] text-admin-fg-subtle">{subtitle}</p> : null}
      </CardHeader>
      <CardContent className="min-h-[12rem]">
        {empty ? <p className="py-8 text-center text-[12px] text-admin-fg-subtle">No data yet</p> : children}
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-admin-border bg-admin-surface p-4 shadow-sm">
      <div className="text-[11px] font-medium uppercase tracking-wider text-admin-fg-subtle">{label}</div>
      <div className="mt-2 font-display text-[28px] font-medium leading-none tabular-nums text-admin-fg">
        {value.toLocaleString()}
      </div>
    </div>
  );
}

/** Combine rows that share the same display label (e.g. multiple localhost referrers → "Local dev"). */
function mergeBreakdownItems(items: { label: string; value: number }[]) {
  const totals = new Map<string, number>();
  for (const item of items) {
    totals.set(item.label, (totals.get(item.label) ?? 0) + item.value);
  }
  return [...totals.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

function toRadarData(items: { label: string; value: number }[]) {
  return items
    .filter((item) => item.value > 0)
    .slice(0, 8)
    .map((item) => ({ subject: item.label, value: item.value }));
}

function formatLeadStatus(status: string) {
  return status.replace(/_/g, " ");
}

function formatDeviceLabel(device: string) {
  if (!device || device === "unknown") {
    return "Unknown";
  }

  return device.charAt(0).toUpperCase() + device.slice(1);
}

function formatCountryLabel(country: string) {
  if (!country || country === "unknown") {
    return "Unknown";
  }

  return country.length > 14 ? `${country.slice(0, 14)}…` : country;
}

function formatReferrerLabel(referrer: string) {
  if (!referrer || referrer === "(direct)") {
    return "Direct";
  }

  if (referrer.startsWith("/")) {
    return referrer;
  }

  try {
    const parsed = new URL(referrer);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "localhost" || host.endsWith(".local")) {
      return "Local dev";
    }
    return host;
  } catch {
    return referrer.length > 28 ? `${referrer.slice(0, 28)}…` : referrer;
  }
}

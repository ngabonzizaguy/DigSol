import Link from "next/link";
import { getAnalyticsSummary, getLeadFunnelCounts, type AnalyticsRange } from "@/lib/admin/analytics";
import { generateAnalyticsInsight } from "@/lib/ai/actions";
import { PageviewsAreaChart } from "@/components/admin/charts/pageviews-area-chart";
import { BreakdownBarChart } from "@/components/admin/charts/breakdown-bar-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";

export const metadata = { title: "Analytics" };
export const dynamic = "force-dynamic";

const RANGES: { label: string; value: AnalyticsRange }[] = [
  { label: "7 days", value: "7d" },
  { label: "30 days", value: "30d" },
  { label: "90 days", value: "90d" },
];

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range: rangeParam } = await searchParams;
  const range: AnalyticsRange =
    rangeParam === "7d" || rangeParam === "90d" ? rangeParam : "30d";

  const [summary, funnel] = await Promise.all([
    getAnalyticsSummary(range),
    getLeadFunnelCounts(range),
  ]);

  const insight = await generateAnalyticsInsight(summary, funnel);
  const funnelRows = Object.entries(funnel).map(([status, count]) => ({ status, count }));

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[20px] font-semibold tracking-tight text-admin-fg">Analytics</h1>
          <p className="text-[13px] text-admin-fg-subtle">Traffic, attribution, and lead pipeline.</p>
        </div>
        <nav className="flex gap-1">
          {RANGES.map((r) => (
            <Link
              key={r.value}
              href={`/admin/analytics?range=${r.value}`}
              className={`rounded-md px-2.5 py-1 text-[12px] ${range === r.value ? "bg-admin-hover text-admin-fg" : "text-admin-fg-muted hover:bg-admin-hover"}`}
            >
              {r.label}
            </Link>
          ))}
        </nav>
      </header>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Pageviews" value={summary.total_views} />
        <Stat label="New leads" value={funnel.new ?? 0} />
        <Stat label="In progress" value={funnel.in_progress ?? 0} />
        <Stat label="Replied" value={funnel.replied ?? 0} />
      </section>

      {insight ? (
        <Card>
          <CardHeader>
            <CardTitle>Insights</CardTitle>
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
        <CardContent>
          <PageviewsAreaChart data={summary.by_day} />
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top pages</CardTitle>
          </CardHeader>
          <CardContent>
            <BreakdownBarChart data={summary.top_pages} labelKey="path" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Referrers</CardTitle>
          </CardHeader>
          <CardContent>
            <BreakdownBarChart
              data={summary.top_referrers.map((r) => ({
                referrer: r.referrer.length > 40 ? `${r.referrer.slice(0, 40)}…` : r.referrer,
                views: r.views,
              }))}
              labelKey="referrer"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <BreakdownBarChart data={summary.devices} labelKey="device_type" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Countries</CardTitle>
          </CardHeader>
          <CardContent>
            <BreakdownBarChart data={summary.countries} labelKey="country" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lead funnel</CardTitle>
        </CardHeader>
        <CardContent>
          {funnelRows.length === 0 ? (
            <p className="text-[13px] text-admin-fg-subtle">No leads in this period.</p>
          ) : (
            <BreakdownBarChart data={funnelRows} labelKey="status" valueKey="count" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-admin-border bg-admin-surface p-4">
      <div className="text-[11px] uppercase tracking-wider text-admin-fg-subtle">{label}</div>
      <div className="mt-2 font-display text-[28px] font-medium leading-none text-admin-fg">{value}</div>
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";

export const metadata = { title: "Analytics" };
export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const now = new Date();
  const since = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [{ count: pageviews30d }, { data: topPages }, { data: leadsByDay }] = await Promise.all([
    supabase.from("page_views").select("id", { count: "exact", head: true }).gte("created_at", since),
    supabase
      .from("page_views")
      .select("path")
      .gte("created_at", since)
      .limit(1000),
    supabase
      .from("leads")
      .select("created_at, status")
      .gte("created_at", since)
      .limit(1000),
  ]);

  const pageCounts = new Map<string, number>();
  for (const p of (topPages ?? []) as { path: string }[]) {
    pageCounts.set(p.path, (pageCounts.get(p.path) ?? 0) + 1);
  }
  const ranked = [...pageCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);

  const funnel = {
    new: 0, contacted: 0, qualified: 0, won: 0, lost: 0,
  } as Record<string, number>;
  for (const l of (leadsByDay ?? []) as { status: string }[]) {
    funnel[l.status] = (funnel[l.status] ?? 0) + 1;
  }

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-[20px] font-semibold tracking-tight text-admin-fg">Analytics</h1>
        <p className="text-[13px] text-admin-fg-subtle">Last 30 days. Lightweight first-party metrics.</p>
      </header>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Pageviews (30d)" value={pageviews30d ?? 0} />
        <Stat label="New leads" value={funnel.new} />
        <Stat label="Won" value={funnel.won} />
        <Stat label="Lost" value={funnel.lost} />
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Top pages</CardTitle></CardHeader>
          <CardContent className="!p-0">
            {ranked.length === 0 ? (
              <div className="px-4 py-8 text-center text-[13px] text-admin-fg-subtle">
                No data yet. Page-view logger will start populating once visitors hit the site.
              </div>
            ) : (
              <ul className="divide-y divide-admin-border-soft">
                {ranked.map(([path, count]) => {
                  const max = ranked[0][1];
                  return (
                    <li key={path} className="flex items-center justify-between gap-3 px-4 py-2.5">
                      <span className="truncate font-mono text-[12px] text-admin-fg">{path}</span>
                      <div className="flex flex-1 items-center justify-end gap-3">
                        <div className="h-1.5 w-32 overflow-hidden rounded-full bg-admin-border-soft">
                          <div className="h-full bg-admin-accent" style={{ width: `${(count / max) * 100}%` }} />
                        </div>
                        <span className="w-12 text-right text-[11px] text-admin-fg-muted">{count}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Lead funnel</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {["new", "contacted", "qualified", "won", "lost"].map((s) => (
                <li key={s} className="flex items-center justify-between gap-3">
                  <span className="text-[12px] capitalize text-admin-fg">{s}</span>
                  <div className="flex flex-1 items-center justify-end gap-3">
                    <div className="h-1.5 w-32 overflow-hidden rounded-full bg-admin-border-soft">
                      <div
                        className="h-full bg-admin-accent"
                        style={{ width: `${((funnel[s] ?? 0) / Math.max(1, Math.max(...Object.values(funnel)))) * 100}%` }}
                      />
                    </div>
                    <span className="w-12 text-right text-[11px] text-admin-fg-muted">{funnel[s] ?? 0}</span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
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

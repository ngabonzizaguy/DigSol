import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/admin/ui/card";

export const metadata = { title: "Activity" };
export const dynamic = "force-dynamic";

export default async function ActivityPage({
  searchParams,
}: {
  searchParams: Promise<{ entity?: string }>;
}) {
  const { entity } = await searchParams;
  const supabase = await createClient();
  let query = supabase
    .from("activity_log")
    .select("id, entity, entity_id, action, diff, created_at, actor_id, profiles:profiles!activity_log_actor_id_fkey(email)")
    .order("created_at", { ascending: false })
    .limit(200);

  if (entity?.trim()) query = query.eq("entity", entity.trim());

  const { data: rows } = await query;

  type Row = {
    id: string;
    entity: string;
    entity_id: string | null;
    action: string;
    diff: Record<string, unknown> | null;
    created_at: string;
    actor_id: string | null;
    profiles: { email: string } | null;
  };
  const items = (rows ?? []) as unknown as Row[];

  const entities = ["leads", "services", "insights", "site_settings", "profiles", "media"];

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-[20px] font-semibold tracking-tight text-admin-fg">Activity</h1>
        <p className="text-[13px] text-admin-fg-subtle">Audit trail of creates, updates, replies, and deletes.</p>
      </header>

      <nav className="flex flex-wrap gap-1">
        <FilterLink href="/admin/activity" active={!entity}>All</FilterLink>
        {entities.map((e) => (
          <FilterLink key={e} href={`/admin/activity?entity=${e}`} active={entity === e}>
            {e}
          </FilterLink>
        ))}
      </nav>

      <Card>
        <CardContent className="!p-0">
          {items.length === 0 ? (
            <div className="px-4 py-8 text-center text-[13px] text-admin-fg-subtle">No activity yet.</div>
          ) : (
            <ul className="divide-y divide-admin-border-soft">
              {items.map((r) => (
                <li key={r.id} className="px-4 py-3 text-[13px]">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] text-admin-fg-subtle">
                      {r.profiles?.email ?? r.actor_id?.slice(0, 8) ?? "system"}
                    </span>
                    <span className="font-medium text-admin-fg">{r.action}</span>
                    <span className="text-admin-fg-subtle">on</span>
                    <span className="text-admin-fg-muted">{r.entity}</span>
                    {r.entity === "leads" && r.entity_id ? (
                      <Link
                        href={`/admin/leads/${r.entity_id}`}
                        className="font-mono text-[11px] text-admin-accent hover:underline"
                      >
                        {r.entity_id.slice(0, 8)}…
                      </Link>
                    ) : r.entity_id ? (
                      <span className="font-mono text-[11px] text-admin-fg-subtle">{r.entity_id.slice(0, 8)}</span>
                    ) : null}
                    <span className="ml-auto text-[11px] text-admin-fg-subtle">
                      {new Date(r.created_at).toLocaleString()}
                    </span>
                  </div>
                  {r.diff && Object.keys(r.diff).length > 0 ? (
                    <pre className="mt-2 max-h-24 overflow-auto rounded border border-admin-border-soft bg-admin-elevated p-2 font-mono text-[10px] text-admin-fg-muted">
                      {JSON.stringify(r.diff, null, 2)}
                    </pre>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function FilterLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`rounded-md px-2.5 py-1 text-[12px] ${active ? "bg-admin-hover text-admin-fg" : "text-admin-fg-muted hover:bg-admin-hover hover:text-admin-fg"}`}
    >
      {children}
    </Link>
  );
}

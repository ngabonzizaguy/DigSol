import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/admin/ui/card";

export const metadata = { title: "Activity" };
export const dynamic = "force-dynamic";

export default async function ActivityPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("activity_log")
    .select("id, entity, entity_id, action, created_at, actor_id, profiles:profiles!activity_log_actor_id_fkey(email)")
    .order("created_at", { ascending: false })
    .limit(200);

  type Row = {
    id: string;
    entity: string;
    entity_id: string | null;
    action: string;
    created_at: string;
    actor_id: string | null;
    profiles: { email: string } | null;
  };
  const items = (rows ?? []) as unknown as Row[];

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-[20px] font-semibold tracking-tight text-admin-fg">Activity</h1>
        <p className="text-[13px] text-admin-fg-subtle">Audit trail of every create, update, publish, and delete.</p>
      </header>

      <Card>
        <CardContent className="!p-0">
          {items.length === 0 ? (
            <div className="px-4 py-8 text-center text-[13px] text-admin-fg-subtle">No activity yet.</div>
          ) : (
            <ul className="divide-y divide-admin-border-soft">
              {items.map((r) => (
                <li key={r.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-4 py-2.5 text-[13px]">
                  <div>
                    <span className="font-mono text-[11px] text-admin-fg-subtle">{r.profiles?.email ?? r.actor_id?.slice(0, 8) ?? "system"}</span>
                    <span className="mx-2 text-admin-fg-subtle">·</span>
                    <span className="font-medium text-admin-fg">{r.action}</span>
                    <span className="mx-2 text-admin-fg-subtle">on</span>
                    <span className="text-admin-fg-muted">{r.entity}</span>
                    {r.entity_id ? <span className="ml-1 font-mono text-[11px] text-admin-fg-subtle">{r.entity_id.slice(0, 8)}</span> : null}
                  </div>
                  <span className="text-[11px] text-admin-fg-subtle">{new Date(r.created_at).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

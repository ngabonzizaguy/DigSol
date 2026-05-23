import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DataTable } from "@/components/admin/ui/data-table";
import { Badge, StatusBadge } from "@/components/admin/ui/badge";
import { EmptyState } from "@/components/admin/ui/empty-state";
import { Card, CardContent } from "@/components/admin/ui/card";
import type { Lead } from "@/lib/supabase/types";

export const metadata = { title: "Leads" };

const TABS: { label: string; status: string | "all" }[] = [
  { label: "All", status: "all" },
  { label: "New", status: "new" },
  { label: "Contacted", status: "contacted" },
  { label: "Qualified", status: "qualified" },
  { label: "Won", status: "won" },
  { label: "Lost", status: "lost" },
];

export default async function LeadsListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const supabase = await createClient();
  const query = supabase.from("leads").select("*").order("created_at", { ascending: false });
  const { data } = status && status !== "all" ? await query.eq("status", status) : await query;
  const leads = (data ?? []) as Lead[];

  const counts: Record<string, number> = {};
  for (const t of TABS) counts[t.status] = 0;
  const allCount = leads.length;

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-[20px] font-semibold tracking-tight text-admin-fg">Leads</h1>
        <p className="text-[13px] text-admin-fg-subtle">Form submissions from contact, consultation booking, and newsletter.</p>
      </header>

      <Card>
        <CardContent className="!p-0">
          <nav className="flex items-center gap-1 border-b border-admin-border-soft px-2 py-1.5">
            {TABS.map((t) => {
              const active = (status ?? "all") === t.status;
              return (
                <Link
                  key={t.status}
                  href={t.status === "all" ? "/admin/leads" : `/admin/leads?status=${t.status}`}
                  className={`rounded-md px-2.5 py-1 text-[12px] ${active ? "bg-admin-hover text-admin-fg" : "text-admin-fg-muted hover:bg-admin-hover hover:text-admin-fg"}`}
                >
                  {t.label}{t.status === "all" ? <span className="ml-1.5 text-admin-fg-subtle">{allCount}</span> : null}
                </Link>
              );
            })}
          </nav>

          {leads.length === 0 ? (
            <EmptyState title="No leads yet" description="Form submissions will appear here." />
          ) : (
            <DataTable<Lead>
              data={leads}
              rowHref={(r) => `/admin/leads/${r.id}`}
              columns={[
                {
                  key: "who",
                  header: "Person",
                  cell: (r) => (
                    <div>
                      <div className="font-medium text-admin-fg">{r.name ?? r.email}</div>
                      <div className="text-[11px] text-admin-fg-subtle">{r.email}{r.company ? ` · ${r.company}` : ""}</div>
                    </div>
                  ),
                },
                { key: "kind", header: "Type", width: "140px", cell: (r) => <Badge>{r.kind}</Badge> },
                { key: "msg", header: "Message", cell: (r) => <span className="text-admin-fg-muted line-clamp-1">{r.message ?? r.intent ?? "—"}</span> },
                { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} />, width: "120px" },
                { key: "when", header: "Received", align: "right", width: "140px", cell: (r) => <span className="text-[11px] text-admin-fg-subtle">{new Date(r.created_at).toLocaleString()}</span> },
              ]}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

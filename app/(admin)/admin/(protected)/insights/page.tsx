import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/admin/ui/button";
import { DataTable } from "@/components/admin/ui/data-table";
import { Badge, StatusBadge } from "@/components/admin/ui/badge";
import { EmptyState } from "@/components/admin/ui/empty-state";
import type { Insight } from "@/lib/supabase/types";

export const metadata = { title: "Insights" };

export default async function InsightsListPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("insights").select("*").order("created_at", { ascending: false });
  const rows = (data ?? []) as Insight[];
  return (
    <div className="space-y-4">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-[20px] font-semibold tracking-tight text-admin-fg">Insights</h1>
          <p className="text-[13px] text-admin-fg-subtle">Articles published to `/insights`.</p>
        </div>
        <Link href="/admin/insights/new">
          <Button variant="primary" size="sm"><Plus className="size-3.5" /> New insight</Button>
        </Link>
      </header>
      <DataTable
        data={rows}
        rowHref={(r) => `/admin/insights/${r.slug}`}
        emptyState={<EmptyState title="No insights yet" />}
        columns={[
          {
            key: "title",
            header: "Title",
            cell: (r) => (
              <div>
                <div className="font-medium text-admin-fg line-clamp-1">{r.title}</div>
                <div className="font-mono text-[11px] text-admin-fg-subtle">{r.slug}</div>
              </div>
            ),
          },
          { key: "category", header: "Category", width: "120px", cell: (r) => <Badge>{r.category}</Badge> },
          { key: "author", header: "Author", cell: (r) => <span className="text-admin-fg-muted">{r.author}</span> },
          { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} />, width: "120px" },
          {
            key: "published",
            header: "Published",
            align: "right",
            width: "120px",
            cell: (r) => <span className="text-[11px] text-admin-fg-subtle">{r.published_at ? new Date(r.published_at).toLocaleDateString() : "—"}</span>,
          },
        ]}
      />
    </div>
  );
}

import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/admin/ui/button";
import { DataTable } from "@/components/admin/ui/data-table";
import { StatusBadge } from "@/components/admin/ui/badge";
import { EmptyState } from "@/components/admin/ui/empty-state";
import type { Industry } from "@/lib/supabase/types";

export const metadata = { title: "Industries" };

export default async function IndustriesListPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("industries").select("*").order("sort_order").order("name");
  const rows = (data ?? []) as Industry[];

  return (
    <div className="space-y-4">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-[20px] font-semibold tracking-tight text-admin-fg">Industries</h1>
          <p className="text-[13px] text-admin-fg-subtle">Industry verticals served by DigSolutions.</p>
        </div>
        <Link href="/admin/industries/new">
          <Button variant="primary" size="sm">
            <Plus className="size-3.5" /> New industry
          </Button>
        </Link>
      </header>

      <DataTable
        data={rows}
        rowHref={(r) => `/admin/industries/${r.slug}`}
        emptyState={<EmptyState title="No industries yet" />}
        columns={[
          {
            key: "name",
            header: "Name",
            cell: (r) => (
              <div>
                <div className="font-medium text-admin-fg">{r.name}</div>
                <div className="font-mono text-[11px] text-admin-fg-subtle">{r.slug}</div>
              </div>
            ),
          },
          { key: "short", header: "Summary", cell: (r) => <span className="text-admin-fg-muted line-clamp-1">{r.short}</span> },
          { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} />, width: "120px" },
          { key: "order", header: "Order", align: "right", width: "80px", cell: (r) => <span className="font-mono text-[11px] text-admin-fg-subtle">{r.sort_order}</span> },
        ]}
      />
    </div>
  );
}

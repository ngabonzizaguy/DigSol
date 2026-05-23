import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/admin/ui/button";
import { DataTable } from "@/components/admin/ui/data-table";
import { Badge, StatusBadge } from "@/components/admin/ui/badge";
import { EmptyState } from "@/components/admin/ui/empty-state";
import type { Guide } from "@/lib/supabase/types";

export const metadata = { title: "Guides" };

export default async function GuidesListPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("guides").select("*").order("sort_order");
  const rows = (data ?? []) as Guide[];
  return (
    <div className="space-y-4">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-[20px] font-semibold tracking-tight text-admin-fg">Guides & playbooks</h1>
          <p className="text-[13px] text-admin-fg-subtle">Downloadable resources.</p>
        </div>
        <Link href="/admin/guides/new"><Button variant="primary" size="sm"><Plus className="size-3.5" /> New guide</Button></Link>
      </header>
      <DataTable
        data={rows}
        rowHref={(r) => `/admin/guides/${r.slug}`}
        emptyState={<EmptyState title="No guides yet" />}
        columns={[
          { key: "title", header: "Title", cell: (r) => <div><div className="font-medium text-admin-fg">{r.title}</div><div className="font-mono text-[11px] text-admin-fg-subtle">{r.slug}</div></div> },
          { key: "format", header: "Format", width: "120px", cell: (r) => <Badge>{r.format}</Badge> },
          { key: "pages", header: "Pages", width: "80px", align: "right", cell: (r) => <span className="font-mono text-[11px]">{r.pages}</span> },
          { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} />, width: "120px" },
        ]}
      />
    </div>
  );
}

import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/admin/ui/button";
import { DataTable } from "@/components/admin/ui/data-table";
import { Badge, StatusBadge } from "@/components/admin/ui/badge";
import { EmptyState } from "@/components/admin/ui/empty-state";
import type { OpenRole } from "@/lib/supabase/types";

export const metadata = { title: "Open roles" };

export default async function CareersListPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("open_roles").select("*").order("created_at", { ascending: false });
  const rows = (data ?? []) as OpenRole[];
  return (
    <div className="space-y-4">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-[20px] font-semibold tracking-tight text-admin-fg">Open roles</h1>
          <p className="text-[13px] text-admin-fg-subtle">Job postings shown on `/about/careers`.</p>
        </div>
        <Link href="/admin/careers/new"><Button variant="primary" size="sm"><Plus className="size-3.5" /> New role</Button></Link>
      </header>
      <DataTable
        data={rows}
        rowHref={(r) => `/admin/careers/${r.slug}`}
        emptyState={<EmptyState title="No open roles" />}
        columns={[
          { key: "title", header: "Title", cell: (r) => <div><div className="font-medium text-admin-fg">{r.title}</div><div className="font-mono text-[11px] text-admin-fg-subtle">{r.slug}</div></div> },
          { key: "team", header: "Team", width: "140px", cell: (r) => <Badge>{r.team}</Badge> },
          { key: "location", header: "Location", cell: (r) => <span className="text-admin-fg-muted">{r.location}</span> },
          { key: "type", header: "Type", width: "120px", cell: (r) => <span className="text-admin-fg-muted">{r.employment_type}</span> },
          { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} />, width: "120px" },
        ]}
      />
    </div>
  );
}

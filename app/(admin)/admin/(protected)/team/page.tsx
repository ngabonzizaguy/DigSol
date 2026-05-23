import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/admin/ui/button";
import { DataTable } from "@/components/admin/ui/data-table";
import { StatusBadge } from "@/components/admin/ui/badge";
import { EmptyState } from "@/components/admin/ui/empty-state";
import type { TeamMember } from "@/lib/supabase/types";

export const metadata = { title: "Team" };

export default async function TeamListPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("team_members").select("*").order("sort_order");
  const rows = (data ?? []) as TeamMember[];
  return (
    <div className="space-y-4">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-[20px] font-semibold tracking-tight text-admin-fg">Team</h1>
          <p className="text-[13px] text-admin-fg-subtle">Leadership and senior team members.</p>
        </div>
        <Link href="/admin/team/new"><Button variant="primary" size="sm"><Plus className="size-3.5" /> New team member</Button></Link>
      </header>
      <DataTable
        data={rows}
        rowHref={(r) => `/admin/team/${r.id}`}
        emptyState={<EmptyState title="No team members yet" />}
        columns={[
          { key: "name", header: "Name", cell: (r) => <div><div className="font-medium text-admin-fg">{r.name}</div><div className="text-[11px] text-admin-fg-subtle">{r.role}</div></div> },
          { key: "bio", header: "Bio", cell: (r) => <span className="text-admin-fg-muted line-clamp-1">{r.bio}</span> },
          { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} />, width: "120px" },
        ]}
      />
    </div>
  );
}

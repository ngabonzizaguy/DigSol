import Link from "next/link";
import { Plus, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/admin/ui/button";
import { DataTable } from "@/components/admin/ui/data-table";
import { Badge, StatusBadge } from "@/components/admin/ui/badge";
import { EmptyState } from "@/components/admin/ui/empty-state";
import type { CaseStudy } from "@/lib/supabase/types";

export const metadata = { title: "Case studies" };

export default async function CaseStudiesListPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("case_studies").select("*").order("sort_order").order("created_at", { ascending: false });
  const rows = (data ?? []) as CaseStudy[];
  return (
    <div className="space-y-4">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-[20px] font-semibold tracking-tight text-admin-fg">Case studies</h1>
          <p className="text-[13px] text-admin-fg-subtle">Client wins shown across `/work`.</p>
        </div>
        <Link href="/admin/work/new">
          <Button variant="primary" size="sm"><Plus className="size-3.5" /> New case study</Button>
        </Link>
      </header>
      <DataTable
        data={rows}
        rowHref={(r) => `/admin/work/${r.slug}`}
        emptyState={<EmptyState title="No case studies yet" />}
        columns={[
          {
            key: "title",
            header: "Title",
            cell: (r) => (
              <div className="flex items-start gap-2">
                {r.featured ? <Star className="mt-0.5 size-3 fill-amber-400 text-amber-400" /> : null}
                <div>
                  <div className="font-medium text-admin-fg">{r.title}</div>
                  <div className="font-mono text-[11px] text-admin-fg-subtle">{r.client} · {r.slug}</div>
                </div>
              </div>
            ),
          },
          { key: "segment", header: "Segment", width: "120px", cell: (r) => <Badge>{r.segment}</Badge> },
          { key: "industry", header: "Industry", cell: (r) => <span className="text-admin-fg-muted">{r.industry}</span> },
          { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} />, width: "120px" },
        ]}
      />
    </div>
  );
}

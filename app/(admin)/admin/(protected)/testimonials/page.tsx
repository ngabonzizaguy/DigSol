import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/admin/ui/button";
import { DataTable } from "@/components/admin/ui/data-table";
import { StatusBadge } from "@/components/admin/ui/badge";
import { EmptyState } from "@/components/admin/ui/empty-state";
import type { Testimonial } from "@/lib/supabase/types";

export const metadata = { title: "Testimonials" };

export default async function TestimonialsListPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("testimonials").select("*").order("sort_order");
  const rows = (data ?? []) as Testimonial[];
  return (
    <div className="space-y-4">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-[20px] font-semibold tracking-tight text-admin-fg">Testimonials</h1>
          <p className="text-[13px] text-admin-fg-subtle">Client quotes shown across the site.</p>
        </div>
        <Link href="/admin/testimonials/new"><Button variant="primary" size="sm"><Plus className="size-3.5" /> New testimonial</Button></Link>
      </header>
      <DataTable
        data={rows}
        rowHref={(r) => `/admin/testimonials/${r.id}`}
        emptyState={<EmptyState title="No testimonials yet" />}
        columns={[
          { key: "quote", header: "Quote", cell: (r) => <span className="text-admin-fg-muted line-clamp-2">{r.quote}</span> },
          { key: "name", header: "Person", width: "200px", cell: (r) => <div><div className="font-medium text-admin-fg">{r.name}</div><div className="text-[11px] text-admin-fg-subtle">{r.role}, {r.company}</div></div> },
          { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} />, width: "120px" },
        ]}
      />
    </div>
  );
}

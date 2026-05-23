import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/admin/ui/button";
import { DataTable } from "@/components/admin/ui/data-table";
import { StatusBadge } from "@/components/admin/ui/badge";
import { EmptyState } from "@/components/admin/ui/empty-state";
import type { Service } from "@/lib/supabase/types";

export const metadata = { title: "Services" };

export default async function ServicesListPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("services")
    .select("id, slug, title, short, status, sort_order, updated_at")
    .order("sort_order")
    .order("title");

  const services = (data ?? []) as Pick<Service, "id" | "slug" | "title" | "short" | "status" | "sort_order" | "updated_at">[];

  return (
    <div className="space-y-4">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-[20px] font-semibold tracking-tight text-admin-fg">Services</h1>
          <p className="text-[13px] text-admin-fg-subtle">Service pillars shown on the marketing site.</p>
        </div>
        <Link href="/admin/services/new">
          <Button variant="primary" size="sm">
            <Plus className="size-3.5" />
            New service
          </Button>
        </Link>
      </header>

      <DataTable
        data={services}
        rowHref={(r) => `/admin/services/${r.slug}`}
        emptyState={
          <EmptyState
            title="No services yet"
            description="Create your first service pillar to populate the marketing site."
            action={
              <Link href="/admin/services/new">
                <Button variant="primary" size="sm">
                  <Plus className="size-3.5" /> New service
                </Button>
              </Link>
            }
          />
        }
        columns={[
          {
            key: "title",
            header: "Title",
            cell: (r) => (
              <div>
                <div className="font-medium text-admin-fg">{r.title}</div>
                <div className="font-mono text-[11px] text-admin-fg-subtle">{r.slug}</div>
              </div>
            ),
          },
          { key: "short", header: "Summary", cell: (r) => <span className="text-admin-fg-muted line-clamp-1">{r.short}</span> },
          { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} />, width: "120px" },
          {
            key: "order",
            header: "Order",
            align: "right",
            width: "80px",
            cell: (r) => <span className="font-mono text-[11px] text-admin-fg-subtle">{r.sort_order}</span>,
          },
          {
            key: "updated",
            header: "Updated",
            align: "right",
            width: "120px",
            cell: (r) => <span className="text-[11px] text-admin-fg-subtle">{new Date(r.updated_at).toLocaleDateString()}</span>,
          },
        ]}
      />
    </div>
  );
}

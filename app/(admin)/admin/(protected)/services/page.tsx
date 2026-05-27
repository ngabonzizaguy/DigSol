import { createClient } from "@/lib/supabase/server";
import { ContentList } from "@/components/admin/content/content-list";
import { ContentListPageHeader } from "@/components/admin/content/content-list-page-header";
import { mapServices, STATUS_FILTER } from "@/lib/admin/content-list-mappers";
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
    <div className="space-y-5">
      <ContentListPageHeader
        title="Services"
        description="Service pillars shown on the marketing site."
        newHref="/admin/services/new"
        newLabel="New service"
      />
      <ContentList
        items={mapServices(services)}
        filters={[STATUS_FILTER]}
        projectColumnLabel="Service"
        detailColumnLabel="Summary"
        showSegmentColumn={false}
        emptyTitle="No services yet"
        emptyDescription="Create your first service pillar to populate the marketing site."
      />
    </div>
  );
}

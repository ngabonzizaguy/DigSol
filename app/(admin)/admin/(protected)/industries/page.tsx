import { createClient } from "@/lib/supabase/server";
import { ContentList } from "@/components/admin/content/content-list";
import { ContentListPageHeader } from "@/components/admin/content/content-list-page-header";
import { mapIndustries, STATUS_FILTER } from "@/lib/admin/content-list-mappers";
import type { Industry } from "@/lib/supabase/types";

export const metadata = { title: "Industries" };

export default async function IndustriesListPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("industries").select("*").order("sort_order").order("name");
  const rows = (data ?? []) as Industry[];

  return (
    <div className="space-y-5">
      <ContentListPageHeader
        title="Industries"
        description="Industry verticals served by DigSolutions."
        newHref="/admin/industries/new"
        newLabel="New industry"
      />
      <ContentList
        items={mapIndustries(rows)}
        filters={[STATUS_FILTER]}
        projectColumnLabel="Industry"
        detailColumnLabel="Summary"
        showSegmentColumn={false}
        emptyTitle="No industries yet"
      />
    </div>
  );
}

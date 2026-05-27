import { createClient } from "@/lib/supabase/server";
import { ContentList } from "@/components/admin/content/content-list";
import { ContentListPageHeader } from "@/components/admin/content/content-list-page-header";
import { mapInsights, STATUS_FILTER } from "@/lib/admin/content-list-mappers";
import type { Insight } from "@/lib/supabase/types";

export const metadata = { title: "Insights" };

export default async function InsightsListPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("insights").select("*").order("created_at", { ascending: false });
  const rows = (data ?? []) as Insight[];

  return (
    <div className="space-y-5">
      <ContentListPageHeader
        title="Insights"
        description="Articles published to `/insights`."
        newHref="/admin/insights/new"
        newLabel="New insight"
      />
      <ContentList
        items={mapInsights(rows)}
        filters={[STATUS_FILTER, { id: "category", allLabel: "All categories" }]}
        projectColumnLabel="Article"
        badgeColumnLabel="Category"
        detailColumnLabel="Author"
        emptyTitle="No insights yet"
      />
    </div>
  );
}

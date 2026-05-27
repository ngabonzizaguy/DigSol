import { createClient } from "@/lib/supabase/server";
import { ContentList } from "@/components/admin/content/content-list";
import { ContentListPageHeader } from "@/components/admin/content/content-list-page-header";
import { mapGuides, STATUS_FILTER } from "@/lib/admin/content-list-mappers";
import type { Guide } from "@/lib/supabase/types";

export const metadata = { title: "Guides" };

export default async function GuidesListPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("guides").select("*").order("sort_order");
  const rows = (data ?? []) as Guide[];

  return (
    <div className="space-y-5">
      <ContentListPageHeader
        title="Guides & playbooks"
        description="Downloadable resources."
        newHref="/admin/guides/new"
        newLabel="New guide"
      />
      <ContentList
        items={mapGuides(rows)}
        filters={[STATUS_FILTER, { id: "format", allLabel: "All formats" }]}
        projectColumnLabel="Guide"
        badgeColumnLabel="Format"
        detailColumnLabel="Pages"
        emptyTitle="No guides yet"
      />
    </div>
  );
}

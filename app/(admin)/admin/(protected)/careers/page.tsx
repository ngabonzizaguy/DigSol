import { createClient } from "@/lib/supabase/server";
import { ContentList } from "@/components/admin/content/content-list";
import { ContentListPageHeader } from "@/components/admin/content/content-list-page-header";
import { mapOpenRoles, STATUS_FILTER } from "@/lib/admin/content-list-mappers";
import type { OpenRole } from "@/lib/supabase/types";

export const metadata = { title: "Open roles" };

export default async function CareersListPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("open_roles").select("*").order("created_at", { ascending: false });
  const rows = (data ?? []) as OpenRole[];

  return (
    <div className="space-y-5">
      <ContentListPageHeader
        title="Open roles"
        description="Job postings shown on `/about/careers`."
        newHref="/admin/careers/new"
        newLabel="New role"
      />
      <ContentList
        items={mapOpenRoles(rows)}
        filters={[STATUS_FILTER, { id: "team", allLabel: "All teams" }]}
        projectColumnLabel="Role"
        badgeColumnLabel="Team"
        detailColumnLabel="Location"
        emptyTitle="No open roles"
      />
    </div>
  );
}

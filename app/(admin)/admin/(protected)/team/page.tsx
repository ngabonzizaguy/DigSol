import { createClient } from "@/lib/supabase/server";
import { ContentList } from "@/components/admin/content/content-list";
import { ContentListPageHeader } from "@/components/admin/content/content-list-page-header";
import { mapTeamMembers, STATUS_FILTER } from "@/lib/admin/content-list-mappers";
import type { TeamMember } from "@/lib/supabase/types";

export const metadata = { title: "Team" };

export default async function TeamListPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("team_members").select("*").order("sort_order");
  const rows = (data ?? []) as TeamMember[];

  return (
    <div className="space-y-5">
      <ContentListPageHeader
        title="Team"
        description="Leadership and senior team members."
        newHref="/admin/team/new"
        newLabel="New team member"
      />
      <ContentList
        items={mapTeamMembers(rows)}
        filters={[STATUS_FILTER]}
        projectColumnLabel="Member"
        detailColumnLabel="Bio"
        showSegmentColumn={false}
        emptyTitle="No team members yet"
      />
    </div>
  );
}

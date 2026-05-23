import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SimpleEditor } from "@/components/admin/editors/simple-editor";
import { upsertTeamMember, deleteTeamMember, publishTeamMember, unpublishTeamMember } from "../actions";
import type { TeamMember } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("team_members").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const row = data as TeamMember;
  return (
    <SimpleEditor
      entity="Team"
      title={row.name}
      backHref="/admin/team"
      action={upsertTeamMember}
      deleteAction={async () => { "use server"; await deleteTeamMember(row.id); }}
      publishAction={async () => { "use server"; await publishTeamMember(row.id); }}
      unpublishAction={async () => { "use server"; await unpublishTeamMember(row.id); }}
      status={row.status}
      initial={row as unknown as Record<string, unknown>}
      fields={[
        { name: "name", label: "Name", type: "text", required: true },
        { name: "role", label: "Role", type: "text", required: true },
        { name: "bio", label: "Bio", type: "textarea", required: true, rows: 3 },
        { name: "avatar_url", label: "Avatar URL", type: "url" },
        { name: "status", label: "Status", type: "select", options: [{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }, { value: "archived", label: "Archived" }] },
        { name: "sort_order", label: "Sort order", type: "number" },
      ]}
    />
  );
}

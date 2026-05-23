import { SimpleEditor } from "@/components/admin/editors/simple-editor";
import { upsertTeamMember } from "../actions";

export const metadata = { title: "New team member" };

export default function NewTeamMemberPage() {
  return (
    <SimpleEditor
      entity="Team"
      title="New team member"
      backHref="/admin/team"
      action={upsertTeamMember}
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

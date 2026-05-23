import { SimpleEditor } from "@/components/admin/editors/simple-editor";
import { upsertRole } from "../actions";

export const metadata = { title: "New role" };

export default function NewRolePage() {
  return (
    <SimpleEditor
      entity="Open roles"
      title="New role"
      backHref="/admin/careers"
      action={upsertRole}
      fields={[
        { name: "title", label: "Role title", type: "text", required: true },
        { name: "slug", label: "Slug", type: "text", required: true, auto: "slug-of-title" },
        { name: "team", label: "Team", type: "text", required: true },
        { name: "location", label: "Location", type: "text", required: true },
        { name: "employment_type", label: "Employment type", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea", rows: 6 },
        { name: "status", label: "Status", type: "select", options: [{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }, { value: "archived", label: "Archived" }] },
      ]}
    />
  );
}

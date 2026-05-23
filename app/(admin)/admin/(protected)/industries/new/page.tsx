import { SimpleEditor } from "@/components/admin/editors/simple-editor";
import { upsertIndustry } from "../actions";

export const metadata = { title: "New industry" };

export default function NewIndustryPage() {
  return (
    <SimpleEditor
      entity="Industries"
      title="New industry"
      backHref="/admin/industries"
      action={upsertIndustry}
      fields={[
        { name: "name", label: "Name", type: "text", required: true },
        { name: "slug", label: "Slug", type: "text", required: true, hint: "URL path under /industries/", auto: "slug-of-name" },
        { name: "short", label: "Short summary", type: "text", required: true, maxLength: 240 },
        { name: "challenges", label: "Common challenges", type: "list", rows: 5, hint: "One per line" },
        { name: "solutions", label: "Our solutions", type: "list", rows: 5, hint: "One per line" },
        { name: "status", label: "Status", type: "select", options: [{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }, { value: "archived", label: "Archived" }] },
        { name: "sort_order", label: "Sort order", type: "number" },
      ]}
    />
  );
}

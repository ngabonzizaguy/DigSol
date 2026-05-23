import { SimpleEditor } from "@/components/admin/editors/simple-editor";
import { upsertInsight } from "../actions";

export const metadata = { title: "New insight" };

export default function NewInsightPage() {
  return (
    <SimpleEditor
      entity="Insights"
      title="New insight"
      backHref="/admin/insights"
      action={upsertInsight}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "slug", label: "Slug", type: "text", required: true, auto: "slug-of-title" },
        { name: "excerpt", label: "Excerpt", type: "textarea", required: true, rows: 2 },
        { name: "body", label: "Body paragraphs", type: "list", rows: 10, hint: "One paragraph per line" },
        { name: "author", label: "Author", type: "text", required: true },
        { name: "author_role", label: "Author role", type: "text", required: true },
        { name: "category", label: "Category", type: "text", required: true },
        { name: "read_time", label: "Read time", type: "text", required: true, hint: "e.g. 6 min read" },
        { name: "cover_url", label: "Cover URL", type: "url" },
        { name: "status", label: "Status", type: "select", options: [{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }, { value: "archived", label: "Archived" }] },
        { name: "published_at", label: "Publish date (ISO)", type: "text", hint: "Leave blank for now" },
      ]}
    />
  );
}

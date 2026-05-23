import { SimpleEditor } from "@/components/admin/editors/simple-editor";
import { upsertGuide } from "../actions";

export const metadata = { title: "New guide" };

export default function NewGuidePage() {
  return (
    <SimpleEditor
      entity="Guides"
      title="New guide"
      backHref="/admin/guides"
      action={upsertGuide}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "slug", label: "Slug", type: "text", required: true, auto: "slug-of-title" },
        { name: "excerpt", label: "Excerpt", type: "textarea", required: true, rows: 2 },
        { name: "format", label: "Format", type: "text", required: true, hint: "e.g. PDF, Checklist, Worksheet" },
        { name: "pages", label: "Pages", type: "number" },
        { name: "file_url", label: "File URL", type: "url", hint: "Storage path or external URL" },
        { name: "status", label: "Status", type: "select", options: [{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }, { value: "archived", label: "Archived" }] },
        { name: "sort_order", label: "Sort order", type: "number" },
      ]}
    />
  );
}

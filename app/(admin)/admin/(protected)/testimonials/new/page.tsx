import { SimpleEditor } from "@/components/admin/editors/simple-editor";
import { upsertTestimonial } from "../actions";

export const metadata = { title: "New testimonial" };

export default function NewTestimonialPage() {
  return (
    <SimpleEditor
      entity="Testimonials"
      title="New testimonial"
      backHref="/admin/testimonials"
      action={upsertTestimonial}
      fields={[
        { name: "quote", label: "Quote", type: "textarea", required: true, rows: 3 },
        { name: "name", label: "Name", type: "text", required: true },
        { name: "role", label: "Role", type: "text", required: true },
        { name: "company", label: "Company", type: "text", required: true },
        { name: "status", label: "Status", type: "select", options: [{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }, { value: "archived", label: "Archived" }] },
        { name: "sort_order", label: "Sort order", type: "number" },
      ]}
    />
  );
}

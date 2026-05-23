import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SimpleEditor } from "@/components/admin/editors/simple-editor";
import { upsertTestimonial, deleteTestimonial, publishTestimonial, unpublishTestimonial } from "../actions";
import type { Testimonial } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("testimonials").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const row = data as Testimonial;
  return (
    <SimpleEditor
      entity="Testimonials"
      title={row.name}
      backHref="/admin/testimonials"
      action={upsertTestimonial}
      deleteAction={async () => { "use server"; await deleteTestimonial(row.id); }}
      publishAction={async () => { "use server"; await publishTestimonial(row.id); }}
      unpublishAction={async () => { "use server"; await unpublishTestimonial(row.id); }}
      status={row.status}
      initial={row as unknown as Record<string, unknown>}
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

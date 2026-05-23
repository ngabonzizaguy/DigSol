import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SimpleEditor } from "@/components/admin/editors/simple-editor";
import { upsertGuide, deleteGuide, publishGuide, unpublishGuide } from "../actions";
import type { Guide } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function EditGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("guides").select("*").eq("slug", slug).maybeSingle();
  if (!data) notFound();
  const row = data as Guide;
  return (
    <SimpleEditor
      entity="Guides"
      title={row.title}
      backHref="/admin/guides"
      action={upsertGuide}
      deleteAction={async () => { "use server"; await deleteGuide(row.id); }}
      publishAction={async () => { "use server"; await publishGuide(row.id); }}
      unpublishAction={async () => { "use server"; await unpublishGuide(row.id); }}
      status={row.status}
      initial={row as unknown as Record<string, unknown>}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "slug", label: "Slug", type: "text", required: true },
        { name: "excerpt", label: "Excerpt", type: "textarea", required: true, rows: 2 },
        { name: "format", label: "Format", type: "text", required: true },
        { name: "pages", label: "Pages", type: "number" },
        { name: "file_url", label: "File URL", type: "url" },
        { name: "status", label: "Status", type: "select", options: [{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }, { value: "archived", label: "Archived" }] },
        { name: "sort_order", label: "Sort order", type: "number" },
      ]}
    />
  );
}

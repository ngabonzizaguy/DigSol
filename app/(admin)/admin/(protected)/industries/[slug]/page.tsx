import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SimpleEditor } from "@/components/admin/editors/simple-editor";
import { upsertIndustry, deleteIndustry, publishIndustry, unpublishIndustry } from "../actions";
import type { Industry } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function EditIndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("industries").select("*").eq("slug", slug).maybeSingle();
  if (!data) notFound();
  const row = data as Industry;
  return (
    <SimpleEditor
      entity="Industries"
      title={row.name}
      backHref="/admin/industries"
      action={upsertIndustry}
      deleteAction={async () => { "use server"; await deleteIndustry(row.id); }}
      publishAction={async () => { "use server"; await publishIndustry(row.id); }}
      unpublishAction={async () => { "use server"; await unpublishIndustry(row.id); }}
      status={row.status}
      initial={row as unknown as Record<string, unknown>}
      fields={[
        { name: "name", label: "Name", type: "text", required: true },
        { name: "slug", label: "Slug", type: "text", required: true },
        { name: "short", label: "Short summary", type: "text", required: true },
        { name: "challenges", label: "Common challenges", type: "list", rows: 5 },
        { name: "solutions", label: "Our solutions", type: "list", rows: 5 },
        { name: "status", label: "Status", type: "select", options: [{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }, { value: "archived", label: "Archived" }] },
        { name: "sort_order", label: "Sort order", type: "number" },
      ]}
    />
  );
}

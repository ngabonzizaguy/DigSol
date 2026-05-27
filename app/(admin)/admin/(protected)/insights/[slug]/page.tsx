import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SimpleEditor } from "@/components/admin/editors/simple-editor";
import { upsertInsight, deleteInsight, publishInsight, unpublishInsight } from "../actions";
import type { Insight } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function EditInsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("insights").select("*").eq("slug", slug).maybeSingle();
  if (!data) notFound();
  const row = data as Insight;
  return (
    <SimpleEditor
      entity="Insights"
      title={row.title}
      backHref="/admin/insights"
      action={upsertInsight}
      deleteAction={async () => { "use server"; await deleteInsight(row.id); }}
      publishAction={async () => { "use server"; await publishInsight(row.id); }}
      unpublishAction={async () => { "use server"; await unpublishInsight(row.id); }}
      status={row.status}
      initial={row as unknown as Record<string, unknown>}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "slug", label: "Slug", type: "text", required: true },
        { name: "excerpt", label: "Excerpt", type: "textarea", required: true, rows: 2 },
        { name: "body", label: "Body paragraphs", type: "list", rows: 10 },
        { name: "author", label: "Author", type: "text", required: true },
        { name: "author_role", label: "Author role", type: "text", required: true },
        { name: "category", label: "Category", type: "text", required: true },
        { name: "read_time", label: "Read time", type: "text", required: true },
        { name: "cover_url", label: "Cover image", type: "cover_image", hint: "Shown at the top of the article on the public site." },
        { name: "status", label: "Status", type: "select", options: [{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }, { value: "archived", label: "Archived" }] },
        { name: "published_at", label: "Publish date", type: "text" },
      ]}
    />
  );
}

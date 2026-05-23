import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SimpleEditor } from "@/components/admin/editors/simple-editor";
import { upsertRole, deleteRole, publishRole, unpublishRole } from "../actions";
import type { OpenRole } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function EditRolePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("open_roles").select("*").eq("slug", slug).maybeSingle();
  if (!data) notFound();
  const row = data as OpenRole;
  return (
    <SimpleEditor
      entity="Open roles"
      title={row.title}
      backHref="/admin/careers"
      action={upsertRole}
      deleteAction={async () => { "use server"; await deleteRole(row.id); }}
      publishAction={async () => { "use server"; await publishRole(row.id); }}
      unpublishAction={async () => { "use server"; await unpublishRole(row.id); }}
      status={row.status}
      initial={row as unknown as Record<string, unknown>}
      fields={[
        { name: "title", label: "Role title", type: "text", required: true },
        { name: "slug", label: "Slug", type: "text", required: true },
        { name: "team", label: "Team", type: "text", required: true },
        { name: "location", label: "Location", type: "text", required: true },
        { name: "employment_type", label: "Employment type", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea", rows: 6 },
        { name: "status", label: "Status", type: "select", options: [{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }, { value: "archived", label: "Archived" }] },
      ]}
    />
  );
}

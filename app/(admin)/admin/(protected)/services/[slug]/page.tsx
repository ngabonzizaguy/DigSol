import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ServiceEditor } from "@/components/admin/editors/service-editor";
import type { Service } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function EditServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("services").select("*").eq("slug", slug).maybeSingle();
  if (!data) notFound();
  return <ServiceEditor mode="edit" initial={data as Service} />;
}

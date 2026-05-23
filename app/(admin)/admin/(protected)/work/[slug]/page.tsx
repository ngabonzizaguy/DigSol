import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CaseStudyEditor } from "@/components/admin/editors/case-study-editor";
import type { CaseStudy } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function EditCaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("case_studies").select("*").eq("slug", slug).maybeSingle();
  if (!data) notFound();
  return <CaseStudyEditor initial={data as CaseStudy} />;
}

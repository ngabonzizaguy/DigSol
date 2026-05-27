"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/admin/activity";

const metricSchema = z.object({ label: z.string(), value: z.string() });
const galleryItemSchema = z.object({
  url: z.string().url(),
  mime: z.string().optional(),
  alt: z.string().optional(),
  caption: z.string().optional(),
});

const schema = z.object({
  slug: z.string().min(1),
  client: z.string().min(1),
  title: z.string().min(1),
  segment: z.enum(["smb", "midmarket", "enterprise"]),
  industry: z.string().min(1),
  summary: z.string().min(1),
  challenge: z.string().min(1),
  approach: z.string().min(1),
  outcome: z.string().min(1),
  metrics: z.array(metricSchema).default([]),
  service_slugs: z.array(z.string()).default([]),
  cover_url: z.string().url().nullable().optional(),
  orb: z.enum(["mint", "peach", "lavender", "sky", "rose"]).default("mint"),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  featured: z.boolean().default(false),
  sort_order: z.number().int().default(0),
  project_url: z.string().url().nullable().optional(),
  show_project_url: z.boolean().default(false),
  customer_quote: z.string().nullable().optional(),
  customer_name: z.string().nullable().optional(),
  customer_role: z.string().nullable().optional(),
  media_gallery: z.array(galleryItemSchema).default([]),
});

export type CaseStudyFormResult =
  | { ok: true; redirect?: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function upsertCaseStudy(_prev: CaseStudyFormResult | null, formData: FormData): Promise<CaseStudyFormResult> {
  const supabase = await createClient();
  const id = (formData.get("id") as string) || undefined;

  const metricLabels = formData.getAll("metric_label").map((m) => String(m));
  const metricValues = formData.getAll("metric_value").map((m) => String(m));
  const metrics = metricLabels
    .map((label, i) => ({ label: label.trim(), value: (metricValues[i] ?? "").trim() }))
    .filter((m) => m.label && m.value);

  let mediaGallery: { url: string; mime?: string; alt?: string; caption?: string }[] = [];
  const galleryRaw = formData.get("media_gallery");
  if (typeof galleryRaw === "string" && galleryRaw.trim()) {
    try {
      const parsedGallery = JSON.parse(galleryRaw);
      if (Array.isArray(parsedGallery)) mediaGallery = parsedGallery;
    } catch {
      // Ignore malformed JSON; treat as empty gallery.
    }
  }

  const raw = {
    slug: (formData.get("slug") as string)?.trim(),
    client: (formData.get("client") as string)?.trim(),
    title: (formData.get("title") as string)?.trim(),
    segment: formData.get("segment"),
    industry: (formData.get("industry") as string)?.trim(),
    summary: (formData.get("summary") as string)?.trim(),
    challenge: (formData.get("challenge") as string)?.trim(),
    approach: (formData.get("approach") as string)?.trim(),
    outcome: (formData.get("outcome") as string)?.trim(),
    metrics,
    service_slugs: String(formData.get("service_slugs") ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    cover_url: (formData.get("cover_url") as string) || null,
    orb: formData.get("orb"),
    status: formData.get("status"),
    featured: formData.get("featured") === "on" || formData.get("featured") === "true",
    sort_order: Number(formData.get("sort_order") ?? 0),
    project_url: (formData.get("project_url") as string)?.trim() || null,
    show_project_url:
      formData.get("show_project_url") === "on" || formData.get("show_project_url") === "true",
    customer_quote: (formData.get("customer_quote") as string)?.trim() || null,
    customer_name: (formData.get("customer_name") as string)?.trim() || null,
    customer_role: (formData.get("customer_role") as string)?.trim() || null,
    media_gallery: mediaGallery,
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const { error, data } = id
    ? await supabase.from("case_studies").update(parsed.data).eq("id", id).select("slug").single()
    : await supabase.from("case_studies").insert(parsed.data).select("slug").single();
  if (error) return { ok: false, error: error.message };

  await logActivity({ entity: "case_studies", entity_id: id ?? null, action: id ? "update" : "create", diff: parsed.data });

  const slug = data?.slug ?? parsed.data.slug;
  revalidatePath("/admin/work");
  revalidatePath("/work");
  revalidatePath(`/work/${slug}`);
  revalidatePath("/");
  return { ok: true, redirect: id ? undefined : `/admin/work/${slug}` };
}

export async function deleteCaseStudy(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("case_studies").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await logActivity({ entity: "case_studies", entity_id: id, action: "delete" });
  revalidatePath("/admin/work");
  revalidatePath("/work");
  redirect("/admin/work");
}

export async function setCaseStudyStatus(id: string, status: "draft" | "published" | "archived") {
  const supabase = await createClient();
  const { error, data } = await supabase.from("case_studies").update({ status }).eq("id", id).select("slug").single();
  if (error) throw new Error(error.message);
  await logActivity({ entity: "case_studies", entity_id: id, action: status === "published" ? "publish" : "unpublish" });
  revalidatePath("/admin/work");
  revalidatePath("/work");
  revalidatePath(`/work/${data.slug}`);
}

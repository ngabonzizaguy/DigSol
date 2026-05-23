"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/admin/activity";
import { slugify } from "@/lib/admin/slugify";

const serviceSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).max(80),
  title: z.string().min(1).max(160),
  short: z.string().min(1).max(280),
  long: z.string().min(1).max(4000),
  outcomes: z.array(z.string()).default([]),
  deliverables: z.array(z.string()).default([]),
  capabilities: z.array(z.string()).default([]),
  orb: z.enum(["mint", "peach", "lavender", "sky", "rose"]).default("lavender"),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  sort_order: z.number().int().default(0),
});

export type ServiceFormState =
  | { ok: true; slug: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

function parseList(value: FormDataEntryValue | null): string[] {
  if (typeof value !== "string") return [];
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function upsertService(_prev: ServiceFormState | null, formData: FormData): Promise<ServiceFormState> {
  const supabase = await createClient();
  const id = (formData.get("id") as string) || undefined;
  const raw = {
    id,
    slug: ((formData.get("slug") as string) || slugify((formData.get("title") as string) ?? "")).trim(),
    title: (formData.get("title") as string)?.trim() ?? "",
    short: (formData.get("short") as string)?.trim() ?? "",
    long: (formData.get("long") as string)?.trim() ?? "",
    outcomes: parseList(formData.get("outcomes")),
    deliverables: parseList(formData.get("deliverables")),
    capabilities: parseList(formData.get("capabilities")),
    orb: (formData.get("orb") as string) || "lavender",
    status: (formData.get("status") as string) || "draft",
    sort_order: Number(formData.get("sort_order") ?? 0),
  };

  const parsed = serviceSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const payload = parsed.data;
  const { error, data } = id
    ? await supabase.from("services").update(payload).eq("id", id).select("slug").single()
    : await supabase.from("services").insert(payload).select("slug").single();

  if (error) {
    return { ok: false, error: error.message };
  }

  await logActivity({
    entity: "services",
    entity_id: id ?? null,
    action: id ? "update" : "create",
    diff: payload as unknown as Record<string, unknown>,
  });

  revalidatePath("/admin/services");
  revalidatePath("/solutions");
  revalidatePath(`/solutions/${data?.slug ?? payload.slug}`);
  revalidatePath("/");
  return { ok: true, slug: data?.slug ?? payload.slug };
}

export async function deleteService(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await logActivity({ entity: "services", entity_id: id, action: "delete" });
  revalidatePath("/admin/services");
  revalidatePath("/solutions");
  revalidatePath("/");
  redirect("/admin/services");
}

export async function publishService(id: string) {
  const supabase = await createClient();
  const { error, data } = await supabase
    .from("services")
    .update({ status: "published" })
    .eq("id", id)
    .select("slug")
    .single();
  if (error) throw new Error(error.message);
  await logActivity({ entity: "services", entity_id: id, action: "publish" });
  revalidatePath("/admin/services");
  revalidatePath("/solutions");
  revalidatePath(`/solutions/${data.slug}`);
  revalidatePath("/");
}

export async function unpublishService(id: string) {
  const supabase = await createClient();
  const { error, data } = await supabase
    .from("services")
    .update({ status: "draft" })
    .eq("id", id)
    .select("slug")
    .single();
  if (error) throw new Error(error.message);
  await logActivity({ entity: "services", entity_id: id, action: "unpublish" });
  revalidatePath("/admin/services");
  revalidatePath("/solutions");
  revalidatePath(`/solutions/${data.slug}`);
  revalidatePath("/");
}

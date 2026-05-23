import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/admin/activity";

export type GenericActionResult =
  | { ok: true; redirect?: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export type EntityConfig<TInsert> = {
  table: string;
  schema: z.ZodSchema<TInsert>;
  /** Fields whose value should be split by \n into string[] before insert/update. */
  listFields?: string[];
  /** Boolean form fields (presence of value means true). */
  booleanFields?: string[];
  /** Number form fields. */
  numberFields?: string[];
  /** Slug field name for redirect target. */
  slugField?: string;
  /** Routes to revalidate after mutation. */
  revalidate?: (slug?: string) => string[];
  /** Where to redirect after create (defaults to admin list). */
  listPath: string;
  /** Where to redirect after create for editing. */
  editPath?: (slug: string) => string;
};

export function buildEntityActions<TInsert>(cfg: EntityConfig<TInsert>) {
  async function upsert(_prev: GenericActionResult | null, formData: FormData): Promise<GenericActionResult> {
    const supabase = await createClient();
    const id = (formData.get("id") as string) || undefined;

    const raw: Record<string, unknown> = {};
    for (const [key, value] of formData.entries()) {
      if (key === "id") continue;
      if (cfg.listFields?.includes(key)) {
        raw[key] = String(value)
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
      } else if (cfg.numberFields?.includes(key)) {
        raw[key] = Number(value);
      } else if (cfg.booleanFields?.includes(key)) {
        raw[key] = value === "true" || value === "on";
      } else {
        raw[key] = value === "" ? null : value;
      }
    }
    for (const b of cfg.booleanFields ?? []) {
      if (!(b in raw)) raw[b] = false;
    }

    const parsed = cfg.schema.safeParse(raw);
    if (!parsed.success) {
      return { ok: false, error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
    }

    const payload = parsed.data as Record<string, unknown>;
    const { error, data } = id
      ? await supabase.from(cfg.table).update(payload).eq("id", id).select("*").single()
      : await supabase.from(cfg.table).insert(payload).select("*").single();

    if (error) return { ok: false, error: error.message };

    await logActivity({
      entity: cfg.table,
      entity_id: id ?? (data as { id?: string } | null)?.id ?? null,
      action: id ? "update" : "create",
      diff: payload,
    });

    const slug = cfg.slugField ? ((data as Record<string, unknown>)[cfg.slugField] as string | undefined) : undefined;
    for (const p of cfg.revalidate?.(slug) ?? []) revalidatePath(p);
    revalidatePath(cfg.listPath);

    if (!id && cfg.editPath && slug) return { ok: true, redirect: cfg.editPath(slug) };
    return { ok: true };
  }

  async function remove(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from(cfg.table).delete().eq("id", id);
    if (error) throw new Error(error.message);
    await logActivity({ entity: cfg.table, entity_id: id, action: "delete" });
    for (const p of cfg.revalidate?.() ?? []) revalidatePath(p);
    revalidatePath(cfg.listPath);
    redirect(cfg.listPath);
  }

  async function setStatus(id: string, status: "draft" | "published" | "archived") {
    const supabase = await createClient();
    const { error, data } = await supabase.from(cfg.table).update({ status }).eq("id", id).select("*").single();
    if (error) throw new Error(error.message);
    await logActivity({ entity: cfg.table, entity_id: id, action: status === "published" ? "publish" : "unpublish" });
    const slug = cfg.slugField ? ((data as Record<string, unknown>)[cfg.slugField] as string | undefined) : undefined;
    for (const p of cfg.revalidate?.(slug) ?? []) revalidatePath(p);
    revalidatePath(cfg.listPath);
  }

  return { upsert, remove, setStatus };
}

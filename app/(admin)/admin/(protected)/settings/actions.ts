"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/admin/activity";

const settingsSchema = z.object({
  brand: z.object({
    name: z.string().optional(),
    legal: z.string().optional(),
    tagline: z.string().optional(),
    description: z.string().optional(),
  }),
  contact: z.object({ email: z.string().email().optional().or(z.literal("")), phone: z.string().optional() }),
  social: z.object({
    linkedin: z.string().url().optional().or(z.literal("")),
    x: z.string().url().optional().or(z.literal("")),
    instagram: z.string().url().optional().or(z.literal("")),
    youtube: z.string().url().optional().or(z.literal("")),
  }),
  seo_defaults: z.object({ keywords: z.array(z.string()).default([]) }),
  pricing_tiers: z.array(z.object({ name: z.string(), price: z.string(), cadence: z.string(), featured: z.boolean().optional() })).default([]),
});

export type SettingsResult = { ok: true } | { ok: false; error: string };

export async function saveSettings(_prev: SettingsResult | null, formData: FormData): Promise<SettingsResult> {
  const supabase = await createClient();
  const raw = {
    brand: {
      name: (formData.get("brand_name") as string) || undefined,
      legal: (formData.get("brand_legal") as string) || undefined,
      tagline: (formData.get("brand_tagline") as string) || undefined,
      description: (formData.get("brand_description") as string) || undefined,
    },
    contact: {
      email: (formData.get("contact_email") as string) || "",
      phone: (formData.get("contact_phone") as string) || undefined,
    },
    social: {
      linkedin: (formData.get("social_linkedin") as string) || "",
      x: (formData.get("social_x") as string) || "",
      instagram: (formData.get("social_instagram") as string) || "",
      youtube: (formData.get("social_youtube") as string) || "",
    },
    seo_defaults: {
      keywords: String(formData.get("seo_keywords") ?? "").split(",").map((s) => s.trim()).filter(Boolean),
    },
    pricing_tiers: (() => {
      const names = formData.getAll("tier_name").map(String);
      const prices = formData.getAll("tier_price").map(String);
      const cadences = formData.getAll("tier_cadence").map(String);
      const featureds = formData.getAll("tier_featured").map(String);
      return names
        .map((name, i) => ({
          name: name.trim(),
          price: (prices[i] ?? "").trim(),
          cadence: (cadences[i] ?? "").trim(),
          featured: featureds[i] === "true",
        }))
        .filter((t) => t.name && t.price);
    })(),
  };

  const parsed = settingsSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Validation failed" };

  const { error } = await supabase.from("site_settings").update(parsed.data).eq("id", 1);
  if (error) return { ok: false, error: error.message };

  await logActivity({ entity: "site_settings", entity_id: "1", action: "update" });
  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/about");
  return { ok: true };
}

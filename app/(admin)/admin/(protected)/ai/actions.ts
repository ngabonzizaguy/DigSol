"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdminProfile } from "@/lib/admin/auth";
import { logActivity } from "@/lib/admin/activity";
import { getAiSettings } from "@/lib/ai/settings";

const schema = z.object({
  lead_assist_enabled: z.boolean(),
  contact_assist_enabled: z.boolean(),
  analytics_insight_enabled: z.boolean(),
  default_reply_tone: z.enum(["professional", "friendly", "concise"]),
  provider: z.string().trim().min(1).max(64),
  model: z.string().trim().min(1).max(120),
  api_base_url: z.union([z.string().url(), z.literal("")]).optional(),
  api_key: z.string().optional(),
  clear_api_key: z.boolean().optional(),
});

export type AiSettingsResult = { ok: true } | { ok: false; error: string };

export async function saveAiSettings(
  _prev: AiSettingsResult | null,
  formData: FormData
): Promise<AiSettingsResult> {
  const profile = await requireAdminProfile();
  if (profile.role !== "admin") {
    return { ok: false, error: "Only admins can change AI settings." };
  }

  const provider = ((formData.get("provider") as string) ?? "mock").trim().toLowerCase();
  const newKeyRaw = (formData.get("api_key") as string)?.trim() ?? "";
  const clearKey = formData.get("clear_api_key") === "on";
  const baseRaw = (formData.get("api_base_url") as string)?.trim() ?? "";

  const raw = {
    lead_assist_enabled: formData.get("lead_assist_enabled") === "on",
    contact_assist_enabled: formData.get("contact_assist_enabled") === "on",
    analytics_insight_enabled: formData.get("analytics_insight_enabled") === "on",
    default_reply_tone: formData.get("default_reply_tone") ?? "professional",
    provider,
    model: (formData.get("model") as string)?.trim() || "gpt-4o-mini",
    api_base_url: baseRaw || "",
    api_key: newKeyRaw || undefined,
    clear_api_key: clearKey,
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Validation failed" };

  if (
    parsed.data.provider !== "mock" &&
    !parsed.data.clear_api_key &&
    !parsed.data.api_key
  ) {
    const current = await getAiSettings();
    if (!current.api_key?.trim() && !process.env.AI_API_KEY?.trim()) {
      return {
        ok: false,
        error: "Add an API key or choose Mock mode.",
      };
    }
  }

  const needsBase =
    parsed.data.provider !== "mock" && parsed.data.provider !== "openai";
  if (needsBase && !parsed.data.api_base_url) {
    const current = await getAiSettings();
    if (!current.api_base_url?.trim() && !process.env.AI_API_BASE_URL?.trim()) {
      return {
        ok: false,
        error: "This provider needs an API base URL (OpenAI-compatible).",
      };
    }
  }

  const current = await getAiSettings();
  let api_key = current.api_key;
  if (parsed.data.clear_api_key) {
    api_key = null;
  } else if (parsed.data.api_key) {
    api_key = parsed.data.api_key;
  }

  const api_base_url = parsed.data.api_base_url?.trim() ? parsed.data.api_base_url.trim() : null;

  const aiPayload = {
    lead_assist_enabled: parsed.data.lead_assist_enabled,
    contact_assist_enabled: parsed.data.contact_assist_enabled,
    analytics_insight_enabled: parsed.data.analytics_insight_enabled,
    default_reply_tone: parsed.data.default_reply_tone,
    provider: parsed.data.provider,
    model: parsed.data.model,
    api_base_url,
    api_key,
  };

  const supabase = await createClient();
  const { data: row } = await supabase
    .from("site_settings")
    .select("integrations")
    .eq("id", 1)
    .maybeSingle();
  const integrations = (row?.integrations as Record<string, unknown> | undefined) ?? {};
  const next = { ...integrations, ai: aiPayload };

  const { error } = await supabase.from("site_settings").update({ integrations: next }).eq("id", 1);
  if (error) return { ok: false, error: error.message };

  await logActivity({
    entity: "site_settings",
    entity_id: "1",
    action: "update",
    diff: {
      ai: {
        ...aiPayload,
        api_key: api_key ? "[configured]" : null,
      },
    },
  });

  revalidatePath("/admin/ai");
  revalidatePath("/admin/settings");
  revalidatePath("/admin");
  revalidatePath("/contact");
  return { ok: true };
}

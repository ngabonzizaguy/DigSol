"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/admin/activity";
import {
  DEFAULT_QUICK_START_CONFIG,
  QS_CONFIG_KEY,
  quickStartConfigSchema,
  type QuickStartConfig,
} from "@/lib/marketing/quick-start-config";

export type SaveResult = { ok: true } | { ok: false; error: string };

export async function saveQuickStartConfig(input: QuickStartConfig): Promise<SaveResult> {
  const parsed = quickStartConfigSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Validation failed." };
  }
  const supabase = await createClient();

  const { data: current } = await supabase
    .from("site_settings")
    .select("integrations")
    .eq("id", 1)
    .maybeSingle();
  const integrations = (current?.integrations as Record<string, unknown> | null) ?? {};

  const next = { ...integrations, [QS_CONFIG_KEY]: parsed.data };

  const { error } = await supabase.from("site_settings").update({ integrations: next }).eq("id", 1);
  if (error) return { ok: false, error: error.message };

  await logActivity({
    entity: "site_settings",
    entity_id: "1",
    action: "update:quick_start",
    diff: { enabled: parsed.data.enabled },
  });
  revalidatePath("/start");
  revalidatePath("/");
  return { ok: true };
}

export async function resetQuickStartConfig(): Promise<SaveResult> {
  return saveQuickStartConfig(DEFAULT_QUICK_START_CONFIG);
}

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdminProfile } from "@/lib/admin/auth";
import { logActivity } from "@/lib/admin/activity";

const schema = z.object({
  name: z.string().trim().max(120).optional().nullable(),
  avatar_url: z.string().url().nullable().optional(),
});

export type AccountResult = { ok: true } | { ok: false; error: string };

export async function updateOwnProfile(
  _prev: AccountResult | null,
  formData: FormData
): Promise<AccountResult> {
  const profile = await requireAdminProfile();

  const raw = {
    name: ((formData.get("name") as string) ?? "").trim() || null,
    avatar_url: ((formData.get("avatar_url") as string) ?? "").trim() || null,
  };
  const parsed = schema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Validation failed" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      name: parsed.data.name,
      avatar_url: parsed.data.avatar_url,
    })
    .eq("id", profile.id);

  if (error) return { ok: false, error: error.message };

  await logActivity({
    entity: "profiles",
    entity_id: profile.id,
    action: "update",
    diff: parsed.data,
  });

  revalidatePath("/admin/account");
  revalidatePath("/admin");
  return { ok: true };
}

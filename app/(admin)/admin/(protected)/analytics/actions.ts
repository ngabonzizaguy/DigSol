"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";
import { requireAdminProfile } from "@/lib/admin/auth";
import { logActivity } from "@/lib/admin/activity";

export type ResetAnalyticsResult =
  | { ok: true; deleted: number }
  | { ok: false; error: string };

/**
 * Wipes all rows from `page_views`. Admin-only.
 * Requires the operator to type "RESET" into the confirmation input.
 */
export async function resetAnalyticsData(confirm: string): Promise<ResetAnalyticsResult> {
  if (confirm !== "RESET") {
    return { ok: false, error: 'Type "RESET" to confirm.' };
  }
  const profile = await requireAdminProfile();
  if (profile.role !== "admin") {
    return { ok: false, error: "Only admins can reset analytics data." };
  }

  const supabase = await createServiceClient();
  const { count: before } = await supabase
    .from("page_views")
    .select("id", { count: "exact", head: true });

  const { error } = await supabase
    .from("page_views")
    .delete()
    .gte("created_at", "1900-01-01");

  if (error) return { ok: false, error: error.message };

  await logActivity({
    entity: "page_views",
    action: "reset",
    diff: { deleted: before ?? null },
  });

  revalidatePath("/admin/analytics");
  return { ok: true, deleted: before ?? 0 };
}

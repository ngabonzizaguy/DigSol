import { createClient } from "@/lib/supabase/server";

export async function logActivity(params: {
  entity: string;
  entity_id?: string | null;
  action: string;
  diff?: Record<string, unknown> | null;
}) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase.from("activity_log").insert({
      actor_id: user?.id ?? null,
      entity: params.entity,
      entity_id: params.entity_id ?? null,
      action: params.action,
      diff: params.diff ?? null,
    });
  } catch {
    // Activity logging must never break the main action.
  }
}

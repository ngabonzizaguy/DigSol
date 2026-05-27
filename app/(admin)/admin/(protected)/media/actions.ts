"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/admin/activity";
import { getMediaPublicUrl } from "@/lib/admin/media";
import type { MediaItem } from "@/lib/supabase/types";

export type MediaPickerItem = MediaItem & { url: string };

export async function listMediaForPicker(): Promise<MediaPickerItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("media").select("*").order("created_at", { ascending: false }).limit(300);
  if (error) throw new Error(error.message);
  return ((data ?? []) as MediaItem[]).map((m) => ({ ...m, url: getMediaPublicUrl(m.path) }));
}

export async function recordMediaUpload(input: {
  path: string;
  mime: string;
  bytes: number;
  width?: number | null;
  height?: number | null;
  alt?: string | null;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("media")
    .insert({
      path: input.path,
      mime: input.mime,
      bytes: input.bytes,
      width: input.width ?? null,
      height: input.height ?? null,
      alt: input.alt ?? null,
      uploaded_by: user?.id ?? null,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  await logActivity({ entity: "media", entity_id: data.id, action: "upload" });
  revalidatePath("/admin/media");
  return data;
}

export async function updateMediaAlt(id: string, alt: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("media").update({ alt }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/media");
}

export async function deleteMedia(id: string, path: string) {
  const supabase = await createClient();
  await supabase.storage.from("media").remove([path]);
  const { error } = await supabase.from("media").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await logActivity({ entity: "media", entity_id: id, action: "delete" });
  revalidatePath("/admin/media");
}

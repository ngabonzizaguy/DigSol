import { createClient } from "@/lib/supabase/server";
import { MediaLibrary } from "@/components/admin/media/media-library";
import type { MediaItem } from "@/lib/supabase/types";

export const metadata = { title: "Media library" };
export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("media").select("*").order("created_at", { ascending: false });
  const items = (data ?? []) as MediaItem[];
  const publicUrl = (path: string) =>
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${path}`;
  return <MediaLibrary items={items.map((m) => ({ ...m, url: publicUrl(m.path) }))} />;
}

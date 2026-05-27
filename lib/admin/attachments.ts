import "server-only";
import { getServiceSupabase } from "@/lib/supabase/service";

const BUCKET = "quick-start-uploads";
const DEFAULT_TTL = 60 * 60; // 1 hour

/**
 * Generate a short-lived signed URL for a private prospect attachment.
 * When downloadName is set, Supabase sets Content-Disposition for a file download.
 */
export async function getAttachmentSignedUrl(
  storagePath: string,
  options?: { expiresIn?: number; downloadName?: string | null },
): Promise<string | null> {
  try {
    const service = getServiceSupabase();
    const { data, error } = await service.storage.from(BUCKET).createSignedUrl(
      storagePath,
      options?.expiresIn ?? DEFAULT_TTL,
      options?.downloadName ? { download: options.downloadName } : undefined,
    );
    if (error || !data?.signedUrl) return null;
    return data.signedUrl;
  } catch {
    return null;
  }
}

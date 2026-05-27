"use client";

import {
  createQuickStartLead,
  finalizeQuickStartAttachment,
  prepareQuickStartAttachmentUpload,
  type QuickStartInput,
  type QuickStartResult,
} from "@/lib/forms/quick-start-actions";
import type { DroppedFile } from "@/components/ui/file-dropzone";
import type { VoiceClip } from "@/components/ui/voice-recorder";

export type QuickStartAttachmentBundle = {
  files: DroppedFile[];
  voice: VoiceClip | null;
};

async function uploadBlob(input: {
  leadId: string;
  blob: Blob;
  kind: "voice" | "image" | "document";
  originalName: string;
  mime: string;
  durationMs?: number | null;
}): Promise<void> {
  const prep = await prepareQuickStartAttachmentUpload({
    leadId: input.leadId,
    kind: input.kind,
    originalName: input.originalName,
    mime: input.mime,
  });
  if (!prep.ok) throw new Error(prep.error);

  const put = await fetch(prep.signedUrl, {
    method: "PUT",
    body: input.blob,
    headers: { "Content-Type": input.mime || "application/octet-stream" },
  });
  if (!put.ok) {
    throw new Error(`Upload failed (${put.status})`);
  }

  const fin = await finalizeQuickStartAttachment({
    leadId: input.leadId,
    path: prep.path,
    kind: input.kind,
    originalName: input.originalName,
    mime: input.mime,
    sizeBytes: input.blob.size,
    durationMs: input.durationMs ?? null,
  });
  if (!fin.ok) throw new Error(fin.error);
}

/**
 * Create the lead, then upload voice + files directly to Supabase Storage (signed URLs).
 * Server Actions cannot reliably carry binary FormData — this path avoids that limit.
 */
export async function submitQuickStartWithAttachments(
  payload: QuickStartInput,
  attachments: QuickStartAttachmentBundle,
): Promise<QuickStartResult & { attachmentWarnings?: string[] }> {
  const lead = await createQuickStartLead(payload);
  if (!lead.ok) return lead;

  const warnings: string[] = [];

  if (attachments.voice) {
    const ext = attachments.voice.mime.includes("mp4")
      ? "m4a"
      : attachments.voice.mime.includes("ogg")
        ? "ogg"
        : "webm";
    try {
      await uploadBlob({
        leadId: lead.reference,
        blob: attachments.voice.blob,
        kind: "voice",
        originalName: `voice-note.${ext}`,
        mime: attachments.voice.mime || "audio/webm",
        durationMs: attachments.voice.durationMs,
      });
    } catch (e) {
      warnings.push(e instanceof Error ? e.message : "Voice note upload failed.");
    }
  }

  for (const dropped of attachments.files) {
    try {
      await uploadBlob({
        leadId: lead.reference,
        blob: dropped.file,
        kind: dropped.kind,
        originalName: dropped.file.name,
        mime: dropped.file.type || "application/octet-stream",
      });
    } catch (e) {
      warnings.push(
        e instanceof Error ? `${dropped.file.name}: ${e.message}` : `${dropped.file.name}: upload failed.`,
      );
    }
  }

  if (warnings.length > 0) {
    return { ...lead, attachmentWarnings: warnings };
  }
  return lead;
}

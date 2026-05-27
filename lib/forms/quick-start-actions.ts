"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getServiceSupabase } from "@/lib/supabase/service";
import { logActivity } from "@/lib/admin/activity";
import type { LeadAttachmentKind } from "@/lib/supabase/types";

const intent = z.enum(["find_service", "custom_request", "exploring"]);
const channel = z.enum(["email", "whatsapp", "phone"]);
const currency = z.enum(["RWF", "USD"]);

const quickStartSchema = z
  .object({
    intent: intent,
    name: z.string().min(1).max(160),
    email: z.string().email(),
    country_code: z.string().length(2),
    phone_dial_code: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    company: z.string().nullable().optional(),
    role: z.string().nullable().optional(),
    service_slugs: z.array(z.string()).default([]),
    custom_request: z.string().nullable().optional(),
    description: z.string().max(4000).nullable().optional(),
    goals: z.string().max(4000).nullable().optional(),
    timeline: z.string().nullable().optional(),
    links: z.array(z.string().min(3)).default([]),
    budget_currency: currency,
    budget_min: z.number().int().nonnegative().nullable().optional(),
    budget_max: z.number().int().nonnegative().nullable().optional(),
    budget_unsure: z.boolean().default(false),
    preferred_channel: channel,
    preferred_window: z.string().nullable().optional(),
  })
  .refine(
    (v) =>
      v.intent === "exploring" || (v.service_slugs.length > 0 || (v.custom_request && v.custom_request.trim().length > 0)),
    { message: "Pick a service or describe what you need.", path: ["service_slugs"] },
  );

export type QuickStartInput = z.infer<typeof quickStartSchema>;
export type QuickStartResult = { ok: true; reference: string } | { ok: false; error: string };
export type QuickStartUploadPrepResult =
  | { ok: true; path: string; signedUrl: string; token: string }
  | { ok: false; error: string };
export type QuickStartFinalizeResult = { ok: true } | { ok: false; error: string };

const BUCKET = "quick-start-uploads";
const UPLOAD_WINDOW_MS = 2 * 60 * 60 * 1000; // 2 hours to upload after lead creation

function safeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9.\-_]/g, "_").slice(0, 120);
}

function normalizeLinkUrl(link: string): string {
  const trimmed = link.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function voiceExtension(mime: string): string {
  if (mime.includes("mp4") || mime.includes("m4a")) return "m4a";
  if (mime.includes("ogg")) return "ogg";
  if (mime.includes("mpeg") || mime.includes("mp3")) return "mp3";
  return "webm";
}

async function assertLeadAcceptsUploads(leadId: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const service = getServiceSupabase();
  const { data, error } = await service
    .from("leads")
    .select("id, kind, created_at")
    .eq("id", leadId)
    .maybeSingle();
  if (error || !data) return { ok: false, error: "Lead not found." };
  if (data.kind !== "quick_start") return { ok: false, error: "Invalid lead type." };
  const age = Date.now() - new Date(data.created_at as string).getTime();
  if (age > UPLOAD_WINDOW_MS) return { ok: false, error: "Upload window expired for this lead." };
  return { ok: true };
}

async function insertLinkAttachments(leadId: string, links: string[]): Promise<void> {
  const service = getServiceSupabase();
  for (const link of links) {
    const url = normalizeLinkUrl(link);
    const { error } = await service.from("lead_attachments").insert({
      lead_id: leadId,
      kind: "link",
      url,
      original_name: link,
    });
    if (error) console.error("[quick-start] link attachment insert failed:", error.message);
  }
}

/**
 * Step 1 — create the lead (JSON only). Files/voice upload separately via signed URLs.
 */
export async function createQuickStartLead(input: QuickStartInput): Promise<QuickStartResult> {
  const parsed = quickStartSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please review your answers." };
  }
  const v = parsed.data;

  const supabase = await createClient();
  const phoneClean = v.phone ? v.phone.replace(/[^\d]/g, "") : null;

  const messageParts: string[] = [];
  if (v.intent === "find_service") messageParts.push("Looking for a service match.");
  if (v.intent === "custom_request") messageParts.push("Has a specific project in mind.");
  if (v.intent === "exploring") messageParts.push("Just exploring.");
  if (v.custom_request) messageParts.push(v.custom_request);
  if (v.description) messageParts.push(v.description);

  const { data: leadRow, error } = await supabase
    .from("leads")
    .insert({
      kind: "quick_start",
      name: v.name,
      email: v.email,
      company: v.company || null,
      role: v.role || null,
      timeline: v.timeline || null,
      intent: v.intent,
      message: messageParts.join("\n\n").slice(0, 4000) || null,
      phone: phoneClean,
      country_code: v.country_code,
      phone_dial_code: v.phone_dial_code || null,
      budget_min: v.budget_unsure ? null : v.budget_min ?? null,
      budget_max: v.budget_unsure ? null : v.budget_max ?? null,
      budget_currency: v.budget_unsure ? null : v.budget_currency,
      budget_unsure: v.budget_unsure,
      preferred_channel: v.preferred_channel,
      preferred_window: v.preferred_window || null,
      service_slugs: v.service_slugs,
      custom_request: v.custom_request || null,
      payload: {
        source: "quick_start",
        goals: v.goals || null,
        links: v.links,
      },
    })
    .select("id")
    .single();

  if (error || !leadRow) {
    return { ok: false, error: error?.message ?? "Could not save your request." };
  }

  const leadId = leadRow.id as string;

  try {
    await insertLinkAttachments(leadId, v.links);
  } catch (e) {
    console.error("[quick-start] link attachment pipeline failed:", e);
  }

  await logActivity({
    entity: "leads",
    entity_id: leadId,
    action: "create:quick_start",
    diff: { source: "quick_start", intent: v.intent },
  });

  return { ok: true, reference: leadId };
}

/**
 * Step 2 — request a signed upload URL for a voice note or file.
 */
export async function prepareQuickStartAttachmentUpload(input: {
  leadId: string;
  kind: Extract<LeadAttachmentKind, "voice" | "image" | "document">;
  originalName: string;
  mime: string;
}): Promise<QuickStartUploadPrepResult> {
  const gate = await assertLeadAcceptsUploads(input.leadId);
  if (!gate.ok) return gate;

  const service = getServiceSupabase();
  const safeName = safeFilename(input.originalName || "upload");
  const ext =
    input.kind === "voice"
      ? voiceExtension(input.mime)
      : safeName.includes(".")
        ? safeName.split(".").pop()!
        : "bin";
  const filename =
    input.kind === "voice" ? `voice-${Date.now()}.${ext}` : `${Date.now()}-${safeName}`;
  const path = `${input.leadId}/${filename}`;

  const { data, error } = await service.storage.from(BUCKET).createSignedUploadUrl(path);
  if (error || !data?.signedUrl) {
    return { ok: false, error: error?.message ?? "Could not prepare upload." };
  }

  return { ok: true, path: data.path ?? path, signedUrl: data.signedUrl, token: data.token };
}

/**
 * Step 3 — record attachment metadata after the browser PUT to the signed URL succeeds.
 */
export async function finalizeQuickStartAttachment(input: {
  leadId: string;
  path: string;
  kind: Extract<LeadAttachmentKind, "voice" | "image" | "document">;
  originalName: string;
  mime: string;
  sizeBytes: number;
  durationMs?: number | null;
}): Promise<QuickStartFinalizeResult> {
  const gate = await assertLeadAcceptsUploads(input.leadId);
  if (!gate.ok) return gate;

  if (!input.path.startsWith(`${input.leadId}/`)) {
    return { ok: false, error: "Invalid storage path." };
  }

  const service = getServiceSupabase();
  const { error: downloadErr } = await service.storage.from(BUCKET).download(input.path);
  if (downloadErr) {
    return { ok: false, error: "Uploaded file not found in storage." };
  }

  const { error } = await service.from("lead_attachments").insert({
    lead_id: input.leadId,
    kind: input.kind,
    storage_path: input.path,
    mime: input.mime || null,
    size_bytes: input.sizeBytes,
    duration_ms: input.durationMs ?? null,
    original_name: input.originalName,
  });
  if (error) return { ok: false, error: error.message };

  return { ok: true };
}

/** @deprecated Use createQuickStartLead + signed upload flow instead. */
export async function submitQuickStart(formData: FormData): Promise<QuickStartResult> {
  const raw = formData.get("payload");
  if (typeof raw !== "string") return { ok: false, error: "Missing payload." };
  try {
    return createQuickStartLead(JSON.parse(raw) as QuickStartInput);
  } catch {
    return { ok: false, error: "Malformed payload." };
  }
}

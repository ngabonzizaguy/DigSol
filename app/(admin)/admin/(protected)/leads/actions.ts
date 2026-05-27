"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdminProfile } from "@/lib/admin/auth";
import { logActivity } from "@/lib/admin/activity";
import { requirePermission } from "@/lib/admin/permissions";
import { getDefaultFromEmail, getEmailProvider, isEmailMockMode } from "@/lib/email";

const statusSchema = z.enum([
  "new",
  "in_progress",
  "replied",
  "closed",
  "qualified",
  "contacted",
  "won",
  "lost",
]);

const replySchema = z.object({
  subject: z.string().min(1).max(200),
  body: z.string().min(1).max(20000),
});

export async function updateLeadStatus(id: string, status: z.infer<typeof statusSchema>) {
  const parsed = statusSchema.safeParse(status);
  if (!parsed.success) throw new Error("Invalid status");
  const supabase = await createClient();
  const patch: Record<string, unknown> = { status: parsed.data };
  const now = new Date().toISOString();
  if (parsed.data === "replied") patch.replied_at = now;
  if (parsed.data === "closed") patch.closed_at = now;
  if (parsed.data === "in_progress") {
    const { data: row } = await supabase.from("leads").select("first_response_at").eq("id", id).maybeSingle();
    if (!row?.first_response_at) patch.first_response_at = now;
  }
  const { error } = await supabase.from("leads").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
  await logActivity({ entity: "leads", entity_id: id, action: `status:${parsed.data}` });
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
}

export async function updateLeadNotes(id: string, notes: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("leads").update({ notes }).eq("id", id);
  if (error) throw new Error(error.message);
  await logActivity({ entity: "leads", entity_id: id, action: "notes" });
  revalidatePath(`/admin/leads/${id}`);
}

export async function addLeadNote(leadId: string, body: string) {
  const text = body.trim();
  if (!text) throw new Error("Note cannot be empty");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { error } = await supabase.from("lead_messages").insert({
    lead_id: leadId,
    direction: "note",
    channel: "internal",
    body: text,
    subject: null,
    provider: "mock",
  });
  if (error) throw new Error(error.message);
  await logActivity({
    entity: "leads",
    entity_id: leadId,
    action: "note",
    diff: { created_by: user?.id ?? null },
  });
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function sendLeadReply(leadId: string, input: { subject: string; body: string }) {
  const parsed = replySchema.safeParse(input);
  if (!parsed.success) throw new Error("Invalid reply");

  const profile = await requireAdminProfile();
  await requirePermission(profile, "leads", "reply");

  const supabase = await createClient();
  const { data: lead, error: leadErr } = await supabase
    .from("leads")
    .select("id, email, name, status")
    .eq("id", leadId)
    .maybeSingle();
  if (leadErr || !lead) throw new Error("Lead not found");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const from = getDefaultFromEmail();
  const provider = getEmailProvider();
  const result = await provider.send({
    to: lead.email,
    from,
    subject: parsed.data.subject,
    text: parsed.data.body,
    replyTo: from,
  });

  const { error: msgErr } = await supabase.from("lead_messages").insert({
    lead_id: leadId,
    direction: "outbound",
    channel: "email",
    subject: parsed.data.subject,
    body: parsed.data.body,
    to_email: lead.email,
    from_email: from,
    provider: result.provider,
    provider_id: result.id,
    created_by: user?.id ?? null,
  });
  if (msgErr) throw new Error(msgErr.message);

  const now = new Date().toISOString();
  const leadPatch: Record<string, string> = {
    status: "replied",
    replied_at: now,
  };
  const { data: fresh } = await supabase
    .from("leads")
    .select("first_response_at")
    .eq("id", leadId)
    .maybeSingle();
  if (!fresh?.first_response_at) leadPatch.first_response_at = now;
  await supabase.from("leads").update(leadPatch).eq("id", leadId);

  await logActivity({
    entity: "leads",
    entity_id: leadId,
    action: "reply:sent",
    diff: { provider: result.provider, mock: isEmailMockMode() },
  });

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function deleteLead(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await logActivity({ entity: "leads", entity_id: id, action: "delete" });
  revalidatePath("/admin/leads");
}

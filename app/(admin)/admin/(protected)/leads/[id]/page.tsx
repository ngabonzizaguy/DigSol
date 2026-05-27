import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isEmailMockMode } from "@/lib/email";
import { getAttachmentSignedUrl } from "@/lib/admin/attachments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { StatusBadge, Badge } from "@/components/admin/ui/badge";
import { LeadDetailControls } from "@/components/admin/leads/lead-detail-controls";
import { LeadReplyComposer } from "@/components/admin/leads/lead-reply-composer";
import { LeadAiAssist } from "@/components/admin/leads/lead-ai-assist";
import { LeadThread } from "@/components/admin/leads/lead-thread";
import { LeadPipelineBar } from "@/components/admin/leads/lead-pipeline-bar";
import { LeadAttachmentsPanel } from "@/components/admin/leads/lead-attachments-panel";
import { findCountry, flagEmoji } from "@/lib/marketing/countries";
import type { Lead, LeadAttachment } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("leads").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const lead = data as Lead;

  const { data: messages } = await supabase
    .from("lead_messages")
    .select("id, direction, channel, subject, body, to_email, from_email, provider, created_at")
    .eq("lead_id", lead.id)
    .order("created_at", { ascending: true });

  const { data: history } = await supabase
    .from("activity_log")
    .select("id, action, created_at, diff")
    .eq("entity", "leads")
    .eq("entity_id", lead.id)
    .order("created_at", { ascending: false })
    .limit(20);

  const { data: attachmentsRaw } = await supabase
    .from("lead_attachments")
    .select("*")
    .eq("lead_id", lead.id)
    .order("created_at", { ascending: true });
  const attachments = (attachmentsRaw ?? []) as LeadAttachment[];
  const attachmentsWithUrls = await Promise.all(
    attachments.map(async (a) => ({
      ...a,
      signedUrl: a.storage_path
        ? await getAttachmentSignedUrl(a.storage_path, {
            downloadName: a.original_name ?? undefined,
          })
        : a.url,
    })),
  );

  const isQuickStart = lead.kind === "quick_start";
  const country = findCountry(lead.country_code);
  const phoneDisplay = lead.phone
    ? `${lead.phone_dial_code ?? ""} ${lead.phone}`.trim()
    : (lead.payload as Record<string, unknown> | null)?.phone
      ? String((lead.payload as Record<string, unknown>).phone)
      : null;
  const budgetDisplay = lead.budget_unsure
    ? "Not sure yet"
    : lead.budget_min != null && lead.budget_max != null
      ? lead.budget_currency === "USD"
        ? `$${lead.budget_min.toLocaleString()} – $${lead.budget_max.toLocaleString()}`
        : `${lead.budget_min.toLocaleString()} – ${lead.budget_max.toLocaleString()} RWF`
      : null;

  const mockMode = isEmailMockMode();

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/admin/leads" className="flex items-center gap-1 text-[12px] text-admin-fg-subtle hover:text-admin-fg">
            <ArrowLeft className="size-3" /> Leads
          </Link>
          <span className="text-admin-fg-subtle">/</span>
          <h1 className="text-[16px] font-semibold tracking-tight text-admin-fg">{lead.name ?? lead.email}</h1>
          <StatusBadge status={lead.status} />
          <Badge>{lead.kind}</Badge>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <LeadPipelineBar current={lead.status} />

          <Card>
            <CardHeader><CardTitle>Original submission</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-md border border-admin-border bg-admin-elevated p-3 text-[13px] text-admin-fg whitespace-pre-wrap">
                {lead.message ?? lead.intent ?? "—"}
              </div>
              <div className="grid grid-cols-2 gap-3 text-[12px] sm:grid-cols-3">
                <Field label="Email"><a className="inline-flex items-center gap-1 text-admin-fg underline-offset-4 hover:underline" href={`mailto:${lead.email}`}><Mail className="size-3" />{lead.email}</a></Field>
                <Field label="Company">{lead.company ?? "—"}</Field>
                <Field label="Role">{lead.role ?? "—"}</Field>
                <Field label="Company size">{lead.company_size ?? "—"}</Field>
                <Field label="Timeline">{lead.timeline ?? "—"}</Field>
                <Field label="Phone">{phoneDisplay ? <a className="inline-flex items-center gap-1" href={`tel:${phoneDisplay.replace(/\s+/g, "")}`}><Phone className="size-3" />{phoneDisplay}</a> : "—"}</Field>
                {country ? <Field label="Country">{flagEmoji(country.code)} {country.name}</Field> : null}
                {isQuickStart ? (
                  <>
                    <Field label="Budget">{budgetDisplay ?? "—"}</Field>
                    <Field label="Preferred channel">{lead.preferred_channel ?? "—"}</Field>
                    <Field label="Window">{lead.preferred_window ?? "—"}</Field>
                    <Field label="Services">{lead.service_slugs.length > 0 ? lead.service_slugs.join(", ") : "—"}</Field>
                    <Field label="Custom request">{lead.custom_request ? <span className="line-clamp-3 whitespace-pre-wrap">{lead.custom_request}</span> : "—"}</Field>
                  </>
                ) : null}
              </div>
              {Object.keys(lead.payload ?? {}).length > 0 ? (
                <details className="text-[12px]">
                  <summary className="cursor-pointer text-admin-fg-subtle hover:text-admin-fg">Raw payload</summary>
                  <pre className="mt-2 overflow-x-auto rounded-md border border-admin-border bg-admin-elevated p-2 font-mono text-[11px] text-admin-fg-muted">{JSON.stringify(lead.payload, null, 2)}</pre>
                </details>
              ) : null}
            </CardContent>
          </Card>

          <LeadAttachmentsPanel attachments={attachmentsWithUrls} showForQuickStart={isQuickStart} />

          <LeadThread messages={messages ?? []} />

          <Card>
            <CardHeader><CardTitle>Activity</CardTitle></CardHeader>
            <CardContent>
              {history && history.length ? (
                <ul className="space-y-2 text-[12px]">
                  {history.map((h) => (
                    <li key={h.id} className="flex items-start justify-between gap-3">
                      <span className="text-admin-fg-muted">{h.action}</span>
                      <span className="shrink-0 text-admin-fg-subtle">{new Date(h.created_at).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[12px] text-admin-fg-subtle">No activity yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <LeadReplyComposer lead={lead} mockMode={mockMode} />
          <LeadAiAssist lead={lead} />
          <LeadDetailControls lead={lead} />
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-admin-fg-subtle">{label}</div>
      <div className="text-admin-fg">{children}</div>
    </div>
  );
}

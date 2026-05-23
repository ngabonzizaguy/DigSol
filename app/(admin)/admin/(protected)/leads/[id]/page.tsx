import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { StatusBadge, Badge } from "@/components/admin/ui/badge";
import { LeadDetailControls } from "@/components/admin/leads/lead-detail-controls";
import type { Lead } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("leads").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const lead = data as Lead;

  const { data: history } = await supabase
    .from("activity_log")
    .select("id, action, created_at, actor_id")
    .eq("entity", "leads")
    .eq("entity_id", lead.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
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
          <Card>
            <CardHeader><CardTitle>Message</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-md border border-admin-border bg-admin-elevated p-3 text-[13px] text-admin-fg whitespace-pre-wrap">
                {lead.message ?? lead.intent ?? "—"}
              </div>
              <div className="grid grid-cols-2 gap-3 text-[12px]">
                <Field label="Email"><a className="inline-flex items-center gap-1 text-admin-fg underline-offset-4 hover:underline" href={`mailto:${lead.email}`}><Mail className="size-3" />{lead.email}</a></Field>
                <Field label="Company">{lead.company ?? "—"}</Field>
                <Field label="Role">{lead.role ?? "—"}</Field>
                <Field label="Company size">{lead.company_size ?? "—"}</Field>
                <Field label="Timeline">{lead.timeline ?? "—"}</Field>
                <Field label="Phone">{(lead.payload as Record<string, unknown> | null)?.phone ? <a className="inline-flex items-center gap-1" href={`tel:${(lead.payload as Record<string, unknown>).phone}`}><Phone className="size-3" />{String((lead.payload as Record<string, unknown>).phone)}</a> : "—"}</Field>
              </div>
              {Object.keys(lead.payload ?? {}).length > 0 ? (
                <details className="text-[12px]">
                  <summary className="cursor-pointer text-admin-fg-subtle hover:text-admin-fg">Raw payload</summary>
                  <pre className="mt-2 overflow-x-auto rounded-md border border-admin-border bg-admin-elevated p-2 font-mono text-[11px] text-admin-fg-muted">{JSON.stringify(lead.payload, null, 2)}</pre>
                </details>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Activity</CardTitle></CardHeader>
            <CardContent>
              {history && history.length ? (
                <ul className="space-y-2 text-[12px]">
                  {history.map((h) => (
                    <li key={h.id} className="flex items-start justify-between gap-3">
                      <span className="text-admin-fg-muted">{h.action}</span>
                      <span className="text-admin-fg-subtle">{new Date(h.created_at).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[12px] text-admin-fg-subtle">No activity yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <LeadDetailControls lead={lead} />
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

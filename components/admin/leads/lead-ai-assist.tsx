"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { summarizeLead, suggestReplyTone } from "@/lib/ai/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import type { Lead } from "@/lib/supabase/types";

export function LeadAiAssist({ lead }: { lead: Lead }) {
  const [summary, setSummary] = useState<string | null>(null);
  const [tone, setTone] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function runSummary() {
    startTransition(async () => {
      try {
        const text = await summarizeLead({
          name: lead.name,
          email: lead.email,
          message: lead.message,
          kind: lead.kind,
          status: lead.status,
        });
        setSummary(text);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "AI failed");
      }
    });
  }

  function runTone() {
    startTransition(async () => {
      try {
        const text = await suggestReplyTone({ message: lead.message });
        setTone(text);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "AI failed");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI assist</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" disabled={pending} onClick={runSummary}>
            Summarize
          </Button>
          <Button variant="outline" size="sm" disabled={pending} onClick={runTone}>
            Suggest reply tone
          </Button>
        </div>
        {summary ? (
          <div className="rounded-md border border-admin-border-soft bg-admin-elevated p-2 text-[12px] text-admin-fg-muted">
            <div className="mb-1 text-[10px] font-semibold uppercase text-admin-fg-subtle">Summary</div>
            {summary}
          </div>
        ) : null}
        {tone ? (
          <div className="rounded-md border border-admin-border-soft bg-admin-elevated p-2 text-[12px] text-admin-fg-muted">
            <div className="mb-1 text-[10px] font-semibold uppercase text-admin-fg-subtle">Reply tone</div>
            {tone}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

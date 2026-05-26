"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { sendLeadReply } from "@/app/(admin)/admin/(protected)/leads/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import { Input, Textarea } from "@/components/admin/ui/input";
import { FormField } from "@/components/admin/ui/form-field";
import type { Lead } from "@/lib/supabase/types";

export function LeadReplyComposer({ lead, mockMode }: { lead: Lead; mockMode: boolean }) {
  const router = useRouter();
  const [subject, setSubject] = useState(`Re: Your inquiry — ${lead.name ?? lead.email}`);
  const [body, setBody] = useState("");
  const [pending, startTransition] = useTransition();

  function submit() {
    startTransition(async () => {
      try {
        await sendLeadReply(lead.id, { subject, body });
        toast.success(mockMode ? "Reply logged (mock email)" : "Reply sent");
        setBody("");
        router.refresh();
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to send");
      }
    });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle>Reply</CardTitle>
        {mockMode ? (
          <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:text-amber-300">
            Mock email
          </span>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-3">
        <FormField label="Subject">
          <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
        </FormField>
        <FormField label="Message">
          <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={6} placeholder="Write your reply…" />
        </FormField>
        <Button variant="primary" size="sm" onClick={submit} disabled={pending || !body.trim()}>
          Send reply
        </Button>
      </CardContent>
    </Card>
  );
}

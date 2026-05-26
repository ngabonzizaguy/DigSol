"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateLeadStatus, updateLeadNotes, deleteLead, addLeadNote } from "@/app/(admin)/admin/(protected)/leads/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import { Textarea } from "@/components/admin/ui/input";
import { FormField } from "@/components/admin/ui/form-field";
import type { Lead, LeadStatus } from "@/lib/supabase/types";

const STATUSES: LeadStatus[] = ["new", "in_progress", "replied", "closed", "qualified"];

export function LeadDetailControls({ lead }: { lead: Lead }) {
  const router = useRouter();
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [notes, setNotes] = useState(lead.notes ?? "");
  const [internalNote, setInternalNote] = useState("");
  const [pending, startTransition] = useTransition();

  function updateStatus(next: LeadStatus) {
    setStatus(next);
    startTransition(async () => {
      try {
        await updateLeadStatus(lead.id, next);
        toast.success(`Marked ${next}`);
        router.refresh();
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed");
      }
    });
  }

  function saveNotes() {
    startTransition(async () => {
      try {
        await updateLeadNotes(lead.id, notes);
        toast.success("Notes saved");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed");
      }
    });
  }

  function saveInternalNote() {
    startTransition(async () => {
      try {
        await addLeadNote(lead.id, internalNote);
        toast.success("Note added to thread");
        setInternalNote("");
        router.refresh();
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed");
      }
    });
  }

  function handleDelete() {
    if (!confirm("Delete this lead?")) return;
    startTransition(async () => {
      try {
        await deleteLead(lead.id);
        toast.success("Deleted");
        router.push("/admin/leads");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed");
      }
    });
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle>Status</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-1.5">
          {STATUSES.map((s) => (
            <Button
              key={s}
              type="button"
              variant={status === s ? "primary" : "outline"}
              size="sm"
              disabled={pending}
              onClick={() => updateStatus(s)}
            >
              {s}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <FormField label="Internal notes" hint="Not shown to the lead">
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
          </FormField>
          <Button variant="primary" size="sm" onClick={saveNotes} disabled={pending}>Save notes</Button>
          <FormField label="Quick thread note" hint="Saved to conversation, not emailed">
            <Textarea value={internalNote} onChange={(e) => setInternalNote(e.target.value)} rows={2} />
          </FormField>
          <Button variant="outline" size="sm" onClick={saveInternalNote} disabled={pending || !internalNote.trim()}>
            Add to thread
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Button variant="danger" size="sm" onClick={handleDelete} disabled={pending}>Delete lead</Button>
        </CardContent>
      </Card>
    </div>
  );
}

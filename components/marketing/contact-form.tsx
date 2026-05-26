"use client";

import { useActionState, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { submitContact } from "@/lib/forms/actions";
import { improveContactMessage } from "@/lib/ai/actions";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

function Submit() {
  const { pending } = useFormStatus();
  return <Button type="submit" size="md" disabled={pending}>{pending ? "Sending…" : "Send message"}</Button>;
}

export function ContactForm({ aiAssistEnabled = false }: { aiAssistEnabled?: boolean }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [state, action] = useActionState(submitContact, null);
  const [aiPending, startAi] = useTransition();

  useEffect(() => {
    if (state?.ok) {
      toast.success("Thanks — we'll be in touch within one business day.");
      if (state.redirect) router.push(state.redirect);
    } else if (state && !state.ok) {
      toast.error(state.error);
    }
  }, [state, router]);

  function improveMessage() {
    if (!message.trim()) {
      toast.error("Write a message first");
      return;
    }
    startAi(async () => {
      try {
        const improved = await improveContactMessage(message);
        setMessage(improved);
        toast.success("Message polished — review before sending");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Could not improve message");
      }
    });
  }

  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-body-strong">Name</span>
          <Input name="name" required />
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-body-strong">Email</span>
          <Input type="email" name="email" required />
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-body-strong">Company</span>
          <Input name="company" />
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-body-strong">Role</span>
          <Input name="role" />
        </label>
      </div>
      <label className="space-y-1.5">
        <span className="text-sm font-medium text-body-strong">How can we help?</span>
        <Textarea name="message" rows={5} required value={message} onChange={(e) => setMessage(e.target.value)} />
      </label>
      <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
        {aiAssistEnabled ? (
          <Button
            type="button"
            variant="outline"
            size="md"
            disabled={aiPending}
            onClick={improveMessage}
          >
            {aiPending ? "Improving…" : "Improve message"}
          </Button>
        ) : null}
        <Submit />
      </div>
    </form>
  );
}

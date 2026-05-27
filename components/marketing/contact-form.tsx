"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { submitContact } from "@/lib/forms/actions";
import { improveContactMessage } from "@/lib/ai/actions";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { findCountry } from "@/lib/marketing/countries";
import { buildWhatsAppLink } from "@/lib/marketing/whatsapp";

function Submit() {
  const { pending } = useFormStatus();
  return <Button type="submit" size="md" disabled={pending}>{pending ? "Sending…" : "Send message"}</Button>;
}

export interface ContactFormProps {
  aiAssistEnabled?: boolean;
  whatsappNumber?: string;
  defaultCountry?: string;
}

export function ContactForm({ aiAssistEnabled = false, whatsappNumber, defaultCountry = "RW" }: ContactFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState(defaultCountry);
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

  const country = findCountry(countryCode);
  const waLink = whatsappNumber
    ? buildWhatsAppLink(
        whatsappNumber,
        `Hi DigSolutions — ${name ? `I'm ${name}.` : ""} ${message}`.trim(),
      )
    : null;

  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-body-strong">Name</span>
          <Input name="name" required value={name} onChange={(e) => setName(e.target.value)} />
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
        <label className="space-y-1.5 md:col-span-2">
          <span className="text-sm font-medium text-body-strong">Phone (optional)</span>
          <PhoneInput
            countryCode={country?.code}
            value={phone}
            onChange={setPhone}
            onCountryChange={(code) => setCountryCode(code)}
          />
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
        {waLink ? (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-hairline-strong bg-surface-card px-5 py-2 text-[15px] text-ink hover:bg-surface-strong transition-colors"
          >
            <MessageCircle className="h-4 w-4" /> Send via WhatsApp
          </a>
        ) : null}
        <Submit />
      </div>
    </form>
  );
}

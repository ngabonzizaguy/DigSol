"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { submitConsultation } from "@/lib/forms/actions";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { findCountry } from "@/lib/marketing/countries";
import { buildWhatsAppLink } from "@/lib/marketing/whatsapp";

function Submit() {
  const { pending } = useFormStatus();
  return <Button type="submit" size="md" disabled={pending}>{pending ? "Submitting…" : "Request session"}</Button>;
}

export interface ConsultationFormProps {
  whatsappNumber?: string;
  defaultCountry?: string;
}

export function ConsultationForm({ whatsappNumber, defaultCountry = "RW" }: ConsultationFormProps) {
  const router = useRouter();
  const [state, action] = useActionState(submitConsultation, null);
  const [name, setName] = useState("");
  const [intent, setIntent] = useState("");
  const [countryCode, setCountryCode] = useState(defaultCountry);
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (state?.ok) {
      toast.success("Thanks — we'll confirm your slot within one business day.");
      if (state.redirect) router.push(state.redirect);
    } else if (state && !state.ok) {
      toast.error(state.error);
    }
  }, [state, router]);

  const country = findCountry(countryCode);
  const waLink = whatsappNumber
    ? buildWhatsAppLink(
        whatsappNumber,
        `Hi DigSolutions — ${name ? `I'm ${name}.` : ""} I'd like to book a consultation. ${intent}`.trim(),
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
          <span className="text-sm font-medium text-body-strong">Phone (optional)</span>
          <PhoneInput
            countryCode={country?.code}
            value={phone}
            onChange={setPhone}
            onCountryChange={(code) => setCountryCode(code)}
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-body-strong">Company size</span>
          <select name="company_size" className="flex h-11 w-full rounded-pill border border-hairline bg-surface-card px-4 text-sm">
            <option>1–10</option>
            <option>11–50</option>
            <option>51–200</option>
            <option>201–1,000</option>
            <option>1,000+</option>
          </select>
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-body-strong">Timeline</span>
          <select name="timeline" className="flex h-11 w-full rounded-pill border border-hairline bg-surface-card px-4 text-sm">
            <option>0–30 days</option>
            <option>1–3 months</option>
            <option>3–6 months</option>
            <option>6+ months</option>
            <option>Just exploring</option>
          </select>
        </label>
      </div>
      <label className="space-y-1.5">
        <span className="text-sm font-medium text-body-strong">What outcomes are you optimising for?</span>
        <Textarea name="intent" rows={5} required value={intent} onChange={(e) => setIntent(e.target.value)} />
      </label>
      <div className="flex flex-wrap justify-end gap-2 pt-2">
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

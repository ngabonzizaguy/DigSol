"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { submitConsultation } from "@/lib/forms/actions";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

function Submit() {
  const { pending } = useFormStatus();
  return <Button type="submit" size="md" disabled={pending}>{pending ? "Submitting…" : "Request session"}</Button>;
}

export function ConsultationForm() {
  const router = useRouter();
  const [state, action] = useActionState(submitConsultation, null);
  useEffect(() => {
    if (state?.ok) {
      toast.success("Thanks — we'll confirm your slot within one business day.");
      if (state.redirect) router.push(state.redirect);
    } else if (state && !state.ok) {
      toast.error(state.error);
    }
  }, [state, router]);

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
          <span className="text-sm font-medium text-body-strong">Phone (optional)</span>
          <Input name="phone" type="tel" />
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
        <Textarea name="intent" rows={5} required />
      </label>
      <div className="flex justify-end pt-2">
        <Submit />
      </div>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { submitContact } from "@/lib/forms/actions";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

function Submit() {
  const { pending } = useFormStatus();
  return <Button type="submit" size="md" disabled={pending}>{pending ? "Sending…" : "Send message"}</Button>;
}

export function ContactForm() {
  const router = useRouter();
  const [state, action] = useActionState(submitContact, null);
  useEffect(() => {
    if (state?.ok) {
      toast.success("Thanks — we'll be in touch within one business day.");
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
          <span className="text-sm font-medium text-body-strong">Role</span>
          <Input name="role" />
        </label>
      </div>
      <label className="space-y-1.5">
        <span className="text-sm font-medium text-body-strong">How can we help?</span>
        <Textarea name="message" rows={5} required />
      </label>
      <div className="flex justify-end pt-2">
        <Submit />
      </div>
    </form>
  );
}

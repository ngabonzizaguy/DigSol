"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { subscribeNewsletter } from "@/lib/forms/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function Submit() {
  const { pending } = useFormStatus();
  return <Button type="submit" size="sm" disabled={pending}>{pending ? "…" : "Subscribe"}</Button>;
}

export function NewsletterForm() {
  const ref = useRef<HTMLFormElement>(null);
  const [state, action] = useActionState(subscribeNewsletter, null);
  useEffect(() => {
    if (state?.ok) {
      toast.success("Subscribed.");
      ref.current?.reset();
    } else if (state && !state.ok) {
      toast.error(state.error);
    }
  }, [state]);
  return (
    <form ref={ref} action={action} className="flex w-full max-w-sm items-center gap-2">
      <Input type="email" name="email" required placeholder="you@company.com" className="bg-canvas-soft" />
      <Submit />
    </form>
  );
}

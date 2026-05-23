"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { inviteUser } from "@/app/(admin)/admin/(protected)/users/actions";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { FormField } from "@/components/admin/ui/form-field";

function Submit() {
  const { pending } = useFormStatus();
  return <Button type="submit" variant="primary" size="sm" disabled={pending} className="w-full">{pending ? "Sending…" : "Send invite"}</Button>;
}

export function InviteForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action] = useActionState(inviteUser, null);

  useEffect(() => {
    if (state?.ok) {
      toast.success(`Invite sent to ${state.email}`);
      formRef.current?.reset();
      router.refresh();
    } else if (state && !state.ok) {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <form ref={formRef} action={action} className="space-y-2.5">
      <FormField label="Email" required>
        <Input type="email" name="email" required placeholder="teammate@company.com" />
      </FormField>
      <FormField label="Role">
        <select name="role" defaultValue="editor" className="flex h-9 w-full rounded-md border border-admin-border bg-admin-surface px-3 text-[13px] text-admin-fg">
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
        </select>
      </FormField>
      <Submit />
    </form>
  );
}

"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { removeUser } from "@/app/(admin)/admin/(protected)/users/actions";
import { Button } from "@/components/admin/ui/button";

export function RemoveUserButton({
  userId,
  email,
  isSelf,
}: {
  userId: string;
  email: string;
  isSelf: boolean;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  if (isSelf) {
    return <span className="text-[11px] text-admin-fg-subtle">You</span>;
  }

  function handleRemove() {
    startTransition(async () => {
      try {
        await removeUser(userId);
        toast.success(`Removed ${email}`);
        setConfirming(false);
        router.refresh();
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to remove user");
      }
    });
  }

  if (confirming) {
    return (
      <div className="flex items-center justify-end gap-1">
        <Button type="button" variant="danger" size="xs" disabled={pending} onClick={handleRemove}>
          {pending ? "Removing…" : "Confirm"}
        </Button>
        <Button type="button" variant="ghost" size="xs" disabled={pending} onClick={() => setConfirming(false)}>
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="xs"
      className="text-admin-fg-subtle hover:text-error"
      aria-label={`Remove ${email}`}
      onClick={() => setConfirming(true)}
    >
      <Trash2 className="size-3.5" />
      Remove
    </Button>
  );
}

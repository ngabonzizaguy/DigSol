"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateUserRole } from "@/app/(admin)/admin/(protected)/users/actions";
import type { UserRole } from "@/lib/supabase/types";

const ROLES: UserRole[] = ["admin", "editor", "viewer"];

export function UserRoleCell({ userId, role }: { userId: string; role: UserRole }) {
  const router = useRouter();
  const [current, setCurrent] = useState<UserRole>(role);
  const [pending, startTransition] = useTransition();

  function change(next: UserRole) {
    setCurrent(next);
    startTransition(async () => {
      try {
        await updateUserRole(userId, next);
        toast.success(`Role set to ${next}`);
        router.refresh();
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed");
      }
    });
  }

  return (
    <select
      value={current}
      disabled={pending}
      onChange={(e) => change(e.target.value as UserRole)}
      className="h-7 rounded-md border border-admin-border bg-admin-surface px-2 text-[12px] text-admin-fg"
    >
      {ROLES.map((r) => (
        <option key={r} value={r}>
          {r}
        </option>
      ))}
    </select>
  );
}

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateUserPermissions, resetUserPermissions } from "@/app/(admin)/admin/(protected)/users/actions";
import { Button } from "@/components/admin/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import {
  PERMISSION_RESOURCES,
  ROLE_PRESETS,
  type AdminRole,
  type AdminResource,
  type AdminAction,
  type PermissionOverrides,
} from "@/lib/admin/permissions";

const ACTION_LABELS: Record<AdminAction, string> = {
  read: "View",
  create: "Create",
  update: "Edit",
  delete: "Delete",
  reply: "Reply",
  publish: "Publish",
  manage: "Manage",
};

export function UserPermissionsPanel({
  userId,
  email,
  role,
  initialOverrides,
}: {
  userId: string;
  email: string;
  role: AdminRole;
  initialOverrides: PermissionOverrides | null;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [overrides, setOverrides] = useState<PermissionOverrides | null>(initialOverrides);
  const [pending, startTransition] = useTransition();

  if (role === "admin") {
    return <span className="text-[11px] text-admin-fg-subtle">Full access</span>;
  }

  function toggle(resource: AdminResource, action: AdminAction) {
    setOverrides((prev) => {
      const base = { ...(prev ?? {}) };
      const current = new Set(base[resource] ?? ROLE_PRESETS[role][resource] ?? []);
      if (current.has(action)) current.delete(action);
      else current.add(action);
      base[resource] = [...current];
      return base;
    });
  }

  function isChecked(resource: AdminResource, action: AdminAction) {
    const effective = overrides?.[resource] ?? ROLE_PRESETS[role][resource] ?? [];
    return effective.includes(action);
  }

  function save() {
    startTransition(async () => {
      try {
        await updateUserPermissions(userId, overrides);
        toast.success("Permissions saved");
        router.refresh();
        setOpen(false);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed");
      }
    });
  }

  function reset() {
    startTransition(async () => {
      try {
        await resetUserPermissions(userId);
        setOverrides(null);
        toast.success("Reset to role defaults");
        router.refresh();
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed");
      }
    });
  }

  return (
    <>
      <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
        Permissions
      </Button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
          <Card className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden shadow-xl">
            <CardHeader className="border-b border-admin-border-soft">
              <CardTitle className="text-[15px]">Permissions — {email}</CardTitle>
              <p className="text-[12px] font-normal text-admin-fg-subtle">
                Role: <span className="capitalize text-admin-fg">{role}</span>. Overrides apply on top of the role preset.
              </p>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto py-4">
              <div className="space-y-4">
                {PERMISSION_RESOURCES.map((res) => (
                  <div key={res.key} className="rounded-lg border border-admin-border-soft p-3">
                    <div className="mb-2 text-[13px] font-medium text-admin-fg">{res.label}</div>
                    <div className="flex flex-wrap gap-2">
                      {res.actions.map((action) => (
                        <label
                          key={action}
                          className="flex cursor-pointer items-center gap-1.5 rounded-md border border-admin-border px-2 py-1 text-[11px] text-admin-fg-muted has-[:checked]:border-admin-accent has-[:checked]:bg-admin-accent/10"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked(res.key, action)}
                            onChange={() => toggle(res.key, action)}
                            className="size-3 rounded border-admin-border"
                          />
                          {ACTION_LABELS[action]}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <div className="flex flex-wrap justify-end gap-2 border-t border-admin-border-soft p-4">
              <Button type="button" variant="outline" size="sm" disabled={pending} onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="button" variant="outline" size="sm" disabled={pending} onClick={reset}>
                Reset to role default
              </Button>
              <Button type="button" variant="primary" size="sm" disabled={pending} onClick={save}>
                Save permissions
              </Button>
            </div>
          </Card>
        </div>
      ) : null}
    </>
  );
}

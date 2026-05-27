"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { resetAnalyticsData } from "@/app/(admin)/admin/(protected)/analytics/actions";

export function ResetAnalyticsCard() {
  const router = useRouter();
  const [confirm, setConfirm] = useState("");
  const [pending, startTransition] = useTransition();

  function handleReset() {
    if (confirm !== "RESET") {
      toast.error('Type "RESET" to confirm.');
      return;
    }
    startTransition(async () => {
      const res = await resetAnalyticsData(confirm);
      if (res.ok) {
        toast.success(`Cleared ${res.deleted.toLocaleString()} pageviews`);
        setConfirm("");
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  }

  return (
    <Card className="border-error/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[14px] text-error">
          <AlertTriangle className="size-4" /> Danger zone
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-[12px] text-admin-fg-muted">
          Reset all analytics data. This deletes every pageview record permanently. Lead data is not affected.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder='Type "RESET" to enable'
            className="max-w-[16rem]"
          />
          <Button
            type="button"
            variant="danger"
            size="sm"
            disabled={pending || confirm !== "RESET"}
            onClick={handleReset}
          >
            {pending ? "Resetting…" : "Reset analytics data"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

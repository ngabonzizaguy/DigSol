import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/admin/ui/label";

export function FormField({
  label,
  hint,
  error,
  required,
  className,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="flex items-center gap-1">
        {label}
        {required ? <span className="text-error">*</span> : null}
      </Label>
      {children}
      {hint && !error ? <p className="text-[11px] text-admin-fg-subtle">{hint}</p> : null}
      {error ? <p className="text-[11px] text-error">{error}</p> : null}
    </div>
  );
}

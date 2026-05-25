import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export function LiveContentNotice({ title, children, className }: Props) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-lg border border-admin-border-soft bg-admin-canvas/80 px-4 py-3 text-[13px] text-admin-fg-muted",
        className,
      )}
    >
      <Info className="mt-0.5 size-4 shrink-0 text-admin-fg-subtle" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="font-medium text-admin-fg">{title}</p>
        <div className="mt-1 break-words text-pretty leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

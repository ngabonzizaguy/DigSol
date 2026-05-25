import { cn } from "@/lib/utils";

/** Card header row: title stacks above actions on narrow screens. */
export function AdminCardToolbar({
  title,
  children,
  className,
}: {
  title: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0">{title}</div>
      {children ? (
        <div className="flex min-w-0 flex-wrap items-center gap-2 [&_button]:max-w-full">{children}</div>
      ) : null}
    </div>
  );
}

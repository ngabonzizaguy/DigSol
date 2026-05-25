import { cn } from "@/lib/utils";

/** Prevents horizontal overflow in admin main; use on every admin page root. */
export function AdminPageStack({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("w-full min-w-0 max-w-full space-y-4", className)}>{children}</div>;
}

export function AdminPageHeader({
  title,
  description,
  className,
}: {
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <header className={cn("min-w-0", className)}>
      <h1 className="text-balance text-[20px] font-semibold tracking-tight text-admin-fg">{title}</h1>
      {description ? (
        <p className="mt-1 max-w-3xl text-pretty text-[13px] leading-relaxed text-admin-fg-subtle">{description}</p>
      ) : null}
    </header>
  );
}

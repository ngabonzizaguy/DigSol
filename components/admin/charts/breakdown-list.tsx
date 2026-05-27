export function BreakdownList({
  items,
  emptyLabel = "No data yet",
}: {
  items: { label: string; value: number }[];
  emptyLabel?: string;
}) {
  if (items.length === 0) {
    return <p className="py-8 text-center text-[12px] text-admin-fg-subtle">{emptyLabel}</p>;
  }

  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <ul className="space-y-3.5">
      {items.map((item, index) => {
        const width = Math.max(4, Math.round((item.value / max) * 100));

        return (
          <li key={`${item.label}-${index}`}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <span
                className="min-w-0 truncate text-[13px] font-medium text-admin-fg"
                title={item.label}
              >
                {item.label}
              </span>
              <span className="shrink-0 tabular-nums text-[12px] text-admin-fg-muted">
                {item.value.toLocaleString()}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-admin-border-soft">
              <div
                className="h-full rounded-full bg-admin-fg transition-[width] duration-300 ease-out motion-reduce:transition-none"
                style={{ width: `${width}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

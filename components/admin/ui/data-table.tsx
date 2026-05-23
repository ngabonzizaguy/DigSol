import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type DataTableColumn<T> = {
  key: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  width?: string;
  align?: "left" | "right" | "center";
};

export function DataTable<T extends { id: string }>({
  data,
  columns,
  rowHref,
  emptyState,
}: {
  data: T[];
  columns: DataTableColumn<T>[];
  rowHref?: (row: T) => string;
  emptyState?: React.ReactNode;
}) {
  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-admin-border bg-admin-surface">
      <div className="w-full overflow-x-auto">
        <table className="w-full table-auto text-[13px]">
          <thead className="border-b border-admin-border bg-admin-elevated">
            <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-admin-fg-subtle">
              {columns.map((c) => (
                <th
                  key={c.key}
                  style={{ width: c.width }}
                  className={cn(
                    "px-3 py-2",
                    c.align === "right" && "text-right",
                    c.align === "center" && "text-center"
                  )}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-admin-border-soft">
            {data.map((row) => {
              const href = rowHref?.(row);
              return (
                <tr key={row.id} className="group transition-colors hover:bg-admin-hover/60">
                  {columns.map((c) => {
                    const content = c.cell(row);
                    return (
                      <td
                        key={c.key}
                        style={{ width: c.width }}
                        className={cn(
                          "px-0 py-0 text-admin-fg",
                          c.align === "right" && "text-right",
                          c.align === "center" && "text-center"
                        )}
                      >
                        {href ? (
                          <Link
                            href={href}
                            className={cn(
                              "block px-3 py-2.5 text-inherit no-underline",
                              c.align === "right" && "text-right",
                              c.align === "center" && "text-center"
                            )}
                          >
                            {content}
                          </Link>
                        ) : (
                          <div
                            className={cn(
                              "px-3 py-2.5",
                              c.align === "right" && "text-right",
                              c.align === "center" && "text-center"
                            )}
                          >
                            {content}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

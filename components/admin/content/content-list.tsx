"use client";

import * as React from "react";
import Link from "next/link";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Folder,
  LayoutGrid,
  LayoutList,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge, StatusBadge } from "@/components/admin/ui/badge";
import { Button } from "@/components/admin/ui/button";
import type { ContentListFilterDef, ContentListItem, ContentListSort } from "./content-list-types";
import { ContentListEmpty } from "./content-list-page-header";
import { formatAdminDate } from "@/lib/admin/format-date";

const PAGE_SIZE = 10;

const SORT_OPTIONS: { value: ContentListSort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "title-az", label: "Title A–Z" },
  { value: "title-za", label: "Title Z–A" },
];

function sortItems(items: ContentListItem[], sort: ContentListSort): ContentListItem[] {
  const copy = [...items];
  copy.sort((a, b) => {
    switch (sort) {
      case "oldest":
        return (a.updatedAt ?? "").localeCompare(b.updatedAt ?? "");
      case "title-az":
        return a.title.localeCompare(b.title);
      case "title-za":
        return b.title.localeCompare(a.title);
      case "newest":
      default:
        return (b.updatedAt ?? "").localeCompare(a.updatedAt ?? "");
    }
  });
  return copy;
}

function ProjectThumb({ item }: { item: ContentListItem }) {
  if (item.imageUrl) {
    return (
      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-admin-border bg-admin-elevated sm:size-14">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.imageUrl} alt="" className="size-full object-cover" />
      </div>
    );
  }
  return (
    <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-admin-border bg-admin-elevated text-admin-fg-subtle sm:size-14">
      <Folder className="size-5" aria-hidden />
    </div>
  );
}

function ProjectCell({ item }: { item: ContentListItem }) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <ProjectThumb item={item} />
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-1.5">
          {item.featured ? (
            <Star className="mt-0.5 size-3.5 shrink-0 fill-amber-400 text-amber-400" aria-label="Featured" />
          ) : null}
          <p className="line-clamp-2 text-[14px] font-medium leading-snug text-admin-fg sm:line-clamp-1">{item.title}</p>
        </div>
        {item.subtitle ? (
          <p className="mt-0.5 truncate font-mono text-[11px] text-admin-fg-subtle">{item.subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="relative min-w-0 flex-1 sm:flex-none">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full min-w-0 appearance-none rounded-lg border border-admin-border bg-admin-surface pl-3 pr-8 text-[13px] text-admin-fg outline-none transition-colors hover:bg-admin-hover focus-visible:ring-2 focus-visible:ring-admin-accent sm:w-auto sm:min-w-[140px]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-admin-fg-subtle" aria-hidden>
        ▾
      </span>
    </label>
  );
}

export function ContentList({
  items,
  filters = [],
  emptyTitle = "Nothing here yet",
  emptyDescription,
  projectColumnLabel = "Project",
  detailColumnLabel = "Detail",
  badgeColumnLabel = "Segment",
  showSegmentColumn = true,
}: {
  items: ContentListItem[];
  filters?: ContentListFilterDef[];
  emptyTitle?: string;
  emptyDescription?: string;
  projectColumnLabel?: string;
  detailColumnLabel?: string;
  badgeColumnLabel?: string;
  showSegmentColumn?: boolean;
}) {
  const [view, setView] = React.useState<"list" | "grid">("list");
  const [sort, setSort] = React.useState<ContentListSort>("newest");
  const [page, setPage] = React.useState(1);
  const [filterState, setFilterState] = React.useState<Record<string, string>>(() =>
    Object.fromEntries(filters.map((f) => [f.id, "all"])),
  );

  const filterOptions = React.useMemo(() => {
    const map: Record<string, { value: string; label: string }[]> = {};
    for (const f of filters) {
      const values = new Set<string>();
      for (const item of items) {
        const v = item.filterValues?.[f.id];
        if (v) values.add(v);
      }
      map[f.id] = [
        { value: "all", label: f.allLabel },
        ...Array.from(values)
          .sort((a, b) => a.localeCompare(b))
          .map((v) => ({ value: v, label: v })),
      ];
    }
    return map;
  }, [filters, items]);

  const filtered = React.useMemo(() => {
    return items.filter((item) => {
      for (const f of filters) {
        const selected = filterState[f.id] ?? "all";
        if (selected === "all") continue;
        if (item.filterValues?.[f.id] !== selected) return false;
      }
      return true;
    });
  }, [items, filters, filterState]);

  const sorted = React.useMemo(() => sortItems(filtered, sort), [filtered, sort]);
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const rangeStart = sorted.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(safePage * PAGE_SIZE, sorted.length);

  React.useEffect(() => {
    setPage(1);
  }, [filterState, sort]);

  if (items.length === 0) {
    return <ContentListEmpty title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="w-full min-w-0 max-w-full space-y-3">
      <div className="flex flex-col gap-2 rounded-xl border border-admin-border bg-admin-surface p-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="grid w-full min-w-0 gap-2 sm:flex sm:w-auto sm:flex-row sm:flex-wrap">
          {filters.map((f) => (
            <FilterSelect
              key={f.id}
              label={f.allLabel}
              value={filterState[f.id] ?? "all"}
              onChange={(v) => setFilterState((prev) => ({ ...prev, [f.id]: v }))}
              options={filterOptions[f.id] ?? [{ value: "all", label: f.allLabel }]}
            />
          ))}
        </div>
        <div className="flex items-center justify-between gap-2 sm:justify-end">
          <div className="flex items-center gap-2">
            <span className="hidden text-[12px] text-admin-fg-subtle sm:inline">Sort by</span>
            <FilterSelect
              label="Sort by"
              value={sort}
              onChange={(v) => setSort(v as ContentListSort)}
              options={SORT_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
            />
          </div>
          <div className="flex items-center rounded-lg border border-admin-border p-0.5">
            <button
              type="button"
              aria-label="List view"
              onClick={() => setView("list")}
              className={cn(
                "rounded-md p-1.5 transition-colors",
                view === "list" ? "bg-admin-accent text-admin-accent-fg" : "text-admin-fg-subtle hover:bg-admin-hover",
              )}
            >
              <LayoutList className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Grid view"
              onClick={() => setView("grid")}
              className={cn(
                "rounded-md p-1.5 transition-colors",
                view === "grid" ? "bg-admin-accent text-admin-accent-fg" : "text-admin-fg-subtle hover:bg-admin-hover",
              )}
            >
              <LayoutGrid className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {view === "list" ? (
        <div className="hidden overflow-hidden rounded-xl border border-admin-border bg-admin-surface md:block">
          <table className="w-full text-[13px]">
            <thead className="border-b border-admin-border bg-admin-elevated/80">
              <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-admin-fg-subtle">
                <th className="px-4 py-3">{projectColumnLabel}</th>
                {showSegmentColumn ? <th className="hidden w-[120px] px-4 py-3 lg:table-cell">{badgeColumnLabel}</th> : null}
                <th className="hidden w-[180px] px-4 py-3 lg:table-cell">{detailColumnLabel}</th>
                <th className="w-[120px] px-4 py-3">Status</th>
                <th className="hidden w-[140px] px-4 py-3 text-right xl:table-cell">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border-soft">
              {pageItems.map((item) => (
                <tr key={item.id} className="group transition-colors hover:bg-admin-hover/50">
                  <td className="px-0 py-0">
                    <Link href={item.href} className="block px-4 py-3.5 no-underline">
                      <ProjectCell item={item} />
                    </Link>
                  </td>
                  {showSegmentColumn ? (
                    <td className="hidden px-4 py-3.5 lg:table-cell">
                      <Link href={item.href} className="block capitalize no-underline">
                        {item.pills?.[0] ? (
                          <Badge tone={item.pills[0].tone === "accent" ? "accent" : "neutral"} className="capitalize">
                            {item.pills[0].label}
                          </Badge>
                        ) : (
                          <span className="text-admin-fg-subtle">—</span>
                        )}
                      </Link>
                    </td>
                  ) : null}
                  <td className="hidden px-4 py-3.5 lg:table-cell">
                    <Link href={item.href} className="flex items-center gap-1.5 text-admin-fg-muted no-underline">
                      {item.detail ? (
                        <>
                          <Building2 className="size-3.5 shrink-0 opacity-60" aria-hidden />
                          <span className="line-clamp-1">{item.detail}</span>
                        </>
                      ) : (
                        "—"
                      )}
                    </Link>
                  </td>
                  <td className="px-4 py-3.5">
                    <Link href={item.href} className="block no-underline">
                      <StatusBadge status={item.status} />
                    </Link>
                  </td>
                  <td className="hidden px-4 py-3.5 text-right xl:table-cell">
                    <Link href={item.href} className="block text-[12px] text-admin-fg-subtle no-underline">
                      {formatAdminDate(item.updatedAt)}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <div className={cn("grid w-full min-w-0 max-w-full gap-3", view === "grid" ? "md:grid-cols-2 xl:grid-cols-3" : "md:hidden")}>
        {pageItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group flex w-full min-w-0 max-w-full gap-3 overflow-hidden rounded-xl border border-admin-border bg-admin-surface p-3 no-underline transition-shadow hover:border-admin-border-strong hover:shadow-sm sm:p-4"
          >
            <ProjectThumb item={item} />
            <div className="min-w-0 flex-1 overflow-hidden space-y-2">
              <div className="min-w-0">
                <div className="flex min-w-0 items-start gap-1.5">
                  {item.featured ? (
                    <Star className="mt-0.5 size-3.5 shrink-0 fill-amber-400 text-amber-400" aria-hidden />
                  ) : null}
                  <p className="min-w-0 line-clamp-2 break-words text-[14px] font-medium leading-snug text-admin-fg group-hover:text-admin-accent">
                    {item.title}
                  </p>
                </div>
                {item.subtitle ? (
                  <p className="mt-0.5 truncate font-mono text-[11px] text-admin-fg-subtle">{item.subtitle}</p>
                ) : null}
              </div>
              <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                {item.pills?.map((pill) => (
                  <Badge key={pill.label} tone={pill.tone === "accent" ? "accent" : "neutral"} className="capitalize">
                    {pill.label}
                  </Badge>
                ))}
                <StatusBadge status={item.status} />
              </div>
              {item.detail ? (
                <p className="flex min-w-0 items-center gap-1 text-[12px] text-admin-fg-muted">
                  <Building2 className="size-3.5 shrink-0 opacity-60" aria-hidden />
                  <span className="min-w-0 truncate">{item.detail}</span>
                </p>
              ) : null}
              <p className="truncate text-[11px] text-admin-fg-subtle">Updated {formatAdminDate(item.updatedAt)}</p>
            </div>
          </Link>
        ))}
      </div>

      {sorted.length === 0 ? <ContentListEmpty title="No matches" description="Try changing your filters." /> : null}

      {sorted.length > 0 ? (
        <div className="flex flex-col gap-3 border-t border-admin-border-soft pt-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-admin-fg-subtle">
            Showing {rangeStart} to {rangeEnd} of {sorted.length} items
          </p>
          <div className="flex items-center gap-1 self-end sm:self-auto">
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              aria-label="Previous page"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="flex h-8 min-w-8 items-center justify-center rounded-md border border-admin-border bg-admin-surface px-2 text-[13px] font-medium text-admin-fg">
              {safePage}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              aria-label="Next page"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

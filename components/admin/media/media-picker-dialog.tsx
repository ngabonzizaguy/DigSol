"use client";

import { useState } from "react";
import { Button } from "@/components/admin/ui/button";
import type { MediaItem } from "@/lib/supabase/types";

type Item = MediaItem & { url: string };

export function MediaPickerDialog({
  items,
  onSelect,
}: {
  items: Item[];
  onSelect: (url: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const filtered = items.filter((item) => {
    if (!q.trim()) return true;
    const term = q.toLowerCase();
    return (
      item.path.toLowerCase().includes(term) ||
      (item.alt ?? "").toLowerCase().includes(term)
    );
  });

  return (
    <>
      <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
        Choose from library
      </Button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="flex max-h-[80vh] w-full max-w-lg flex-col rounded-xl border border-admin-border bg-admin-surface shadow-xl">
            <div className="flex items-center justify-between border-b border-admin-border-soft px-4 py-3">
              <h2 className="text-[14px] font-semibold text-admin-fg">Media library</h2>
              <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>
            <div className="border-b border-admin-border-soft px-4 py-2">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search…"
                className="h-8 w-full rounded-md border border-admin-border bg-admin-bg px-2 text-[12px]"
              />
            </div>
            <ul className="flex-1 overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <li className="px-2 py-6 text-center text-[12px] text-admin-fg-subtle">No matches</li>
              ) : (
                filtered.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-admin-hover"
                      onClick={() => {
                        onSelect(item.url);
                        setOpen(false);
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.url} alt="" className="size-10 rounded object-cover" />
                      <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-admin-fg-muted">
                        {item.path}
                      </span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}

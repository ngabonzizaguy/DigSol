"use client";

import { useEffect, useState } from "react";
import { listMediaForPicker, type MediaPickerItem } from "@/app/(admin)/admin/(protected)/media/actions";
import { MediaPickerDialog } from "@/components/admin/media/media-picker-dialog";
import { Input } from "@/components/admin/ui/input";
import { FormField } from "@/components/admin/ui/form-field";

export function CoverImageField({
  name = "cover_url",
  label = "Cover image",
  hint = "Pick from the media library or paste a URL.",
  value,
  onChange,
}: {
  name?: string;
  label?: string;
  hint?: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [items, setItems] = useState<MediaPickerItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listMediaForPicker()
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <FormField label={label} hint={hint}>
      <input type="hidden" name={name} value={value} />
      <div className="space-y-3">
        {value ? (
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-lg border border-admin-border-soft bg-admin-elevated">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="" className="size-full object-cover" />
          </div>
        ) : (
          <div className="flex aspect-[21/9] items-center justify-center rounded-lg border border-dashed border-admin-border bg-admin-elevated text-[12px] text-admin-fg-subtle">
            No cover selected
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://… or pick from library"
            className="min-w-0 flex-1"
          />
          {loading ? (
            <span className="text-[11px] text-admin-fg-subtle">Loading library…</span>
          ) : (
            <MediaPickerDialog items={items} onSelect={onChange} />
          )}
          {value ? (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-[12px] text-admin-fg-subtle underline-offset-2 hover:text-admin-fg hover:underline"
            >
              Clear
            </button>
          ) : null}
        </div>
      </div>
    </FormField>
  );
}

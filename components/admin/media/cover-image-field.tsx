"use client";

import { useEffect, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import {
  listMediaForPicker,
  recordMediaUpload,
  type MediaPickerItem,
} from "@/app/(admin)/admin/(protected)/media/actions";
import { getMediaPublicUrl } from "@/lib/admin/media";
import { MediaPickerDialog } from "@/components/admin/media/media-picker-dialog";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { FormField } from "@/components/admin/ui/form-field";

export function CoverImageField({
  name = "cover_url",
  label = "Cover image",
  hint = "Upload from your device, pick from the media library, or paste a URL.",
  value,
  onChange,
  variant = "cover",
}: {
  name?: string;
  label?: string;
  hint?: string;
  value: string;
  onChange: (url: string) => void;
  /** `avatar` uses a square preview; `cover` uses a wide banner. */
  variant?: "cover" | "avatar";
}) {
  const [items, setItems] = useState<MediaPickerItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAvatar = variant === "avatar";
  const emptyLabel = isAvatar ? "No image selected" : "No cover selected";

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

  async function handleDeviceUpload(files: FileList | null) {
    if (!files?.length) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }

    setUploading(true);
    try {
      const path = `${Date.now()}-${file.name.replace(/[^a-z0-9.-]/gi, "-")}`;
      const supabase = createClient();
      const { error } = await supabase.storage.from("media").upload(path, file, {
        cacheControl: "31536000",
        upsert: false,
      });
      if (error) throw new Error(error.message);

      await recordMediaUpload({ path, mime: file.type, bytes: file.size });
      onChange(getMediaPublicUrl(path));
      toast.success("Image uploaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <FormField label={label} hint={hint}>
      <input type="hidden" name={name} value={value} />
      <div className="space-y-3">
        {value ? (
          <div
            className={
              isAvatar
                ? "relative mx-auto size-28 overflow-hidden rounded-full border border-admin-border-soft bg-admin-elevated"
                : "relative aspect-[21/9] w-full overflow-hidden rounded-lg border border-admin-border-soft bg-admin-elevated"
            }
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="" className="size-full object-cover" />
          </div>
        ) : (
          <div
            className={
              isAvatar
                ? "mx-auto flex size-28 items-center justify-center rounded-full border border-dashed border-admin-border bg-admin-elevated px-3 text-center text-[11px] text-admin-fg-subtle"
                : "flex aspect-[21/9] items-center justify-center rounded-lg border border-dashed border-admin-border bg-admin-elevated text-[12px] text-admin-fg-subtle"
            }
          >
            {emptyLabel}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => void handleDeviceUpload(e.target.files)}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="size-3.5" />
            {uploading ? "Uploading…" : "Upload from device"}
          </Button>
          {loading ? (
            <span className="text-[11px] text-admin-fg-subtle">Loading library…</span>
          ) : (
            <MediaPickerDialog items={items} onSelect={onChange} />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://… or pick from library"
            className="min-w-0 flex-1"
          />
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

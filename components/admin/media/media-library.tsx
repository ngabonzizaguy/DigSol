"use client";

import { useState, useTransition, useRef } from "react";
import { Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { recordMediaUpload, updateMediaAlt, deleteMedia } from "@/app/(admin)/admin/(protected)/media/actions";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { EmptyState } from "@/components/admin/ui/empty-state";
import { Card } from "@/components/admin/ui/card";
import type { MediaItem } from "@/lib/supabase/types";

type Item = MediaItem & { url: string };

export function MediaLibrary({ items }: { items: Item[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    const supabase = createClient();
    let success = 0;
    for (const file of Array.from(files)) {
      const path = `${Date.now()}-${file.name.replace(/[^a-z0-9.-]/gi, "-")}`;
      const { error } = await supabase.storage.from("media").upload(path, file, {
        cacheControl: "31536000",
        upsert: false,
      });
      if (error) {
        toast.error(`${file.name}: ${error.message}`);
        continue;
      }
      try {
        await recordMediaUpload({ path, mime: file.type, bytes: file.size });
        success++;
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to record");
      }
    }
    setUploading(false);
    if (success > 0) {
      toast.success(`Uploaded ${success} file${success === 1 ? "" : "s"}`);
      router.refresh();
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleAlt(id: string, alt: string) {
    startTransition(async () => {
      try {
        await updateMediaAlt(id, alt);
        toast.success("Alt text saved");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed");
      }
    });
  }

  function handleDelete(id: string, path: string) {
    if (!confirm("Delete this asset? This cannot be undone.")) return;
    startTransition(async () => {
      try {
        await deleteMedia(id, path);
        toast.success("Deleted");
        router.refresh();
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed");
      }
    });
  }

  return (
    <div className="space-y-4">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-[20px] font-semibold tracking-tight text-admin-fg">Media library</h1>
          <p className="text-[13px] text-admin-fg-subtle">Upload images and assets used across the site.</p>
        </div>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
          />
          <Button
            variant="primary"
            size="sm"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="size-3.5" />
            {uploading ? "Uploading…" : "Upload"}
          </Button>
        </div>
      </header>

      {items.length === 0 ? (
        <EmptyState
          title="No media yet"
          description="Drop images here or use the upload button. Files go to Supabase Storage."
          action={
            <Button variant="primary" size="sm" onClick={() => inputRef.current?.click()}>
              <Upload className="size-3.5" /> Upload
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((m) => (
            <Card key={m.id} className="overflow-hidden">
              <div className="aspect-square w-full overflow-hidden bg-admin-elevated">
                {m.mime.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.url} alt={m.alt ?? ""} className="size-full object-cover" />
                ) : (
                  <div className="grid size-full place-items-center text-[12px] text-admin-fg-subtle">{m.mime}</div>
                )}
              </div>
              <div className="space-y-2 p-2">
                <Input
                  defaultValue={m.alt ?? ""}
                  placeholder="Alt text"
                  className="h-7 text-[12px]"
                  onBlur={(e) => {
                    if (e.target.value !== (m.alt ?? "")) handleAlt(m.id, e.target.value);
                  }}
                />
                <div className="flex items-center justify-between text-[10px] text-admin-fg-subtle">
                  <span className="font-mono">{Math.round(m.bytes / 1024)}kb</span>
                  <button
                    onClick={() => handleDelete(m.id, m.path)}
                    disabled={pending}
                    className="rounded p-1 hover:bg-admin-hover hover:text-error"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

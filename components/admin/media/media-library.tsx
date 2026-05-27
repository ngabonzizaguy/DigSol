"use client";

import { useState, useTransition, useRef } from "react";
import { Upload, Trash2, LayoutGrid, List, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { recordMediaUpload, updateMediaAlt, deleteMedia } from "@/app/(admin)/admin/(protected)/media/actions";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { EmptyState } from "@/components/admin/ui/empty-state";
import { Card } from "@/components/admin/ui/card";
import { MediaEditorDialog } from "@/components/admin/media/media-editor-dialog";
import type { MediaItem } from "@/lib/supabase/types";

type Item = MediaItem & { url: string };

export function MediaLibrary({ items }: { items: Item[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [editing, setEditing] = useState<Item | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = items.filter((m) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return m.path.toLowerCase().includes(q) || (m.alt ?? "").toLowerCase().includes(q);
  });

  function copyUrl(url: string) {
    void navigator.clipboard.writeText(url).then(() => toast.success("URL copied"));
  }

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

      {items.length > 0 ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by path or alt text…"
            className="max-w-md"
          />
          <div className="flex items-center gap-2 text-[12px] text-admin-fg-subtle">
            <span>
              {filtered.length} of {items.length} assets
            </span>
            <div className="flex rounded-md border border-admin-border-soft p-0.5">
              <button
                type="button"
                aria-label="Grid view"
                onClick={() => setView("grid")}
                className={`rounded p-1.5 ${view === "grid" ? "bg-admin-hover text-admin-fg" : "text-admin-fg-muted"}`}
              >
                <LayoutGrid className="size-3.5" />
              </button>
              <button
                type="button"
                aria-label="List view"
                onClick={() => setView("list")}
                className={`rounded p-1.5 ${view === "list" ? "bg-admin-hover text-admin-fg" : "text-admin-fg-muted"}`}
              >
                <List className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : null}

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
      ) : filtered.length === 0 ? (
        <p className="py-12 text-center text-[13px] text-admin-fg-subtle">No assets match your search.</p>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((m) => (
            <Card key={m.id} className="overflow-hidden transition-shadow hover:shadow-md">
              <div className="aspect-square w-full overflow-hidden bg-admin-elevated">
                {m.mime.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.url} alt={m.alt ?? ""} className="size-full object-cover" />
                ) : (
                  <div className="grid size-full place-items-center text-[12px] text-admin-fg-subtle">{m.mime}</div>
                )}
              </div>
              <div className="space-y-2 p-2.5">
                <Input
                  defaultValue={m.alt ?? ""}
                  placeholder="Alt text"
                  className="h-7 text-[12px]"
                  onBlur={(e) => {
                    if (e.target.value !== (m.alt ?? "")) handleAlt(m.id, e.target.value);
                  }}
                />
                <div className="flex items-center justify-between gap-1 text-[10px] text-admin-fg-subtle">
                  <span className="truncate font-mono">{Math.round(m.bytes / 1024)}kb</span>
                  <div className="flex shrink-0 gap-0.5">
                    <button
                      type="button"
                      onClick={() => copyUrl(m.url)}
                      className="rounded px-1.5 py-0.5 font-medium hover:bg-admin-hover hover:text-admin-fg"
                    >
                      Copy
                    </button>
                    {m.mime.startsWith("image/") ? (
                      <button
                        type="button"
                        onClick={() => setEditing(m)}
                        className="rounded p-1 hover:bg-admin-hover hover:text-admin-fg"
                        aria-label="Edit image"
                      >
                        <Pencil className="size-3" />
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => handleDelete(m.id, m.path)}
                      disabled={pending}
                      className="rounded p-1 hover:bg-admin-hover hover:text-error"
                      aria-label="Delete"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <ul className="divide-y divide-admin-border-soft rounded-xl border border-admin-border bg-admin-surface">
          {filtered.map((m) => (
            <li key={m.id} className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
              <div className="size-14 shrink-0 overflow-hidden rounded-md bg-admin-elevated">
                {m.mime.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.url} alt="" className="size-full object-cover" />
                ) : (
                  <div className="grid size-full place-items-center text-[10px]">{m.mime.split("/")[1]}</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-mono text-[11px] text-admin-fg-muted">{m.path}</p>
                <Input
                  defaultValue={m.alt ?? ""}
                  placeholder="Alt text"
                  className="mt-1.5 h-7 text-[12px]"
                  onBlur={(e) => {
                    if (e.target.value !== (m.alt ?? "")) handleAlt(m.id, e.target.value);
                  }}
                />
              </div>
              <div className="flex shrink-0 gap-2">
                <Button type="button" variant="outline" size="xs" onClick={() => copyUrl(m.url)}>
                  Copy URL
                </Button>
                {m.mime.startsWith("image/") ? (
                  <Button type="button" variant="outline" size="xs" onClick={() => setEditing(m)}>
                    <Pencil className="size-3.5" /> Edit
                  </Button>
                ) : null}
                <Button type="button" variant="danger" size="icon" disabled={pending} onClick={() => handleDelete(m.id, m.path)}>
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing ? <MediaEditorDialog item={editing} onClose={() => setEditing(null)} /> : null}
    </div>
  );
}

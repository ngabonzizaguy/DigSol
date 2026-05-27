"use client";



import { useEffect, useRef, useState } from "react";

import { ArrowDown, ArrowUp, Plus, Trash2, Upload } from "lucide-react";

import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";

import {

  listMediaForPicker,

  recordMediaUpload,

  type MediaPickerItem,

} from "@/app/(admin)/admin/(protected)/media/actions";

import { getMediaPublicUrl } from "@/lib/admin/media";

import { MediaPickerDialog } from "@/components/admin/media/media-picker-dialog";

import { Input } from "@/components/admin/ui/input";

import { Button } from "@/components/admin/ui/button";

import type { CaseStudyMediaItem } from "@/lib/supabase/types";



export function GalleryField({

  value,

  onChange,

}: {

  value: CaseStudyMediaItem[];

  onChange: (next: CaseStudyMediaItem[]) => void;

}) {

  const [items, setItems] = useState<MediaPickerItem[]>([]);

  const [loading, setLoading] = useState(false);

  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);



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



  function addFromUrl(url: string, mime?: string) {

    const picked = items.find((m) => m.url === url);

    onChange([

      ...value,

      {

        url,

        mime: mime ?? picked?.mime,

        alt: picked?.alt ?? undefined,

      },

    ]);

  }



  async function handleDeviceUpload(files: FileList | null) {

    if (!files?.length) return;

    const file = files[0];

    const isImage = file.type.startsWith("image/");

    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {

      toast.error("Choose an image or video file.");

      return;

    }



    setUploading(true);

    try {

      const path = `${Date.now()}-${file.name.replace(/[^a-z0-9.-]/gi, "-")}`;

      const supabase = createClient();

      const { error } = await supabase.storage.from("media").upload(path, file, {

        cacheControl: "31536000",

        upsert: false,

        contentType: file.type || undefined,

      });

      if (error) throw new Error(error.message);



      const row = await recordMediaUpload({ path, mime: file.type, bytes: file.size });

      const url = getMediaPublicUrl(path);

      setItems((prev) => [{ ...row, url }, ...prev]);

      addFromUrl(url, file.type);

      toast.success(isVideo ? "Video uploaded" : "Image uploaded");

    } catch (e) {

      toast.error(e instanceof Error ? e.message : "Upload failed");

    } finally {

      setUploading(false);

      if (fileInputRef.current) fileInputRef.current.value = "";

    }

  }



  function update(index: number, patch: Partial<CaseStudyMediaItem>) {

    onChange(value.map((m, i) => (i === index ? { ...m, ...patch } : m)));

  }



  function remove(index: number) {

    onChange(value.filter((_, i) => i !== index));

  }



  function move(index: number, dir: -1 | 1) {

    const target = index + dir;

    if (target < 0 || target >= value.length) return;

    const next = [...value];

    [next[index], next[target]] = [next[target], next[index]];

    onChange(next);

  }



  return (

    <div className="space-y-3">

      <p className="text-[12px] text-admin-fg-subtle">

        Add images or short videos that showcase the project. Upload from your device or pick from the media library.

      </p>



      {value.length === 0 ? (

        <div className="rounded-lg border border-dashed border-admin-border bg-admin-elevated p-6 text-center text-[12px] text-admin-fg-subtle">

          No gallery items yet.

        </div>

      ) : (

        <ul className="space-y-2">

          {value.map((m, i) => {

            const isVideo = (m.mime ?? "").startsWith("video/") || /\.(mp4|webm|mov|ogg)$/i.test(m.url);

            return (

              <li key={`${m.url}-${i}`} className="flex gap-3 rounded-lg border border-admin-border-soft bg-admin-surface p-2">

                <div className="size-20 shrink-0 overflow-hidden rounded-md bg-admin-elevated">

                  {isVideo ? (

                    <video src={m.url} muted playsInline className="size-full object-cover" />

                  ) : (

                    // eslint-disable-next-line @next/next/no-img-element

                    <img src={m.url} alt={m.alt ?? ""} className="size-full object-cover" />

                  )}

                </div>

                <div className="grid min-w-0 flex-1 gap-1.5">

                  <Input

                    value={m.alt ?? ""}

                    onChange={(e) => update(i, { alt: e.target.value })}

                    placeholder="Alt text"

                    className="h-7 text-[12px]"

                  />

                  <Input

                    value={m.caption ?? ""}

                    onChange={(e) => update(i, { caption: e.target.value })}

                    placeholder="Caption (optional)"

                    className="h-7 text-[12px]"

                  />

                  <p className="truncate font-mono text-[10px] text-admin-fg-subtle">{m.url}</p>

                </div>

                <div className="flex flex-col items-center gap-1">

                  <Button type="button" variant="ghost" size="icon" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">

                    <ArrowUp className="size-3.5" />

                  </Button>

                  <Button type="button" variant="ghost" size="icon" onClick={() => move(i, 1)} disabled={i === value.length - 1} aria-label="Move down">

                    <ArrowDown className="size-3.5" />

                  </Button>

                  <Button type="button" variant="danger" size="icon" onClick={() => remove(i)} aria-label="Remove">

                    <Trash2 className="size-3.5" />

                  </Button>

                </div>

              </li>

            );

          })}

        </ul>

      )}



      <div className="flex flex-wrap items-center gap-2">

        <input

          ref={fileInputRef}

          type="file"

          accept="image/*,video/*"

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

          <MediaPickerDialog items={items} onSelect={(url) => addFromUrl(url)} />

        )}

        <span className="text-[11px] text-admin-fg-subtle">

          <Plus className="-mt-0.5 mr-0.5 inline size-3" />

          Images or short videos (MP4, WebM).

        </span>

      </div>

    </div>

  );

}



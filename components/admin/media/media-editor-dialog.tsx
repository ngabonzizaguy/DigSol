"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { RotateCw, X } from "lucide-react";
import { Button } from "@/components/admin/ui/button";
import { createClient } from "@/lib/supabase/client";
import { replaceMediaFile } from "@/app/(admin)/admin/(protected)/media/actions";
import type { MediaItem } from "@/lib/supabase/types";

type Item = MediaItem & { url: string };

type CropRect = { x: number; y: number; w: number; h: number };

export function MediaEditorDialog({ item, onClose }: { item: Item; onClose: () => void }) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [natural, setNatural] = useState({ w: 0, h: 0 });
  const [rotation, setRotation] = useState<0 | 90 | 180 | 270>(0);
  const [crop, setCrop] = useState<CropRect | null>(null);
  const [dragging, setDragging] = useState<null | { startX: number; startY: number }>(null);
  const [saving, setSaving] = useState(false);

  // Initialize crop to full image once it loads.
  useEffect(() => {
    if (!imgLoaded || !imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    setCrop({ x: 0, y: 0, w: rect.width, h: rect.height });
  }, [imgLoaded]);

  function handleImgLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const el = e.currentTarget;
    setNatural({ w: el.naturalWidth, h: el.naturalHeight });
    setImgLoaded(true);
  }

  function startDrag(e: React.PointerEvent) {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
    setDragging({ startX: x, startY: y });
    setCrop({ x, y, w: 0, h: 0 });
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function moveDrag(e: React.PointerEvent) {
    if (!dragging || !imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
    const nx = Math.min(dragging.startX, x);
    const ny = Math.min(dragging.startY, y);
    const nw = Math.abs(x - dragging.startX);
    const nh = Math.abs(y - dragging.startY);
    setCrop({ x: nx, y: ny, w: nw, h: nh });
  }

  function endDrag(e: React.PointerEvent) {
    setDragging(null);
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
  }

  function rotate() {
    setRotation((r) => (((r + 90) % 360) as 0 | 90 | 180 | 270));
  }

  function resetCrop() {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    setCrop({ x: 0, y: 0, w: rect.width, h: rect.height });
  }

  async function handleSave() {
    if (!imgRef.current || !crop || crop.w < 4 || crop.h < 4) {
      toast.error("Select a crop area first");
      return;
    }
    setSaving(true);
    try {
      const rect = imgRef.current.getBoundingClientRect();
      const scaleX = natural.w / rect.width;
      const scaleY = natural.h / rect.height;
      const sx = crop.x * scaleX;
      const sy = crop.y * scaleY;
      const sw = crop.w * scaleX;
      const sh = crop.h * scaleY;

      const blob = await drawCropToBlob({
        image: imgRef.current,
        sx,
        sy,
        sw,
        sh,
        rotation,
        mime: item.mime,
      });

      const ext = inferExtension(item.path, item.mime);
      const stem = stripPathExt(item.path);
      const newPath = `${stem}-edited-${Date.now()}.${ext}`;
      const supabase = createClient();
      const file = new File([blob], newPath, { type: blob.type });
      const { error: uploadErr } = await supabase.storage
        .from("media")
        .upload(newPath, file, { cacheControl: "31536000", upsert: false });
      if (uploadErr) throw new Error(uploadErr.message);

      // Compute new natural dimensions (after rotation).
      const swapped = rotation === 90 || rotation === 270;
      const outW = Math.round(swapped ? sh : sw);
      const outH = Math.round(swapped ? sw : sh);

      await replaceMediaFile({
        id: item.id,
        oldPath: item.path,
        newPath,
        mime: blob.type,
        bytes: blob.size,
        width: outW,
        height: outH,
      });

      toast.success("Image saved");
      router.refresh();
      onClose();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-xl border border-admin-border bg-admin-surface shadow-xl">
        <div className="flex items-center justify-between border-b border-admin-border-soft px-4 py-3">
          <h2 className="text-[14px] font-semibold text-admin-fg">Edit image</h2>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X className="size-4" />
          </Button>
        </div>

        <div ref={containerRef} className="flex flex-1 items-center justify-center overflow-auto bg-admin-elevated p-4">
          <div className="relative inline-block select-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={item.url}
              alt={item.alt ?? ""}
              onLoad={handleImgLoad}
              draggable={false}
              style={{
                transform: `rotate(${rotation}deg)`,
                maxHeight: "60vh",
                maxWidth: "100%",
                display: "block",
              }}
            />
            {imgLoaded ? (
              <div
                className="absolute inset-0 cursor-crosshair touch-none"
                onPointerDown={startDrag}
                onPointerMove={moveDrag}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
              >
                {crop && crop.w > 0 && crop.h > 0 ? (
                  <div
                    className="pointer-events-none absolute border-2 border-admin-accent bg-admin-accent/10"
                    style={{ left: crop.x, top: crop.y, width: crop.w, height: crop.h }}
                  />
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-admin-border-soft px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={rotate}>
              <RotateCw className="size-3.5" /> Rotate 90°
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={resetCrop}>
              Reset crop
            </Button>
            <span className="text-[11px] text-admin-fg-subtle">
              Drag on the image to set a crop area. {rotation > 0 ? `Rotated ${rotation}°.` : null}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="button" variant="primary" size="sm" onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

async function drawCropToBlob(opts: {
  image: HTMLImageElement;
  sx: number;
  sy: number;
  sw: number;
  sh: number;
  rotation: 0 | 90 | 180 | 270;
  mime: string;
}): Promise<Blob> {
  const { image, sx, sy, sw, sh, rotation, mime } = opts;
  const canvas = document.createElement("canvas");
  const swapped = rotation === 90 || rotation === 270;
  canvas.width = Math.round(swapped ? sh : sw);
  canvas.height = Math.round(swapped ? sw : sh);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.drawImage(image, sx, sy, sw, sh, -sw / 2, -sh / 2, sw, sh);

  const outputMime = mime === "image/png" ? "image/png" : "image/jpeg";
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Could not encode image"))),
      outputMime,
      0.92
    );
  });
}

function inferExtension(path: string, mime: string): string {
  const fromMime = mime.split("/")[1];
  if (fromMime) return fromMime.replace("jpeg", "jpg");
  const m = /\.([a-z0-9]+)$/i.exec(path);
  return m ? m[1] : "jpg";
}

function stripPathExt(path: string): string {
  return path.replace(/\.[a-z0-9]+$/i, "");
}

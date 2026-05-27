"use client";

import * as React from "react";
import { UploadCloud, X, FileText, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const IMAGE_MIME = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"]);
const DOC_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "text/csv",
]);

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_DOC_BYTES = 25 * 1024 * 1024; // 25 MB
const MAX_FILES = 8;

export type DroppedFile = {
  id: string;
  file: File;
  kind: "image" | "document";
  previewUrl?: string;
};

export interface FileDropzoneProps {
  files: DroppedFile[];
  onChange: (files: DroppedFile[]) => void;
  className?: string;
  disabled?: boolean;
}

function classify(file: File): { kind: "image" | "document"; ok: boolean; error?: string } {
  if (IMAGE_MIME.has(file.type)) {
    if (file.size > MAX_IMAGE_BYTES) return { kind: "image", ok: false, error: "Image larger than 10 MB" };
    return { kind: "image", ok: true };
  }
  if (DOC_MIME.has(file.type)) {
    if (file.size > MAX_DOC_BYTES) return { kind: "document", ok: false, error: "Document larger than 25 MB" };
    return { kind: "document", ok: true };
  }
  return { kind: "document", ok: false, error: "Unsupported file type" };
}

export function FileDropzone({ files, onChange, className, disabled }: FileDropzoneProps) {
  const [dragOver, setDragOver] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const accept = React.useCallback(
    (incoming: FileList | File[]) => {
      const list = Array.from(incoming);
      const remaining = MAX_FILES - files.length;
      if (remaining <= 0) {
        setError(`Limit reached (${MAX_FILES} files max)`);
        return;
      }
      const next: DroppedFile[] = [...files];
      const errors: string[] = [];
      for (const file of list.slice(0, remaining)) {
        const c = classify(file);
        if (!c.ok) {
          errors.push(`${file.name}: ${c.error}`);
          continue;
        }
        const entry: DroppedFile = {
          id: `${file.name}-${file.size}-${file.lastModified}`,
          file,
          kind: c.kind,
        };
        if (c.kind === "image") {
          entry.previewUrl = URL.createObjectURL(file);
        }
        next.push(entry);
      }
      setError(errors[0] ?? null);
      onChange(next);
    },
    [files, onChange],
  );

  const remove = (id: string) => {
    const target = files.find((f) => f.id === id);
    if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
    onChange(files.filter((f) => f.id !== id));
  };

  React.useEffect(() => {
    return () => {
      // Clean up object URLs on unmount.
      files.forEach((f) => f.previewUrl && URL.revokeObjectURL(f.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cn("space-y-3", className)}>
      <div
        role="button"
        tabIndex={0}
        aria-disabled={disabled}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (!disabled && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (disabled) return;
          if (e.dataTransfer?.files?.length) accept(e.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed bg-surface-card px-6 py-8 text-center transition-colors",
          dragOver ? "border-ink bg-surface-strong" : "border-hairline-strong hover:border-hairline-strong/80",
          disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        <UploadCloud className="h-6 w-6 text-muted" aria-hidden />
        <p className="text-[15px] text-ink">Drop files here or click to upload</p>
        <p className="text-[13px] text-muted">PNG, JPG, PDF, DOC, XLS — up to 10 MB images / 25 MB docs</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          accept={[...IMAGE_MIME, ...DOC_MIME].join(",")}
          onChange={(e) => e.target.files && accept(e.target.files)}
        />
      </div>
      {error ? <p className="text-sm text-error">{error}</p> : null}
      {files.length > 0 ? (
        <ul className="grid gap-2 sm:grid-cols-2">
          {files.map((f) => (
            <li
              key={f.id}
              className="flex items-center gap-3 rounded-xl border border-hairline bg-surface-card p-2 pr-3"
            >
              {f.kind === "image" && f.previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={f.previewUrl} alt={f.file.name} className="h-10 w-10 rounded-lg object-cover" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-strong">
                  {f.kind === "image" ? (
                    <ImageIcon className="h-4 w-4 text-muted" aria-hidden />
                  ) : (
                    <FileText className="h-4 w-4 text-muted" aria-hidden />
                  )}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] text-ink">{f.file.name}</p>
                <p className="text-[12px] text-muted">{(f.file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button
                type="button"
                onClick={() => remove(f.id)}
                aria-label={`Remove ${f.file.name}`}
                className="rounded-full p-1.5 text-muted hover:bg-surface-strong hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

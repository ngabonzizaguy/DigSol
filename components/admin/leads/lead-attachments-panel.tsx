import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Download, FileText, Image as ImageIcon, Link2, Mic } from "lucide-react";
import type { LeadAttachment } from "@/lib/supabase/types";

export interface LeadAttachmentsPanelProps {
  attachments: (LeadAttachment & { signedUrl?: string | null })[];
  /** When true, show the card even if empty (Quick Start leads). */
  showForQuickStart?: boolean;
}

function formatBytes(n: number | null): string {
  if (!n) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

function formatDuration(ms: number | null): string {
  if (!ms) return "";
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = (total % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function normalizeLinkHref(url: string): string {
  const t = url.trim();
  if (/^https?:\/\//i.test(t)) return t;
  return `https://${t}`;
}

export function LeadAttachmentsPanel({ attachments, showForQuickStart }: LeadAttachmentsPanelProps) {
  if (attachments.length === 0 && !showForQuickStart) return null;

  const voice = attachments.filter((a) => a.kind === "voice");
  const images = attachments.filter((a) => a.kind === "image");
  const docs = attachments.filter((a) => a.kind === "document");
  const links = attachments.filter((a) => a.kind === "link");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attachments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {attachments.length === 0 ? (
          <p className="text-[12px] text-admin-fg-subtle">
            No files or voice notes on this submission. Links from the form appear below when present. Uploads from
            before 2026-05-27 were not stored — submit a new Quick Start test to verify documents and voice notes.
          </p>
        ) : null}

        {voice.length > 0 ? (
          <div className="space-y-2">
            <h4 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-admin-fg-subtle">
              <Mic className="size-3" /> Voice notes
            </h4>
            {voice.map((v) => (
              <div key={v.id} className="rounded-md border border-admin-border bg-admin-elevated p-2">
                {v.signedUrl ? (
                  <>
                    <audio controls className="w-full" preload="metadata" src={v.signedUrl} />
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <p className="text-[11px] text-admin-fg-subtle">
                        {formatDuration(v.duration_ms)} · {formatBytes(v.size_bytes)} · {v.mime}
                      </p>
                      <a
                        href={v.signedUrl}
                        download={v.original_name ?? "voice-note.webm"}
                        className="inline-flex items-center gap-1 text-[12px] text-admin-fg underline-offset-4 hover:underline"
                      >
                        <Download className="size-3" />
                        Download
                      </a>
                    </div>
                  </>
                ) : (
                  <p className="text-[12px] text-admin-fg-subtle">Could not generate signed URL.</p>
                )}
              </div>
            ))}
          </div>
        ) : null}

        {images.length > 0 ? (
          <div className="space-y-2">
            <h4 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-admin-fg-subtle">
              <ImageIcon className="size-3" /> Images
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {images.map((img) =>
                img.signedUrl ? (
                  <div key={img.id} className="space-y-1">
                    <a
                      href={img.signedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative block overflow-hidden rounded-md border border-admin-border"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.signedUrl}
                        alt={img.original_name ?? "Attachment"}
                        className="aspect-square h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </a>
                    <a
                      href={img.signedUrl}
                      download={img.original_name ?? "image"}
                      className="inline-flex items-center gap-1 text-[11px] text-admin-fg underline-offset-4 hover:underline"
                    >
                      <Download className="size-3" />
                      Download
                    </a>
                  </div>
                ) : (
                  <div
                    key={img.id}
                    className="aspect-square rounded-md border border-admin-border bg-admin-elevated p-2 text-[11px] text-admin-fg-subtle"
                  >
                    {img.original_name}
                  </div>
                ),
              )}
            </div>
          </div>
        ) : null}

        {docs.length > 0 ? (
          <div className="space-y-2">
            <h4 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-admin-fg-subtle">
              <FileText className="size-3" /> Documents
            </h4>
            <ul className="space-y-1">
              {docs.map((d) => (
                <li
                  key={d.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-admin-border bg-admin-elevated px-2 py-1.5"
                >
                  <span className="min-w-0 truncate text-[12px] text-admin-fg">{d.original_name}</span>
                  <span className="shrink-0 text-[11px] text-admin-fg-subtle">{formatBytes(d.size_bytes)}</span>
                  {d.signedUrl ? (
                    <a
                      href={d.signedUrl}
                      download={d.original_name ?? "document"}
                      className="inline-flex shrink-0 items-center gap-1 text-[12px] text-admin-fg underline-offset-4 hover:underline"
                    >
                      <Download className="size-3" />
                      Download
                    </a>
                  ) : (
                    <span className="text-[11px] text-admin-fg-subtle">Unavailable</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {links.length > 0 ? (
          <div className="space-y-2">
            <h4 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-admin-fg-subtle">
              <Link2 className="size-3" /> Links
            </h4>
            <ul className="space-y-1">
              {links.map((l) => (
                <li key={l.id}>
                  <a
                    href={l.url ? normalizeLinkHref(l.url) : "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-[12px] text-admin-fg underline-offset-4 hover:underline"
                  >
                    {l.url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

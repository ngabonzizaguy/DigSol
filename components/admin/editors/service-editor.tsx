"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { EditorFormHeader } from "@/components/admin/editors/editor-form-header";
import { upsertService, deleteService, publishService, unpublishService } from "@/app/(admin)/admin/(protected)/services/actions";
import { Button } from "@/components/admin/ui/button";
import { Input, Textarea } from "@/components/admin/ui/input";
import { FormField } from "@/components/admin/ui/form-field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { StickySaveBar } from "@/components/admin/ui/sticky-save-bar";
import { slugify } from "@/lib/admin/slugify";
import type { Service, OrbColor, ContentStatus } from "@/lib/supabase/types";

const ORBS: OrbColor[] = ["mint", "peach", "lavender", "sky", "rose"];

type EditorProps =
  | { mode: "create"; initial?: undefined }
  | { mode: "edit"; initial: Service };

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button variant="primary" size="sm" type="submit" disabled={pending}>
      {pending ? "Saving…" : "Save"}
    </Button>
  );
}

export function ServiceEditor(props: EditorProps) {
  const router = useRouter();
  const isEdit = props.mode === "edit";
  const init = isEdit ? props.initial : undefined;

  const [title, setTitle] = useState(init?.title ?? "");
  const [slug, setSlug] = useState(init?.slug ?? "");
  const [short, setShort] = useState(init?.short ?? "");
  const [long, setLong] = useState(init?.long ?? "");
  const [outcomes, setOutcomes] = useState((init?.outcomes ?? []).join("\n"));
  const [deliverables, setDeliverables] = useState((init?.deliverables ?? []).join("\n"));
  const [capabilities, setCapabilities] = useState((init?.capabilities ?? []).join("\n"));
  const [orb, setOrb] = useState<OrbColor>(init?.orb ?? "lavender");
  const [status, setStatus] = useState<ContentStatus>(init?.status ?? "draft");
  const [sortOrder, setSortOrder] = useState(init?.sort_order ?? 0);

  const [state, action] = useActionState(upsertService, null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (state?.ok) {
      toast.success(isEdit ? "Service updated" : "Service created");
      if (!isEdit) router.push(`/admin/services/${state.slug}`);
    } else if (state && !state.ok) {
      toast.error(state.error);
    }
  }, [state, isEdit, router]);

  function handleDelete() {
    if (!init) return;
    if (!confirm(`Delete "${init.title}"? This cannot be undone.`)) return;
    startTransition(async () => {
      try {
        await deleteService(init.id);
        toast.success("Service deleted");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to delete");
      }
    });
  }

  function handleTogglePublish() {
    if (!init) return;
    const currentStatus = init.status;
    const currentId = init.id;
    startTransition(async () => {
      try {
        if (currentStatus === "published") {
          await unpublishService(currentId);
          toast.success("Unpublished");
        } else {
          await publishService(currentId);
          toast.success("Published");
        }
        router.refresh();
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed");
      }
    });
  }

  const errors = state && !state.ok ? state.fieldErrors ?? {} : {};

  return (
    <form action={action} className="space-y-4 pb-24">
      {init?.id ? <input type="hidden" name="id" value={init.id} /> : null}

      <EditorFormHeader
        backHref="/admin/services"
        backLabel="Services"
        title={isEdit ? title || init?.title || "Service" : "New service"}
        status={init?.status}
        actions={
          <>
            {isEdit && init ? (
              <>
                <Button type="button" variant="ghost" size="sm" onClick={handleTogglePublish} disabled={pending}>
                  {init.status === "published" ? "Unpublish" : "Publish"}
                </Button>
                <Button type="button" variant="danger" size="icon" onClick={handleDelete} disabled={pending}>
                  <Trash2 className="size-3.5" />
                </Button>
              </>
            ) : null}
            <SaveButton />
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField label="Title" required error={errors.title?.[0]}>
                <Input
                  name="title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!isEdit) setSlug(slugify(e.target.value));
                  }}
                />
              </FormField>

              <FormField label="Slug" required hint="URL path under /solutions/" error={errors.slug?.[0]}>
                <Input name="slug" value={slug} onChange={(e) => setSlug(slugify(e.target.value))} />
              </FormField>

              <FormField label="Short summary" required hint="Shown on listing cards" error={errors.short?.[0]}>
                <Input name="short" value={short} onChange={(e) => setShort(e.target.value)} maxLength={280} />
              </FormField>

              <FormField label="Long description" required error={errors.long?.[0]}>
                <Textarea name="long" value={long} onChange={(e) => setLong(e.target.value)} rows={5} />
              </FormField>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Outcomes, deliverables & capabilities</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-3">
              <FormField label="Outcomes" hint="One per line">
                <Textarea name="outcomes" value={outcomes} onChange={(e) => setOutcomes(e.target.value)} rows={6} />
              </FormField>
              <FormField label="Deliverables" hint="One per line">
                <Textarea name="deliverables" value={deliverables} onChange={(e) => setDeliverables(e.target.value)} rows={6} />
              </FormField>
              <FormField label="Capabilities" hint="One per line">
                <Textarea name="capabilities" value={capabilities} onChange={(e) => setCapabilities(e.target.value)} rows={6} />
              </FormField>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Publish</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <FormField label="Status">
                <select
                  name="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ContentStatus)}
                  className="flex h-9 w-full rounded-md border border-admin-border bg-admin-surface px-3 text-[13px] text-admin-fg"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </FormField>
              <FormField label="Sort order" hint="Lower numbers appear first">
                <Input
                  type="number"
                  name="sort_order"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                />
              </FormField>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Visual</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField label="Orb color" hint="Background accent on the service page hero">
                <div className="grid grid-cols-5 gap-2">
                  {ORBS.map((o) => (
                    <button
                      key={o}
                      type="button"
                      onClick={() => setOrb(o)}
                      className={`group h-9 rounded-md border-2 transition-all ${
                        orb === o ? "border-admin-fg" : "border-admin-border hover:border-admin-fg-muted"
                      }`}
                      style={{ background: orbHex(o) }}
                      aria-label={o}
                    >
                      <span className="sr-only">{o}</span>
                    </button>
                  ))}
                </div>
                <input type="hidden" name="orb" value={orb} />
              </FormField>
            </CardContent>
          </Card>
        </div>
      </div>

      <StickySaveBar visible={false} onSave={() => {}} />
    </form>
  );
}

function orbHex(c: OrbColor): string {
  switch (c) {
    case "mint":
      return "#a7e5d3";
    case "peach":
      return "#f4c5a8";
    case "lavender":
      return "#c8b8e0";
    case "sky":
      return "#a8c8e8";
    case "rose":
      return "#e8b8c4";
  }
}

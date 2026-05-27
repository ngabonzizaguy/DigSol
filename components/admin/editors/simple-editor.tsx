"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/admin/ui/button";
import { Input, Textarea } from "@/components/admin/ui/input";
import { FormField } from "@/components/admin/ui/form-field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { StatusBadge } from "@/components/admin/ui/badge";
import { slugify } from "@/lib/admin/slugify";
import { CoverImageField } from "@/components/admin/media/cover-image-field";
import type { GenericActionResult } from "@/lib/admin/generic-actions";

export type FieldDef =
  | { name: string; label: string; type: "text" | "email" | "url" | "number"; required?: boolean; hint?: string; maxLength?: number; auto?: "slug-of-title" | "slug-of-name" }
  | { name: string; label: string; type: "textarea"; required?: boolean; hint?: string; rows?: number; maxLength?: number }
  | { name: string; label: string; type: "list"; hint?: string; rows?: number }
  | { name: string; label: string; type: "select"; options: { value: string; label: string }[]; required?: boolean }
  | { name: string; label: string; type: "switch" }
  | { name: string; label: string; type: "cover_image"; hint?: string };

export type SimpleEditorProps = {
  entity: string;
  title: string;
  backHref: string;
  fields: FieldDef[];
  initial?: Record<string, unknown>;
  status?: string;
  action: (prev: GenericActionResult | null, formData: FormData) => Promise<GenericActionResult>;
  deleteAction?: () => Promise<void>;
  publishAction?: () => Promise<void>;
  unpublishAction?: () => Promise<void>;
};

function SaveBtn() {
  const { pending } = useFormStatus();
  return (
    <Button variant="primary" size="sm" type="submit" disabled={pending}>
      {pending ? "Saving…" : "Save"}
    </Button>
  );
}

export function SimpleEditor({
  entity,
  title,
  backHref,
  fields,
  initial,
  status,
  action,
  deleteAction,
  publishAction,
  unpublishAction,
}: SimpleEditorProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(action, null);
  const [values, setValues] = useState<Record<string, string>>(() => {
    const out: Record<string, string> = {};
    for (const f of fields) {
      const raw = initial?.[f.name];
      if (f.type === "list" && Array.isArray(raw)) out[f.name] = (raw as string[]).join("\n");
      else out[f.name] = raw == null ? "" : String(raw);
    }
    return out;
  });
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!state) return;
    if (state.ok) {
      toast.success("Saved");
      if (state.redirect) router.push(state.redirect);
      else router.refresh();
    } else {
      toast.error(state.error);
    }
  }, [state, router]);

  const errors = state && !state.ok ? state.fieldErrors ?? {} : {};

  function setValue(name: string, value: string, opts?: { syncSlugFrom?: string }) {
    setValues((v) => {
      const next = { ...v, [name]: value };
      if (opts?.syncSlugFrom && !initial?.id) {
        const slugField = fields.find((f) => "auto" in f && f.auto === `slug-of-${opts.syncSlugFrom}` as never);
        if (slugField) next[slugField.name] = slugify(value);
      }
      return next;
    });
  }

  return (
    <form action={formAction} className="space-y-4 pb-24">
      {initial?.id ? <input type="hidden" name="id" value={String(initial.id)} /> : null}

      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={backHref} className="flex items-center gap-1 text-[12px] text-admin-fg-subtle hover:text-admin-fg">
            <ArrowLeft className="size-3" /> {entity}
          </Link>
          <span className="text-admin-fg-subtle">/</span>
          <h1 className="text-[16px] font-semibold tracking-tight text-admin-fg">{title}</h1>
          {status ? <StatusBadge status={status} /> : null}
        </div>
        <div className="flex items-center gap-2">
          {initial?.id && publishAction && unpublishAction ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  try {
                    if (status === "published") await unpublishAction();
                    else await publishAction();
                    toast.success(status === "published" ? "Unpublished" : "Published");
                    router.refresh();
                  } catch (e) {
                    toast.error(e instanceof Error ? e.message : "Failed");
                  }
                })
              }
            >
              {status === "published" ? "Unpublish" : "Publish"}
            </Button>
          ) : null}
          {initial?.id && deleteAction ? (
            <Button
              type="button"
              variant="danger"
              size="icon"
              disabled={pending}
              onClick={() => {
                if (!confirm("Delete? This cannot be undone.")) return;
                startTransition(async () => {
                  try {
                    await deleteAction();
                    toast.success("Deleted");
                  } catch (e) {
                    toast.error(e instanceof Error ? e.message : "Failed");
                  }
                });
              }}
            >
              <Trash2 className="size-3.5" />
            </Button>
          ) : null}
          <SaveBtn />
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {fields.map((f) => {
            const fieldError = errors[f.name]?.[0];
            const span = f.type === "textarea" || f.type === "list" || f.type === "cover_image" ? "md:col-span-2" : "";

            if (f.type === "cover_image") {
              return (
                <div key={f.name} className={span}>
                  <CoverImageField
                    name={f.name}
                    label={f.label}
                    hint={"hint" in f ? f.hint : undefined}
                    value={values[f.name] ?? ""}
                    onChange={(url) => setValue(f.name, url)}
                  />
                  {fieldError ? <p className="mt-1 text-[12px] text-error">{fieldError}</p> : null}
                </div>
              );
            }

            return (
              <FormField
                key={f.name}
                label={f.label}
                hint={"hint" in f ? f.hint : undefined}
                required={"required" in f ? f.required : false}
                error={fieldError}
                className={span}
              >
                {f.type === "textarea" || f.type === "list" ? (
                  <Textarea
                    name={f.name}
                    rows={"rows" in f ? f.rows ?? 4 : 4}
                    maxLength={"maxLength" in f ? f.maxLength : undefined}
                    value={values[f.name] ?? ""}
                    onChange={(e) => setValue(f.name, e.target.value)}
                  />
                ) : f.type === "select" ? (
                  <select
                    name={f.name}
                    value={values[f.name] ?? ""}
                    onChange={(e) => setValue(f.name, e.target.value)}
                    className="flex h-9 w-full rounded-md border border-admin-border bg-admin-surface px-3 text-[13px] text-admin-fg"
                  >
                    {f.options.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                ) : f.type === "switch" ? (
                  <label className="flex items-center gap-2 text-[13px] text-admin-fg-muted">
                    <input
                      type="checkbox"
                      name={f.name}
                      value="true"
                      defaultChecked={Boolean(initial?.[f.name])}
                      className="size-4 rounded border-admin-border"
                    />
                    Enabled
                  </label>
                ) : (
                  <Input
                    type={f.type}
                    name={f.name}
                    maxLength={"maxLength" in f ? f.maxLength : undefined}
                    value={values[f.name] ?? ""}
                    onChange={(e) => {
                      const syncSrc = "auto" in f && f.auto?.startsWith("slug-of-") ? f.auto.replace("slug-of-", "") : undefined;
                      const slugTarget = fields.find((ff) => "auto" in ff && ff.auto === `slug-of-${f.name}`);
                      if (slugTarget && !initial?.id) {
                        setValue(slugTarget.name, slugify(e.target.value));
                      }
                      setValue(f.name, syncSrc ? slugify(e.target.value) : e.target.value);
                    }}
                  />
                )}
              </FormField>
            );
          })}
        </CardContent>
      </Card>
    </form>
  );
}

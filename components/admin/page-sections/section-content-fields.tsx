"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/admin/ui/button";
import { Input, Textarea } from "@/components/admin/ui/input";
import { FormField } from "@/components/admin/ui/form-field";
import type { ContentSchema } from "@/lib/marketing/section-content-schemas";
import type { SectionContentValue } from "@/lib/marketing/section-content-defaults";

type Props = {
  schema: ContentSchema;
  value: SectionContentValue;
  onChange: (next: SectionContentValue) => void;
  disabled?: boolean;
};

type ListItem = Record<string, string>;

function getLists(schema: ContentSchema) {
  return schema.lists ?? (schema.list ? [schema.list] : []);
}

export function SectionContentFields({ schema, value, onChange, disabled }: Props) {
  if (schema.id === "none") {
    return (
      <p className="text-[12px] text-admin-fg-muted">
        This block uses CMS entities or layout-only content. Toggle visibility above; edit services, work, and insights in
        their admin areas.
      </p>
    );
  }

  function setField(key: string, v: string) {
    onChange({ ...value, [key]: v });
  }

  function setList(listKey: string, items: ListItem[]) {
    onChange({ ...value, [listKey]: items });
  }

  return (
    <div className="mt-3 min-w-0 space-y-3 rounded-lg border border-admin-border-soft bg-admin-canvas/50 p-3">
      <p className="text-[11px] font-medium uppercase tracking-wide text-admin-fg-muted">Section content</p>
      {(schema.fields ?? []).map((field) => {
        const raw = value[field.key];
        const str = typeof raw === "string" ? raw : "";
        const Control = field.type === "textarea" ? Textarea : Input;
        return (
          <FormField key={field.key} label={field.label} hint={field.hint}>
            <Control
              value={str}
              disabled={disabled}
              rows={field.type === "textarea" ? 3 : undefined}
              onChange={(e) => setField(field.key, e.target.value)}
              placeholder={field.optional ? "Optional" : undefined}
            />
          </FormField>
        );
      })}

      {getLists(schema).map((list) => {
        const items = (Array.isArray(value[list.key]) ? value[list.key] : []) as ListItem[];
        return (
          <div key={list.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-medium text-admin-fg">{list.label}</p>
              <Button
                type="button"
                variant="ghost"
                size="xs"
                disabled={disabled}
                onClick={() => {
                  const blank: ListItem = {};
                  for (const f of list.itemFields) blank[f.key] = "";
                  setList(list.key, [...items, blank]);
                }}
              >
                <Plus className="size-3" /> Add
              </Button>
            </div>
            {items.length === 0 ? (
              <p className="text-[12px] text-admin-fg-muted">No items — section body may collapse on the live site.</p>
            ) : null}
            {items.map((item, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 rounded-md border border-admin-border-soft bg-admin-surface p-2 sm:flex-row sm:items-start"
              >
                <div className="grid min-w-0 flex-1 gap-2">
                  {list.itemFields.map((f) => {
                    const Control = f.type === "textarea" ? Textarea : Input;
                    return (
                      <Control
                        key={f.key}
                        value={item[f.key] ?? ""}
                        disabled={disabled}
                        placeholder={f.label}
                        rows={f.type === "textarea" ? 3 : undefined}
                        onChange={(e) => {
                          const next = items.map((row, idx) =>
                            idx === i ? { ...row, [f.key]: e.target.value } : row,
                          );
                          setList(list.key, next);
                        }}
                      />
                    );
                  })}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="self-end shrink-0 sm:self-start"
                  disabled={disabled}
                  aria-label="Remove item"
                  onClick={() => setList(list.key, items.filter((_, idx) => idx !== i))}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

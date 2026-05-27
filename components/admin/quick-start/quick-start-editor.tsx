"use client";

import * as React from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import { Input, Textarea } from "@/components/admin/ui/input";
import { Toggle } from "@/components/admin/ui/toggle";
import { saveQuickStartConfig, resetQuickStartConfig } from "@/app/(admin)/admin/(protected)/quick-start/actions";
import type { QuickStartConfig } from "@/lib/marketing/quick-start-config";
import { cn } from "@/lib/utils";

type Tab = "copy" | "services" | "budget" | "channels";

const TABS: { id: Tab; label: string }[] = [
  { id: "copy", label: "Toggle & copy" },
  { id: "services", label: "Services" },
  { id: "budget", label: "Budget" },
  { id: "channels", label: "Channels & windows" },
];

const COPY_KEYS = [
  "welcome",
  "about",
  "needs",
  "details",
  "budget",
  "contact",
  "review",
  "success",
] as const;

export interface QuickStartEditorProps {
  initialConfig: QuickStartConfig;
  services: { slug: string; title: string }[];
}

export function QuickStartEditor({ initialConfig, services }: QuickStartEditorProps) {
  const [config, setConfig] = React.useState<QuickStartConfig>(initialConfig);
  const [tab, setTab] = React.useState<Tab>("copy");
  const [saving, setSaving] = React.useState(false);

  const dirty = React.useMemo(
    () => JSON.stringify(config) !== JSON.stringify(initialConfig),
    [config, initialConfig],
  );

  const save = async () => {
    setSaving(true);
    try {
      const result = await saveQuickStartConfig(config);
      if (result.ok) toast.success("Quick Start saved");
      else toast.error(result.error);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    if (!confirm("Reset Quick Start to defaults? This overwrites all current settings.")) return;
    setSaving(true);
    try {
      const result = await resetQuickStartConfig();
      if (result.ok) {
        toast.success("Reset to defaults");
        window.location.reload();
      } else toast.error(result.error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-3 !py-3">
          <div className="flex items-center gap-3">
            <Toggle
              checked={config.enabled}
              onChange={(v) => setConfig((c) => ({ ...c, enabled: v }))}
              aria-label="Enable Quick Start"
            />
            <div>
              <p className="text-[13px] font-medium text-admin-fg">
                Quick Start is {config.enabled ? "enabled" : "disabled"}
              </p>
              <p className="text-[11px] text-admin-fg-subtle">
                When disabled, the modal, pill, and /start route are hidden site-wide.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={reset} disabled={saving}>
              Reset to defaults
            </Button>
            <Button variant="primary" size="sm" onClick={save} disabled={!dirty || saving}>
              {saving ? "Saving…" : dirty ? "Save changes" : "Saved"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <nav className="flex flex-wrap gap-1 rounded-lg border border-admin-border bg-admin-surface p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-md px-3 py-1.5 text-[12px] transition-colors",
              tab === t.id ? "bg-admin-hover text-admin-fg" : "text-admin-fg-muted hover:bg-admin-hover hover:text-admin-fg",
            )}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "copy" && (
        <Card>
          <CardHeader>
            <CardTitle>Step copy</CardTitle>
            <CardDescription>Plain English. No jargon. Edit titles and supporting body text per step.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {COPY_KEYS.map((key) => (
              <div key={key} className="grid gap-2 md:grid-cols-[160px_1fr]">
                <span className="pt-2 text-[12px] font-semibold uppercase tracking-wider text-admin-fg-subtle">
                  {key}
                </span>
                <div className="space-y-2">
                  <Input
                    value={config.copy[key].title}
                    onChange={(e) =>
                      setConfig((c) => ({
                        ...c,
                        copy: { ...c.copy, [key]: { ...c.copy[key], title: e.target.value } },
                      }))
                    }
                    placeholder="Title"
                  />
                  <Textarea
                    rows={2}
                    value={config.copy[key].body ?? ""}
                    onChange={(e) =>
                      setConfig((c) => ({
                        ...c,
                        copy: { ...c.copy, [key]: { ...c.copy[key], body: e.target.value } },
                      }))
                    }
                    placeholder="Supporting body text"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {tab === "services" && (
        <Card>
          <CardHeader>
            <CardTitle>Services to show</CardTitle>
            <CardDescription>
              Pick which services appear in Step 3. Leave all unchecked to show every published service.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {services.length === 0 ? (
              <p className="text-[12px] text-admin-fg-subtle">No services in the catalogue yet.</p>
            ) : (
              <div className="grid gap-2 md:grid-cols-2">
                {services.map((s) => {
                  const on = config.service_slugs.includes(s.slug);
                  return (
                    <label
                      key={s.slug}
                      className="flex items-center gap-3 rounded-md border border-admin-border bg-admin-surface px-3 py-2 text-[13px]"
                    >
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() =>
                          setConfig((c) => ({
                            ...c,
                            service_slugs: on
                              ? c.service_slugs.filter((x) => x !== s.slug)
                              : [...c.service_slugs, s.slug],
                          }))
                        }
                        className="h-4 w-4 rounded border-admin-border"
                      />
                      <span className="text-admin-fg">{s.title}</span>
                      <span className="ml-auto font-mono text-[11px] text-admin-fg-subtle">{s.slug}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {tab === "budget" && (
        <Card>
          <CardHeader>
            <CardTitle>Budget presets</CardTitle>
            <CardDescription>
              Quick-pick ranges in RWF and USD. Min/max amounts apply to the slider; presets are tappable
              shortcuts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {(["rwf", "usd"] as const).map((cur) => (
              <div key={cur} className="space-y-2">
                <h4 className="text-[12px] font-semibold uppercase tracking-wider text-admin-fg-subtle">
                  {cur.toUpperCase()}
                </h4>
                <div className="grid gap-2 md:grid-cols-3">
                  <label className="space-y-1">
                    <span className="text-[11px] text-admin-fg-subtle">Slider min</span>
                    <Input
                      type="number"
                      value={config.budget_bounds[cur].min}
                      onChange={(e) =>
                        setConfig((c) => ({
                          ...c,
                          budget_bounds: {
                            ...c.budget_bounds,
                            [cur]: { ...c.budget_bounds[cur], min: Number(e.target.value) || 0 },
                          },
                        }))
                      }
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-[11px] text-admin-fg-subtle">Slider max</span>
                    <Input
                      type="number"
                      value={config.budget_bounds[cur].max}
                      onChange={(e) =>
                        setConfig((c) => ({
                          ...c,
                          budget_bounds: {
                            ...c.budget_bounds,
                            [cur]: { ...c.budget_bounds[cur], max: Number(e.target.value) || 1 },
                          },
                        }))
                      }
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-[11px] text-admin-fg-subtle">Slider step</span>
                    <Input
                      type="number"
                      value={config.budget_bounds[cur].step}
                      onChange={(e) =>
                        setConfig((c) => ({
                          ...c,
                          budget_bounds: {
                            ...c.budget_bounds,
                            [cur]: { ...c.budget_bounds[cur], step: Number(e.target.value) || 1 },
                          },
                        }))
                      }
                    />
                  </label>
                </div>
                <div className="space-y-2 pt-2">
                  <p className="text-[11px] text-admin-fg-subtle">Preset chips</p>
                  {config.budget_presets[cur].map((preset, idx) => (
                    <div key={`${cur}-${idx}`} className="grid gap-2 md:grid-cols-[1fr_120px_120px_auto]">
                      <Input
                        value={preset.label}
                        placeholder="Label"
                        onChange={(e) =>
                          setConfig((c) => ({
                            ...c,
                            budget_presets: {
                              ...c.budget_presets,
                              [cur]: c.budget_presets[cur].map((p, i) =>
                                i === idx ? { ...p, label: e.target.value } : p,
                              ),
                            },
                          }))
                        }
                      />
                      <Input
                        type="number"
                        value={preset.min}
                        onChange={(e) =>
                          setConfig((c) => ({
                            ...c,
                            budget_presets: {
                              ...c.budget_presets,
                              [cur]: c.budget_presets[cur].map((p, i) =>
                                i === idx ? { ...p, min: Number(e.target.value) || 0 } : p,
                              ),
                            },
                          }))
                        }
                      />
                      <Input
                        type="number"
                        value={preset.max}
                        onChange={(e) =>
                          setConfig((c) => ({
                            ...c,
                            budget_presets: {
                              ...c.budget_presets,
                              [cur]: c.budget_presets[cur].map((p, i) =>
                                i === idx ? { ...p, max: Number(e.target.value) || 0 } : p,
                              ),
                            },
                          }))
                        }
                      />
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() =>
                          setConfig((c) => ({
                            ...c,
                            budget_presets: {
                              ...c.budget_presets,
                              [cur]: c.budget_presets[cur].filter((_, i) => i !== idx),
                            },
                          }))
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() =>
                      setConfig((c) => ({
                        ...c,
                        budget_presets: {
                          ...c.budget_presets,
                          [cur]: [
                            ...c.budget_presets[cur],
                            { min: 0, max: 0, label: "New preset" },
                          ],
                        },
                      }))
                    }
                  >
                    Add preset
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {tab === "channels" && (
        <Card>
          <CardHeader>
            <CardTitle>Channels &amp; windows</CardTitle>
            <CardDescription>
              WhatsApp number, default country, and how visitors can describe their availability.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-1">
                <span className="text-[11px] text-admin-fg-subtle">WhatsApp number (E.164, e.g. +250788123456)</span>
                <Input
                  value={config.whatsapp.number_e164}
                  onChange={(e) =>
                    setConfig((c) => ({ ...c, whatsapp: { ...c.whatsapp, number_e164: e.target.value } }))
                  }
                  placeholder="+250788123456"
                />
              </label>
              <label className="space-y-1">
                <span className="text-[11px] text-admin-fg-subtle">Default country (ISO alpha-2)</span>
                <Input
                  value={config.whatsapp.default_country}
                  onChange={(e) =>
                    setConfig((c) => ({
                      ...c,
                      whatsapp: { ...c.whatsapp, default_country: e.target.value.toUpperCase().slice(0, 2) },
                    }))
                  }
                  placeholder="RW"
                />
              </label>
            </div>
            <label className="space-y-1 block">
              <span className="text-[11px] text-admin-fg-subtle">Reachability windows (one per line)</span>
              <Textarea
                rows={4}
                value={config.reachability_windows.join("\n")}
                onChange={(e) =>
                  setConfig((c) => ({
                    ...c,
                    reachability_windows: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
                  }))
                }
              />
            </label>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

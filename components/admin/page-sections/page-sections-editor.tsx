"use client";

import * as React from "react";
import Link from "next/link";
import { useActionState } from "react";
import { ChevronDown, ExternalLink, RotateCcw, Search } from "lucide-react";
import { toast } from "sonner";
import { savePageSections, type SavePageSectionsResult } from "@/app/(admin)/admin/(protected)/page-sections/actions";
import { Toggle } from "@/components/admin/ui/toggle";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Badge } from "@/components/admin/ui/badge";
import { MARKETING_PAGE_GROUPS, MARKETING_PAGE_REGISTRY } from "@/lib/marketing/page-section-registry";
import { buildDefaultPageSectionContent, type SectionContentValue } from "@/lib/marketing/section-content-defaults";
import { buildDefaultPageSectionVisibility } from "@/lib/marketing/page-section-registry";
import {
  countHiddenSections,
  countHiddenSectionsTotal,
  getContentSchemaForSection,
  hasEditableContent,
  type PageSectionsStore,
} from "@/lib/marketing/page-sections-store";
import { SectionContentFields } from "@/components/admin/page-sections/section-content-fields";
import { LiveContentNotice } from "@/components/admin/shared/live-content-notice";
import { pageSectionsPersistLabel, type PageSectionsPersistState } from "@/lib/admin/content-source-labels";

function previewHref(path: string): string | null {
  if (path.includes("[")) return null;
  if (path === "(all pages)") return "/";
  return path;
}

function SaveBar({ onSave, pending }: { onSave: () => void; pending: boolean }) {
  return (
    <Button type="button" variant="primary" size="sm" disabled={pending} onClick={onSave}>
      {pending ? "Saving…" : "Save page sections"}
    </Button>
  );
}

type Props = {
  initialStore: PageSectionsStore;
  persistState: PageSectionsPersistState;
};

export function PageSectionsEditor({ initialStore, persistState }: Props) {
  const [saveState, saveAction, savePending] = useActionState(savePageSections, null);
  const [visibility, setVisibility] = React.useState(initialStore.visibility);
  const [content, setContent] = React.useState(initialStore.content);
  const [query, setQuery] = React.useState("");
  const [groupFilter, setGroupFilter] = React.useState<string>("All");
  const [activePageId, setActivePageId] = React.useState("home");
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    if (saveState?.ok) toast.success("Page sections saved — marketing site will update");
    else if (saveState && !saveState.ok) toast.error(saveState.error);
  }, [saveState]);

  const pages = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return MARKETING_PAGE_REGISTRY.filter((page) => {
      if (groupFilter !== "All" && page.group !== groupFilter) return false;
      if (!q) return true;
      return (
        page.label.toLowerCase().includes(q) ||
        page.path.toLowerCase().includes(q) ||
        page.sections.some(
          (s) =>
            s.label.toLowerCase().includes(q) ||
            s.description.toLowerCase().includes(q) ||
            s.id.toLowerCase().includes(q),
        )
      );
    });
  }, [query, groupFilter]);

  React.useEffect(() => {
    if (pages.length === 0) return;
    if (!pages.some((p) => p.id === activePageId)) setActivePageId(pages[0].id);
  }, [pages, activePageId]);

  const activePage = pages.find((p) => p.id === activePageId) ?? pages[0];
  const totalHidden = countHiddenSectionsTotal(visibility);

  function setSectionVisible(pageId: string, sectionId: string, enabled: boolean) {
    setVisibility((prev) => ({
      ...prev,
      [pageId]: { ...prev[pageId], [sectionId]: enabled },
    }));
  }

  function setSectionContent(pageId: string, sectionId: string, next: SectionContentValue) {
    setContent((prev) => ({
      ...prev,
      [pageId]: { ...prev[pageId], [sectionId]: next },
    }));
  }

  function setAllOnPage(pageId: string, enabled: boolean) {
    const page = MARKETING_PAGE_REGISTRY.find((p) => p.id === pageId);
    if (!page) return;
    setVisibility((prev) => {
      const next = { ...prev, [pageId]: { ...prev[pageId] } };
      for (const section of page.sections) next[pageId][section.id] = enabled;
      return next;
    });
  }

  function resetPage(pageId: string) {
    const vis = buildDefaultPageSectionVisibility();
    const cont = buildDefaultPageSectionContent();
    setVisibility((prev) => ({ ...prev, [pageId]: { ...vis[pageId] } }));
    setContent((prev) => ({ ...prev, [pageId]: { ...cont[pageId] } }));
    toast.success("Page reset to defaults (save to apply)");
  }

  function resetAll() {
    setVisibility(buildDefaultPageSectionVisibility());
    setContent(buildDefaultPageSectionContent());
    toast.success("All pages reset to defaults (save to apply)");
  }

  function handleSave() {
    const payload: PageSectionsStore = { visibility, content };
    saveAction(payload);
  }

  function toggleExpanded(key: string) {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const pageHidden = activePage ? countHiddenSections(visibility, activePage.id) : 0;
  const href = activePage ? previewHref(activePage.path) : null;

  return (
    <div className="min-w-0 max-w-full space-y-4">
      <LiveContentNotice title="Live site copy loaded">
        {pageSectionsPersistLabel(persistState)} Hidden sections are removed on the public site (no empty gaps). Save to
        persist your edits to Supabase.
      </LiveContentNotice>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="outline">{totalHidden} hidden across site</Badge>
          {activePage ? (
            <Badge tone={pageHidden > 0 ? "warning" : "neutral"}>
              {activePage.sections.length - pageHidden} / {activePage.sections.length} visible
            </Badge>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <SaveBar onSave={handleSave} pending={savePending} />
          <Button type="button" variant="ghost" size="sm" onClick={resetAll} disabled={savePending}>
            <RotateCcw className="size-3.5" />
            Reset all
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative w-full min-w-0 flex-1 lg:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-admin-fg-muted" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages or sections…"
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {["All", ...MARKETING_PAGE_GROUPS].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGroupFilter(g)}
              className={`rounded-md px-2.5 py-1 text-[12px] transition-colors ${
                groupFilter === g
                  ? "bg-admin-hover text-admin-fg"
                  : "text-admin-fg-muted hover:bg-admin-hover/60 hover:text-admin-fg"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(220px,280px)_1fr]">
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-admin-border-soft py-3">
            <CardTitle className="text-[13px]">Pages</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[min(70vh,640px)] overflow-y-auto p-0">
            <ul className="divide-y divide-admin-border-soft">
              {pages.map((page) => {
                const hidden = countHiddenSections(visibility, page.id);
                const active = page.id === activePage?.id;
                return (
                  <li key={page.id}>
                    <button
                      type="button"
                      onClick={() => setActivePageId(page.id)}
                      className={`flex w-full flex-col items-start gap-0.5 px-3 py-2.5 text-left transition-colors ${
                        active ? "bg-admin-hover" : "hover:bg-admin-hover/50"
                      }`}
                    >
                      <span className="text-[13px] font-medium text-admin-fg">{page.label}</span>
                      <span className="text-[11px] text-admin-fg-muted">{page.path}</span>
                      {hidden > 0 ? (
                        <span className="mt-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                          {hidden} hidden
                        </span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        {activePage ? (
          <Card>
            <CardHeader className="flex flex-col gap-3 border-b border-admin-border-soft sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
              <div className="min-w-0">
                <CardTitle className="text-[15px]">{activePage.label}</CardTitle>
                <p className="mt-1 break-all font-mono text-[12px] text-admin-fg-muted">{activePage.path}</p>
              </div>
              <div className="flex w-full min-w-0 flex-wrap items-center gap-2 sm:w-auto">
                {href ? (
                  <Link
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-[13px] font-medium text-admin-fg hover:bg-admin-hover"
                  >
                    Preview
                    <ExternalLink className="size-3.5" />
                  </Link>
                ) : null}
                <Button type="button" variant="ghost" size="sm" className="flex-1 sm:flex-none" onClick={() => setAllOnPage(activePage.id, true)}>
                  Show all
                </Button>
                <Button type="button" variant="ghost" size="sm" className="flex-1 sm:flex-none" onClick={() => setAllOnPage(activePage.id, false)}>
                  Hide all
                </Button>
                <Button type="button" variant="ghost" size="sm" className="flex-1 sm:flex-none" onClick={() => resetPage(activePage.id)}>
                  Reset page
                </Button>
              </div>
            </CardHeader>
            <CardContent className="divide-y divide-admin-border-soft p-0">
              {activePage.sections.map((section) => {
                const enabled = visibility[activePage.id]?.[section.id] !== false;
                const key = `${activePage.id}.${section.id}`;
                const isOpen = expanded[key] ?? false;
                const editable = hasEditableContent(activePage.id, section.id);
                const schema = getContentSchemaForSection(activePage.id, section.id);
                const sectionContent = content[activePage.id]?.[section.id] ?? {};

                return (
                  <div
                    key={section.id}
                    className={`px-4 py-3.5 ${enabled ? "" : "bg-admin-surface-strong/40"}`}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <button
                        type="button"
                        className="min-w-0 flex-1 text-left"
                        onClick={() => editable && toggleExpanded(key)}
                        disabled={!editable}
                      >
                        <div className="flex items-center gap-2">
                          <p className={`text-[13px] font-medium ${enabled ? "text-admin-fg" : "text-admin-fg-muted"}`}>
                            {section.label}
                          </p>
                          {editable ? (
                            <ChevronDown
                              className={`size-3.5 text-admin-fg-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
                            />
                          ) : null}
                        </div>
                        <p className="mt-0.5 text-[12px] text-admin-fg-muted">{section.description}</p>
                      </button>
                      <div className="shrink-0 self-end sm:self-start">
                        <Toggle
                          checked={enabled}
                          onChange={(checked) => setSectionVisible(activePage.id, section.id, checked)}
                          aria-label={`${enabled ? "Hide" : "Show"} ${section.label}`}
                        />
                      </div>
                    </div>
                    {editable && isOpen && enabled ? (
                      <SectionContentFields
                        schema={schema}
                        value={sectionContent}
                        disabled={savePending}
                        onChange={(next) => setSectionContent(activePage.id, section.id, next)}
                      />
                    ) : null}
                    {editable && isOpen && !enabled ? (
                      <p className="mt-2 text-[12px] text-admin-fg-muted">Turn the section on to edit copy.</p>
                    ) : null}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}

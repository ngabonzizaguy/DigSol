"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2, X } from "lucide-react";
import { upsertCaseStudy, deleteCaseStudy, setCaseStudyStatus } from "@/app/(admin)/admin/(protected)/work/actions";
import { Button } from "@/components/admin/ui/button";
import { Input, Textarea } from "@/components/admin/ui/input";
import { FormField } from "@/components/admin/ui/form-field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { StatusBadge } from "@/components/admin/ui/badge";
import { slugify } from "@/lib/admin/slugify";
import { CoverImageField } from "@/components/admin/media/cover-image-field";
import type { CaseStudy, OrbColor, SegmentKind, ContentStatus, CaseStudyMetric } from "@/lib/supabase/types";

function SaveBtn() {
  const { pending } = useFormStatus();
  return <Button variant="primary" size="sm" type="submit" disabled={pending}>{pending ? "Saving…" : "Save"}</Button>;
}

export function CaseStudyEditor({ initial }: { initial?: CaseStudy }) {
  const router = useRouter();
  const isEdit = Boolean(initial);
  const [state, action] = useActionState(upsertCaseStudy, null);
  const [pending, startTransition] = useTransition();

  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [client, setClient] = useState(initial?.client ?? "");
  const [segment, setSegment] = useState<SegmentKind>(initial?.segment ?? "smb");
  const [industry, setIndustry] = useState(initial?.industry ?? "");
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [challenge, setChallenge] = useState(initial?.challenge ?? "");
  const [approach, setApproach] = useState(initial?.approach ?? "");
  const [outcome, setOutcome] = useState(initial?.outcome ?? "");
  const [serviceSlugs, setServiceSlugs] = useState((initial?.service_slugs ?? []).join("\n"));
  const [cover, setCover] = useState(initial?.cover_url ?? "");
  const [orb, setOrb] = useState<OrbColor>(initial?.orb ?? "mint");
  const [status, setStatus] = useState<ContentStatus>(initial?.status ?? "draft");
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [sortOrder, setSortOrder] = useState(initial?.sort_order ?? 0);
  const [metrics, setMetrics] = useState<CaseStudyMetric[]>(initial?.metrics ?? [{ label: "", value: "" }]);

  useEffect(() => {
    if (state?.ok) {
      toast.success(isEdit ? "Case study updated" : "Case study created");
      if (state.redirect) router.push(state.redirect);
      else router.refresh();
    } else if (state && !state.ok) {
      toast.error(state.error);
    }
  }, [state, isEdit, router]);

  function updateMetric(i: number, key: "label" | "value", v: string) {
    setMetrics((m) => m.map((row, idx) => (idx === i ? { ...row, [key]: v } : row)));
  }

  function handlePublishToggle() {
    if (!initial) return;
    startTransition(async () => {
      try {
        await setCaseStudyStatus(initial.id, initial.status === "published" ? "draft" : "published");
        toast.success(initial.status === "published" ? "Unpublished" : "Published");
        router.refresh();
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed");
      }
    });
  }

  function handleDelete() {
    if (!initial) return;
    if (!confirm(`Delete "${initial.title}"?`)) return;
    startTransition(async () => {
      try {
        await deleteCaseStudy(initial.id);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed");
      }
    });
  }

  return (
    <form action={action} className="space-y-4 pb-24">
      {initial?.id ? <input type="hidden" name="id" value={initial.id} /> : null}

      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/work" className="flex items-center gap-1 text-[12px] text-admin-fg-subtle hover:text-admin-fg">
            <ArrowLeft className="size-3" /> Case studies
          </Link>
          <span className="text-admin-fg-subtle">/</span>
          <h1 className="text-[16px] font-semibold tracking-tight text-admin-fg">
            {initial ? initial.title : "New case study"}
          </h1>
          {initial ? <StatusBadge status={initial.status} /> : null}
        </div>
        <div className="flex items-center gap-2">
          {initial ? (
            <>
              <Button type="button" variant="ghost" size="sm" onClick={handlePublishToggle} disabled={pending}>
                {initial.status === "published" ? "Unpublish" : "Publish"}
              </Button>
              <Button type="button" variant="danger" size="icon" onClick={handleDelete} disabled={pending}>
                <Trash2 className="size-3.5" />
              </Button>
            </>
          ) : null}
          <SaveBtn />
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>Story</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Client" required><Input name="client" value={client} onChange={(e) => setClient(e.target.value)} /></FormField>
                <FormField label="Industry" required><Input name="industry" value={industry} onChange={(e) => setIndustry(e.target.value)} /></FormField>
              </div>
              <FormField label="Title" required>
                <Input name="title" value={title} onChange={(e) => { setTitle(e.target.value); if (!isEdit) setSlug(slugify(e.target.value)); }} />
              </FormField>
              <FormField label="Slug" required>
                <Input name="slug" value={slug} onChange={(e) => setSlug(slugify(e.target.value))} />
              </FormField>
              <FormField label="Summary" required hint="One-line summary for cards">
                <Textarea name="summary" value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} />
              </FormField>
              <FormField label="Challenge" required>
                <Textarea name="challenge" value={challenge} onChange={(e) => setChallenge(e.target.value)} rows={4} />
              </FormField>
              <FormField label="Approach" required>
                <Textarea name="approach" value={approach} onChange={(e) => setApproach(e.target.value)} rows={4} />
              </FormField>
              <FormField label="Outcome" required>
                <Textarea name="outcome" value={outcome} onChange={(e) => setOutcome(e.target.value)} rows={4} />
              </FormField>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Metrics</CardTitle>
              <Button type="button" variant="ghost" size="xs" onClick={() => setMetrics((m) => [...m, { label: "", value: "" }])}>
                <Plus className="size-3" /> Add metric
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {metrics.map((m, i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                  <Input name="metric_label" placeholder="Label" value={m.label} onChange={(e) => updateMetric(i, "label", e.target.value)} />
                  <Input name="metric_value" placeholder="Value" value={m.value} onChange={(e) => updateMetric(i, "value", e.target.value)} />
                  <Button type="button" variant="ghost" size="icon" onClick={() => setMetrics((arr) => arr.filter((_, idx) => idx !== i))}>
                    <X className="size-3.5" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Publish</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <FormField label="Status">
                <select name="status" value={status} onChange={(e) => setStatus(e.target.value as ContentStatus)} className="flex h-9 w-full rounded-md border border-admin-border bg-admin-surface px-3 text-[13px] text-admin-fg">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </FormField>
              <FormField label="Segment">
                <select name="segment" value={segment} onChange={(e) => setSegment(e.target.value as SegmentKind)} className="flex h-9 w-full rounded-md border border-admin-border bg-admin-surface px-3 text-[13px] text-admin-fg">
                  <option value="smb">SMB</option>
                  <option value="midmarket">Mid-market</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </FormField>
              <FormField label="Featured">
                <label className="flex items-center gap-2 text-[13px] text-admin-fg-muted">
                  <input type="checkbox" name="featured" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="size-4 rounded border-admin-border" />
                  Show in hero slot
                </label>
              </FormField>
              <FormField label="Sort order">
                <Input type="number" name="sort_order" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} />
              </FormField>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Visual</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <CoverImageField value={cover} onChange={setCover} />
              <FormField label="Orb color">
                <div className="grid grid-cols-5 gap-2">
                  {(["mint", "peach", "lavender", "sky", "rose"] as const).map((o) => (
                    <button key={o} type="button" onClick={() => setOrb(o)} className={`h-9 rounded-md border-2 ${orb === o ? "border-admin-fg" : "border-admin-border"}`} style={{ background: hex(o) }} aria-label={o}><span className="sr-only">{o}</span></button>
                  ))}
                </div>
                <input type="hidden" name="orb" value={orb} />
              </FormField>
              <FormField label="Linked services" hint="One service slug per line">
                <Textarea name="service_slugs" value={serviceSlugs} onChange={(e) => setServiceSlugs(e.target.value)} rows={3} />
              </FormField>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}

function hex(c: OrbColor) {
  return { mint: "#a7e5d3", peach: "#f4c5a8", lavender: "#c8b8e0", sky: "#a8c8e8", rose: "#e8b8c4" }[c];
}

"use client";

import { Plus, X } from "lucide-react";
import * as React from "react";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileDropzone } from "@/components/ui/file-dropzone";
import { VoiceRecorder } from "@/components/ui/voice-recorder";
import { useQuickStart } from "../quick-start-provider";

const TIMELINES = [
  { id: "asap", label: "ASAP" },
  { id: "1_3", label: "1–3 months" },
  { id: "3_6", label: "3–6 months" },
  { id: "flexible", label: "Flexible" },
];

export function StepDetails() {
  const { draft, setDraft, config, attachments, setFiles, setVoice } = useQuickStart();
  const [linkDraft, setLinkDraft] = React.useState("");

  const addLink = () => {
    const v = linkDraft.trim();
    if (!v) return;
    setDraft((d) => ({ ...d, details: { ...d.details, links: [...d.details.links, v] } }));
    setLinkDraft("");
  };

  const removeLink = (idx: number) => {
    setDraft((d) => ({
      ...d,
      details: { ...d.details, links: d.details.links.filter((_, i) => i !== idx) },
    }));
  };

  return (
    <div className="space-y-4">
      <p className="text-[15px] text-body">{config.copy.details.body}</p>

      <label className="space-y-1.5 block">
        <span className="text-sm font-medium text-body-strong">Short description</span>
        <Textarea
          rows={3}
          maxLength={1000}
          value={draft.details.description}
          onChange={(e) =>
            setDraft((d) => ({ ...d, details: { ...d.details, description: e.target.value } }))
          }
          placeholder="A few sentences about the project"
        />
      </label>

      <label className="space-y-1.5 block">
        <span className="text-sm font-medium text-body-strong">Goals or outcomes</span>
        <Textarea
          rows={3}
          maxLength={1000}
          value={draft.details.goals}
          onChange={(e) =>
            setDraft((d) => ({ ...d, details: { ...d.details, goals: e.target.value } }))
          }
          placeholder="What would success look like for you?"
        />
      </label>

      <fieldset className="space-y-1.5">
        <legend className="text-sm font-medium text-body-strong">Timeline</legend>
        <div className="flex flex-wrap gap-2">
          {TIMELINES.map((t) => {
            const on = draft.details.timeline === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() =>
                  setDraft((d) => ({
                    ...d,
                    details: { ...d.details, timeline: on ? "" : t.id },
                  }))
                }
                className={
                  on
                    ? "rounded-full bg-ink px-4 py-2 text-sm text-on-dark"
                    : "rounded-full border border-hairline-strong px-4 py-2 text-sm text-ink hover:bg-surface-strong"
                }
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="space-y-2">
        <span className="text-sm font-medium text-body-strong">Existing links (optional)</span>
        <div className="flex gap-2">
          <Input
            value={linkDraft}
            onChange={(e) => setLinkDraft(e.target.value)}
            placeholder="https://example.com"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addLink();
              }
            }}
          />
          <Button type="button" variant="outline" size="md" onClick={addLink}>
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>
        {draft.details.links.length > 0 ? (
          <ul className="space-y-1.5">
            {draft.details.links.map((link, idx) => (
              <li
                key={`${link}-${idx}`}
                className="flex items-center justify-between gap-2 rounded-lg bg-surface-strong px-3 py-2 text-[14px]"
              >
                <span className="truncate text-ink">{link}</span>
                <button
                  type="button"
                  onClick={() => removeLink(idx)}
                  aria-label="Remove link"
                  className="rounded-full p-1 text-muted hover:bg-white hover:text-ink"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="space-y-2">
        <span className="text-sm font-medium text-body-strong">Files (optional)</span>
        <p className="text-[13px] text-muted">Screenshots, brand assets, briefs — anything that helps us understand.</p>
        <FileDropzone files={attachments.files} onChange={setFiles} />
      </div>

      <div className="space-y-2">
        <span className="text-sm font-medium text-body-strong">Voice note (optional)</span>
        <p className="text-[13px] text-muted">Sometimes it's easier to just say it. Up to two minutes.</p>
        <VoiceRecorder clip={attachments.voice} onChange={setVoice} />
      </div>
    </div>
  );
}

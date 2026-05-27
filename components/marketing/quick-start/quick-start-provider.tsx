"use client";

import * as React from "react";
import { type QuickStartConfig } from "@/lib/marketing/quick-start-config";
import type { QuickStartService } from "@/lib/marketing/quick-start-server";
import { initialDraft, TOTAL_STEPS, type QuickStartDraft } from "./quick-start-types";
import type { DroppedFile } from "@/components/ui/file-dropzone";
import type { VoiceClip } from "@/components/ui/voice-recorder";

export type QuickStartAttachments = {
  files: DroppedFile[];
  voice: VoiceClip | null;
};

const COOKIE_NAME = "digsol_qs_seen";
const STORAGE_KEY = "digsol_quick_start_draft_v1";
const AUTO_OPEN_DELAY_MS = 6000;

type QuickStartContextValue = {
  open: boolean;
  draft: QuickStartDraft;
  config: QuickStartConfig;
  services: QuickStartService[];
  totalSteps: number;
  openFlow: () => void;
  closeFlow: () => void;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setDraft: (updater: (d: QuickStartDraft) => QuickStartDraft) => void;
  resetDraft: () => void;
  pillHidden: boolean;
  hidePill: () => void;
  attachments: QuickStartAttachments;
  setFiles: (files: DroppedFile[]) => void;
  setVoice: (voice: VoiceClip | null) => void;
};

const QuickStartContext = React.createContext<QuickStartContextValue | null>(null);

export function useQuickStart(): QuickStartContextValue {
  const ctx = React.useContext(QuickStartContext);
  if (!ctx) throw new Error("useQuickStart must be used inside <QuickStartProvider>");
  return ctx;
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[2]) : null;
}

function writeCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function loadDraftFromStorage(fallback: QuickStartDraft): QuickStartDraft {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<QuickStartDraft>;
    return { ...fallback, ...parsed };
  } catch {
    return fallback;
  }
}

export interface QuickStartProviderProps {
  config: QuickStartConfig;
  services: QuickStartService[];
  children: React.ReactNode;
}

export function QuickStartProvider({ config, services, children }: QuickStartProviderProps) {
  const defaults = React.useMemo(
    () =>
      initialDraft({
        country_code: config.whatsapp.default_country,
        currency: "RWF",
      }),
    [config.whatsapp.default_country],
  );

  const [draft, setDraftState] = React.useState<QuickStartDraft>(defaults);
  const [open, setOpen] = React.useState(false);
  const [pillHidden, setPillHidden] = React.useState(false);
  const [hydrated, setHydrated] = React.useState(false);
  const [attachments, setAttachments] = React.useState<QuickStartAttachments>({ files: [], voice: null });

  const setFiles = React.useCallback((files: DroppedFile[]) => {
    setAttachments((prev) => ({ ...prev, files }));
  }, []);
  const setVoice = React.useCallback((voice: VoiceClip | null) => {
    setAttachments((prev) => ({ ...prev, voice }));
  }, []);

  // Hydrate draft from sessionStorage on mount
  React.useEffect(() => {
    setDraftState(loadDraftFromStorage(defaults));
    setHydrated(true);
  }, [defaults]);

  // Persist on change
  React.useEffect(() => {
    if (!hydrated) return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // ignore quota / private mode failures
    }
  }, [draft, hydrated]);

  // Auto-open on first visit (only if enabled, hydrated, reduced motion off, no cookie)
  React.useEffect(() => {
    if (!hydrated || !config.enabled) return;
    if (readCookie(COOKIE_NAME)) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => {
      setOpen(true);
      writeCookie(COOKIE_NAME, "1", 30);
    }, AUTO_OPEN_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [hydrated, config.enabled]);

  const setDraft = React.useCallback((updater: (d: QuickStartDraft) => QuickStartDraft) => {
    setDraftState((prev) => updater(prev));
  }, []);

  const openFlow = React.useCallback(() => {
    writeCookie(COOKIE_NAME, "1", 30);
    setOpen(true);
  }, []);

  const closeFlow = React.useCallback(() => setOpen(false), []);

  const goToStep = React.useCallback((step: number) => {
    setDraftState((prev) => ({ ...prev, step: Math.min(TOTAL_STEPS, Math.max(1, step)) }));
  }, []);

  const nextStep = React.useCallback(() => {
    setDraftState((prev) => ({ ...prev, step: Math.min(TOTAL_STEPS, prev.step + 1) }));
  }, []);

  const prevStep = React.useCallback(() => {
    setDraftState((prev) => ({ ...prev, step: Math.max(1, prev.step - 1) }));
  }, []);

  const resetDraft = React.useCallback(() => {
    setDraftState(defaults);
    setAttachments({ files: [], voice: null });
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, [defaults]);

  const hidePill = React.useCallback(() => setPillHidden(true), []);

  const value = React.useMemo<QuickStartContextValue>(
    () => ({
      open,
      draft,
      config,
      services,
      totalSteps: TOTAL_STEPS,
      openFlow,
      closeFlow,
      goToStep,
      nextStep,
      prevStep,
      setDraft,
      resetDraft,
      pillHidden,
      hidePill,
      attachments,
      setFiles,
      setVoice,
    }),
    [
      open,
      draft,
      config,
      services,
      openFlow,
      closeFlow,
      goToStep,
      nextStep,
      prevStep,
      setDraft,
      resetDraft,
      pillHidden,
      hidePill,
      attachments,
      setFiles,
      setVoice,
    ],
  );

  return <QuickStartContext.Provider value={value}>{children}</QuickStartContext.Provider>;
}

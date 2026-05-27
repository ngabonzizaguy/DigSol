"use client";

import * as React from "react";
import { Mic, Square, Play, Pause, Trash2 } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

export type VoiceClip = {
  blob: Blob;
  url: string;
  durationMs: number;
  mime: string;
};

export interface VoiceRecorderProps {
  clip: VoiceClip | null;
  onChange: (clip: VoiceClip | null) => void;
  maxDurationMs?: number;
  className?: string;
}

const DEFAULT_MAX = 120_000; // 2 minutes

function pickMime(): string {
  if (typeof MediaRecorder === "undefined") return "audio/webm";
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg"];
  for (const m of candidates) {
    if (MediaRecorder.isTypeSupported(m)) return m;
  }
  return "";
}

export function VoiceRecorder({ clip, onChange, maxDurationMs = DEFAULT_MAX, className }: VoiceRecorderProps) {
  const [supported, setSupported] = React.useState(true);
  const [recording, setRecording] = React.useState(false);
  const [elapsed, setElapsed] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const recorderRef = React.useRef<MediaRecorder | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const chunksRef = React.useRef<Blob[]>([]);
  const startedAtRef = React.useRef<number>(0);
  const tickRef = React.useRef<number | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const analyserRef = React.useRef<AnalyserNode | null>(null);
  const audioCtxRef = React.useRef<AudioContext | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const recordBtnRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    setSupported(typeof MediaRecorder !== "undefined" && Boolean(navigator.mediaDevices?.getUserMedia));
  }, []);

  // GSAP pulse on the record button while recording.
  useGSAP(
    () => {
      if (!recordBtnRef.current) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (recording) {
          gsap.to(recordBtnRef.current, {
            scale: 1.06,
            duration: 0.9,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
        } else {
          gsap.killTweensOf(recordBtnRef.current);
          gsap.set(recordBtnRef.current, { scale: 1 });
        }
      });
      return () => mm.revert();
    },
    { dependencies: [recording] },
  );

  const cleanup = React.useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (tickRef.current != null) window.clearInterval(tickRef.current);
    tickRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => undefined);
      audioCtxRef.current = null;
    }
    analyserRef.current = null;
  }, []);

  React.useEffect(() => cleanup, [cleanup]);

  const drawWaveform = React.useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const buffer = new Uint8Array(analyser.frequencyBinCount);
    const render = () => {
      analyser.getByteFrequencyData(buffer);
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      const bars = 40;
      const step = Math.floor(buffer.length / bars);
      const barWidth = width / bars - 2;
      for (let i = 0; i < bars; i++) {
        const v = gsap.utils.mapRange(0, 255, 0.05, 1, buffer[i * step] ?? 0);
        const h = v * (height * 0.9);
        const x = i * (barWidth + 2);
        const y = (height - h) / 2;
        ctx.fillStyle = "#0c0a09";
        ctx.fillRect(x, y, barWidth, h);
      }
      rafRef.current = requestAnimationFrame(render);
    };
    rafRef.current = requestAnimationFrame(render);
  }, []);

  const startRecording = async () => {
    setError(null);
    if (!supported) {
      setError("Voice recording isn't supported in this browser.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = pickMime();
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      recorderRef.current = rec;
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
        const durationMs = Date.now() - startedAtRef.current;
        const url = URL.createObjectURL(blob);
        if (clip?.url) URL.revokeObjectURL(clip.url);
        onChange({ blob, url, durationMs, mime: rec.mimeType || "audio/webm" });
        cleanup();
        setRecording(false);
      };

      // Visualizer
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new Ctx();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      source.connect(analyser);
      analyserRef.current = analyser;
      drawWaveform();

      startedAtRef.current = Date.now();
      setElapsed(0);
      tickRef.current = window.setInterval(() => {
        const ms = Date.now() - startedAtRef.current;
        setElapsed(ms);
        if (ms >= maxDurationMs) {
          rec.stop();
        }
      }, 100);

      rec.start(250);
      setRecording(true);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Microphone access denied.";
      setError(msg);
      cleanup();
    }
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
  };

  const clearClip = () => {
    if (clip?.url) URL.revokeObjectURL(clip.url);
    onChange(null);
    setPlaying(false);
  };

  const formatTime = (ms: number) => {
    const total = Math.floor(ms / 1000);
    const m = Math.floor(total / 60).toString();
    const s = (total % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!supported) {
    return (
      <div className={cn("rounded-2xl border border-hairline bg-surface-card p-4 text-sm text-muted", className)}>
        Voice notes aren't supported in this browser. Try Chrome, Safari, or Edge.
      </div>
    );
  }

  return (
    <div className={cn("space-y-3 rounded-2xl border border-hairline bg-surface-card p-4", className)}>
      <div className="flex items-center gap-3">
        {!recording && !clip && (
          <button
            ref={recordBtnRef}
            type="button"
            onClick={startRecording}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-ink text-on-dark shadow-soft hover:bg-primary-active transition-colors focus:outline-none focus:ring-2 focus:ring-ink/30"
            aria-label="Start recording"
          >
            <Mic className="h-5 w-5" />
          </button>
        )}
        {recording && (
          <button
            ref={recordBtnRef}
            type="button"
            onClick={stopRecording}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-error text-white shadow-soft hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-error/30"
            aria-label="Stop recording"
          >
            <Square className="h-5 w-5 fill-current" />
          </button>
        )}
        {clip && !recording && (
          <>
            <button
              type="button"
              onClick={() => {
                const el = audioRef.current;
                if (!el) return;
                if (playing) {
                  el.pause();
                } else {
                  el.play().catch(() => undefined);
                }
              }}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-ink text-on-dark shadow-soft hover:bg-primary-active transition-colors focus:outline-none focus:ring-2 focus:ring-ink/30"
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>
            <audio
              ref={audioRef}
              src={clip.url}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
              className="hidden"
            />
          </>
        )}
        <div className="min-w-0 flex-1">
          {recording ? (
            <p className="text-sm text-ink">
              Recording… <span className="font-mono">{formatTime(elapsed)}</span> /{" "}
              <span className="text-muted">{formatTime(maxDurationMs)}</span>
            </p>
          ) : clip ? (
            <p className="text-sm text-ink">
              Voice note · <span className="font-mono">{formatTime(clip.durationMs)}</span>
            </p>
          ) : (
            <p className="text-sm text-muted">Tap to record a short voice note (max 2 minutes).</p>
          )}
          <canvas
            ref={canvasRef}
            width={320}
            height={32}
            className={cn("mt-1 h-8 w-full max-w-xs", !recording && "opacity-30")}
            aria-hidden
          />
        </div>
        {clip && !recording ? (
          <button
            type="button"
            onClick={clearClip}
            aria-label="Delete voice note"
            className="rounded-full p-2 text-muted hover:bg-surface-strong hover:text-ink"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        ) : null}
      </div>
      {error ? <p className="text-sm text-error">{error}</p> : null}
    </div>
  );
}

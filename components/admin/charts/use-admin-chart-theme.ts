"use client";

import { useEffect, useState } from "react";

export type AdminChartTheme = {
  fg: string;
  fgMuted: string;
  fgSubtle: string;
  border: string;
  grid: string;
  surface: string;
  accent: string;
  series: [string, string, string];
};

const LIGHT_FALLBACK: AdminChartTheme = {
  fg: "rgb(12, 10, 9)",
  fgMuted: "rgb(78, 78, 78)",
  fgSubtle: "rgb(119, 113, 105)",
  border: "rgb(231, 229, 228)",
  grid: "rgb(231, 229, 228)",
  surface: "rgb(255, 255, 255)",
  accent: "rgb(12, 10, 9)",
  series: ["rgb(12, 10, 9)", "rgb(87, 83, 78)", "rgb(168, 162, 158)"],
};

const DARK_SERIES: [string, string, string] = [
  "rgb(250, 250, 249)",
  "rgb(214, 211, 209)",
  "rgb(168, 162, 158)",
];

function readToken(name: string, fallback: string) {
  if (typeof document === "undefined") {
    return fallback;
  }

  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (!raw) {
    return fallback;
  }

  return `rgb(${raw})`;
}

function readTheme(): AdminChartTheme {
  const fg = readToken("--admin-fg", LIGHT_FALLBACK.fg);
  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");

  return {
    fg,
    fgMuted: readToken("--admin-fg-muted", LIGHT_FALLBACK.fgMuted),
    fgSubtle: readToken("--admin-fg-subtle", LIGHT_FALLBACK.fgSubtle),
    border: readToken("--admin-border", LIGHT_FALLBACK.border),
    grid: readToken("--admin-border", LIGHT_FALLBACK.grid),
    surface: readToken("--admin-surface", LIGHT_FALLBACK.surface),
    accent: readToken("--admin-accent", LIGHT_FALLBACK.accent),
    series: isDark ? DARK_SERIES : LIGHT_FALLBACK.series,
  };
}

/** Resolves admin CSS variables to rgb() strings for Recharts (tokens are space-separated RGB, not HSL). */
export function useAdminChartTheme() {
  const [theme, setTheme] = useState<AdminChartTheme>(LIGHT_FALLBACK);

  useEffect(() => {
    const sync = () => setTheme(readTheme());
    sync();

    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return theme;
}

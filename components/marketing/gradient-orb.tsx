"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Color = "mint" | "peach" | "lavender" | "sky" | "rose";

const colorMap: Record<Color, string> = {
  mint: "rgba(167, 229, 211, 0.55)",
  peach: "rgba(244, 197, 168, 0.55)",
  lavender: "rgba(200, 184, 224, 0.55)",
  sky: "rgba(168, 200, 232, 0.55)",
  rose: "rgba(232, 184, 196, 0.55)",
};

type Props = {
  color: Color;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  slow?: boolean;
};

export function GradientOrb({ color, size = 480, className, style, slow }: Props) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute rounded-full blur-3xl",
        slow ? "animate-orb-drift-slow" : "animate-orb-drift",
        className
      )}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(closest-side, ${colorMap[color]}, transparent 70%)`,
        willChange: "transform",
        ...style,
      }}
    />
  );
}

export function OrbField({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <GradientOrb color="mint" className="-top-32 -left-20" size={520} />
      <GradientOrb color="lavender" className="top-10 right-0" size={420} slow />
      <GradientOrb color="peach" className="bottom-0 left-1/3" size={480} />
    </div>
  );
}

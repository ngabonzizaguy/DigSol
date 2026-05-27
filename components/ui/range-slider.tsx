"use client";

import * as React from "react";
import * as Slider from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

export interface RangeSliderProps {
  value: [number, number];
  onChange: (value: [number, number]) => void;
  min: number;
  max: number;
  step?: number;
  formatValue?: (n: number) => string;
  disabled?: boolean;
  className?: string;
  ariaLabelMin?: string;
  ariaLabelMax?: string;
}

export function RangeSlider({
  value,
  onChange,
  min,
  max,
  step = 1,
  formatValue,
  disabled,
  className,
  ariaLabelMin = "Minimum",
  ariaLabelMax = "Maximum",
}: RangeSliderProps) {
  const format = formatValue ?? ((n: number) => n.toLocaleString());

  return (
    <div className={cn("w-full", className)} aria-disabled={disabled}>
      <Slider.Root
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onValueChange={(v) => onChange([v[0], v[1]] as [number, number])}
        className={cn(
          "relative flex h-6 w-full touch-none select-none items-center",
          disabled && "opacity-50",
        )}
      >
        <Slider.Track className="relative h-1.5 grow rounded-full bg-hairline">
          <Slider.Range className="absolute h-full rounded-full bg-ink" />
        </Slider.Track>
        <Slider.Thumb
          aria-label={ariaLabelMin}
          className="block h-5 w-5 rounded-full border border-hairline-strong bg-surface-card shadow-soft transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ink/30"
        />
        <Slider.Thumb
          aria-label={ariaLabelMax}
          className="block h-5 w-5 rounded-full border border-hairline-strong bg-surface-card shadow-soft transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ink/30"
        />
      </Slider.Root>
      <div className="mt-3 flex justify-between text-sm text-muted">
        <span aria-hidden>{format(value[0])}</span>
        <span aria-hidden>{format(value[1])}</span>
      </div>
    </div>
  );
}

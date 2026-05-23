import * as React from "react";
import { cn } from "@/lib/utils";

export function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mx-auto w-full max-w-[1240px] px-6 lg:px-8", className)} {...props} />;
}

export function Section({
  className,
  size = "md",
  ...props
}: React.HTMLAttributes<HTMLElement> & { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "py-12 lg:py-16",
    md: "py-16 lg:py-section",
    lg: "py-section-sm lg:py-32",
  };
  return <section className={cn(sizes[size], className)} {...props} />;
}

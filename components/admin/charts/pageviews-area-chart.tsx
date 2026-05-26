"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function PageviewsAreaChart({
  data,
}: {
  data: { day: string; views: number }[];
}) {
  if (data.length === 0) {
    return <p className="py-8 text-center text-[13px] text-admin-fg-subtle">No pageviews in this range.</p>;
  }
  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.day).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
  }));

  return (
    <div className="h-56 w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formatted} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="pvFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--admin-accent))" stopOpacity={0.35} />
              <stop offset="100%" stopColor="hsl(var(--admin-accent))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="hsl(var(--admin-border-soft))" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 10, fill: "hsl(var(--admin-fg-subtle))" }} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "hsl(var(--admin-fg-subtle))" }} tickLine={false} width={32} />
          <Tooltip
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              border: "1px solid hsl(var(--admin-border))",
              background: "hsl(var(--admin-surface))",
            }}
          />
          <Area
            type="monotone"
            dataKey="views"
            stroke="hsl(var(--admin-accent))"
            fill="url(#pvFill)"
            strokeWidth={2}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

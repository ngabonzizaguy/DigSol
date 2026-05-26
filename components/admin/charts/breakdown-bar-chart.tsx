"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function BreakdownBarChart({
  data,
  labelKey,
  valueKey = "views",
}: {
  data: Record<string, string | number>[];
  labelKey: string;
  valueKey?: string;
}) {
  if (data.length === 0) {
    return <p className="py-6 text-center text-[12px] text-admin-fg-subtle">No data</p>;
  }
  return (
    <div className="h-48 w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 8, left: 4, bottom: 4 }}>
          <CartesianGrid stroke="hsl(var(--admin-border-soft))" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 10 }} />
          <YAxis
            type="category"
            dataKey={labelKey}
            width={100}
            tick={{ fontSize: 10, fill: "hsl(var(--admin-fg-muted))" }}
          />
          <Tooltip />
          <Bar dataKey={valueKey} fill="hsl(var(--admin-accent))" radius={[0, 4, 4, 0]} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

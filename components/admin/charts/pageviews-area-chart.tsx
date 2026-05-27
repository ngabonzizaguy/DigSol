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
import { useAdminChartTheme } from "@/components/admin/charts/use-admin-chart-theme";

export function PageviewsAreaChart({
  data,
}: {
  data: { day: string; views: number }[];
}) {
  const theme = useAdminChartTheme();

  if (data.length === 0) {
    return <p className="py-8 text-center text-[13px] text-admin-fg-subtle">No pageviews in this range.</p>;
  }

  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.day).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
  }));

  return (
    <div className="h-60 w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formatted} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
          <defs>
            <linearGradient id="pvFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.accent} stopOpacity={0.22} />
              <stop offset="100%" stopColor={theme.accent} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={theme.grid} strokeDasharray="2 4" vertical={false} />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            minTickGap={24}
            tickMargin={8}
            tick={{ fontSize: 11, fill: theme.fgSubtle }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            width={40}
            allowDecimals={false}
            tickMargin={6}
            tick={{ fontSize: 11, fill: theme.fgSubtle }}
          />
          <Tooltip
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              border: `1px solid ${theme.border}`,
              background: theme.surface,
              color: theme.fg,
            }}
            labelStyle={{ color: theme.fg, fontWeight: 500 }}
            formatter={(value) => [Number(value).toLocaleString(), "Views"]}
          />
          <Area
            type="monotone"
            dataKey="views"
            stroke={theme.accent}
            fill="url(#pvFill)"
            strokeWidth={2}
            isAnimationActive={false}
            dot={false}
            activeDot={{ r: 3, fill: theme.accent }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

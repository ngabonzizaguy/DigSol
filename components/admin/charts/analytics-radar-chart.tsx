"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useAdminChartTheme } from "@/components/admin/charts/use-admin-chart-theme";

export type RadarDatum = { subject: string; value: number };

export function AnalyticsRadarChart({
  data,
  description,
}: {
  data: RadarDatum[];
  description?: string;
}) {
  const theme = useAdminChartTheme();

  if (data.length === 0) {
    return <p className="py-8 text-center text-[12px] text-admin-fg-subtle">No data yet</p>;
  }

  return (
    <div className="space-y-2">
      {description ? (
        <p className="text-center text-[11px] text-admin-fg-subtle">{description}</p>
      ) : null}
      <div className="mx-auto aspect-square w-full max-h-[220px] min-h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            data={data}
            margin={{ top: 8, right: 28, bottom: 8, left: 28 }}
            cx="50%"
            cy="50%"
            outerRadius="72%"
          >
            <PolarGrid stroke={theme.grid} strokeOpacity={0.95} />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: theme.fg, fontSize: 11, fontWeight: 500 }}
            />
            <Tooltip
              cursor={false}
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: `1px solid ${theme.border}`,
                background: theme.surface,
                color: theme.fg,
              }}
              formatter={(value) => [Number(value).toLocaleString(), "Count"]}
            />
            <Radar
              name="Count"
              dataKey="value"
              stroke={theme.accent}
              fill={theme.accent}
              fillOpacity={0.2}
              strokeWidth={2}
              isAnimationActive={false}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

"use client";

import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useAdminChartTheme } from "@/components/admin/charts/use-admin-chart-theme";

export type MultiRadarRow = Record<string, string | number>;

export type RadarSeries = {
  key: string;
  label: string;
  color?: string;
};

export function AnalyticsMultiRadarChart({
  data,
  series,
  description,
}: {
  data: MultiRadarRow[];
  series: RadarSeries[];
  description?: string;
}) {
  const theme = useAdminChartTheme();
  const palette = theme.series;

  if (data.length === 0 || series.length === 0) {
    return <p className="py-8 text-center text-[12px] text-admin-fg-subtle">No data yet</p>;
  }

  return (
    <div className="space-y-3">
      {description ? (
        <p className="text-center text-[11px] text-admin-fg-subtle">{description}</p>
      ) : null}
      <div className="mx-auto aspect-square w-full max-h-[240px] min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            data={data}
            margin={{ top: 12, right: 24, bottom: 12, left: 24 }}
            cx="50%"
            cy="50%"
            outerRadius="68%"
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
              formatter={(value, name) => [Number(value).toLocaleString(), String(name)]}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              wrapperStyle={{ fontSize: 11, color: theme.fgMuted, paddingTop: 12 }}
            />
            {series.map((item, index) => {
              const color = item.color ?? palette[index % palette.length];
              return (
                <Radar
                  key={item.key}
                  name={item.label}
                  dataKey={item.key}
                  stroke={color}
                  fill={color}
                  fillOpacity={index === 0 ? 0.22 : 0.12}
                  strokeWidth={2}
                  isAnimationActive={false}
                />
              );
            })}
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

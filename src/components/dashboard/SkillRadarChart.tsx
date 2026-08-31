"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface RadarItem {
  skill: string;
  fullName: string;
  current: number;
  target: number;
  confidence: number;
}

export default function SkillRadarChart({ data }: { data: RadarItem[] }) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload as RadarItem;
      return (
        <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-3 text-xs shadow-xl backdrop-blur-md">
          <p className="font-bold text-white mb-1">{item.fullName}</p>
          <div className="space-y-1">
            <p className="text-teal-400">
              Demonstrated Mastery: <span className="font-semibold">{item.current}%</span>
            </p>
            <p className="text-indigo-400">
              Target Level: <span className="font-semibold">{item.target}%</span>
            </p>
            <p className="text-slate-400">
              Evidence Confidence: <span className="font-semibold">{item.confidence}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-bold text-slate-100">Competency Radar</h3>
          <p className="text-xs text-slate-400">Current demonstrated mastery vs target requirements</p>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-teal-400"></span>
            <span className="text-slate-300">You ({data.reduce((a, b) => a + b.current, 0) / data.length | 0}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-400"></span>
            <span className="text-slate-300">Target Track</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#334155" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="skill"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: "#64748b", fontSize: 9 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Radar
              name="Target Role"
              dataKey="target"
              stroke="#818cf8"
              fill="#6366f1"
              fillOpacity={0.2}
            />
            <Radar
              name="Current Mastery"
              dataKey="current"
              stroke="#2dd4bf"
              fill="#14b8a6"
              fillOpacity={0.45}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

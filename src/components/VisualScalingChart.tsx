import React from "react";
import { Sparkles, Globe, Sun } from "lucide-react";

interface VisualScalingChartProps {
  title: string;
  calculatedValueInMeters: number;
  objectType: 'radius' | 'distance' | 'mass';
}

export const VisualScalingChart: React.FC<VisualScalingChartProps> = ({
  title,
  calculatedValueInMeters,
  objectType
}) => {
  // Reference sizes in meters (radius or distance)
  const earthRadius = 6.371e6; // m
  const jupiterRadius = 6.9911e7; // m
  const sunRadius = 6.9634e8; // m
  const auDistance = 1.495978707e11; // m (1 AU)
  const lightYear = 9.4607e15; // m

  // Determine scale references based on magnitude
  let references = [
    { name: 'Earth (Radius)', size: earthRadius, icon: '🌍', color: 'from-blue-500 to-emerald-500' },
    { name: 'Jupiter (Radius)', size: jupiterRadius, icon: '🪐', color: 'from-amber-500 to-orange-600' },
    { name: 'The Sun (Radius)', size: sunRadius, icon: '☀️', color: 'from-yellow-400 to-red-500' },
  ];

  if (calculatedValueInMeters > 1e10) {
    references = [
      { name: 'Earth Orbit (1 AU)', size: auDistance, icon: '🪐', color: 'from-cyan-400 to-blue-600' },
      { name: 'Neptune Orbit (~30 AU)', size: auDistance * 30, icon: '❄️', color: 'from-indigo-400 to-purple-600' },
      { name: 'Oort Cloud Edge', size: auDistance * 50000, icon: '☄️', color: 'from-slate-400 to-slate-600' },
    ];
  }

  const maxVal = Math.max(calculatedValueInMeters, ...references.map(r => r.size));

  return (
    <div className="bg-slate-950/80 border border-cyan-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden my-6">
      <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
        <Sparkles className="w-4 h-4" />
        <span>Cosmic Scale Comparison</span>
      </div>
      <h3 className="text-lg font-bold text-white mb-4">{title} vs. Astronomical Benchmarks</h3>

      <div className="space-y-4">
        {/* Calculated Object Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-cyan-300 flex items-center space-x-1.5">
              <span>🚀</span>
              <span>Calculated Object ({title})</span>
            </span>
            <span className="text-cyan-400 font-mono">
              {calculatedValueInMeters > 1e9 ? `${(calculatedValueInMeters / 1e3).toExponential(3)} km` : `${calculatedValueInMeters.toLocaleString(undefined, { maximumFractionDigits: 1 })} m`}
            </span>
          </div>
          <div className="h-4 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-cyan-500/40">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-500 shadow-lg shadow-cyan-500/50"
              style={{ width: `${Math.max(8, Math.min(100, (calculatedValueInMeters / maxVal) * 100))}%` }}
            ></div>
          </div>
        </div>

        {/* Reference Benchmarks */}
        {references.map((ref, idx) => {
          const pct = Math.max(6, Math.min(100, (ref.size / maxVal) * 100));
          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-slate-400">
                <span className="flex items-center space-x-1.5">
                  <span>{ref.icon}</span>
                  <span>{ref.name}</span>
                </span>
                <span className="font-mono">
                  {ref.size > 1e9 ? `${(ref.size / 1e3).toExponential(3)} km` : `${ref.size.toLocaleString()} m`}
                </span>
              </div>
              <div className="h-3 w-full bg-slate-900/80 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div
                  className={`h-full bg-gradient-to-r ${ref.color} rounded-full transition-all duration-500 opacity-80`}
                  style={{ width: `${pct}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-white/10 text-xs text-slate-400 flex items-center justify-between">
        <span>Visual scale normalized logarithmically/linearly to largest benchmark.</span>
        <span className="text-cyan-400 font-mono">Ratio: {(calculatedValueInMeters / earthRadius).toFixed(2)}× Earth</span>
      </div>
    </div>
  );
};

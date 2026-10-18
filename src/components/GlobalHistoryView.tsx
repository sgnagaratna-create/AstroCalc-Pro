import React from "react";
import { History, Trash2, Sparkles, LineChart } from "lucide-react";

interface SavedCalcItem {
  id: string;
  name: string;
  date: string;
  inputs: Record<string, number>;
  results: { label: string; value: string; unit: string; description?: string }[];
}

interface GlobalHistoryViewProps {
  savedCalculations: SavedCalcItem[];
  onClearHistory: () => void;
}

export const GlobalHistoryView: React.FC<GlobalHistoryViewProps> = ({
  savedCalculations,
  onClearHistory
}) => {
  return (
    <div className="bg-slate-900/80 border border-white/10 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl max-w-4xl mx-auto">
      <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
            <History className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Global Calculation History & Trends</h2>
            <p className="text-xs text-slate-400">Cumulative log and session analytics across your recent work</p>
          </div>
        </div>
        {savedCalculations.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center space-x-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 px-3 py-2 rounded-xl text-xs font-medium transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {savedCalculations.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <History className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No saved calculations yet.</p>
          <p className="text-xs mt-1">Click "Save" on any calculator result to record it in your global session history.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Cumulative Trend Chart */}
          <div className="bg-slate-950/80 border border-cyan-500/20 rounded-2xl p-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-4 flex items-center space-x-2">
              <LineChart className="w-4 h-4" />
              <span>Recent Computation Magnitude Trend</span>
            </h3>

            <div className="h-44 w-full relative pt-4 px-2 border-b border-white/10 flex items-end">
              <svg className="absolute inset-0 w-full h-full overflow-visible p-2">
                <polyline
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="3"
                  points={savedCalculations.map((item, i) => {
                    const w = 400;
                    const h = 140;
                    const maxX = Math.max(1, savedCalculations.length - 1);
                    const numericVals = savedCalculations.map(s => parseFloat(s.results[0]?.value.replace(/,/g, '')) || 1);
                    const maxY = Math.max(...numericVals, 10);
                    const val = parseFloat(item.results[0]?.value.replace(/,/g, '')) || 1;
                    const x = (i / maxX) * w;
                    const y = h - (Math.log10(val + 1) / Math.log10(maxY + 1)) * h;
                    return `${x},${y}`;
                  }).join(' ')}
                />
              </svg>
              <div className="w-full flex justify-between text-[10px] text-slate-400 z-10">
                {savedCalculations.map((item, i) => (
                  <span key={i} className="truncate max-w-[60px] text-center">{item.name.split(' ')[0]}</span>
                ))}
              </div>
            </div>
          </div>

          {/* History Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Saved Session Records</h3>
            <div className="space-y-2">
              {savedCalculations.map((item) => (
                <div key={item.id} className="bg-slate-950/60 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <span className="text-xs text-purple-400 font-semibold">{item.date}</span>
                    <h4 className="text-sm font-bold text-white">{item.name}</h4>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">{item.results[0]?.label}</span>
                      <span className="text-base font-mono font-bold text-cyan-300">
                        {item.results[0]?.value} {item.results[0]?.unit}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

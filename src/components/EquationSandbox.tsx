import React, { useState } from "react";
import { Sparkles, Play, Plus, Trash2, Code2, CheckCircle2 } from "lucide-react";

export const EquationSandbox: React.FC = () => {
  const [expression, setExpression] = useState<string>("G * M * m / r^2");
  const [variables, setVariables] = useState<{ name: string; value: number }[]>([
    { name: 'G', value: 6.67430e-11 },
    { name: 'M', value: 1.98847e30 },
    { name: 'm', value: 1000 },
    { name: 'r', value: 6.9634e8 }
  ]);
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddVar = () => {
    setVariables([...variables, { name: 'x', value: 1 }]);
  };

  const handleRemoveVar = (index: number) => {
    setVariables(variables.filter((_, i) => i !== index));
  };

  const handleVarChange = (index: number, field: 'name' | 'value', val: string | number) => {
    const updated = [...variables];
    if (field === 'name') {
      updated[index].name = String(val).trim();
    } else {
      updated[index].value = Number(val);
    }
    setVariables(updated);
  };

  const handleCalculate = () => {
    try {
      setError(null);
      const varNames = variables.map(v => v.name).filter(Boolean);
      const varValues = variables.map(v => Number(v.value) || 0);

      // Clean up expression: convert ^ to **, and ensure proper JS execution without corrupting scientific notation (e.g. 1.5e11)
      let jsExpr = expression.trim()
        .replace(/\^/g, '**');

      // Build evaluation function with standard physics constants pre-loaded
      const evalFunc = new Function(
        'G', 'c', 'h', 'hbar', 'k_B', 'M_sun', 'R_sun', 'L_sun', 'AU', 'PI', 'E',
        ...varNames,
        `
        const { sin, cos, tan, sqrt, log, log10, exp, abs, pow, PI, E } = Math;
        return (${jsExpr});
      `
      );

      const res = evalFunc(
        6.67430e-11, // G
        2.99792458e8, // c
        6.62607015e-34, // h
        1.05457182e-34, // hbar
        1.380649e-23, // k_B
        1.98847e30, // M_sun
        6.9634e8, // R_sun
        3.828e26, // L_sun
        1.495978707e11, // AU
        Math.PI,
        Math.E,
        ...varValues
      );

      if (typeof res === 'number' && !isNaN(res)) {
        setResult(res);
      } else {
        throw new Error("Expression resulted in NaN or invalid value.");
      }
    } catch (err: any) {
      setError(err.message || "Evaluation syntax error.");
      setResult(null);
    }
  };

  return (
    <div className="bg-slate-900/80 border border-white/10 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl max-w-4xl mx-auto">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
          <Code2 className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-xl font-black text-white">Custom Equation Sandbox</h2>
          <p className="text-xs text-slate-400">Type any mathematical, physical, or astrophysical equation for instant evaluation</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Expression Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Custom Mathematical Expression</label>
          <input
            type="text"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            placeholder="e.g. G * M * m / r^2"
            className="w-full bg-slate-950 border border-cyan-500/40 rounded-xl px-4 py-3.5 text-white font-mono text-lg focus:outline-none focus:border-cyan-500 shadow-inner"
          />
          <p className="text-xs text-slate-500">Supports standard math functions (sqrt, sin, cos, pow, log) and constants like G, c, h, M_sun, AU, PI.</p>
        </div>

        {/* Variables Editor */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Variables</span>
            <button
              onClick={handleAddVar}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Variable</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {variables.map((v, idx) => (
              <div key={idx} className="flex items-center space-x-2 bg-slate-950/80 border border-white/10 rounded-xl p-2.5">
                <input
                  type="text"
                  value={v.name}
                  onChange={(e) => handleVarChange(idx, 'name', e.target.value)}
                  placeholder="Variable"
                  className="w-24 bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-cyan-300 font-mono text-sm focus:outline-none"
                />
                <span className="text-slate-500">=</span>
                <input
                  type="number"
                  value={v.value}
                  onChange={(e) => handleVarChange(idx, 'value', e.target.value)}
                  placeholder="Value"
                  className="flex-grow bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none"
                />
                <button
                  onClick={() => handleRemoveVar(idx)}
                  className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={handleCalculate}
          className="w-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black py-4 rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2 text-base cursor-pointer"
        >
          <Play className="w-5 h-5 fill-slate-950" />
          <span>Evaluate Equation</span>
        </button>

        {/* Error / Result */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-xs text-red-400 font-mono">
            ⚠️ {error}
          </div>
        )}

        {result !== null && !error && (
          <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-cyan-500/40 rounded-2xl p-6 shadow-xl">
            <span className="text-xs font-medium text-slate-400 block mb-1">Evaluated Result</span>
            <div className="text-3xl font-black font-mono tracking-tight text-cyan-300">
              {Math.abs(result) > 1e6 || (Math.abs(result) < 0.001 && result !== 0) ? result.toExponential(6) : result.toLocaleString(undefined, { maximumFractionDigits: 6 })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

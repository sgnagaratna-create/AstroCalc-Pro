import React from "react";
import { X, Printer, Download, Sparkles, Atom } from "lucide-react";

interface ScientificReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  calculatorName: string;
  formula: string;
  inputs: Record<string, number>;
  results: { label: string; value: string; unit: string; description?: string }[];
  steps: string[];
}

export const ScientificReportModal: React.FC<ScientificReportModalProps> = ({
  isOpen,
  onClose,
  calculatorName,
  formula,
  inputs,
  results,
  steps
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadText = () => {
    const reportContent = `
========================================
ASTROCALC PRO - SCIENTIFIC REPORT
========================================
Model Analyzed: ${calculatorName}
Governing Formula: ${formula}
Date: ${new Date().toLocaleString()}

--- INPUT VARIABLES ---
${Object.entries(inputs).map(([k, v]) => `${k}: ${v}`).join('\n')}

--- COMPUTED RESULTS ---
${results.map(r => `${r.label}: ${r.value} ${r.unit}\n  ${r.description || ''}`).join('\n\n')}

--- STEP-BY-STEP DERIVATION ---
${steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

========================================
AstroCalc Pro • Certified Astrophysics Suite
========================================
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${calculatorName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_report.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-white/10 w-full max-w-3xl rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-y-auto max-h-[90vh] print:bg-white print:text-black print:shadow-none">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10 print:border-black/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center print:border-black">
              <Atom className="w-5 h-5 text-cyan-400 print:text-black" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white print:text-black">AstroCalc Pro - Scientific Report</h2>
              <p className="text-xs text-slate-400 print:text-slate-600">Generated Research & Calculation Summary</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 print:hidden">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-bold px-3.5 py-2 rounded-xl hover:opacity-90 transition-opacity shadow-lg text-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Save PDF (Print)</span>
            </button>
            <button
              onClick={handleDownloadText}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold px-3.5 py-2 rounded-xl transition-colors shadow-lg text-xs border border-cyan-500/30"
            >
              <Download className="w-4 h-4" />
              <span>Download Report (.txt)</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div className="space-y-6 my-6 print:text-black">
          <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-5 print:bg-slate-100 print:border-black/20">
            <span className="text-xs text-cyan-400 uppercase tracking-wider font-semibold print:text-blue-700">Model Analyzed</span>
            <h3 className="text-2xl font-black text-white mt-1 print:text-black">{calculatorName}</h3>
            <p className="text-xs text-slate-400 mt-1 print:text-slate-600 font-mono">Governing Formula: {formula}</p>
          </div>

          {/* Input Parameters */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 print:text-black">Input Variables</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(inputs).map(([key, val]) => (
                <div key={key} className="bg-slate-950/60 border border-white/5 rounded-xl p-3 print:bg-slate-50 print:border-black/10">
                  <span className="text-[10px] text-slate-400 uppercase block print:text-slate-600">{key}</span>
                  <span className="text-base font-mono font-bold text-cyan-300 print:text-black">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Results */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 print:text-black">Computed Results</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {results.map((res, idx) => (
                <div key={idx} className="bg-gradient-to-br from-slate-950/80 to-slate-900/80 border border-cyan-500/20 rounded-xl p-4 print:bg-slate-50 print:border-black/20">
                  <span className="text-xs text-slate-400 print:text-slate-600 block">{res.label}</span>
                  <div className="flex items-baseline space-x-2 my-1">
                    <span className="text-2xl font-black font-mono text-cyan-300 print:text-black">{res.value}</span>
                    <span className="text-xs font-semibold text-purple-300 print:text-purple-800">{res.unit}</span>
                  </div>
                  {res.description && <p className="text-xs text-slate-400 mt-1 print:text-slate-600">{res.description}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Step-by-step breakdown */}
          <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-5 print:bg-slate-50 print:border-black/20">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-3 print:text-purple-800">Step-by-Step Derivation & Physics Breakdown</h4>
            <ul className="space-y-2 text-sm text-slate-300 font-mono print:text-black">
              {steps.map((step, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-cyan-400 shrink-0 font-bold print:text-black">{idx + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 text-center text-xs text-slate-500 print:border-black/20">
          AstroCalc Pro Scientific Report • Certified Astrometric Calculations • {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

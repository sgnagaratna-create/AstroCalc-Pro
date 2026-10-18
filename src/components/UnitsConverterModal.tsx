import React, { useState } from "react";
import { X, ArrowRightLeft, Sliders, Globe, Sparkles } from "lucide-react";

interface UnitsConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type UnitCategory = 'distance' | 'mass' | 'time' | 'angle';

interface UnitDef {
  name: string;
  symbol: string;
  toBase: (val: number) => number; // converts to base (meters, kg, seconds, radians)
  fromBase: (val: number) => number; // converts from base
}

const unitCategories: Record<UnitCategory, { label: string; baseUnit: string; units: Record<string, UnitDef> }> = {
  distance: {
    label: 'Distance & Length',
    baseUnit: 'Meters (m)',
    units: {
      m: { name: 'Meters', symbol: 'm', toBase: v => v, fromBase: v => v },
      km: { name: 'Kilometers', symbol: 'km', toBase: v => v * 1e3, fromBase: v => v / 1e3 },
      au: { name: 'Astronomical Units', symbol: 'AU', toBase: v => v * 1.495978707e11, fromBase: v => v / 1.495978707e11 },
      ly: { name: 'Light-Years', symbol: 'ly', toBase: v => v * 9.460730472e15, fromBase: v => v / 9.460730472e15 },
      pc: { name: 'Parsecs', symbol: 'pc', toBase: v => v * 3.085677581e16, fromBase: v => v / 3.085677581e16 },
      kpc: { name: 'Kiloparsecs', symbol: 'kpc', toBase: v => v * 3.085677581e19, fromBase: v => v / 3.085677581e19 },
      mpc: { name: 'Megaparsecs', symbol: 'Mpc', toBase: v => v * 3.085677581e22, fromBase: v => v / 3.085677581e22 },
      rsun: { name: 'Solar Radii', symbol: 'R☉', toBase: v => v * 6.9634e8, fromBase: v => v / 6.9634e8 },
    }
  },
  mass: {
    label: 'Mass & Weight',
    baseUnit: 'Kilograms (kg)',
    units: {
      kg: { name: 'Kilograms', symbol: 'kg', toBase: v => v, fromBase: v => v },
      tonne: { name: 'Metric Tonnes', symbol: 't', toBase: v => v * 1000, fromBase: v => v / 1000 },
      msun: { name: 'Solar Masses', symbol: 'M☉', toBase: v => v * 1.98847e30, fromBase: v => v / 1.98847e30 },
      mearth: { name: 'Earth Masses', symbol: 'M⊕', toBase: v => v * 5.97219e24, fromBase: v => v / 5.97219e24 },
      mjupiter: { name: 'Jupiter Masses', symbol: 'M_J', toBase: v => v * 1.89813e27, fromBase: v => v / 1.89813e27 },
    }
  },
  time: {
    label: 'Time Duration',
    baseUnit: 'Seconds (s)',
    units: {
      s: { name: 'Seconds', symbol: 's', toBase: v => v, fromBase: v => v },
      day: { name: 'Days', symbol: 'days', toBase: v => v * 86400, fromBase: v => v / 86400 },
      yr: { name: 'Julian Years', symbol: 'yr', toBase: v => v * 31557600, fromBase: v => v / 31557600 },
      myr: { name: 'Mega-years', symbol: 'Myr', toBase: v => v * 3.15576e13, fromBase: v => v / 3.15576e13 },
      gyr: { name: 'Giga-years', symbol: 'Gyr', toBase: v => v * 3.15576e16, fromBase: v => v / 3.15576e16 },
    }
  },
  angle: {
    label: 'Angles & Astrometry',
    baseUnit: 'Radians (rad)',
    units: {
      rad: { name: 'Radians', symbol: 'rad', toBase: v => v, fromBase: v => v },
      deg: { name: 'Degrees', symbol: '°', toBase: v => v * (Math.PI / 180), fromBase: v => v * (180 / Math.PI) },
      arcsec: { name: 'Arcseconds', symbol: '″', toBase: v => v * (Math.PI / 648000), fromBase: v => v * (648000 / Math.PI) },
      mas: { name: 'Milliarcseconds', symbol: 'mas', toBase: v => v * 1e-3 * (Math.PI / 648000), fromBase: v => v * 1e3 * (648000 / Math.PI) },
    }
  }
};

export const UnitsConverterModal: React.FC<UnitsConverterModalProps> = ({ isOpen, onClose }) => {
  const [activeCategory, setActiveCategory] = useState<UnitCategory>('distance');
  const [fromUnit, setFromUnit] = useState<string>('ly');
  const [toUnit, setToUnit] = useState<string>('pc');
  const [inputValue, setInputValue] = useState<number>(1);

  if (!isOpen) return null;

  const categoryData = unitCategories[activeCategory];
  const unitKeys = Object.keys(categoryData.units);

  // Perform conversion
  const fromDef = categoryData.units[fromUnit] || categoryData.units[unitKeys[0]];
  const toDef = categoryData.units[toUnit] || categoryData.units[unitKeys[1] || unitKeys[0]];

  const baseVal = fromDef.toBase(inputValue);
  const convertedVal = toDef.fromBase(baseVal);

  const handleCategoryChange = (cat: UnitCategory) => {
    setActiveCategory(cat);
    const newKeys = Object.keys(unitCategories[cat].units);
    setFromUnit(newKeys[0]);
    setToUnit(newKeys[1] || newKeys[0]);
  };

  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-white/10 w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
              <ArrowRightLeft className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Astrophysical Units Converter</h2>
              <p className="text-xs text-slate-400">Seamlessly convert between astronomical, cosmological, and physical units</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex space-x-2 my-6 overflow-x-auto pb-2 scrollbar-none">
          {(Object.keys(unitCategories) as UnitCategory[]).map((catKey) => {
            const cat = unitCategories[catKey];
            const isActive = activeCategory === catKey;
            return (
              <button
                key={catKey}
                onClick={() => handleCategoryChange(catKey)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 border border-white/5'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Converter Body */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* From Input */}
            <div className="sm:col-span-5 space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">From</label>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-white/10 rounded-2xl px-4 py-3.5 text-white font-mono text-lg focus:outline-none focus:border-cyan-500"
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-cyan-500"
              >
                {unitKeys.map(key => (
                  <option key={key} value={key}>{categoryData.units[key].name} ({categoryData.units[key].symbol})</option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="sm:col-span-2 flex justify-center py-2">
              <button
                onClick={handleSwap}
                className="w-12 h-12 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-white/10 flex items-center justify-center text-cyan-400 transition-transform hover:rotate-180 shadow-lg"
              >
                <ArrowRightLeft className="w-5 h-5" />
              </button>
            </div>

            {/* To Output */}
            <div className="sm:col-span-5 space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">To</label>
              <div className="w-full bg-slate-950 border border-cyan-500/30 rounded-2xl px-4 py-3.5 text-cyan-300 font-mono text-lg font-bold overflow-x-auto">
                {convertedVal > 1e6 || (convertedVal < 0.001 && convertedVal !== 0) ? convertedVal.toExponential(4) : convertedVal.toLocaleString(undefined, { maximumFractionDigits: 6 })}
              </div>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-cyan-500"
              >
                {unitKeys.map(key => (
                  <option key={key} value={key}>{categoryData.units[key].name} ({categoryData.units[key].symbol})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-4 flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed">
              <span className="font-semibold text-white">Conversion Reference:</span> 1 Parsec (pc) equals 3.26156 Light-Years (ly) or 206,265 Astronomical Units (AU). Base unit for this category is <span className="text-cyan-400 font-mono">{categoryData.baseUnit}</span>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

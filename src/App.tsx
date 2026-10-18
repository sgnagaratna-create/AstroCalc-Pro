import React, { useState, useEffect, useRef } from "react";
import { 
  Rocket, Compass, Sun, Eye, Globe, Zap, Cpu, Sparkles, HelpCircle, 
  RefreshCw, Bookmark, Share2, ChevronRight, Info, CheckCircle2, Search, 
  ExternalLink, Send, ArrowRight, BookOpen, Layers, ArrowRightLeft, Copy, Check, Columns, BarChart2, Atom, FileText, LineChart, Code2, History, Map
} from "lucide-react";
import { LatexMath } from "./components/LatexMath";
import { MarkdownLatexRenderer } from "./components/MarkdownLatexRenderer";
import { UnitsConverterModal } from "./components/UnitsConverterModal";
import { VisualScalingChart } from "./components/VisualScalingChart";
import { ScientificReportModal } from "./components/ScientificReportModal";
import { EquationSandbox } from "./components/EquationSandbox";
import { GlobalHistoryView } from "./components/GlobalHistoryView";
import { StarChartMap } from "./components/StarChartMap";

type Category = 'math' | 'quantum' | 'orbital' | 'cosmology' | 'stellar' | 'astrometry' | 'starchart' | 'sandbox' | 'history' | 'ai-tutor';

interface CalculatorDef {
  id: string;
  name: string;
  category: Category;
  icon: any;
  description: string;
  formula: string;
  variables: { key: string; label: string; unit: string; placeholder: number }[];
  calculate: (inputs: Record<string, number>) => { results: { label: string; value: string; unit: string; description?: string }[]; steps: string[]; chartData?: { xLabel: string; xVal: number; yVal: number }[] };
}

// Physical & Astronomical Constants
const G = 6.67430e-11;
const c = 2.99792458e8;
const h = 6.62607015e-34;
const hbar = 1.05457182e-34;
const k_B = 1.380649e-23;
const m_e = 9.1093837e-31;
const m_p = 1.67262192369e-27;
const M_sun = 1.98847e30;
const R_sun = 6.9634e8;
const L_sun = 3.828e26;
const AU = 1.495978707e11;
const pc_to_ly = 3.26156;
const parsec_m = 3.085677581e16;
const sigma_SB = 5.670374419e-8;

export default function App() {
  const [activeCategory, setActiveCategory] = useState<Category>('math');
  const [selectedCalc, setSelectedCalc] = useState<string>('pythagorean');
  const [dualMode, setDualMode] = useState(false);
  const [selectedCalcB, setSelectedCalcB] = useState<string>('orbital-velocity');

  const [inputs, setInputs] = useState<Record<string, number>>({});
  const [inputsB, setInputsB] = useState<Record<string, number>>({});

  const [savedCalculations, setSavedCalculations] = useState<{ id: string; name: string; date: string; inputs: Record<string, number>; results: any }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [universalQuery, setUniversalQuery] = useState('');
  const [isConverterOpen, setIsConverterOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [graphType, setGraphType] = useState<'bar' | 'line'>('line');

  // AI Tutor state
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: "Greetings, scholar! I am your AI Math, Physics & Astrophysics Professor. Ask me anything from middle school arithmetic to PhD-level general relativity, quantum mechanics, and cosmology!" }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Starry Background Canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5,
      alpha: Math.random(),
      speed: Math.random() * 0.05 + 0.01,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#05050c';
      ctx.fillRect(0, 0, width, height);

      stars.forEach((star) => {
        star.alpha += star.speed;
        if (star.alpha > 1 || star.alpha < 0.2) star.speed = -star.speed;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(star.alpha)})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Comprehensive Calculator Suite (From Middle School Math to PhD Physics & Astrophysics)
  const calculators: CalculatorDef[] = [
    // 1. Math & General Physics (Middle School to Undergraduate)
    {
      id: 'pythagorean',
      name: 'Pythagorean Theorem & Distance',
      category: 'math',
      icon: Zap,
      description: 'Middle school geometry: calculate hypotenuse or side length of a right triangle.',
      formula: 'c = \\sqrt{a^2 + b^2}',
      variables: [
        { key: 'a', label: 'Side A (a)', unit: 'units', placeholder: 3 },
        { key: 'b', label: 'Side B (b)', unit: 'units', placeholder: 4 },
      ],
      calculate: (inp) => {
        const a = inp.a || 3;
        const b = inp.b || 4;
        const cVal = Math.sqrt(a * a + b * b);
        return {
          results: [{ label: 'Hypotenuse (c)', value: cVal.toFixed(4), unit: 'units', description: 'Triangle hypotenuse.' }],
          steps: [`c = √(a² + b²) = √(${a * a} + ${b * b}) = ${cVal.toFixed(4)}`]
        };
      }
    },
    {
      id: 'quadratic-solver',
      name: 'Quadratic Equation Solver',
      category: 'math',
      icon: Zap,
      description: 'High school algebra: find roots of ax² + bx + c = 0.',
      formula: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
      variables: [
        { key: 'a', label: 'Coefficient a', unit: 'dimensionless', placeholder: 1 },
        { key: 'b', label: 'Coefficient b', unit: 'dimensionless', placeholder: -5 },
        { key: 'c', label: 'Coefficient c', unit: 'dimensionless', placeholder: 6 },
      ],
      calculate: (inp) => {
        const a = inp.a || 1;
        const b = inp.b || -5;
        const cVal = inp.c || 6;
        const discriminant = b * b - 4 * a * cVal;

        if (discriminant < 0) {
          return {
            results: [{ label: 'Roots', value: 'Complex Roots', unit: 'i', description: 'Discriminant < 0.' }],
            steps: [`Discriminant Δ = b² - 4ac = ${discriminant} (Complex roots)`]
          };
        }

        const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);

        return {
          results: [
            { label: 'Root x₁', value: x1.toFixed(4), unit: 'units', description: 'First solution.' },
            { label: 'Root x₂', value: x2.toFixed(4), unit: 'units', description: 'Second solution.' }
          ],
          steps: [
            `Δ = ${discriminant}`,
            `x₁ = ${x1.toFixed(4)}, x₂ = ${x2.toFixed(4)}`
          ]
        };
      }
    },
    {
      id: 'circle-sphere-geom',
      name: 'Circle & Sphere Geometry',
      category: 'math',
      icon: Zap,
      description: 'Calculate circumference, area of circle, and volume of sphere.',
      formula: 'A = \\pi r^2, \\quad V = \\frac{4}{3}\\pi r^3',
      variables: [
        { key: 'radius', label: 'Radius (r)', unit: 'meters', placeholder: 5 },
      ],
      calculate: (inp) => {
        const r = inp.radius || 5;
        const area = Math.PI * r * r;
        const volume = (4 / 3) * Math.PI * Math.pow(r, 3);
        return {
          results: [
            { label: 'Circle Area', value: area.toFixed(2), unit: 'm²', description: 'Surface area.' },
            { label: 'Sphere Volume', value: volume.toFixed(2), unit: 'm³', description: 'Spherical volume.' }
          ],
          steps: [`Area = πr² = ${area.toFixed(2)} m²`, `Volume = (4/3)πr³ = ${volume.toFixed(2)} m³`]
        };
      }
    },
    {
      id: 'gravitational-potential',
      name: 'Gravitational Potential & Force',
      category: 'math',
      icon: Zap,
      description: 'Calculate universal gravitational force and potential energy between two masses.',
      formula: 'F = G \\frac{m_1 m_2}{r^2}, \\quad U = -G \\frac{m_1 m_2}{r}',
      variables: [
        { key: 'm1', label: 'Mass 1 (m₁)', unit: 'kg', placeholder: 5.972e24 },
        { key: 'm2', label: 'Mass 2 (m₂)', unit: 'kg', placeholder: 1000 },
        { key: 'r', label: 'Separation Distance (r)', unit: 'meters (m)', placeholder: 6.371e6 },
      ],
      calculate: (inp) => {
        const m1 = inp.m1 || 5.972e24;
        const m2 = inp.m2 || 1000;
        const r = inp.r || 6.371e6;
        const F = (G * m1 * m2) / Math.pow(r, 2);
        const U = -(G * m1 * m2) / r;

        return {
          results: [
            { label: 'Gravitational Force (F)', value: F.toExponential(3), unit: 'Newtons (N)', description: 'Attractive gravitational force.' },
            { label: 'Potential Energy (U)', value: U.toExponential(3), unit: 'Joules (J)', description: 'Gravitational binding potential.' }
          ],
          steps: [
            `G = 6.67430 × 10⁻¹¹ m³ kg⁻¹ s⁻²`,
            `F = G m₁ m₂ / r² = ${F.toExponential(3)} N`,
            `U = -G m₁ m₂ / r = ${U.toExponential(3)} J`
          ]
        };
      }
    },
    {
      id: 'kinetic-energy-rel',
      name: 'Relativistic Kinetic Energy & Momentum',
      category: 'math',
      icon: Zap,
      description: 'Calculate relativistic kinetic energy and total energy for high-speed particles.',
      formula: 'E = \\gamma m c^2, \\quad K = (\\gamma - 1) m c^2',
      variables: [
        { key: 'mass', label: 'Rest Mass (m)', unit: 'kg', placeholder: 1.672e-27 },
        { key: 'fractionC', label: 'Velocity Fraction of c (v/c)', unit: 'dimensionless', placeholder: 0.9 },
      ],
      calculate: (inp) => {
        const m = inp.mass || 1.672e-27;
        const beta = Math.min(0.99999, Math.max(0, inp.fractionC || 0.9));
        const gamma = 1 / Math.sqrt(1 - Math.pow(beta, 2));
        const E_total = gamma * m * c * c;
        const K = (gamma - 1) * m * c * c;

        return {
          results: [
            { label: 'Lorentz Factor (γ)', value: gamma.toFixed(4), unit: 'dimensionless', description: 'Time dilation factor.' },
            { label: 'Relativistic Kinetic Energy (K)', value: K.toExponential(3), unit: 'Joules (J)', description: 'Kinetic energy component.' },
            { label: 'Total Energy (E)', value: E_total.toExponential(3), unit: 'Joules (J)', description: 'Total energy.' }
          ],
          steps: [
            `β = ${beta}`,
            `γ = 1 / √(1 - β²) = ${gamma.toFixed(4)}`,
            `K = (γ - 1)mc² = ${K.toExponential(3)} J`
          ]
        };
      }
    },
    {
      id: 'ideal-gas-law',
      name: 'Ideal Gas Law & Thermal Pressure',
      category: 'math',
      icon: Zap,
      description: 'Calculate thermodynamic pressure for stellar gas clouds and nebulae.',
      formula: 'P = n k_B T = \\frac{\\rho k_B T}{\\mu m_p}',
      variables: [
        { key: 'density', label: 'Mass Density (ρ)', unit: 'kg/m³', placeholder: 1e-15 },
        { key: 'temp', label: 'Temperature (T)', unit: 'Kelvin (K)', placeholder: 10000 },
        { key: 'mu', label: 'Mean Molecular Weight (μ)', unit: 'dimensionless', placeholder: 0.6 },
      ],
      calculate: (inp) => {
        const rho = inp.density || 1e-15;
        const T = inp.temp || 10000;
        const mu = inp.mu || 0.6;
        const numberDensity = rho / (mu * m_p);
        const P = numberDensity * k_B * T;

        return {
          results: [
            { label: 'Thermal Pressure (P)', value: P.toExponential(3), unit: 'Pascals (Pa)', description: 'Gas pressure.' },
            { label: 'Particle Number Density (n)', value: numberDensity.toExponential(3), unit: 'particles/m³', description: 'Number density.' }
          ],
          steps: [
            `n = ρ / (μ m_p) = ${numberDensity.toExponential(3)} m⁻³`,
            `P = n k_B T = ${P.toExponential(3)} Pa`
          ]
        };
      }
    },
    {
      id: 'maxwell-boltzmann',
      name: 'Maxwell-Boltzmann Thermal Velocity',
      category: 'math',
      icon: Zap,
      description: 'Calculate root-mean-square thermal speed of gas particles at temperature T.',
      formula: 'v_{rms} = \\sqrt{\\frac{3 k_B T}{m}}',
      variables: [
        { key: 'temp', label: 'Temperature (T)', unit: 'Kelvin (K)', placeholder: 10000 },
        { key: 'mass', label: 'Particle Mass (m)', unit: 'kg', placeholder: 1.673e-27 },
      ],
      calculate: (inp) => {
        const T = inp.temp || 10000;
        const m = inp.mass || 1.673e-27;
        const v_rms = Math.sqrt((3 * k_B * T) / m);

        return {
          results: [
            { label: 'RMS Thermal Speed (v_rms)', value: (v_rms / 1000).toFixed(3), unit: 'km/s', description: 'Average thermal velocity.' }
          ],
          steps: [
            `k_B = 1.3806 × 10⁻²³ J/K`,
            `v_rms = √(3 k_B T / m) = ${(v_rms / 1000).toFixed(3)} km/s`
          ]
        };
      }
    },
    {
      id: 'radioactive-decay',
      name: 'Radioactive Decay Law',
      category: 'math',
      icon: Zap,
      description: 'Calculate remaining radioactive isotope abundance over time.',
      formula: 'N(t) = N_0 e^{-\\lambda t}',
      variables: [
        { key: 'n0', label: 'Initial Quantity (N₀)', unit: 'atoms', placeholder: 1000 },
        { key: 'halfLife', label: 'Half-Life (t₁/₂)', unit: 'Years', placeholder: 5730 },
        { key: 'timeElapsed', label: 'Elapsed Time (t)', unit: 'Years', placeholder: 11460 },
      ],
      calculate: (inp) => {
        const N0 = inp.n0 || 1000;
        const t_half = inp.halfLife || 5730;
        const t = inp.timeElapsed || 11460;
        const N = N0 * Math.pow(2, -t / t_half);

        return {
          results: [
            { label: 'Remaining Quantity (N)', value: N.toExponential(3), unit: 'atoms', description: 'Un-decayed isotope count.' }
          ],
          steps: [
            `N(t) = N₀ · 2^(-t / t_1/2)`,
            `N = ${N.toExponential(3)} atoms`
          ]
        };
      }
    },

    // 2. Quantum Mechanics & Modern Physics
    {
      id: 'de-broglie',
      name: 'de Broglie Wavelength',
      category: 'quantum',
      icon: Atom,
      description: 'Calculate matter wavelength of particles.',
      formula: '\\lambda = \\frac{h}{p}',
      variables: [
        { key: 'mass', label: 'Particle Mass (m)', unit: 'kg', placeholder: 9.109e-31 },
        { key: 'velocity', label: 'Velocity (v)', unit: 'm/s', placeholder: 1e6 },
      ],
      calculate: (inp) => {
        const m = inp.mass || 9.109e-31;
        const v = inp.velocity || 1e6;
        const p = m * v;
        const lambda = h / p;
        const lambdaNm = lambda * 1e9;

        const chartData = [0.2, 0.4, 0.6, 0.8, 1.0].map(f => {
          const testV = v * f;
          const testL = (h / (m * testV)) * 1e9;
          return { xLabel: `${(f*100).toFixed(0)}% v`, xVal: f, yVal: Number(testL.toFixed(2)) };
        });

        return {
          results: [
            { label: 'de Broglie Wavelength (λ)', value: lambdaNm < 1 ? lambda.toExponential(3) : lambdaNm.toFixed(4), unit: lambdaNm < 1 ? 'm' : 'nm', description: 'Matter wave length.' }
          ],
          steps: [
            `p = m × v = ${p.toExponential(3)}`,
            `λ = h / p = ${lambda.toExponential(3)} m`
          ],
          chartData
        };
      }
    },
    {
      id: 'photon-energy',
      name: 'Planck-Einstein Photon Energy',
      category: 'quantum',
      icon: Atom,
      description: 'Calculate photon energy from wavelength.',
      formula: 'E = \\frac{h c}{\\lambda}',
      variables: [
        { key: 'wavelength', label: 'Wavelength (λ)', unit: 'nm', placeholder: 500 },
      ],
      calculate: (inp) => {
        const lambda = (inp.wavelength || 500) * 1e-9;
        const E_ev = ((h * c) / lambda) / 1.602e-19;
        return {
          results: [
            { label: 'Photon Energy', value: E_ev.toFixed(3), unit: 'eV', description: 'Energy per photon.' }
          ],
          steps: [`E = hc / λ = ${E_ev.toFixed(3)} eV`]
        };
      }
    },
    {
      id: 'uncertainty-principle',
      name: 'Heisenberg Uncertainty Principle',
      category: 'quantum',
      icon: Atom,
      description: 'Calculate minimum quantum uncertainty product.',
      formula: '\\Delta x \\cdot \\Delta p \\ge \\frac{\\hbar}{2}',
      variables: [
        { key: 'deltaX', label: 'Position Uncertainty (Δx)', unit: 'meters', placeholder: 1e-10 },
      ],
      calculate: (inp) => {
        const dx = inp.deltaX || 1e-10;
        const minDp = hbar / (2 * dx);
        return {
          results: [
            { label: 'Min Momentum Uncertainty', value: minDp.toExponential(3), unit: 'kg·m/s', description: 'Minimum allowed variance.' }
          ],
          steps: [`Δp ≥ ℏ / 2Δx = ${minDp.toExponential(3)}`]
        };
      }
    },
    {
      id: 'hydrogen-energy-levels',
      name: 'Hydrogen Atom Energy Levels (Bohr)',
      category: 'quantum',
      icon: Atom,
      description: 'Calculate electron orbital energy level in hydrogen.',
      formula: 'E_n = -13.6 \\frac{Z^2}{n^2} \\text{ eV}',
      variables: [
        { key: 'n', label: 'Principal Quantum Number (n)', unit: 'dimensionless', placeholder: 1 },
        { key: 'z', label: 'Atomic Number (Z)', unit: 'dimensionless', placeholder: 1 },
      ],
      calculate: (inp) => {
        const n = Math.max(1, Math.round(inp.n || 1));
        const Z = inp.z || 1;
        const E_n = -13.6 * Math.pow(Z, 2) / Math.pow(n, 2);

        return {
          results: [
            { label: 'Orbital Energy (E_n)', value: E_n.toFixed(3), unit: 'eV', description: 'Electron bound state energy.' }
          ],
          steps: [
            `n = ${n}, Z = ${Z}`,
            `E_n = -13.6 × (Z² / n²) = ${E_n.toFixed(3)} eV`
          ]
        };
      }
    },
    {
      id: 'quantum-harmonic-oscillator',
      name: 'Quantum Harmonic Oscillator Energy (PhD)',
      category: 'quantum',
      icon: Atom,
      description: 'Calculate energy eigenvalues for a quantum harmonic oscillator.',
      formula: 'E_n = \\hbar \\omega \\left(n + \\frac{1}{2}\\right)',
      variables: [
        { key: 'freqHz', label: 'Oscillation Frequency (ν)', unit: 'Hz', placeholder: 1e13 },
        { key: 'n', label: 'Quantum Level (n)', unit: 'dimensionless', placeholder: 0 },
      ],
      calculate: (inp) => {
        const nu = inp.freqHz || 1e13;
        const n = Math.max(0, Math.round(inp.n || 0));
        const omega = 2 * Math.PI * nu;
        const E = hbar * omega * (n + 0.5);
        const E_eV = E / 1.602176634e-19;

        return {
          results: [
            { label: 'Energy Eigenvalue (E_n)', value: E.toExponential(3), unit: 'Joules (J)', description: 'Quantum energy level.' },
            { label: 'Energy in Electron-Volts', value: E_eV.toFixed(4), unit: 'eV', description: 'Energy in eV.' }
          ],
          steps: [
            `ω = 2πν = ${omega.toExponential(3)} rad/s`,
            `E_n = ℏω(n + 1/2) = ${E.toExponential(3)} J`
          ]
        };
      }
    },
    {
      id: 'compton-scattering',
      name: 'Compton Wavelength Shift',
      category: 'quantum',
      icon: Atom,
      description: 'Calculate photon wavelength shift after scattering off an electron.',
      formula: '\\Delta \\lambda = \\frac{h}{m_e c} (1 - \\cos\\theta)',
      variables: [
        { key: 'angleDeg', label: 'Scattering Angle (θ)', unit: 'degrees', placeholder: 90 },
      ],
      calculate: (inp) => {
        const angleRad = ((inp.angleDeg || 90) * Math.PI) / 180;
        const lambdaC = h / (m_e * c);
        const deltaLambda = lambdaC * (1 - Math.cos(angleRad));

        return {
          results: [
            { label: 'Wavelength Shift (Δλ)', value: deltaLambda.toExponential(3), unit: 'meters', description: 'Shift in photon wavelength.' }
          ],
          steps: [
            `h / (m_e c) = 2.426 × 10⁻¹² m`,
            `Δλ = (h / m_e c)(1 - cos θ) = ${deltaLambda.toExponential(3)} m`
          ]
        };
      }
    },

    // 3. Orbital Mechanics & Astrodynamics
    {
      id: 'orbital-velocity',
      name: 'Orbital & Escape Velocity',
      category: 'orbital',
      icon: Rocket,
      description: 'Calculate circular orbital and escape velocity.',
      formula: 'v_{orb} = \\sqrt{\\frac{GM}{r}}',
      variables: [
        { key: 'mass', label: 'Central Mass (M)', unit: 'Solar Masses', placeholder: 1.0 },
        { key: 'radius', label: 'Orbital Radius (r)', unit: 'km', placeholder: 7000 },
      ],
      calculate: (inp) => {
        const M = (inp.mass || 1) * M_sun;
        const r = (inp.radius || 7000) * 1000;
        const vOrb = Math.sqrt((G * M) / r) / 1000;
        const vEsc = Math.sqrt((2 * G * M) / r) / 1000;

        const chartData = [1, 2, 3, 4, 5].map(f => {
          const testR = r * f;
          const testV = Math.sqrt((G * M) / testR) / 1000;
          return { xLabel: `${f}r`, xVal: f, yVal: Number(testV.toFixed(2)) };
        });

        return {
          results: [
            { label: 'Orbital Velocity', value: vOrb.toFixed(3), unit: 'km/s', description: 'Circular orbit speed.' },
            { label: 'Escape Velocity', value: vEsc.toFixed(3), unit: 'km/s', description: 'Escape speed.' }
          ],
          steps: [`v_orb = ${vOrb.toFixed(3)} km/s`, `v_esc = ${vEsc.toFixed(3)} km/s`],
          chartData
        };
      }
    },
    {
      id: 'keplers-third-law',
      name: "Kepler's Third Law (Harmonic)",
      category: 'orbital',
      icon: Compass,
      description: "Relates orbital period to semi-major axis.",
      formula: 'T^2 = \\frac{4\\pi^2}{G(M_1+M_2)} a^3',
      variables: [
        { key: 'semiMajorAxis', label: 'Semi-Major Axis (a)', unit: 'AU', placeholder: 1.0 },
        { key: 'totalMass', label: 'Total Mass (M)', unit: 'Solar Masses', placeholder: 1.0 },
      ],
      calculate: (inp) => {
        const a = inp.semiMajorAxis || 1;
        const M = inp.totalMass || 1;
        const T = Math.sqrt(Math.pow(a, 3) / M);
        return {
          results: [{ label: 'Orbital Period', value: T.toFixed(3), unit: 'Years', description: 'Revolution time.' }],
          steps: [`T = √(a³ / M) = ${T.toFixed(3)} years`]
        };
      }
    },
    {
      id: 'tsiolkovsky-rocket',
      name: 'Tsiolkovsky Rocket Equation',
      category: 'orbital',
      icon: Zap,
      description: 'Spacecraft delta-v capacity.',
      formula: '\\Delta v = I_{sp} g_0 \\ln(m_0/m_f)',
      variables: [
        { key: 'isp', label: 'Specific Impulse (I_sp)', unit: 's', placeholder: 450 },
        { key: 'm0', label: 'Initial Mass (m₀)', unit: 'kg', placeholder: 1000 },
        { key: 'mf', label: 'Final Mass (m_f)', unit: 'kg', placeholder: 200 },
      ],
      calculate: (inp) => {
        const dv = (inp.isp || 450) * 9.80665 * Math.log((inp.m0 || 1000) / (inp.mf || 200));
        return {
          results: [{ label: 'Delta-v', value: (dv / 1000).toFixed(3), unit: 'km/s', description: 'Velocity boost.' }],
          steps: [`Δv = ${(dv / 1000).toFixed(3)} km/s`]
        };
      }
    },
    {
      id: 'hohmann-transfer',
      name: 'Hohmann Transfer Orbit & Delta-v',
      category: 'orbital',
      icon: Rocket,
      description: 'Calculate fuel costs and transfer time between circular orbits.',
      formula: 'a_{transfer} = \\frac{r_1 + r_2}{2}',
      variables: [
        { key: 'r1', label: 'Initial Orbit Radius (r₁)', unit: 'km', placeholder: 7000 },
        { key: 'r2', label: 'Target Orbit Radius (r₂)', unit: 'km', placeholder: 42164 },
        { key: 'centralMass', label: 'Central Mass (M)', unit: 'Solar Masses', placeholder: 1.0 },
      ],
      calculate: (inp) => {
        const r1 = (inp.r1 || 7000) * 1000;
        const r2 = (inp.r2 || 42164) * 1000;
        const M = (inp.centralMass || 1) * M_sun;

        const a_t = (r1 + r2) / 2;
        const v1 = Math.sqrt((G * M) / r1);
        const v_t1 = Math.sqrt(G * M * ((2 / r1) - (1 / a_t)));
        const dv1 = Math.abs(v_t1 - v1);

        const v2 = Math.sqrt((G * M) / r2);
        const v_t2 = Math.sqrt(G * M * ((2 / r2) - (1 / a_t)));
        const dv2 = Math.abs(v2 - v_t2);

        const totalDv = (dv1 + dv2) / 1000;
        const transferTimeSec = Math.PI * Math.sqrt(Math.pow(a_t, 3) / (G * M));
        const transferDays = transferTimeSec / 86400;

        return {
          results: [
            { label: 'Total Transfer Delta-v', value: totalDv.toFixed(3), unit: 'km/s', description: 'Required velocity change.' },
            { label: 'Transfer Time', value: transferDays >= 1 ? transferDays.toFixed(2) : (transferTimeSec / 3600).toFixed(1), unit: transferDays >= 1 ? 'Days' : 'Hours', description: 'Flight duration.' }
          ],
          steps: [
            `Semi-major axis a_t = ${(a_t / 1000).toFixed(1)} km`,
            `Total Δv = ${totalDv.toFixed(3)} km/s`,
            `Transfer duration = ${transferDays >= 1 ? transferDays.toFixed(2) + ' days' : (transferTimeSec / 3600).toFixed(1) + ' hours'}`
          ]
        };
      }
    },
    {
      id: 'vis-viva',
      name: 'Vis-Viva Orbital Equation',
      category: 'orbital',
      icon: Compass,
      description: 'Calculate orbital speed at any distance in an elliptic or hyperbolic orbit.',
      formula: 'v^2 = GM \\left(\\frac{2}{r} - \\frac{1}{a}\\right)',
      variables: [
        { key: 'r', label: 'Current Distance (r)', unit: 'km', placeholder: 10000 },
        { key: 'a', label: 'Semi-Major Axis (a)', unit: 'km', placeholder: 20000 },
        { key: 'mass', label: 'Central Mass (M)', unit: 'Solar Masses', placeholder: 1.0 },
      ],
      calculate: (inp) => {
        const r = (inp.r || 10000) * 1000;
        const a = (inp.a || 20000) * 1000;
        const M = (inp.mass || 1) * M_sun;
        const v = Math.sqrt(G * M * ((2 / r) - (1 / a))) / 1000;

        return {
          results: [
            { label: 'Orbital Speed (v)', value: v.toFixed(3), unit: 'km/s', description: 'Speed at distance r.' }
          ],
          steps: [
            `v = √(GM (2/r - 1/a)) = ${v.toFixed(3)} km/s`
          ]
        };
      }
    },

    // 4. Cosmology & General Relativity (PhD Level)
    {
      id: 'friedmann-equation-phd',
      name: 'Friedmann Cosmological Equation (PhD)',
      category: 'cosmology',
      icon: Globe,
      description: 'Calculate expansion rate H(z) of the universe with matter, radiation, and dark energy.',
      formula: 'H(z)^2 = H_0^2 \\left[ \\Omega_{r0}(1+z)^4 + \\Omega_{m0}(1+z)^3 + \\Omega_{\\Lambda0} \\right]',
      variables: [
        { key: 'z', label: 'Redshift (z)', unit: 'dimensionless', placeholder: 1.0 },
        { key: 'h0', label: 'Hubble Constant (H₀)', unit: 'km/s/Mpc', placeholder: 70 },
        { key: 'omegaM', label: 'Matter Density (Ω_m0)', unit: 'dimensionless', placeholder: 0.3 },
        { key: 'omegaLambda', label: 'Dark Energy Density (Ω_Λ0)', unit: 'dimensionless', placeholder: 0.7 },
      ],
      calculate: (inp) => {
        const z = Math.max(0, inp.z || 1.0);
        const H0 = inp.h0 || 70;
        const om = inp.omegaM || 0.3;
        const ol = inp.omegaLambda || 0.7;
        const or = 9e-5; // radiation density parameter today

        const Hz = H0 * Math.sqrt(or * Math.pow(1 + z, 4) + om * Math.pow(1 + z, 3) + ol);

        return {
          results: [
            { label: 'Hubble Parameter H(z)', value: Hz.toFixed(2), unit: 'km/s/Mpc', description: 'Expansion rate at redshift z.' }
          ],
          steps: [
            `H(z) = H₀ √(Ω_r(1+z)⁴ + Ω_m(1+z)³ + Ω_Λ)`,
            `H(${z}) = ${Hz.toFixed(2)} km/s/Mpc`
          ]
        };
      }
    },
    {
      id: 'schwarzschild-radius',
      name: 'Schwarzschild Radius',
      category: 'cosmology',
      icon: Zap,
      description: 'Event horizon radius of a black hole.',
      formula: 'r_s = \\frac{2GM}{c^2}',
      variables: [
        { key: 'mass', label: 'Mass (M)', unit: 'Solar Masses', placeholder: 10 },
      ],
      calculate: (inp) => {
        const rs = ((2 * G * ((inp.mass || 10) * M_sun)) / Math.pow(c, 2)) / 1000;
        return {
          results: [{ label: 'Schwarzschild Radius', value: rs.toFixed(2), unit: 'km', description: 'Event horizon size.' }],
          steps: [`r_s = ${rs.toFixed(2)} km`]
        };
      }
    },
    {
      id: 'hawking-temperature',
      name: 'Hawking Black Hole Temperature (PhD)',
      category: 'cosmology',
      icon: Atom,
      description: 'Calculate quantum Hawking radiation temperature of a black hole.',
      formula: 'T_H = \\frac{\\hbar c^3}{8 \\pi G M k_B}',
      variables: [
        { key: 'mass', label: 'Black Hole Mass (M)', unit: 'Solar Masses', placeholder: 1.0 },
      ],
      calculate: (inp) => {
        const M = (inp.mass || 1.0) * M_sun;
        const T_h = (hbar * Math.pow(c, 3)) / (8 * Math.PI * G * M * k_B);

        return {
          results: [
            { label: 'Hawking Temperature (T_H)', value: T_h.toExponential(3), unit: 'Kelvin (K)', description: 'Thermal radiation temperature.' }
          ],
          steps: [
            `T_H = ℏc³ / (8πG M k_B) = ${T_h.toExponential(3)} K`
          ]
        };
      }
    },
    {
      id: 'gravitational-time-dilation',
      name: 'Gravitational Time Dilation',
      category: 'cosmology',
      icon: Globe,
      description: 'Calculate time slowdown near a massive body or black hole.',
      formula: 't_0 = t_f \\sqrt{1 - \\frac{r_s}{r}}',
      variables: [
        { key: 'mass', label: 'Central Mass (M)', unit: 'Solar Masses', placeholder: 10 },
        { key: 'r', label: 'Radial Distance (r)', unit: 'km', placeholder: 50 },
      ],
      calculate: (inp) => {
        const M = (inp.mass || 10) * M_sun;
        const r = (inp.r || 50) * 1000;
        const rs = (2 * G * M) / Math.pow(c, 2);

        if (r <= rs) {
          return {
            results: [{ label: 'Error', value: 'Inside Event Horizon', unit: 'Condition', description: 'Radius is inside or at Schwarzschild radius.' }],
            steps: [`r must be greater than r_s (${(rs/1000).toFixed(2)} km)`]
          };
        }

        const dilationFactor = Math.sqrt(1 - (rs / r));

        return {
          results: [
            { label: 'Time Dilation Factor (t_0 / t_f)', value: dilationFactor.toFixed(6), unit: 'dimensionless', description: 'Clock ticking ratio.' }
          ],
          steps: [
            `r_s = ${(rs/1000).toFixed(2)} km`,
            `Factor = √(1 - r_s/r) = ${dilationFactor.toFixed(6)}`
          ]
        };
      }
    },
    {
      id: 'cmb-temperature',
      name: 'CMB Temperature Evolution',
      category: 'cosmology',
      icon: Globe,
      description: 'Calculate Cosmic Microwave Background temperature at any redshift z.',
      formula: 'T(z) = T_0 (1 + z)',
      variables: [
        { key: 'z', label: 'Redshift (z)', unit: 'dimensionless', placeholder: 1080 },
      ],
      calculate: (inp) => {
        const z = Math.max(0, inp.z || 1080);
        const T0 = 2.7255;
        const T_z = T0 * (1 + z);

        return {
          results: [
            { label: 'CMB Temperature T(z)', value: T_z >= 1000 ? T_z.toExponential(3) : T_z.toFixed(2), unit: 'Kelvin (K)', description: 'Radiation temperature at redshift z.' }
          ],
          steps: [
            `T_0 = 2.7255 K`,
            `T(z) = 2.7255 × (1 + ${z}) = ${T_z.toFixed(2)} K`
          ]
        };
      }
    },

    // 5. Stellar Astrophysics & Advanced PhD Astrophysics
    {
      id: 'stefan-boltzmann-lum',
      name: 'Stellar Luminosity (Stefan-Boltzmann)',
      category: 'stellar',
      icon: Sun,
      description: 'Total stellar energy output.',
      formula: 'L = 4\\pi R^2 \\sigma T^4',
      variables: [
        { key: 'radius', label: 'Radius (R)', unit: 'Solar Radii', placeholder: 1.0 },
        { key: 'temp', label: 'Temperature (T)', unit: 'K', placeholder: 5778 },
      ],
      calculate: (inp) => {
        const R = (inp.radius || 1) * R_sun;
        const T = inp.temp || 5778;
        const L = (4 * Math.PI * Math.pow(R, 2) * sigma_SB * Math.pow(T, 4)) / L_sun;
        return {
          results: [{ label: 'Luminosity', value: L > 1000 ? L.toExponential(3) : L.toFixed(2), unit: 'Solar Luminosities (L☉)', description: 'Power output.' }],
          steps: [`L = ${L.toFixed(2)} L☉`]
        };
      }
    },
    {
      id: 'eddington-luminosity',
      name: 'Eddington Luminosity Limit (PhD)',
      category: 'stellar',
      icon: Sun,
      description: 'Maximum luminosity a star or accretion disk can achieve before radiation pressure overcomes gravity.',
      formula: 'L_{ed} = \\frac{4 \\pi G M c}{\\kappa}',
      variables: [
        { key: 'mass', label: 'Mass (M)', unit: 'Solar Masses', placeholder: 10 },
      ],
      calculate: (inp) => {
        const M = (inp.mass || 10) * M_sun;
        const kappa = 0.04; // electron scattering opacity m^2/kg
        const L_ed = (4 * Math.PI * G * M * c) / kappa;
        const L_ed_solar = L_ed / L_sun;

        return {
          results: [
            { label: 'Eddington Luminosity', value: L_ed_solar > 1e6 ? L_ed_solar.toExponential(3) : L_ed_solar.toFixed(2), unit: 'Solar Luminosities (L☉)', description: 'Max stable luminosity.' }
          ],
          steps: [
            `L_ed = 4πGM,c / κ = ${L_ed_solar.toExponential(3)} L☉`
          ]
        };
      }
    },
    {
      id: 'chandrasekhar-mass',
      name: 'Chandrasekhar Mass Limit',
      category: 'stellar',
      icon: Sun,
      description: 'Maximum white dwarf mass.',
      formula: 'M_{ch} \\approx \\frac{5.83}{\\mu_e^2} M_\\odot',
      variables: [
        { key: 'muE', label: 'Mean Molecular Weight (μ_e)', unit: 'dimensionless', placeholder: 2.0 },
      ],
      calculate: (inp) => {
        const mCh = 5.83 / Math.pow(inp.muE || 2.0, 2);
        return {
          results: [{ label: 'Chandrasekhar Limit', value: mCh.toFixed(2), unit: 'Solar Masses', description: 'Degeneracy limit.' }],
          steps: [`M_ch = ${mCh.toFixed(2)} M☉`]
        };
      }
    },
    {
      id: 'tully-fisher',
      name: 'Tully-Fisher Relation (Galactic Astrophysics)',
      category: 'stellar',
      icon: Sun,
      description: 'Relates spiral galaxy luminosity to maximum rotation velocity.',
      formula: 'L = A \\cdot v_{max}^4',
      variables: [
        { key: 'vMax', label: 'Max Rotation Velocity (v_max)', unit: 'km/s', placeholder: 200 },
      ],
      calculate: (inp) => {
        const v = inp.vMax || 200;
        // calibration constant for L in L_sun approx 50 * v^4
        const L = 50 * Math.pow(v, 4);
        const L_solar = L / L_sun;

        return {
          results: [
            { label: 'Estimated Galaxy Luminosity', value: L_solar > 1000 ? L_solar.toExponential(3) : L_solar.toFixed(2), unit: 'Solar Luminosities (L☉)', description: 'Galactic mass-luminosity relation.' }
          ],
          steps: [
            `L ∝ v_max⁴`,
            `L = ${L_solar.toExponential(3)} L☉`
          ]
        };
      }
    },

    // 6. Astrometry & Exoplanets
    {
      id: 'stellar-parallax',
      name: 'Stellar Parallax & Distance',
      category: 'astrometry',
      icon: Eye,
      description: 'Distance in parsecs from parallax angle.',
      formula: 'd = \\frac{1}{p}',
      variables: [
        { key: 'parallax', label: 'Parallax (p)', unit: 'mas', placeholder: 100 },
      ],
      calculate: (inp) => {
        const d_pc = 1 / ((inp.parallax || 100) / 1000);
        return {
          results: [{ label: 'Distance', value: d_pc.toFixed(2), unit: 'Parsecs (pc)', description: 'Trigonometric distance.' }],
          steps: [`d = ${d_pc.toFixed(2)} pc (${(d_pc * pc_to_ly).toFixed(2)} ly)`]
        };
      }
    },
    {
      id: 'habitable-zone',
      name: 'Stellar Habitable Zone',
      category: 'astrometry',
      icon: Sun,
      description: 'Liquid water Goldilocks zone.',
      formula: 'd = \\sqrt{L / S}',
      variables: [
        { key: 'luminosity', label: 'Luminosity (L)', unit: 'Solar Luminosities', placeholder: 1.0 },
      ],
      calculate: (inp) => {
        const L = inp.luminosity || 1;
        const d_in = Math.sqrt(L / 1.11);
        const d_outer = Math.sqrt(L / 0.28);
        return {
          results: [
            { label: 'Inner Boundary', value: d_in.toFixed(3), unit: 'AU', description: 'Runaway greenhouse.' },
            { label: 'Outer Boundary', value: d_outer.toFixed(3), unit: 'AU', description: 'Max greenhouse.' }
          ],
          steps: [`Inner: ${d_in.toFixed(3)} AU`, `Outer: ${d_outer.toFixed(3)} AU`]
        };
      }
    },
    {
      id: 'exoplanet-transit',
      name: 'Exoplanet Transit Depth',
      category: 'astrometry',
      icon: Eye,
      description: 'Photometric light curve flux drop during transit.',
      formula: '\\frac{\\Delta F}{F} = \\left(\\frac{R_p}{R_*}\\right)^2',
      variables: [
        { key: 'planetRadiusEarth', label: 'Planet Radius (R_p)', unit: 'Earth Radii', placeholder: 1.0 },
        { key: 'starRadiusSun', label: 'Star Radius (R_*)', unit: 'Solar Radii', placeholder: 1.0 },
      ],
      calculate: (inp) => {
        const R_earth_m = 6.371e6;
        const R_sun_m = 6.9634e8;
        const Rp = (inp.planetRadiusEarth || 1.0) * R_earth_m;
        const Rs = (inp.starRadiusSun || 1.0) * R_sun_m;
        const depthRatio = Math.pow(Rp / Rs, 2);
        const depthPpm = depthRatio * 1e6;

        return {
          results: [
            { label: 'Transit Depth', value: depthPpm.toFixed(1), unit: 'ppm (parts per million)', description: 'Flux drop.' }
          ],
          steps: [
            `R_p / R_* = ${(Rp / Rs).toFixed(5)}`,
            `Transit Depth = ${depthPpm.toFixed(1)} ppm`
          ]
        };
      }
    },
    {
      id: 'distance-modulus',
      name: 'Distance Modulus',
      category: 'astrometry',
      icon: Eye,
      description: 'Relates apparent and absolute magnitude to stellar distance.',
      formula: 'm - M = 5 \\log_{10}(d) - 5',
      variables: [
        { key: 'apparentMag', label: 'Apparent Magnitude (m)', unit: 'mag', placeholder: 10 },
        { key: 'absoluteMag', label: 'Absolute Magnitude (M)', unit: 'mag', placeholder: 0 },
      ],
      calculate: (inp) => {
        const m = inp.apparentMag || 10;
        const M = inp.absoluteMag || 0;
        const distPc = Math.pow(10, (m - M + 5) / 5);
        const distLy = distPc * pc_to_ly;

        return {
          results: [
            { label: 'Distance', value: distPc >= 1000 ? (distPc / 1000).toFixed(2) : distPc.toFixed(1), unit: distPc >= 1000 ? 'kiloparsecs (kpc)' : 'parsecs (pc)', description: 'Distance from magnitudes.' },
            { label: 'Distance in Light-Years', value: distLy >= 1000 ? (distLy / 1000).toFixed(2) : distLy.toFixed(1), unit: distLy >= 1000 ? 'thousand ly' : 'light-years (ly)', description: 'Light travel distance.' }
          ],
          steps: [
            `m - M = ${m - M}`,
            `d = 10^((m - M + 5)/5) = ${distPc.toFixed(1)} pc`
          ]
        };
      }
    }
  ];

  const currentCalc = calculators.find(c => c.id === selectedCalc) || calculators[0];
  const currentCalcB = calculators.find(c => c.id === selectedCalcB) || calculators[1];

  useEffect(() => {
    const initialVals: Record<string, number> = {};
    currentCalc.variables.forEach(v => { initialVals[v.key] = v.placeholder; });
    setInputs(initialVals);
  }, [selectedCalc]);

  useEffect(() => {
    const initialValsB: Record<string, number> = {};
    currentCalcB.variables.forEach(v => { initialValsB[v.key] = v.placeholder; });
    setInputsB(initialValsB);
  }, [selectedCalcB]);

  const handleInputChange = (key: string, value: number, isB = false) => {
    if (isB) setInputsB(prev => ({ ...prev, [key]: value }));
    else setInputs(prev => ({ ...prev, [key]: value }));
  };

  const calculationResult = currentCalc.calculate(inputs);
  const calculationResultB = dualMode ? currentCalcB.calculate(inputsB) : null;

  // Scaling meters for VisualScalingChart
  let scalingMeters = 0;
  let scalingTitle = "";
  if (selectedCalc === 'schwarzschild-radius') {
    const M = (inputs.mass || 10) * M_sun;
    scalingMeters = (2 * G * M) / Math.pow(c, 2);
    scalingTitle = "Event Horizon Radius (r_s)";
  } else if (selectedCalc === 'stefan-boltzmann-lum') {
    scalingMeters = (inputs.radius || 1) * R_sun;
    scalingTitle = "Stellar Radius (R)";
  } else if (selectedCalc === 'habitable-zone') {
    const L = inputs.luminosity || 1;
    scalingMeters = Math.sqrt(L / 1.11) * AU;
    scalingTitle = "Inner Habitable Boundary";
  } else if (selectedCalc === 'orbital-velocity') {
    scalingMeters = (inputs.radius || 7000) * 1000;
    scalingTitle = "Orbital Radius (r)";
  }

  const saveCurrentCalculation = () => {
    const newItem = {
      id: Date.now().toString(),
      name: currentCalc.name,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      inputs: { ...inputs },
      results: calculationResult.results
    };
    setSavedCalculations(prev => [newItem, ...prev.slice(0, 9)]);
  };

  const handleShareCalculation = () => {
    const params = new URLSearchParams();
    params.set('calc', currentCalc.id);
    params.set('inputs', encodeURIComponent(JSON.stringify(inputs)));
    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;

    navigator.clipboard.writeText(shareUrl).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    });
  };

  // Universal search / AI ask handler
  const handleUniversalSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!universalQuery.trim()) return;

    const matched = calculators.find(c => c.name.toLowerCase().includes(universalQuery.toLowerCase()) || c.id.includes(universalQuery.toLowerCase()));
    if (matched) {
      setSelectedCalc(matched.id);
      setActiveCategory(matched.category);
      setUniversalQuery('');
    } else {
      setActiveCategory('ai-tutor');
      const q = universalQuery;
      setUniversalQuery('');
      setAiMessages(prev => [...prev, { role: 'user', content: q }]);
      setAiLoading(true);

      try {
        const res = await fetch('/api/ai-solve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: q })
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setAiMessages(prev => [...prev, { role: 'assistant', content: data.result }]);
      } catch (err: any) {
        setAiMessages(prev => [...prev, { role: 'assistant', content: `Error: ${err.message}` }]);
      } finally {
        setAiLoading(false);
      }
    }
  };

  // AI Chat handler
  const handleAiSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim() || aiLoading) return;

    const userMessage = aiInput.trim();
    setAiInput('');
    setAiMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setAiLoading(true);

    try {
      const res = await fetch('/api/ai-solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMessage,
          calculatorContext: {
            activeCalculator: currentCalc.name,
            formula: currentCalc.formula,
            inputs,
            results: calculationResult.results
          }
        })
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setAiMessages(prev => [...prev, { role: 'assistant', content: data.result }]);
    } catch (err: any) {
      setAiMessages(prev => [...prev, { role: 'assistant', content: `Sorry, I encountered an error communicating with the Cosmic AI: ${err.message || 'Unknown error'}` }]);
    } finally {
      setAiLoading(false);
      setTimeout(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, 100);
    }
  };

  const categories = [
    { id: 'math', label: 'Math & Physics', icon: Zap },
    { id: 'quantum', label: 'Quantum Mechanics', icon: Atom },
    { id: 'orbital', label: 'Orbital Mechanics', icon: Rocket },
    { id: 'cosmology', label: 'Cosmology & Relativity', icon: Globe },
    { id: 'stellar', label: 'Stellar Astrophysics', icon: Sun },
    { id: 'astrometry', label: 'Astrometry & Planets', icon: Sparkles },
    { id: 'starchart', label: 'Nearby Star Chart', icon: Map },
    { id: 'sandbox', label: 'Equation Sandbox', icon: Code2 },
    { id: 'history', label: 'Global History', icon: History },
    { id: 'ai-tutor', label: 'AI Cosmic Tutor', icon: Cpu },
  ];

  // Sidebar search filter: search across active category or globally if query is typed
  const filteredCalculators = calculators.filter(c => {
    const matchesCat = searchQuery.trim() ? true : c.category === activeCategory;
    const matchesQuery = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const renderCalculatorBox = (calc: CalculatorDef, inp: Record<string, number>, res: ReturnType<CalculatorDef['calculate']>, isB = false) => {
    return (
      <div className="bg-slate-900/80 border border-white/10 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col h-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isB ? 'Comparison Calculator (B)' : 'Primary Calculator (A)'}</span>
            </div>
            {dualMode ? (
              <select
                value={calc.id}
                onChange={(e) => {
                  if (isB) setSelectedCalcB(e.target.value);
                  else setSelectedCalc(e.target.value);
                }}
                className="bg-slate-950 border border-cyan-500/40 rounded-xl px-3 py-1.5 text-white text-lg font-bold focus:outline-none"
              >
                {calculators.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            ) : (
              <h2 className="text-2xl font-black text-white">{calc.name}</h2>
            )}
            <p className="text-sm text-slate-400 mt-1">{calc.description}</p>
          </div>
          {!isB && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsReportOpen(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 hover:from-cyan-500/30 hover:to-indigo-500/30 border border-cyan-500/40 px-4 py-2.5 rounded-xl text-xs font-medium text-cyan-300 transition-colors shadow-lg"
              >
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>PDF Report</span>
              </button>
              <button
                onClick={handleShareCalculation}
                className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-white/10 px-4 py-2.5 rounded-xl text-xs font-medium text-cyan-300 transition-colors shadow-lg"
              >
                {shareCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-cyan-400" />}
                <span>{shareCopied ? 'Link Copied!' : 'Share'}</span>
              </button>
              <button
                onClick={saveCurrentCalculation}
                className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-white/10 px-4 py-2.5 rounded-xl text-xs font-medium text-slate-200 transition-colors shadow-lg"
              >
                <Bookmark className="w-4 h-4 text-cyan-400" />
                <span>Save</span>
              </button>
            </div>
          )}
        </div>

        {/* Formula Badge */}
        <div className="my-6 bg-slate-950/80 border border-cyan-500/30 rounded-xl p-4 flex items-center justify-between overflow-x-auto">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Governing Equation</span>
            <div className="text-cyan-300 text-lg">
              <LatexMath math={calc.formula} />
            </div>
          </div>
        </div>

        {/* Clean Input Boxes (No Sliders) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
          {calc.variables.map((variable) => (
            <div key={variable.key} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-medium text-slate-300">{variable.label}</label>
                <span className="text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-lg">{variable.unit}</span>
              </div>
              <input
                type="number"
                value={inp[variable.key] ?? variable.placeholder}
                onChange={(e) => handleInputChange(variable.key, parseFloat(e.target.value) || 0, isB)}
                className="w-full bg-slate-950 border border-white/20 rounded-xl px-4 py-3 text-white font-mono text-base focus:outline-none focus:border-cyan-500 transition-colors shadow-inner"
              />
            </div>
          ))}
        </div>

        {/* Results Section */}
        <div className="mt-4 pt-6 border-t border-white/10 flex-grow">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>Results</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {res.results.map((r, idx) => (
              <div key={idx} className="bg-gradient-to-br from-slate-950/80 to-slate-900/80 border border-cyan-500/20 rounded-2xl p-4 shadow-xl relative overflow-hidden">
                <span className="text-xs font-medium text-slate-400 block mb-1">{r.label}</span>
                <div className="flex items-baseline space-x-2 my-1">
                  <span className="text-2xl font-black font-mono tracking-tight text-cyan-300">{r.value}</span>
                  <span className="text-xs font-semibold text-purple-300">{r.unit}</span>
                </div>
                {r.description && <p className="text-xs text-slate-400 mt-1">{r.description}</p>}
              </div>
            ))}
          </div>

          {/* Enhanced Interactive Graph with Type Toggle */}
          {res.chartData && res.chartData.length > 0 && (
            <div className="mt-6 bg-slate-950/80 border border-cyan-500/20 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
                  <BarChart2 className="w-4 h-4" />
                  <span>Relationship Curve</span>
                </h4>
                <div className="flex space-x-1 bg-slate-900 p-1 rounded-lg border border-white/10 text-xs">
                  <button
                    onClick={() => setGraphType('line')}
                    className={`px-2.5 py-1 rounded-md transition-colors ${graphType === 'line' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                  >
                    Curve
                  </button>
                  <button
                    onClick={() => setGraphType('bar')}
                    className={`px-2.5 py-1 rounded-md transition-colors ${graphType === 'bar' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                  >
                    Bars
                  </button>
                </div>
              </div>

              {graphType === 'bar' ? (
                <div className="h-40 w-full flex items-end space-x-3 pt-4 px-2 border-b border-white/10">
                  {res.chartData.map((pt, i) => {
                    const maxY = Math.max(...res.chartData!.map(p => p.yVal)) || 1;
                    const heightPct = Math.max(15, (pt.yVal / maxY) * 100);
                    return (
                      <div key={i} className="flex-grow flex flex-col items-center h-full justify-end group relative">
                        <div className="absolute -top-8 bg-slate-900 border border-cyan-500/40 text-cyan-300 text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                          {pt.xLabel}: {pt.yVal}
                        </div>
                        <div
                          className="w-full bg-gradient-to-t from-cyan-600 to-indigo-500 rounded-t-lg transition-all duration-500 group-hover:brightness-125"
                          style={{ height: `${heightPct}%` }}
                        ></div>
                        <span className="text-[10px] text-slate-400 mt-1 truncate w-full text-center">{pt.xLabel}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-40 w-full relative pt-4 px-2 border-b border-white/10 flex items-end">
                  <svg className="absolute inset-0 w-full h-full overflow-visible p-2">
                    <polyline
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="3"
                      points={res.chartData.map((pt, i) => {
                        const w = 300;
                        const h = 120;
                        const maxX = res.chartData!.length - 1 || 1;
                        const maxY = Math.max(...res.chartData!.map(p => p.yVal)) || 1;
                        const x = (i / maxX) * w;
                        const y = h - (pt.yVal / maxY) * h;
                        return `${x},${y}`;
                      }).join(' ')}
                    />
                  </svg>
                  <div className="w-full flex justify-between text-[10px] text-slate-400 z-10">
                    {res.chartData.map((pt, i) => (
                      <span key={i}>{pt.xLabel}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step by step derivation */}
          <div className="mt-6 bg-slate-950/60 border border-white/10 rounded-2xl p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span>Step-by-Step Breakdown</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
              {res.steps.map((step, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-cyan-400 shrink-0 font-bold">{idx + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen text-slate-100 font-sans relative overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      {/* Background Starry Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

      {/* Nebula ambient gradients */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl pointer-events-none z-0"></div>
      <div className="fixed bottom-10 right-1/4 w-[30rem] h-[30rem] bg-cyan-900/15 rounded-full blur-3xl pointer-events-none z-0"></div>

      {/* Main Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="border-b border-white/10 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 p-[1px] flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
                  <Atom className="w-6 h-6 text-cyan-400 animate-pulse" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-black tracking-wider bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  PHYCALC
                </h1>
                <p className="text-xs text-slate-400 tracking-wide">Middle School to PhD Math, Physics & Astrophysics Suite</p>
              </div>
            </div>

            {/* Universal Search Bar */}
            <div className="hidden md:block w-80">
              <form onSubmit={handleUniversalSearchSubmit} className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-cyan-400" />
                <input
                  type="text"
                  placeholder="Search formula or ask AI (Press Enter)..."
                  value={universalQuery}
                  onChange={(e) => setUniversalQuery(e.target.value)}
                  className="w-full bg-slate-900/90 border border-cyan-500/40 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-400 shadow-md"
                />
              </form>
            </div>

            {/* Controls & Dual Mode Toggle */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setDualMode(!dualMode)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-lg ${
                  dualMode
                    ? 'bg-cyan-500 text-slate-950 shadow-cyan-500/20'
                    : 'bg-slate-900 border border-white/10 text-cyan-300 hover:bg-slate-800'
                }`}
              >
                <Columns className="w-4 h-4" />
                <span>{dualMode ? 'Dual Mode ON' : 'Dual Compare'}</span>
              </button>

              <button
                onClick={() => setIsConverterOpen(true)}
                className="flex items-center space-x-2 bg-slate-900 border border-cyan-500/40 hover:bg-slate-800 px-4 py-2.5 rounded-xl text-xs font-semibold text-cyan-300 transition-all shadow-lg"
              >
                <ArrowRightLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Units Converter</span>
              </button>
            </div>
          </div>
        </header>

        {/* Category Navbar */}
        <nav className="border-b border-white/10 bg-slate-950/40 backdrop-blur-md overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-2 py-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id as Category);
                    if (cat.id !== 'ai-tutor' && cat.id !== 'sandbox' && cat.id !== 'history' && cat.id !== 'starchart') {
                      const firstInCat = calculators.find(c => c.category === cat.id);
                      if (firstInCat) setSelectedCalc(firstInCat.id);
                    }
                  }}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/40 text-cyan-300 shadow-lg shadow-cyan-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
          {activeCategory === 'starchart' ? (
            <StarChartMap />
          ) : activeCategory === 'sandbox' ? (
            <EquationSandbox />
          ) : activeCategory === 'history' ? (
            <GlobalHistoryView savedCalculations={savedCalculations} onClearHistory={() => setSavedCalculations([])} />
          ) : activeCategory === 'ai-tutor' ? (
            /* AI Cosmic Tutor View */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 bg-slate-900/60 border border-white/10 backdrop-blur-xl rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                      <Cpu className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">AI Cosmic Tutor</h2>
                      <p className="text-xs text-slate-400">Powered by Gemini 3.8 Flash</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    Your personal professor of mathematics, physics & astrophysics. Ask questions about algebra, calculus, relativity, quantum mechanics, stellar evolution, thermodynamics, or PhD cosmological equations.
                  </p>

                  <div className="space-y-2 mb-6">
                    <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Suggested Questions:</p>
                    {[
                      "Explain the Friedmann equation in PhD cosmology.",
                      "How does Hawking radiation derive from general relativity and quantum mechanics?",
                      "What is the Eddington luminosity limit for massive stars?",
                      "Derive the quantum harmonic oscillator energy eigenvalues."
                    ].map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => setAiInput(q)}
                        className="w-full text-left text-xs bg-slate-800/60 hover:bg-slate-800 border border-white/5 rounded-xl p-2.5 text-slate-300 transition-colors flex items-center justify-between group"
                      >
                        <span className="truncate pr-2">{q}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-slate-500 border-t border-white/10 pt-4">
                  💡 Tip: AI chatbot responses fully render KaTeX and LaTeX math equations!
                </div>
              </div>

              <div className="lg:col-span-2 bg-slate-900/60 border border-white/10 backdrop-blur-xl rounded-2xl p-6 flex flex-col h-[700px]">
                <div className="flex-grow overflow-y-auto pr-4 space-y-4 mb-4 scrollbar-thin scrollbar-thumb-slate-700">
                  {aiMessages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl px-5 py-4 text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/10'
                          : 'bg-slate-800/80 border border-white/10 text-slate-200'
                      }`}>
                        <div className="font-semibold text-xs mb-1 opacity-70">
                          {msg.role === 'user' ? 'You' : 'Professor Cosmos (AI)'}
                        </div>
                        <MarkdownLatexRenderer content={msg.content} />
                      </div>
                    </div>
                  ))}
                  {aiLoading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-800/80 border border-white/10 rounded-2xl px-5 py-4 text-sm text-cyan-400 flex items-center space-x-3">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Calculating parameters and formulating response with LaTeX...</span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <form onSubmit={handleAiSend} className="flex items-center space-x-3 pt-4 border-t border-white/10">
                  <input
                    type="text"
                    placeholder="Ask any math, physics or astrophysics question (middle school to PhD)..."
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    className="flex-grow bg-slate-950/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={aiLoading || !aiInput.trim()}
                    className="bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 text-slate-950 font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center space-x-2"
                  >
                    <span>Transmit</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* Calculators Grid View (Single or Dual Mode) */
            <div className={`grid grid-cols-1 ${dualMode ? 'lg:grid-cols-2' : 'lg:grid-cols-12'} gap-8`}>
              {/* Sidebar Selector with Search (Only in Single Mode) */}
              {!dualMode && (
                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-slate-900/60 border border-white/10 backdrop-blur-xl rounded-2xl p-4">
                    <div className="mb-3 px-2">
                      <h2 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2">
                        Calculators & Formulas
                      </h2>
                      <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search math, physics, PhD..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
                      {filteredCalculators.length === 0 ? (
                        <p className="text-xs text-slate-500 px-2 py-4 text-center">No calculators found matching "{searchQuery}"</p>
                      ) : (
                        filteredCalculators.map(calc => {
                          const Icon = calc.icon;
                          const isSelected = selectedCalc === calc.id;
                          return (
                            <button
                              key={calc.id}
                              onClick={() => {
                                setSelectedCalc(calc.id);
                                setActiveCategory(calc.category);
                              }}
                              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-left transition-all ${
                                isSelected
                                  ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-500/40 text-cyan-200 shadow-md'
                                  : 'hover:bg-white/5 text-slate-400 hover:text-slate-200 border border-transparent'
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-cyan-500/30 text-cyan-300' : 'bg-slate-800 text-slate-400'}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0 flex-grow">
                                <p className="text-sm font-medium truncate">{calc.name}</p>
                                <p className="text-xs text-slate-500 truncate">{calc.description}</p>
                              </div>
                              <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-600'}`} />
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Active Calculator Panel (or Dual Comparison Panels) */}
              <div className={dualMode ? 'lg:col-span-1 space-y-8' : 'lg:col-span-8 space-y-8'}>
                {renderCalculatorBox(currentCalc, inputs, calculationResult, false)}

                {/* Visual Scaling Comparison Chart (for spatial/radius calcs) */}
                {scalingMeters > 0 && !dualMode && (
                  <VisualScalingChart
                    title={scalingTitle}
                    calculatedValueInMeters={scalingMeters}
                    objectType={selectedCalc === 'orbital-velocity' ? 'distance' : 'radius'}
                  />
                )}
              </div>

              {/* Second Calculator Panel in Dual Mode */}
              {dualMode && (
                <div className="lg:col-span-1 space-y-8">
                  {renderCalculatorBox(currentCalcB, inputsB, calculationResultB!, true)}
                </div>
              )}
            </div>
          )}
        </main>

        {/* Units Converter Modal */}
        <UnitsConverterModal isOpen={isConverterOpen} onClose={() => setIsConverterOpen(false)} />

        {/* Scientific Report Modal */}
        <ScientificReportModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          calculatorName={currentCalc.name}
          formula={currentCalc.formula}
          inputs={inputs}
          results={calculationResult.results}
          steps={calculationResult.steps}
        />
      </div>
    </div>
  );
}

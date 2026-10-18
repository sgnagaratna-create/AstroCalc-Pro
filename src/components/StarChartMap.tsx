import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Sparkles, Eye, Compass } from "lucide-react";

interface StarSystem {
  name: string;
  constellation: string;
  spectralType: string;
  distanceLy: number;
  luminositySolar: number;
  x: number; // 2D projection coordinates
  y: number;
  labelOffset?: { x: number; y: number };
}

const nearbyStars: StarSystem[] = [
  { name: "The Sun", constellation: "Solar System", spectralType: "G2V", distanceLy: 0.000016, luminositySolar: 1.0, x: 0, y: 0, labelOffset: { x: 10, y: 4 } },
  { name: "Alpha Centauri A", constellation: "Centaurus", spectralType: "G2V", distanceLy: 4.37, luminositySolar: 1.519, x: 2.1, y: 3.8, labelOffset: { x: 10, y: -6 } },
  { name: "Alpha Centauri B", constellation: "Centaurus", spectralType: "K1V", distanceLy: 4.37, luminositySolar: 0.50, x: 2.3, y: 3.2, labelOffset: { x: 10, y: 12 } },
  { name: "Proxima Centauri", constellation: "Centaurus", spectralType: "M5.5Ve", distanceLy: 4.24, luminositySolar: 0.0017, x: 1.8, y: 4.5, labelOffset: { x: -65, y: 15 } },
  { name: "Barnard's Star", constellation: "Ophiuchus", spectralType: "M4.0V", distanceLy: 5.96, luminositySolar: 0.0004, x: -4.2, y: 4.2, labelOffset: { x: -65, y: -4 } },
  { name: "Sirius A", constellation: "Canis Major", spectralType: "A1V", distanceLy: 8.60, luminositySolar: 25.4, x: -6.5, y: -5.5, labelOffset: { x: 10, y: 5 } },
  { name: "Luyten 726-8", constellation: "Cetus", spectralType: "M5.5V", distanceLy: 8.79, luminositySolar: 0.00006, x: 5.2, y: -7.1, labelOffset: { x: 10, y: -3 } },
  { name: "Procyon A", constellation: "Canis Minor", spectralType: "F5IV-V", distanceLy: 11.46, luminositySolar: 6.93, x: -9.2, y: 6.8, labelOffset: { x: -60, y: 4 } },
  { name: "61 Cygni A", constellation: "Cygnus", spectralType: "K5V", distanceLy: 11.40, luminositySolar: 0.153, x: 8.5, y: -7.6, labelOffset: { x: 10, y: 4 } },
  { name: "Epsilon Eridani", constellation: "Eridanus", spectralType: "K2V", distanceLy: 10.50, luminositySolar: 0.34, x: 6.1, y: -10.2, labelOffset: { x: 10, y: 12 } },
  { name: "Tau Ceti", constellation: "Cetus", spectralType: "G8V", distanceLy: 11.91, luminositySolar: 0.52, x: 7.4, y: 8.9, labelOffset: { x: 10, y: -6 } },
  { name: "Vega", constellation: "Lyra", spectralType: "A0V", distanceLy: 25.04, luminositySolar: 40.12, x: 15.2, y: 18.5, labelOffset: { x: 10, y: 4 } },
  { name: "Arcturus", constellation: "Boötes", spectralType: "K1III", distanceLy: 36.7, luminositySolar: 170.0, x: -22.5, y: -28.4, labelOffset: { x: -65, y: 4 } },
  { name: "Fomalhaut", constellation: "Piscis Austrinus", spectralType: "A3V", distanceLy: 25.13, luminositySolar: 16.63, x: 18.2, y: -16.8, labelOffset: { x: 10, y: 4 } },
  { name: "Ross 154", constellation: "Sagittarius", spectralType: "M3.5V", distanceLy: 9.69, luminositySolar: 0.00038, x: -8.2, y: 12.1, labelOffset: { x: -55, y: 4 } },
  { name: "Ross 248", constellation: "Andromeda", spectralType: "M6.0V", distanceLy: 10.32, luminositySolar: 0.00011, x: 12.4, y: 15.2, labelOffset: { x: 10, y: 4 } },
  { name: "Lacaille 9352", constellation: "Piscis Austrinus", spectralType: "M0.5V", distanceLy: 10.74, luminositySolar: 0.034, x: -11.2, y: -3.1, labelOffset: { x: -60, y: -6 } },
  { name: "Ross 128", constellation: "Virgo", spectralType: "M4.0V", distanceLy: 11.03, luminositySolar: 0.00033, x: -14.2, y: 8.4, labelOffset: { x: -55, y: 12 } },
  { name: "Kruger 60", constellation: "Cepheus", spectralType: "M3.0V", distanceLy: 13.15, luminositySolar: 0.0005, x: 13.5, y: -9.1, labelOffset: { x: 10, y: 4 } },
  { name: "Kapteyn's Star", constellation: "Pictor", spectralType: "sdM1", distanceLy: 12.76, luminositySolar: 0.012, x: -16.5, y: -12.4, labelOffset: { x: -60, y: 4 } },
  { name: "Groombridge 34", constellation: "Andromeda", spectralType: "M1.5V", distanceLy: 11.62, luminositySolar: 0.058, x: 11.2, y: 22.1, labelOffset: { x: 10, y: 4 } },
  { name: "Epsilon Indi", constellation: "Indus", spectralType: "K5V", distanceLy: 11.87, luminositySolar: 0.22, x: -18.2, y: 15.6, labelOffset: { x: -55, y: 4 } },
  { name: "Betelgeuse", constellation: "Orion", spectralType: "M1Iab", distanceLy: 642.0, luminositySolar: 126000, x: -30.2, y: 25.1, labelOffset: { x: -65, y: 4 } },
  { name: "Rigel", constellation: "Orion", spectralType: "B8Ia", distanceLy: 863.0, luminositySolar: 120000, x: 28.4, y: -26.5, labelOffset: { x: 10, y: 4 } },
  { name: "Polaris", constellation: "Ursa Minor", spectralType: "F7Ib", distanceLy: 433.0, luminositySolar: 2500, x: 0, y: 35.0, labelOffset: { x: 12, y: 4 } },
];

export const StarChartMap: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredStar, setHoveredStar] = useState<StarSystem | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 700;
    const height = 500;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous

    const g = svg.append("g");

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform.toString());
      });

    svg.call(zoom);

    // Scale coordinates to SVG center
    const xScale = d3.scaleLinear()
      .domain([-40, 40])
      .range([50, width - 50]);

    const yScale = d3.scaleLinear()
      .domain([-40, 40])
      .range([height - 50, 50]);

    // Grid circles (distance rings in light-years)
    [10, 20, 30, 40].forEach(ly => {
      g.append("circle")
        .attr("cx", xScale(0))
        .attr("cy", yScale(0))
        .attr("r", Math.abs(xScale(ly) - xScale(0)))
        .attr("fill", "none")
        .attr("stroke", "rgba(6, 182, 212, 0.15)")
        .attr("stroke-dasharray", "4,4")
        .attr("stroke-width", 1);

      g.append("text")
        .attr("x", xScale(0) + 5)
        .attr("y", yScale(ly))
        .attr("fill", "rgba(6, 182, 212, 0.4)")
        .attr("font-size", "10px")
        .text(`${ly} ly`);
    });

    // Plot stars
    const starGroups = g.selectAll("g.star")
      .data(nearbyStars)
      .enter()
      .append("g")
      .attr("class", "star")
      .attr("transform", d => `translate(${xScale(d.x)}, ${yScale(d.y)})`)
      .on("mouseenter", (event, d) => {
        setHoveredStar(d);
        const rect = svgRef.current?.getBoundingClientRect();
        if (rect) {
          setTooltipPos({ x: event.clientX - rect.left, y: event.clientY - rect.top - 60 });
        }
      })
      .on("mousemove", (event) => {
        const rect = svgRef.current?.getBoundingClientRect();
        if (rect) {
          setTooltipPos({ x: event.clientX - rect.left, y: event.clientY - rect.top - 60 });
        }
      })
      .on("mouseleave", () => {
        setHoveredStar(null);
      });

    // Star glow & circles
    starGroups.append("circle")
      .attr("r", d => Math.max(3.5, Math.min(12, Math.sqrt(Math.max(0.1, d.luminositySolar)) * 2)))
      .attr("fill", d => d.name === "The Sun" ? "#facc15" : d.spectralType.startsWith("M") ? "#f87171" : d.spectralType.startsWith("K") ? "#fb923c" : "#38bdf8")
      .attr("opacity", 0.9)
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 1.2);

    // Star Labels with non-overlapping offsets
    starGroups.append("text")
      .attr("x", d => d.labelOffset?.x ?? 10)
      .attr("y", d => d.labelOffset?.y ?? 4)
      .attr("fill", "#e2e8f0")
      .attr("font-size", "10px")
      .attr("font-family", "sans-serif")
      .attr("font-weight", "500")
      .text(d => d.name);

  }, []);

  return (
    <div className="bg-slate-900/80 border border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl max-w-4xl mx-auto relative overflow-hidden">
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
            <Compass className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Interactive Stellar Cartography Map</h2>
            <p className="text-xs text-slate-400">Real-world nearby star systems plotted via astrometric parallax data</p>
          </div>
        </div>
        <div className="text-xs text-cyan-400 font-mono bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-xl">
          🖱️ Scroll to Zoom • Hover for Metrics
        </div>
      </div>

      <div className="relative w-full flex justify-center bg-slate-950/90 rounded-2xl border border-white/10 overflow-hidden">
        <svg ref={svgRef} className="w-full h-[500px] cursor-grab active:cursor-grabbing" viewBox="0 0 700 500" />

        {/* Hover Tooltip */}
        {hoveredStar && (
          <div
            className="absolute z-30 bg-slate-900 border border-cyan-500/50 rounded-xl p-3 shadow-2xl text-xs space-y-1 pointer-events-none transform -translate-x-1/2"
            style={{ left: tooltipPos.x, top: tooltipPos.y }}
          >
            <div className="font-bold text-white text-sm flex items-center space-x-1.5">
              <span>✨</span>
              <span>{hoveredStar.name}</span>
            </div>
            <div className="text-slate-400">Constellation: <span className="text-cyan-300">{hoveredStar.constellation}</span></div>
            <div className="text-slate-400">Spectral Class: <span className="text-purple-300">{hoveredStar.spectralType}</span></div>
            <div className="text-slate-400">Distance: <span className="text-emerald-300">{hoveredStar.distanceLy} ly</span></div>
            <div className="text-slate-400">Luminosity: <span className="text-yellow-300">{hoveredStar.luminositySolar} L☉</span></div>
          </div>
        )}
      </div>
    </div>
  );
};

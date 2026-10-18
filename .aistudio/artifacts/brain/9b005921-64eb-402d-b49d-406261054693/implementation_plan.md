# Implementation Plan - AstroCalc Pro Enhancements

## User Request
1. Add a standalone 'Astrophysical Units Converter' modal or sidebar component to allow users to convert between common units like light-years, parsecs, AU, meters, solar masses, solar radii, and arcseconds seamlessly.
2. Support LaTeX rendering for formulas using KaTeX.
3. Suggest a new plan in artifacts.

## Proposed Changes

### 1. KaTeX CSS Integration
- Import KaTeX CSS stylesheet in `index.html` or `src/index.css` so formulas render professionally.

### 2. LaTeX Renderer Component (`src/components/LatexMath.tsx`)
- Create a lightweight React component that renders LaTeX strings using `katex.renderToString`.

### 3. Astrophysical Units Converter Modal (`src/components/UnitsConverterModal.tsx`)
- Standalone interactive modal accessible from the top navigation.
- Supports converting distance units (Meters, Kilometers, Astronomical Units, Light-Years, Parsecs, Kiloparsecs, Megaparsecs).
- Supports converting mass units (Kilograms, Solar Masses, Earth Masses, Jupiter Masses).
- Supports converting time units (Seconds, Days, Years, Mega-years, Giga-years).
- Supports converting angle units (Arcseconds, Milliarcseconds, Radians, Degrees).

### 4. Integration into `src/App.tsx`
- Add "Units Converter" button in the header.
- Render LaTeX math strings for all active calculators.

## Verification Plan
- Run `compile_applet` and `lint_applet` to ensure zero compilation or type errors.

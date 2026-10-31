# Huner Biofoundry — Process Visualization

Minimalist, interactive, and accessible visual explanation of Huner Biofoundry's early-stage research pathway:

$$\text{Molasses} \longrightarrow \text{Truffle culture} \longrightarrow \text{Aroma evaluation} \longrightarrow \text{Ingredient development}$$

Live publication: [https://hunelii.github.io/visualization/](https://hunelii.github.io/visualization/)

---

## 1. Project Mission & Communication Context

Huner is an early-stage biotechnology research initiative investigating the bioproduction of truffle-character aroma ingredients for food producers:

1. **Molasses:** Utilizing sugar-industry molasses as a nutrient and carbon feed.
2. **Truffle culture:** Propagating pure truffle mycelium isolate in liquid submerged fermentation under controlled parameters (aeration, agitation, temperature). *Note: The primary goal is aroma ingredient compounds, not whole fruiting body mushrooms.*
3. **Aroma evaluation:** Screening volatile organic compounds and assessing organoleptic properties without premature commercial claims.
4. **Ingredient development:** Translating sensory and biochemical findings into food application matrices for culinary manufacturers.

---

## 2. Architecture & Design Principles

- **Unified Narrative Map:** Inspired by calm information architecture (left narrative selectors, right unified technical schematic). The whole pathway is immediately understandable within 10–15 seconds even without interaction.
- **Brand System:**
  - Background: `#F4F1E8` (Culture white)
  - Primary ink & lines: `#22311D` (Foundry forest green)
  - Secondary green: `#374F2F` (Culture green)
  - Growth accent: `#4A6741` (Growth green)
  - Font: `Amazing Grotesk`, `Helvetica Neue`, sans-serif
- **Accessibility:**
  - Full WAI-ARIA tablist controls (`role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`).
  - Keyboard navigation (`ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`, `Home`, `End`).
  - Screen reader announcements via live region (`aria-live="polite"`).
  - Respects `prefers-reduced-motion`.
- **Embeddable via iframe:**
  - Supports `?embed=1` query parameter for embedding in the main website.
  - Auto-height communication with parent window via `postMessage({ type: 'huner:visualization:resize', height })` with loop-prevention thresholds.

---

## 3. Getting Started

### Install Dependencies
```bash
npm install
```

### Local Development Server
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## 4. Embed Integration

See [docs/EMBED-INTEGRATION.md](docs/EMBED-INTEGRATION.md) for full React/Next.js and HTML embed instructions.

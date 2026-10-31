# Huner Biofoundry — Process Visualization

Minimalist, interactive, and scroll-driven visual journey of Huner Biofoundry's early-stage research pathway from sugar-industry molasses to a food-grade truffle-character aroma ingredient:

$$\text{Feedstock (01–02)} \longrightarrow \text{Fermentation (03–05)} \longleftrightarrow \text{Analysis (06–07)} \longrightarrow \text{Ingredient Dev (08)}$$

- **Live URL:** [https://hunelii.github.io/visualization/](https://hunelii.github.io/visualization/)
- **Repository:** [https://github.com/hunelii/visualization](https://github.com/hunelii/visualization)

---

## 1. Process Pipeline & Stages

The experience faithfully visualizes the entire 8-stage laboratory & bioprocess pipeline alongside closed-loop analytical optimization:

1. **01 Molasses** — Feedstock selection & sugar-rich molasses characterization.
2. **02 Medium Preparation** — Molasses-based medium formulation & controlled agitation.
3. **03 Fungal Culture** — Pure *Tuber melanosporum* mycelium isolate cultivation.
4. **04 Inoculation** — Aseptic inoculum transfer to seed propagation vessel.
5. **05 Fermentation** — Submerged liquid fermentation with real-time monitored parameters:
   - Temperature
   - pH
   - Dissolved Oxygen (DO)
   - Biomass density
   - Real-time process data
6. **06 Sampling** — Aliquot extraction & sterile biomass screening.
7. **07 Aroma Analysis** — GC-MS volatile profiling & sensory evaluation.
   - **Iterative Feedback Loop:** Analytical and sensory metrics feed directly back into Fermentation for process parameter optimization (`Analytical feedback` $\longrightarrow$ `Process optimization`).
8. **08 Ingredient Development** — Formulation and testing of consistent truffle-character aroma ingredients for food producers.

---

## 2. Scroll-Driven Scrollytelling Architecture

- **Sticky Canvas & Dynamic Camera Spotlight:**
  - On desktop, the technical 8-station schematic stays pinned (`position: sticky; top: 28px`).
  - As the user scrolls through the narrative stream on the left, an `IntersectionObserver` scroll spy tracks the focal card.
  - The camera spotlight smoothly glides horizontally (`translateX` across the 1440px SVG canvas) to highlight the active vessel.
- **Fluid Conduit Liquid Flow:**
  - Conduits between active stations display animated SVG liquid pulses (`.flowing-conduit`).
  - The analytical feedback loop activates reverse dashed flowing pulses returning from Stage 07/06 into Stage 05 Fermentation.
- **Progress Track & Milestones:**
  - Top progress line tracks cumulative completion percentage (13% to 100%) with interactive milestone dots for instant jump navigation.
- **Mobile Responsive Vertical Flow:**
  - Under 980px, transforms into a clean vertical card feed connected by vertical flowing conduits with pulsing liquid droplets (`.mobile-flowing-pulse`).
  - Sticky horizontal quick-jump tabs (`[01]` through `[08]`) allow instant access on touchscreens.
- **Deep Linking & Accessibility:**
  - Supports direct URL hashes (e.g. `#fermentation`, `#aroma-analysis`, `#05`).
  - Arrow keys (`ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`) navigate stages smoothly.
  - Full screen reader announcements (`aria-live="polite"`).
  - Honors `prefers-reduced-motion`.

---

## 3. Brand Identity

- **Background:** `#F4F1E8` (Culture white)
- **Primary Ink & Lines:** `#22311D` (Foundry forest green)
- **Secondary Green:** `#374F2F` (Culture green)
- **Growth Accent:** `#4A6741` (Growth green)
- **Typography:** `Amazing Grotesk`, `Helvetica Neue`, sans-serif

---

## 4. Local Development

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Build production bundle
npm run build

# Preview build locally
npm run preview
```

---

## 5. Embed Integration

The project is designed to be cleanly embedded into the main Huner website or any external portal.
See [docs/EMBED-INTEGRATION.md](docs/EMBED-INTEGRATION.md) for full `<iframe>` auto-resizing integration guides.

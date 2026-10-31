import React from 'react';
import { StageData } from '../types';

interface UnifiedDiagramProps {
  stages?: StageData[];
  activeStageIndex: number;
  onSelectStage: (index: number) => void;
}

export const UnifiedDiagram: React.FC<UnifiedDiagramProps> = ({
  activeStageIndex,
  onSelectStage,
}) => {
  return (
    <div className="diagram-card">
      <div className="diagram-meta-header" aria-hidden="true">
        <span className="diagram-meta-title">Unified Process Schematic</span>
        <span className="diagram-meta-flow">01 → 02 → 03 → 04</span>
      </div>

      <div className="svg-container">
        <svg
          className="process-svg"
          viewBox="0 0 1000 420"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Process schematic showing molasses feed, truffle culture fermentation, aroma evaluation, and ingredient development"
        >
          {/* Subtle Technical Registration Frame & Baseline */}
          <g className="svg-grid-registration" stroke="rgba(34, 49, 29, 0.12)" strokeWidth="1" aria-hidden="true">
            {/* Corner registration crosses */}
            <path d="M 24 36 L 36 36 M 30 30 L 30 42" />
            <path d="M 964 36 L 976 36 M 970 30 L 970 42" />
            <path d="M 24 384 L 36 384 M 30 378 L 30 390" />
            <path d="M 964 384 L 976 384 M 970 378 L 970 390" />

            {/* Baseline axis with subtle dashed division */}
            <line x1="40" y1="220" x2="960" y2="220" stroke="rgba(34, 49, 29, 0.08)" strokeDasharray="4 6" />

            {/* Step markers along baseline */}
            <circle cx="130" cy="385" r="2" fill="rgba(34, 49, 29, 0.25)" />
            <circle cx="380" cy="385" r="2" fill="rgba(34, 49, 29, 0.25)" />
            <circle cx="630" cy="385" r="2" fill="rgba(34, 49, 29, 0.25)" />
            <circle cx="870" cy="385" r="2" fill="rgba(34, 49, 29, 0.25)" />
          </g>

          {/* Continuous Inter-station Connection Connectors */}
          <g className="svg-connectors" aria-hidden="true">
            {/* Feed line: Station 1 Dropper base to Station 2 Culture input */}
            <path
              d="M 175 220 L 295 220"
              stroke={activeStageIndex === 0 ? "var(--foundry-green)" : "rgba(34, 49, 29, 0.22)"}
              strokeWidth={activeStageIndex === 0 ? "2" : "1.4"}
              strokeDasharray={activeStageIndex === 0 ? "none" : "3 3"}
              className={activeStageIndex === 0 ? "anim-nutrient-flow" : ""}
            />
            {/* Directional chevron 1 -> 2 */}
            <path
              d="M 235 216 L 241 220 L 235 224"
              stroke="rgba(34, 49, 29, 0.35)"
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Sampling line: Station 2 Vessel side to Station 3 Evaluation */}
            <path
              d="M 465 220 L 565 220"
              stroke={activeStageIndex === 1 || activeStageIndex === 2 ? "var(--foundry-green)" : "rgba(34, 49, 29, 0.22)"}
              strokeWidth={activeStageIndex === 2 ? "2" : "1.4"}
              strokeDasharray={activeStageIndex === 2 ? "none" : "3 3"}
              className={activeStageIndex === 2 ? "anim-sample-branch" : ""}
            />
            {/* Directional chevron 2 -> 3 */}
            <path
              d="M 515 216 L 521 220 L 515 224"
              stroke="rgba(34, 49, 29, 0.35)"
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Translation line: Station 3 Evaluation to Station 4 Ingredient */}
            <path
              d="M 695 220 L 805 220"
              stroke={activeStageIndex === 3 ? "var(--foundry-green)" : "rgba(34, 49, 29, 0.22)"}
              strokeWidth={activeStageIndex === 3 ? "2" : "1.4"}
              strokeDasharray={activeStageIndex === 3 ? "none" : "3 3"}
              className={activeStageIndex === 3 ? "anim-target-vector" : ""}
            />
            {/* Directional chevron 3 -> 4 */}
            <path
              d="M 750 216 L 756 220 L 750 224"
              stroke="rgba(34, 49, 29, 0.35)"
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* ============================================================ */}
          {/* STATION 01: MOLASSES (Center: X=130, Y=220)                  */}
          {/* ============================================================ */}
          <g
            className={`svg-station ${activeStageIndex === 0 ? 'is-active' : 'is-muted'}`}
            tabIndex={0}
            role="button"
            aria-label="Select stage 1: Molasses nutrient feed"
            aria-pressed={activeStageIndex === 0}
            onClick={() => onSelectStage(0)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectStage(0);
              }
            }}
          >
            {/* Focus Ring & Background Hit Area */}
            <rect
              x="50"
              y="70"
              width="160"
              height="280"
              rx="4"
              fill="transparent"
              className="station-focus-ring"
              stroke="var(--foundry-green)"
              strokeWidth="1.5"
            />

            {/* Station Header in SVG */}
            <text x="130" y="95" textAnchor="middle" className="station-badge-text">01</text>
            <text x="130" y="115" textAnchor="middle" className="station-label-text">Molasses</text>
            <text x="130" y="130" textAnchor="middle" className="station-sublabel-text">Nutrient source</text>

            {/* Dropper Stem & Reservoir Tip */}
            <path
              d="M 124 140 L 136 140 L 133 162 L 127 162 Z"
              stroke="var(--foundry-green)"
              strokeWidth="1.4"
              fill="none"
              strokeLinejoin="round"
            />

            {/* Molasses Droplet (Concentrated viscous nutrient drop) */}
            <path
              d="M 130 168 C 144 186 150 200 150 214 C 150 228 141 238 130 238 C 119 238 110 228 110 214 C 110 200 116 186 130 168 Z"
              stroke="var(--foundry-green)"
              strokeWidth="1.5"
              fill={activeStageIndex === 0 ? "rgba(74, 103, 65, 0.14)" : "rgba(74, 103, 65, 0.06)"}
              strokeLinejoin="round"
              className={activeStageIndex === 0 ? "anim-highlight-pulse" : ""}
            />

            {/* Discrete Nutrient Marker Dots (Carbon / Sucrose / Minerals) */}
            <g className={activeStageIndex === 0 ? "anim-nutrient-flow" : ""}>
              <circle cx="130" cy="202" r="2.8" fill="var(--foundry-green)" />
              <circle cx="123" cy="216" r="2.2" fill="var(--growth-green)" />
              <circle cx="137" cy="217" r="2.4" fill="var(--foundry-green)" />
              <circle cx="130" cy="226" r="2.2" fill="var(--growth-green)" />
              {/* Surrounding nutrient trace markers */}
              <circle cx="120" cy="195" r="1.5" fill="rgba(34, 49, 29, 0.45)" />
              <circle cx="141" cy="203" r="1.5" fill="rgba(34, 49, 29, 0.45)" />
            </g>

            {/* Outflow conduit connecting down to main feed pipe */}
            <path
              d="M 130 238 L 130 252 Q 130 260 140 260 L 175 220"
              stroke="var(--foundry-green)"
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
            />

            {/* Micro scientific note */}
            <text x="130" y="325" textAnchor="middle" className="station-sublabel-text" fill="rgba(34,49,29,0.7)">
              Sugar byproduct
            </text>
            <text x="130" y="338" textAnchor="middle" className="station-sublabel-text" fill="rgba(34,49,29,0.7)">
              Carbon & minerals
            </text>
          </g>

          {/* ============================================================ */}
          {/* STATION 02: TRUFFLE CULTURE (Center: X=380, Y=220)          */}
          {/* ============================================================ */}
          <g
            className={`svg-station ${activeStageIndex === 1 ? 'is-active' : 'is-muted'}`}
            tabIndex={0}
            role="button"
            aria-label="Select stage 2: Truffle culture liquid fermentation"
            aria-pressed={activeStageIndex === 1}
            onClick={() => onSelectStage(1)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectStage(1);
              }
            }}
          >
            {/* Focus Ring & Background Hit Area */}
            <rect
              x="290"
              y="70"
              width="180"
              height="280"
              rx="4"
              fill="transparent"
              className="station-focus-ring"
              stroke="var(--foundry-green)"
              strokeWidth="1.5"
            />

            {/* Station Header */}
            <text x="380" y="95" textAnchor="middle" className="station-badge-text">02</text>
            <text x="380" y="115" textAnchor="middle" className="station-label-text">Truffle culture</text>
            <text x="380" y="130" textAnchor="middle" className="station-sublabel-text">Liquid fermentation</text>

            {/* Separate Biological Inoculum Input (CRITICAL REQUIREMENT) */}
            <g className="inoculum-indicator">
              {/* Inoculum pipetting entry line from top right */}
              <path
                d="M 438 140 L 418 160"
                stroke="var(--growth-green)"
                strokeWidth="1.4"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 416 154 L 418 160 L 424 160"
                stroke="var(--growth-green)"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <circle cx="442" cy="136" r="3" fill="var(--growth-green)" />
              <text x="448" y="139" className="station-sublabel-text" fill="var(--growth-green)" style={{ fontSize: '9px', fontWeight: 600 }}>
                Inoculum
              </text>
            </g>

            {/* 2D Culture Vessel / Fermentation Flask */}
            {/* Neck and rim */}
            <path
              d="M 364 160 L 396 160 M 368 160 L 368 180 M 392 180 L 392 160"
              stroke="var(--foundry-green)"
              strokeWidth="1.4"
              fill="none"
            />
            {/* Vessel body: conical flask with soft rounded base */}
            <path
              d="M 368 180 L 334 258 C 330 268 338 278 350 278 L 410 278 C 422 278 430 268 426 258 L 392 180"
              stroke="var(--foundry-green)"
              strokeWidth="1.5"
              fill={activeStageIndex === 1 ? "rgba(74, 103, 65, 0.12)" : "rgba(74, 103, 65, 0.05)"}
              strokeLinejoin="round"
            />

            {/* Broth Liquid Surface Meniscus */}
            <path
              d="M 346 225 Q 380 230 414 225"
              stroke="var(--culture-green)"
              strokeWidth="1.2"
              fill="none"
              strokeDasharray="2 3"
            />

            {/* Liquid Broth Mycelium Hyphal Network (Branching mycelium, NO fruiting mushrooms) */}
            <g className={activeStageIndex === 1 ? "anim-hyphae" : ""}>
              {/* Hyphal branches spreading gently in broth */}
              <path
                d="M 380 252 Q 366 242 354 238 M 366 242 Q 360 250 354 256"
                stroke="var(--foundry-green)"
                strokeWidth="1.3"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 380 252 Q 394 240 406 236 M 392 242 Q 398 250 404 254"
                stroke="var(--foundry-green)"
                strokeWidth="1.3"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 380 252 Q 375 264 366 270"
                stroke="var(--foundry-green)"
                strokeWidth="1.2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 380 252 Q 385 264 394 270"
                stroke="var(--foundry-green)"
                strokeWidth="1.2"
                strokeLinecap="round"
                fill="none"
              />
              {/* Hyphal tips with fine biological growth points */}
              <circle cx="354" cy="238" r="1.6" fill="var(--growth-green)" />
              <circle cx="354" cy="256" r="1.4" fill="var(--foundry-green)" />
              <circle cx="406" cy="236" r="1.6" fill="var(--growth-green)" />
              <circle cx="404" cy="254" r="1.4" fill="var(--foundry-green)" />
              <circle cx="380" cy="252" r="2.2" fill="var(--foundry-green)" />
            </g>

            {/* Gentle aeration marker dots (micro bubbles) */}
            <circle cx="372" cy="236" r="1.4" stroke="var(--culture-green)" strokeWidth="0.8" fill="none" />
            <circle cx="388" cy="232" r="1.2" stroke="var(--culture-green)" strokeWidth="0.8" fill="none" />

            {/* Micro scientific note */}
            <text x="380" y="325" textAnchor="middle" className="station-sublabel-text" fill="rgba(34,49,29,0.7)">
              Pure mycelium isolate
            </text>
            <text x="380" y="338" textAnchor="middle" className="station-sublabel-text" fill="rgba(34,49,29,0.7)">
              Submerged culture
            </text>
          </g>

          {/* ============================================================ */}
          {/* STATION 03: AROMA EVALUATION (Center: X=630, Y=220)          */}
          {/* ============================================================ */}
          <g
            className={`svg-station ${activeStageIndex === 2 ? 'is-active' : 'is-muted'}`}
            tabIndex={0}
            role="button"
            aria-label="Select stage 3: Aroma evaluation and sample analysis"
            aria-pressed={activeStageIndex === 2}
            onClick={() => onSelectStage(2)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectStage(2);
              }
            }}
          >
            {/* Focus Ring & Background Hit Area */}
            <rect
              x="540"
              y="70"
              width="180"
              height="280"
              rx="4"
              fill="transparent"
              className="station-focus-ring"
              stroke="var(--foundry-green)"
              strokeWidth="1.5"
            />

            {/* Station Header */}
            <text x="630" y="95" textAnchor="middle" className="station-badge-text">03</text>
            <text x="630" y="115" textAnchor="middle" className="station-label-text">Aroma evaluation</text>
            <text x="630" y="130" textAnchor="middle" className="station-sublabel-text">Sample study</text>

            {/* Analytical Circular Lens / Evaluation Chamber */}
            {/* Outer calibration circle */}
            <circle
              cx="630"
              cy="220"
              r="52"
              stroke="var(--foundry-green)"
              strokeWidth="1.3"
              strokeDasharray="2 4"
              fill="none"
            />
            {/* Inner chamber field */}
            <circle
              cx="630"
              cy="220"
              r="44"
              stroke="var(--foundry-green)"
              strokeWidth="1.4"
              fill={activeStageIndex === 2 ? "rgba(74, 103, 65, 0.14)" : "rgba(74, 103, 65, 0.05)"}
            />

            {/* Analytical Reticle & Inspection Marks */}
            <g stroke="rgba(34, 49, 29, 0.35)" strokeWidth="1" strokeLinecap="round" aria-hidden="true">
              {/* Reticle ticks */}
              <line x1="630" y1="172" x2="630" y2="182" />
              <line x1="630" y1="258" x2="630" y2="268" />
              <line x1="582" y1="220" x2="592" y2="220" />
              <line x1="668" y1="220" x2="678" y2="220" />
            </g>

            {/* Aroma volatile compound detection arcs (Clean, non-fake arcs) */}
            <g className={activeStageIndex === 2 ? "anim-highlight-pulse" : ""}>
              <path
                d="M 618 206 A 16 16 0 0 1 642 206"
                stroke="var(--growth-green)"
                strokeWidth="1.4"
                strokeDasharray="2 3"
                fill="none"
              />
              <path
                d="M 612 196 A 26 26 0 0 1 648 196"
                stroke="var(--growth-green)"
                strokeWidth="1.3"
                strokeDasharray="2 3"
                fill="none"
              />
              <path
                d="M 606 186 A 36 36 0 0 1 654 186"
                stroke="var(--growth-green)"
                strokeWidth="1.2"
                strokeDasharray="2 3"
                fill="none"
              />
            </g>

            {/* Separated Sample Aliquot Dot in Center */}
            <circle
              cx="630"
              cy="220"
              r="4.5"
              fill="var(--foundry-green)"
              className={activeStageIndex === 2 ? "anim-sample-branch" : ""}
            />
            {/* Halo around aliquot */}
            <circle
              cx="630"
              cy="220"
              r="8"
              stroke="var(--growth-green)"
              strokeWidth="1"
              strokeDasharray="2 2"
              fill="none"
            />

            {/* Micro scientific note */}
            <text x="630" y="325" textAnchor="middle" className="station-sublabel-text" fill="rgba(34,49,29,0.7)">
              Aroma volatiles
            </text>
            <text x="630" y="338" textAnchor="middle" className="station-sublabel-text" fill="rgba(34,49,29,0.7)">
              Sample screening
            </text>
          </g>

          {/* ============================================================ */}
          {/* STATION 04: INGREDIENT DEVELOPMENT (Center: X=870, Y=220)    */}
          {/* ============================================================ */}
          <g
            className={`svg-station ${activeStageIndex === 3 ? 'is-active' : 'is-muted'}`}
            tabIndex={0}
            role="button"
            aria-label="Select stage 4: Ingredient development for food applications"
            aria-pressed={activeStageIndex === 3}
            onClick={() => onSelectStage(3)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectStage(3);
              }
            }}
          >
            {/* Focus Ring & Background Hit Area */}
            <rect
              x="780"
              y="70"
              width="180"
              height="280"
              rx="4"
              fill="transparent"
              className="station-focus-ring"
              stroke="var(--foundry-green)"
              strokeWidth="1.5"
            />

            {/* Station Header */}
            <text x="870" y="95" textAnchor="middle" className="station-badge-text">04</text>
            <text x="870" y="115" textAnchor="middle" className="station-label-text">Ingredient development</text>
            <text x="870" y="130" textAnchor="middle" className="station-sublabel-text">Food application</text>

            {/* Ingredient Development Target Form (Refined geometric profile, NOT retail package/mushroom) */}
            <g className={activeStageIndex === 3 ? "anim-highlight-pulse" : ""}>
              {/* Outer hexagonal refinement lattice */}
              <path
                d="M 870 190 L 896 205 L 896 235 L 870 250 L 844 235 L 844 205 Z"
                stroke="var(--foundry-green)"
                strokeWidth="1.5"
                fill={activeStageIndex === 3 ? "rgba(74, 103, 65, 0.14)" : "rgba(74, 103, 65, 0.05)"}
                strokeLinejoin="round"
              />
              {/* Core active aroma compound specification */}
              <circle cx="870" cy="220" r="5" fill="var(--growth-green)" />
              <circle cx="870" cy="220" r="10" stroke="var(--foundry-green)" strokeWidth="1" strokeDasharray="3 3" fill="none" />
            </g>

            {/* Food Application Integration Pathways (Extending toward food manufacturers) */}
            <g className={activeStageIndex === 3 ? "anim-target-vector" : ""}>
              {/* Upper integration vector */}
              <path
                d="M 896 205 L 935 186"
                stroke="var(--foundry-green)"
                strokeWidth="1.4"
                strokeDasharray="2 3"
                fill="none"
              />
              <circle cx="938" cy="184" r="3.2" stroke="var(--foundry-green)" strokeWidth="1.2" fill="var(--culture-white)" />

              {/* Direct formulation vector */}
              <path
                d="M 896 220 L 946 220"
                stroke="var(--foundry-green)"
                strokeWidth="1.4"
                fill="none"
              />
              <circle cx="950" cy="220" r="3.6" fill="var(--foundry-green)" />

              {/* Lower integration vector */}
              <path
                d="M 896 235 L 935 254"
                stroke="var(--foundry-green)"
                strokeWidth="1.4"
                strokeDasharray="2 3"
                fill="none"
              />
              <circle cx="938" cy="256" r="3.2" stroke="var(--foundry-green)" strokeWidth="1.2" fill="var(--culture-white)" />
            </g>

            {/* Label indicating application testing */}
            <text x="946" y="168" textAnchor="end" className="station-sublabel-text" fill="var(--culture-green)" style={{ fontSize: '9px', fontWeight: 600 }}>
              Food producers
            </text>

            {/* Micro scientific note */}
            <text x="870" y="325" textAnchor="middle" className="station-sublabel-text" fill="rgba(34,49,29,0.7)">
              Aroma ingredient
            </text>
            <text x="870" y="338" textAnchor="middle" className="station-sublabel-text" fill="rgba(34,49,29,0.7)">
              Culinary application trials
            </text>
          </g>
        </svg>
      </div>

      <div className="diagram-caption-footer">
        <div className="keyboard-hint" aria-hidden="true">
          <span>Navigate:</span>
          <span className="kbd-key">←</span>
          <span className="kbd-key">→</span>
          <span>or click any stage</span>
        </div>
        <div className="diagram-status-note">
          Early-stage R&amp;D Schematic
        </div>
      </div>
    </div>
  );
};

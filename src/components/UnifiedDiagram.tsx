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
  const isFeedbackActive = activeStageIndex === 4 || activeStageIndex === 5 || activeStageIndex === 6;

  return (
    <div className="diagram-card">
      <div className="diagram-meta-header" aria-hidden="true">
        <span className="diagram-meta-title">Complete 8-Stage Research Pathway</span>
        <span className="diagram-meta-flow">01 → 02 → 03 → 04 → 05 → 06 → 07 → 08</span>
      </div>

      <div className="svg-container" style={{ aspectRatio: '1440 / 500' }}>
        <svg
          className="process-svg"
          viewBox="0 0 1440 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Comprehensive 8-stage schematic: Molasses, Medium Preparation, Fungal Culture, Inoculation, Fermentation, Sampling, Aroma Analysis, and Ingredient Development"
        >
          {/* Subtle Technical Registration Frame & Baseline */}
          <g className="svg-grid-registration" stroke="rgba(34, 49, 29, 0.12)" strokeWidth="1" aria-hidden="true">
            {/* Corner registration crosses */}
            <path d="M 24 30 L 36 30 M 30 24 L 30 36" />
            <path d="M 1404 30 L 1416 30 M 1410 24 L 1410 36" />
            <path d="M 24 470 L 36 470 M 30 464 L 30 476" />
            <path d="M 1404 470 L 1416 470 M 1410 464 L 1410 476" />

            {/* Baseline axis */}
            <line x1="30" y1="220" x2="1410" y2="220" stroke="rgba(34, 49, 29, 0.08)" strokeDasharray="4 6" />

            {/* Station bottom marker points */}
            {[90, 250, 410, 570, 740, 920, 1090, 1270].map((x, idx) => (
              <circle key={idx} cx={x} cy="465" r="2.2" fill="rgba(34, 49, 29, 0.25)" />
            ))}
          </g>

          {/* ============================================================ */}
          {/* PROCESS FLOW CONDUITS / PIPES                               */}
          {/* ============================================================ */}
          <g className="svg-connectors" aria-hidden="true">
            {/* 01 Molasses -> 02 Medium Prep */}
            <path
              d="M 130 220 L 205 220"
              stroke={activeStageIndex === 0 ? "var(--foundry-green)" : "rgba(34, 49, 29, 0.25)"}
              strokeWidth={activeStageIndex === 0 ? "2" : "1.4"}
              className={activeStageIndex === 0 ? "anim-nutrient-flow" : ""}
            />
            <path d="M 165 216 L 171 220 L 165 224" stroke="rgba(34, 49, 29, 0.35)" strokeWidth="1.4" fill="none" />

            {/* 02 Medium Prep -> 04 Inoculation */}
            <path
              d="M 295 220 L 525 220"
              stroke={activeStageIndex === 1 ? "var(--foundry-green)" : "rgba(34, 49, 29, 0.25)"}
              strokeWidth={activeStageIndex === 1 ? "2" : "1.4"}
            />
            <path d="M 345 216 L 351 220 L 345 224" stroke="rgba(34, 49, 29, 0.35)" strokeWidth="1.4" fill="none" />

            {/* 03 Fungal Culture Inoculum -> 04 Inoculation Port */}
            <path
              d="M 445 235 Q 490 235 520 200 L 542 175"
              stroke="var(--growth-green)"
              strokeWidth={activeStageIndex === 2 || activeStageIndex === 3 ? "2" : "1.5"}
              strokeDasharray="3 3"
            />
            <path d="M 536 178 L 542 174 L 544 182" stroke="var(--growth-green)" strokeWidth="1.4" fill="none" />

            {/* 04 Inoculation -> 05 Fermentation */}
            <path
              d="M 615 220 L 685 220"
              stroke={activeStageIndex === 3 || activeStageIndex === 4 ? "var(--foundry-green)" : "rgba(34, 49, 29, 0.25)"}
              strokeWidth={activeStageIndex === 4 ? "2" : "1.4"}
            />
            <path d="M 648 216 L 654 220 L 648 224" stroke="rgba(34, 49, 29, 0.35)" strokeWidth="1.4" fill="none" />

            {/* 05 Fermentation -> 06 Sampling */}
            <path
              d="M 795 220 L 875 220"
              stroke={activeStageIndex === 4 || activeStageIndex === 5 ? "var(--foundry-green)" : "rgba(34, 49, 29, 0.25)"}
              strokeWidth={activeStageIndex === 5 ? "2" : "1.4"}
            />
            <path d="M 832 216 L 838 220 L 832 224" stroke="rgba(34, 49, 29, 0.35)" strokeWidth="1.4" fill="none" />

            {/* 06 Sampling -> 07 Aroma Analysis */}
            <path
              d="M 965 220 L 1040 220"
              stroke={activeStageIndex === 5 || activeStageIndex === 6 ? "var(--foundry-green)" : "rgba(34, 49, 29, 0.25)"}
              strokeWidth={activeStageIndex === 6 ? "2" : "1.4"}
            />
            <path d="M 998 216 L 1004 220 L 998 224" stroke="rgba(34, 49, 29, 0.35)" strokeWidth="1.4" fill="none" />

            {/* 07 Aroma Analysis -> 08 Ingredient Development */}
            <path
              d="M 1150 220 L 1225 220"
              stroke={activeStageIndex === 7 ? "var(--foundry-green)" : "rgba(34, 49, 29, 0.25)"}
              strokeWidth={activeStageIndex === 7 ? "2" : "1.4"}
            />
            <path d="M 1184 216 L 1190 220 L 1184 224" stroke="rgba(34, 49, 29, 0.35)" strokeWidth="1.4" fill="none" />
          </g>

          {/* ============================================================ */}
          {/* FEEDBACK LOOP: 07 / 06 -> 05 FERMENTATION                   */}
          {/* ============================================================ */}
          <g className={`feedback-loop-layer ${isFeedbackActive ? 'is-active' : ''}`} aria-hidden="true">
            {/* Loop path: Drops from Sampling (X=920) and Analysis (X=1090), runs left to Fermentation (X=740) */}
            <path
              d="M 1090 280 L 1090 395 L 740 395 L 740 300"
              stroke={isFeedbackActive ? "var(--growth-green)" : "rgba(74, 103, 65, 0.35)"}
              strokeWidth={isFeedbackActive ? "1.8" : "1.2"}
              strokeDasharray="4 4"
              fill="none"
            />
            {/* Branch from 06 Sampling joining the loop */}
            <path
              d="M 920 285 L 920 395"
              stroke={isFeedbackActive ? "var(--growth-green)" : "rgba(74, 103, 65, 0.35)"}
              strokeWidth={isFeedbackActive ? "1.8" : "1.2"}
              strokeDasharray="4 4"
              fill="none"
            />
            {/* Upward injection arrow into Fermentation */}
            <path
              d="M 736 308 L 740 300 L 744 308"
              stroke={isFeedbackActive ? "var(--growth-green)" : "rgba(74, 103, 65, 0.5)"}
              strokeWidth="1.5"
              fill="none"
            />

            {/* Pill Labels on the feedback loop */}
            {/* Analytical feedback pill */}
            <g transform="translate(980, 385)">
              <rect x="-65" y="-12" width="130" height="24" rx="12" fill="var(--culture-white)" stroke={isFeedbackActive ? "var(--growth-green)" : "rgba(34, 49, 29, 0.3)"} strokeWidth="1.2" />
              <text x="0" y="4" textAnchor="middle" className="station-sublabel-text" fill={isFeedbackActive ? "var(--foundry-green)" : "var(--culture-green)"} style={{ fontSize: '9px', fontWeight: 600 }}>
                Analytical feedback
              </text>
            </g>
            <path d="M 900 392 L 892 395 L 900 398" stroke={isFeedbackActive ? "var(--growth-green)" : "rgba(34, 49, 29, 0.4)"} strokeWidth="1.2" fill="none" />

            {/* Process optimization pill */}
            <g transform="translate(825, 385)">
              <rect x="-65" y="-12" width="130" height="24" rx="12" fill="var(--culture-white)" stroke={isFeedbackActive ? "var(--growth-green)" : "rgba(34, 49, 29, 0.3)"} strokeWidth="1.2" />
              <text x="0" y="4" textAnchor="middle" className="station-sublabel-text" fill={isFeedbackActive ? "var(--foundry-green)" : "var(--culture-green)"} style={{ fontSize: '9px', fontWeight: 600 }}>
                Process optimization
              </text>
            </g>
          </g>

          {/* ============================================================ */}
          {/* STATION 01: MOLASSES (X=90)                                  */}
          {/* ============================================================ */}
          <g
            className={`svg-station ${activeStageIndex === 0 ? 'is-active' : 'is-muted'}`}
            tabIndex={0}
            role="button"
            aria-label="Select stage 1: Molasses feedstock selection"
            onClick={() => onSelectStage(0)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectStage(0); } }}
          >
            <rect x="25" y="60" width="130" height="280" rx="4" fill="transparent" className="station-focus-ring" stroke="var(--foundry-green)" strokeWidth="1.5" />
            <text x="90" y="85" textAnchor="middle" className="station-badge-text">01</text>
            <text x="90" y="105" textAnchor="middle" className="station-label-text">Molasses</text>
            <text x="90" y="120" textAnchor="middle" className="station-sublabel-text">Feedstock</text>

            {/* Dropper & Droplet */}
            <g transform="translate(58, 175)">
              <path d="M 0 -22 C 10 -4 14 6 14 16 C 14 26 8 32 0 32 C -8 32 -14 26 -14 16 C -14 6 -10 -4 0 -22 Z" stroke="var(--foundry-green)" strokeWidth="1.4" fill="rgba(74, 103, 65, 0.2)" />
              <circle cx="0" cy="14" r="2.2" fill="var(--foundry-green)" />
            </g>

            {/* Storage Tank */}
            <rect x="75" y="165" width="46" height="75" rx="4" stroke="var(--foundry-green)" strokeWidth="1.5" fill={activeStageIndex === 0 ? "rgba(74, 103, 65, 0.14)" : "rgba(74, 103, 65, 0.05)"} />
            <line x1="77" y1="185" x2="119" y2="185" stroke="var(--culture-green)" strokeWidth="1" strokeDasharray="2 2" />
            <path d="M 80 240 L 76 252 M 116 240 L 120 252" stroke="var(--foundry-green)" strokeWidth="1.4" strokeLinecap="round" />

            <text x="90" y="325" textAnchor="middle" className="station-sublabel-text" fill="rgba(34,49,29,0.7)">Sugar byproduct</text>
            <text x="90" y="338" textAnchor="middle" className="station-sublabel-text" fill="rgba(34,49,29,0.7)">Carbon baseline</text>
          </g>

          {/* ============================================================ */}
          {/* STATION 02: MEDIUM PREPARATION (X=250)                       */}
          {/* ============================================================ */}
          <g
            className={`svg-station ${activeStageIndex === 1 ? 'is-active' : 'is-muted'}`}
            tabIndex={0}
            role="button"
            aria-label="Select stage 2: Medium preparation and nutrient formulation"
            onClick={() => onSelectStage(1)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectStage(1); } }}
          >
            <rect x="185" y="60" width="130" height="280" rx="4" fill="transparent" className="station-focus-ring" stroke="var(--foundry-green)" strokeWidth="1.5" />
            <text x="250" y="85" textAnchor="middle" className="station-badge-text">02</text>
            <text x="250" y="105" textAnchor="middle" className="station-label-text">Medium Prep</text>
            <text x="250" y="120" textAnchor="middle" className="station-sublabel-text">Formulation</text>

            {/* Agitator Motor */}
            <rect x="241" y="145" width="18" height="16" rx="2" stroke="var(--foundry-green)" strokeWidth="1.4" fill="var(--culture-white)" />
            <line x1="250" y1="161" x2="250" y2="235" stroke="var(--foundry-green)" strokeWidth="1.4" />

            {/* Tank Contour */}
            <rect x="215" y="165" width="70" height="75" rx="5" stroke="var(--foundry-green)" strokeWidth="1.5" fill={activeStageIndex === 1 ? "rgba(74, 103, 65, 0.12)" : "rgba(74, 103, 65, 0.05)"} />
            <line x1="235" y1="205" x2="265" y2="205" stroke="var(--growth-green)" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="237" y1="228" x2="263" y2="228" stroke="var(--growth-green)" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 223 240 L 219 252 M 277 240 L 281 252" stroke="var(--foundry-green)" strokeWidth="1.4" strokeLinecap="round" />

            <text x="250" y="325" textAnchor="middle" className="station-sublabel-text" fill="rgba(34,49,29,0.7)">Nutrient balancing</text>
            <text x="250" y="338" textAnchor="middle" className="station-sublabel-text" fill="rgba(34,49,29,0.7)">Agitated mixing</text>
          </g>

          {/* ============================================================ */}
          {/* STATION 03: FUNGAL CULTURE (X=410)                           */}
          {/* ============================================================ */}
          <g
            className={`svg-station ${activeStageIndex === 2 ? 'is-active' : 'is-muted'}`}
            tabIndex={0}
            role="button"
            aria-label="Select stage 3: Fungal culture Tuber melanosporum isolate"
            onClick={() => onSelectStage(2)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectStage(2); } }}
          >
            <rect x="345" y="60" width="130" height="280" rx="4" fill="transparent" className="station-focus-ring" stroke="var(--foundry-green)" strokeWidth="1.5" />
            <text x="410" y="85" textAnchor="middle" className="station-badge-text">03</text>
            <text x="410" y="105" textAnchor="middle" className="station-label-text">Fungal Culture</text>
            <text x="410" y="120" textAnchor="middle" className="station-sublabel-text">Strain isolate</text>

            {/* Petri dish */}
            <circle cx="410" cy="165" r="28" stroke="var(--foundry-green)" strokeWidth="1.4" fill={activeStageIndex === 2 ? "rgba(74, 103, 65, 0.12)" : "rgba(74, 103, 65, 0.05)"} />
            <circle cx="410" cy="165" r="24" stroke="rgba(34, 49, 29, 0.2)" strokeWidth="0.8" strokeDasharray="2 2" />
            {/* Radiating hyphae */}
            <g className={activeStageIndex === 2 ? "anim-hyphae" : ""}>
              {[0, 60, 120, 180, 240, 300].map((deg) => (
                <line
                  key={deg}
                  x1="410"
                  y1="165"
                  x2={410 + Math.cos((deg * Math.PI) / 180) * 18}
                  y2={165 + Math.sin((deg * Math.PI) / 180) * 18}
                  stroke="var(--growth-green)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              ))}
              <circle cx="410" cy="165" r="2.5" fill="var(--foundry-green)" />
            </g>

            {/* Shake Flask pre-culture */}
            <g transform="translate(410, 235)">
              <path d="M -5 -24 L 5 -24 M -3 -24 L -3 -15 L -16 16 C -18 20 -14 22 -8 22 L 8 22 C 14 22 18 20 16 16 L 3 -15 L 3 -24" stroke="var(--foundry-green)" strokeWidth="1.3" fill="var(--culture-white)" strokeLinejoin="round" />
              <circle cx="0" cy="12" r="3.2" fill="var(--growth-green)" />
            </g>

            <text x="410" y="325" textAnchor="middle" className="station-sublabel-text" fill="rgba(34,49,29,0.7)">Tuber melanosporum</text>
            <text x="410" y="338" textAnchor="middle" className="station-sublabel-text" fill="rgba(34,49,29,0.7)">Vegetative mycelium</text>
          </g>

          {/* ============================================================ */}
          {/* STATION 04: INOCULATION (X=570)                              */}
          {/* ============================================================ */}
          <g
            className={`svg-station ${activeStageIndex === 3 ? 'is-active' : 'is-muted'}`}
            tabIndex={0}
            role="button"
            aria-label="Select stage 4: Inoculation introducing culture into medium"
            onClick={() => onSelectStage(3)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectStage(3); } }}
          >
            <rect x="505" y="60" width="130" height="280" rx="4" fill="transparent" className="station-focus-ring" stroke="var(--foundry-green)" strokeWidth="1.5" />
            <text x="570" y="85" textAnchor="middle" className="station-badge-text">04</text>
            <text x="570" y="105" textAnchor="middle" className="station-label-text">Inoculation</text>
            <text x="570" y="120" textAnchor="middle" className="station-sublabel-text">Seeding</text>

            {/* Seed Vessel */}
            <rect x="540" y="165" width="60" height="75" rx="5" stroke="var(--foundry-green)" strokeWidth="1.5" fill={activeStageIndex === 3 ? "rgba(74, 103, 65, 0.12)" : "rgba(74, 103, 65, 0.05)"} />
            {/* Top Aseptic Transfer Port */}
            <path d="M 562 165 L 562 152 L 578 152 L 578 165" stroke="var(--foundry-green)" strokeWidth="1.3" />
            <circle cx="570" cy="195" r="4.5" fill="var(--growth-green)" className={activeStageIndex === 3 ? "anim-highlight-pulse" : ""} />
            <circle cx="558" cy="212" r="2.4" fill="var(--foundry-green)" />
            <circle cx="582" cy="210" r="2.4" fill="var(--foundry-green)" />
            <path d="M 547 240 L 543 252 M 593 240 L 597 252" stroke="var(--foundry-green)" strokeWidth="1.4" strokeLinecap="round" />

            <text x="570" y="325" textAnchor="middle" className="station-sublabel-text" fill="rgba(34,49,29,0.7)">Aseptic transfer</text>
            <text x="570" y="338" textAnchor="middle" className="station-sublabel-text" fill="rgba(34,49,29,0.7)">Seed propagation</text>
          </g>

          {/* ============================================================ */}
          {/* STATION 05: FERMENTATION (X=740)                             */}
          {/* ============================================================ */}
          <g
            className={`svg-station ${activeStageIndex === 4 ? 'is-active' : 'is-muted'}`}
            tabIndex={0}
            role="button"
            aria-label="Select stage 5: Fermentation with real-time monitored conditions"
            onClick={() => onSelectStage(4)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectStage(4); } }}
          >
            <rect x="665" y="60" width="150" height="280" rx="4" fill="transparent" className="station-focus-ring" stroke="var(--foundry-green)" strokeWidth="1.5" />
            <text x="740" y="85" textAnchor="middle" className="station-badge-text">05</text>
            <text x="740" y="105" textAnchor="middle" className="station-label-text">Fermentation</text>
            <text x="740" y="120" textAnchor="middle" className="station-sublabel-text">Submerged growth</text>

            {/* Overhead Drive Motor */}
            <rect x="731" y="140" width="18" height="18" rx="2" stroke="var(--foundry-green)" strokeWidth="1.4" fill="var(--culture-white)" />
            <line x1="740" y1="158" x2="740" y2="242" stroke="var(--foundry-green)" strokeWidth="1.5" />

            {/* Main Glass Vessel */}
            <rect x="702" y="158" width="76" height="92" rx="7" stroke="var(--foundry-green)" strokeWidth="1.6" fill={activeStageIndex === 4 ? "rgba(74, 103, 65, 0.16)" : "rgba(74, 103, 65, 0.06)"} />
            <line x1="700" y1="164" x2="780" y2="164" stroke="var(--foundry-green)" strokeWidth="2" />
            <line x1="700" y1="244" x2="780" y2="244" stroke="var(--foundry-green)" strokeWidth="2" />

            {/* Submerged Hyphal Mycelium Network */}
            <g className={activeStageIndex === 4 ? "anim-hyphae" : ""}>
              <path d="M 740 220 Q 726 210 716 206 M 726 210 Q 720 218 714 222" stroke="var(--foundry-green)" strokeWidth="1.3" strokeLinecap="round" />
              <path d="M 740 220 Q 754 208 764 204 M 752 210 Q 758 218 764 222" stroke="var(--foundry-green)" strokeWidth="1.3" strokeLinecap="round" />
              <circle cx="716" cy="206" r="1.5" fill="var(--growth-green)" />
              <circle cx="764" cy="204" r="1.5" fill="var(--growth-green)" />
              <circle cx="740" cy="220" r="2.2" fill="var(--foundry-green)" />
            </g>

            {/* Legs */}
            <path d="M 710 250 L 706 262 M 770 250 L 774 262" stroke="var(--foundry-green)" strokeWidth="1.4" strokeLinecap="round" />

            {/* Sensor Tags (Temp, pH, DO, Biomass) */}
            <g transform="translate(784, 168)" className="sensor-tag-mini" aria-hidden="true">
              <text x="0" y="8" className="station-sublabel-text" fill="var(--culture-green)" style={{ fontSize: '8px', fontWeight: 600 }}>• Temp</text>
              <text x="0" y="20" className="station-sublabel-text" fill="var(--culture-green)" style={{ fontSize: '8px', fontWeight: 600 }}>• pH</text>
              <text x="0" y="32" className="station-sublabel-text" fill="var(--culture-green)" style={{ fontSize: '8px', fontWeight: 600 }}>• DO</text>
              <text x="0" y="44" className="station-sublabel-text" fill="var(--culture-green)" style={{ fontSize: '8px', fontWeight: 600 }}>• Biomass</text>
            </g>

            <text x="740" y="325" textAnchor="middle" className="station-sublabel-text" fill="rgba(34,49,29,0.7)">Controlled culture</text>
            <text x="740" y="338" textAnchor="middle" className="station-sublabel-text" fill="rgba(34,49,29,0.7)">5 tracked parameters</text>
          </g>

          {/* ============================================================ */}
          {/* STATION 06: SAMPLING (X=920)                                 */}
          {/* ============================================================ */}
          <g
            className={`svg-station ${activeStageIndex === 5 ? 'is-active' : 'is-muted'}`}
            tabIndex={0}
            role="button"
            aria-label="Select stage 6: Sterile sampling and aliquot collection"
            onClick={() => onSelectStage(5)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectStage(5); } }}
          >
            <rect x="855" y="60" width="130" height="280" rx="4" fill="transparent" className="station-focus-ring" stroke="var(--foundry-green)" strokeWidth="1.5" />
            <text x="920" y="85" textAnchor="middle" className="station-badge-text">06</text>
            <text x="920" y="105" textAnchor="middle" className="station-label-text">Sampling</text>
            <text x="920" y="120" textAnchor="middle" className="station-sublabel-text">Collection</text>

            {/* Sampling 3-way Valve */}
            <rect x="902" y="160" width="36" height="18" rx="2" stroke="var(--foundry-green)" strokeWidth="1.4" fill="var(--culture-white)" />
            <path d="M 920 160 L 920 150 M 912 150 L 928 150" stroke="var(--foundry-green)" strokeWidth="1.3" />

            {/* Test Tubes Rack */}
            <rect x="890" y="195" width="60" height="42" rx="2" stroke="rgba(34, 49, 29, 0.25)" strokeWidth="1" strokeDasharray="2 2" fill="none" />
            {/* Tube 1 */}
            <rect x="898" y="188" width="10" height="36" rx="5" stroke="var(--foundry-green)" strokeWidth="1.2" fill="var(--culture-white)" />
            <path d="M 899 210 L 907 210 C 907 218 899 218 899 210 Z" fill="rgba(74, 103, 65, 0.3)" />
            {/* Tube 2 (Active Aliquot) */}
            <rect x="915" y="188" width="10" height="36" rx="5" stroke="var(--foundry-green)" strokeWidth="1.4" fill={activeStageIndex === 5 ? "rgba(74, 103, 65, 0.16)" : "var(--culture-white)"} />
            <path d="M 916 205 L 924 205 C 924 218 916 218 916 205 Z" fill="var(--growth-green)" className={activeStageIndex === 5 ? "anim-highlight-pulse" : ""} />
            {/* Tube 3 */}
            <rect x="932" y="188" width="10" height="36" rx="5" stroke="var(--foundry-green)" strokeWidth="1.2" fill="var(--culture-white)" />
            <path d="M 933 214 L 941 214 C 941 218 933 218 933 214 Z" fill="rgba(74, 103, 65, 0.3)" />

            <text x="920" y="325" textAnchor="middle" className="station-sublabel-text" fill="rgba(34,49,29,0.7)">Broth aliquots</text>
            <text x="920" y="338" textAnchor="middle" className="station-sublabel-text" fill="rgba(34,49,29,0.7)">Biomass screening</text>
          </g>

          {/* ============================================================ */}
          {/* STATION 07: AROMA ANALYSIS (X=1090)                          */}
          {/* ============================================================ */}
          <g
            className={`svg-station ${activeStageIndex === 6 ? 'is-active' : 'is-muted'}`}
            tabIndex={0}
            role="button"
            aria-label="Select stage 7: Aroma volatile profiling and sensory analysis"
            onClick={() => onSelectStage(6)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectStage(6); } }}
          >
            <rect x="1025" y="60" width="130" height="280" rx="4" fill="transparent" className="station-focus-ring" stroke="var(--foundry-green)" strokeWidth="1.5" />
            <text x="1090" y="85" textAnchor="middle" className="station-badge-text">07</text>
            <text x="1090" y="105" textAnchor="middle" className="station-label-text">Aroma Analysis</text>
            <text x="1090" y="120" textAnchor="middle" className="station-sublabel-text">Profiling</text>

            {/* Instrument Tower (GC-MS) */}
            <rect x="1045" y="165" width="34" height="75" rx="3" stroke="var(--foundry-green)" strokeWidth="1.4" fill="var(--culture-white)" />
            <rect x="1054" y="152" width="16" height="13" rx="1.5" stroke="var(--foundry-green)" strokeWidth="1.2" fill="var(--culture-white)" />
            <line x1="1062" y1="152" x2="1062" y2="165" stroke="var(--growth-green)" strokeWidth="1.4" />
            <circle cx="1062" cy="185" r="3.5" stroke="var(--foundry-green)" strokeWidth="1" fill={activeStageIndex === 6 ? "var(--growth-green)" : "none"} />

            {/* Monitor Screen with Chromatogram */}
            <rect x="1088" y="170" width="55" height="45" rx="3" stroke="var(--foundry-green)" strokeWidth="1.4" fill={activeStageIndex === 6 ? "rgba(74, 103, 65, 0.12)" : "rgba(74, 103, 65, 0.04)"} />
            <path d="M 1115 215 L 1115 225 M 1105 225 L 1125 225" stroke="var(--foundry-green)" strokeWidth="1.3" />
            {/* Peaks */}
            <path d="M 1093 205 L 1100 205 L 1104 195 L 1107 205 L 1113 205 L 1116 182 L 1119 205 L 1126 205 L 1129 192 L 1132 205 L 1138 205" stroke="var(--foundry-green)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="1116" cy="182" r="2" fill="var(--growth-green)" />

            <text x="1090" y="325" textAnchor="middle" className="station-sublabel-text" fill="rgba(34,49,29,0.7)">Volatile profiling</text>
            <text x="1090" y="338" textAnchor="middle" className="station-sublabel-text" fill="rgba(34,49,29,0.7)">Sensory evaluation</text>
          </g>

          {/* ============================================================ */}
          {/* STATION 08: INGREDIENT DEVELOPMENT (X=1270)                  */}
          {/* ============================================================ */}
          <g
            className={`svg-station ${activeStageIndex === 7 ? 'is-active' : 'is-muted'}`}
            tabIndex={0}
            role="button"
            aria-label="Select stage 8: Ingredient development for food producers"
            onClick={() => onSelectStage(7)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectStage(7); } }}
          >
            <rect x="1205" y="60" width="130" height="280" rx="4" fill="transparent" className="station-focus-ring" stroke="var(--foundry-green)" strokeWidth="1.5" />
            <text x="1270" y="85" textAnchor="middle" className="station-badge-text">08</text>
            <text x="1270" y="105" textAnchor="middle" className="station-label-text">Ingredient Dev</text>
            <text x="1270" y="120" textAnchor="middle" className="station-sublabel-text">Food application</text>

            {/* Extract Bottle */}
            <g transform="translate(1245, 172)">
              <rect x="8" y="0" width="16" height="8" rx="1.5" stroke="var(--foundry-green)" strokeWidth="1.3" fill="var(--culture-white)" />
              <path d="M 10 8 L 10 13 M 22 13 L 22 8" stroke="var(--foundry-green)" strokeWidth="1.2" />
              <path d="M 10 13 L 3 19 C 1 21 1 24 1 28 L 1 60 C 1 65 4 68 9 68 L 23 68 C 28 68 31 65 31 60 L 31 28 C 31 24 31 21 29 19 L 22 13 Z" stroke="var(--foundry-green)" strokeWidth="1.5" fill={activeStageIndex === 7 ? "rgba(74, 103, 65, 0.16)" : "rgba(74, 103, 65, 0.06)"} strokeLinejoin="round" />
              <path d="M 2 36 L 30 36 L 30 60 C 30 64 27 67 23 67 L 9 67 C 5 67 2 64 2 60 Z" fill="rgba(34, 49, 29, 0.18)" />
              <circle cx="16" cy="48" r="3.5" fill="var(--growth-green)" />
            </g>

            {/* Radiating culinary application vectors */}
            <g className={activeStageIndex === 7 ? "anim-target-vector" : ""}>
              <path d="M 1285 190 L 1325 175" stroke="var(--foundry-green)" strokeWidth="1.3" strokeDasharray="2 2" />
              <circle cx="1328" cy="174" r="2.8" stroke="var(--foundry-green)" strokeWidth="1.2" fill="var(--culture-white)" />
              <path d="M 1285 208 L 1335 208" stroke="var(--foundry-green)" strokeWidth="1.4" />
              <circle cx="1340" cy="208" r="3.2" fill="var(--foundry-green)" />
              <path d="M 1285 226 L 1325 240" stroke="var(--foundry-green)" strokeWidth="1.3" strokeDasharray="2 2" />
              <circle cx="1328" cy="241" r="2.8" stroke="var(--foundry-green)" strokeWidth="1.2" fill="var(--culture-white)" />
            </g>

            <text x="1335" y="158" textAnchor="end" className="station-sublabel-text" fill="var(--culture-green)" style={{ fontSize: '8.5px', fontWeight: 600 }}>Food producers</text>

            <text x="1270" y="325" textAnchor="middle" className="station-sublabel-text" fill="rgba(34,49,29,0.7)">Consistent aroma</text>
            <text x="1270" y="338" textAnchor="middle" className="station-sublabel-text" fill="rgba(34,49,29,0.7)">Culinary testing</text>
          </g>
        </svg>
      </div>

      <div className="diagram-caption-footer">
        <div className="keyboard-hint" aria-hidden="true">
          <span>Navigate:</span>
          <span className="kbd-key">←</span>
          <span className="kbd-key">→</span>
          <span>(1–8) or click any stage</span>
        </div>
        <div className="diagram-status-note">
          Biology · Engineering · Evidence
        </div>
      </div>
    </div>
  );
};

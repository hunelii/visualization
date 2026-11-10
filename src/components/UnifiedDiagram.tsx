import React, { useRef, useState } from 'react';
import { StageData } from '../types';

interface UnifiedDiagramProps {
  stages: StageData[];
  activeStageIndex: number;
  continuousStage: number;
  stageDwellProgress?: number;
  onSelectStage: (index: number) => void;
  onScrubProgress?: (progress0to1: number) => void;
}

const STATION_X = [90, 250, 410, 570, 740, 920, 1090, 1270];

const STAGE_TELEMETRY_LABELS = [
  'BRIX & CARBON BASELINE SCREENING',
  'NUTRIENT STERILIZATION & AGITATION',
  'TUBER MELANOSPORUM STRAIN VITALITY',
  'ASEPTIC MYCELIAL SEED TRANSFER',
  'SUBMERGED BIOREACTOR · 5 SENSORS ACTIVE',
  'STERILE ALIQUOT FRACTIONATION',
  'GC-MS VOLATILE PEAK PROFILING',
  'CULINARY MATRIX STANDARDIZATION',
];

const clamp = (val: number, min: number, max: number) =>
  Math.max(min, Math.min(max, val));

// Interpolate X coordinate along the 8 stations for continuous camera gliding
const getInterpolatedStationX = (contStage: number): number => {
  const clamped = clamp(contStage, 0, STATION_X.length - 1);
  const lowIdx = Math.floor(clamped);
  const highIdx = Math.min(STATION_X.length - 1, lowIdx + 1);
  const t = clamped - lowIdx;
  const smoothT = t * t * (3 - 2 * t);
  return STATION_X[lowIdx] + (STATION_X[highIdx] - STATION_X[lowIdx]) * smoothT;
};

export const UnifiedDiagram: React.FC<UnifiedDiagramProps> = ({
  stages,
  activeStageIndex,
  continuousStage,
  stageDwellProgress = 0.5,
  onSelectStage,
  onScrubProgress,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const [isDraggingTrack, setIsDraggingTrack] = useState(false);

  const currentStage = stages[activeStageIndex] || stages[0];

  // Continuous overall progress (0..1) and percentage (13%..100%)
  const rawProgress0to1 = clamp(continuousStage / 7, 0, 1);
  const displayPercent = Math.round(13 + rawProgress0to1 * 87);
  const trackFillPercent = rawProgress0to1 * 100;

  // Interpolated spotlight X
  const spotlightX = getInterpolatedStationX(continuousStage);

  // Auto-pan horizontal scroll on narrow mobile screens so spotlight stays centered
  React.useEffect(() => {
    const el = svgContainerRef.current;
    if (!el || el.scrollWidth <= el.clientWidth + 4) return;
    const ratio = clamp((spotlightX - 90) / (1270 - 90), 0, 1);
    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    el.scrollLeft = ratio * maxScrollLeft;
  }, [spotlightX]);

  // Feedback loop activation weight (smoothly active across stages 05, 06, 07 -> indices 4, 5, 6)
  const feedbackWeight =
    continuousStage >= 3.3 && continuousStage <= 6.7
      ? clamp(
          Math.min(
            (continuousStage - 3.3) / 0.6,
            (6.7 - continuousStage) / 0.6
          ),
          0,
          1
        )
      : 0;
  const isFeedbackActive = feedbackWeight > 0.08;

  // Segment fill helper (returns 0..1 for how filled a conduit between startStage and endStage is)
  const getSegmentFill = (startStage: number, endStage: number) =>
    clamp((continuousStage - startStage) / (endStage - startStage), 0, 1);

  // Station proximity helper (1 when directly focused, 0 when >= 1.25 stages away)
  const getStationProximity = (idx: number) =>
    clamp(1 - Math.abs(continuousStage - idx) / 1.25, 0, 1);

  // Station cumulative completion (0 before reaching station, 0..1 while dwelling on station, 1 after passing)
  const getStationCompletion = (idx: number) => {
    if (idx < activeStageIndex) return 1;
    if (idx === activeStageIndex) return clamp(0.2 + stageDwellProgress * 0.8, 0.2, 1);
    return clamp(continuousStage - idx + 0.5, 0, 1);
  };

  // Pointer scrubbing on the progress track
  const handleTrackPointer = (clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
    if (onScrubProgress) {
      onScrubProgress(ratio);
    } else {
      onSelectStage(Math.round(ratio * 7));
    }
  };

  const onPointerDownTrack = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).tagName === 'BUTTON') return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDraggingTrack(true);
    handleTrackPointer(e.clientX);
  };

  const onPointerMoveTrack = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingTrack) return;
    handleTrackPointer(e.clientX);
  };

  const onPointerUpTrack = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingTrack) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDraggingTrack(false);
  };

  // Segment fills
  const fill01to02 = getSegmentFill(0, 1);
  const fill02to04 = getSegmentFill(1, 3);
  const fill03to04 = getSegmentFill(2, 3);
  const fill04to05 = getSegmentFill(3, 4);
  const fill05to06 = getSegmentFill(4, 5);
  const fill06to07 = getSegmentFill(5, 6);
  const fill07to08 = getSegmentFill(6, 7);

  // Phase band active states
  const phase1Weight = clamp(1 - Math.max(0, continuousStage - 1.3), 0, 1);
  const phase2Weight =
    continuousStage >= 1.2 && continuousStage <= 4.6
      ? clamp(Math.min(continuousStage - 1.2, 4.6 - continuousStage), 0, 1)
      : 0;
  const phase3Weight =
    continuousStage >= 4.2 && continuousStage <= 6.6
      ? clamp(Math.min(continuousStage - 4.2, 6.6 - continuousStage), 0, 1)
      : 0;
  const phase4Weight = clamp(continuousStage - 6.1, 0, 1);

  return (
    <div className="diagram-card">
      {/* Dynamic Scrollytelling Header & Progress Bar */}
      <div className="diagram-meta-header" aria-hidden="true">
        <div className="diagram-progress-info">
          <span className="diagram-meta-title">
            STAGE 0{activeStageIndex + 1} OF 08
          </span>
          <span className="diagram-meta-phase">
            {currentStage ? ` · ${currentStage.phase.toUpperCase()}` : ''}
          </span>
        </div>
        <div className="diagram-meta-right">
          <span className="diagram-telemetry-tag">
            {STAGE_TELEMETRY_LABELS[activeStageIndex]}
          </span>
          <span className="diagram-meta-flow">{displayPercent}% COMPLETED</span>
        </div>
      </div>

      {/* Interactive Scrubbable Progress Track Line */}
      <div
        ref={trackRef}
        className={`scroll-progress-track ${isDraggingTrack ? 'is-scrubbing' : ''}`}
        onPointerDown={onPointerDownTrack}
        onPointerMove={onPointerMoveTrack}
        onPointerUp={onPointerUpTrack}
        onPointerCancel={onPointerUpTrack}
        role="slider"
        aria-label="Process scroll progress"
        aria-valuemin={1}
        aria-valuemax={8}
        aria-valuenow={activeStageIndex + 1}
        aria-valuetext={`Stage ${activeStageIndex + 1}: ${currentStage?.name}`}
        tabIndex={0}
      >
        <div
          className="scroll-progress-fill"
          style={{ width: `${trackFillPercent}%` }}
        />
        {/* Continuous Playhead Thumb */}
        <div
          className="scroll-playhead-glow"
          style={{ left: `${trackFillPercent}%` }}
        />
        {/* Stage Milestone Dots */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => {
          const isPassed = continuousStage >= idx - 0.12;
          const isCurrent = idx === activeStageIndex;
          return (
            <button
              key={idx}
              type="button"
              className={`milestone-dot ${isPassed ? 'is-passed' : ''} ${isCurrent ? 'is-current' : ''}`}
              style={{ left: `${(idx / 7) * 100}%` }}
              onClick={(e) => {
                e.stopPropagation();
                onSelectStage(idx);
              }}
              title={`0${idx + 1} · ${stages[idx]?.name}`}
              aria-label={`Jump to stage 0${idx + 1}: ${stages[idx]?.name}`}
            />
          );
        })}
      </div>

      <div ref={svgContainerRef} className="svg-container" style={{ aspectRatio: '1440 / 495' }}>
        <svg
          className="process-svg"
          viewBox="0 0 1440 495"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Interactive scroll-driven 8-stage process schematic: Molasses, Medium Preparation, Fungal Culture, Inoculation, Fermentation, Sampling, Aroma Analysis, and Ingredient Development"
        >
          {/* ============================================================ */}
          {/* SCROLL-REACTIVE PHASE ZONES & TECHNICAL REGISTRATION GRID     */}
          {/* ============================================================ */}
          <g className="svg-grid-registration" aria-hidden="true">
            {/* Phase Zone Top Brackets that illuminate as you scroll */}
            {/* Phase 1: 01-02 */}
            <g opacity={0.28 + phase1Weight * 0.72}>
              <line x1="40" y1="22" x2="305" y2="22" stroke="var(--growth-green)" strokeWidth={1 + phase1Weight * 1.2} />
              <line x1="40" y1="22" x2="40" y2="28" stroke="var(--growth-green)" strokeWidth="1.2" />
              <line x1="305" y1="22" x2="305" y2="28" stroke="var(--growth-green)" strokeWidth="1.2" />
              <text x="172" y="16" textAnchor="middle" className="station-sublabel-text" style={{ fontSize: '8px', fontWeight: 600 }}>
                PHASE I · FEEDSTOCK &amp; MEDIUM
              </text>
            </g>

            {/* Phase 2: 03-05 */}
            <g opacity={0.28 + phase2Weight * 0.72}>
              <line x1="355" y1="22" x2="815" y2="22" stroke="var(--growth-green)" strokeWidth={1 + phase2Weight * 1.2} />
              <line x1="355" y1="22" x2="355" y2="28" stroke="var(--growth-green)" strokeWidth="1.2" />
              <line x1="815" y1="22" x2="815" y2="28" stroke="var(--growth-green)" strokeWidth="1.2" />
              <text x="585" y="16" textAnchor="middle" className="station-sublabel-text" style={{ fontSize: '8px', fontWeight: 600 }}>
                PHASE II · CULTIVATION &amp; SUBMERGED FERMENTATION
              </text>
            </g>

            {/* Phase 3: 06-07 */}
            <g opacity={0.28 + phase3Weight * 0.72}>
              <line x1="860" y1="22" x2="1155" y2="22" stroke="var(--growth-green)" strokeWidth={1 + phase3Weight * 1.2} />
              <line x1="860" y1="22" x2="860" y2="28" stroke="var(--growth-green)" strokeWidth="1.2" />
              <line x1="1155" y1="22" x2="1155" y2="28" stroke="var(--growth-green)" strokeWidth="1.2" />
              <text x="1007" y="16" textAnchor="middle" className="station-sublabel-text" style={{ fontSize: '8px', fontWeight: 600 }}>
                PHASE III · SAMPLING &amp; VOLATILE ANALYSIS
              </text>
            </g>

            {/* Phase 4: 08 */}
            <g opacity={0.28 + phase4Weight * 0.72}>
              <line x1="1200" y1="22" x2="1365" y2="22" stroke="var(--growth-green)" strokeWidth={1 + phase4Weight * 1.2} />
              <line x1="1200" y1="22" x2="1200" y2="28" stroke="var(--growth-green)" strokeWidth="1.2" />
              <line x1="1365" y1="22" x2="1365" y2="28" stroke="var(--growth-green)" strokeWidth="1.2" />
              <text x="1282" y="16" textAnchor="middle" className="station-sublabel-text" style={{ fontSize: '8px', fontWeight: 600 }}>
                PHASE IV · FORMULATION
              </text>
            </g>

            {/* Corner registration crosses */}
            <g stroke="rgba(34, 49, 29, 0.14)" strokeWidth="1">
              <path d="M 20 34 L 32 34 M 26 28 L 26 40" />
              <path d="M 1408 34 L 1420 34 M 1414 28 L 1414 40" />
              <path d="M 20 460 L 32 460 M 26 454 L 26 466" />
              <path d="M 1408 460 L 1420 460 M 1414 454 L 1414 466" />
            </g>

            {/* Baseline axis */}
            <line x1="30" y1="220" x2="1410" y2="220" stroke="rgba(34, 49, 29, 0.08)" strokeDasharray="4 6" />

            {/* Continuous Bottom Timeline Progress Axis (Y=456) */}
            <line x1="90" y1="456" x2="1270" y2="456" stroke="rgba(34, 49, 29, 0.12)" strokeWidth="1.5" />
            <line
              x1="90"
              y1="456"
              x2={spotlightX}
              y2="456"
              stroke="var(--growth-green)"
              strokeWidth="2.2"
              strokeLinecap="round"
            />

            {/* Station bottom marker nodes with scroll-driven pulse & check state */}
            {STATION_X.map((x, idx) => {
              const prox = getStationProximity(idx);
              const isPassed = continuousStage >= idx - 0.08;
              return (
                <g key={idx}>
                  <circle
                    cx={x}
                    cy="456"
                    r={3.5 + prox * 2.5}
                    fill={isPassed ? 'var(--foundry-green)' : 'var(--culture-white)'}
                    stroke={isPassed ? 'var(--foundry-green)' : 'rgba(34, 49, 29, 0.3)'}
                    strokeWidth="1.4"
                  />
                  {prox > 0.25 && (
                    <circle
                      cx={x}
                      cy="456"
                      r={7 + prox * 4}
                      stroke="var(--growth-green)"
                      strokeWidth="1"
                      opacity={prox * 0.65}
                    />
                  )}
                  <text
                    x={x}
                    y="475"
                    textAnchor="middle"
                    className="station-badge-text"
                    style={{
                      fontSize: '9px',
                      opacity: isPassed ? 0.9 : 0.35,
                      fill: idx === activeStageIndex ? 'var(--foundry-green)' : 'var(--culture-green)',
                    }}
                  >
                    0{idx + 1}
                  </text>
                </g>
              );
            })}
          </g>

          {/* ============================================================ */}
          {/* DYNAMIC CONTINUOUS SCROLL CAMERA SPOTLIGHT                   */}
          {/* ============================================================ */}
          <g
            className="camera-spotlight-group"
            transform={`translate(${spotlightX.toFixed(2)}, 0)`}
            aria-hidden="true"
          >
            {/* Outer ambient aura */}
            <ellipse cx="0" cy="205" rx="88" ry="148" fill="rgba(74, 103, 65, 0.045)" />
            {/* Inner focal halo */}
            <ellipse cx="0" cy="205" rx="74" ry="132" fill="rgba(74, 103, 65, 0.085)" />
            <ellipse
              cx="0"
              cy="205"
              rx="69"
              ry="126"
              stroke="var(--growth-green)"
              strokeWidth="1.3"
              strokeDasharray="3 4"
              opacity="0.8"
            />
            {/* Vertical laser scan line linking top pointer to bottom timeline */}
            <line
              x1="0"
              y1="62"
              x2="0"
              y2="450"
              stroke="var(--growth-green)"
              strokeWidth="0.8"
              strokeDasharray="2 5"
              opacity="0.35"
            />
            {/* Floating top stage indicator pill with live dwell progress bar */}
            <rect x="-28" y="32" width="56" height="18" rx="9" fill="var(--foundry-green)" />
            <rect
              x="-24"
              y="46.5"
              width={48 * clamp(stageDwellProgress, 0.12, 1)}
              height="2"
              rx="1"
              fill="var(--growth-green)"
            />
            <text
              x="0"
              y="44"
              textAnchor="middle"
              fill="var(--culture-white)"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.06em' }}
            >
              STEP 0{activeStageIndex + 1}
            </text>
            {/* Downward indicator arrow */}
            <path
              d="M 0 52 L 0 63 M -4 59 L 0 63 L 4 59"
              stroke="var(--foundry-green)"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* ============================================================ */}
          {/* PROCESS FLOW CONDUITS WITH TRAVELLING LIQUID BOLUS           */}
          {/* ============================================================ */}
          <g className="svg-connectors" aria-hidden="true">
            {/* 01 Molasses -> 02 Medium Prep (X: 130 -> 205) */}
            <path d="M 130 220 L 205 220" stroke="rgba(34, 49, 29, 0.2)" strokeWidth="2" />
            {fill01to02 > 0.01 && (
              <>
                <path
                  d="M 130 220 L 205 220"
                  stroke="var(--foundry-green)"
                  strokeWidth="2.6"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - fill01to02}
                  strokeLinecap="round"
                />
                <path
                  d="M 130 220 L 205 220"
                  stroke="var(--growth-green)"
                  strokeWidth="3"
                  className="flowing-conduit"
                  strokeLinecap="round"
                  opacity={fill01to02}
                />
                {/* Travelling Fluid Bolus */}
                {fill01to02 < 0.99 && (
                  <g transform={`translate(${130 + fill01to02 * 75}, 220)`}>
                    <circle cx="0" cy="0" r="5.5" fill="rgba(74, 103, 65, 0.28)" />
                    <circle cx="0" cy="0" r="3" fill="var(--foundry-green)" />
                  </g>
                )}
              </>
            )}
            <path d="M 165 216 L 171 220 L 165 224" stroke={fill01to02 > 0.5 ? 'var(--foundry-green)' : 'rgba(34, 49, 29, 0.35)'} strokeWidth="1.4" fill="none" />

            {/* 02 Medium Prep -> 04 Inoculation (X: 295 -> 525) */}
            <path d="M 295 220 L 525 220" stroke="rgba(34, 49, 29, 0.2)" strokeWidth="2" />
            {fill02to04 > 0.01 && (
              <>
                <path
                  d="M 295 220 L 525 220"
                  stroke="var(--foundry-green)"
                  strokeWidth="2.6"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - fill02to04}
                  strokeLinecap="round"
                />
                <path
                  d="M 295 220 L 525 220"
                  stroke="var(--growth-green)"
                  strokeWidth="3"
                  className="flowing-conduit"
                  strokeLinecap="round"
                  opacity={fill02to04}
                />
                {fill02to04 < 0.99 && (
                  <g transform={`translate(${295 + fill02to04 * 230}, 220)`}>
                    <circle cx="0" cy="0" r="5.5" fill="rgba(74, 103, 65, 0.28)" />
                    <circle cx="0" cy="0" r="3" fill="var(--foundry-green)" />
                  </g>
                )}
              </>
            )}
            <path d="M 345 216 L 351 220 L 345 224" stroke={fill02to04 > 0.3 ? 'var(--foundry-green)' : 'rgba(34, 49, 29, 0.35)'} strokeWidth="1.4" fill="none" />

            {/* 03 Fungal Culture Inoculum -> 04 Inoculation Port */}
            <path
              d="M 445 235 Q 490 235 520 200 L 542 175"
              stroke="rgba(74, 103, 65, 0.4)"
              strokeWidth="1.8"
              strokeDasharray="3 3"
            />
            {fill03to04 > 0.01 && (
              <>
                <path
                  d="M 445 235 Q 490 235 520 200 L 542 175"
                  stroke="var(--growth-green)"
                  strokeWidth="2.6"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - fill03to04}
                  strokeLinecap="round"
                />
                <path
                  d="M 445 235 Q 490 235 520 200 L 542 175"
                  stroke="var(--foundry-green)"
                  strokeWidth="2.8"
                  className="flowing-conduit"
                  strokeLinecap="round"
                  opacity={fill03to04}
                />
              </>
            )}
            <path d="M 536 178 L 542 174 L 544 182" stroke="var(--growth-green)" strokeWidth="1.5" fill="none" />

            {/* 04 Inoculation -> 05 Fermentation (X: 615 -> 685) */}
            <path d="M 615 220 L 685 220" stroke="rgba(34, 49, 29, 0.2)" strokeWidth="2" />
            {fill04to05 > 0.01 && (
              <>
                <path
                  d="M 615 220 L 685 220"
                  stroke="var(--foundry-green)"
                  strokeWidth="2.6"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - fill04to05}
                  strokeLinecap="round"
                />
                <path
                  d="M 615 220 L 685 220"
                  stroke="var(--growth-green)"
                  strokeWidth="3"
                  className="flowing-conduit"
                  strokeLinecap="round"
                  opacity={fill04to05}
                />
                {fill04to05 < 0.99 && (
                  <g transform={`translate(${615 + fill04to05 * 70}, 220)`}>
                    <circle cx="0" cy="0" r="5.5" fill="rgba(74, 103, 65, 0.28)" />
                    <circle cx="0" cy="0" r="3" fill="var(--foundry-green)" />
                  </g>
                )}
              </>
            )}
            <path d="M 648 216 L 654 220 L 648 224" stroke={fill04to05 > 0.5 ? 'var(--foundry-green)' : 'rgba(34, 49, 29, 0.35)'} strokeWidth="1.4" fill="none" />

            {/* 05 Fermentation -> 06 Sampling (X: 795 -> 875) */}
            <path d="M 795 220 L 875 220" stroke="rgba(34, 49, 29, 0.2)" strokeWidth="2" />
            {fill05to06 > 0.01 && (
              <>
                <path
                  d="M 795 220 L 875 220"
                  stroke="var(--foundry-green)"
                  strokeWidth="2.6"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - fill05to06}
                  strokeLinecap="round"
                />
                <path
                  d="M 795 220 L 875 220"
                  stroke="var(--growth-green)"
                  strokeWidth="3"
                  className="flowing-conduit"
                  strokeLinecap="round"
                  opacity={fill05to06}
                />
                {fill05to06 < 0.99 && (
                  <g transform={`translate(${795 + fill05to06 * 80}, 220)`}>
                    <circle cx="0" cy="0" r="5.5" fill="rgba(74, 103, 65, 0.28)" />
                    <circle cx="0" cy="0" r="3" fill="var(--foundry-green)" />
                  </g>
                )}
              </>
            )}
            <path d="M 832 216 L 838 220 L 832 224" stroke={fill05to06 > 0.5 ? 'var(--foundry-green)' : 'rgba(34, 49, 29, 0.35)'} strokeWidth="1.4" fill="none" />

            {/* 06 Sampling -> 07 Aroma Analysis (X: 965 -> 1040) */}
            <path d="M 965 220 L 1040 220" stroke="rgba(34, 49, 29, 0.2)" strokeWidth="2" />
            {fill06to07 > 0.01 && (
              <>
                <path
                  d="M 965 220 L 1040 220"
                  stroke="var(--foundry-green)"
                  strokeWidth="2.6"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - fill06to07}
                  strokeLinecap="round"
                />
                <path
                  d="M 965 220 L 1040 220"
                  stroke="var(--growth-green)"
                  strokeWidth="3"
                  className="flowing-conduit"
                  strokeLinecap="round"
                  opacity={fill06to07}
                />
                {fill06to07 < 0.99 && (
                  <g transform={`translate(${965 + fill06to07 * 75}, 220)`}>
                    <circle cx="0" cy="0" r="5.5" fill="rgba(74, 103, 65, 0.28)" />
                    <circle cx="0" cy="0" r="3" fill="var(--foundry-green)" />
                  </g>
                )}
              </>
            )}
            <path d="M 998 216 L 1004 220 L 998 224" stroke={fill06to07 > 0.5 ? 'var(--foundry-green)' : 'rgba(34, 49, 29, 0.35)'} strokeWidth="1.4" fill="none" />

            {/* 07 Aroma Analysis -> 08 Ingredient Development (X: 1150 -> 1225) */}
            <path d="M 1150 220 L 1225 220" stroke="rgba(34, 49, 29, 0.2)" strokeWidth="2" />
            {fill07to08 > 0.01 && (
              <>
                <path
                  d="M 1150 220 L 1225 220"
                  stroke="var(--foundry-green)"
                  strokeWidth="2.6"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - fill07to08}
                  strokeLinecap="round"
                />
                <path
                  d="M 1150 220 L 1225 220"
                  stroke="var(--growth-green)"
                  strokeWidth="3"
                  className="flowing-conduit"
                  strokeLinecap="round"
                  opacity={fill07to08}
                />
                {fill07to08 < 0.99 && (
                  <g transform={`translate(${1150 + fill07to08 * 75}, 220)`}>
                    <circle cx="0" cy="0" r="5.5" fill="rgba(74, 103, 65, 0.28)" />
                    <circle cx="0" cy="0" r="3" fill="var(--foundry-green)" />
                  </g>
                )}
              </>
            )}
            <path d="M 1184 216 L 1190 220 L 1184 224" stroke={fill07to08 > 0.5 ? 'var(--foundry-green)' : 'rgba(34, 49, 29, 0.35)'} strokeWidth="1.4" fill="none" />
          </g>

          {/* ============================================================ */}
          {/* FEEDBACK LOOP: 07 / 06 -> 05 FERMENTATION                   */}
          {/* ============================================================ */}
          <g className={`feedback-loop-layer ${isFeedbackActive ? 'is-active' : ''}`} aria-hidden="true">
            <path
              d="M 1090 280 L 1090 395 L 740 395 L 740 300"
              stroke={isFeedbackActive ? 'var(--growth-green)' : 'rgba(74, 103, 65, 0.32)'}
              strokeWidth={isFeedbackActive ? '2' : '1.2'}
              strokeDasharray="4 4"
              fill="none"
            />
            {isFeedbackActive && (
              <>
                <path
                  d="M 1090 280 L 1090 395 L 740 395 L 740 300"
                  stroke="var(--foundry-green)"
                  strokeWidth="2.8"
                  className="flowing-conduit-reverse"
                  fill="none"
                  opacity={feedbackWeight}
                />
                {/* Scroll-driven feedback data packet gliding left along Y=395 */}
                <circle
                  cx={1070 - ((continuousStage * 1.4) % 1) * 310}
                  cy="395"
                  r="4"
                  fill="var(--foundry-green)"
                  opacity={feedbackWeight}
                />
              </>
            )}

            <path
              d="M 920 285 L 920 395"
              stroke={isFeedbackActive ? 'var(--growth-green)' : 'rgba(74, 103, 65, 0.32)'}
              strokeWidth={isFeedbackActive ? '2' : '1.2'}
              strokeDasharray="4 4"
              fill="none"
            />
            <path
              d="M 736 308 L 740 300 L 744 308"
              stroke={isFeedbackActive ? 'var(--foundry-green)' : 'rgba(74, 103, 65, 0.5)'}
              strokeWidth="1.6"
              fill="none"
            />

            {/* Analytical feedback pill */}
            <g transform={`translate(980, 385) scale(${1 + feedbackWeight * 0.06})`}>
              <rect
                x="-65"
                y="-12"
                width="130"
                height="24"
                rx="12"
                fill={isFeedbackActive ? 'var(--foundry-green)' : 'var(--culture-white)'}
                stroke={isFeedbackActive ? 'var(--foundry-green)' : 'rgba(34, 49, 29, 0.3)'}
                strokeWidth="1.3"
              />
              <text
                x="0"
                y="4"
                textAnchor="middle"
                className="station-sublabel-text"
                fill={isFeedbackActive ? 'var(--culture-white)' : 'var(--culture-green)'}
                style={{ fontSize: '9px', fontWeight: 600 }}
              >
                Analytical feedback
              </text>
            </g>
            <path
              d="M 900 392 L 892 395 L 900 398"
              stroke={isFeedbackActive ? 'var(--foundry-green)' : 'rgba(34, 49, 29, 0.4)'}
              strokeWidth="1.4"
              fill="none"
            />

            {/* Process optimization pill */}
            <g transform={`translate(825, 385) scale(${1 + feedbackWeight * 0.06})`}>
              <rect
                x="-65"
                y="-12"
                width="130"
                height="24"
                rx="12"
                fill={isFeedbackActive ? 'var(--growth-green)' : 'var(--culture-white)'}
                stroke={isFeedbackActive ? 'var(--foundry-green)' : 'rgba(34, 49, 29, 0.3)'}
                strokeWidth="1.3"
              />
              <text
                x="0"
                y="4"
                textAnchor="middle"
                className="station-sublabel-text"
                fill={isFeedbackActive ? 'var(--culture-white)' : 'var(--culture-green)'}
                style={{ fontSize: '9px', fontWeight: 600 }}
              >
                Process optimization
              </text>
            </g>
          </g>

          {/* ============================================================ */}
          {/* STATION 01: MOLASSES (X=90)                                  */}
          {/* ============================================================ */}
          {(() => {
            const prox = getStationProximity(0);
            const comp = getStationCompletion(0);
            const scale = 0.95 + prox * 0.12 + (comp > 0.8 ? 0.02 : 0);
            const liftY = -prox * 7;
            const dropletY = 166 + prox * 12;
            const liquidTop = 212 - (comp * 22 + prox * 12);
            const liquidHeight = Math.max(12, 238.5 - liquidTop);
            return (
              <g
                className={`svg-station ${activeStageIndex === 0 ? 'is-active' : 'is-muted'}`}
                transform={`translate(90, 205) translate(0, ${liftY.toFixed(1)}) scale(${scale.toFixed(3)}) translate(-90, -205)`}
                style={{ opacity: Math.max(0.45, 0.45 + prox * 0.55 + comp * 0.2) }}
                tabIndex={0}
                role="button"
                aria-label="Select stage 1: Molasses feedstock selection"
                onClick={() => onSelectStage(0)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectStage(0);
                  }
                }}
              >
                <rect x="25" y="60" width="130" height="280" rx="4" fill="transparent" className="station-focus-ring" stroke="var(--foundry-green)" strokeWidth="1.5" />
                <text x="90" y="85" textAnchor="middle" className="station-badge-text">01</text>
                <text x="90" y="105" textAnchor="middle" className="station-label-text">Molasses</text>
                <text x="90" y="120" textAnchor="middle" className="station-sublabel-text">Feedstock</text>

                {/* Dropper & Animated Falling Droplets */}
                <g transform={`translate(56, ${dropletY.toFixed(1)})`}>
                  <path
                    d="M 0 -22 C 10 -4 14 6 14 16 C 14 26 8 32 0 32 C -8 32 -14 26 -14 16 C -14 6 -10 -4 0 -22 Z"
                    stroke="var(--foundry-green)"
                    strokeWidth="1.5"
                    fill={`rgba(74, 103, 65, ${(0.18 + prox * 0.22).toFixed(2)})`}
                  />
                  <circle cx="0" cy="14" r={2.5 + prox * 1} fill="var(--foundry-green)" />
                </g>

                {/* Storage Tank */}
                <rect
                  x="75"
                  y="165"
                  width="46"
                  height="75"
                  rx="4"
                  stroke="var(--foundry-green)"
                  strokeWidth="1.6"
                  fill="rgba(74, 103, 65, 0.04)"
                />
                {/* Dynamic Molasses Liquid Fill */}
                <rect
                  x="76.5"
                  y={liquidTop}
                  width="43"
                  height={liquidHeight}
                  rx="2.5"
                  fill={`rgba(55, 79, 47, ${(0.18 + prox * 0.22 + comp * 0.08).toFixed(2)})`}
                />
                <line x1="77" y1={liquidTop} x2="119" y2={liquidTop} stroke="var(--foundry-green)" strokeWidth="1.2" strokeDasharray="2 2" />

                {/* Swirling sucrose & mineral particles inside tank */}
                <circle cx={88 + Math.sin(continuousStage * 5) * 4} cy={liquidTop + 14} r="2.2" fill="var(--foundry-green)" />
                <circle cx={105 - Math.cos(continuousStage * 5) * 4} cy={liquidTop + 26} r="1.8" fill="var(--growth-green)" />
                <circle cx={92 + Math.cos(continuousStage * 4) * 5} cy={liquidTop + 36} r="2" fill="var(--foundry-green)" />
                <circle cx="108" cy={liquidTop + 16} r="1.5" fill="var(--growth-green)" />

                {/* Vertical Brix Level Gauge Bar next to tank */}
                <rect x="126" y="170" width="4" height="65" rx="2" fill="rgba(34, 49, 29, 0.12)" />
                <rect
                  x="126"
                  y={235 - 65 * clamp(comp * 0.7 + prox * 0.3, 0.2, 1)}
                  width="4"
                  height={65 * clamp(comp * 0.7 + prox * 0.3, 0.2, 1)}
                  rx="2"
                  fill="var(--growth-green)"
                />

                <path d="M 80 240 L 76 252 M 116 240 L 120 252" stroke="var(--foundry-green)" strokeWidth="1.4" strokeLinecap="round" />

                <text x="90" y="325" textAnchor="middle" className="station-sublabel-text" fill="rgba(34,49,29,0.75)">Sugar byproduct</text>
                <text x="90" y="338" textAnchor="middle" className="station-sublabel-text" fill="rgba(34,49,29,0.75)">Carbon baseline</text>
              </g>
            );
          })()}

          {/* ============================================================ */}
          {/* STATION 02: MEDIUM PREPARATION (X=250)                       */}
          {/* ============================================================ */}
          {(() => {
            const prox = getStationProximity(1);
            const comp = getStationCompletion(1);
            const scale = 0.95 + prox * 0.12 + (comp > 0.8 ? 0.02 : 0);
            const liftY = -prox * 7;
            const bladeSpan = 18 * (0.3 + 0.7 * Math.abs(Math.cos(continuousStage * Math.PI * 3.5)));
            const brothTop = 225 - (comp * 28 + prox * 12);
            const brothHeight = Math.max(12, 238.5 - brothTop);
            return (
              <g
                className={`svg-station ${activeStageIndex === 1 ? 'is-active' : 'is-muted'}`}
                transform={`translate(250, 205) translate(0, ${liftY.toFixed(1)}) scale(${scale.toFixed(3)}) translate(-250, -205)`}
                style={{ opacity: Math.max(0.45, 0.45 + prox * 0.55 + comp * 0.2) }}
                tabIndex={0}
                role="button"
                aria-label="Select stage 2: Medium preparation and nutrient formulation"
                onClick={() => onSelectStage(1)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectStage(1);
                  }
                }}
              >
                <rect x="185" y="60" width="130" height="280" rx="4" fill="transparent" className="station-focus-ring" stroke="var(--foundry-green)" strokeWidth="1.5" />
                <text x="250" y="85" textAnchor="middle" className="station-badge-text">02</text>
                <text x="250" y="105" textAnchor="middle" className="station-label-text">Medium Prep</text>
                <text x="250" y="120" textAnchor="middle" className="station-sublabel-text">Formulation</text>

                {/* Agitator Motor */}
                <rect x="241" y="143" width="18" height="18" rx="2" stroke="var(--foundry-green)" strokeWidth="1.4" fill="var(--culture-white)" />
                <circle cx="250" cy="152" r="2.5" fill={prox > 0.2 || comp > 0.5 ? 'var(--growth-green)' : 'rgba(34,49,29,0.25)'} />
                <line x1="250" y1="161" x2="250" y2="235" stroke="var(--foundry-green)" strokeWidth="1.5" />

                {/* Tank Contour */}
                <rect
                  x="215"
                  y="165"
                  width="70"
                  height="75"
                  rx="5"
                  stroke="var(--foundry-green)"
                  strokeWidth="1.6"
                  fill="rgba(74, 103, 65, 0.04)"
                />
                {/* Rising Nutrient Broth Fill */}
                <rect
                  x="216.5"
                  y={brothTop}
                  width="67"
                  height={brothHeight}
                  rx="3.5"
                  fill={`rgba(74, 103, 65, ${(0.08 + prox * 0.16 + comp * 0.08).toFixed(2)})`}
                />
                {/* Vortex wave meniscus */}
                <path
                  d={`M 218 ${brothTop} Q 234 ${brothTop + (prox > 0.2 ? 4 : 1)} 250 ${brothTop} T 282 ${brothTop}`}
                  stroke="var(--growth-green)"
                  strokeWidth="1.1"
                  fill="none"
                />

                {/* Scroll-driven rotating dual impeller blades */}
                <line
                  x1={250 - bladeSpan}
                  y1="204"
                  x2={250 + bladeSpan}
                  y2="204"
                  stroke="var(--foundry-green)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1={250 - bladeSpan * 0.85}
                  y1="226"
                  x2={250 + bladeSpan * 0.85}
                  y2="226"
                  stroke="var(--growth-green)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path d="M 223 240 L 219 252 M 277 240 L 281 252" stroke="var(--foundry-green)" strokeWidth="1.4" strokeLinecap="round" />

                <text x="250" y="325" textAnchor="middle" className="station-sublabel-text" fill="rgba(34,49,29,0.75)">Nutrient balancing</text>
                <text x="250" y="338" textAnchor="middle" className="station-sublabel-text" fill="rgba(34,49,29,0.75)">Agitated mixing</text>
              </g>
            );
          })()}

          {/* ============================================================ */}
          {/* STATION 03: FUNGAL CULTURE (X=410)                           */}
          {/* ============================================================ */}
          {(() => {
            const prox = getStationProximity(2);
            const comp = getStationCompletion(2);
            const scale = 0.95 + prox * 0.13 + (comp > 0.8 ? 0.02 : 0);
            const liftY = -prox * 7;
            const colonyFactor = clamp(0.25 + comp * 0.55 + prox * 0.35, 0.25, 1.08);
            const hyphaeReach = 21 * colonyFactor;
            const flaskTilt = Math.sin(continuousStage * Math.PI * 2.5) * (prox * 6);
            return (
              <g
                className={`svg-station ${activeStageIndex === 2 ? 'is-active' : 'is-muted'}`}
                transform={`translate(410, 205) translate(0, ${liftY.toFixed(1)}) scale(${scale.toFixed(3)}) translate(-410, -205)`}
                style={{ opacity: Math.max(0.45, 0.45 + prox * 0.55 + comp * 0.2) }}
                tabIndex={0}
                role="button"
                aria-label="Select stage 3: Fungal culture Tuber melanosporum isolate"
                onClick={() => onSelectStage(2)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectStage(2);
                  }
                }}
              >
                <rect x="345" y="60" width="130" height="280" rx="4" fill="transparent" className="station-focus-ring" stroke="var(--foundry-green)" strokeWidth="1.5" />
                <text x="410" y="85" textAnchor="middle" className="station-badge-text">03</text>
                <text x="410" y="105" textAnchor="middle" className="station-label-text">Fungal Culture</text>
                <text x="410" y="120" textAnchor="middle" className="station-sublabel-text">Strain isolate</text>

                {/* Petri dish */}
                <circle
                  cx="410"
                  cy="165"
                  r="29"
                  stroke="var(--foundry-green)"
                  strokeWidth="1.5"
                  fill={`rgba(74, 103, 65, ${(0.05 + prox * 0.14).toFixed(2)})`}
                />
                <circle cx="410" cy="165" r="25" stroke="rgba(34, 49, 29, 0.2)" strokeWidth="0.8" strokeDasharray="2 2" />
                {/* Expanding Mycelial Colony Halo */}
                <circle
                  cx="410"
                  cy="165"
                  r={hyphaeReach * 0.85}
                  fill="rgba(74, 103, 65, 0.12)"
                />
                {/* Scroll-responsive 12-branch radiating hyphae */}
                <g>
                  {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
                    const r = i % 2 === 0 ? hyphaeReach : hyphaeReach * 0.72;
                    return (
                      <line
                        key={deg}
                        x1="410"
                        y1="165"
                        x2={410 + Math.cos((deg * Math.PI) / 180) * r}
                        y2={165 + Math.sin((deg * Math.PI) / 180) * r}
                        stroke={i % 2 === 0 ? 'var(--foundry-green)' : 'var(--growth-green)'}
                        strokeWidth={1.1 + prox * 0.45}
                        strokeLinecap="round"
                      />
                    );
                  })}
                  <circle cx="410" cy="165" r={3 + prox * 1.2} fill="var(--foundry-green)" />
                </g>

                {/* Orbital Shake Flask pre-culture (tilts gently on scroll) */}
                <g transform={`translate(410, 235) rotate(${flaskTilt.toFixed(2)})`}>
                  <path
                    d="M -5 -24 L 5 -24 M -3 -24 L -3 -15 L -16 16 C -18 20 -14 22 -8 22 L 8 22 C 14 22 18 20 16 16 L 3 -15 L 3 -24"
                    stroke="var(--foundry-green)"
                    strokeWidth="1.4"
                    fill="var(--culture-white)"
                    strokeLinejoin="round"
                  />
                  {/* Liquid broth inside flask */}
                  <path
                    d="M -11 6 L 11 6 L 15 16 C 17 19 13 21 8 21 L -8 21 C -13 21 -17 19 -15 16 Z"
                    fill={`rgba(74, 103, 65, ${(0.14 + prox * 0.16).toFixed(2)})`}
                  />
                  <circle cx="-4" cy="14" r={2.2 + prox * 0.8} fill="var(--growth-green)" />
                  <circle cx="4" cy="16" r={1.8 + prox * 0.7} fill="var(--foundry-green)" />
                  <circle cx="0" cy="11" r={1.6 + prox * 0.6} fill="var(--growth-green)" />
                </g>

                <text x="410" y="325" textAnchor="middle" className="station-sublabel-text" fill="rgba(34,49,29,0.75)">Tuber melanosporum</text>
                <text x="410" y="338" textAnchor="middle" className="station-sublabel-text" fill="rgba(34,49,29,0.75)">Vegetative mycelium</text>
              </g>
            );
          })()}

          {/* ============================================================ */}
          {/* STATION 04: INOCULATION (X=570)                              */}
          {/* ============================================================ */}
          {(() => {
            const prox = getStationProximity(3);
            const comp = getStationCompletion(3);
            const scale = 0.95 + prox * 0.12 + (comp > 0.8 ? 0.02 : 0);
            const liftY = -prox * 7;
            const spread = clamp(comp * 0.6 + prox * 0.4, 0.2, 1);
            return (
              <g
                className={`svg-station ${activeStageIndex === 3 ? 'is-active' : 'is-muted'}`}
                transform={`translate(570, 205) translate(0, ${liftY.toFixed(1)}) scale(${scale.toFixed(3)}) translate(-570, -205)`}
                style={{ opacity: Math.max(0.45, 0.45 + prox * 0.55 + comp * 0.2) }}
                tabIndex={0}
                role="button"
                aria-label="Select stage 4: Inoculation introducing culture into medium"
                onClick={() => onSelectStage(3)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectStage(3);
                  }
                }}
              >
                <rect x="505" y="60" width="130" height="280" rx="4" fill="transparent" className="station-focus-ring" stroke="var(--foundry-green)" strokeWidth="1.5" />
                <text x="570" y="85" textAnchor="middle" className="station-badge-text">04</text>
                <text x="570" y="105" textAnchor="middle" className="station-label-text">Inoculation</text>
                <text x="570" y="120" textAnchor="middle" className="station-sublabel-text">Seeding</text>

                {/* Seed Vessel */}
                <rect
                  x="540"
                  y="165"
                  width="60"
                  height="75"
                  rx="5"
                  stroke="var(--foundry-green)"
                  strokeWidth="1.6"
                  fill={`rgba(74, 103, 65, ${(0.05 + prox * 0.15 + comp * 0.06).toFixed(2)})`}
                />
                {/* Top Aseptic Transfer Port */}
                <path d="M 562 165 L 562 150 L 578 150 L 578 165" stroke="var(--foundry-green)" strokeWidth="1.4" fill="var(--culture-white)" />
                {/* Injection stream line */}
                {prox > 0.15 && (
                  <line
                    x1="570"
                    y1="154"
                    x2="570"
                    y2={175 + prox * 20}
                    stroke="var(--growth-green)"
                    strokeWidth="2"
                    strokeDasharray="3 2"
                  />
                )}
                {/* Expanding Mycelial Micro-colonies */}
                <circle cx="570" cy={190 + spread * 6} r={3.5 + prox * 2} fill="var(--growth-green)" />
                <circle cx={570 - spread * 14} cy={198 + spread * 14} r={2.2 + prox * 1} fill="var(--foundry-green)" />
                <circle cx={570 + spread * 14} cy={196 + spread * 15} r={2.2 + prox * 1} fill="var(--foundry-green)" />
                <circle cx={570 - spread * 9} cy={210 + spread * 16} r={1.8 + prox * 0.8} fill="var(--growth-green)" />
                <circle cx={570 + spread * 10} cy={212 + spread * 14} r={1.8 + prox * 0.8} fill="var(--growth-green)" />
                <path d="M 547 240 L 543 252 M 593 240 L 597 252" stroke="var(--foundry-green)" strokeWidth="1.4" strokeLinecap="round" />

                <text x="570" y="325" textAnchor="middle" className="station-sublabel-text" fill="rgba(34,49,29,0.75)">Aseptic transfer</text>
                <text x="570" y="338" textAnchor="middle" className="station-sublabel-text" fill="rgba(34,49,29,0.75)">Seed propagation</text>
              </g>
            );
          })()}

          {/* ============================================================ */}
          {/* STATION 05: FERMENTATION (X=740 — HERO BIOREACTOR)           */}
          {/* ============================================================ */}
          {(() => {
            const prox = getStationProximity(4);
            const comp = getStationCompletion(4);
            const scale = 0.96 + prox * 0.14 + (comp > 0.8 ? 0.02 : 0);
            const liftY = -prox * 8;
            const biomassScale = clamp(0.55 + comp * 0.35 + prox * 0.3, 0.55, 1.2);
            const bubbleOffset = (continuousStage * 32) % 45;
            return (
              <g
                className={`svg-station ${activeStageIndex === 4 ? 'is-active' : 'is-muted'}`}
                transform={`translate(740, 205) translate(0, ${liftY.toFixed(1)}) scale(${scale.toFixed(3)}) translate(-740, -205)`}
                style={{ opacity: Math.max(0.48, 0.48 + prox * 0.52 + comp * 0.2) }}
                tabIndex={0}
                role="button"
                aria-label="Select stage 5: Fermentation with real-time monitored conditions"
                onClick={() => onSelectStage(4)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectStage(4);
                  }
                }}
              >
                <rect x="665" y="60" width="150" height="280" rx="4" fill="transparent" className="station-focus-ring" stroke="var(--foundry-green)" strokeWidth="1.5" />
                <text x="740" y="85" textAnchor="middle" className="station-badge-text">05</text>
                <text x="740" y="105" textAnchor="middle" className="station-label-text">Fermentation</text>
                <text x="740" y="120" textAnchor="middle" className="station-sublabel-text">Submerged growth</text>

                {/* Overhead Drive Motor */}
                <rect x="731" y="138" width="18" height="20" rx="2" stroke="var(--foundry-green)" strokeWidth="1.5" fill="var(--culture-white)" />
                <circle cx="740" cy="148" r="2.6" fill={prox > 0.25 || comp > 0.5 ? 'var(--growth-green)' : 'rgba(34,49,29,0.25)'} />
                <line x1="740" y1="158" x2="740" y2="242" stroke="var(--foundry-green)" strokeWidth="1.6" />

                {/* Main Glass Vessel */}
                <rect
                  x="702"
                  y="158"
                  width="76"
                  height="92"
                  rx="7"
                  stroke="var(--foundry-green)"
                  strokeWidth="1.8"
                  fill={`rgba(74, 103, 65, ${(0.06 + prox * 0.18 + comp * 0.06).toFixed(2)})`}
                />
                <line x1="700" y1="164" x2="780" y2="164" stroke="var(--foundry-green)" strokeWidth="2.2" />
                <line x1="700" y1="244" x2="780" y2="244" stroke="var(--foundry-green)" strokeWidth="2.2" />

                {/* Rising Aeration Bubbles inside Bioreactor */}
                <g opacity={0.35 + prox * 0.65}>
                  <circle cx="718" cy={236 - bubbleOffset} r="1.6" fill="var(--growth-green)" />
                  <circle cx="762" cy={230 - ((bubbleOffset + 15) % 45)} r="1.8" fill="var(--growth-green)" />
                  <circle cx="730" cy={238 - ((bubbleOffset + 28) % 45)} r="1.4" fill="var(--foundry-green)" />
                  <circle cx="752" cy={234 - ((bubbleOffset + 8) % 45)} r="1.5" fill="var(--foundry-green)" />
                </g>

                {/* Submerged Hyphal Mycelium Network (expands dramatically on scroll) */}
                <g transform={`translate(740, 220) scale(${biomassScale.toFixed(2)}) translate(-740, -220)`}>
                  <path d="M 740 222 Q 724 210 713 202 M 725 211 Q 718 220 711 225 M 728 208 Q 724 196 720 190" stroke="var(--foundry-green)" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M 740 222 Q 756 208 767 200 M 754 211 Q 760 220 767 225 M 752 208 Q 756 196 760 190" stroke="var(--foundry-green)" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="713" cy="202" r="2" fill="var(--growth-green)" />
                  <circle cx="767" cy="200" r="2" fill="var(--growth-green)" />
                  <circle cx="720" cy="190" r="1.7" fill="var(--growth-green)" />
                  <circle cx="760" cy="190" r="1.7" fill="var(--growth-green)" />
                  <circle cx="740" cy="222" r="3" fill="var(--foundry-green)" />
                </g>

                {/* Legs */}
                <path d="M 710 250 L 706 262 M 770 250 L 774 262" stroke="var(--foundry-green)" strokeWidth="1.5" strokeLinecap="round" />

                {/* Live Telemetry Sensor Tags & Mini Progress Bars (Temp, pH, DO, Biomass, Data) */}
                <g transform="translate(783, 162)" className="sensor-tag-mini" aria-hidden="true">
                  {['Temp', 'pH', 'DO', 'Biomass', 'Data'].map((label, sIdx) => {
                    const barFill = clamp((comp * 1.1 + prox * 0.5) - sIdx * 0.12, 0.2, 1);
                    return (
                      <g key={label} transform={`translate(0, ${sIdx * 14})`}>
                        <circle
                          cx="2"
                          cy="5"
                          r="2"
                          fill={prox > 0.25 ? 'var(--growth-green)' : 'rgba(34, 49, 29, 0.35)'}
                        />
                        <text
                          x="7"
                          y="8"
                          className="station-sublabel-text"
                          fill={prox > 0.25 ? 'var(--foundry-green)' : 'var(--culture-green)'}
                          style={{ fontSize: '7.5px', fontWeight: 700 }}
                        >
                          {label}
                        </text>
                        <rect x="7" y="10" width="28" height="2.2" rx="1" fill="rgba(34, 49, 29, 0.12)" />
                        <rect
                          x="7"
                          y="10"
                          width={28 * barFill}
                          height="2.2"
                          rx="1"
                          fill="var(--growth-green)"
                        />
                      </g>
                    );
                  })}
                </g>

                <text x="740" y="325" textAnchor="middle" className="station-sublabel-text" fill="rgba(34,49,29,0.75)">Controlled culture</text>
                <text x="740" y="338" textAnchor="middle" className="station-sublabel-text" fill="rgba(34,49,29,0.75)">5 tracked parameters</text>
              </g>
            );
          })()}

          {/* ============================================================ */}
          {/* STATION 06: SAMPLING (X=920)                                 */}
          {/* ============================================================ */}
          {(() => {
            const prox = getStationProximity(5);
            const comp = getStationCompletion(5);
            const scale = 0.95 + prox * 0.12 + (comp > 0.8 ? 0.02 : 0);
            const liftY = -prox * 7;
            const scanY = 192 + ((continuousStage * 28) % 30);
            return (
              <g
                className={`svg-station ${activeStageIndex === 5 ? 'is-active' : 'is-muted'}`}
                transform={`translate(920, 205) translate(0, ${liftY.toFixed(1)}) scale(${scale.toFixed(3)}) translate(-920, -205)`}
                style={{ opacity: Math.max(0.45, 0.45 + prox * 0.55 + comp * 0.2) }}
                tabIndex={0}
                role="button"
                aria-label="Select stage 6: Sterile sampling and aliquot collection"
                onClick={() => onSelectStage(5)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectStage(5);
                  }
                }}
              >
                <rect x="855" y="60" width="130" height="280" rx="4" fill="transparent" className="station-focus-ring" stroke="var(--foundry-green)" strokeWidth="1.5" />
                <text x="920" y="85" textAnchor="middle" className="station-badge-text">06</text>
                <text x="920" y="105" textAnchor="middle" className="station-label-text">Sampling</text>
                <text x="920" y="120" textAnchor="middle" className="station-sublabel-text">Collection</text>

                {/* Sampling 3-way Valve */}
                <rect x="902" y="160" width="36" height="18" rx="2" stroke="var(--foundry-green)" strokeWidth="1.5" fill="var(--culture-white)" />
                <g transform={`translate(920, 154) rotate(${(prox * 35).toFixed(1)}) translate(-920, -154)`}>
                  <path d="M 920 160 L 920 149 M 911 149 L 929 149" stroke="var(--foundry-green)" strokeWidth="1.5" strokeLinecap="round" />
                </g>

                {/* Test Tubes Rack */}
                <rect x="890" y="195" width="60" height="42" rx="2" stroke="rgba(34, 49, 29, 0.25)" strokeWidth="1" strokeDasharray="2 2" fill="none" />
                {/* Tube 1 */}
                <rect x="898" y="188" width="10" height="36" rx="5" stroke="var(--foundry-green)" strokeWidth="1.3" fill="var(--culture-white)" />
                <rect x="899.5" y={222 - (8 + comp * 10)} width="7" height={8 + comp * 10} rx="3" fill={`rgba(74, 103, 65, ${(0.3 + prox * 0.3).toFixed(2)})`} />
                {/* Tube 2 (Active Aliquot) */}
                <rect x="915" y="188" width="10" height="36" rx="5" stroke="var(--foundry-green)" strokeWidth="1.5" fill={prox > 0.25 ? 'rgba(74, 103, 65, 0.16)' : 'var(--culture-white)'} />
                <rect x="916.5" y={222 - (12 + (comp + prox) * 8)} width="7" height={12 + (comp + prox) * 8} rx="3" fill="var(--growth-green)" />
                {/* Tube 3 */}
                <rect x="932" y="188" width="10" height="36" rx="5" stroke="var(--foundry-green)" strokeWidth="1.3" fill="var(--culture-white)" />
                <rect x="933.5" y={222 - (6 + comp * 11)} width="7" height={6 + comp * 11} rx="3" fill={`rgba(55, 79, 47, ${(0.35 + prox * 0.35).toFixed(2)})`} />

                {/* Horizontal optical screening scan line across tubes */}
                {prox > 0.2 && (
                  <line
                    x1="888"
                    y1={scanY}
                    x2="952"
                    y2={scanY}
                    stroke="var(--growth-green)"
                    strokeWidth="1.2"
                    opacity={prox * 0.85}
                  />
                )}

                <text x="920" y="325" textAnchor="middle" className="station-sublabel-text" fill="rgba(34,49,29,0.75)">Broth aliquots</text>
                <text x="920" y="338" textAnchor="middle" className="station-sublabel-text" fill="rgba(34,49,29,0.75)">Biomass screening</text>
              </g>
            );
          })()}

          {/* ============================================================ */}
          {/* STATION 07: AROMA ANALYSIS (X=1090)                          */}
          {/* ============================================================ */}
          {(() => {
            const prox = getStationProximity(6);
            const comp = getStationCompletion(6);
            const scale = 0.95 + prox * 0.13 + (comp > 0.8 ? 0.02 : 0);
            const liftY = -prox * 7;
            const chromaDraw = clamp(0.25 + comp * 0.55 + prox * 0.45, 0.25, 1);
            const scanX = 1092 + chromaDraw * 46;
            return (
              <g
                className={`svg-station ${activeStageIndex === 6 ? 'is-active' : 'is-muted'}`}
                transform={`translate(1090, 205) translate(0, ${liftY.toFixed(1)}) scale(${scale.toFixed(3)}) translate(-1090, -205)`}
                style={{ opacity: Math.max(0.45, 0.45 + prox * 0.55 + comp * 0.2) }}
                tabIndex={0}
                role="button"
                aria-label="Select stage 7: Aroma volatile profiling and sensory analysis"
                onClick={() => onSelectStage(6)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectStage(6);
                  }
                }}
              >
                <rect x="1025" y="60" width="130" height="280" rx="4" fill="transparent" className="station-focus-ring" stroke="var(--foundry-green)" strokeWidth="1.5" />
                <text x="1090" y="85" textAnchor="middle" className="station-badge-text">07</text>
                <text x="1090" y="105" textAnchor="middle" className="station-label-text">Aroma Analysis</text>
                <text x="1090" y="120" textAnchor="middle" className="station-sublabel-text">Profiling</text>

                {/* Instrument Tower (GC-MS) */}
                <rect x="1045" y="165" width="34" height="75" rx="3" stroke="var(--foundry-green)" strokeWidth="1.5" fill="var(--culture-white)" />
                <rect x="1054" y="152" width="16" height="13" rx="1.5" stroke="var(--foundry-green)" strokeWidth="1.3" fill="var(--culture-white)" />
                <line x1="1062" y1="152" x2="1062" y2="165" stroke="var(--growth-green)" strokeWidth="1.5" />
                <circle cx="1062" cy="182" r="4" stroke="var(--foundry-green)" strokeWidth="1.2" fill={prox > 0.25 || comp > 0.6 ? 'var(--growth-green)' : 'none'} />
                {/* GC Status LEDs */}
                <circle cx="1054" cy="205" r="2" fill={comp > 0.2 ? 'var(--growth-green)' : 'rgba(34,49,29,0.2)'} />
                <circle cx="1062" cy="205" r="2" fill={comp > 0.5 ? 'var(--growth-green)' : 'rgba(34,49,29,0.2)'} />
                <circle cx="1070" cy="205" r="2" fill={prox > 0.4 ? 'var(--foundry-green)' : 'rgba(34,49,29,0.2)'} />

                {/* Monitor Screen with Live Chromatogram */}
                <rect
                  x="1086"
                  y="168"
                  width="58"
                  height="48"
                  rx="3"
                  stroke="var(--foundry-green)"
                  strokeWidth="1.5"
                  fill={`rgba(74, 103, 65, ${(0.05 + prox * 0.15).toFixed(2)})`}
                />
                <path d="M 1115 216 L 1115 226 M 1104 226 L 1126 226" stroke="var(--foundry-green)" strokeWidth="1.4" />

                {/* Scanning cursor inside monitor */}
                {prox > 0.15 && (
                  <line
                    x1={scanX}
                    y1="172"
                    x2={scanX}
                    y2="212"
                    stroke="var(--growth-green)"
                    strokeWidth="0.9"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Scroll-drawn Chromatogram Peaks */}
                <path
                  d="M 1091 206 L 1099 206 L 1103 193 L 1107 206 L 1112 206 L 1116 178 L 1120 206 L 1126 206 L 1130 189 L 1134 206 L 1140 206"
                  stroke="var(--foundry-green)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - chromaDraw}
                />
                <circle cx="1103" cy="193" r={1.5 + prox * 0.8} fill="var(--growth-green)" opacity={chromaDraw > 0.35 ? 1 : 0.2} />
                <circle cx="1116" cy="178" r={2.2 + prox * 1.1} fill="var(--foundry-green)" opacity={chromaDraw > 0.6 ? 1 : 0.2} />
                <circle cx="1130" cy="189" r={1.7 + prox * 0.8} fill="var(--growth-green)" opacity={chromaDraw > 0.85 ? 1 : 0.2} />

                <text x="1090" y="325" textAnchor="middle" className="station-sublabel-text" fill="rgba(34,49,29,0.75)">Volatile profiling</text>
                <text x="1090" y="338" textAnchor="middle" className="station-sublabel-text" fill="rgba(34,49,29,0.75)">Sensory evaluation</text>
              </g>
            );
          })()}

          {/* ============================================================ */}
          {/* STATION 08: INGREDIENT DEVELOPMENT (X=1270)                  */}
          {/* ============================================================ */}
          {(() => {
            const prox = getStationProximity(7);
            const comp = getStationCompletion(7);
            const scale = 0.95 + prox * 0.14 + (comp > 0.8 ? 0.03 : 0);
            const liftY = -prox * 8;
            const extractTop = 44 - (comp * 12 + prox * 8);
            const extractHeight = 67 - extractTop;
            const vectorReach = clamp(0.4 + comp * 0.4 + prox * 0.4, 0.4, 1);
            return (
              <g
                className={`svg-station ${activeStageIndex === 7 ? 'is-active' : 'is-muted'}`}
                transform={`translate(1270, 205) translate(0, ${liftY.toFixed(1)}) scale(${scale.toFixed(3)}) translate(-1270, -205)`}
                style={{ opacity: Math.max(0.45, 0.45 + prox * 0.55 + comp * 0.2) }}
                tabIndex={0}
                role="button"
                aria-label="Select stage 8: Ingredient development for food producers"
                onClick={() => onSelectStage(7)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectStage(7);
                  }
                }}
              >
                <rect x="1205" y="60" width="130" height="280" rx="4" fill="transparent" className="station-focus-ring" stroke="var(--foundry-green)" strokeWidth="1.5" />
                <text x="1270" y="85" textAnchor="middle" className="station-badge-text">08</text>
                <text x="1270" y="105" textAnchor="middle" className="station-label-text">Ingredient Dev</text>
                <text x="1270" y="120" textAnchor="middle" className="station-sublabel-text">Food application</text>

                {/* Extract Bottle */}
                <g transform="translate(1242, 170)">
                  {/* Aroma Halo Rings */}
                  {prox > 0.2 && (
                    <circle
                      cx="16"
                      cy="45"
                      r={22 + prox * 10}
                      stroke="var(--growth-green)"
                      strokeWidth="1"
                      strokeDasharray="2 3"
                      opacity={prox * 0.6}
                    />
                  )}
                  <rect x="8" y={-2 + (1 - prox) * -3} width="16" height="8" rx="1.5" stroke="var(--foundry-green)" strokeWidth="1.4" fill="var(--culture-white)" />
                  <path d="M 10 8 L 10 13 M 22 13 L 22 8" stroke="var(--foundry-green)" strokeWidth="1.2" />
                  <path
                    d="M 10 13 L 3 19 C 1 21 1 24 1 28 L 1 60 C 1 65 4 68 9 68 L 23 68 C 28 68 31 65 31 60 L 31 28 C 31 24 31 21 29 19 L 22 13 Z"
                    stroke="var(--foundry-green)"
                    strokeWidth="1.6"
                    fill={`rgba(74, 103, 65, ${(0.06 + prox * 0.16).toFixed(2)})`}
                    strokeLinejoin="round"
                  />
                  {/* Dynamic rising extract fill inside bottle */}
                  <rect
                    x="2.5"
                    y={extractTop}
                    width="27"
                    height={extractHeight}
                    rx="4"
                    fill={`rgba(34, 49, 29, ${(0.18 + prox * 0.22).toFixed(2)})`}
                  />
                  <circle cx="16" cy="48" r={3.5 + prox * 1.8} fill="var(--growth-green)" />
                </g>

                {/* Radiating culinary application vectors */}
                <g>
                  <path
                    d={`M 1282 190 L ${1282 + 44 * vectorReach} ${190 - 16 * vectorReach}`}
                    stroke="var(--foundry-green)"
                    strokeWidth="1.4"
                    strokeDasharray="2 2"
                  />
                  <circle
                    cx={1282 + 47 * vectorReach}
                    cy={190 - 17 * vectorReach}
                    r={2.5 + prox * 1.2}
                    stroke="var(--foundry-green)"
                    strokeWidth="1.3"
                    fill={prox > 0.4 ? 'var(--growth-green)' : 'var(--culture-white)'}
                  />

                  <path
                    d={`M 1282 208 L ${1282 + 54 * vectorReach} 208`}
                    stroke="var(--foundry-green)"
                    strokeWidth="1.6"
                  />
                  <circle
                    cx={1282 + 58 * vectorReach}
                    cy="208"
                    r={3.2 + prox * 1.4}
                    fill="var(--foundry-green)"
                  />

                  <path
                    d={`M 1282 226 L ${1282 + 44 * vectorReach} ${226 + 15 * vectorReach}`}
                    stroke="var(--foundry-green)"
                    strokeWidth="1.4"
                    strokeDasharray="2 2"
                  />
                  <circle
                    cx={1282 + 47 * vectorReach}
                    cy={226 + 16 * vectorReach}
                    r={2.5 + prox * 1.2}
                    stroke="var(--foundry-green)"
                    strokeWidth="1.3"
                    fill={prox > 0.4 ? 'var(--growth-green)' : 'var(--culture-white)'}
                  />
                </g>

                <text x="1342" y="158" textAnchor="end" className="station-sublabel-text" fill="var(--culture-green)" style={{ fontSize: '8.5px', fontWeight: 600 }}>Food producers</text>

                <text x="1270" y="325" textAnchor="middle" className="station-sublabel-text" fill="rgba(34,49,29,0.75)">Consistent aroma</text>
                <text x="1270" y="338" textAnchor="middle" className="station-sublabel-text" fill="rgba(34,49,29,0.75)">Culinary testing</text>
              </g>
            );
          })()}
        </svg>
      </div>

      {/* Rich Scroll-Reactive Stage Readout Panel inside the Diagram Card */}
      <div className="diagram-active-readout" aria-live="polite">
        <div className="readout-left-group">
          <div className="readout-main">
            <span className="readout-badge">{currentStage.numberString}</span>
            <strong className="readout-title">{currentStage.name}</strong>
            <span className="readout-role-pill">{currentStage.shortRole}</span>
            <span className="readout-divider">·</span>
            <span className="readout-desc">{currentStage.description}</span>
          </div>
          <div className="readout-sub">
            <span className="readout-focus-label">Focus: {currentStage.headline} —</span>
            <span className="readout-context">{currentStage.scientificContext}</span>
          </div>
        </div>
        <div className="readout-controls">
          <button
            type="button"
            className="readout-step-btn"
            onClick={() => onSelectStage(Math.max(0, activeStageIndex - 1))}
            aria-label="Previous stage"
            title="Previous stage (←)"
          >
            ←
          </button>
          <button
            type="button"
            className="readout-step-btn"
            onClick={() => onSelectStage(Math.min(stages.length - 1, activeStageIndex + 1))}
            aria-label="Next stage"
            title="Next stage (→)"
          >
            →
          </button>
        </div>
      </div>

      <div className="diagram-caption-footer">
        <div className="keyboard-hint" aria-hidden="true">
          <span>Scroll to explore</span>
          <span className="kbd-key">↓</span>
          <span>or drag bar / use keys</span>
          <span className="kbd-key">←</span>
          <span className="kbd-key">→</span>
        </div>
        <div className="diagram-status-note">
          Biology · Engineering · Evidence
        </div>
      </div>
    </div>
  );
};

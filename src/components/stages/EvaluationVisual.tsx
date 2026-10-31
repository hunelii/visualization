import React from 'react';

interface StationVisualProps {
  isActive: boolean;
  className?: string;
}

export const EvaluationVisual: React.FC<StationVisualProps> = ({ isActive, className = '' }) => {
  return (
    <svg
      viewBox="0 0 240 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`station-focused-svg ${className} ${isActive ? 'is-active' : ''}`}
      role="img"
      aria-label="Aroma evaluation and screening visualization"
    >
      {/* Background Frame / Reference Markings */}
      <g stroke="rgba(34, 49, 29, 0.12)" strokeWidth="1" aria-hidden="true">
        <path d="M 12 18 L 22 18 M 17 13 L 17 23" />
        <path d="M 228 18 L 218 18 M 223 13 L 223 23" />
        <line x1="20" y1="90" x2="220" y2="90" stroke="rgba(34, 49, 29, 0.06)" strokeDasharray="3 4" />
      </g>

      {/* Sampling Inlet from Left */}
      <path
        d="M 20 90 L 64 90"
        stroke="var(--foundry-green)"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="56" cy="90" r="3" fill="var(--foundry-green)" className={isActive ? "anim-sample-branch" : ""} />

      {/* Analytical Circular Lens / Evaluation Chamber */}
      <circle
        cx="120"
        cy="90"
        r="54"
        stroke="var(--foundry-green)"
        strokeWidth="1.3"
        strokeDasharray="2 4"
        fill="none"
      />
      <circle
        cx="120"
        cy="90"
        r="46"
        stroke="var(--foundry-green)"
        strokeWidth="1.5"
        fill={isActive ? "rgba(74, 103, 65, 0.14)" : "rgba(74, 103, 65, 0.05)"}
      />

      {/* Reticle inspection marks */}
      <g stroke="rgba(34, 49, 29, 0.35)" strokeWidth="1" strokeLinecap="round" aria-hidden="true">
        <line x1="120" y1="40" x2="120" y2="50" />
        <line x1="120" y1="130" x2="120" y2="140" />
        <line x1="70" y1="90" x2="80" y2="90" />
        <line x1="160" y1="90" x2="170" y2="90" />
      </g>

      {/* Aroma Volatiles Detection Arcs */}
      <g className={isActive ? "anim-highlight-pulse" : ""}>
        <path
          d="M 106 74 A 18 18 0 0 1 134 74"
          stroke="var(--growth-green)"
          strokeWidth="1.5"
          strokeDasharray="2 3"
          fill="none"
        />
        <path
          d="M 98 62 A 30 30 0 0 1 142 62"
          stroke="var(--growth-green)"
          strokeWidth="1.3"
          strokeDasharray="2 3"
          fill="none"
        />
        <path
          d="M 90 50 A 42 42 0 0 1 150 50"
          stroke="var(--growth-green)"
          strokeWidth="1.2"
          strokeDasharray="2 3"
          fill="none"
        />
      </g>

      {/* Central Separated Sample Aliquot Dot */}
      <circle
        cx="120"
        cy="90"
        r="5"
        fill="var(--foundry-green)"
        className={isActive ? "anim-sample-branch" : ""}
      />
      <circle
        cx="120"
        cy="90"
        r="9"
        stroke="var(--growth-green)"
        strokeWidth="1"
        strokeDasharray="2 2"
        fill="none"
      />

      {/* Outflow Line to the Right */}
      <path
        d="M 174 90 L 220 90"
        stroke="var(--foundry-green)"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />

      {/* Labels */}
      <text x="120" y="172" textAnchor="middle" className="station-sublabel-text" fill="rgba(34, 49, 29, 0.75)">
        Aroma volatiles screening
      </text>
    </svg>
  );
};

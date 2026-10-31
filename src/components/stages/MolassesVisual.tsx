import React from 'react';

interface StationVisualProps {
  isActive: boolean;
  className?: string;
}

export const MolassesVisual: React.FC<StationVisualProps> = ({ isActive, className = '' }) => {
  return (
    <svg
      viewBox="0 0 240 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`station-focused-svg ${className} ${isActive ? 'is-active' : ''}`}
      role="img"
      aria-label="Molasses nutrient source visualization"
    >
      {/* Background Frame / Reference Markings */}
      <g stroke="rgba(34, 49, 29, 0.12)" strokeWidth="1" aria-hidden="true">
        <path d="M 12 18 L 22 18 M 17 13 L 17 23" />
        <path d="M 228 18 L 218 18 M 223 13 L 223 23" />
        <line x1="20" y1="90" x2="220" y2="90" stroke="rgba(34, 49, 29, 0.06)" strokeDasharray="3 4" />
      </g>

      {/* Feed Nozzle at Top */}
      <path
        d="M 112 15 L 128 15 L 124 38 L 116 38 Z"
        stroke="var(--foundry-green)"
        strokeWidth="1.4"
        fill="none"
        strokeLinejoin="round"
      />

      {/* Viscous Molasses Droplet */}
      <path
        d="M 120 45 C 136 68 144 84 144 100 C 144 116 133 128 120 128 C 107 128 96 116 96 100 C 96 84 104 68 120 45 Z"
        stroke="var(--foundry-green)"
        strokeWidth="1.6"
        fill={isActive ? "rgba(74, 103, 65, 0.16)" : "rgba(74, 103, 65, 0.07)"}
        strokeLinejoin="round"
        className={isActive ? "anim-highlight-pulse" : ""}
      />

      {/* Nutrient Marker Dots (Carbon / Sucrose / Minerals) */}
      <g className={isActive ? "anim-nutrient-flow" : ""}>
        <circle cx="120" cy="85" r="3.2" fill="var(--foundry-green)" />
        <circle cx="112" cy="102" r="2.6" fill="var(--growth-green)" />
        <circle cx="128" cy="103" r="2.8" fill="var(--foundry-green)" />
        <circle cx="120" cy="114" r="2.4" fill="var(--growth-green)" />
        {/* Fine trace nutrient markers */}
        <circle cx="108" cy="78" r="1.6" fill="rgba(34, 49, 29, 0.5)" />
        <circle cx="132" cy="86" r="1.6" fill="rgba(34, 49, 29, 0.5)" />
      </g>

      {/* Transfer Line connecting downwards */}
      <path
        d="M 120 128 L 120 148 Q 120 158 132 158 L 220 158"
        stroke="var(--foundry-green)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="120" cy="148" r="2" fill="var(--foundry-green)" />

      {/* Labels */}
      <text x="120" y="172" textAnchor="middle" className="station-sublabel-text" fill="rgba(34, 49, 29, 0.75)">
        Sugar byproduct · Carbon feed
      </text>
    </svg>
  );
};

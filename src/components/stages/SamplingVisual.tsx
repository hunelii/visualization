import React from 'react';

interface StationVisualProps {
  isActive: boolean;
  className?: string;
}

export const SamplingVisual: React.FC<StationVisualProps> = ({ isActive, className = '' }) => {
  return (
    <svg
      viewBox="0 0 240 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`station-focused-svg ${className} ${isActive ? 'is-active' : ''}`}
      role="img"
      aria-label="Sampling manifold and collection tubes"
    >
      {/* Background Frame / Reference Markings */}
      <g stroke="rgba(34, 49, 29, 0.12)" strokeWidth="1" aria-hidden="true">
        <path d="M 12 18 L 22 18 M 17 13 L 17 23" />
        <path d="M 228 18 L 218 18 M 223 13 L 223 23" />
      </g>

      {/* Main Process Stream Flowing Through Valve */}
      <path d="M 20 60 L 95 60 L 95 75" stroke="var(--foundry-green)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 145 60 L 220 60" stroke="var(--foundry-green)" strokeWidth="1.5" strokeLinecap="round" />

      {/* Sanitary Sampling 3-way Valve */}
      <rect x="95" y="48" width="50" height="24" rx="3" stroke="var(--foundry-green)" strokeWidth="1.5" fill="var(--culture-white)" />
      <path d="M 120 48 L 120 32 M 110 32 L 130 32" stroke="var(--foundry-green)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="120" cy="60" r="4" fill="var(--growth-green)" />

      {/* Aliquot Dispense Needle / Nozzle */}
      <path d="M 120 72 L 120 92" stroke="var(--foundry-green)" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="120" cy="85" r="2.5" fill="var(--growth-green)" className={isActive ? "anim-sample-branch" : ""} />

      {/* Test Tube Rack with 3 Collection Tubes */}
      {/* Rack frame */}
      <rect x="75" y="100" width="90" height="48" rx="2" stroke="rgba(34, 49, 29, 0.25)" strokeWidth="1" strokeDasharray="3 3" fill="none" />

      {/* Tube 1 */}
      <g transform="translate(90, 92)">
        <rect x="-7" y="0" width="14" height="42" rx="7" stroke="var(--foundry-green)" strokeWidth="1.3" fill="var(--culture-white)" />
        <path d="M -6 24 L 6 24 C 6 30 5 35 0 35 C -5 35 -6 30 -6 24 Z" fill="rgba(74, 103, 65, 0.25)" />
      </g>

      {/* Tube 2 (Active Collection) */}
      <g transform="translate(120, 92)">
        <rect x="-7" y="0" width="14" height="42" rx="7" stroke="var(--foundry-green)" strokeWidth="1.5" fill={isActive ? "rgba(74, 103, 65, 0.16)" : "var(--culture-white)"} />
        <path d="M -6 18 L 6 18 C 6 28 5 35 0 35 C -5 35 -6 28 -6 18 Z" fill="var(--growth-green)" opacity="0.6" className={isActive ? "anim-highlight-pulse" : ""} />
        <circle cx="0" cy="24" r="2" fill="var(--foundry-green)" />
      </g>

      {/* Tube 3 */}
      <g transform="translate(150, 92)">
        <rect x="-7" y="0" width="14" height="42" rx="7" stroke="var(--foundry-green)" strokeWidth="1.3" fill="var(--culture-white)" />
        <path d="M -6 28 L 6 28 C 6 32 5 35 0 35 C -5 35 -6 32 -6 28 Z" fill="rgba(74, 103, 65, 0.25)" />
      </g>

      {/* Downward Feedback Loop indicator */}
      <path d="M 120 148 L 120 160" stroke="var(--growth-green)" strokeWidth="1.2" strokeDasharray="2 3" strokeLinecap="round" />

      {/* Labels */}
      <text x="120" y="172" textAnchor="middle" className="station-sublabel-text" fill="rgba(34, 49, 29, 0.75)">
        Sterile sampling · Biomass &amp; volatiles
      </text>
    </svg>
  );
};

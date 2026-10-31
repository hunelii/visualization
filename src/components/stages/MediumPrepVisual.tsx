import React from 'react';

interface StationVisualProps {
  isActive: boolean;
  className?: string;
}

export const MediumPrepVisual: React.FC<StationVisualProps> = ({ isActive, className = '' }) => {
  return (
    <svg
      viewBox="0 0 240 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`station-focused-svg ${className} ${isActive ? 'is-active' : ''}`}
      role="img"
      aria-label="Medium preparation mixing vessel"
    >
      {/* Background Frame / Reference Markings */}
      <g stroke="rgba(34, 49, 29, 0.12)" strokeWidth="1" aria-hidden="true">
        <path d="M 12 18 L 22 18 M 17 13 L 17 23" />
        <path d="M 228 18 L 218 18 M 223 13 L 223 23" />
        <line x1="20" y1="90" x2="220" y2="90" stroke="rgba(34, 49, 29, 0.06)" strokeDasharray="3 4" />
      </g>

      {/* Feed Inlet from left */}
      <path d="M 20 90 L 76 90" stroke="var(--foundry-green)" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="76" cy="90" r="2.5" fill="var(--foundry-green)" />

      {/* Agitator Motor on Top */}
      <rect x="110" y="24" width="20" height="20" rx="2" stroke="var(--foundry-green)" strokeWidth="1.4" fill="var(--culture-white)" />
      <line x1="114" y1="30" x2="126" y2="30" stroke="var(--growth-green)" strokeWidth="1.2" />
      <line x1="114" y1="36" x2="126" y2="36" stroke="var(--growth-green)" strokeWidth="1.2" />

      {/* Tank Contour */}
      <rect
        x="80"
        y="50"
        width="80"
        height="95"
        rx="6"
        stroke="var(--foundry-green)"
        strokeWidth="1.6"
        fill={isActive ? "rgba(74, 103, 65, 0.12)" : "rgba(74, 103, 65, 0.05)"}
      />
      {/* Tank legs */}
      <path d="M 88 145 L 84 158 M 152 145 L 156 158" stroke="var(--foundry-green)" strokeWidth="1.5" strokeLinecap="round" />

      {/* Agitator Central Shaft & Impeller */}
      <line x1="120" y1="44" x2="120" y2="125" stroke="var(--foundry-green)" strokeWidth="1.5" />
      {/* Impeller blades */}
      <path d="M 104 100 L 136 100 M 106 122 L 134 122" stroke="var(--growth-green)" strokeWidth="1.6" strokeLinecap="round" />

      {/* Liquid Broth Level */}
      <line x1="84" y1="74" x2="156" y2="74" stroke="var(--culture-green)" strokeWidth="1.2" strokeDasharray="3 3" />

      {/* Outlet pipe to right */}
      <path d="M 160 115 L 220 115" stroke="var(--foundry-green)" strokeWidth="1.5" strokeLinecap="round" />

      {/* Labels */}
      <text x="120" y="172" textAnchor="middle" className="station-sublabel-text" fill="rgba(34, 49, 29, 0.75)">
        Nutrient formulation · Agitated mixing
      </text>
    </svg>
  );
};

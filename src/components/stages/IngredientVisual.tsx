import React from 'react';

interface StationVisualProps {
  isActive: boolean;
  className?: string;
}

export const IngredientVisual: React.FC<StationVisualProps> = ({ isActive, className = '' }) => {
  return (
    <svg
      viewBox="0 0 240 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`station-focused-svg ${className} ${isActive ? 'is-active' : ''}`}
      role="img"
      aria-label="Ingredient development for food application visualization"
    >
      {/* Background Frame / Reference Markings */}
      <g stroke="rgba(34, 49, 29, 0.12)" strokeWidth="1" aria-hidden="true">
        <path d="M 12 18 L 22 18 M 17 13 L 17 23" />
        <path d="M 228 18 L 218 18 M 223 13 L 223 23" />
        <line x1="20" y1="90" x2="220" y2="90" stroke="rgba(34, 49, 29, 0.06)" strokeDasharray="3 4" />
      </g>

      {/* Analytical Translation Input Line from Left */}
      <path
        d="M 20 90 L 76 90"
        stroke="var(--foundry-green)"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="76" cy="90" r="2.5" fill="var(--foundry-green)" />

      {/* Ingredient Development Target Form (Hexagonal specification matrix) */}
      <g className={isActive ? "anim-highlight-pulse" : ""}>
        <path
          d="M 110 55 L 140 72 L 140 108 L 110 125 L 80 108 L 80 72 Z"
          stroke="var(--foundry-green)"
          strokeWidth="1.6"
          fill={isActive ? "rgba(74, 103, 65, 0.16)" : "rgba(74, 103, 65, 0.06)"}
          strokeLinejoin="round"
        />
        <circle cx="110" cy="90" r="5.5" fill="var(--growth-green)" />
        <circle cx="110" cy="90" r="11" stroke="var(--foundry-green)" strokeWidth="1" strokeDasharray="3 3" fill="none" />
      </g>

      {/* Food Application Integration Pathways */}
      <g className={isActive ? "anim-target-vector" : ""}>
        {/* Upper application vector */}
        <path
          d="M 140 72 L 195 50"
          stroke="var(--foundry-green)"
          strokeWidth="1.4"
          strokeDasharray="2 3"
          fill="none"
        />
        <circle cx="198" cy="48" r="3.5" stroke="var(--foundry-green)" strokeWidth="1.4" fill="var(--culture-white)" />

        {/* Direct formulation vector */}
        <path
          d="M 140 90 L 205 90"
          stroke="var(--foundry-green)"
          strokeWidth="1.5"
          fill="none"
        />
        <circle cx="210" cy="90" r="4.2" fill="var(--foundry-green)" />

        {/* Lower application vector */}
        <path
          d="M 140 108 L 195 130"
          stroke="var(--foundry-green)"
          strokeWidth="1.4"
          strokeDasharray="2 3"
          fill="none"
        />
        <circle cx="198" cy="132" r="3.5" stroke="var(--foundry-green)" strokeWidth="1.4" fill="var(--culture-white)" />
      </g>

      {/* Food Producers Label */}
      <text x="210" y="36" textAnchor="end" className="station-sublabel-text" fill="var(--culture-green)" style={{ fontSize: '9.5px', fontWeight: 600 }}>
        Food producers
      </text>

      {/* Labels */}
      <text x="120" y="172" textAnchor="middle" className="station-sublabel-text" fill="rgba(34, 49, 29, 0.75)">
        Food application trials
      </text>
    </svg>
  );
};

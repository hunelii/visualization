import React from 'react';

interface StationVisualProps {
  isActive: boolean;
  className?: string;
}

export const IngredientDevVisual: React.FC<StationVisualProps> = ({ isActive, className = '' }) => {
  return (
    <svg
      viewBox="0 0 240 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`station-focused-svg ${className} ${isActive ? 'is-active' : ''}`}
      role="img"
      aria-label="Truffle character ingredient development and culinary applications"
    >
      {/* Background Frame / Reference Markings */}
      <g stroke="rgba(34, 49, 29, 0.12)" strokeWidth="1" aria-hidden="true">
        <path d="M 12 18 L 22 18 M 17 13 L 17 23" />
        <path d="M 228 18 L 218 18 M 223 13 L 223 23" />
      </g>

      {/* Inflow from Analysis */}
      <path d="M 20 85 L 60 85" stroke="var(--foundry-green)" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="60" cy="85" r="2.5" fill="var(--foundry-green)" />

      {/* Ingredient Extract Bottle / Formulation Profile */}
      <g transform="translate(70, 48)">
        {/* Bottle Cap */}
        <rect x="12" y="0" width="22" height="10" rx="1.5" stroke="var(--foundry-green)" strokeWidth="1.4" fill="var(--culture-white)" />
        {/* Bottle Neck */}
        <path d="M 15 10 L 15 16 M 31 16 L 31 10" stroke="var(--foundry-green)" strokeWidth="1.3" />
        {/* Bottle Body */}
        <path
          d="M 15 16 L 6 24 C 3 27 3 31 3 36 L 3 80 C 3 86 7 90 13 90 L 33 90 C 39 90 43 86 43 80 L 43 36 C 43 31 43 27 40 24 L 31 16 Z"
          stroke="var(--foundry-green)"
          strokeWidth="1.5"
          fill={isActive ? "rgba(74, 103, 65, 0.16)" : "rgba(74, 103, 65, 0.06)"}
          strokeLinejoin="round"
        />
        {/* Liquid Aroma Extract Level inside bottle */}
        <path
          d="M 4 45 L 42 45 L 42 80 C 42 85 38 89 33 89 L 13 89 C 8 89 4 85 4 80 Z"
          fill="rgba(34, 49, 29, 0.18)"
        />
        <line x1="4" y1="45" x2="42" y2="45" stroke="var(--growth-green)" strokeWidth="1.2" strokeDasharray="2 2" />
        {/* Truffle Character core note */}
        <circle cx="23" cy="66" r="4.5" fill="var(--growth-green)" className={isActive ? "anim-highlight-pulse" : ""} />
      </g>

      {/* Food Application Vectors Radiating to Right */}
      <g className={isActive ? "anim-target-vector" : ""}>
        {/* Upper application vector (Lipids / Oils) */}
        <path d="M 120 75 L 180 50" stroke="var(--foundry-green)" strokeWidth="1.4" strokeDasharray="2 3" />
        <circle cx="184" cy="48" r="3.5" stroke="var(--foundry-green)" strokeWidth="1.4" fill="var(--culture-white)" />

        {/* Direct application vector (Culinary Bases / Ingredients) */}
        <path d="M 120 95 L 195 95" stroke="var(--foundry-green)" strokeWidth="1.5" />
        <circle cx="200" cy="95" r="4.2" fill="var(--foundry-green)" />

        {/* Lower application vector (Dry matrices / Powders) */}
        <path d="M 120 115 L 180 140" stroke="var(--foundry-green)" strokeWidth="1.4" strokeDasharray="2 3" />
        <circle cx="184" cy="142" r="3.5" stroke="var(--foundry-green)" strokeWidth="1.4" fill="var(--culture-white)" />
      </g>

      {/* Food Producers Label */}
      <text x="210" y="36" textAnchor="end" className="station-sublabel-text" fill="var(--culture-green)" style={{ fontSize: '9.5px', fontWeight: 600 }}>
        Food producers
      </text>

      {/* Labels */}
      <text x="120" y="172" textAnchor="middle" className="station-sublabel-text" fill="rgba(34, 49, 29, 0.75)">
        Aroma ingredient · Application trials
      </text>
    </svg>
  );
};

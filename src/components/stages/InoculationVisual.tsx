import React from 'react';

interface StationVisualProps {
  isActive: boolean;
  className?: string;
}

export const InoculationVisual: React.FC<StationVisualProps> = ({ isActive, className = '' }) => {
  return (
    <svg
      viewBox="0 0 240 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`station-focused-svg ${className} ${isActive ? 'is-active' : ''}`}
      role="img"
      aria-label="Inoculation transfer into prepared medium"
    >
      {/* Background Frame / Reference Markings */}
      <g stroke="rgba(34, 49, 29, 0.12)" strokeWidth="1" aria-hidden="true">
        <path d="M 12 18 L 22 18 M 17 13 L 17 23" />
        <path d="M 228 18 L 218 18 M 223 13 L 223 23" />
      </g>

      {/* Medium Feed Line from Left */}
      <path d="M 20 100 L 78 100" stroke="var(--foundry-green)" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="78" cy="100" r="2.5" fill="var(--foundry-green)" />

      {/* Inoculum Transfer Line from Top Right */}
      <g className={isActive ? "anim-sample-branch" : ""}>
        <path d="M 180 20 L 140 50" stroke="var(--growth-green)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 138 42 L 140 50 L 148 50" stroke="var(--growth-green)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="184" cy="17" r="3.5" fill="var(--growth-green)" />
        <text x="192" y="21" className="station-sublabel-text" fill="var(--growth-green)" style={{ fontSize: '9px', fontWeight: 600 }}>
          Inoculum
        </text>
      </g>

      {/* Seed Vessel Contour */}
      <rect
        x="80"
        y="45"
        width="76"
        height="95"
        rx="5"
        stroke="var(--foundry-green)"
        strokeWidth="1.6"
        fill={isActive ? "rgba(74, 103, 65, 0.12)" : "rgba(74, 103, 65, 0.05)"}
      />
      {/* Top port */}
      <path d="M 108 45 L 108 30 L 128 30 L 128 45" stroke="var(--foundry-green)" strokeWidth="1.4" fill="none" />

      {/* Internal mixing broth + inoculum suspension */}
      <line x1="84" y1="72" x2="152" y2="72" stroke="var(--culture-green)" strokeWidth="1.2" strokeDasharray="3 3" />
      <circle cx="118" cy="95" r="5" fill="var(--growth-green)" className={isActive ? "anim-highlight-pulse" : ""} />
      <circle cx="106" cy="110" r="3" fill="var(--foundry-green)" />
      <circle cx="130" cy="108" r="3" fill="var(--foundry-green)" />

      {/* Legs */}
      <path d="M 88 140 L 84 154 M 148 140 L 152 154" stroke="var(--foundry-green)" strokeWidth="1.5" strokeLinecap="round" />

      {/* Outflow to Main Fermenter */}
      <path d="M 156 110 L 220 110" stroke="var(--foundry-green)" strokeWidth="1.5" strokeLinecap="round" />

      {/* Labels */}
      <text x="120" y="172" textAnchor="middle" className="station-sublabel-text" fill="rgba(34, 49, 29, 0.75)">
        Aseptic introduction · Seed bioreactor
      </text>
    </svg>
  );
};

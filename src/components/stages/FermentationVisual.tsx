import React from 'react';

interface StationVisualProps {
  isActive: boolean;
  className?: string;
}

export const FermentationVisual: React.FC<StationVisualProps> = ({ isActive, className = '' }) => {
  return (
    <svg
      viewBox="0 0 240 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`station-focused-svg ${className} ${isActive ? 'is-active' : ''}`}
      role="img"
      aria-label="Submerged liquid fermentation bioreactor with process monitoring"
    >
      {/* Background Frame / Reference Markings */}
      <g stroke="rgba(34, 49, 29, 0.12)" strokeWidth="1" aria-hidden="true">
        <path d="M 12 18 L 22 18 M 17 13 L 17 23" />
        <path d="M 228 18 L 218 18 M 223 13 L 223 23" />
      </g>

      {/* Inflow from Inoculation */}
      <path d="M 20 85 L 68 85" stroke="var(--foundry-green)" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="68" cy="85" r="2.5" fill="var(--foundry-green)" />

      {/* Bioreactor Top Drive Motor */}
      <rect x="98" y="16" width="24" height="20" rx="2" stroke="var(--foundry-green)" strokeWidth="1.4" fill="var(--culture-white)" />
      <line x1="110" y1="36" x2="110" y2="125" stroke="var(--foundry-green)" strokeWidth="1.5" />

      {/* Main Glass Vessel */}
      <rect
        x="70"
        y="36"
        width="80"
        height="105"
        rx="8"
        stroke="var(--foundry-green)"
        strokeWidth="1.6"
        fill={isActive ? "rgba(74, 103, 65, 0.14)" : "rgba(74, 103, 65, 0.05)"}
      />
      {/* Stainless steel head plate and bottom cradle */}
      <line x1="68" y1="42" x2="152" y2="42" stroke="var(--foundry-green)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="68" y1="135" x2="152" y2="135" stroke="var(--foundry-green)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Stand legs */}
      <path d="M 76 138 L 72 154 M 144 138 L 148 154" stroke="var(--foundry-green)" strokeWidth="1.6" strokeLinecap="round" />

      {/* Broth Liquid Level */}
      <line x1="74" y1="65" x2="146" y2="65" stroke="var(--culture-green)" strokeWidth="1.2" strokeDasharray="3 3" />

      {/* Submerged Mycelial Network (Truffle hyphae in suspension) */}
      <g className={isActive ? "anim-hyphae" : ""}>
        <path d="M 110 110 Q 94 98 84 94 M 94 98 Q 88 106 82 110" stroke="var(--foundry-green)" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M 110 110 Q 126 96 136 92 M 124 98 Q 130 106 136 112" stroke="var(--foundry-green)" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M 110 110 Q 104 122 96 126" stroke="var(--foundry-green)" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M 110 110 Q 116 122 124 126" stroke="var(--foundry-green)" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="84" cy="94" r="1.6" fill="var(--growth-green)" />
        <circle cx="136" cy="92" r="1.6" fill="var(--growth-green)" />
        <circle cx="110" cy="110" r="2.4" fill="var(--foundry-green)" />
      </g>

      {/* Impeller Agitators */}
      <line x1="96" y1="88" x2="124" y2="88" stroke="var(--growth-green)" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="96" y1="120" x2="124" y2="120" stroke="var(--growth-green)" strokeWidth="1.6" strokeLinecap="round" />

      {/* Sensor Monitoring Tags on Right Side */}
      <g transform="translate(160, 48)" className="sensor-tag-group" aria-hidden="true">
        <text x="0" y="8" className="station-sublabel-text" fill="var(--culture-green)" style={{ fontSize: '8.5px', fontWeight: 600 }}>• Temp</text>
        <text x="0" y="22" className="station-sublabel-text" fill="var(--culture-green)" style={{ fontSize: '8.5px', fontWeight: 600 }}>• pH</text>
        <text x="0" y="36" className="station-sublabel-text" fill="var(--culture-green)" style={{ fontSize: '8.5px', fontWeight: 600 }}>• Dissolved O₂</text>
        <text x="0" y="50" className="station-sublabel-text" fill="var(--culture-green)" style={{ fontSize: '8.5px', fontWeight: 600 }}>• Biomass</text>
        <text x="0" y="64" className="station-sublabel-text" fill="var(--culture-green)" style={{ fontSize: '8.5px', fontWeight: 600 }}>• Process data</text>
      </g>

      {/* Outflow line to sampling */}
      <path d="M 150 105 L 220 105" stroke="var(--foundry-green)" strokeWidth="1.5" strokeLinecap="round" />

      {/* Labels */}
      <text x="120" y="172" textAnchor="middle" className="station-sublabel-text" fill="rgba(34, 49, 29, 0.75)">
        Submerged fermentation · Real-time monitoring
      </text>
    </svg>
  );
};

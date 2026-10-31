import React from 'react';

interface StationVisualProps {
  isActive: boolean;
  className?: string;
}

export const CultureVisual: React.FC<StationVisualProps> = ({ isActive, className = '' }) => {
  return (
    <svg
      viewBox="0 0 240 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`station-focused-svg ${className} ${isActive ? 'is-active' : ''}`}
      role="img"
      aria-label="Truffle culture liquid fermentation visualization"
    >
      {/* Background Frame / Reference Markings */}
      <g stroke="rgba(34, 49, 29, 0.12)" strokeWidth="1" aria-hidden="true">
        <path d="M 12 18 L 22 18 M 17 13 L 17 23" />
        <path d="M 228 18 L 218 18 M 223 13 L 223 23" />
        <line x1="20" y1="90" x2="220" y2="90" stroke="rgba(34, 49, 29, 0.06)" strokeDasharray="3 4" />
      </g>

      {/* Nutrient Feed Entry Line from left */}
      <path
        d="M 20 135 L 75 135"
        stroke="var(--foundry-green)"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="75" cy="135" r="2.5" fill="var(--foundry-green)" />

      {/* Separate Inoculum Biological Input from Top Right */}
      <g className="inoculum-indicator">
        <path
          d="M 185 24 L 158 50"
          stroke="var(--growth-green)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 156 42 L 158 50 L 166 50"
          stroke="var(--growth-green)"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="189" cy="20" r="3.2" fill="var(--growth-green)" />
        <text x="196" y="24" className="station-sublabel-text" fill="var(--growth-green)" style={{ fontSize: '9.5px', fontWeight: 600 }}>
          Inoculum
        </text>
      </g>

      {/* Culture Vessel (Conical Fermentation Flask) */}
      <path
        d="M 104 40 L 136 40 M 108 40 L 108 60 M 132 60 L 132 40"
        stroke="var(--foundry-green)"
        strokeWidth="1.4"
        fill="none"
      />
      <path
        d="M 108 60 L 72 136 C 68 146 76 154 88 154 L 152 154 C 164 154 172 146 168 136 L 132 60"
        stroke="var(--foundry-green)"
        strokeWidth="1.6"
        fill={isActive ? "rgba(74, 103, 65, 0.14)" : "rgba(74, 103, 65, 0.05)"}
        strokeLinejoin="round"
      />

      {/* Meniscus / Liquid Broth Level */}
      <path
        d="M 85 105 Q 120 110 155 105"
        stroke="var(--culture-green)"
        strokeWidth="1.2"
        fill="none"
        strokeDasharray="2 3"
      />

      {/* Mycelium Hyphal Network (Submerged growth) */}
      <g className={isActive ? "anim-hyphae" : ""}>
        <path
          d="M 120 132 Q 104 122 92 118 M 104 122 Q 98 130 92 136"
          stroke="var(--foundry-green)"
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 120 132 Q 136 120 148 116 M 134 122 Q 140 130 146 134"
          stroke="var(--foundry-green)"
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 120 132 Q 114 144 104 148"
          stroke="var(--foundry-green)"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 120 132 Q 126 144 136 148"
          stroke="var(--foundry-green)"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Growth points on hyphae */}
        <circle cx="92" cy="118" r="1.8" fill="var(--growth-green)" />
        <circle cx="92" cy="136" r="1.6" fill="var(--foundry-green)" />
        <circle cx="148" cy="116" r="1.8" fill="var(--growth-green)" />
        <circle cx="146" cy="134" r="1.6" fill="var(--foundry-green)" />
        <circle cx="120" cy="132" r="2.5" fill="var(--foundry-green)" />
      </g>

      {/* Aeration bubbles */}
      <circle cx="110" cy="118" r="1.4" stroke="var(--culture-green)" strokeWidth="0.8" fill="none" />
      <circle cx="130" cy="114" r="1.2" stroke="var(--culture-green)" strokeWidth="0.8" fill="none" />

      {/* Labels */}
      <text x="120" y="172" textAnchor="middle" className="station-sublabel-text" fill="rgba(34, 49, 29, 0.75)">
        Submerged fermentation
      </text>
    </svg>
  );
};

import React from 'react';

interface StationVisualProps {
  isActive: boolean;
  className?: string;
}

export const FungalCultureVisual: React.FC<StationVisualProps> = ({ isActive, className = '' }) => {
  return (
    <svg
      viewBox="0 0 240 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`station-focused-svg ${className} ${isActive ? 'is-active' : ''}`}
      role="img"
      aria-label="Tuber melanosporum fungal culture isolate"
    >
      {/* Background Frame / Reference Markings */}
      <g stroke="rgba(34, 49, 29, 0.12)" strokeWidth="1" aria-hidden="true">
        <path d="M 12 18 L 22 18 M 17 13 L 17 23" />
        <path d="M 228 18 L 218 18 M 223 13 L 223 23" />
      </g>

      {/* Petri Dish (Agar Isolation Plate) */}
      <g transform="translate(85, 68)">
        <circle cx="0" cy="0" r="42" stroke="var(--foundry-green)" strokeWidth="1.5" fill={isActive ? "rgba(74, 103, 65, 0.12)" : "rgba(74, 103, 65, 0.05)"} />
        <circle cx="0" cy="0" r="36" stroke="rgba(34, 49, 29, 0.2)" strokeWidth="1" strokeDasharray="3 3" />

        {/* Radiating Truffle Mycelium Hyphae */}
        <g className={isActive ? "anim-hyphae" : ""}>
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 45 * Math.PI) / 180;
            const x2 = Math.cos(angle) * 30;
            const y2 = Math.sin(angle) * 30;
            const midX = Math.cos(angle + 0.1) * 18;
            const midY = Math.sin(angle + 0.1) * 18;
            return (
              <g key={i}>
                <path
                  d={`M 0 0 Q ${midX} ${midY} ${x2} ${y2}`}
                  stroke="var(--foundry-green)"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
                <circle cx={x2} cy={y2} r="1.5" fill="var(--growth-green)" />
              </g>
            );
          })}
          <circle cx="0" cy="0" r="3.5" fill="var(--foundry-green)" />
        </g>
      </g>

      {/* Erlenmeyer Shake Flask (Pre-culture) */}
      <g transform="translate(170, 95)">
        <path d="M -8 -35 L 8 -35 M -5 -35 L -5 -20 L -25 25 C -28 32 -22 36 -14 36 L 14 36 C 22 36 28 32 25 25 L 5 -20 L 5 -35" stroke="var(--foundry-green)" strokeWidth="1.4" fill="var(--culture-white)" strokeLinejoin="round" />
        <path d="M -18 15 Q 0 20 18 15" stroke="var(--growth-green)" strokeWidth="1.2" strokeDasharray="2 3" />
        {/* Culture pellet inside flask */}
        <circle cx="0" cy="25" r="4.5" fill="var(--growth-green)" className={isActive ? "anim-highlight-pulse" : ""} />
      </g>

      {/* Transfer pathway to inoculation */}
      <path d="M 130 68 Q 165 50 170 55" stroke="var(--growth-green)" strokeWidth="1.4" strokeDasharray="3 3" fill="none" />
      <path d="M 166 50 L 170 56 L 164 58" stroke="var(--growth-green)" strokeWidth="1.2" fill="none" />

      {/* Labels */}
      <text x="120" y="172" textAnchor="middle" className="station-sublabel-text" fill="rgba(34, 49, 29, 0.75)">
        Tuber melanosporum · Agar &amp; shake flask
      </text>
    </svg>
  );
};

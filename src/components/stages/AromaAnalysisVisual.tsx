import React from 'react';

interface StationVisualProps {
  isActive: boolean;
  className?: string;
}

export const AromaAnalysisVisual: React.FC<StationVisualProps> = ({ isActive, className = '' }) => {
  return (
    <svg
      viewBox="0 0 240 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`station-focused-svg ${className} ${isActive ? 'is-active' : ''}`}
      role="img"
      aria-label="GC-MS volatile compound profiling and monitor display"
    >
      {/* Background Frame / Reference Markings */}
      <g stroke="rgba(34, 49, 29, 0.12)" strokeWidth="1" aria-hidden="true">
        <path d="M 12 18 L 22 18 M 17 13 L 17 23" />
        <path d="M 228 18 L 218 18 M 223 13 L 223 23" />
      </g>

      {/* Sample Inlet Line from Left */}
      <path d="M 20 85 L 60 85" stroke="var(--foundry-green)" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="60" cy="85" r="2.5" fill="var(--foundry-green)" />

      {/* Analytical Instrument Column / GC-MS Body */}
      <g transform="translate(65, 45)">
        <rect x="0" y="0" width="48" height="95" rx="3" stroke="var(--foundry-green)" strokeWidth="1.5" fill="var(--culture-white)" />
        {/* Autosampler head */}
        <rect x="14" y="-18" width="20" height="18" rx="2" stroke="var(--foundry-green)" strokeWidth="1.3" fill="var(--culture-white)" />
        <line x1="24" y1="-18" x2="24" y2="0" stroke="var(--growth-green)" strokeWidth="1.5" />
        {/* Detector indicator */}
        <circle cx="24" cy="24" r="5" stroke="var(--foundry-green)" strokeWidth="1.2" fill={isActive ? "var(--growth-green)" : "none"} />
        <line x1="8" y1="50" x2="40" y2="50" stroke="rgba(34, 49, 29, 0.2)" strokeWidth="1" />
        <line x1="8" y1="65" x2="40" y2="65" stroke="rgba(34, 49, 29, 0.2)" strokeWidth="1" />
      </g>

      {/* Connecting cable/line to display */}
      <path d="M 113 90 L 130 90" stroke="var(--growth-green)" strokeWidth="1.4" strokeDasharray="2 2" />

      {/* Analytical Monitor Screen displaying Chromatogram Peaks */}
      <g transform="translate(130, 48)">
        {/* Monitor bezel */}
        <rect x="0" y="0" width="85" height="65" rx="4" stroke="var(--foundry-green)" strokeWidth="1.5" fill={isActive ? "rgba(74, 103, 65, 0.12)" : "rgba(74, 103, 65, 0.04)"} />
        {/* Stand */}
        <path d="M 42 65 L 42 78 M 30 78 L 54 78" stroke="var(--foundry-green)" strokeWidth="1.4" strokeLinecap="round" />

        {/* Screen Chromatogram Baseline & Peaks */}
        <line x1="8" y1="52" x2="77" y2="52" stroke="rgba(34, 49, 29, 0.3)" strokeWidth="1" />
        {/* Volatile peaks */}
        <path
          d="M 12 52 L 20 52 L 24 38 L 28 52 L 36 52 L 40 22 L 44 52 L 52 52 L 56 32 L 60 52 L 74 52"
          stroke="var(--foundry-green)"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className={isActive ? "anim-target-vector" : ""}
        />
        {/* Active Truffle Character Peak Marker */}
        <circle cx="40" cy="22" r="2.5" fill="var(--growth-green)" className={isActive ? "anim-highlight-pulse" : ""} />
      </g>

      {/* Analytical Feedback Connection leading downwards */}
      <path d="M 172 135 L 172 160" stroke="var(--growth-green)" strokeWidth="1.2" strokeDasharray="2 3" strokeLinecap="round" />

      {/* Labels */}
      <text x="120" y="172" textAnchor="middle" className="station-sublabel-text" fill="rgba(34, 49, 29, 0.75)">
        Volatile profiling · Sensory screening
      </text>
    </svg>
  );
};

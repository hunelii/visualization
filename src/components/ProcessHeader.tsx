import React from 'react';
import { PROCESS_META } from '../data/stages';

interface ProcessHeaderProps {
  isEmbedded?: boolean;
}

export const ProcessHeader: React.FC<ProcessHeaderProps> = () => {
  return (
    <header className="narrative-header">
      <div className="tagline-badge" aria-label="Development status">
        {PROCESS_META.sectionTag}
      </div>
      <h1 className="main-heading">
        {PROCESS_META.mainTitle}
      </h1>
      <p className="subtitle-text">
        {PROCESS_META.subtitle}
      </p>
    </header>
  );
};

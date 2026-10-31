import React, { useState, useEffect, useCallback } from 'react';
import { STAGES_DATA } from './data/stages';
import { ProcessHeader } from './components/ProcessHeader';
import { StageList } from './components/StageList';
import { UnifiedDiagram } from './components/UnifiedDiagram';
import { MobileStageFlow } from './components/MobileStageFlow';
import { EmbedHelper } from './components/EmbedHelper';

export const App: React.FC = () => {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [isEmbedded, setIsEmbedded] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const embedParam = params.get('embed');
    if (embedParam === '1' || embedParam === 'true') {
      setIsEmbedded(true);
      document.body.classList.add('is-embedded-body');
    }
  }, []);

  const handleSelectStage = useCallback((index: number) => {
    setActiveStageIndex(index);
  }, []);

  // Global arrow navigation support
  useEffect(() => {
    const onGlobalKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === 'ArrowRight') {
        setActiveStageIndex((prev) => (prev + 1) % STAGES_DATA.length);
      } else if (e.key === 'ArrowLeft') {
        setActiveStageIndex((prev) => (prev - 1 + STAGES_DATA.length) % STAGES_DATA.length);
      }
    };

    window.addEventListener('keydown', onGlobalKeyDown);
    return () => window.removeEventListener('keydown', onGlobalKeyDown);
  }, []);

  return (
    <div className={`huner-vis-wrapper ${isEmbedded ? 'is-embedded' : ''}`}>
      <EmbedHelper isEmbedded={isEmbedded} />

      {/* Screen-reader live update announcement */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Active stage: {STAGES_DATA[activeStageIndex].numberString} {STAGES_DATA[activeStageIndex].name}. {STAGES_DATA[activeStageIndex].description}
      </div>

      {/* Embedded top brand bar when embedded */}
      {isEmbedded ? (
        <div className="embed-topbar" aria-hidden="true">
          <div className="brand-badge">
            <span className="brand-badge-dot" />
            <span>Huner Biofoundry · Process Flow</span>
          </div>
          <a
            href="https://hunelii.github.io/visualization/"
            target="_blank"
            rel="noopener noreferrer"
            className="external-link"
          >
            Open standalone ↗
          </a>
        </div>
      ) : null}

      {/* Section Header (Always present at top) */}
      <ProcessHeader isEmbedded={isEmbedded} />

      {/* Desktop / Tablet Two-Column Layout (>= 861px) */}
      <div className="huner-vis-layout desktop-layout">
        <section className="narrative-section" aria-label="Process narrative">
          <StageList
            stages={STAGES_DATA}
            activeStageIndex={activeStageIndex}
            onSelectStage={handleSelectStage}
          />
        </section>

        <aside className="visual-col" aria-label="Visual process diagram">
          <UnifiedDiagram
            stages={STAGES_DATA}
            activeStageIndex={activeStageIndex}
            onSelectStage={handleSelectStage}
          />
        </aside>
      </div>

      {/* Mobile Vertical Flow Layout (< 861px) */}
      <MobileStageFlow
        stages={STAGES_DATA}
        activeStageIndex={activeStageIndex}
        onSelectStage={handleSelectStage}
      />
    </div>
  );
};

export default App;

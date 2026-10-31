import React, { useState, useEffect, useRef } from 'react';
import { STAGES_DATA } from './data/stages';
import { ProcessHeader } from './components/ProcessHeader';
import { StageList } from './components/StageList';
import { UnifiedDiagram } from './components/UnifiedDiagram';
import { MobileStageFlow } from './components/MobileStageFlow';
import { EmbedHelper } from './components/EmbedHelper';
import { useScrollStageSpy } from './hooks/useScrollStageSpy';

export const App: React.FC = () => {
  const [activeStageIndex, setActiveStageIndex] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash) {
        const found = STAGES_DATA.findIndex(
          (s) => s.id === hash || s.numberString === hash || s.id.includes(hash)
        );
        if (found !== -1) return found;
      }
    }
    return 0;
  });
  const [isEmbedded, setIsEmbedded] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const embedParam = params.get('embed');
    if (embedParam === '1' || embedParam === 'true') {
      setIsEmbedded(true);
      document.body.classList.add('is-embedded-body');
    }
  }, []);

  // Scroll spy hook that syncs scroll position with active stage and provides smooth scroll jumping
  const { scrollToStage } = useScrollStageSpy({
    stageCount: STAGES_DATA.length,
    activeStageIndex,
    onStageChange: setActiveStageIndex,
    enabled: true,
  });

  // Direct hash deep-linking on initial load
  useEffect(() => {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    if (hash) {
      const targetIdx = STAGES_DATA.findIndex(
        (s) => s.id === hash || s.numberString === hash || s.id.includes(hash)
      );
      if (targetIdx !== -1) {
        setTimeout(() => {
          scrollToStage(targetIdx);
        }, 200);
      }
    }
  }, [scrollToStage]);

  // Update hash dynamically as active stage changes without reloading
  const lastHashRef = useRef('');
  useEffect(() => {
    const currentId = STAGES_DATA[activeStageIndex].id;
    if (lastHashRef.current !== currentId && !isEmbedded) {
      lastHashRef.current = currentId;
      window.history.replaceState(null, '', `#${currentId}`);
    }
  }, [activeStageIndex, isEmbedded]);

  // Global arrow navigation support
  useEffect(() => {
    const onGlobalKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        const next = (activeStageIndex + 1) % STAGES_DATA.length;
        scrollToStage(next);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        const prev = (activeStageIndex - 1 + STAGES_DATA.length) % STAGES_DATA.length;
        scrollToStage(prev);
      }
    };

    window.addEventListener('keydown', onGlobalKeyDown);
    return () => window.removeEventListener('keydown', onGlobalKeyDown);
  }, [activeStageIndex, scrollToStage]);

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

      {/* Desktop / Tablet Two-Column Scrollytelling Layout (>= 981px) */}
      <div className="huner-vis-layout desktop-layout">
        <section className="narrative-section" aria-label="Process narrative">
          <StageList
            stages={STAGES_DATA}
            activeStageIndex={activeStageIndex}
            onSelectStage={scrollToStage}
          />
        </section>

        <aside className="visual-col" aria-label="Visual process diagram">
          <UnifiedDiagram
            stages={STAGES_DATA}
            activeStageIndex={activeStageIndex}
            onSelectStage={scrollToStage}
          />
        </aside>
      </div>

      {/* Mobile Vertical Flow Layout (< 981px) */}
      <MobileStageFlow
        stages={STAGES_DATA}
        activeStageIndex={activeStageIndex}
        onSelectStage={scrollToStage}
      />
    </div>
  );
};

export default App;

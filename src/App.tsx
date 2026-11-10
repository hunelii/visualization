import React, { useState, useEffect, useRef } from 'react';
import { STAGES_DATA } from './data/stages';
import { UnifiedDiagram } from './components/UnifiedDiagram';
import { EmbedHelper } from './components/EmbedHelper';
import { useScrollStageSpy } from './hooks/useScrollStageSpy';

export const App: React.FC = () => {
  const [initialStageIndex] = useState(() => {
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

  const {
    continuousStage,
    activeStageIndex,
    stageDwellProgress,
    scrollToStage,
    scrubToProgress,
  } = useScrollStageSpy({
    stageCount: STAGES_DATA.length,
    initialStageIndex,
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
        const timer = setTimeout(() => {
          scrollToStage(targetIdx, true);
        }, 60);
        return () => clearTimeout(timer);
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
        e.preventDefault();
        const next = Math.min(STAGES_DATA.length - 1, activeStageIndex + 1);
        scrollToStage(next);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = Math.max(0, activeStageIndex - 1);
        scrollToStage(prev);
      }
    };

    window.addEventListener('keydown', onGlobalKeyDown);
    return () => window.removeEventListener('keydown', onGlobalKeyDown);
  }, [activeStageIndex, scrollToStage]);

  return (
    <div className={`huner-vis-scroll-runway ${isEmbedded ? 'is-embedded' : ''}`}>
      <EmbedHelper isEmbedded={isEmbedded} />

      {/* Screen-reader live update announcement */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Active stage: {STAGES_DATA[activeStageIndex].numberString} {STAGES_DATA[activeStageIndex].name}. {STAGES_DATA[activeStageIndex].description}
      </div>

      <main className="sticky-diagram-viewport" aria-label="Interactive process diagram">
        <div className="diagram-stage-shell">
          <UnifiedDiagram
            stages={STAGES_DATA}
            activeStageIndex={activeStageIndex}
            continuousStage={continuousStage}
            stageDwellProgress={stageDwellProgress}
            onSelectStage={scrollToStage}
            onScrubProgress={scrubToProgress}
          />
        </div>
      </main>
    </div>
  );
};

export default App;

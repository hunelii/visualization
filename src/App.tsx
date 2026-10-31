import React, { useState, useEffect, useCallback, useRef } from 'react';
import { STAGES_DATA } from './data/stages';
import { ProcessHeader } from './components/ProcessHeader';
import { StageList } from './components/StageList';
import { UnifiedDiagram } from './components/UnifiedDiagram';
import { MobileStageFlow } from './components/MobileStageFlow';
import { EmbedHelper } from './components/EmbedHelper';

export const App: React.FC = () => {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [isEmbedded, setIsEmbedded] = useState(false);
  const isClickNavigatingRef = useRef(false);
  const clickTimeoutRef = useRef<number | null>(null);

  // Programmatic selection with optional smooth scroll
  const handleSelectStage = useCallback((index: number, shouldScroll = true) => {
    setActiveStageIndex(index);

    if (shouldScroll) {
      isClickNavigatingRef.current = true;
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = window.setTimeout(() => {
        isClickNavigatingRef.current = false;
      }, 750);

      // On desktop or mobile, target the corresponding stage element
      const targetId = `stage-block-${STAGES_DATA[index].id}`;
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const embedParam = params.get('embed');
    if (embedParam === '1' || embedParam === 'true') {
      setIsEmbedded(true);
      document.body.classList.add('is-embedded-body');
    }

    // Direct hash linking (e.g. #fermentation or #05)
    const hash = window.location.hash.replace('#', '').toLowerCase();
    if (hash) {
      const targetIdx = STAGES_DATA.findIndex(
        (s) => s.id === hash || s.numberString === hash || s.id.includes(hash)
      );
      if (targetIdx !== -1) {
        setTimeout(() => {
          handleSelectStage(targetIdx, true);
        }, 300);
      }
    }
  }, [handleSelectStage]);

  // Global IntersectionObserver to sync scroll position with active stage
  useEffect(() => {
    const stageElements = STAGES_DATA.map((stage) =>
      document.getElementById(`stage-block-${stage.id}`)
    ).filter(Boolean) as HTMLElement[];

    if (stageElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Skip observer updates if user triggered a programmatic click scroll
        if (isClickNavigatingRef.current) return;

        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          const viewportCenter = window.innerHeight / 2;
          let closestIndex = -1;
          let minDistance = Infinity;

          visibleEntries.forEach((entry) => {
            const rect = entry.boundingClientRect;
            const cardCenter = rect.top + rect.height / 2;
            const distance = Math.abs(cardCenter - viewportCenter);

            if (distance < minDistance) {
              minDistance = distance;
              const idx = stageElements.indexOf(entry.target as HTMLElement);
              if (idx !== -1) closestIndex = idx;
            }
          });

          if (closestIndex !== -1) {
            setActiveStageIndex(closestIndex);
          }
        }
      },
      {
        root: null,
        rootMargin: '-15% 0px -25% 0px',
        threshold: [0.15, 0.4, 0.7],
      }
    );

    stageElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, []);

  // Update hash dynamically as active stage changes without page jump
  const lastHashRef = useRef('');
  useEffect(() => {
    const currentId = STAGES_DATA[activeStageIndex].id;
    if (lastHashRef.current !== currentId && !isEmbedded) {
      lastHashRef.current = currentId;
      window.history.replaceState(null, '', `#${currentId}`);
    }
  }, [activeStageIndex, isEmbedded]);

  // Global keyboard shortcuts (Left/Right, 1-8 keys)
  useEffect(() => {
    const onGlobalKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setActiveStageIndex((prev) => {
          const next = (prev + 1) % STAGES_DATA.length;
          handleSelectStage(next, true);
          return next;
        });
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setActiveStageIndex((prev) => {
          const next = (prev - 1 + STAGES_DATA.length) % STAGES_DATA.length;
          handleSelectStage(next, true);
          return next;
        });
      } else if (e.key >= '1' && e.key <= '8') {
        const targetIndex = parseInt(e.key, 10) - 1;
        if (targetIndex >= 0 && targetIndex < STAGES_DATA.length) {
          handleSelectStage(targetIndex, true);
        }
      }
    };

    window.addEventListener('keydown', onGlobalKeyDown);
    return () => window.removeEventListener('keydown', onGlobalKeyDown);
  }, [handleSelectStage]);

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

      {/* Section Header */}
      <ProcessHeader isEmbedded={isEmbedded} />

      {/* Desktop Scrollytelling Layout (>= 981px) */}
      <div className="huner-vis-layout desktop-layout">
        <section className="narrative-section" aria-label="Process narrative">
          <StageList
            stages={STAGES_DATA}
            activeStageIndex={activeStageIndex}
            onSelectStage={handleSelectStage}
          />
        </section>

        <aside className="visual-col" aria-label="Sticky visual diagram">
          <UnifiedDiagram
            stages={STAGES_DATA}
            activeStageIndex={activeStageIndex}
            onSelectStage={handleSelectStage}
          />
        </aside>
      </div>

      {/* Mobile Vertical Flow Layout (< 981px) */}
      <MobileStageFlow
        stages={STAGES_DATA}
        activeStageIndex={activeStageIndex}
        onSelectStage={handleSelectStage}
      />
    </div>
  );
};

export default App;

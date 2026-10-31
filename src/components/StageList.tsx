import React, { useRef } from 'react';
import { StageData } from '../types';
import { PROCESS_META } from '../data/stages';

interface StageListProps {
  stages: StageData[];
  activeStageIndex: number;
  onSelectStage: (index: number, shouldScroll?: boolean) => void;
}

export const StageList: React.FC<StageListProps> = ({
  stages,
  activeStageIndex,
  onSelectStage,
}) => {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    let nextIndex = -1;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % stages.length;
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + stages.length) % stages.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = stages.length - 1;
    }

    if (nextIndex !== -1) {
      onSelectStage(nextIndex, true);
      tabRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className="narrative-col">
      {/* Sticky Compact Jump Navigation */}
      <nav className="desktop-jump-nav" aria-label="Quick jump between stages">
        <span className="jump-nav-label">Jump to stage:</span>
        <div className="jump-nav-pills" role="tablist">
          {stages.map((stage, idx) => {
            const isActive = idx === activeStageIndex;
            return (
              <button
                key={stage.id}
                ref={(el) => {
                  tabRefs.current[idx] = el;
                }}
                role="tab"
                aria-selected={isActive}
                className={`jump-pill-btn ${isActive ? 'is-active' : ''}`}
                onClick={() => onSelectStage(idx, true)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                title={`${stage.numberString} ${stage.name}`}
              >
                {stage.numberString}
              </button>
            );
          })}
        </div>
      </nav>

      {/* 8 Scroll-Track Stage Blocks */}
      <div className="stage-scroll-track" role="feed" aria-label="Process stages narrative">
        {stages.map((stage, index) => {
          const isActive = index === activeStageIndex;
          const isFeedbackStage = index === 4 || index === 5 || index === 6;

          return (
            <article
              key={stage.id}
              id={`stage-block-${stage.id}`}
              className={`stage-scroll-block ${isActive ? 'is-active' : ''}`}
              onClick={() => onSelectStage(index, false)}
              tabIndex={0}
              role="region"
              aria-label={`Stage ${stage.numberString}: ${stage.name}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectStage(index, true);
                }
              }}
            >
              {/* Card Top Meta */}
              <div className="stage-block-header">
                <span className="stage-block-num">{stage.numberString}</span>
                <span className="stage-block-phase">{stage.phase}</span>
                <span className="stage-block-role">{stage.shortRole}</span>
              </div>

              {/* Title & Headline */}
              <h2 className="stage-block-title">{stage.name}</h2>
              <div className="stage-block-headline">{stage.headline}</div>

              {/* Description */}
              <p className="stage-block-desc">{stage.description}</p>

              {/* Scientific Context */}
              <div className="stage-block-context">
                <p>{stage.scientificContext}</p>
              </div>

              {/* Monitored Parameters for Step 5 */}
              {stage.parameters && (
                <div className="parameters-pill-list" aria-label="Monitored parameters">
                  {stage.parameters.map((param) => (
                    <span key={param} className="param-pill">
                      • {param}
                    </span>
                  ))}
                </div>
              )}

              {/* Feedback Loop Notice when relevant */}
              {isFeedbackStage && (
                <div className="stage-block-feedback-note" aria-hidden="true">
                  <span className="feedback-icon">↺</span>
                  <span>Analytical feedback iteratively informs fermentation parameters.</span>
                </div>
              )}
            </article>
          );
        })}
      </div>

      <footer className="narrative-footer">
        <p className="footer-tagline-text">
          {PROCESS_META.footerTagline}
        </p>
        <p className="disclaimer-text">
          {PROCESS_META.disclaimer}
        </p>
      </footer>
    </div>
  );
};

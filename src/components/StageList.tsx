import React, { useRef } from 'react';
import { StageData } from '../types';
import { PROCESS_META } from '../data/stages';

interface StageListProps {
  stages: StageData[];
  activeStageIndex: number;
  onSelectStage: (index: number) => void;
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
      onSelectStage(nextIndex);
      tabRefs.current[nextIndex]?.focus();
    }
  };

  const activeStage = stages[activeStageIndex];
  const isFeedbackStage = activeStageIndex === 4 || activeStageIndex === 5 || activeStageIndex === 6;

  return (
    <div className="narrative-col">
      <div
        className="stage-tablist"
        role="tablist"
        aria-label="Eight stages of truffle aroma ingredient research"
      >
        {stages.map((stage, index) => {
          const isActive = index === activeStageIndex;
          return (
            <button
              key={stage.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              role="tab"
              id={`stage-tab-${stage.id}`}
              aria-selected={isActive}
              aria-controls={`stage-panel-${stage.id}`}
              tabIndex={isActive ? 0 : -1}
              className={`stage-tab-button ${isActive ? 'is-active' : ''}`}
              onClick={() => onSelectStage(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            >
              <div className="stage-tab-header">
                <span className="stage-tab-num">{stage.numberString}</span>
                <span className="stage-tab-title">{stage.name}</span>
                <span className="stage-tab-role">{stage.shortRole}</span>
              </div>
              <p className="stage-tab-desc">{stage.description}</p>
            </button>
          );
        })}
      </div>

      {/* Dynamic Detail Panel for the Active Stage */}
      <div
        id={`stage-panel-${activeStage.id}`}
        role="tabpanel"
        aria-labelledby={`stage-tab-${activeStage.id}`}
        tabIndex={0}
        className="stage-detail-panel"
      >
        <div className="detail-panel-phase-badge">{activeStage.phase}</div>
        <strong>Focus: {activeStage.headline}</strong>
        <p style={{ margin: '4px 0 8px 0' }}>{activeStage.scientificContext}</p>

        {/* Monitored Parameters for Step 5 */}
        {activeStage.parameters && (
          <div className="parameters-pill-list" aria-label="Monitored parameters">
            {activeStage.parameters.map((param) => (
              <span key={param} className="param-pill">
                • {param}
              </span>
            ))}
          </div>
        )}

        {/* Feedback Loop Notice when relevant */}
        {isFeedbackStage && (
          <div className="detail-feedback-note">
            <span aria-hidden="true">↺</span>
            <span>Iterative loop: Analytical feedback directly informs process optimization in the fermenter.</span>
          </div>
        )}
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

import React from 'react';
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
  return (
    <div className="narrative-col scrollytelling-stream">
      <div className="stage-scrolly-list" role="feed" aria-label="Process narrative stages">
        {stages.map((stage, index) => {
          const isActive = index === activeStageIndex;
          const isFeedbackStage = index === 4 || index === 5 || index === 6;

          return (
            <article
              key={stage.id}
              data-stage-card-index={index}
              id={`stage-card-${stage.id}`}
              className={`stage-story-card ${isActive ? 'is-active' : ''}`}
              onClick={() => onSelectStage(index)}
              tabIndex={0}
              role="button"
              aria-current={isActive ? 'step' : undefined}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectStage(index);
                }
              }}
            >
              {/* Card Header */}
              <div className="story-card-header">
                <span className="stage-tab-num">{stage.numberString}</span>
                <span className="story-card-phase">{stage.phase}</span>
                <span className="stage-tab-role">{stage.shortRole}</span>
              </div>

              <h2 className="story-card-title">{stage.name}</h2>
              <p className="story-card-desc">{stage.description}</p>

              {/* Deep Scientific Context (Visible when active or focused) */}
              <div className="story-card-detail">
                <strong className="story-card-headline">Focus: {stage.headline}</strong>
                <p className="story-card-context">{stage.scientificContext}</p>

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

                {/* Feedback Loop Notice for Steps 5, 6, 7 */}
                {isFeedbackStage && (
                  <div className="detail-feedback-note">
                    <span aria-hidden="true">↺</span>
                    <span>
                      {index === 4
                        ? 'Receives optimized parameters iteratively from analytical feedback.'
                        : 'Feeds volatile and biomass metrics back into fermentation optimization.'}
                    </span>
                  </div>
                )}
              </div>

              {/* Subtle Scroll Guide indicator */}
              <div className="story-card-footer">
                <span className="story-step-indicator">
                  {isActive ? '● Active Step' : '○ Click or scroll to focus'}
                </span>
                <span className="story-arrow-link" aria-hidden="true">
                  View in pipeline →
                </span>
              </div>
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

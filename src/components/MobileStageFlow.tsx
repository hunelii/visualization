import React from 'react';
import { StageData } from '../types';
import { MolassesVisual } from './stages/MolassesVisual';
import { CultureVisual } from './stages/CultureVisual';
import { EvaluationVisual } from './stages/EvaluationVisual';
import { IngredientVisual } from './stages/IngredientVisual';

interface MobileStageFlowProps {
  stages: StageData[];
  activeStageIndex: number;
  onSelectStage: (index: number) => void;
}

export const MobileStageFlow: React.FC<MobileStageFlowProps> = ({
  stages,
  activeStageIndex,
  onSelectStage,
}) => {
  const renderVisual = (index: number, isActive: boolean) => {
    switch (index) {
      case 0:
        return <MolassesVisual isActive={isActive} />;
      case 1:
        return <CultureVisual isActive={isActive} />;
      case 2:
        return <EvaluationVisual isActive={isActive} />;
      case 3:
        return <IngredientVisual isActive={isActive} />;
      default:
        return null;
    }
  };

  return (
    <div className="mobile-stage-flow" role="region" aria-label="Vertical process flow">
      <div className="mobile-flow-meta">
        <span className="diagram-meta-title">Complete Process Flow</span>
        <span className="diagram-meta-flow">01 → 02 → 03 → 04</span>
      </div>

      <div className="mobile-flow-list">
        {stages.map((stage, index) => {
          const isActive = index === activeStageIndex;
          const isLast = index === stages.length - 1;

          return (
            <div key={stage.id} className="mobile-step-container">
              {/* Step Card */}
              <div
                className={`mobile-step-card ${isActive ? 'is-active' : ''}`}
                onClick={() => onSelectStage(index)}
                role="button"
                tabIndex={0}
                aria-pressed={isActive}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectStage(index);
                  }
                }}
              >
                {/* Step Header */}
                <div className="mobile-step-header">
                  <div className="mobile-step-meta-row">
                    <span className="stage-tab-num">{stage.numberString}</span>
                    <span className="stage-tab-role">{stage.shortRole}</span>
                  </div>
                  <h3 className="stage-tab-title">{stage.name}</h3>
                </div>

                {/* Focused SVG Diagram */}
                <div className="mobile-step-svg-wrapper">
                  {renderVisual(index, isActive)}
                </div>

                {/* Stage Description */}
                <p className="mobile-step-desc">{stage.description}</p>

                {/* Expanded Context Note when active */}
                {isActive ? (
                  <div className="mobile-step-detail">
                    <strong>Focus: {stage.headline}</strong>
                    <p>{stage.scientificContext}</p>
                  </div>
                ) : null}
              </div>

              {/* Connecting Vertical Pipe between steps */}
              {!isLast ? (
                <div className="mobile-step-connector" aria-hidden="true">
                  <div className="mobile-connector-line" />
                  <div className="mobile-connector-chevron">↓</div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

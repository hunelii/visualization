import React from 'react';
import { StageData } from '../types';
import { MolassesVisual } from './stages/MolassesVisual';
import { MediumPrepVisual } from './stages/MediumPrepVisual';
import { FungalCultureVisual } from './stages/FungalCultureVisual';
import { InoculationVisual } from './stages/InoculationVisual';
import { FermentationVisual } from './stages/FermentationVisual';
import { SamplingVisual } from './stages/SamplingVisual';
import { AromaAnalysisVisual } from './stages/AromaAnalysisVisual';
import { IngredientDevVisual } from './stages/IngredientDevVisual';

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
        return <MediumPrepVisual isActive={isActive} />;
      case 2:
        return <FungalCultureVisual isActive={isActive} />;
      case 3:
        return <InoculationVisual isActive={isActive} />;
      case 4:
        return <FermentationVisual isActive={isActive} />;
      case 5:
        return <SamplingVisual isActive={isActive} />;
      case 6:
        return <AromaAnalysisVisual isActive={isActive} />;
      case 7:
        return <IngredientDevVisual isActive={isActive} />;
      default:
        return null;
    }
  };

  return (
    <div className="mobile-stage-flow" role="region" aria-label="Vertical process flow">
      <div className="mobile-flow-meta">
        <span className="diagram-meta-title">Complete 8-Stage Research Pathway</span>
        <span className="diagram-meta-flow">01 → 08</span>
      </div>

      {/* Quick Stage Indicator Bar */}
      <div className="mobile-stage-indicator-bar" role="tablist" aria-label="Quick jump to stage">
        {stages.map((stage, idx) => (
          <button
            key={stage.id}
            role="tab"
            aria-selected={idx === activeStageIndex}
            className={`mobile-indicator-btn ${idx === activeStageIndex ? 'is-active' : ''}`}
            onClick={() => onSelectStage(idx)}
            title={`${stage.numberString} ${stage.name}`}
          >
            {stage.numberString}
          </button>
        ))}
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
                  <span className="mobile-step-num-badge">{stage.numberString}</span>
                  <h3 className="stage-tab-title">{stage.name}</h3>
                  <span className="stage-tab-role">{stage.shortRole}</span>
                </div>

                {/* Focused SVG Diagram */}
                <div className="mobile-step-svg-wrapper">
                  {renderVisual(index, isActive)}
                </div>

                {/* Stage Description */}
                <p className="mobile-step-desc">{stage.description}</p>

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

              {/* Feedback Loop Notice between Sampling/Analysis and Fermentation */}
              {index === 6 ? (
                <div className="mobile-feedback-card" aria-hidden="true">
                  <span className="feedback-arrow">↺</span>
                  <div>
                    <strong>Analytical Feedback &amp; Optimization</strong>
                    <p>Sensory and volatile data iteratively informs fermentation parameters.</p>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export type StageId = 'molasses' | 'culture' | 'evaluation' | 'ingredient';

export interface StageData {
  id: StageId;
  index: number;
  numberString: string;
  name: string;
  shortRole: string;
  headline: string;
  description: string;
  scientificContext: string;
  visualSummary: string;
}

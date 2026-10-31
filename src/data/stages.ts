import { StageData } from '../types';

export const STAGES_DATA: StageData[] = [
  {
    id: 'molasses',
    index: 0,
    numberString: '01',
    name: 'Molasses',
    shortRole: 'Nutrient source',
    headline: 'Sugar-industry byproduct as carbon feed',
    description: 'We investigate sugar-industry molasses as a nutrient source for fungal cultivation.',
    scientificContext: 'Rich in fermentable sucrose, nitrogen traces, and minerals, molasses provides the base energy matrix for fungal biomass development.',
    visualSummary: 'A concentrated droplet with nutrient marker particles feeding into the preparation line.'
  },
  {
    id: 'culture',
    index: 1,
    numberString: '02',
    name: 'Truffle culture',
    shortRole: 'Liquid fermentation',
    headline: 'Controlled mycelial propagation in broth',
    description: 'We grow truffle mycelium in a prepared liquid medium under controlled conditions.',
    scientificContext: 'A pure truffle mycelium isolate is inoculated into the prepared broth. Under regulated aeration, temperature, and agitation, hyphal networks propagate without fruiting body formation.',
    visualSummary: 'A 2D culture vessel receiving inoculation and developing delicate hyphal branches in liquid suspension.'
  },
  {
    id: 'evaluation',
    index: 2,
    numberString: '03',
    name: 'Aroma evaluation',
    shortRole: 'Sample study',
    headline: 'Investigation of aroma-active compounds',
    description: 'We study aroma-related compounds and evaluate suitable samples to understand their potential.',
    scientificContext: 'Representative broth samples are separated for organoleptic and volatile screening to map aroma formation across cultivation stages without claiming commercial specifications.',
    visualSummary: 'A sample aliquot cleanly separated from the culture into an analytical evaluation lens.'
  },
  {
    id: 'ingredient',
    index: 3,
    numberString: '04',
    name: 'Ingredient development',
    shortRole: 'Food application',
    headline: 'Guiding formulation for food producers',
    description: 'The findings guide the development and testing of a truffle-character ingredient for food applications.',
    scientificContext: 'Analytical and sensory insights define downstream extraction and stabilization trials aimed at delivering an authentic truffle note to food manufacturers.',
    visualSummary: 'A defined ingredient profile matrix connecting downstream towards culinary application matrices.'
  }
];

export const PROCESS_META = {
  sectionTag: 'Our process in development.',
  mainTitle: 'From molasses to truffle aroma.',
  subtitle: 'We are developing a truffle-character ingredient for food producers through controlled fungal fermentation.',
  summaryTakeaway: 'Molasses → Truffle culture → Aroma evaluation → Ingredient development',
  disclaimer: 'Early-stage research and development. Schematic representation of our experimental pathway — not a depiction of industrial facility equipment or commercial product availability.'
};

import { useMemo } from 'react';

export type TipoEvento = 'rfi' | 'rfp' | 'rfq' | 'leilao_reverso';

export interface EventTypeConfig {
  showPriceFields: boolean;
  showTechnicalCriteria: boolean;
  allowAuction: boolean;
  requiredFields: string[];
  defaultWeights: { technical: number; commercial: number };
  priceStructure: 'none' | 'global' | 'per_item';
  evaluationType: 'manual' | 'technical_commercial' | 'lowest_price' | 'auction';
  allowComparison: boolean;
  focusArea: string;
}

const eventConfigs: Record<TipoEvento, EventTypeConfig> = {
  rfi: {
    showPriceFields: false,
    showTechnicalCriteria: true,
    allowAuction: false,
    requiredFields: ['name', 'description', 'tipo_aquisicao'],
    defaultWeights: { technical: 100, commercial: 0 },
    priceStructure: 'none',
    evaluationType: 'manual',
    allowComparison: false,
    focusArea: 'Coleta de informações e capacidades técnicas'
  },
  rfp: {
    showPriceFields: true,
    showTechnicalCriteria: true,
    allowAuction: true,
    requiredFields: ['name', 'description', 'tipo_aquisicao', 'valor_estimado'],
    defaultWeights: { technical: 70, commercial: 30 },
    priceStructure: 'global',
    evaluationType: 'technical_commercial',
    allowComparison: true,
    focusArea: 'Proposta técnica e comercial integrada'
  },
  rfq: {
    showPriceFields: true,
    showTechnicalCriteria: false,
    allowAuction: true,
    requiredFields: ['name', 'description', 'tipo_aquisicao'],
    defaultWeights: { technical: 20, commercial: 80 },
    priceStructure: 'per_item',
    evaluationType: 'lowest_price',
    allowComparison: true,
    focusArea: 'Cotação de preços e condições comerciais'
  },
  leilao_reverso: {
    showPriceFields: true,
    showTechnicalCriteria: true,
    allowAuction: true,
    requiredFields: ['name', 'description', 'tipo_aquisicao', 'valor_estimado'],
    defaultWeights: { technical: 30, commercial: 70 },
    priceStructure: 'global',
    evaluationType: 'auction',
    allowComparison: true,
    focusArea: 'Processo competitivo com lances em tempo real'
  }
};

export function useEventTypeLogic(tipoEvento: TipoEvento | string) {
  const config = useMemo(() => {
    const eventType = tipoEvento as TipoEvento;
    return eventConfigs[eventType] || eventConfigs.rfq;
  }, [tipoEvento]);

  const getFieldVisibility = useMemo(() => ({
    priceFields: config.showPriceFields,
    technicalCriteria: config.showTechnicalCriteria,
    auctionSettings: config.allowAuction,
    comparisonPanel: config.allowComparison,
    itemTable: config.priceStructure === 'per_item',
    globalPrice: config.priceStructure === 'global'
  }), [config]);

  const getValidationRules = useMemo(() => ({
    requiredFields: config.requiredFields,
    needsPricing: config.showPriceFields,
    needsTechnical: config.showTechnicalCriteria
  }), [config]);

  const getEvaluationSettings = useMemo(() => ({
    weights: config.defaultWeights,
    type: config.evaluationType,
    automaticRanking: config.evaluationType !== 'manual'
  }), [config]);

  return {
    config,
    fieldVisibility: getFieldVisibility,
    validationRules: getValidationRules,
    evaluationSettings: getEvaluationSettings,
    isRFI: tipoEvento === 'rfi',
    isRFP: tipoEvento === 'rfp',
    isRFQ: tipoEvento === 'rfq',
    isLeilao: tipoEvento === 'leilao_reverso'
  };
}
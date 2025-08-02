import { useMemo } from 'react';
import { useSectorLogic } from './useSectorLogic';
import { useCategoryLogic } from './useCategoryLogic';
import { useClientRules } from './useClientRules';
import { useSourcingRules } from './useSourcingRules';
import { TipoEvento } from './useEventTypeLogic';

export interface SmartRecommendation {
  tipoEvento: TipoEvento;
  tipoAquisicao: 'materiais' | 'servicos' | 'misto';
  leilaoPermitido: 'direto' | 'pos_analise' | 'desabilitado';
  pesosTecnicoComercial: { technical: number; commercial: number };
  camposObrigatorios: string[];
  camposOcultos: string[];
  camposBloqueados: string[];
  criteriosPadrao: string[];
  validacoesEspecificas: string[];
  regrasAplicadas: string[];
  alertas: {
    tipo: 'info' | 'warning' | 'error';
    mensagem: string;
    origem: 'setor' | 'categoria' | 'cliente';
  }[];
}

export function useSmartRules(setor?: string, categoria?: string, clienteId?: string, departamento?: string) {
  const sectorLogic = useSectorLogic(setor);
  const categoryLogic = useCategoryLogic(categoria, setor);
  const clientRules = useClientRules(clienteId);
  const sourcingRules = useSourcingRules(setor, categoria, clienteId, departamento);

  const smartRecommendation = useMemo((): SmartRecommendation | null => {
    // Priorizar configuração do novo sistema quando disponível
    if (sourcingRules.recommendation) {
      const rec = sourcingRules.recommendation.finalConfig;
      return {
        tipoEvento: rec.tipoEvento as TipoEvento,
        tipoAquisicao: rec.tipoAquisicao,
        leilaoPermitido: rec.leilaoPermitido ? 'direto' : 'desabilitado',
        pesosTecnicoComercial: rec.pesosTecnicoComercial,
        camposObrigatorios: rec.camposObrigatorios,
        camposOcultos: rec.camposOcultos,
        camposBloqueados: [],
        criteriosPadrao: rec.criteriosPadrao,
        validacoesEspecificas: rec.validacoesEspecificas,
        regrasAplicadas: rec.regrasAplicadas,
        alertas: rec.alertas.map(alert => ({
          ...alert,
          origem: (alert.origem === 'setor' || alert.origem === 'categoria' || alert.origem === 'cliente') 
            ? alert.origem 
            : 'setor' as const
        }))
      };
    }

    // Fallback para sistema antigo
    if (!setor) return null;

    // Configuração base do setor
    const baseConfig = sectorLogic.recommendations;
    if (!baseConfig) return null;

    // ... keep existing code (fallback logic)
    
    // Refinamentos da categoria
    const categoryRefinements = categoryLogic.refinements;
    
    // Regras do cliente
    const clientConfig = clientRules.fixedConfigurations;
    const clientRestrictions = clientRules.fieldRestrictions;

    // Construir recomendação final
    let finalRecommendation: SmartRecommendation = {
      tipoEvento: baseConfig.tipoEvento,
      tipoAquisicao: baseConfig.tipoAquisicao,
      leilaoPermitido: baseConfig.leilao,
      pesosTecnicoComercial: baseConfig.weights,
      camposObrigatorios: [...baseConfig.requiredFields],
      camposOcultos: [...baseConfig.hiddenFields],
      camposBloqueados: [],
      criteriosPadrao: [],
      validacoesEspecificas: [],
      regrasAplicadas: [`Setor: ${sectorLogic.config?.nome}`],
      alertas: [{
        tipo: 'info',
        mensagem: `Aplicadas configurações para o setor ${sectorLogic.config?.nome}`,
        origem: 'setor'
      }]
    };

    // ... keep existing code (category and client logic)

    return finalRecommendation;
  }, [setor, categoria, clienteId, departamento, sourcingRules, sectorLogic, categoryLogic, clientRules]);

  const hasAnyRules = useMemo(() => {
    return sectorLogic.hasConfig || categoryLogic.hasConfig || clientRules.hasRules || !sourcingRules.loading;
  }, [sectorLogic.hasConfig, categoryLogic.hasConfig, clientRules.hasRules, sourcingRules.loading]);

  const getRulesSummary = useMemo(() => {
    if (!smartRecommendation) return null;

    return {
      totalRules: smartRecommendation.regrasAplicadas.length,
      alertCount: smartRecommendation.alertas.length,
      blockedFields: smartRecommendation.camposBloqueados.length,
      requiredFields: smartRecommendation.camposObrigatorios.length,
      hiddenFields: smartRecommendation.camposOcultos.length
    };
  }, [smartRecommendation]);

  return {
    recommendation: smartRecommendation,
    sectorLogic,
    categoryLogic,
    clientRules,
    sourcingRules,
    hasAnyRules,
    rulesSummary: getRulesSummary
  };
}
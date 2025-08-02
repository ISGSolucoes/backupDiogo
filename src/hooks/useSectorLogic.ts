import { useMemo } from 'react';
import { TipoEvento } from './useEventTypeLogic';

export interface SectorConfig {
  id: string;
  nome: string;
  tipoEventoSugerido: TipoEvento;
  tipoAquisicao: 'materiais' | 'servicos' | 'misto';
  leilaoPermitido: 'direto' | 'pos_analise' | 'desabilitado';
  camposObrigatorios: string[];
  camposOcultos: string[];
  pesosTecnicoComercial: { technical: number; commercial: number };
  observacoes: string;
}

const SECTOR_CONFIGS: Record<string, SectorConfig> = {
  industria: {
    id: 'industria',
    nome: 'Indústria',
    tipoEventoSugerido: 'rfq',
    tipoAquisicao: 'materiais',
    leilaoPermitido: 'direto',
    camposObrigatorios: ['name', 'description', 'quantidade', 'unidade'],
    camposOcultos: ['escopo_servico'],
    pesosTecnicoComercial: { technical: 20, commercial: 80 },
    observacoes: 'Processos padronizados, alta repetição de itens'
  },
  construcao: {
    id: 'construcao',
    nome: 'Construção Civil',
    tipoEventoSugerido: 'rfp',
    tipoAquisicao: 'misto',
    leilaoPermitido: 'desabilitado',
    camposObrigatorios: ['name', 'description', 'escopo_servico', 'prazo'],
    camposOcultos: [],
    pesosTecnicoComercial: { technical: 70, commercial: 30 },
    observacoes: 'Envolve mão de obra + materiais, avaliação técnica intensa'
  },
  varejo: {
    id: 'varejo',
    nome: 'Varejo',
    tipoEventoSugerido: 'rfq',
    tipoAquisicao: 'materiais',
    leilaoPermitido: 'direto',
    camposObrigatorios: ['name', 'description', 'quantidade', 'unidade'],
    camposOcultos: ['escopo_servico'],
    pesosTecnicoComercial: { technical: 10, commercial: 90 },
    observacoes: 'Grande volume, produtos comparáveis'
  },
  saude: {
    id: 'saude',
    nome: 'Saúde / Farmacêutico',
    tipoEventoSugerido: 'rfq',
    tipoAquisicao: 'materiais',
    leilaoPermitido: 'pos_analise',
    camposObrigatorios: ['name', 'description', 'certificacoes', 'especificacao_tecnica'],
    camposOcultos: [],
    pesosTecnicoComercial: { technical: 60, commercial: 40 },
    observacoes: 'Alta regulação, pode exigir qualificação prévia'
  },
  tecnologia: {
    id: 'tecnologia',
    nome: 'Tecnologia / SaaS',
    tipoEventoSugerido: 'rfp',
    tipoAquisicao: 'servicos',
    leilaoPermitido: 'desabilitado',
    camposObrigatorios: ['name', 'description', 'escopo_servico', 'plano_entrega'],
    camposOcultos: ['quantidade', 'unidade'],
    pesosTecnicoComercial: { technical: 80, commercial: 20 },
    observacoes: 'Projetos técnicos, soluções customizadas'
  },
  energia: {
    id: 'energia',
    nome: 'Óleo & Gás / Energia',
    tipoEventoSugerido: 'rfp',
    tipoAquisicao: 'misto',
    leilaoPermitido: 'desabilitado',
    camposObrigatorios: ['name', 'description', 'escopo_servico', 'certificacoes'],
    camposOcultos: [],
    pesosTecnicoComercial: { technical: 80, commercial: 20 },
    observacoes: 'Complexidade elevada, fornecedores altamente especializados'
  },
  servicos_gerais: {
    id: 'servicos_gerais',
    nome: 'Serviços Gerais',
    tipoEventoSugerido: 'rfp',
    tipoAquisicao: 'servicos',
    leilaoPermitido: 'pos_analise',
    camposObrigatorios: ['name', 'description', 'escopo_servico', 'sla'],
    camposOcultos: ['quantidade', 'unidade'],
    pesosTecnicoComercial: { technical: 60, commercial: 40 },
    observacoes: 'Avaliação qualitativa (equipe, método, SLA)'
  },
  governo: {
    id: 'governo',
    nome: 'Governo / Setor Público',
    tipoEventoSugerido: 'rfp',
    tipoAquisicao: 'misto',
    leilaoPermitido: 'pos_analise',
    camposObrigatorios: ['name', 'description', 'escopo_servico', 'compliance'],
    camposOcultos: [],
    pesosTecnicoComercial: { technical: 50, commercial: 50 },
    observacoes: 'Formalismo e compliance total, pesos obrigatórios'
  }
};

export function useSectorLogic(setor?: string) {
  const config = useMemo(() => {
    if (!setor) return null;
    return SECTOR_CONFIGS[setor] || null;
  }, [setor]);

  const getSectorOptions = useMemo(() => {
    return Object.values(SECTOR_CONFIGS).map(sector => ({
      value: sector.id,
      label: sector.nome,
      observacoes: sector.observacoes
    }));
  }, []);

  const getRecommendations = useMemo(() => {
    if (!config) return null;
    
    return {
      tipoEvento: config.tipoEventoSugerido,
      tipoAquisicao: config.tipoAquisicao,
      leilao: config.leilaoPermitido,
      weights: config.pesosTecnicoComercial,
      requiredFields: config.camposObrigatorios,
      hiddenFields: config.camposOcultos
    };
  }, [config]);

  return {
    config,
    sectorOptions: getSectorOptions,
    recommendations: getRecommendations,
    hasConfig: !!config
  };
}
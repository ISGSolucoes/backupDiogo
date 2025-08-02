import { useMemo } from 'react';
import { TipoEvento } from './useEventTypeLogic';

export interface CategoryConfig {
  id: string;
  nome: string;
  setor: string;
  tipoEventoSugerido?: TipoEvento;
  camposObrigatorios: string[];
  camposOcultos: string[];
  criteriosPadrao: string[];
  leilaoPermitido?: 'direto' | 'pos_analise' | 'desabilitado';
  pesosTecnicoComercial?: { technical: number; commercial: number };
  validacoesEspecificas: string[];
}

const CATEGORY_CONFIGS: Record<string, CategoryConfig> = {
  materiais_eletricos: {
    id: 'materiais_eletricos',
    nome: 'Materiais Elétricos',
    setor: 'industria',
    tipoEventoSugerido: 'rfq',
    camposObrigatorios: ['quantidade', 'unidade', 'especificacao_tecnica'],
    camposOcultos: ['escopo_servico'],
    criteriosPadrao: ['Especificação Técnica', 'Prazo de Entrega', 'Preço'],
    leilaoPermitido: 'direto',
    validacoesEspecificas: ['certificacao_inmetro']
  },
  consultoria_estrategica: {
    id: 'consultoria_estrategica',
    nome: 'Consultoria Estratégica',
    setor: 'servicos_gerais',
    tipoEventoSugerido: 'rfp',
    camposObrigatorios: ['escopo_servico', 'duracao', 'experiencia'],
    camposOcultos: ['unidade', 'quantidade'],
    criteriosPadrao: ['Experiência da Equipe', 'Metodologia', 'Referências', 'Preço'],
    leilaoPermitido: 'desabilitado',
    pesosTecnicoComercial: { technical: 80, commercial: 20 },
    validacoesEspecificas: ['portfolio_obrigatorio']
  },
  manutencao_predial: {
    id: 'manutencao_predial',
    nome: 'Manutenção Predial',
    setor: 'servicos_gerais',
    tipoEventoSugerido: 'rfp',
    camposObrigatorios: ['escopo_servico', 'tempo_resposta', 'sla'],
    camposOcultos: ['unidade', 'quantidade'],
    criteriosPadrao: ['Experiência', 'Equipe Técnica', 'SLA', 'Preço'],
    leilaoPermitido: 'pos_analise',
    pesosTecnicoComercial: { technical: 60, commercial: 40 },
    validacoesEspecificas: ['certificacao_nr']
  },
  equipamentos_laboratoriais: {
    id: 'equipamentos_laboratoriais',
    nome: 'Equipamentos Laboratoriais',
    setor: 'saude',
    camposObrigatorios: ['garantia', 'marca', 'certificacoes'],
    camposOcultos: ['escopo_servico'],
    criteriosPadrao: ['Garantia', 'Certificações', 'Suporte Técnico', 'Preço'],
    leilaoPermitido: 'pos_analise',
    pesosTecnicoComercial: { technical: 70, commercial: 30 },
    validacoesEspecificas: ['anvisa_obrigatorio']
  },
  software_nuvem: {
    id: 'software_nuvem',
    nome: 'Software em Nuvem',
    setor: 'tecnologia',
    tipoEventoSugerido: 'rfp',
    camposObrigatorios: ['escopo_tecnico', 'plano_entrega'],
    camposOcultos: ['quantidade', 'unidade'],
    criteriosPadrao: ['Solução Técnica', 'Segurança', 'Escalabilidade', 'Suporte'],
    leilaoPermitido: 'desabilitado',
    pesosTecnicoComercial: { technical: 90, commercial: 10 },
    validacoesEspecificas: ['lgpd_compliance']
  },
  obra_civil: {
    id: 'obra_civil',
    nome: 'Obra Civil',
    setor: 'construcao',
    tipoEventoSugerido: 'rfp',
    camposObrigatorios: ['escopo_servico', 'cronograma', 'memorial_descritivo'],
    camposOcultos: [],
    criteriosPadrao: ['Experiência', 'Cronograma', 'Equipe', 'Preço'],
    leilaoPermitido: 'desabilitado',
    pesosTecnicoComercial: { technical: 70, commercial: 30 },
    validacoesEspecificas: ['art_obrigatoria', 'certidoes_negativas']
  }
};

export function useCategoryLogic(categoria?: string, setor?: string) {
  const config = useMemo(() => {
    if (!categoria) return null;
    return CATEGORY_CONFIGS[categoria] || null;
  }, [categoria]);

  const getCategoryOptions = useMemo(() => {
    if (!setor) return [];
    
    return Object.values(CATEGORY_CONFIGS)
      .filter(category => category.setor === setor)
      .map(category => ({
        value: category.id,
        label: category.nome
      }));
  }, [setor]);

  const getAllCategories = useMemo(() => {
    return Object.values(CATEGORY_CONFIGS).map(category => ({
      value: category.id,
      label: category.nome,
      setor: category.setor
    }));
  }, []);

  const getRefinements = useMemo(() => {
    if (!config) return null;
    
    return {
      tipoEvento: config.tipoEventoSugerido,
      requiredFields: config.camposObrigatorios,
      hiddenFields: config.camposOcultos,
      defaultCriteria: config.criteriosPadrao,
      leilao: config.leilaoPermitido,
      weights: config.pesosTecnicoComercial,
      validations: config.validacoesEspecificas
    };
  }, [config]);

  return {
    config,
    categoryOptions: getCategoryOptions,
    allCategories: getAllCategories,
    refinements: getRefinements,
    hasConfig: !!config
  };
}
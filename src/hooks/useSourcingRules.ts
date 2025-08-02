import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Interfaces
export interface SourcingEventConfig {
  tipo_evento: string;
  nome_exibicao: string;
  descricao: string;
  tooltip_info: string;
  permite_leilao: boolean;
  peso_tecnico_padrao: number;
  peso_comercial_padrao: number;
  campos_obrigatorios: string[];
  icone: string;
  cor_tema: string;
  ordem_exibicao: number;
  prazo_padrao_dias: number;
}

export interface SourcingSectorRule {
  setor_codigo: string;
  setor_nome: string;
  evento_padrao: string;
  leilao_habilitado: boolean;
  peso_tecnico_minimo: number;
  peso_comercial_minimo: number;
  campos_obrigatorios: string[];
  campos_ocultos: string[];
  aprovacao_obrigatoria: boolean;
  valor_minimo_aprovacao: number;
  observacoes?: string;
}

export interface SourcingCategoryRule {
  categoria_codigo: string;
  categoria_nome: string;
  setor_codigo?: string;
  evento_sugerido?: string;
  leilao_permitido: boolean;
  peso_tecnico_sugerido?: number;
  peso_comercial_sugerido?: number;
  criterios_padrao: string[];
  validacoes_especificas: string[];
  prazo_minimo_dias: number;
  prazo_maximo_dias: number;
}

export interface SourcingClientPolicy {
  cliente_codigo: string;
  cliente_nome: string;
  evento_obrigatorio?: string;
  leilao_proibido: boolean;
  peso_tecnico_minimo?: number;
  aprovacao_dupla: boolean;
  documentos_obrigatorios: string[];
  restricoes_fornecedor: any;
  prazo_resposta_minimo: number;
  observacoes_politica?: string;
}

export interface SourcingDepartmentTemplate {
  departamento_codigo: string;
  departamento_nome: string;
  responsavel_nome?: string;
  responsavel_email?: string;
  configuracao_padrao: any;
  setores_permitidos: string[];
  categorias_permitidas: string[];
  limite_valor_aprovacao: number;
  requer_multiplas_cotacoes: boolean;
}

export interface SourcingRecommendation {
  eventoConfig: SourcingEventConfig | null;
  sectorRule: SourcingSectorRule | null;
  categoryRule: SourcingCategoryRule | null;
  clientPolicy: SourcingClientPolicy | null;
  departmentTemplate: SourcingDepartmentTemplate | null;
  finalConfig: {
    tipoEvento: string;
    tipoAquisicao: 'materiais' | 'servicos' | 'misto';
    leilaoPermitido: boolean;
    pesosTecnicoComercial: { technical: number; commercial: number };
    camposObrigatorios: string[];
    camposOcultos: string[];
    prazoSugerido: number;
    criteriosPadrao: string[];
    validacoesEspecificas: string[];
    regrasAplicadas: string[];
    alertas: Array<{
      tipo: 'info' | 'warning' | 'error';
      mensagem: string;
      origem: string;
    }>;
  };
}

export function useSourcingRules(
  setor?: string,
  categoria?: string,
  clienteId?: string,
  departamento?: string
) {
  // Estados para dados carregados do Supabase
  const [eventConfigs, setEventConfigs] = useState<SourcingEventConfig[]>([]);
  const [sectorRules, setSectorRules] = useState<SourcingSectorRule[]>([]);
  const [categoryRules, setCategoryRules] = useState<SourcingCategoryRule[]>([]);
  const [clientPolicies, setClientPolicies] = useState<SourcingClientPolicy[]>([]);
  const [departmentTemplates, setDepartmentTemplates] = useState<SourcingDepartmentTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar configurações do Supabase
  useEffect(() => {
    async function loadConfigurations() {
      setLoading(true);
      try {
        // Carregar configurações de eventos
        const { data: events } = await supabase
          .from('sourcing_event_configurations')
          .select('*')
          .eq('is_active', true)
          .order('ordem_exibicao');

        // Carregar regras por setor
        const { data: sectors } = await supabase
          .from('sourcing_sector_rules')
          .select('*')
          .eq('is_active', true);

        // Carregar regras por categoria
        const { data: categories } = await supabase
          .from('sourcing_category_rules')
          .select('*')
          .eq('is_active', true);

        // Carregar políticas de cliente
        const { data: clients } = await supabase
          .from('sourcing_client_policies')
          .select('*')
          .eq('is_active', true);

        // Carregar templates de departamento
        const { data: departments } = await supabase
          .from('sourcing_department_templates')
          .select('*')
          .eq('is_active', true);

        setEventConfigs(events || []);
        setSectorRules(sectors || []);
        setCategoryRules(categories || []);
        setClientPolicies(clients || []);
        setDepartmentTemplates(departments || []);
      } catch (error) {
        console.error('Erro ao carregar configurações de sourcing:', error);
      } finally {
        setLoading(false);
      }
    }

    loadConfigurations();
  }, []);

  // Opções para dropdowns
  const eventOptions = useMemo(() => {
    return eventConfigs.map(config => ({
      value: config.tipo_evento,
      label: config.nome_exibicao,
      description: config.descricao,
      tooltip: config.tooltip_info,
      icon: config.icone,
      color: config.cor_tema,
      allowsAuction: config.permite_leilao
    }));
  }, [eventConfigs]);

  const sectorOptions = useMemo(() => {
    return sectorRules.map(rule => ({
      value: rule.setor_codigo,
      label: rule.setor_nome,
      defaultEvent: rule.evento_padrao,
      auctionEnabled: rule.leilao_habilitado
    }));
  }, [sectorRules]);

  const categoryOptions = useMemo(() => {
    return categoryRules
      .filter(rule => !setor || rule.setor_codigo === setor)
      .map(rule => ({
        value: rule.categoria_codigo,
        label: rule.categoria_nome,
        sector: rule.setor_codigo,
        suggestedEvent: rule.evento_sugerido
      }));
  }, [categoryRules, setor]);

  const departmentOptions = useMemo(() => {
    return departmentTemplates.map(template => ({
      value: template.departamento_codigo,
      label: template.departamento_nome,
      responsavel: template.responsavel_nome,
      email: template.responsavel_email
    }));
  }, [departmentTemplates]);

  // Lógica inteligente de recomendação
  const recommendation = useMemo((): SourcingRecommendation | null => {
    if (loading) return null;

    // Buscar configurações específicas
    const sectorRule = sectorRules.find(rule => rule.setor_codigo === setor);
    const categoryRule = categoryRules.find(rule => rule.categoria_codigo === categoria);
    const clientPolicy = clientPolicies.find(policy => policy.cliente_codigo === clienteId);
    const departmentTemplate = departmentTemplates.find(tmpl => tmpl.departamento_codigo === departamento);

    // Determinar tipo de evento final
    let tipoEvento = 'rfp'; // padrão
    const regrasAplicadas: string[] = [];
    const alertas: Array<{ tipo: 'info' | 'warning' | 'error'; mensagem: string; origem: string; }> = [];

    // Prioridade: Cliente > Categoria > Setor > Padrão
    if (clientPolicy?.evento_obrigatorio) {
      tipoEvento = clientPolicy.evento_obrigatorio;
      regrasAplicadas.push(`Evento obrigatório por política do cliente: ${clientPolicy.cliente_nome}`);
      alertas.push({
        tipo: 'warning',
        mensagem: `Tipo de evento fixado em ${tipoEvento.toUpperCase()} por política do cliente`,
        origem: 'cliente'
      });
    } else if (categoryRule?.evento_sugerido) {
      tipoEvento = categoryRule.evento_sugerido;
      regrasAplicadas.push(`Evento sugerido pela categoria: ${categoryRule.categoria_nome}`);
      alertas.push({
        tipo: 'info',
        mensagem: `Evento ${tipoEvento.toUpperCase()} sugerido para categoria ${categoryRule.categoria_nome}`,
        origem: 'categoria'
      });
    } else if (sectorRule?.evento_padrao) {
      tipoEvento = sectorRule.evento_padrao;
      regrasAplicadas.push(`Evento padrão do setor: ${sectorRule.setor_nome}`);
      alertas.push({
        tipo: 'info',
        mensagem: `Evento ${tipoEvento.toUpperCase()} padrão para setor ${sectorRule.setor_nome}`,
        origem: 'setor'
      });
    }

    // Buscar configuração do evento
    const eventoConfig = eventConfigs.find(config => config.tipo_evento === tipoEvento);

    // Determinar se leilão é permitido
    let leilaoPermitido = eventoConfig?.permite_leilao || false;
    if (clientPolicy?.leilao_proibido) {
      leilaoPermitido = false;
      alertas.push({
        tipo: 'warning',
        mensagem: 'Leilão desabilitado por política do cliente',
        origem: 'cliente'
      });
    } else if (sectorRule && !sectorRule.leilao_habilitado) {
      leilaoPermitido = false;
      alertas.push({
        tipo: 'info',
        mensagem: 'Leilão não habilitado para este setor',
        origem: 'setor'
      });
    }

    // Calcular pesos técnico/comercial
    let pesoTecnico = eventoConfig?.peso_tecnico_padrao || 50;
    let pesoComercial = eventoConfig?.peso_comercial_padrao || 50;

    if (clientPolicy?.peso_tecnico_minimo && pesoTecnico < clientPolicy.peso_tecnico_minimo) {
      pesoTecnico = clientPolicy.peso_tecnico_minimo;
      pesoComercial = 100 - pesoTecnico;
      alertas.push({
        tipo: 'warning',
        mensagem: `Peso técnico ajustado para mínimo de ${clientPolicy.peso_tecnico_minimo}% por política do cliente`,
        origem: 'cliente'
      });
    } else if (categoryRule?.peso_tecnico_sugerido) {
      pesoTecnico = categoryRule.peso_tecnico_sugerido;
      pesoComercial = categoryRule.peso_comercial_sugerido || (100 - pesoTecnico);
    } else if (sectorRule?.peso_tecnico_minimo && pesoTecnico < sectorRule.peso_tecnico_minimo) {
      pesoTecnico = sectorRule.peso_tecnico_minimo;
      pesoComercial = 100 - pesoTecnico;
    }

    // Coletar campos obrigatórios
    const camposObrigatorios = new Set<string>();
    
    // Adicionar campos do evento
    eventoConfig?.campos_obrigatorios.forEach(campo => camposObrigatorios.add(campo));
    
    // Adicionar campos do setor
    sectorRule?.campos_obrigatorios.forEach(campo => camposObrigatorios.add(campo));
    
    // Adicionar documentos obrigatórios do cliente
    clientPolicy?.documentos_obrigatorios.forEach(doc => camposObrigatorios.add(doc));

    // Coletar campos ocultos
    const camposOcultos = new Set<string>();
    sectorRule?.campos_ocultos.forEach(campo => camposOcultos.add(campo));

    // Determinar prazo sugerido
    let prazoSugerido = eventoConfig?.prazo_padrao_dias || 15;
    if (categoryRule) {
      prazoSugerido = Math.max(categoryRule.prazo_minimo_dias, prazoSugerido);
      prazoSugerido = Math.min(categoryRule.prazo_maximo_dias, prazoSugerido);
    }
    if (clientPolicy?.prazo_resposta_minimo && prazoSugerido < clientPolicy.prazo_resposta_minimo) {
      prazoSugerido = clientPolicy.prazo_resposta_minimo;
      alertas.push({
        tipo: 'info',
        mensagem: `Prazo ajustado para mínimo de ${clientPolicy.prazo_resposta_minimo} dias por política do cliente`,
        origem: 'cliente'
      });
    }

    return {
      eventoConfig,
      sectorRule,
      categoryRule,
      clientPolicy,
      departmentTemplate,
      finalConfig: {
        tipoEvento,
        tipoAquisicao: categoryRule?.categoria_nome.toLowerCase().includes('servi') ? 'servicos' : 'materiais',
        leilaoPermitido,
        pesosTecnicoComercial: { technical: pesoTecnico, commercial: pesoComercial },
        camposObrigatorios: Array.from(camposObrigatorios),
        camposOcultos: Array.from(camposOcultos),
        prazoSugerido,
        criteriosPadrao: categoryRule?.criterios_padrao || [],
        validacoesEspecificas: categoryRule?.validacoes_especificas || [],
        regrasAplicadas,
        alertas
      }
    };
  }, [
    loading, setor, categoria, clienteId, departamento,
    eventConfigs, sectorRules, categoryRules, clientPolicies, departmentTemplates
  ]);

  return {
    loading,
    eventOptions,
    sectorOptions,
    categoryOptions,
    departmentOptions,
    recommendation,
    // Funções auxiliares
    refreshData: () => {
      // Trigger reload
      setLoading(true);
    },
    getEventConfig: (eventType: string) => eventConfigs.find(config => config.tipo_evento === eventType),
    getSectorRule: (sectorCode: string) => sectorRules.find(rule => rule.setor_codigo === sectorCode),
    getCategoryRule: (categoryCode: string) => categoryRules.find(rule => rule.categoria_codigo === categoryCode)
  };
}
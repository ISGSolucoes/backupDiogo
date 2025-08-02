import { useMemo } from 'react';
import { TipoEvento } from './useEventTypeLogic';

export interface ClientRule {
  clienteId: string;
  campo: string;
  acao: 'obrigar' | 'ocultar' | 'bloquear' | 'sugerir' | 'valor_fixo';
  valor?: any;
  motivo: string;
  prioridade: number; // 1 = alta, 2 = média, 3 = baixa
}

export interface ClientProfile {
  id: string;
  nome: string;
  setor: string;
  tipoCliente: 'enterprise' | 'government' | 'startup' | 'sme';
  regrasAtivas: ClientRule[];
  configuracaoFixa?: {
    tipoEvento?: TipoEvento;
    leilaoPermitido?: boolean;
    pesoTecnicoMinimo?: number;
    camposBloqueados?: string[];
  };
}

// Exemplos de perfis de clientes com regras específicas
const CLIENT_PROFILES: Record<string, ClientProfile> = {
  petrobras: {
    id: 'petrobras',
    nome: 'Petrobras',
    setor: 'energia',
    tipoCliente: 'enterprise',
    configuracaoFixa: {
      tipoEvento: 'rfp',
      leilaoPermitido: false,
      pesoTecnicoMinimo: 60
    },
    regrasAtivas: [
      {
        clienteId: 'petrobras',
        campo: 'certificacao_iso',
        acao: 'obrigar',
        motivo: 'Política de qualidade obrigatória',
        prioridade: 1
      },
      {
        clienteId: 'petrobras',
        campo: 'tipo_evento',
        acao: 'bloquear',
        valor: 'rfp',
        motivo: 'Apenas RFP permitido por política interna',
        prioridade: 1
      },
      {
        clienteId: 'petrobras',
        campo: 'usar_leilao',
        acao: 'valor_fixo',
        valor: false,
        motivo: 'Leilão não permitido por política corporativa',
        prioridade: 1
      }
    ]
  },
  governo_sp: {
    id: 'governo_sp',
    nome: 'Governo do Estado de SP',
    setor: 'governo',
    tipoCliente: 'government',
    configuracaoFixa: {
      pesoTecnicoMinimo: 50
    },
    regrasAtivas: [
      {
        clienteId: 'governo_sp',
        campo: 'peso_tecnico',
        acao: 'obrigar',
        valor: 50,
        motivo: 'Lei de Licitações - peso técnico mínimo 50%',
        prioridade: 1
      },
      {
        clienteId: 'governo_sp',
        campo: 'documentacao_completa',
        acao: 'obrigar',
        motivo: 'Documentação completa obrigatória para órgão público',
        prioridade: 1
      },
      {
        clienteId: 'governo_sp',
        campo: 'leilao_tipo',
        acao: 'sugerir',
        valor: 'pos_analise',
        motivo: 'Recomendado leilão apenas após análise técnica',
        prioridade: 2
      }
    ]
  },
  farmacia_popular: {
    id: 'farmacia_popular',
    nome: 'Farmácia Popular',
    setor: 'saude',
    tipoCliente: 'enterprise',
    configuracaoFixa: {
      tipoEvento: 'rfq'
    },
    regrasAtivas: [
      {
        clienteId: 'farmacia_popular',
        campo: 'certificacao_anvisa',
        acao: 'obrigar',
        motivo: 'Certificação ANVISA obrigatória para medicamentos',
        prioridade: 1
      },
      {
        clienteId: 'farmacia_popular',
        campo: 'tempo_mercado',
        acao: 'obrigar',
        valor: 5,
        motivo: 'Mínimo 5 anos no mercado farmacêutico',
        prioridade: 1
      },
      {
        clienteId: 'farmacia_popular',
        campo: 'tipo_evento',
        acao: 'valor_fixo',
        valor: 'rfq',
        motivo: 'Apenas cotações permitidas por política interna',
        prioridade: 1
      }
    ]
  }
};

export function useClientRules(clienteId?: string) {
  const clientProfile = useMemo(() => {
    if (!clienteId) return null;
    return CLIENT_PROFILES[clienteId] || null;
  }, [clienteId]);

  const getClientOptions = useMemo(() => {
    return Object.values(CLIENT_PROFILES).map(client => ({
      value: client.id,
      label: client.nome,
      setor: client.setor,
      tipo: client.tipoCliente
    }));
  }, []);

  const getActiveRules = useMemo(() => {
    if (!clientProfile) return [];
    return clientProfile.regrasAtivas.sort((a, b) => a.prioridade - b.prioridade);
  }, [clientProfile]);

  const getFieldRestrictions = useMemo(() => {
    if (!clientProfile) return {};
    
    const restrictions: Record<string, ClientRule> = {};
    clientProfile.regrasAtivas.forEach(rule => {
      restrictions[rule.campo] = rule;
    });
    
    return restrictions;
  }, [clientProfile]);

  const getFixedConfigurations = useMemo(() => {
    return clientProfile?.configuracaoFixa || {};
  }, [clientProfile]);

  const isFieldBlocked = (fieldName: string): boolean => {
    const restriction = getFieldRestrictions[fieldName];
    return restriction?.acao === 'bloquear' || restriction?.acao === 'valor_fixo';
  };

  const isFieldRequired = (fieldName: string): boolean => {
    const restriction = getFieldRestrictions[fieldName];
    return restriction?.acao === 'obrigar';
  };

  const isFieldHidden = (fieldName: string): boolean => {
    const restriction = getFieldRestrictions[fieldName];
    return restriction?.acao === 'ocultar';
  };

  const getFieldValue = (fieldName: string): any => {
    const restriction = getFieldRestrictions[fieldName];
    return restriction?.valor;
  };

  const getFieldReason = (fieldName: string): string | null => {
    const restriction = getFieldRestrictions[fieldName];
    return restriction?.motivo || null;
  };

  return {
    clientProfile,
    clientOptions: getClientOptions,
    activeRules: getActiveRules,
    fieldRestrictions: getFieldRestrictions,
    fixedConfigurations: getFixedConfigurations,
    isFieldBlocked,
    isFieldRequired,
    isFieldHidden,
    getFieldValue,
    getFieldReason,
    hasRules: !!clientProfile
  };
}
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BusinessRule {
  id: string;
  rule_key: string;
  name: string;
  rule_type: 'boolean' | 'number' | 'string' | 'json';
  default_value: any;
  is_enabled: boolean;
  custom_value: any;
}

interface ApprovalRule {
  valor_minimo: number;
  valor_maximo: number;
  tipo_processo: '3bids' | 'aprovacao_tradicional' | 'sourcing_obrigatorio';
  aprovadores_necessarios: number;
  prazo_resposta_horas: number;
}

export const useBusinessRules = () => {
  const [rules, setRules] = useState<BusinessRule[]>([]);
  const [loading, setLoading] = useState(false);

  const getApprovalFlow = (valor: number, categoria?: string): ApprovalRule => {
    // Regras padrão baseadas no valor
    if (valor <= 1000) {
      return {
        valor_minimo: 0,
        valor_maximo: 1000,
        tipo_processo: '3bids',
        aprovadores_necessarios: 1,
        prazo_resposta_horas: 48
      };
    } else if (valor <= 10000) {
      return {
        valor_minimo: 1001,
        valor_maximo: 10000,
        tipo_processo: 'aprovacao_tradicional',
        aprovadores_necessarios: 2,
        prazo_resposta_horas: 72
      };
    } else {
      return {
        valor_minimo: 10001,
        valor_maximo: 999999999,
        tipo_processo: 'sourcing_obrigatorio',
        aprovadores_necessarios: 3,
        prazo_resposta_horas: 168 // 7 dias
      };
    }
  };

  const shouldAggregateRequests = (requisicoes: any[]): boolean => {
    // Verifica se há múltiplas requisições da mesma categoria aprovadas recentemente
    const categoriaGroups = requisicoes.reduce((acc, req) => {
      const categoria = req.categoria || 'Geral';
      if (!acc[categoria]) acc[categoria] = [];
      acc[categoria].push(req);
      return acc;
    }, {} as Record<string, any[]>);

    // Retorna true se alguma categoria tem 2+ requisições
    return Object.values(categoriaGroups).some((group: any[]) => group.length >= 2);
  };

  const getAggregationSuggestions = (requisicoes: any[]) => {
    const suggestions = [];
    
    // Agrupar por categoria
    const categoriaGroups = requisicoes.reduce((acc, req) => {
      const categoria = req.categoria || 'Geral';
      if (!acc[categoria]) acc[categoria] = [];
      acc[categoria].push(req);
      return acc;
    }, {} as Record<string, any[]>);

    // Criar sugestões para categorias com múltiplas requisições
    Object.entries(categoriaGroups).forEach(([categoria, reqs]: [string, any[]]) => {
      if (reqs.length >= 2) {
        const valor_total = reqs.reduce((sum, req) => sum + (req.valor_estimado || 0), 0);
        const economia_estimada = valor_total * 0.15; // 15% de economia estimada
        
        suggestions.push({
          id: `agregacao-${categoria}-${Date.now()}`,
          categorias: [categoria],
          requisicoes: reqs.map(req => ({
            id: req.id,
            numero: req.numero_requisicao,
            valor: req.valor_estimado || 0,
            solicitante: req.solicitante_nome
          })),
          valor_total,
          economia_estimada,
          tipo_sugerido: valor_total > 50000 ? 'leilao' as const : 'cotacao' as const,
          prazo_sugerido: valor_total > 100000 ? 14 : 7,
          justificativa: `Detectadas ${reqs.length} requisições similares em ${categoria}. Agregação pode resultar em economia de escala.`
        });
      }
    });

    return suggestions;
  };

  const canUserBypass3Bids = (userId: string, valor: number): boolean => {
    // Regra: Gestores podem pular 3-bids em casos excepcionais até R$ 2.000
    // TODO: Implementar verificação de perfil do usuário
    return false;
  };

  const getRequiredDocuments = (valor: number, categoria: string): string[] => {
    const docs = ['Justificativa técnica'];
    
    if (valor > 5000) {
      docs.push('Pesquisa de preços');
    }
    
    if (valor > 50000) {
      docs.push('Aprovação orçamentária', 'Análise de risco');
    }
    
    if (['TI', 'Obras', 'Equipamentos'].includes(categoria)) {
      docs.push('Especificação técnica detalhada');
    }
    
    return docs;
  };

  return {
    rules,
    loading,
    getApprovalFlow,
    shouldAggregateRequests,
    getAggregationSuggestions,
    canUserBypass3Bids,
    getRequiredDocuments
  };
};
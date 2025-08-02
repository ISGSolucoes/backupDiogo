// Hooks para requisições
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Requisicao {
  id: string;
  numero_requisicao: string;
  titulo: string;
  descricao?: string;
  tipo: 'material' | 'servico' | 'equipamento' | 'software' | 'infraestrutura' | 'outros';
  status: 'rascunho' | 'enviada' | 'em_aprovacao' | 'aprovada' | 'rejeitada' | 'em_cotacao' | 'cotacao_recebida' | 'finalizada' | 'cancelada';
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  data_criacao: string;
  data_necessidade: string;
  data_aprovacao?: string;
  data_finalizacao?: string;
  valor_estimado: number;
  valor_aprovado?: number;
  solicitante_id: string;
  solicitante_nome: string;
  solicitante_area: string;
  aprovador_atual_id?: string;
  aprovador_atual_nome?: string;
  justificativa?: string;
  observacoes?: string;
  centro_custo?: string;
  conta_contabil?: string;
  cotacao_id?: string;
  pedido_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ItemRequisicao {
  id: string;
  requisicao_id: string;
  sequencia: number;
  codigo_produto?: string;
  descricao: string;
  especificacao?: string;
  unidade: string;
  quantidade: number;
  preco_estimado: number;
  valor_total_estimado: number;
  data_necessidade?: string;
  local_entrega?: string;
  observacoes?: string;
  urgente: boolean;
  created_at: string;
  updated_at: string;
}

export interface AprovacaoRequisicao {
  id: string;
  requisicao_id: string;
  nivel: number;
  ordem: number;
  aprovador_id: string;
  aprovador_nome: string;
  aprovador_cargo?: string;
  aprovador_area?: string;
  status: 'pendente' | 'aprovada' | 'rejeitada' | 'delegada';
  data_solicitacao: string;
  data_resposta?: string;
  data_expiracao?: string;
  comentarios?: string;
  motivo_rejeicao?: string;
  condicoes_aprovacao?: string;
  delegado_para_id?: string;
  delegado_para_nome?: string;
  motivo_delegacao?: string;
  created_at: string;
  updated_at: string;
}

export interface HistoricoRequisicao {
  id: string;
  requisicao_id: string;
  evento: string;
  descricao?: string;
  status_anterior?: string;
  status_novo?: string;
  dados_anteriores?: any;
  dados_novos?: any;
  campos_alterados?: string[];
  comentario?: string;
  publico: boolean;
  usuario_id?: string;
  usuario_nome: string;
  usuario_area?: string;
  ip_address?: string | null;
  user_agent?: string;
  origem: string;
  created_at: string;
}

export const useRequisicoes = () => {
  const [requisicoes, setRequisicoes] = useState<Requisicao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequisicoes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('requisicoes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequisicoes(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar requisições');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequisicoes();
  }, []);

  return { requisicoes, loading, error, refetch: fetchRequisicoes };
};

export const useItensRequisicao = (requisicaoId: string) => {
  const [itens, setItens] = useState<ItemRequisicao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItens = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('itens_requisicao')
        .select('*')
        .eq('requisicao_id', requisicaoId)
        .order('sequencia', { ascending: true });

      if (error) throw error;
      setItens(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar itens');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (requisicaoId) {
      fetchItens();
    }
  }, [requisicaoId]);

  return { itens, loading, error, refetch: fetchItens };
};

export const useAprovacoesRequisicao = (requisicaoId: string) => {
  const [aprovacoes, setAprovacoes] = useState<AprovacaoRequisicao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAprovacoes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('aprovacoes_requisicao')
        .select('*')
        .eq('requisicao_id', requisicaoId)
        .order('nivel', { ascending: true })
        .order('ordem', { ascending: true });

      if (error) throw error;
      setAprovacoes(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar aprovações');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (requisicaoId) {
      fetchAprovacoes();
    }
  }, [requisicaoId]);

  return { aprovacoes, loading, error, refetch: fetchAprovacoes };
};

export const useHistoricoRequisicao = (requisicaoId: string) => {
  const [historico, setHistorico] = useState<HistoricoRequisicao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistorico = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('historico_requisicao')
        .select('*')
        .eq('requisicao_id', requisicaoId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistorico((data || []) as HistoricoRequisicao[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar histórico');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (requisicaoId) {
      fetchHistorico();
    }
  }, [requisicaoId]);

  return { historico, loading, error, refetch: fetchHistorico };
};

// Hook para aprovar/rejeitar requisições
export const useAcaoAprovacao = () => {
  const [loading, setLoading] = useState(false);

  const aprovarRequisicao = async (
    aprovacaoId: string,
    comentarios?: string,
    condicoes?: string
  ) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('aprovacoes_requisicao')
        .update({
          status: 'aprovada',
          data_resposta: new Date().toISOString(),
          comentarios,
          condicoes_aprovacao: condicoes,
          updated_at: new Date().toISOString()
        })
        .eq('id', aprovacaoId);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erro ao aprovar requisição' 
      };
    } finally {
      setLoading(false);
    }
  };

  const rejeitarRequisicao = async (
    aprovacaoId: string,
    motivo: string,
    comentarios?: string
  ) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('aprovacoes_requisicao')
        .update({
          status: 'rejeitada',
          data_resposta: new Date().toISOString(),
          motivo_rejeicao: motivo,
          comentarios,
          updated_at: new Date().toISOString()
        })
        .eq('id', aprovacaoId);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erro ao rejeitar requisição' 
      };
    } finally {
      setLoading(false);
    }
  };

  return { aprovarRequisicao, rejeitarRequisicao, loading };
};
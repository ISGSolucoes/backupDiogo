import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Requisicao } from './useRequisicoes';

export interface SolicacaoSourcing {
  id: string;
  requisicao_id: string;
  status: 'nova' | 'processando' | 'projeto_criado' | 'rejeitada';
  created_at: string;
  processed_at?: string;
  processed_by?: string;
  auto_created_project_id?: string;
  valor_estimado?: number;
  categoria?: string;
  observacoes?: string;
  requisicao?: Requisicao;
  recomendacoes_fornecedores?: FornecedorRecomendacao[];
}

export interface FornecedorRecomendacao {
  fornecedor_id: string;
  nome: string;
  score: number;
  razao: string;
  categoria_match: boolean;
  historico_performance: number;
}

export const useSourcingRequests = () => {
  const [solicitacoes, setSolicitacoes] = useState<SolicacaoSourcing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSolicitacoes = async () => {
    try {
      setLoading(true);
      
      // Buscar solicitações reais criadas pelos triggers
      const { data: solicitacoesReais, error: solError } = await supabase
        .from('solicitacoes_sourcing')
        .select('*')
        .order('created_at', { ascending: false });

      if (solError) throw solError;

      // Buscar dados das requisições separadamente
      const solicitacoesComRequisicoes = await Promise.all(
        (solicitacoesReais || []).map(async (sol) => {
          const { data: requisicao } = await supabase
            .from('requisicoes')
            .select('*')
            .eq('id', sol.requisicao_id)
            .single();

          return {
            id: sol.id,
            requisicao_id: sol.requisicao_id,
            status: sol.status as 'nova' | 'processando' | 'projeto_criado' | 'rejeitada',
            created_at: sol.created_at,
            processed_at: sol.processed_at,
            processed_by: sol.processed_by,
            auto_created_project_id: sol.auto_created_project_id,
            valor_estimado: sol.valor_estimado,
            categoria: sol.categoria,
            observacoes: sol.observacoes,
            requisicao: requisicao as Requisicao,
            recomendacoes_fornecedores: Array.isArray(sol.recomendacoes_fornecedores) 
              ? (sol.recomendacoes_fornecedores as any[]).map(rec => rec as FornecedorRecomendacao)
              : []
          };
        })
      );

      setSolicitacoes(solicitacoesComRequisicoes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar solicitações');
    } finally {
      setLoading(false);
    }
  };

  const gerarRecomendacoesFornecedores = (requisicao: any): FornecedorRecomendacao[] => {
    // Simulação de recomendações inteligentes baseadas na requisição
    
    return [
      {
        fornecedor_id: '1',
        nome: 'Fornecedor Alpha',
        score: 85,
        razao: 'Histórico excelente na categoria',
        categoria_match: true,
        historico_performance: 92
      },
      {
        fornecedor_id: '2', 
        nome: 'Fornecedor Beta',
        score: 78,
        razao: 'Preços competitivos',
        categoria_match: true,
        historico_performance: 85
      },
      {
        fornecedor_id: '3',
        nome: 'Fornecedor Gamma',
        score: 72,
        razao: 'Boa localização geográfica',
        categoria_match: false,
        historico_performance: 78
      }
    ];
  };

  const processarSolicitacao = async (solicitacaoId: string, acao: 'aceitar' | 'rejeitar') => {
    try {
      const solicitacao = solicitacoes.find(s => s.id === solicitacaoId);
      if (!solicitacao) throw new Error('Solicitação não encontrada');

      if (acao === 'aceitar') {
        // Criar projeto de sourcing real usando os campos corretos da tabela
        const { data: novoProjeto, error: projectError } = await supabase
          .from('projetos_sourcing')
          .insert({
            codigo_projeto: `SRC-${Date.now()}`, // será substituído pelo trigger
            nome_projeto: `Sourcing - ${solicitacao.requisicao?.titulo || 'Projeto'}`,
            descricao: `Projeto criado automaticamente da requisição ${solicitacao.requisicao?.numero_requisicao}`,
            tipo_evento: 'rfq',
            tipo_aquisicao: 'nacional',
            opcao_leilao: 'nao',
            status: 'rascunho',
            departamento: 'Procurement',
            proprietario_id: solicitacao.processed_by || '00000000-0000-0000-0000-000000000000',
            regiao_compra: 'Nacional',
            gasto_base: solicitacao.valor_estimado || 0,
            economia_esperada: (solicitacao.valor_estimado || 0) * 0.1,
            moeda: 'BRL',
            prazo_entrega: 30,
            visibilidade_prazo: true,
            condicao_pagamento: '30 dias',
            criado_por: solicitacao.processed_by || '00000000-0000-0000-0000-000000000000'
          })
          .select()
          .single();

        if (projectError) throw projectError;

        // Atualizar status da solicitação no banco
        const { error: updateError } = await supabase
          .from('solicitacoes_sourcing')
          .update({ 
            status: 'projeto_criado',
            processed_at: new Date().toISOString(),
            auto_created_project_id: novoProjeto.id
          })
          .eq('id', solicitacaoId);

        if (updateError) throw updateError;

        // Atualizar estado local
        setSolicitacoes(prev => prev.map(s => 
          s.id === solicitacaoId 
            ? { ...s, status: 'projeto_criado', processed_at: new Date().toISOString(), auto_created_project_id: novoProjeto.id }
            : s
        ));

        return { success: true, projectId: novoProjeto.id };
      } else {
        // Rejeitar solicitação
        const { error: updateError } = await supabase
          .from('solicitacoes_sourcing')
          .update({ 
            status: 'rejeitada',
            processed_at: new Date().toISOString()
          })
          .eq('id', solicitacaoId);

        if (updateError) throw updateError;

        setSolicitacoes(prev => prev.map(s => 
          s.id === solicitacaoId 
            ? { ...s, status: 'rejeitada', processed_at: new Date().toISOString() }
            : s
        ));
        return { success: true };
      }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erro ao processar solicitação' 
      };
    }
  };

  useEffect(() => {
    fetchSolicitacoes();
    
    // Configurar atualização em tempo real para solicitações de sourcing
    const channel = supabase
      .channel('sourcing-requests')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'solicitacoes_sourcing' },
        () => fetchSolicitacoes()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { 
    solicitacoes, 
    loading, 
    error, 
    refetch: fetchSolicitacoes,
    processarSolicitacao 
  };
};
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ProjetoSourcing {
  id: string;
  codigo_projeto: string;
  nome_projeto: string;
  descricao?: string;
  tipo_evento: 'rfq' | 'rfp' | 'leilao';
  status: 'rascunho' | 'ativo' | 'finalizado' | 'cancelado';
  valor_estimado?: number;
  data_abertura?: string;
  data_fechamento?: string;
  data_limite_resposta?: string;
  criterios_avaliacao?: any;
  fornecedores_convidados?: any[];
  fornecedor_vencedor_id?: string;
  proposta_vencedora?: any;
  criado_por?: string;
  created_at: string;
  updated_at: string;
}

export const useProjetoSourcing = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const criarProjeto = async (dados: {
    nome_projeto: string;
    descricao?: string;
    tipo_evento: 'rfq' | 'rfp' | 'leilao';
    valor_estimado?: number;
    data_limite_resposta?: string;
    criterios_avaliacao?: any;
    fornecedores_convidados?: any[];
  }) => {
    try {
      setLoading(true);

      const { data: projeto, error } = await supabase
        .from('projetos_sourcing')
        .insert({
          codigo_projeto: `TMP-${Date.now()}`, // Será substituído pelo trigger
          nome_projeto: dados.nome_projeto,
          descricao: dados.descricao,
          tipo_evento: dados.tipo_evento,
          tipo_aquisicao: 'nacional',
          opcao_leilao: dados.tipo_evento === 'leilao' ? 'sim' : 'nao',
          status: 'rascunho',
          departamento: 'Procurement',
          proprietario_id: '00000000-0000-0000-0000-000000000000', // será atualizado com usuário real
          regiao_compra: 'Nacional',
          gasto_base: dados.valor_estimado || 0,
          economia_esperada: (dados.valor_estimado || 0) * 0.1,
          moeda: 'BRL',
          prazo_entrega: 30,
          visibilidade_prazo: true,
          condicao_pagamento: '30 dias',
          criado_por: '00000000-0000-0000-0000-000000000000' // será atualizado com usuário real
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Projeto Criado",
        description: `Projeto de sourcing ${projeto.codigo_projeto} criado com sucesso`,
      });

      return { success: true, projeto };
    } catch (error) {
      toast({
        title: "Erro ao Criar Projeto",
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: "destructive"
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const finalizarProjeto = async (projetoId: string, fornecedorVencedorId: string, propostaVencedora: any) => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('projetos_sourcing')
        .update({
          status: 'finalizado',
          fornecedor_vencedor_id: fornecedorVencedorId,
          proposta_vencedora: propostaVencedora,
          data_fechamento: new Date().toISOString()
        })
        .eq('id', projetoId);

      if (error) throw error;

      toast({
        title: "Projeto Finalizado",
        description: "Projeto de sourcing finalizado. Pedido será criado automaticamente.",
      });

      return { success: true };
    } catch (error) {
      toast({
        title: "Erro ao Finalizar Projeto",
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: "destructive"
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const buscarProjetos = async () => {
    try {
      const { data: projetos, error } = await supabase
        .from('projetos_sourcing')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return projetos as ProjetoSourcing[];
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
      return [];
    }
  };

  return {
    loading,
    criarProjeto,
    finalizarProjeto,
    buscarProjetos
  };
};
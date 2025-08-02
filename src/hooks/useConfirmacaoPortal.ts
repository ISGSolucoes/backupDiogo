import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ItemPedidoPortal {
  id: string;
  sequencia: number;
  descricao: string;
  quantidade: number;
  preco_unitario: number;
  valor_total: number;
  prazo_entrega_original: number;
  status_confirmacao: 'pendente' | 'confirmado' | 'alterado' | 'recusado';
  prazo_proposto?: number;
  preco_proposto?: number;
  observacoes_fornecedor?: string;
}

export interface PedidoPortal {
  id: string;
  numero_pedido: string;
  fornecedor_razao_social: string;
  valor_total: number;
  data_emissao: string;
  data_entrega_prevista: string;
  status: string;
  itens: ItemPedidoPortal[];
  observacoes?: string;
  contato_responsavel: {
    nome: string;
    email: string;
    telefone?: string;
  };
}

export const useConfirmacaoPortal = () => {
  const [pedidosPortal, setPedidosPortal] = useState<PedidoPortal[]>([]);
  const [loading, setLoading] = useState(false);

  const buscarPedidosPortal = async (fornecedorId: string) => {
    setLoading(true);
    try {
      const { data: pedidos, error } = await supabase
        .from('pedidos')
        .select(`
          id,
          numero_pedido,
          fornecedor_razao_social,
          valor_total,
          data_emissao,
          data_entrega_prevista,
          status,
          observacoes,
          responsavel_interno_nome,
          responsavel_interno_email,
          itens_pedido (
            id,
            sequencia,
            descricao,
            quantidade,
            preco_unitario,
            valor_total,
            observacoes
          )
        `)
        .eq('fornecedor_id', fornecedorId)
        .in('status', ['enviado', 'confirmado', 'questionado']);

      if (error) throw error;

      const pedidosFormatados: PedidoPortal[] = pedidos?.map(pedido => ({
        id: pedido.id,
        numero_pedido: pedido.numero_pedido,
        fornecedor_razao_social: pedido.fornecedor_razao_social || '',
        valor_total: pedido.valor_total || 0,
        data_emissao: pedido.data_emissao,
        data_entrega_prevista: pedido.data_entrega_prevista,
        status: pedido.status,
        observacoes: pedido.observacoes,
        contato_responsavel: {
          nome: pedido.responsavel_interno_nome || 'Não informado',
          email: pedido.responsavel_interno_email || '',
        },
        itens: pedido.itens_pedido?.map((item: any) => ({
          id: item.id,
          sequencia: item.sequencia,
          descricao: item.descricao,
          quantidade: item.quantidade,
          preco_unitario: item.preco_unitario,
          valor_total: item.valor_total,
          prazo_entrega_original: 7, // Placeholder
          status_confirmacao: 'pendente' as const,
          observacoes_fornecedor: item.observacoes
        })) || []
      })) || [];

      setPedidosPortal(pedidosFormatados);
    } catch (error) {
      console.error('Erro ao buscar pedidos do portal:', error);
    }
    setLoading(false);
  };

  const confirmarItemPedido = async (
    pedidoId: string,
    itemId: string,
    confirmacao: {
      status: 'confirmado' | 'alterado' | 'recusado';
      prazo_proposto?: number;
      preco_proposto?: number;
      observacoes?: string;
    }
  ) => {
    try {
      // Atualizar status do item com as alterações propostas
      const { error } = await supabase
        .from('itens_pedido')
        .update({
          observacoes: confirmacao.observacoes,
          // Campos customizados para controle do portal seriam adicionados aqui
        })
        .eq('id', itemId);

      if (error) throw error;

      // Atualizar estado local
      setPedidosPortal(prev => prev.map(pedido => 
        pedido.id === pedidoId ? {
          ...pedido,
          itens: pedido.itens.map(item =>
            item.id === itemId ? {
              ...item,
              status_confirmacao: confirmacao.status,
              prazo_proposto: confirmacao.prazo_proposto,
              preco_proposto: confirmacao.preco_proposto,
              observacoes_fornecedor: confirmacao.observacoes
            } : item
          )
        } : pedido
      ));

      // Registrar histórico da confirmação
      await registrarHistoricoConfirmacao(pedidoId, itemId, confirmacao);

      return { success: true };
    } catch (error) {
      console.error('Erro ao confirmar item:', error);
      return { success: false, error: error.message };
    }
  };

  const confirmarPedidoCompleto = async (pedidoId: string, observacoesGerais?: string) => {
    try {
      const pedido = pedidosPortal.find(p => p.id === pedidoId);
      if (!pedido) throw new Error('Pedido não encontrado');

      // Verificar se todos os itens foram confirmados
      const itensNaoConfirmados = pedido.itens.filter(item => 
        item.status_confirmacao === 'pendente'
      );

      if (itensNaoConfirmados.length > 0) {
        throw new Error('Existem itens pendentes de confirmação');
      }

      // Determinar status final baseado nas confirmações dos itens
      const temItensAlterados = pedido.itens.some(item => 
        item.status_confirmacao === 'alterado'
      );
      const temItensRecusados = pedido.itens.some(item => 
        item.status_confirmacao === 'recusado'
      );

      let novoStatus: 'confirmado' | 'cancelado' | 'questionado' = 'confirmado';
      if (temItensRecusados) {
        novoStatus = 'cancelado';
      } else if (temItensAlterados) {
        novoStatus = 'questionado'; // Precisa aprovação das alterações
      }

      // Atualizar pedido
      const { error } = await supabase
        .from('pedidos')
        .update({
          status: novoStatus,
          data_resposta_fornecedor: new Date().toISOString(),
          observacoes_fornecedor: observacoesGerais
        })
        .eq('id', pedidoId);

      if (error) throw error;

      // Atualizar estado local
      setPedidosPortal(prev => prev.map(p => 
        p.id === pedidoId ? { ...p, status: novoStatus } : p
      ));

      return { success: true, novoStatus };
    } catch (error) {
      console.error('Erro ao confirmar pedido:', error);
      return { success: false, error: error.message };
    }
  };

  const registrarHistoricoConfirmacao = async (
    pedidoId: string,
    itemId: string,
    confirmacao: any
  ) => {
    try {
      // Registrar no histórico do pedido
      const { data: pedidoAtual } = await supabase
        .from('pedidos')
        .select('historico_acoes')
        .eq('id', pedidoId)
        .single();

      const historicoAtual = Array.isArray(pedidoAtual?.historico_acoes) ? pedidoAtual.historico_acoes : [];
      const novaAcao = {
        timestamp: new Date().toISOString(),
        acao: 'confirmacao_item_portal',
        item_id: itemId,
        detalhes: confirmacao,
        origem: 'portal_fornecedor'
      };

      await supabase
        .from('pedidos')
        .update({
          historico_acoes: [...historicoAtual, novaAcao]
        })
        .eq('id', pedidoId);

    } catch (error) {
      console.error('Erro ao registrar histórico:', error);
    }
  };

  const buscarHistoricoConfirmacoes = async (pedidoId: string) => {
    try {
      const { data } = await supabase
        .from('pedidos')
        .select('historico_acoes')
        .eq('id', pedidoId)
        .single();

      const historico = Array.isArray(data?.historico_acoes) ? data.historico_acoes : [];
      return historico.filter((acao: any) => 
        acao.acao === 'confirmacao_item_portal'
      );
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      return [];
    }
  };

  return {
    pedidosPortal,
    loading,
    buscarPedidosPortal,
    confirmarItemPedido,
    confirmarPedidoCompleto,
    buscarHistoricoConfirmacoes
  };
};
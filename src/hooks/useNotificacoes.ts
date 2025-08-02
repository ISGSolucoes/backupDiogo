import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Notificacao {
  id: string;
  tipo: 'requisicao_aprovada' | 'evento_criado' | 'proposta_recebida' | 'pedido_confirmado' | 'alerta_prazo';
  titulo: string;
  mensagem: string;
  dados: any;
  lida: boolean;
  usuario_id: string;
  created_at: string;
  acao_disponivel?: {
    label: string;
    url: string;
    tipo: 'link' | 'acao';
  };
}

export const useNotificacoes = () => {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [naoLidas, setNaoLidas] = useState(0);
  const [loading, setLoading] = useState(false);

  const buscarNotificacoes = async (usuarioId?: string) => {
    if (!usuarioId) return;
    
    setLoading(true);
    try {
      // Por enquanto, vamos simular com dados locais até implementar a tabela
      const notificacoesMock: Notificacao[] = [
        {
          id: '1',
          tipo: 'requisicao_aprovada',
          titulo: 'Requisição Aprovada',
          mensagem: 'REQ-45231 foi aprovada e está pronta para agregação',
          dados: { requisicao_id: 'req-1' },
          lida: false,
          usuario_id: usuarioId,
          created_at: new Date().toISOString(),
          acao_disponivel: {
            label: 'Ver Requisição',
            url: '/requisicoes/req-1',
            tipo: 'link'
          }
        },
        {
          id: '2',
          tipo: 'evento_criado',
          titulo: 'Evento Criado Automaticamente',
          mensagem: 'Evento AGR-123 foi criado agregando 2 requisições de TI',
          dados: { evento_id: 'evt-1' },
          lida: false,
          usuario_id: usuarioId,
          created_at: new Date(Date.now() - 3600000).toISOString(),
          acao_disponivel: {
            label: 'Ver Evento',
            url: '/sourcing/eventos/evt-1',
            tipo: 'link'
          }
        }
      ];

      setNotificacoes(notificacoesMock);
      setNaoLidas(notificacoesMock.filter(n => !n.lida).length);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    }
    setLoading(false);
  };

  const marcarComoLida = async (notificacaoId: string) => {
    setNotificacoes(prev => 
      prev.map(n => 
        n.id === notificacaoId ? { ...n, lida: true } : n
      )
    );
    setNaoLidas(prev => Math.max(0, prev - 1));
  };

  const marcarTodasComoLidas = async () => {
    setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })));
    setNaoLidas(0);
  };

  const criarNotificacao = async (notificacao: Omit<Notificacao, 'id' | 'created_at' | 'lida'>) => {
    const novaNotificacao: Notificacao = {
      ...notificacao,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      lida: false
    };

    setNotificacoes(prev => [novaNotificacao, ...prev]);
    setNaoLidas(prev => prev + 1);

    // Aqui seria enviado email se configurado
    console.log('Nova notificação criada:', novaNotificacao);
  };

  // Notificações automáticas para eventos do sistema
  const notificarRequisicaoAprovada = (requisicaoId: string, numeroRequisicao: string, usuarioId: string) => {
    criarNotificacao({
      tipo: 'requisicao_aprovada',
      titulo: 'Requisição Aprovada',
      mensagem: `${numeroRequisicao} foi aprovada e está disponível para aggregação automática`,
      dados: { requisicao_id: requisicaoId },
      usuario_id: usuarioId,
      acao_disponivel: {
        label: 'Ver Requisição',
        url: `/requisicoes/${requisicaoId}`,
        tipo: 'link'
      }
    });
  };

  const notificarEventoCriado = (eventoId: string, codigoEvento: string, quantidadeRequisicoes: number, usuarioId: string) => {
    criarNotificacao({
      tipo: 'evento_criado',
      titulo: 'Evento Criado Automaticamente',
      mensagem: `${codigoEvento} foi criado automaticamente agregando ${quantidadeRequisicoes} requisições`,
      dados: { evento_id: eventoId },
      usuario_id: usuarioId,
      acao_disponivel: {
        label: 'Ver Evento',
        url: `/sourcing/projetos/${eventoId}`,
        tipo: 'link'
      }
    });
  };

  const notificarPropostaRecebida = (eventoId: string, fornecedorNome: string, usuarioId: string) => {
    criarNotificacao({
      tipo: 'proposta_recebida',
      titulo: 'Nova Proposta Recebida',
      mensagem: `${fornecedorNome} enviou proposta para seu evento`,
      dados: { evento_id: eventoId, fornecedor: fornecedorNome },
      usuario_id: usuarioId,
      acao_disponivel: {
        label: 'Ver Propostas',
        url: `/sourcing/projetos/${eventoId}/propostas`,
        tipo: 'link'
      }
    });
  };

  const notificarPedidoConfirmado = (pedidoId: string, numeroPedido: string, usuarioId: string) => {
    criarNotificacao({
      tipo: 'pedido_confirmado',
      titulo: 'Pedido Confirmado',
      mensagem: `${numeroPedido} foi confirmado pelo fornecedor`,
      dados: { pedido_id: pedidoId },
      usuario_id: usuarioId,
      acao_disponivel: {
        label: 'Ver Pedido',
        url: `/pedidos/${pedidoId}`,
        tipo: 'link'
      }
    });
  };

  return {
    notificacoes,
    naoLidas,
    loading,
    buscarNotificacoes,
    marcarComoLida,
    marcarTodasComoLidas,
    notificarRequisicaoAprovada,
    notificarEventoCriado,
    notificarPropostaRecebida,
    notificarPedidoConfirmado
  };
};
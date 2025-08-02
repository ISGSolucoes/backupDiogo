import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Pedido, FiltrosPedidos, StatusPedido } from '@/types/pedido';

interface ValidacaoPedido {
  valido: boolean;
  erros: string[];
  alertas: string[];
}

export function usePedidos() {
  const { toast } = useToast();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState<FiltrosPedidos>({});
  const [termoBusca, setTermoBusca] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalRegistros, setTotalRegistros] = useState(0);

  const ITENS_POR_PAGINA = 10;

  const carregarPedidos = useCallback(async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('pedidos')
        .select('*', { count: 'exact' });

      // Aplicar filtros
      if (filtros.status && filtros.status.length > 0) {
        query = query.in('status', filtros.status);
      }
      
      if (filtros.fornecedor_id) {
        query = query.eq('fornecedor_id', filtros.fornecedor_id);
      }
      
      if (filtros.data_inicio) {
        query = query.gte('data_criacao', filtros.data_inicio);
      }
      
      if (filtros.data_fim) {
        query = query.lte('data_criacao', filtros.data_fim);
      }

      if (filtros.valor_min) {
        query = query.gte('valor_total', filtros.valor_min);
      }

      if (filtros.valor_max) {
        query = query.lte('valor_total', filtros.valor_max);
      }

      if (termoBusca) {
        query = query.or(`numero_pedido.ilike.%${termoBusca}%,observacoes.ilike.%${termoBusca}%,fornecedor_id.ilike.%${termoBusca}%`);
      }

      // Paginação
      const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
      query = query
        .range(inicio, inicio + ITENS_POR_PAGINA - 1)
        .order('data_criacao', { ascending: false });

      const { data, error, count } = await query;

      if (error) throw error;

      setPedidos(data || []);
      setTotalRegistros(count || 0);
      setTotalPaginas(Math.ceil((count || 0) / ITENS_POR_PAGINA));
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os pedidos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [filtros, termoBusca, paginaAtual, toast]);

  const excluirPedido = async (pedidoId: string) => {
    try {
      const { error } = await supabase
        .from('pedidos')
        .delete()
        .eq('id', pedidoId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Pedido excluído com sucesso!",
      });
      
      await carregarPedidos();
    } catch (error) {
      console.error('Erro ao excluir:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o pedido",
        variant: "destructive",
      });
    }
  };

  const alterarStatusPedido = async (pedidoId: string, novoStatus: StatusPedido, justificativa?: string) => {
    try {
      setLoading(true);
      
      // Usar a função de banco com validações
      const { data, error } = await supabase.rpc('alterar_status_pedido', {
        p_pedido_id: pedidoId,
        p_novo_status: novoStatus,
        p_usuario_id: '13e6d764-6d6d-4788-b2df-293391f350ca', // TODO: pegar do auth
        p_usuario_nome: 'Usuário Sistema', // TODO: pegar do profile
        p_justificativa: justificativa
      });

      if (error) throw error;

      const resultado = data as any;

      if (!resultado?.sucesso) {
        toast({
          title: "Erro",
          description: resultado?.erro || 'Erro ao alterar status',
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: `Status alterado de ${resultado.status_anterior} para ${resultado.status_novo}`,
      });
      
      await carregarPedidos();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const salvarPedido = async (pedido: any) => {
    try {
      if (pedido.id) {
        // Atualizar pedido existente
        const { error } = await supabase
          .from('pedidos')
          .update(pedido)
          .eq('id', pedido.id);

        if (error) throw error;

        await supabase.rpc('registrar_acao_pedido', {
          pedido_id_param: pedido.id,
          acao: 'Pedido atualizado',
          usuario_id_param: null, // TODO: pegar do contexto de auth
          usuario_nome: 'Sistema'
        });
      } else {
        // Criar novo pedido
        const { error } = await supabase
          .from('pedidos')
          .insert(pedido);

        if (error) throw error;
      }

      toast({
        title: "Sucesso",
        description: pedido.id ? "Pedido atualizado com sucesso!" : "Pedido criado com sucesso!",
      });
      
      await carregarPedidos();
    } catch (error) {
      console.error('Erro ao salvar pedido:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o pedido",
        variant: "destructive",
      });
    }
  };

  const criarPOAutomatico = async (dados: {
    origem: 'cotacao' | 'requisicao' | 'contrato' | 'manual';
    origemId?: string;
    fornecedor?: {
      id: string;
      cnpj: string;
      nome: string;
    };
    dados: {
      centroCusto?: string;
      projeto?: string;
      dataEntregaPrevista?: string;
      observacoes?: string;
    };
    itens: Array<{
      descricao: string;
      especificacao?: string;
      quantidade: number;
      unidade: string;
      precoUnitario?: number;
      codigoProduto?: string;
      categoria?: string;
      centroCusto?: string;
    }>;
    usuarioId?: string;
  }) => {
    try {
      const { data, error } = await supabase.functions.invoke('criar-po-automatico', {
        body: dados
      });

      if (error) throw error;

      if (data?.success) {
        toast({
          title: "Sucesso",
          description: `Pedido criado automaticamente via ${dados.origem}`,
        });
        
        await carregarPedidos();
        return data.pedidoId;
      } else {
        throw new Error(data?.error || 'Erro ao criar pedido automaticamente');
      }
    } catch (error) {
      console.error('Erro ao criar PO automaticamente:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o pedido automaticamente",
        variant: "destructive",
      });
      throw error;
    }
  };

  const criarPOManual = async (dadosPedido: any, itens: any[]) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.rpc('criar_po_manual', {
        p_dados_pedido: dadosPedido,
        p_itens: itens,
        p_usuario_id: (await supabase.auth.getUser()).data.user?.id
      });

      if (error) throw error;
      
      await carregarPedidos();
      return { success: true, pedido_id: data };
    } catch (error) {
      console.error('Erro ao criar PO manual:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const validarPedido = async (pedidoId: string): Promise<ValidacaoPedido> => {
    try {
      const { data, error } = await supabase.rpc('validar_pedido_para_envio', {
        pedido_id_param: pedidoId
      });

      if (error) throw error;

      return data as any as ValidacaoPedido;
    } catch (error) {
      console.error('Erro ao validar pedido:', error);
      return {
        valido: false,
        erros: ['Erro ao validar pedido'],
        alertas: []
      };
    }
  };

  const buscarPedidoPorId = async (pedidoId: string) => {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select(`
          *,
          itens_pedido (*)
        `)
        .eq('id', pedidoId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar pedido:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o pedido",
        variant: "destructive",
      });
      return null;
    }
  };

  const obterEstatisticas = () => {
    return {
      total: pedidos.length,
      rascunho: pedidos.filter(p => p.status === 'rascunho').length,
      aguardando_aprovacao: pedidos.filter(p => p.status === 'aguardando_aprovacao').length,
      aprovado: pedidos.filter(p => p.status === 'aprovado').length,
      enviado: pedidos.filter(p => p.status === 'enviado').length,
      confirmado: pedidos.filter(p => p.status === 'confirmado').length,
      valor_total: pedidos.reduce((acc, p) => acc + p.valor_total, 0),
      valor_medio: pedidos.length > 0 ? pedidos.reduce((acc, p) => acc + p.valor_total, 0) / pedidos.length : 0
    };
  };

  useEffect(() => {
    carregarPedidos();
  }, [carregarPedidos]);

  return {
    pedidos,
    loading,
    filtros,
    setFiltros,
    termoBusca,
    setTermoBusca,
    paginaAtual,
    setPaginaAtual,
    totalPaginas,
    totalRegistros,
    carregarPedidos,
    excluirPedido,
    alterarStatusPedido,
    salvarPedido,
    criarPOAutomatico,
    criarPOManual,
    validarPedido,
    buscarPedidoPorId,
    estatisticas: obterEstatisticas(),
    ITENS_POR_PAGINA
  };
}
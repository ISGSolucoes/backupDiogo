import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface FornecedorRecomendado {
  id: string;
  razao_social: string;
  cnpj: string;
  email_principal: string;
  categorias_principais: string[];
  score_historico: number;
  ultima_participacao: string;
  total_pedidos: number;
  valor_medio_pedidos: number;
  prazo_medio_entrega: number;
  avaliacao_qualidade: number;
  motivo_recomendacao: string;
}

export interface CriteriosRecomendacao {
  categoria: string;
  valor_estimado: number;
  prazo_desejado: number;
  regiao_entrega: string;
  historico_obrigatorio: boolean;
}

export const useRecomendacaoFornecedores = () => {
  const [fornecedoresRecomendados, setFornecedoresRecomendados] = useState<FornecedorRecomendado[]>([]);
  const [loading, setLoading] = useState(false);

  const buscarRecomendacoes = async (criterios: CriteriosRecomendacao) => {
    setLoading(true);
    try {
      // Buscar fornecedores ativos que atendem à categoria
      const { data: fornecedores, error } = await supabase
        .from('fornecedores')
        .select(`
          id,
          razao_social,
          documento_formatado,
          contatos_fornecedor (
            email,
            principal
          ),
          categorias_fornecimento (
            categoria
          )
        `)
        .eq('status', 'ativo')
        .eq('validado_receita', true);

      if (error) throw error;

      // Buscar histórico de pedidos para scoring
      const { data: historicoPedidos, error: historicoError } = await supabase
        .from('pedidos')
        .select(`
          fornecedor_id,
          valor_total,
          status,
          data_entrega_prevista,
          data_criacao
        `)
        .eq('status', 'finalizado')
        .gte('created_at', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString());

      if (historicoError) throw historicoError;

      // Processar recomendações
      const recomendacoes = processarRecomendacoes(
        fornecedores || [],
        historicoPedidos || [],
        criterios
      );

      setFornecedoresRecomendados(recomendacoes);
    } catch (error) {
      console.error('Erro ao buscar recomendações:', error);
    }
    setLoading(false);
  };

  const processarRecomendacoes = (
    fornecedores: any[],
    historico: any[],
    criterios: CriteriosRecomendacao
  ): FornecedorRecomendado[] => {
    const fornecedoresProcessados = fornecedores.map(fornecedor => {
      // Filtrar histórico do fornecedor
      const historicoFornecedor = historico.filter(p => p.fornecedor_id === fornecedor.id);
      
      // Verificar se atende à categoria
      const categorias = fornecedor.categorias_fornecimento?.map((c: any) => c.categoria) || [];
      const atendeCategoria = categorias.some((cat: string) => 
        cat.toLowerCase().includes(criterios.categoria.toLowerCase()) ||
        criterios.categoria.toLowerCase().includes(cat.toLowerCase())
      );

      if (!atendeCategoria) return null;

      // Calcular métricas
      const totalPedidos = historicoFornecedor.length;
      const valorTotalPedidos = historicoFornecedor.reduce((sum, p) => sum + (p.valor_total || 0), 0);
      const valorMedioPedidos = totalPedidos > 0 ? valorTotalPedidos / totalPedidos : 0;

      // Score base
      let score = 50;

      // Pontuação por histórico
      if (totalPedidos > 10) score += 20;
      else if (totalPedidos > 5) score += 10;
      else if (totalPedidos > 0) score += 5;

      // Pontuação por valor médio compatível
      if (valorMedioPedidos > 0) {
        const ratioValor = criterios.valor_estimado / valorMedioPedidos;
        if (ratioValor >= 0.5 && ratioValor <= 2) score += 15;
        else if (ratioValor >= 0.2 && ratioValor <= 5) score += 8;
      }

      // Penalizar se histórico obrigatório e não tem
      if (criterios.historico_obrigatorio && totalPedidos === 0) {
        score -= 30;
      }

      // Bonificar fornecedores com atividade recente
      const pedidosRecentes = historicoFornecedor.filter(p => 
        new Date(p.data_criacao) > new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
      );
      if (pedidosRecentes.length > 0) score += 10;

      // Determinar motivo da recomendação
      let motivo = '';
      if (totalPedidos > 10) {
        motivo = 'Fornecedor com histórico extenso e confiável';
      } else if (totalPedidos > 0) {
        motivo = 'Fornecedor com histórico positivo';
      } else {
        motivo = 'Fornecedor novo com potencial para a categoria';
      }

      const emailPrincipal = fornecedor.contatos_fornecedor?.find((c: any) => c.principal)?.email || 
                            fornecedor.contatos_fornecedor?.[0]?.email || '';

      return {
        id: fornecedor.id,
        razao_social: fornecedor.razao_social,
        cnpj: fornecedor.documento_formatado,
        email_principal: emailPrincipal,
        categorias_principais: categorias.slice(0, 3),
        score_historico: Math.round(score),
        ultima_participacao: historicoFornecedor.length > 0 ? 
          Math.max(...historicoFornecedor.map((p: any) => new Date(p.data_criacao).getTime())).toString() : 
          'Nunca',
        total_pedidos: totalPedidos,
        valor_medio_pedidos: Math.round(valorMedioPedidos),
        prazo_medio_entrega: 7, // Placeholder - seria calculado do histórico real
        avaliacao_qualidade: Math.min(5, 3 + (score / 100) * 2), // Conversão do score para 1-5
        motivo_recomendacao: motivo
      };
    }).filter(Boolean) as FornecedorRecomendado[];

    // Ordenar por score decrescente
    return fornecedoresProcessados.sort((a, b) => b.score_historico - a.score_historico);
  };

  const convidarFornecedoresAutomatico = async (
    projetoId: string, 
    fornecedoresSelecionados: FornecedorRecomendado[]
  ) => {
    try {
      // Criar convites para os fornecedores selecionados
      const convites = fornecedoresSelecionados.map(fornecedor => ({
        projeto_id: projetoId,
        fornecedor_id: fornecedor.id,
        fornecedor_nome: fornecedor.razao_social,
        fornecedor_email: fornecedor.email_principal,
        status_convite: 'enviado' as const,
        data_convite: new Date().toISOString(),
        token_acesso: generateAccessToken()
      }));

      const { error } = await supabase
        .from('participantes_sourcing')
        .insert(convites);

      if (error) throw error;

      // Registrar evento de convite automático
      console.log(`Convites enviados automaticamente para ${fornecedoresSelecionados.length} fornecedores`);
      
      return convites;
    } catch (error) {
      console.error('Erro ao convidar fornecedores:', error);
      throw error;
    }
  };

  const generateAccessToken = () => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  };

  return {
    fornecedoresRecomendados,
    loading,
    buscarRecomendacoes,
    convidarFornecedoresAutomatico
  };
};
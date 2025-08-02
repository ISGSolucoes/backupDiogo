import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface RequisicaoAgregacao {
  id: string;
  numero_requisicao: string;
  categoria: string;
  centro_custo: string;
  valor_estimado: number;
  data_aprovacao: string;
  itens: any[];
}

export interface EventoAgregado {
  categorias: string[];
  requisicoes: RequisicaoAgregacao[];
  valor_total: number;
  sugestao_tipo: 'cotacao' | 'leilao';
  prazo_sugerido: number;
}

export const useAgregacaoAutomatica = () => {
  const [requisicoesDisponiveis, setRequisicoesDisponiveis] = useState<RequisicaoAgregacao[]>([]);
  const [eventosAgregados, setEventosAgregados] = useState<EventoAgregado[]>([]);
  const [loading, setLoading] = useState(false);

  const buscarRequisicoesParaAgregacao = async () => {
    setLoading(true);
    try {
      // Buscar requisições aprovadas dos últimos 7 dias que ainda não foram para sourcing
      const { data: requisicoes, error } = await supabase
        .from('requisicoes')
        .select(`
          id,
          numero_requisicao,
          tipo,
          centro_custo,
          valor_estimado,
          data_aprovacao,
          itens_requisicao (
            id,
            descricao,
            categoria,
            quantidade,
            preco_estimado
          )
        `)
        .eq('status', 'aprovada')
        .gte('updated_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .is('cotacao_id', null);

      if (error) throw error;

      const requisicoesFormatadas = requisicoes?.map(req => ({
        id: req.id,
        numero_requisicao: req.numero_requisicao,
        categoria: req.tipo || 'Geral',
        centro_custo: req.centro_custo || '',
        valor_estimado: req.valor_estimado || 0,
        data_aprovacao: req.data_aprovacao,
        itens: req.itens_requisicao || []
      })) || [];

      setRequisicoesDisponiveis(requisicoesFormatadas);
      
      // Executar lógica de agregação automática
      const eventosAgregados = gerarAgregacoesAutomaticas(requisicoesFormatadas);
      setEventosAgregados(eventosAgregados);

    } catch (error) {
      console.error('Erro ao buscar requisições:', error);
    }
    setLoading(false);
  };

  const gerarAgregacoesAutomaticas = (requisicoes: RequisicaoAgregacao[]): EventoAgregado[] => {
    const agregacoesPorCategoria = new Map<string, RequisicaoAgregacao[]>();
    
    // Agrupar por categoria
    requisicoes.forEach(req => {
      const key = req.categoria;
      if (!agregacoesPorCategoria.has(key)) {
        agregacoesPorCategoria.set(key, []);
      }
      agregacoesPorCategoria.get(key)!.push(req);
    });

    const eventos: EventoAgregado[] = [];

    // Criar eventos agregados para categorias com múltiplas requisições
    agregacoesPorCategoria.forEach((reqs, categoria) => {
      if (reqs.length > 1) {
        const valorTotal = reqs.reduce((sum, req) => sum + req.valor_estimado, 0);
        const sugestaoTipo = valorTotal > 50000 ? 'leilao' : 'cotacao';
        const prazoSugerido = valorTotal > 100000 ? 10 : 7;

        eventos.push({
          categorias: [categoria],
          requisicoes: reqs,
          valor_total: valorTotal,
          sugestao_tipo: sugestaoTipo,
          prazo_sugerido: prazoSugerido
        });
      }
    });

    return eventos;
  };

  const criarEventoAutomatico = async (eventoAgregado: EventoAgregado) => {
    try {
      // Criar projeto de sourcing
      const { data: projeto, error: projetoError } = await supabase
        .from('projetos_sourcing')
        .insert({
          codigo_projeto: `AGR-${Date.now()}`,
          nome_projeto: `Evento Agregado - ${eventoAgregado.categorias.join(', ')}`,
          descricao: `Evento criado automaticamente agregando ${eventoAgregado.requisicoes.length} requisições`,
          tipo_evento: eventoAgregado.sugestao_tipo,
          tipo_aquisicao: 'agregada',
          opcao_leilao: 'nao_aplicavel',
          status: 'rascunho',
          departamento: 'Compras',
          proprietario_id: '00000000-0000-0000-0000-000000000000',
          regiao_compra: 'Nacional',
          criado_por: '00000000-0000-0000-0000-000000000000',
          gasto_base: eventoAgregado.valor_total,
          economia_esperada: eventoAgregado.valor_total * 0.1,
          moeda: 'BRL',
          prazo_entrega: eventoAgregado.prazo_sugerido
        })
        .select()
        .single();

      if (projetoError) throw projetoError;

      // Vincular requisições ao projeto (usando campo existente)
      const { error: vinculoError } = await supabase
        .from('requisicoes')
        .update({ cotacao_id: projeto.id })
        .in('id', eventoAgregado.requisicoes.map(r => r.id));

      if (vinculoError) throw vinculoError;

      // Criar itens do projeto baseados nas requisições
      const itensProposal = eventoAgregado.requisicoes.flatMap((req, reqIndex) => 
        req.itens.map((item, itemIndex) => ({
          projeto_id: projeto.id,
          sequencia: reqIndex * 100 + itemIndex + 1,
          descricao: item.descricao,
          categoria: item.categoria,
          quantidade: item.quantidade,
          unidade: 'UN',
          valor_estimado: item.preco_estimado
        }))
      );

      if (itensProposal.length > 0) {
        const { error: itensError } = await supabase
          .from('itens_sourcing')
          .insert(itensProposal);

        if (itensError) throw itensError;
      }

      return projeto;
    } catch (error) {
      console.error('Erro ao criar evento automático:', error);
      throw error;
    }
  };

  useEffect(() => {
    buscarRequisicoesParaAgregacao();
  }, []);

  return {
    requisicoesDisponiveis,
    eventosAgregados,
    loading,
    buscarRequisicoesParaAgregacao,
    criarEventoAutomatico
  };
};
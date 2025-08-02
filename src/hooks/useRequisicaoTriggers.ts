import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useRequisicaoTriggers = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Escutar mudanças nas requisições para detectar aprovações
    const channel = supabase
      .channel('requisicao-triggers')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'requisicoes',
          filter: 'status=eq.aprovada'
        },
        async (payload) => {
          const requisicao = payload.new;
          
          // Aplicar regras de negócio para decidir o fluxo
          if (requisicao.valor_estimado >= 1000) {
            // Valores acima de R$ 1.000 vão para sourcing
            toast({
              title: "🎯 Nova Solicitação de Sourcing",
              description: `Requisição ${requisicao.numero_requisicao} aprovada e enviada para Sourcing automaticamente.`,
              duration: 5000,
            });

            // Registrar evento no histórico
            await supabase
              .from('historico_requisicao')
              .insert({
                requisicao_id: requisicao.id,
                evento: 'passagem_bastao_sourcing',
                descricao: `Requisição automaticamente encaminhada para módulo de Sourcing (valor: R$ ${requisicao.valor_estimado?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})`,
                usuario_nome: 'Sistema Automático',
                origem: 'trigger_automatico'
              });

          } else if (requisicao.valor_estimado < 1000) {
            // Valores menores vão para 3-Bids and Buy
            toast({
              title: "⚡ Processo Rápido Ativado",
              description: `Requisição ${requisicao.numero_requisicao} direcionada para 3-Bids and Buy.`,
              duration: 5000,
            });

            await supabase
              .from('historico_requisicao')
              .insert({
                requisicao_id: requisicao.id,
                evento: 'passagem_bastao_3bids',
                descricao: `Requisição direcionada para processo 3-Bids and Buy (valor: R$ ${requisicao.valor_estimado?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})`,
                usuario_nome: 'Sistema Automático',
                origem: 'trigger_automatico'
              });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  return null; // Este hook é apenas para efeitos colaterais
};
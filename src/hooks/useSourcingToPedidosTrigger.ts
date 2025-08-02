import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSourcingToPedidosTrigger = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Escutar mudanças nos projetos de sourcing para detectar finalizações
    // O trigger do banco já cria o pedido automaticamente, só precisamos mostrar a notificação
    const channel = supabase
      .channel('sourcing-to-pedidos-trigger')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'projetos_sourcing',
          filter: 'status=eq.finalizado'
        },
        async (payload) => {
          const projeto = payload.new;
          
          try {
            const projetoNome = projeto.nome_projeto || projeto.codigo_projeto || `Projeto ${projeto.id}`;
            
            // Mostrar notificação - o pedido já foi criado pelo trigger do banco
            toast({
              title: "🏆 Sourcing Finalizado",
              description: `Pedido criado automaticamente do projeto ${projetoNome}`,
              duration: 5000,
            });

          } catch (error) {
            console.error('Erro ao processar finalização do sourcing:', error);
            toast({
              title: "Erro no Fluxo Automático", 
              description: "Falha no processamento automático do sourcing finalizado",
              variant: "destructive"
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
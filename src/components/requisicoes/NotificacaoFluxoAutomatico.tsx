import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Zap, CheckCircle, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface FluxoNotificacao {
  id: string;
  numero_requisicao: string;
  valor_estimado: number;
  destino: 'sourcing' | '3bids';
  timestamp: string;
}

export const NotificacaoFluxoAutomatico = () => {
  const [notificacoes, setNotificacoes] = useState<FluxoNotificacao[]>([]);
  const [mostrarNotificacao, setMostrarNotificacao] = useState(false);

  useEffect(() => {
    // Escutar mudanças nas requisições para detectar aprovações
    const channel = supabase
      .channel('fluxo-automatico-notificacoes')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'requisicoes',
          filter: 'status=eq.aprovada'
        },
        async (payload) => {
          const requisicao = payload.new;
          
          const novaNotificacao: FluxoNotificacao = {
            id: requisicao.id,
            numero_requisicao: requisicao.numero_requisicao,
            valor_estimado: requisicao.valor_estimado,
            destino: requisicao.valor_estimado >= 1000 ? 'sourcing' : '3bids',
            timestamp: new Date().toISOString()
          };

          setNotificacoes(prev => [novaNotificacao, ...prev.slice(0, 4)]);
          setMostrarNotificacao(true);

          // Auto-hide após 8 segundos
          setTimeout(() => {
            setMostrarNotificacao(false);
          }, 8000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const removerNotificacao = (id: string) => {
    setNotificacoes(prev => prev.filter(n => n.id !== id));
    if (notificacoes.length <= 1) {
      setMostrarNotificacao(false);
    }
  };

  if (!mostrarNotificacao || notificacoes.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm space-y-2">
      {notificacoes.slice(0, 3).map((notificacao) => (
        <Card 
          key={notificacao.id}
          className="border-green-200 bg-green-50 shadow-lg animate-in slide-in-from-right-full duration-300"
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Fluxo Automático Ativado
                  </span>
                </div>
                
                <p className="text-xs text-green-700 mb-2">
                  <strong>{notificacao.numero_requisicao}</strong> foi direcionada automaticamente
                </p>
                
                <div className="flex items-center gap-2">
                  {notificacao.destino === 'sourcing' ? (
                    <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Para Sourcing
                    </Badge>
                  ) : (
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                      <Zap className="h-3 w-3 mr-1" />
                      3-Bids & Buy
                    </Badge>
                  )}
                  <span className="text-xs text-green-600">
                    R$ {notificacao.valor_estimado.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2
                    })}
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => removerNotificacao(notificacao.id)}
                className="text-green-600 hover:text-green-800 p-1"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
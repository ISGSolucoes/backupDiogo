import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, User, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface HistoricoItem {
  timestamp: string;
  acao: string;
  usuario_nome: string;
  detalhes?: string;
}

interface HistoricoPedidoProps {
  pedidoId: string;
}

export function HistoricoPedido({ pedidoId }: HistoricoPedidoProps) {
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarHistorico();
  }, [pedidoId]);

  const carregarHistorico = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pedidos')
        .select('historico_acoes')
        .eq('id', pedidoId)
        .single();

      if (error) throw error;

      const acoes = data?.historico_acoes || [];
      setHistorico(Array.isArray(acoes) ? acoes as any as HistoricoItem[] : []);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      setHistorico([]);
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (timestamp: string) => {
    try {
      return format(new Date(timestamp), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch {
      return timestamp;
    }
  };

  const getIconeAcao = (acao: string) => {
    if (acao.toLowerCase().includes('status')) {
      return <Badge className="w-2 h-2 p-0 bg-blue-500" />;
    }
    if (acao.toLowerCase().includes('criado') || acao.toLowerCase().includes('atualizado')) {
      return <FileText className="w-4 h-4 text-green-500" />;
    }
    return <Clock className="w-4 h-4 text-gray-500" />;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Ações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Histórico de Ações
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          {historico.length > 0 ? (
            <div className="space-y-4">
              {historico.map((item, index) => (
                <div key={index} className="flex gap-3 pb-3 border-b last:border-b-0">
                  <div className="flex-shrink-0 mt-1">
                    {getIconeAcao(item.acao)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{item.acao}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="w-3 h-3" />
                      <span>{item.usuario_nome}</span>
                      <span>•</span>
                      <span>{formatarData(item.timestamp)}</span>
                    </div>
                    {item.detalhes && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.detalhes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Nenhuma ação registrada</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
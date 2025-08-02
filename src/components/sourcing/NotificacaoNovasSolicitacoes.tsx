import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, FileText, ArrowRight } from 'lucide-react';
import { useSourcingRequests } from '@/hooks/useSourcingRequests';

export function NotificacaoNovasSolicitacoes() {
  const { solicitacoes } = useSourcingRequests();
  const [novasSolicitacoes, setNovasSolicitacoes] = useState(0);
  const [mostrarNotificacao, setMostrarNotificacao] = useState(false);

  useEffect(() => {
    const novas = solicitacoes.filter(s => s.status === 'nova').length;
    
    if (novas > novasSolicitacoes && novasSolicitacoes > 0) {
      setMostrarNotificacao(true);
      // Auto-hide after 10 seconds
      setTimeout(() => setMostrarNotificacao(false), 10000);
    }
    
    setNovasSolicitacoes(novas);
  }, [solicitacoes, novasSolicitacoes]);

  if (!mostrarNotificacao || novasSolicitacoes === 0) {
    return null;
  }

  return (
    <Alert className="border-blue-200 bg-blue-50">
      <Bell className="h-4 w-4 text-blue-600" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span>
            <Badge variant="destructive" className="mr-2">
              {novasSolicitacoes}
            </Badge>
            nova(s) solicitação(ões) de sourcing recebida(s) do módulo de Requisições
          </span>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setMostrarNotificacao(false)}
        >
          <ArrowRight className="h-4 w-4 mr-1" />
          Ver Solicitações
        </Button>
      </AlertDescription>
    </Alert>
  );
}
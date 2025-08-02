import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Clock, 
  Send, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  ExternalLink,
  HelpCircle 
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { usePortalIntegration } from "@/hooks/usePortalIntegration";
import { Pedido } from "@/types/pedido";

interface PortalIntegrationStatusProps {
  pedido: Pedido;
  onReenviar?: () => void;
}

export const PortalIntegrationStatus: React.FC<PortalIntegrationStatusProps> = ({ 
  pedido, 
  onReenviar 
}) => {
  const { 
    metricas, 
    isLoading,
    enviarNotificacao,
    testarConexao
  } = usePortalIntegration();

  // Mock data para demonstração - ajustado para funcionar com hook atual
  const statusPortal = {
    status_integracao: pedido.status === 'enviado' ? 'sucesso' : 'pendente',
    portal_pedido_id: pedido.status === 'enviado' ? `PRT-${pedido.numero_pedido}` : null,
    data_tentativa: pedido.status === 'enviado' ? new Date().toISOString() : null,
    tentativa: 1,
    erro_integracao: null,
    portal_url: pedido.status === 'enviado' ? `https://portal.fornecedor.com/pedido/${pedido.id}` : null
  };
  
  const carregandoStatus = isLoading;
  const isEnviando = enviarNotificacao.isPending;
  const isReenviando = false;

  const podeEnviar = (pedido: Pedido) => pedido.status === 'aprovado';
  const podeReenviar = () => statusPortal.status_integracao === 'erro';

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pendente':
        return { label: 'Aguardando Envio', color: 'orange' };
      case 'sucesso':
        return { label: 'Enviado com Sucesso', color: 'green' };
      case 'erro':
        return { label: 'Erro no Envio', color: 'red' };
      default:
        return { label: 'Status Desconhecido', color: 'gray' };
    }
  };

  const enviarParaPortal = async (config: any) => {
    await enviarNotificacao.mutateAsync({
      fornecedorId: pedido.fornecedor_id,
      tipo: 'pedido',
      mensagem: `Pedido ${pedido.numero_pedido} enviado para o portal`
    });
  };

  const reenviarParaPortal = async () => {
    await enviarNotificacao.mutateAsync({
      fornecedorId: pedido.fornecedor_id,
      tipo: 'pedido', 
      mensagem: `Pedido ${pedido.numero_pedido} reenviado para o portal`
    });
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ElementType> = {
      'pendente': Clock,
      'enviando': Send,
      'sucesso': CheckCircle,
      'erro': XCircle,
      'timeout': AlertTriangle
    };
    return icons[status] || HelpCircle;
  };

  const getStatusVariant = (status: string) => {
    const variants: Record<string, any> = {
      'pendente': 'secondary',
      'enviando': 'default',
      'sucesso': 'default',
      'erro': 'destructive',
      'timeout': 'secondary'
    };
    return variants[status] || 'secondary';
  };

  const handleEnviarParaPortal = () => {
    enviarParaPortal({
      webhook_callback: `${window.location.origin}/api/webhooks/pedidos`,
      prazo_resposta_dias: 5,
      permite_alteracao: true,
      permite_questionamento: true
    });
  };

  if (!pedido.data_envio_portal && !podeEnviar(pedido)) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            <span>Aguardando aprovação para envio ao portal</span>
          </div>
        </div>
      </Card>
    );
  }

  if (!pedido.data_envio_portal && podeEnviar(pedido)) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            <span>Pronto para envio ao portal de negócios</span>
          </div>
          <Button 
            size="sm" 
            onClick={handleEnviarParaPortal}
            disabled={isEnviando}
            className="gap-2"
          >
            {isEnviando ? (
              <RefreshCw className="h-3 w-3 animate-spin" />
            ) : (
              <Send className="h-3 w-3" />
            )}
            {isEnviando ? 'Enviando...' : 'Enviar Agora'}
          </Button>
        </div>
      </Card>
    );
  }

  if (carregandoStatus) {
    return (
      <Card className="p-4">
        <div className="flex items-center text-muted-foreground">
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          <span>Carregando status da integração...</span>
        </div>
      </Card>
    );
  }

  const statusInfo = getStatusInfo(statusPortal?.status_integracao);
  const StatusIcon = getStatusIcon(statusPortal?.status_integracao || 'pendente');

  return (
    <Card className="p-4">
      <div className="space-y-3">
        {/* Status Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={getStatusVariant(statusPortal?.status_integracao || 'pendente')}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusInfo.label}
            </Badge>
            {statusPortal?.portal_pedido_id && (
              <span className="text-sm text-muted-foreground">
                ID: {statusPortal.portal_pedido_id}
              </span>
            )}
          </div>
          
          {statusPortal?.status_integracao === 'erro' && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => reenviarParaPortal()}
              disabled={isReenviando}
              className="gap-2"
            >
              {isReenviando ? (
                <RefreshCw className="h-3 w-3 animate-spin" />
              ) : (
                <RefreshCw className="h-3 w-3" />
              )}
              {isReenviando ? 'Reenviando...' : 'Reenviar'}
            </Button>
          )}
        </div>

        {/* Detalhes */}
        {statusPortal?.data_tentativa && (
          <div className="text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Última tentativa:</span>
              <span>
                {format(new Date(statusPortal.data_tentativa), "dd/MM/yyyy HH:mm", { locale: ptBR })}
              </span>
            </div>
            {statusPortal.tentativa > 1 && (
              <div className="flex justify-between">
                <span>Tentativas:</span>
                <span>{statusPortal.tentativa}</span>
              </div>
            )}
          </div>
        )}

        {/* Erro */}
        {statusPortal?.erro_integracao && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Erro na Integração</AlertTitle>
            <AlertDescription>{statusPortal.erro_integracao}</AlertDescription>
          </Alert>
        )}

        {/* Status de Sucesso */}
        {statusPortal?.status_integracao === 'sucesso' && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Pedido Enviado com Sucesso</AlertTitle>
            <AlertDescription>
              O pedido foi enviado para o portal de negócios e está aguardando resposta.
            </AlertDescription>
          </Alert>
        )}

        {/* Link para Portal */}
        {statusPortal?.portal_url && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(statusPortal.portal_url, '_blank')}
            className="gap-2"
          >
            <ExternalLink className="h-3 w-3" />
            Ver no Portal
          </Button>
        )}
      </div>
    </Card>
  );
};
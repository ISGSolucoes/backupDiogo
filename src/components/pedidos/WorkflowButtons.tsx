import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  CheckCircle, 
  XCircle, 
  FileText, 
  AlertCircle,
  Clock
} from "lucide-react";
import { Pedido, StatusPedido } from "@/types/pedido";
import { toast } from "sonner";

interface WorkflowButtonsProps {
  pedido: Pedido;
  onStatusChange: (novoStatus: StatusPedido, justificativa?: string) => void;
  onGerarPDF?: () => void;
  onEnviarPortal?: () => void;
}

export function WorkflowButtons({ 
  pedido, 
  onStatusChange, 
  onGerarPDF, 
  onEnviarPortal 
}: WorkflowButtonsProps) {
  
  const getStatusInfo = (status: StatusPedido) => {
    const statusMap = {
      'rascunho': { label: 'Rascunho', variant: 'secondary' as const, icon: Clock },
      'aguardando_aprovacao': { label: 'Aguardando Aprovação', variant: 'default' as const, icon: Clock },
      'aprovado': { label: 'Aprovado', variant: 'default' as const, icon: CheckCircle },
      'rejeitado': { label: 'Rejeitado', variant: 'destructive' as const, icon: XCircle },
      'enviado': { label: 'Enviado', variant: 'default' as const, icon: Send },
      'visualizado': { label: 'Visualizado', variant: 'outline' as const, icon: AlertCircle },
      'confirmado': { label: 'Confirmado', variant: 'default' as const, icon: CheckCircle },
      'cancelado': { label: 'Cancelado', variant: 'destructive' as const, icon: XCircle }
    };
    return statusMap[status] || { label: status, variant: 'secondary' as const, icon: Clock };
  };

  const getAvailableActions = () => {
    const actions = [];
    
    switch (pedido.status) {
      case 'rascunho':
        actions.push({
          label: 'Enviar para Aprovação',
          action: () => onStatusChange('aguardando_aprovacao'),
          variant: 'default' as const,
          icon: Send
        });
        actions.push({
          label: 'Cancelar',
          action: () => onStatusChange('cancelado', 'Pedido cancelado pelo usuário'),
          variant: 'outline' as const,
          icon: XCircle
        });
        break;
        
      case 'aguardando_aprovacao':
        actions.push({
          label: 'Aprovar',
          action: () => onStatusChange('aprovado'),
          variant: 'default' as const,
          icon: CheckCircle
        });
        actions.push({
          label: 'Rejeitar',
          action: () => onStatusChange('rejeitado', 'Pedido rejeitado na aprovação'),
          variant: 'destructive' as const,
          icon: XCircle
        });
        break;
        
      case 'aprovado':
        actions.push({
          label: 'Enviar Pedido',
          action: () => onStatusChange('enviado'),
          variant: 'default' as const,
          icon: Send
        });
        if (onGerarPDF) {
          actions.push({
            label: 'Gerar PDF',
            action: onGerarPDF,
            variant: 'outline' as const,
            icon: FileText
          });
        }
        break;
        
      case 'enviado':
        if (onEnviarPortal) {
          actions.push({
            label: 'Reenviar ao Portal',
            action: onEnviarPortal,
            variant: 'outline' as const,
            icon: Send
          });
        }
        if (onGerarPDF) {
          actions.push({
            label: 'Gerar PDF',
            action: onGerarPDF,
            variant: 'outline' as const,
            icon: FileText
          });
        }
        break;
        
      case 'visualizado':
        // Aguardando resposta do fornecedor
        break;
        
      default:
        break;
    }
    
    return actions;
  };

  const statusInfo = getStatusInfo(pedido.status);
  const StatusIcon = statusInfo.icon;
  const availableActions = getAvailableActions();

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg bg-muted/50">
      <div className="flex items-center gap-3">
        <StatusIcon className="h-5 w-5" />
        <span className="font-medium">Status Atual:</span>
        <Badge variant={statusInfo.variant}>
          {statusInfo.label}
        </Badge>
      </div>
      
      {availableActions.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-muted-foreground">Ações Disponíveis:</span>
          <div className="flex flex-wrap gap-2">
            {availableActions.map((action, index) => {
              const ActionIcon = action.icon;
              return (
                <Button
                  key={index}
                  variant={action.variant}
                  size="sm"
                  onClick={action.action}
                  className="flex items-center gap-2"
                >
                  <ActionIcon className="h-4 w-4" />
                  {action.label}
                </Button>
              );
            })}
          </div>
        </div>
      )}
      
      {pedido.status === 'visualizado' && (
        <div className="text-sm text-muted-foreground">
          <AlertCircle className="h-4 w-4 inline mr-2" />
          Aguardando resposta do fornecedor via portal
        </div>
      )}
    </div>
  );
}
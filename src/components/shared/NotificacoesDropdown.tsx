import { Bell, Check, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useNotificacoes } from "@/hooks/useNotificacoes";
import { useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface NotificacoesDropdownProps {
  usuarioId?: string;
}

export const NotificacoesDropdown = ({ usuarioId }: NotificacoesDropdownProps) => {
  const { 
    notificacoes, 
    naoLidas, 
    loading, 
    buscarNotificacoes, 
    marcarComoLida, 
    marcarTodasComoLidas 
  } = useNotificacoes();

  useEffect(() => {
    if (usuarioId) {
      buscarNotificacoes(usuarioId);
    }
  }, [usuarioId]);

  const getNotificacaoIcon = (tipo: string) => {
    switch (tipo) {
      case 'requisicao_aprovada':
        return '✅';
      case 'evento_criado':
        return '🎯';
      case 'proposta_recebida':
        return '📝';
      case 'pedido_confirmado':
        return '📦';
      case 'alerta_prazo':
        return '⚠️';
      default:
        return '📢';
    }
  };

  const formatarTempo = (dataString: string) => {
    try {
      return formatDistanceToNow(new Date(dataString), {
        addSuffix: true,
        locale: ptBR
      });
    } catch {
      return 'agora';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {naoLidas > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {naoLidas > 99 ? '99+' : naoLidas}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notificações</span>
          {naoLidas > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={marcarTodasComoLidas}
              className="h-6 px-2 text-xs"
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Marcar todas como lidas
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {loading ? (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground mt-2">Carregando...</p>
          </div>
        ) : notificacoes.length === 0 ? (
          <div className="p-4 text-center">
            <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Nenhuma notificação</p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {notificacoes.slice(0, 10).map((notificacao) => (
              <DropdownMenuItem
                key={notificacao.id}
                className={`p-3 cursor-pointer ${!notificacao.lida ? 'bg-primary/5' : ''}`}
                onClick={() => {
                  if (!notificacao.lida) {
                    marcarComoLida(notificacao.id);
                  }
                  if (notificacao.acao_disponivel?.tipo === 'link') {
                    // TODO: Implementar navegação
                    console.log('Navegar para:', notificacao.acao_disponivel.url);
                  }
                }}
              >
                <div className="flex items-start gap-3 w-full">
                  <span className="text-lg flex-shrink-0 mt-0.5">
                    {getNotificacaoIcon(notificacao.tipo)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm truncate">
                        {notificacao.titulo}
                      </p>
                      {!notificacao.lida && (
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-1 line-clamp-2">
                      {notificacao.mensagem}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatarTempo(notificacao.created_at)}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}
        
        {notificacoes.length > 10 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-sm text-primary">
              Ver todas as notificações
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
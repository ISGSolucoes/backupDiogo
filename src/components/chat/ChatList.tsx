
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, FileText, ShoppingBag, Building, MessageCircle } from "lucide-react";
import { Chat, FiltroChat, ContextoChat } from "@/types/mensagens";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ChatListProps {
  chats: Chat[];
  busca: string;
  filtros: FiltroChat;
  onSelecionarChat: (chat: Chat) => void;
}

export const ChatList = ({ chats, busca, filtros, onSelecionarChat }: ChatListProps) => {
  const getIconeContexto = (contexto: ContextoChat) => {
    const icons = {
      gestao_fornecedores: Building,
      cotacoes: ShoppingBag,
      propostas: FileText,
      documentos: FileText,
      pedidos_contratos: FileText,
      assistente_virtual: MessageCircle
    };
    return icons[contexto];
  };

  const getCorContexto = (contexto: ContextoChat) => {
    const cores = {
      gestao_fornecedores: "bg-blue-100 text-blue-700",
      cotacoes: "bg-green-100 text-green-700", 
      propostas: "bg-orange-100 text-orange-700",
      documentos: "bg-purple-100 text-purple-700",
      pedidos_contratos: "bg-red-100 text-red-700",
      assistente_virtual: "bg-indigo-100 text-indigo-700"
    };
    return cores[contexto];
  };

  const filtrarChats = (chats: Chat[]) => {
    return chats.filter(chat => {
      // Filtro por busca
      if (busca && !chat.titulo.toLowerCase().includes(busca.toLowerCase())) {
        return false;
      }

      // Filtro por contexto
      if (filtros.contexto && filtros.contexto.length > 0 && !filtros.contexto.includes(chat.contexto)) {
        return false;
      }

      // Filtro por não lidas
      if (filtros.naoLidas && chat.mensagensNaoLidas === 0) {
        return false;
      }

      return true;
    });
  };

  const chatsFilterados = filtrarChats(chats);

  if (chatsFilterados.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center text-slate-500">
          <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Nenhuma conversa encontrada</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-2">
        {chatsFilterados.map((chat) => {
          const IconeContexto = getIconeContexto(chat.contexto);
          const fornecedor = chat.participantes.find(p => p.tipo === 'fornecedor');
          const ultimaAtualizacao = formatDistanceToNow(new Date(chat.criadoEm), {
            addSuffix: true,
            locale: ptBR
          });

          return (
            <Button
              key={chat.id}
              variant="ghost"
              className="w-full h-auto p-3 mb-2 justify-start hover:bg-slate-50"
              onClick={() => onSelecionarChat(chat)}
            >
              <div className="flex items-start gap-3 w-full">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={getCorContexto(chat.contexto)}>
                      <IconeContexto className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  {chat.mensagensNaoLidas > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full min-w-5 h-5 flex items-center justify-center text-xs p-0">
                      {chat.mensagensNaoLidas}
                    </Badge>
                  )}
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={cn(
                      "text-sm font-medium truncate",
                      chat.mensagensNaoLidas > 0 ? "text-slate-900" : "text-slate-600"
                    )}>
                      {chat.titulo}
                    </h4>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="h-3 w-3" />
                      <span>{ultimaAtualizacao}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 truncate">
                      {fornecedor?.nome || "Sistema"}
                    </span>
                    {chat.participantes.some(p => p.online && p.tipo !== 'sistema') && (
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                    )}
                  </div>

                  {chat.ultimaMensagem && (
                    <p className="text-xs text-slate-400 truncate mt-1">
                      {chat.ultimaMensagem.conteudo}
                    </p>
                  )}
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </ScrollArea>
  );
};

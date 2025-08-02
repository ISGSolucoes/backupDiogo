
import React, { useState } from "react";
import { MessageCircle, X, Filter, Search, Minimize2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Chat, ContextoChat, FiltroChat } from "@/types/mensagens";
import { ChatList } from "./ChatList";
import { ChatWindow } from "./ChatWindow";
import { FiltrosChat } from "./FiltrosChat";

interface ChatContainerProps {
  fornecedorId?: string;
  contextoInicial?: ContextoChat;
  referenciaId?: string;
}

export const ChatContainer = ({ 
  fornecedorId,
  contextoInicial = 'assistente_virtual',
  referenciaId 
}: ChatContainerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [chatSelecionado, setChatSelecionado] = useState<Chat | null>(null);
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);
  const [filtros, setFiltros] = useState<FiltroChat>({});
  const [busca, setBusca] = useState("");

  // Mock data - será substituído por dados reais da API
  const [chats] = useState<Chat[]>([
    {
      id: "chat-001",
      titulo: "Cotação #2389 - Equipamentos TI",
      contexto: "cotacoes",
      participantes: [
        { id: "user-1", nome: "João Silva", tipo: "comprador", online: true },
        { id: "forn-1", nome: "TechSupply Solutions", tipo: "fornecedor", online: false }
      ],
      mensagensNaoLidas: 2,
      ativo: true,
      criadoEm: "2024-01-15T10:00:00Z",
      referenciaId: "cot-2389"
    },
    {
      id: "chat-002", 
      titulo: "Documentos Pendentes",
      contexto: "documentos",
      participantes: [
        { id: "user-1", nome: "Ana Lima", tipo: "comprador", online: true },
        { id: "forn-1", nome: "TechSupply Solutions", tipo: "fornecedor", online: false }
      ],
      mensagensNaoLidas: 0,
      ativo: true,
      criadoEm: "2024-01-14T14:30:00Z"
    },
    {
      id: "chat-003",
      titulo: "Assistente Virtual",
      contexto: "assistente_virtual", 
      participantes: [
        { id: "ia-re", nome: "IA Rê", tipo: "ia", online: true },
        { id: "forn-1", nome: "TechSupply Solutions", tipo: "fornecedor", online: false }
      ],
      mensagensNaoLidas: 1,
      ativo: true,
      criadoEm: "2024-01-14T09:00:00Z"
    }
  ]);

  const totalMensagensNaoLidas = chats.reduce((total, chat) => total + chat.mensagensNaoLidas, 0);

  const handleAbrirChat = (chat: Chat) => {
    setChatSelecionado(chat);
    setIsMinimized(false);
  };

  const handleFecharChat = () => {
    setChatSelecionado(null);
  };

  const contextoLabels: Record<ContextoChat, string> = {
    gestao_fornecedores: "Gestão de Fornecedores",
    cotacoes: "Cotações",
    propostas: "Propostas", 
    documentos: "Documentos",
    pedidos_contratos: "Pedidos/Contratos",
    assistente_virtual: "IA Rê"
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-14 w-14 bg-blue-600 hover:bg-blue-700 shadow-lg relative"
        >
          <MessageCircle className="h-6 w-6" />
          {totalMensagensNaoLidas > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full min-w-6 h-6 flex items-center justify-center text-xs">
              {totalMensagensNaoLidas > 99 ? "99+" : totalMensagensNaoLidas}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={cn(
        "transition-all duration-300 shadow-xl",
        isMinimized ? "w-80 h-16" : "w-96 h-[600px]"
      )}>
        {/* Cabeçalho */}
        <div className="flex items-center justify-between p-3 border-b bg-blue-50">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-sm">
              {chatSelecionado ? chatSelecionado.titulo : "Mensagens"}
            </span>
            {chatSelecionado && (
              <Badge variant="outline" className="text-xs">
                {contextoLabels[chatSelecionado.contexto]}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[calc(600px-64px)]">
            {!chatSelecionado ? (
              <>
                {/* Busca e Filtros */}
                <div className="p-3 border-b space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                      <Input
                        placeholder="Buscar conversas..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        className="pl-9 h-9"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => setFiltrosAbertos(!filtrosAbertos)}
                    >
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {filtrosAbertos && (
                    <FiltrosChat
                      filtros={filtros}
                      onFiltrosChange={setFiltros}
                      onFechar={() => setFiltrosAbertos(false)}
                    />
                  )}
                </div>

                {/* Lista de Chats */}
                <ChatList
                  chats={chats}
                  busca={busca}
                  filtros={filtros}
                  onSelecionarChat={handleAbrirChat}
                />
              </>
            ) : (
              <ChatWindow
                chat={chatSelecionado}
                onVoltar={handleFecharChat}
                onFechar={() => setIsOpen(false)}
              />
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
};

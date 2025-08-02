
import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Paperclip, Smile, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Chat, Mensagem, AcaoMensagem } from "@/types/mensagens";
import { MensagemBubble } from "./MensagemBubble";
import { IAResugestoes } from "./IAResugestoes";
import { RespostasRapidas } from "./RespostasRapidas";

interface ChatWindowProps {
  chat: Chat;
  onVoltar: () => void;
  onFechar: () => void;
}

export const ChatWindow = ({ chat, onVoltar, onFechar }: ChatWindowProps) => {
  const [novaMensagem, setNovaMensagem] = useState("");
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock data - será substituído por dados reais da API
  useEffect(() => {
    const mockMensagens: Mensagem[] = [
      {
        id: "msg-1",
        chatId: chat.id,
        remetente: { id: "user-1", nome: "João Silva", tipo: "comprador", online: true },
        tipo: "texto",
        conteudo: "Olá! Conseguimos uma condição melhor com outro fornecedor. Você consegue revisar sua proposta?",
        timestamp: "2024-01-15T14:22:00Z",
        status: "lida",
        contexto: chat.contexto
      },
      {
        id: "msg-2", 
        chatId: chat.id,
        remetente: { id: "forn-1", nome: "TechSupply Solutions", tipo: "fornecedor", online: false },
        tipo: "texto",
        conteudo: "Claro! Posso oferecer 5% de desconto adicional. Segue nova proposta em anexo.",
        timestamp: "2024-01-15T14:45:00Z",
        status: "lida",
        contexto: chat.contexto,
        anexos: [{
          id: "anexo-1",
          nome: "nova_proposta_revisada.xlsx",
          tipo: "application/xlsx",
          tamanho: 156789,
          url: "#"
        }]
      },
      {
        id: "msg-3",
        chatId: chat.id,
        remetente: { id: "ia-re", nome: "IA Rê", tipo: "ia", online: true },
        tipo: "acao",
        conteudo: "Nova proposta recebida! Deseja confirmar como proposta final?",
        timestamp: "2024-01-15T14:46:00Z", 
        status: "entregue",
        contexto: chat.contexto,
        acoes: [
          { id: "acao-1", texto: "Confirmar Proposta Final", tipo: "primary", acao: "confirmar_proposta" },
          { id: "acao-2", texto: "Abrir Nova Rodada", tipo: "secondary", acao: "nova_rodada" }
        ]
      }
    ];
    setMensagens(mockMensagens);
  }, [chat.id, chat.contexto]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [mensagens]);

  const handleEnviarMensagem = () => {
    if (!novaMensagem.trim()) return;

    const novaMensagemObj: Mensagem = {
      id: `msg-${Date.now()}`,
      chatId: chat.id,
      remetente: { id: "forn-1", nome: "TechSupply Solutions", tipo: "fornecedor", online: true },
      tipo: "texto",
      conteudo: novaMensagem,
      timestamp: new Date().toISOString(),
      status: "enviada",
      contexto: chat.contexto
    };

    setMensagens(prev => [...prev, novaMensagemObj]);
    setNovaMensagem("");
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEnviarMensagem();
    }
  };

  const handleExecutarAcao = (acao: AcaoMensagem) => {
    console.log('Executando ação:', acao);
    // Aqui seria implementada a lógica real da ação
  };

  const handleRespostaRapida = (resposta: string) => {
    setNovaMensagem(resposta);
    inputRef.current?.focus();
  };

  const fornecedor = chat.participantes.find(p => p.tipo === 'fornecedor');
  const isIA = chat.contexto === 'assistente_virtual';

  return (
    <div className="flex flex-col h-full">
      {/* Cabeçalho do Chat */}
      <div className="flex items-center gap-3 p-3 border-b bg-slate-50">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onVoltar}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-blue-100 text-blue-700">
            {isIA ? "R" : fornecedor?.nome?.charAt(0) || "F"}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium truncate">
            {isIA ? "IA Rê - Assistente Virtual" : fornecedor?.nome}
          </h3>
          <p className="text-xs text-slate-500">
            {isIA ? "Online 24/7" : fornecedor?.online ? "Online" : "Offline"}
          </p>
        </div>

        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      {/* Área de Mensagens */}
      <ScrollArea className="flex-1 p-3" ref={scrollRef}>
        <div className="space-y-3">
          {mensagens.map((mensagem) => (
            <MensagemBubble
              key={mensagem.id}
              mensagem={mensagem}
              onExecutarAcao={handleExecutarAcao}
            />
          ))}
        </div>
      </ScrollArea>

      {/* Respostas Rápidas */}
      <RespostasRapidas
        contexto={chat.contexto}
        onSelecionarResposta={handleRespostaRapida}
      />

      {/* Sugestões da IA */}
      {isIA && (
        <IAResugestoes
          contexto={chat.contexto}
          referenciaId={chat.referenciaId}
        />
      )}

      {/* Input de Mensagem */}
      <div className="border-t p-3">
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={novaMensagem}
              onChange={(e) => setNovaMensagem(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="pr-10"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            onClick={handleEnviarMensagem}
            disabled={!novaMensagem.trim()}
            className="h-9 w-9 p-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

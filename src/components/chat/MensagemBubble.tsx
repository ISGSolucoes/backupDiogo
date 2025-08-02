
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText } from "lucide-react";
import { Mensagem, AcaoMensagem } from "@/types/mensagens";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MensagemBubbleProps {
  mensagem: Mensagem;
  onExecutarAcao: (acao: AcaoMensagem) => void;
}

export const MensagemBubble = ({ mensagem, onExecutarAcao }: MensagemBubbleProps) => {
  const isPropriaMessage = mensagem.remetente.tipo === 'fornecedor';
  const isIA = mensagem.remetente.tipo === 'ia';
  const isSistema = mensagem.remetente.tipo === 'sistema';

  const getAvatarClass = () => {
    if (isIA) return "bg-indigo-100 text-indigo-700";
    if (isSistema) return "bg-slate-100 text-slate-700";
    if (isPropriaMessage) return "bg-blue-100 text-blue-700";
    return "bg-green-100 text-green-700";
  };

  const getBubbleClass = () => {
    if (isIA) return "bg-indigo-50 border-indigo-200";
    if (isSistema) return "bg-slate-50 border-slate-200";
    if (isPropriaMessage) return "bg-blue-50 border-blue-200";
    return "bg-green-50 border-green-200";
  };

  const formatarTamanhoArquivo = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const tempoRelativo = formatDistanceToNow(new Date(mensagem.timestamp), {
    addSuffix: true,
    locale: ptBR
  });

  return (
    <div className={cn(
      "flex gap-3 max-w-[85%]",
      isPropriaMessage ? "ml-auto flex-row-reverse" : ""
    )}>
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback className={getAvatarClass()}>
          {isIA ? "R" : mensagem.remetente.nome.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <div className={cn(
        "rounded-lg border p-3 shadow-sm",
        getBubbleClass(),
        isPropriaMessage ? "rounded-br-sm" : "rounded-bl-sm"
      )}>
        {/* Cabeçalho da mensagem */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-slate-700">
            {mensagem.remetente.nome}
          </span>
          <span className="text-xs text-slate-500">{tempoRelativo}</span>
          {mensagem.importante && (
            <Badge variant="destructive" className="text-xs">Importante</Badge>
          )}
        </div>

        {/* Conteúdo da mensagem */}
        <div className="text-sm text-slate-800 mb-2">
          {mensagem.conteudo}
        </div>

        {/* Anexos */}
        {mensagem.anexos && mensagem.anexos.length > 0 && (
          <div className="space-y-2 mb-3">
            {mensagem.anexos.map((anexo) => (
              <div key={anexo.id} className="flex items-center gap-2 p-2 bg-white rounded border">
                <FileText className="h-4 w-4 text-slate-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{anexo.nome}</p>
                  <p className="text-xs text-slate-500">{formatarTamanhoArquivo(anexo.tamanho)}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Ações */}
        {mensagem.acoes && mensagem.acoes.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {mensagem.acoes.map((acao) => (
              <Button
                key={acao.id}
                variant={acao.tipo === 'primary' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onExecutarAcao(acao)}
                className="text-xs"
              >
                {acao.texto}
              </Button>
            ))}
          </div>
        )}

        {/* Prazo */}
        {mensagem.prazoVencimento && (
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
            <span className="font-medium">Prazo:</span> {mensagem.prazoVencimento}
          </div>
        )}

        {/* Status da mensagem */}
        <div className="flex justify-end mt-2">
          <Badge variant="outline" className="text-xs">
            {mensagem.status === 'enviada' && 'Enviada'}
            {mensagem.status === 'entregue' && 'Entregue'} 
            {mensagem.status === 'lida' && 'Lida'}
            {mensagem.status === 'respondida' && 'Respondida'}
          </Badge>
        </div>
      </div>
    </div>
  );
};

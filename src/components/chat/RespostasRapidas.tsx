
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ContextoChat } from "@/types/mensagens";

interface RespostasRapidasProps {
  contexto: ContextoChat;
  onSelecionarResposta: (resposta: string) => void;
}

export const RespostasRapidas = ({ contexto, onSelecionarResposta }: RespostasRapidasProps) => {
  const getRespostasRapidas = (contexto: ContextoChat): string[] => {
    const respostas = {
      gestao_fornecedores: [
        "Documentos atualizados com sucesso",
        "Solicitando prazo adicional",
        "Informações enviadas por e-mail"
      ],
      cotacoes: [
        "Proposta enviada",
        "Preciso de mais tempo",
        "Não consigo atender esta cotação",
        "Proposta revisada em anexo"
      ],
      propostas: [
        "Proposta aceita",
        "Solicito reunião para negociação",
        "Condições não atendem",
        "Proposta final enviada"
      ],
      documentos: [
        "Documento enviado",
        "Solicitando prazo para envio",
        "Documento em análise jurídica",
        "Certificado renovado"
      ],
      pedidos_contratos: [
        "Pedido confirmado",
        "Prazo de entrega confirmado",
        "Atraso na entrega",
        "Mercadoria despachada"
      ],
      assistente_virtual: [
        "Como posso ajudar?",
        "Preciso de suporte",
        "Onde encontro isso?",
        "Explicar procedimento"
      ]
    };
    
    return respostas[contexto] || [];
  };

  const respostasRapidas = getRespostasRapidas(contexto);

  if (respostasRapidas.length === 0) return null;

  return (
    <div className="border-t p-2 bg-slate-50">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-medium text-slate-600">Respostas rápidas:</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {respostasRapidas.map((resposta, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="h-6 text-xs px-2"
            onClick={() => onSelecionarResposta(resposta)}
          >
            {resposta}
          </Button>
        ))}
      </div>
    </div>
  );
};

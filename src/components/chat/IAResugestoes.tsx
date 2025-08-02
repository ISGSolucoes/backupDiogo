
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, ExternalLink, FileText, ShoppingBag, X } from "lucide-react";
import { ContextoChat } from "@/types/mensagens";

interface IAReugestoesProps {
  contexto: ContextoChat;
  referenciaId?: string;
}

export const IAResugestoes = ({ contexto, referenciaId }: IAReugestoesProps) => {
  const [alertasFechados, setAlertasFechados] = useState<string[]>([]);

  const getSugestoes = (contexto: ContextoChat) => {
    const sugestoes = {
      gestao_fornecedores: [
        {
          id: "doc-vencendo",
          titulo: "Atualizar Documentos",
          descricao: "Você tem 2 documentos vencendo em 15 dias",
          acao: "Ver Documentos",
          icone: FileText,
          urgencia: "media"
        }
      ],
      cotacoes: [
        {
          id: "cotacoes-disponiveis",
          titulo: "Cotações Disponíveis",
          descricao: "3 novas cotações aguardando sua participação",
          acao: "Ver Cotações",
          icone: ShoppingBag,
          urgencia: "alta"
        }
      ],
      propostas: [
        {
          id: "proposta-pendente",
          titulo: "Proposta Pendente",
          descricao: "Cotação #2389 aguarda sua resposta há 2 dias",
          acao: "Responder Agora",
          icone: FileText,
          urgencia: "alta"
        }
      ],
      documentos: [
        {
          id: "cert-pendentes",
          titulo: "Certificações Pendentes",
          descricao: "ISO 9001 vence em 30 dias",
          acao: "Renovar Certificado",
          icone: FileText,
          urgencia: "media"
        }
      ],
      pedidos_contratos: [
        {
          id: "pedidos-aberto",
          titulo: "Pedidos em Aberto",
          descricao: "2 pedidos aguardando confirmação de entrega",
          acao: "Ver Pedidos",
          icone: ShoppingBag,
          urgencia: "media"
        }
      ],
      assistente_virtual: [
        {
          id: "como-ajudar",
          titulo: "Como posso ajudar?",
          descricao: "Tire suas dúvidas sobre o portal ou processos",
          acao: "Fazer Pergunta",
          icone: Lightbulb,
          urgencia: "baixa"
        }
      ]
    };
    
    return sugestoes[contexto] || [];
  };

  const sugestoes = getSugestoes(contexto).filter(
    sugestao => !alertasFechados.includes(sugestao.id)
  );

  const fecharAlerta = (alertaId: string) => {
    setAlertasFechados(prev => [...prev, alertaId]);
  };

  if (sugestoes.length === 0) return null;

  const getCorUrgencia = (urgencia: string) => {
    const cores = {
      alta: "bg-red-100 text-red-700 border-red-200",
      media: "bg-yellow-100 text-yellow-700 border-yellow-200", 
      baixa: "bg-green-100 text-green-700 border-green-200"
    };
    return cores[urgencia as keyof typeof cores] || cores.baixa;
  };

  return (
    <div className="border-t p-3 bg-gradient-to-r from-indigo-50 to-purple-50">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="h-4 w-4 text-indigo-600" />
        <span className="text-sm font-medium text-indigo-800">IA Rê sugere:</span>
      </div>
      
      <div className="space-y-2">
        {sugestoes.map((sugestao) => {
          const Icon = sugestao.icone;
          return (
            <Card key={sugestao.id} className={`${getCorUrgencia(sugestao.urgencia)} border relative`}>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-1 right-1 h-6 w-6 p-0 hover:bg-white/50"
                onClick={() => fecharAlerta(sugestao.id)}
              >
                <X className="h-3 w-3" />
              </Button>
              <CardContent className="p-3 pr-8">
                <div className="flex items-start gap-3">
                  <div className="bg-white rounded-full p-1">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium mb-1">{sugestao.titulo}</h4>
                    <p className="text-xs opacity-80 mb-2">{sugestao.descricao}</p>
                    <Button 
                      size="sm" 
                      className="h-6 text-xs bg-white hover:bg-slate-50 text-slate-700 border"
                    >
                      {sugestao.acao}
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

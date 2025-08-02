
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Fornecedor } from "@/types/fornecedor";
import { CheckCircle, Circle, Clock } from "lucide-react";

interface TimelineCicloVidaProps {
  fornecedor: Fornecedor;
}

interface EtapaCicloVida {
  id: string;
  nome: string;
  status: "concluido" | "pendente" | "em_andamento";
  data?: string;
  usuario?: string;
  modulo?: string;
  descricao?: string;
}

export const TimelineCicloVida = ({ fornecedor }: TimelineCicloVidaProps) => {
  const getEtapas = (): EtapaCicloVida[] => {
    const etapas: EtapaCicloVida[] = [
      {
        id: "registro",
        nome: "Registro",
        status: "concluido",
        data: fornecedor.dataCadastro,
        usuario: "Sistema",
        modulo: "Fornecedores",
        descricao: "Cadastro inicial do fornecedor"
      },
      {
        id: "qualificacao",
        nome: "Qualificação",
        status: fornecedor.qualificado ? "concluido" : "pendente",
        data: fornecedor.qualificado ? "15/03/2023" : undefined,
        usuario: "Ana Lima",
        modulo: "Qualificação",
        descricao: "Processo de qualificação técnica e financeira"
      },
      {
        id: "cotacao",
        nome: "Cotação 3x",
        status: "concluido",
        data: "10/04/2023",
        usuario: "Carlos Souza",
        modulo: "Cotações",
        descricao: "Participação em 3 processos de cotação"
      },
      {
        id: "premiacao",
        nome: "Premiação 2x",
        status: "concluido",
        data: "25/04/2023",
        usuario: "Ana Lima",
        modulo: "Cotações",
        descricao: "Venceu 2 processos de cotação"
      },
      {
        id: "pedido",
        nome: "Pedido Emitido",
        status: "concluido",
        data: fornecedor.ultimaParticipacao,
        usuario: "Carlos Souza",
        modulo: "Pedidos",
        descricao: "Primeiro pedido de compra emitido"
      },
      {
        id: "avaliado",
        nome: "Avaliado",
        status: "concluido",
        data: "20/05/2023",
        usuario: "Ana Lima",
        modulo: "Avaliações",
        descricao: "Avaliação de desempenho realizada"
      },
      {
        id: "preferido",
        nome: "Preferido",
        status: fornecedor.preferido ? "concluido" : "pendente",
        data: fornecedor.preferido ? "01/06/2023" : undefined,
        usuario: "Maria Santos",
        modulo: "Fornecedores",
        descricao: "Classificação como fornecedor preferido"
      }
    ];

    return etapas;
  };

  const etapas = getEtapas();

  const getStatusIcon = (status: EtapaCicloVida["status"]) => {
    switch (status) {
      case "concluido":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "em_andamento":
        return <Clock className="h-5 w-5 text-amber-600" />;
      case "pendente":
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: EtapaCicloVida["status"]) => {
    switch (status) {
      case "concluido":
        return "bg-green-100 border-green-200";
      case "em_andamento":
        return "bg-amber-100 border-amber-200";
      case "pendente":
        return "bg-gray-100 border-gray-200";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {etapas.map((etapa, index) => (
          <TooltipProvider key={etapa.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${getStatusColor(etapa.status)}`}
                >
                  {getStatusIcon(etapa.status)}
                  <span className="font-medium">{etapa.nome}</span>
                  {etapa.status === "concluido" && (
                    <Badge variant="secondary" className="ml-2">
                      ✓
                    </Badge>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <div className="space-y-1">
                  <p className="font-medium">{etapa.nome}</p>
                  <p className="text-sm text-muted-foreground">{etapa.descricao}</p>
                  {etapa.data && (
                    <p className="text-sm"><strong>Data:</strong> {etapa.data}</p>
                  )}
                  {etapa.usuario && (
                    <p className="text-sm"><strong>Usuário:</strong> {etapa.usuario}</p>
                  )}
                  {etapa.modulo && (
                    <p className="text-sm"><strong>Módulo:</strong> {etapa.modulo}</p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>

      {/* Linha de progresso */}
      <div className="mt-6">
        <div className="flex items-center">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${(etapas.filter(e => e.status === "concluido").length / etapas.length) * 100}%` 
              }}
            />
          </div>
          <span className="ml-3 text-sm font-medium text-gray-600">
            {etapas.filter(e => e.status === "concluido").length}/{etapas.length} etapas concluídas
          </span>
        </div>
      </div>
    </div>
  );
};


import React from "react";
import { LightbulbIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertaFornecedor } from "@/types/fornecedor";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface IAResugestoesProps {
  alertas: AlertaFornecedor[];
  onExecutarAcao: (alerta: AlertaFornecedor, acao: string) => void;
}

export const IAResugestoes = ({ alertas, onExecutarAcao }: IAResugestoesProps) => {
  const getPrioridadeBadge = (prioridade: string) => {
    switch (prioridade) {
      case "alta":
        return <span className="h-2 w-2 rounded-full bg-red-500"></span>;
      case "media":
        return <span className="h-2 w-2 rounded-full bg-amber-500"></span>;
      case "baixa":
        return <span className="h-2 w-2 rounded-full bg-blue-500"></span>;
      default:
        return <span className="h-2 w-2 rounded-full bg-slate-500"></span>;
    }
  };

  const getAcaoBotao = (tipo: string, acaoSugerida?: string) => {
    if (acaoSugerida) return acaoSugerida;
    
    switch (tipo) {
      case "documento":
        return "Solicitar renovação";
      case "participacao":
        return "Convidar para evento";
      case "inatividade":
        return "Enviar lembrete";
      case "risco":
        return "Revisar fornecedor";
      default:
        return "Ver detalhes";
    }
  };

  const getTooltipDescricao = (tipo: string) => {
    switch (tipo) {
      case "documento":
        return "Ao clicar, será enviada uma solicitação automática de renovação para o responsável cadastrado e o fornecedor será notificado por e-mail e WhatsApp (se autorizado).";
      case "inatividade":
        return "Ao clicar, a IA Rê enviará um lembrete automatizado para o fornecedor via e-mail e WhatsApp, solicitando retorno e atualização da proposta/documentação.";
      case "participacao":
        return "Ao clicar, a IA abrirá uma tela comparativa com outros fornecedores similares, destacando pontuação, prazos e preços. Você poderá selecionar um para substituição ou negociação.";
      case "risco":
        return "Ao clicar, será exibido o relatório completo de análise de risco do fornecedor com recomendações de mitigação.";
      default:
        return "Clique para executar esta ação recomendada pela IA.";
    }
  };

  return (
    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 h-full">
      <div className="flex items-center gap-2 mb-2">
        <LightbulbIcon className="h-5 w-5 text-amber-500" />
        <h3 className="text-lg font-semibold">IA Rê - Sugestões</h3>
      </div>

      <div className="flex flex-col space-y-3">
        {alertas.length === 0 ? (
          <div className="text-center py-4 text-slate-500">
            <LightbulbIcon className="h-6 w-6 mx-auto mb-2 text-slate-300" />
            <p>Nenhuma sugestão disponível</p>
          </div>
        ) : (
          alertas.map((alerta) => (
            <Card key={alerta.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="p-3 pb-0 flex flex-row items-start gap-2">
                <div className="mt-0.5">
                  {getPrioridadeBadge(alerta.prioridade)}
                </div>
                <CardTitle className="text-sm font-medium">{alerta.mensagem}</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-1 text-xs text-slate-500">
                {new Date(alerta.data).toLocaleDateString("pt-BR")}
              </CardContent>
              <CardFooter className="p-3 pt-0">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full text-xs" 
                        onClick={() => onExecutarAcao(alerta, getAcaoBotao(alerta.tipo, alerta.acaoSugerida))}
                      >
                        {getAcaoBotao(alerta.tipo, alerta.acaoSugerida)}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs text-sm">
                      <p>{getTooltipDescricao(alerta.tipo)}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

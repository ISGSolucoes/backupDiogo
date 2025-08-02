import React, { useState } from "react";
import { 
  Shield, 
  DollarSign, 
  Wrench, 
  Leaf, 
  ChevronUp, 
  ChevronDown, 
  Info,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RiscoFornecedor } from "@/types/fornecedor";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DetalhesRiscoModal } from "./DetalhesRiscoModal";

interface AnaliseAvancadaProps {
  risco: RiscoFornecedor;
  scoreOperacional: number;
  scoreSustentabilidade?: number;
  fornecedorNome: string;
}

export const AnaliseAvancada = ({
  risco,
  scoreOperacional,
  scoreSustentabilidade,
  fornecedorNome,
}: AnaliseAvancadaProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalRiscoAberto, setModalRiscoAberto] = useState(false);

  const getStatusColor = (nivel: string) => {
    switch (nivel) {
      case "baixo":
        return "text-green-500";
      case "medio":
        return "text-amber-500";
      case "alto":
        return "text-red-500";
      default:
        return "text-slate-500";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 7) return "text-green-500";
    if (score >= 4) return "text-amber-500";
    return "text-red-500";
  };

  const getStatusIcon = (nivel: string) => {
    const color = getStatusColor(nivel);
    return (
      <div className={`h-3 w-3 rounded-full ${nivel === "baixo" ? "bg-green-500" : nivel === "medio" ? "bg-amber-500" : "bg-red-500"}`} />
    );
  };

  const getFontesInfo = (tipo: 'legal' | 'financeiro' | 'operacional' | 'ambiental') => {
    switch (tipo) {
      case 'legal':
        return "Baseado em certidões, APIs públicas e status legal";
      case 'financeiro':
        return "Dados do CNPJ, Serasa, autodeclaração e histórico";
      case 'operacional':
        return "Histórico de entregas, SLA e participações";
      case 'ambiental':
        return "Questionário ESG, certificações e CNAE";
      default:
        return "";
    }
  };

  const getRiscoIcon = (tipo: 'legal' | 'financeiro' | 'operacional' | 'ambiental', nivel: string) => {
    const iconProps = { 
      className: `h-4 w-4 ${getStatusColor(nivel)}`,
      strokeWidth: 2
    };
    
    switch (tipo) {
      case 'legal':
        return <Shield {...iconProps} />;
      case 'financeiro':
        return <DollarSign {...iconProps} />;
      case 'operacional':
        return <Wrench {...iconProps} />;
      case 'ambiental':
        return <Leaf {...iconProps} />;
    }
  };

  const getScoreIcon = (score: number) => {
    const iconProps = {
      className: `h-4 w-4 ${getScoreColor(score)}`,
      strokeWidth: 2
    };
    
    return score >= 5 ? <TrendingUp {...iconProps} /> : <TrendingDown {...iconProps} />;
  };

  return (
    <>
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            <h2 className="text-xl font-bold">Análise Avançada</h2>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {isOpen ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" /> Recolher
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" /> Expandir
                </>
              )}
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="mt-4 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    {getRiscoIcon('legal', risco.legal)} Risco Legal
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-slate-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-xs">
                          Validação de certidões, consulta a APIs públicas (Receita Federal, Justiça do Trabalho)
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </h4>
                  <div className="flex items-center">
                    {getStatusIcon(risco.legal)}
                    <span className={`ml-1.5 text-sm ${getStatusColor(risco.legal)}`}>
                      {risco.legal.charAt(0).toUpperCase() + risco.legal.slice(1)}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  {getFontesInfo('legal')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    {getRiscoIcon('financeiro', risco.financeiro)} Risco Financeiro
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-slate-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-xs">
                          Porte da empresa, capital social, histórico financeiro e capacidade de entrega
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </h4>
                  <div className="flex items-center">
                    {getStatusIcon(risco.financeiro)}
                    <span className={`ml-1.5 text-sm ${getStatusColor(risco.financeiro)}`}>
                      {risco.financeiro.charAt(0).toUpperCase() + risco.financeiro.slice(1)}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  {getFontesInfo('financeiro')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    {getRiscoIcon('operacional', risco.operacional)} Risco Operacional
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-slate-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-xs">
                          SLA médio, taxa de resposta, participações em eventos e qualificação técnica
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </h4>
                  <div className="flex items-center">
                    {getStatusIcon(risco.operacional)}
                    <span className={`ml-1.5 text-sm ${getStatusColor(risco.operacional)}`}>
                      {risco.operacional.charAt(0).toUpperCase() + risco.operacional.slice(1)}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  {getFontesInfo('operacional')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    {getRiscoIcon('ambiental', risco.ambiental)} Risco ESG
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-slate-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-xs">
                          Certificações ambientais, práticas ESG e respostas ao questionário de sustentabilidade
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </h4>
                  <div className="flex items-center">
                    {getStatusIcon(risco.ambiental)}
                    <span className={`ml-1.5 text-sm ${getStatusColor(risco.ambiental)}`}>
                      {risco.ambiental.charAt(0).toUpperCase() + risco.ambiental.slice(1)}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  {getFontesInfo('ambiental')}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium flex items-center gap-2">
                    Score Operacional
                    {getScoreIcon(scoreOperacional)}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-slate-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-xs">
                          Calculado com base no tempo de resposta, reputação interna e SLA
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </h4>
                  <span className={`text-lg font-semibold ${getScoreColor(scoreOperacional)}`}>
                    {scoreOperacional.toFixed(1)}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-2">
                  Baseado em tempo de resposta, qualidade e cumprimento de prazos
                </p>
                <div className="h-2 bg-slate-100 rounded-full">
                  <div
                    className={`h-full rounded-full ${
                      scoreOperacional >= 7
                        ? "bg-green-500"
                        : scoreOperacional >= 4
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${(scoreOperacional / 10) * 100}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium flex items-center gap-2">
                    Score de Sustentabilidade
                    {scoreSustentabilidade && getScoreIcon(scoreSustentabilidade)}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-slate-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-xs">
                          Calculado com base nas respostas ao questionário ESG, certificações válidas e práticas declaradas
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </h4>
                  <span
                    className={`text-lg font-semibold ${
                      scoreSustentabilidade
                        ? getScoreColor(scoreSustentabilidade)
                        : "text-slate-400"
                    }`}
                  >
                    {scoreSustentabilidade ? scoreSustentabilidade.toFixed(1) : "N/A"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-2">
                  Baseado em práticas ESG e certificações ambientais
                </p>
                {scoreSustentabilidade ? (
                  <div className="h-2 bg-slate-100 rounded-full">
                    <div
                      className={`h-full rounded-full ${
                        scoreSustentabilidade >= 7
                          ? "bg-green-500"
                          : scoreSustentabilidade >= 4
                          ? "bg-amber-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${(scoreSustentabilidade / 10) * 100}%` }}
                    />
                  </div>
                ) : (
                  <div className="h-2 bg-slate-100 rounded-full"></div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center">
            <Button onClick={() => setModalRiscoAberto(true)} className="px-6">
              Ver análise detalhada
            </Button>
          </div>

          <div className="text-xs text-slate-500 border-t pt-4 mt-4">
            <p className="mb-1 font-medium">Fontes de dados:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Documentos legais e certidões (validação automática)</li>
              <li>Histórico de participações e entrega no sistema</li>
              <li>Questionários ESG e autodeclaração do fornecedor</li>
              <li>APIs públicas (Receita Federal e outros órgãos)</li>
            </ul>
            <p className="mt-2">Scores atualizados automaticamente com base em dados do sistema</p>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <DetalhesRiscoModal
        open={modalRiscoAberto}
        onOpenChange={setModalRiscoAberto}
        risco={risco}
        scoreOperacional={scoreOperacional}
        scoreSustentabilidade={scoreSustentabilidade}
        fornecedorNome={fornecedorNome}
      />
    </>
  );
};

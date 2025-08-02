
import React from "react";
import { Shield, DollarSign, Wrench, Leaf, AlertTriangle, CheckCircle, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { RiscoFornecedor } from "@/types/fornecedor";

interface DetalhesRiscoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  risco: RiscoFornecedor;
  scoreOperacional: number;
  scoreSustentabilidade?: number;
  fornecedorNome: string;
}

interface DetalheRisco {
  categoria: string;
  nivel: string;
  score: number;
  fatoresPositivos: string[];
  fatoresNegativos: string[];
  recomendacoes: string[];
  proximaRevisao: string;
  fontesDados: string[];
}

// Mock de dados detalhados de risco
const mockDetalhesRisco: Record<string, DetalheRisco> = {
  legal: {
    categoria: "Risco Legal",
    nivel: "baixo",
    score: 85,
    fatoresPositivos: [
      "Todas as certidões estão válidas",
      "Sem pendências na Receita Federal",
      "Histórico limpo no CADIN"
    ],
    fatoresNegativos: [
      "Certidão trabalhista vence em 45 dias"
    ],
    recomendacoes: [
      "Solicitar renovação da certidão trabalhista",
      "Configurar lembrete automático para renovações"
    ],
    proximaRevisao: "15/07/2023",
    fontesDados: ["Receita Federal", "TST", "CADIN", "Serasa"]
  },
  financeiro: {
    categoria: "Risco Financeiro",
    nivel: "medio",
    score: 65,
    fatoresPositivos: [
      "Capital social adequado ao porte",
      "Histórico de pagamentos em dia",
      "Empresa estabelecida há mais de 5 anos"
    ],
    fatoresNegativos: [
      "Faturamento abaixo da média do setor",
      "Dependência de poucos clientes grandes"
    ],
    recomendacoes: [
      "Monitorar indicadores financeiros trimestralmente",
      "Solicitar demonstrativos financeiros atualizados",
      "Considerar limite de crédito adequado"
    ],
    proximaRevisao: "30/06/2023",
    fontesDados: ["Serasa", "SPC", "Autodeclaração", "Histórico interno"]
  },
  operacional: {
    categoria: "Risco Operacional",
    nivel: "baixo",
    score: 90,
    fatoresPositivos: [
      "SLA médio de 3.2 dias (excelente)",
      "Taxa de entrega no prazo: 95%",
      "Avaliação interna média: 4.5/5"
    ],
    fatoresNegativos: [
      "Capacidade limitada para grandes volumes"
    ],
    recomendacoes: [
      "Manter monitoramento de performance",
      "Avaliar capacidade antes de grandes contratos"
    ],
    proximaRevisao: "20/06/2023",
    fontesDados: ["Histórico de entregas", "Avaliações internas", "SLA tracker"]
  },
  ambiental: {
    categoria: "Risco ESG/Ambiental",
    nivel: "baixo",
    score: 78,
    fatoresPositivos: [
      "Certificação ISO 14001 válida",
      "Política de sustentabilidade definida",
      "Relatório ESG atualizado"
    ],
    fatoresNegativos: [
      "Questionário ESG incompleto",
      "Faltam evidências de práticas sociais"
    ],
    recomendacoes: [
      "Solicitar complemento do questionário ESG",
      "Implementar monitoramento de práticas sociais"
    ],
    proximaRevisao: "10/08/2023",
    fontesDados: ["Questionário ESG", "Certificações", "CNAE", "Autodeclaração"]
  }
};

export const DetalhesRiscoModal = ({
  open,
  onOpenChange,
  risco,
  scoreOperacional,
  scoreSustentabilidade,
  fornecedorNome
}: DetalhesRiscoModalProps) => {
  const getStatusColor = (nivel: string) => {
    switch (nivel) {
      case "baixo": return "text-green-500";
      case "medio": return "text-amber-500";
      case "alto": return "text-red-500";
      default: return "text-slate-500";
    }
  };

  const getStatusBg = (nivel: string) => {
    switch (nivel) {
      case "baixo": return "bg-green-100 border-green-200";
      case "medio": return "bg-amber-100 border-amber-200";
      case "alto": return "bg-red-100 border-red-200";
      default: return "bg-slate-100 border-slate-200";
    }
  };

  const getRiscoIcon = (categoria: string) => {
    switch (categoria) {
      case "legal": return <Shield className="h-5 w-5" />;
      case "financeiro": return <DollarSign className="h-5 w-5" />;
      case "operacional": return <Wrench className="h-5 w-5" />;
      case "ambiental": return <Leaf className="h-5 w-5" />;
      default: return <Info className="h-5 w-5" />;
    }
  };

  const riscoItens = [
    { key: "legal", nivel: risco.legal },
    { key: "financeiro", nivel: risco.financeiro },
    { key: "operacional", nivel: risco.operacional },
    { key: "ambiental", nivel: risco.ambiental }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-[95vw] max-h-[95vh] h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Análise Detalhada de Riscos - {fornecedorNome}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumo Geral */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="text-lg">📊 Resumo Executivo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{scoreOperacional}/10</div>
                  <div className="text-sm text-slate-600">Score Operacional</div>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {scoreSustentabilidade ? `${scoreSustentabilidade}/10` : "N/A"}
                  </div>
                  <div className="text-sm text-slate-600">Score Sustentabilidade</div>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {riscoItens.filter(r => r.nivel === "baixo").length}/4
                  </div>
                  <div className="text-sm text-slate-600">Riscos Baixos</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detalhes por Categoria de Risco */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {riscoItens.map(({ key, nivel }) => {
              const detalhes = mockDetalhesRisco[key];
              return (
                <Card key={key} className={`${getStatusBg(nivel)} border-2`}>
                  <CardHeader>
                    <CardTitle className={`flex items-center gap-2 ${getStatusColor(nivel)}`}>
                      {getRiscoIcon(key)}
                      {detalhes.categoria}
                      <Badge variant="outline" className={getStatusColor(nivel)}>
                        {nivel.toUpperCase()}
                      </Badge>
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Progress value={detalhes.score} className="flex-1" />
                      <span className="text-sm font-medium">{detalhes.score}%</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Fatores Positivos */}
                    <div>
                      <h4 className="font-medium text-green-700 mb-2 flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" />
                        Pontos Fortes
                      </h4>
                      <ul className="text-sm space-y-1 text-slate-600">
                        {detalhes.fatoresPositivos.map((fator, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">✓</span>
                            {fator}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Fatores Negativos */}
                    {detalhes.fatoresNegativos.length > 0 && (
                      <div>
                        <h4 className="font-medium text-amber-700 mb-2 flex items-center gap-1">
                          <AlertTriangle className="h-4 w-4" />
                          Pontos de Atenção
                        </h4>
                        <ul className="text-sm space-y-1 text-slate-600">
                          {detalhes.fatoresNegativos.map((fator, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-amber-500 mt-1">⚠</span>
                              {fator}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <Separator />

                    {/* Recomendações */}
                    <div>
                      <h4 className="font-medium text-blue-700 mb-2">💡 Recomendações</h4>
                      <ul className="text-sm space-y-1 text-slate-600">
                        {detalhes.recomendacoes.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">→</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Informações Técnicas */}
                    <div className="text-xs text-slate-500 pt-2 border-t">
                      <div><strong>Próxima revisão:</strong> {detalhes.proximaRevisao}</div>
                      <div><strong>Fontes:</strong> {detalhes.fontesDados.join(", ")}</div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Rodapé Informativo */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">ℹ️ Sobre esta análise:</p>
                  <p>
                    Esta análise é atualizada automaticamente com base em dados públicos, 
                    histórico interno e questionários do fornecedor. Os scores são calculados 
                    pela IA Rê usando algoritmos proprietários de análise de risco.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

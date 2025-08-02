
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, Clock, AlertTriangle, DollarSign } from "lucide-react";

interface IndicadoresCategoriaProps {
  categoriaId: string;
}

export const IndicadoresCategoria = ({ categoriaId }: IndicadoresCategoriaProps) => {
  // Mock data - em produção viria da API baseado no categoriaId
  const indicadores = {
    nome: "Cabos Elétricos",
    gasto_total: 450000,
    gasto_mes: 75000,
    variacao_gasto: -8.5,
    sla_medio: 92,
    variacao_sla: 3.2,
    fornecedores_ativos: 7,
    total_fornecedores: 8,
    ocorrencias: 3,
    saving_real: 15.2,
    nps_medio: 67,
    rotatividade: 12.5,
    score_risco: 7,
    score_complexidade: 6,
    ultima_revisao: "2023-08-01",
    proxima_revisao: "2024-02-01"
  };

  const getVariacaoIcon = (variacao: number) => {
    return variacao >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  const getVariacaoColor = (variacao: number) => {
    return variacao >= 0 ? "text-green-600" : "text-red-600";
  };

  const getSlaColor = (sla: number) => {
    if (sla >= 95) return "text-green-600";
    if (sla >= 85) return "text-yellow-600";
    return "text-red-600";
  };

  const getRiscoColor = (score: number) => {
    if (score >= 7) return "bg-red-100 text-red-700";
    if (score >= 4) return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  return (
    <div className="space-y-6">
      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Gasto Total (Ano)</p>
                <p className="text-2xl font-bold text-slate-900">
                  R$ {(indicadores.gasto_total / 1000).toFixed(0)}K
                </p>
                <div className="flex items-center mt-1">
                  {getVariacaoIcon(indicadores.variacao_gasto)}
                  <span className={`text-sm ml-1 ${getVariacaoColor(indicadores.variacao_gasto)}`}>
                    {Math.abs(indicadores.variacao_gasto)}% vs mês anterior
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">SLA Médio</p>
                <p className={`text-2xl font-bold ${getSlaColor(indicadores.sla_medio)}`}>
                  {indicadores.sla_medio}%
                </p>
                <div className="flex items-center mt-1">
                  {getVariacaoIcon(indicadores.variacao_sla)}
                  <span className={`text-sm ml-1 ${getVariacaoColor(indicadores.variacao_sla)}`}>
                    {Math.abs(indicadores.variacao_sla)}% vs mês anterior
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Fornecedores Ativos</p>
                <p className="text-2xl font-bold text-slate-900">
                  {indicadores.fornecedores_ativos}/{indicadores.total_fornecedores}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  {((indicadores.fornecedores_ativos / indicadores.total_fornecedores) * 100).toFixed(0)}% atividade
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Análise de Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Operacional</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>SLA de Entrega</span>
                <span className={getSlaColor(indicadores.sla_medio)}>{indicadores.sla_medio}%</span>
              </div>
              <Progress value={indicadores.sla_medio} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>NPS Médio</span>
                <span className="text-slate-700">{indicadores.nps_medio}</span>
              </div>
              <Progress value={indicadores.nps_medio} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Saving Realizado</span>
                <span className="text-green-600">{indicadores.saving_real}%</span>
              </div>
              <Progress value={indicadores.saving_real} className="h-2" />
            </div>

            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Ocorrências no Mês</span>
                <Badge variant={indicadores.ocorrencias > 5 ? "destructive" : "secondary"}>
                  {indicadores.ocorrencias} ocorrências
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Análise de Risco</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Score de Risco</span>
              <Badge className={getRiscoColor(indicadores.score_risco)}>
                {indicadores.score_risco}/10
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Complexidade</span>
              <Badge className={getRiscoColor(indicadores.score_complexidade)}>
                {indicadores.score_complexidade}/10
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Rotatividade</span>
              <span className="text-sm text-slate-700">{indicadores.rotatividade}%</span>
            </div>

            <div className="pt-2 border-t space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Última Revisão</span>
                <span className="text-sm text-slate-900">{indicadores.ultima_revisao}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Próxima Revisão</span>
                <span className="text-sm text-slate-900">{indicadores.proxima_revisao}</span>
              </div>
            </div>

            {new Date(indicadores.proxima_revisao) < new Date() && (
              <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-700">Revisão estratégica em atraso</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, CheckCircle, AlertTriangle, Target } from 'lucide-react';
import { DashboardMetrics, calcularComparativo } from '@/data/dashboardData';

interface InsightsIAProps {
  metricsAtual?: DashboardMetrics;
  metricsAnterior?: DashboardMetrics;
}

export const InsightsIA = ({ metricsAtual, metricsAnterior }: InsightsIAProps) => {
  if (!metricsAtual) return null;

  const gerarInsights = () => {
    const insights = [];

    // Insight sobre SLA
    if (metricsAnterior) {
      const variacao = calcularComparativo(metricsAtual.sla.percentual, metricsAnterior.sla.percentual);
      if (variacao > 0) {
        insights.push({
          tipo: 'positivo',
          icone: TrendingUp,
          titulo: 'SLA em Melhoria',
          descricao: `Seu SLA melhorou ${variacao.toFixed(1)}% em relação ao período anterior.`,
          cor: 'text-green-600',
          bgColor: 'bg-green-50'
        });
      }
    }

    // Insight sobre alertas
    const totalAlertas = metricsAtual.alertas.nfForaPadrao + metricsAtual.alertas.documentacaoVencida + metricsAtual.alertas.entregaDivergencia;
    const alertasAnterior = metricsAnterior ? 
      metricsAnterior.alertas.nfForaPadrao + metricsAnterior.alertas.documentacaoVencida + metricsAnterior.alertas.entregaDivergencia : 0;
    
    if (totalAlertas < alertasAnterior) {
      insights.push({
        tipo: 'positivo',
        icone: CheckCircle,
        titulo: 'Redução de Alertas',
        descricao: `Você teve ${alertasAnterior - totalAlertas} alertas a menos este período — excelente evolução!`,
        cor: 'text-green-600',
        bgColor: 'bg-green-50'
      });
    }

    // Insight sobre aproveitamento de insights
    const totalInsights = metricsAtual.insights.sugestaoContrato.aplicado + 
                          metricsAtual.insights.revisaoPreco.aplicado + 
                          metricsAtual.insights.reenvioDocumento.aplicado;
    const totalVisualizados = metricsAtual.insights.sugestaoContrato.visualizado + 
                              metricsAtual.insights.revisaoPreco.visualizado + 
                              metricsAtual.insights.reenvioDocumento.visualizado;
    
    if (totalVisualizados > 0) {
      const aproveitamento = (totalInsights / totalVisualizados) * 100;
      insights.push({
        tipo: aproveitamento >= 70 ? 'positivo' : 'neutro',
        icone: Brain,
        titulo: 'Aproveitamento de Insights',
        descricao: `Você implementou ${aproveitamento.toFixed(0)}% dos insights sugeridos. ${aproveitamento >= 70 ? 'Continue assim!' : 'Considere aplicar mais sugestões.'}`,
        cor: aproveitamento >= 70 ? 'text-green-600' : 'text-amber-600',
        bgColor: aproveitamento >= 70 ? 'bg-green-50' : 'bg-amber-50'
      });
    }

    // Insight sobre faturamento
    if (metricsAnterior) {
      const variacao = calcularComparativo(metricsAtual.faturamento.anual, metricsAnterior.faturamento.anual);
      if (variacao > 0) {
        insights.push({
          tipo: 'positivo',
          icone: Target,
          titulo: 'Crescimento no Faturamento',
          descricao: `Se mantiver o ritmo atual, seu faturamento será ${variacao.toFixed(1)}% maior que o período anterior.`,
          cor: 'text-blue-600',
          bgColor: 'bg-blue-50'
        });
      }
    }

    // Insight sobre elegibilidade
    if (metricsAtual.sla.percentual >= 95 && totalAlertas <= 2) {
      insights.push({
        tipo: 'oportunidade',
        icone: Target,
        titulo: 'Elegível para Upgrade',
        descricao: 'Você está elegível para upgrade de status ou convite para nova categoria de produtos.',
        cor: 'text-purple-600',
        bgColor: 'bg-purple-50'
      });
    }

    return insights;
  };

  const insights = gerarInsights();

  return (
    <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="h-5 w-5 text-blue-600" />
          Análise Inteligente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insights.map((insight, index) => {
            const IconeInsight = insight.icone;
            return (
              <div key={index} className={`p-4 rounded-lg ${insight.bgColor} border`}>
                <div className="flex items-start gap-3">
                  <IconeInsight className={`h-5 w-5 ${insight.cor} mt-0.5`} />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">{insight.titulo}</h4>
                    <p className="text-sm text-gray-600">{insight.descricao}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

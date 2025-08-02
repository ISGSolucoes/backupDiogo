
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, FileText, Clock, AlertTriangle, Brain, Package, DollarSign } from 'lucide-react';
import { DashboardMetrics, calcularComparativo } from '@/data/dashboardData';

interface DashboardMetricasProps {
  metricsAtual?: DashboardMetrics;
  metricsAnterior?: DashboardMetrics;
}

export const DashboardMetricas = ({ metricsAtual, metricsAnterior }: DashboardMetricasProps) => {
  if (!metricsAtual) return null;

  const calcularTendencia = (atual: number, anterior: number) => {
    const variacao = calcularComparativo(atual, anterior);
    return {
      valor: Math.abs(variacao).toFixed(1),
      tipo: variacao > 0 ? 'aumento' : 'diminuicao',
      icone: variacao > 0 ? TrendingUp : TrendingDown,
      cor: variacao > 0 ? 'text-green-600' : 'text-red-600'
    };
  };

  const metricas = [
    {
      titulo: 'Documentos Pendentes',
      valor: metricsAtual.documentos.pendentes,
      valorAnterior: metricsAnterior?.documentos.pendentes || 0,
      icone: FileText,
      cor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      titulo: 'SLA Entregas',
      valor: metricsAtual.sla.percentual,
      valorAnterior: metricsAnterior?.sla.percentual || 0,
      icone: Clock,
      cor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      sufixo: '%'
    },
    {
      titulo: 'Alertas Recebidos',
      valor: metricsAtual.alertas.nfForaPadrao + metricsAtual.alertas.documentacaoVencida + metricsAtual.alertas.entregaDivergencia,
      valorAnterior: (metricsAnterior?.alertas.nfForaPadrao || 0) + (metricsAnterior?.alertas.documentacaoVencida || 0) + (metricsAnterior?.alertas.entregaDivergencia || 0),
      icone: AlertTriangle,
      cor: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      titulo: 'Insights IA Aplicados',
      valor: metricsAtual.insights.sugestaoContrato.aplicado + metricsAtual.insights.revisaoPreco.aplicado + metricsAtual.insights.reenvioDocumento.aplicado,
      valorAnterior: (metricsAnterior?.insights.sugestaoContrato.aplicado || 0) + (metricsAnterior?.insights.revisaoPreco.aplicado || 0) + (metricsAnterior?.insights.reenvioDocumento.aplicado || 0),
      icone: Brain,
      cor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      titulo: 'Pedidos Executados',
      valor: metricsAtual.pedidos.quantidade,
      valorAnterior: metricsAnterior?.pedidos.quantidade || 0,
      icone: Package,
      cor: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      titulo: 'Faturamento Acumulado',
      valor: metricsAtual.faturamento.anual,
      valorAnterior: metricsAnterior?.faturamento.anual || 0,
      icone: DollarSign,
      cor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      formato: 'moeda'
    }
  ];

  const formatarValor = (valor: number, formato?: string, sufixo?: string) => {
    if (formato === 'moeda') {
      return `R$ ${(valor / 1000).toFixed(0)}k`;
    }
    return `${valor}${sufixo || ''}`;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {metricas.map((metrica, index) => {
        const tendencia = calcularTendencia(metrica.valor, metrica.valorAnterior);
        const IconeMetrica = metrica.icone;
        const IconeTendencia = tendencia.icone;

        return (
          <Card key={index} className={`${metrica.borderColor} border-l-4`}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${metrica.bgColor}`}>
                  <IconeMetrica className={`h-4 w-4 ${metrica.cor}`} />
                </div>
                {metricsAnterior && (
                  <Badge variant="outline" className={`text-xs ${tendencia.cor}`}>
                    <IconeTendencia className="h-3 w-3 mr-1" />
                    {tendencia.valor}%
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-gray-900">
                  {formatarValor(metrica.valor, metrica.formato, metrica.sufixo)}
                </div>
                <CardTitle className="text-sm font-medium text-gray-600">
                  {metrica.titulo}
                </CardTitle>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

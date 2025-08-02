
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { DashboardMetrics, formatarPeriodo } from '@/data/dashboardData';

interface GraficoAlertasFrequenciaProps {
  data: DashboardMetrics[];
}

export const GraficoAlertasFrequencia = ({ data }: GraficoAlertasFrequenciaProps) => {
  const chartData = data.map(item => ({
    periodo: formatarPeriodo(item.periodo),
    nfForaPadrao: item.alertas.nfForaPadrao,
    documentacaoVencida: item.alertas.documentacaoVencida,
    entregaDivergencia: item.alertas.entregaDivergencia
  }));

  const chartConfig = {
    nfForaPadrao: {
      label: "NF fora do padrão",
      color: "hsl(0, 72%, 51%)"
    },
    documentacaoVencida: {
      label: "Documentação vencida",
      color: "hsl(38, 92%, 50%)"
    },
    entregaDivergencia: {
      label: "Entrega com divergência",
      color: "hsl(25, 95%, 53%)"
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔔 Alertas Recebidos - Frequência por Tipo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="periodo" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="nfForaPadrao" fill="var(--color-nfForaPadrao)" stackId="a" />
              <Bar dataKey="documentacaoVencida" fill="var(--color-documentacaoVencida)" stackId="a" />
              <Bar dataKey="entregaDivergencia" fill="var(--color-entregaDivergencia)" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

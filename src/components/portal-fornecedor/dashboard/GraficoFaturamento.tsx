
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { DashboardMetrics } from '@/data/dashboardData';

interface GraficoFaturamentoProps {
  data: DashboardMetrics[];
}

export const GraficoFaturamento = ({ data }: GraficoFaturamentoProps) => {
  // Agrupar dados por ano
  const dadosAnuais = data.reduce((acc: any, item) => {
    const ano = item.periodo.split('-')[0];
    if (!acc[ano]) {
      acc[ano] = {
        ano,
        faturamento: item.faturamento.anual / 1000 // Convertendo para milhares
      };
    }
    return acc;
  }, {});

  const chartData = Object.values(dadosAnuais);

  const chartConfig = {
    faturamento: {
      label: "Faturamento (R$ mil)",
      color: "hsl(142, 76%, 36%)"
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          💰 Faturamento - Comparativo Anual
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ano" />
              <YAxis />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value: number) => [`R$ ${value}k`, 'Faturamento']}
              />
              <Bar dataKey="faturamento" fill="var(--color-faturamento)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

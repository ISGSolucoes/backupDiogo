
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { DashboardMetrics } from '@/data/dashboardData';

interface GraficoInsightsIAProps {
  data: DashboardMetrics[];
}

export const GraficoInsightsIA = ({ data }: GraficoInsightsIAProps) => {
  const ultimoPeriodo = data[data.length - 1];
  
  if (!ultimoPeriodo) return null;

  const chartData = [
    {
      name: 'Aplicados',
      value: ultimoPeriodo.insights.sugestaoContrato.aplicado + 
             ultimoPeriodo.insights.revisaoPreco.aplicado + 
             ultimoPeriodo.insights.reenvioDocumento.aplicado,
      color: 'hsl(142, 76%, 36%)'
    },
    {
      name: 'Visualizados',
      value: ultimoPeriodo.insights.sugestaoContrato.visualizado + 
             ultimoPeriodo.insights.revisaoPreco.visualizado + 
             ultimoPeriodo.insights.reenvioDocumento.visualizado -
             (ultimoPeriodo.insights.sugestaoContrato.aplicado + 
              ultimoPeriodo.insights.revisaoPreco.aplicado + 
              ultimoPeriodo.insights.reenvioDocumento.aplicado),
      color: 'hsl(38, 92%, 50%)'
    },
    {
      name: 'Ignorados',
      value: ultimoPeriodo.insights.sugestaoContrato.ignorado + 
             ultimoPeriodo.insights.revisaoPreco.ignorado + 
             ultimoPeriodo.insights.reenvioDocumento.ignorado,
      color: 'hsl(0, 72%, 51%)'
    }
  ];

  const chartConfig = {
    aplicados: {
      label: "Aplicados",
      color: "hsl(142, 76%, 36%)"
    },
    visualizados: {
      label: "Visualizados",
      color: "hsl(38, 92%, 50%)"
    },
    ignorados: {
      label: "Ignorados",
      color: "hsl(0, 72%, 51%)"
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🧠 Insights da IA - Aproveitamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

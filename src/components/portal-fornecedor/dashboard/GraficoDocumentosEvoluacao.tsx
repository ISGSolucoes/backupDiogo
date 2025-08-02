
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { DashboardMetrics, formatarPeriodo } from '@/data/dashboardData';

interface GraficoDocumentosEvolucaoProps {
  data: DashboardMetrics[];
}

export const GraficoDocumentosEvoluacao = ({ data }: GraficoDocumentosEvolucaoProps) => {
  const chartData = data.map(item => ({
    periodo: formatarPeriodo(item.periodo),
    validos: item.documentos.validos,
    pendentes: item.documentos.pendentes,
    vencidos: item.documentos.vencidos
  }));

  const chartConfig = {
    validos: {
      label: "Válidos",
      color: "hsl(142, 76%, 36%)"
    },
    pendentes: {
      label: "Pendentes",
      color: "hsl(38, 92%, 50%)"
    },
    vencidos: {
      label: "Vencidos",
      color: "hsl(0, 72%, 51%)"
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📄 Documentos - Evolução Mensal
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
              <Bar dataKey="validos" fill="var(--color-validos)" stackId="a" />
              <Bar dataKey="pendentes" fill="var(--color-pendentes)" stackId="a" />
              <Bar dataKey="vencidos" fill="var(--color-vencidos)" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

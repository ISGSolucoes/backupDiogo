
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { DashboardMetrics, formatarPeriodo } from '@/data/dashboardData';

interface GraficoPedidosVolumeProps {
  data: DashboardMetrics[];
}

export const GraficoPedidosVolume = ({ data }: GraficoPedidosVolumeProps) => {
  const chartData = data.map(item => ({
    periodo: formatarPeriodo(item.periodo),
    quantidade: item.pedidos.quantidade,
    valor: item.pedidos.valorTotal / 1000, // Convertendo para milhares
    ticketMedio: item.pedidos.valorTotal / item.pedidos.quantidade / 1000
  }));

  const chartConfig = {
    quantidade: {
      label: "Quantidade",
      color: "hsl(217, 91%, 60%)"
    },
    valor: {
      label: "Valor (R$ mil)",
      color: "hsl(142, 76%, 36%)"
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📦 Pedidos - Volume vs Valor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="periodo" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value: number, name: string) => [
                  name === 'quantidade' ? `${value} pedidos` : `R$ ${value}k`,
                  name === 'quantidade' ? 'Quantidade' : 'Valor'
                ]}
              />
              <Bar yAxisId="left" dataKey="quantidade" fill="var(--color-quantidade)" />
              <Line yAxisId="right" type="monotone" dataKey="valor" stroke="var(--color-valor)" strokeWidth={3} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts';
import { DashboardMetrics, formatarPeriodo } from '@/data/dashboardData';

interface GraficoSLAEntregasProps {
  data: DashboardMetrics[];
}

export const GraficoSLAEntregas = ({ data }: GraficoSLAEntregasProps) => {
  const chartData = data.map(item => ({
    periodo: formatarPeriodo(item.periodo),
    sla: item.sla.percentual,
    totalEntregas: item.sla.totalEntregas,
    comAtraso: item.sla.comAtraso
  }));

  const chartConfig = {
    sla: {
      label: "SLA (%)",
      color: "hsl(217, 91%, 60%)"
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          ⏱️ SLA de Entregas - Tendência
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="periodo" />
              <YAxis domain={[80, 100]} />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value: number, name: string) => [
                  `${value}%`,
                  name
                ]}
              />
              <ReferenceLine y={95} stroke="red" strokeDasharray="5 5" label="Meta 95%" />
              <Line 
                type="monotone" 
                dataKey="sla" 
                stroke="var(--color-sla)" 
                strokeWidth={3}
                dot={{ fill: "var(--color-sla)", strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

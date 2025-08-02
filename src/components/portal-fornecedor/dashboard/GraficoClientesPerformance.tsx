
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { DashboardMetrics, clientesDisponiveis } from '@/data/dashboardData';

interface GraficoClientesPerformanceProps {
  data: DashboardMetrics[];
}

export const GraficoClientesPerformance = ({ data }: GraficoClientesPerformanceProps) => {
  // Agregar dados por cliente
  const dadosAgregados = clientesDisponiveis.map(cliente => {
    const dadosCliente = data.filter(item => item.cliente === cliente.id);
    
    if (dadosCliente.length === 0) {
      return {
        cliente: cliente.nome.split(' ')[0], // Nome resumido
        faturamento: 0,
        pedidos: 0,
        slaMedia: 0,
        crescimento: 0,
        cor: cliente.cor
      };
    }

    const faturamentoTotal = dadosCliente.reduce((acc, item) => acc + item.pedidos.valorTotal, 0);
    const pedidosTotal = dadosCliente.reduce((acc, item) => acc + item.pedidos.quantidade, 0);
    const slaMedia = dadosCliente.reduce((acc, item) => acc + item.sla.percentual, 0) / dadosCliente.length;
    
    // Calcular crescimento comparando primeiro e último período
    const crescimento = dadosCliente.length > 1 
      ? ((dadosCliente[dadosCliente.length - 1].pedidos.valorTotal - dadosCliente[0].pedidos.valorTotal) / dadosCliente[0].pedidos.valorTotal) * 100
      : 0;

    return {
      cliente: cliente.nome.split(' ')[0],
      faturamento: faturamentoTotal / 1000, // Em milhares
      pedidos: pedidosTotal,
      slaMedia: Math.round(slaMedia),
      crescimento: Math.round(crescimento),
      cor: cliente.cor
    };
  }).filter(item => item.faturamento > 0); // Filtrar clientes sem dados

  const chartConfig = {
    faturamento: {
      label: "Faturamento (R$ mil)",
      color: "hsl(142, 76%, 36%)"
    },
    pedidos: {
      label: "Pedidos",
      color: "hsl(217, 91%, 60%)"
    },
    slaMedia: {
      label: "SLA Médio (%)",
      color: "hsl(38, 92%, 50%)"
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          👥 Performance por Cliente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dadosAgregados} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="cliente" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value: number, name: string) => [
                  name === 'faturamento' ? `R$ ${value}k` : 
                  name === 'slaMedia' ? `${value}%` : 
                  `${value}`,
                  name === 'faturamento' ? 'Faturamento' :
                  name === 'pedidos' ? 'Pedidos' :
                  'SLA Médio'
                ]}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="faturamento" fill="var(--color-faturamento)" name="Faturamento" />
              <Bar yAxisId="left" dataKey="pedidos" fill="var(--color-pedidos)" name="Pedidos" />
              <Bar yAxisId="right" dataKey="slaMedia" fill="var(--color-slaMedia)" name="SLA Médio" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        {/* Tabela de Detalhes */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Cliente</th>
                <th className="text-right p-2">Faturamento</th>
                <th className="text-right p-2">Pedidos</th>
                <th className="text-right p-2">SLA Médio</th>
                <th className="text-right p-2">Crescimento</th>
              </tr>
            </thead>
            <tbody>
              {dadosAgregados.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2 font-medium">{item.cliente}</td>
                  <td className="text-right p-2">R$ {item.faturamento.toFixed(0)}k</td>
                  <td className="text-right p-2">{item.pedidos}</td>
                  <td className="text-right p-2">{item.slaMedia}%</td>
                  <td className={`text-right p-2 ${item.crescimento > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.crescimento > 0 ? '+' : ''}{item.crescimento}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

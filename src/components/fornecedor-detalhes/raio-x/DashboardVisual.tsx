
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Fornecedor } from "@/types/fornecedor";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface DashboardVisualProps {
  fornecedor: Fornecedor;
}

export const DashboardVisual = ({ fornecedor }: DashboardVisualProps) => {
  // Mock de dados para gráficos
  const evolucaoPedidos = [
    { mes: "Jan", valor: 45000, quantidade: 1 },
    { mes: "Fev", valor: 0, quantidade: 0 },
    { mes: "Mar", valor: 89000, quantidade: 1 },
    { mes: "Abr", valor: 156000, quantidade: 2 },
    { mes: "Mai", valor: 245000, quantidade: 1 },
    { mes: "Jun", valor: 0, quantidade: 0 },
    { mes: "Jul", valor: 0, quantidade: 0 }
  ];

  const distribuicaoCategorias = [
    { categoria: "MRO", valor: 450000, cor: "#3b82f6" },
    { categoria: "Serviços Técnicos", valor: 520000, cor: "#10b981" },
    { categoria: "Infraestrutura", valor: 275000, cor: "#f59e0b" }
  ];

  const tabelaComparativa = [
    {
      processo: "COT-2023-001",
      data: "15/03/2023",
      valorCotado: 120000,
      valorPremiado: 110000,
      valorPedido: 110000,
      status: "Premiado"
    },
    {
      processo: "COT-2023-005",
      data: "22/04/2023",
      valorCotado: 95000,
      valorPremiado: 89000,
      valorPedido: 89000,
      status: "Premiado"
    },
    {
      processo: "COT-2023-008",
      data: "10/05/2023",
      valorCotado: 85000,
      valorPremiado: 82000,
      valorPedido: 0,
      status: "Não Premiado"
    }
  ];

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const slaStatus = 4.5; // dias
  const getSLAColor = (sla: number) => {
    if (sla <= 3) return "bg-green-500";
    if (sla <= 5) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      {/* Primeira linha: Gráfico de Barras e Pizza */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Barras: Evolução de Pedidos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Evolução de Pedidos no Tempo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={evolucaoPedidos}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis tickFormatter={(value) => `R$ ${(value / 1000)}k`} />
                <Tooltip 
                  formatter={(value: number) => [formatarMoeda(value), "Valor"]}
                  labelFormatter={(label) => `Mês: ${label}`}
                />
                <Bar dataKey="valor" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico Pizza: Distribuição por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribuição por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distribuicaoCategorias}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ categoria, percent }) => `${categoria}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="valor"
                >
                  {distribuicaoCategorias.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.cor} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatarMoeda(value)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Segunda linha: Tabela Comparativa */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tabela Comparativa: Cotado vs Premiado vs Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Processo</th>
                  <th className="text-left p-2 font-medium">Data</th>
                  <th className="text-right p-2 font-medium">Valor Cotado</th>
                  <th className="text-right p-2 font-medium">Valor Premiado</th>
                  <th className="text-right p-2 font-medium">Valor Pedido</th>
                  <th className="text-center p-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {tabelaComparativa.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{item.processo}</td>
                    <td className="p-2">{item.data}</td>
                    <td className="p-2 text-right">{formatarMoeda(item.valorCotado)}</td>
                    <td className="p-2 text-right">{formatarMoeda(item.valorPremiado)}</td>
                    <td className="p-2 text-right">
                      {item.valorPedido > 0 ? formatarMoeda(item.valorPedido) : "-"}
                    </td>
                    <td className="p-2 text-center">
                      <Badge 
                        variant={item.status === "Premiado" ? "default" : "secondary"}
                        className={item.status === "Premiado" ? "bg-green-100 text-green-800" : ""}
                      >
                        {item.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Terceira linha: Indicador de SLA */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Indicador de SLA de Entrega</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">SLA Atual: {slaStatus} dias</span>
                <span className="text-sm text-muted-foreground">Meta: ≤ 3 dias</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${getSLAColor(slaStatus)}`}
                  style={{ width: `${Math.min((slaStatus / 7) * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>Excelente (≤3)</span>
                <span>Bom (3-5)</span>
                <span>Atenção ({'>'}5)</span>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold ${slaStatus <= 3 ? "text-green-600" : slaStatus <= 5 ? "text-amber-600" : "text-red-600"}`}>
                {slaStatus}
              </div>
              <div className="text-sm text-muted-foreground">dias</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

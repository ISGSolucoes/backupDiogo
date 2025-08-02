
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const TransactionChart = () => {
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('mes');
  const [viewMode, setViewMode] = useState('quantidade'); // 'quantidade' ou 'valor'

  // Dados de exemplo para diferentes períodos
  const transactionData = {
    mes: [
      { period: 'Jan', cotacoes: { quantidade: 12, valor: 2400000 }, pedidos: { quantidade: 25, valor: 1800000 }, questionarios: { quantidade: 4, valor: 0 }, contratos: { quantidade: 2, valor: 5000000 } },
      { period: 'Fev', cotacoes: { quantidade: 8, valor: 1600000 }, pedidos: { quantidade: 18, valor: 1200000 }, questionarios: { quantidade: 3, valor: 0 }, contratos: { quantidade: 1, valor: 2500000 } },
      { period: 'Mar', cotacoes: { quantidade: 15, valor: 3200000 }, pedidos: { quantidade: 32, valor: 2100000 }, questionarios: { quantidade: 5, valor: 0 }, contratos: { quantidade: 3, valor: 7500000 } },
      { period: 'Abr', cotacoes: { quantidade: 10, valor: 1800000 }, pedidos: { quantidade: 22, valor: 1500000 }, questionarios: { quantidade: 2, valor: 0 }, contratos: { quantidade: 2, valor: 4000000 } },
      { period: 'Mai', cotacoes: { quantidade: 14, valor: 2800000 }, pedidos: { quantidade: 28, valor: 1900000 }, questionarios: { quantidade: 4, valor: 0 }, contratos: { quantidade: 1, valor: 3000000 } }
    ],
    trimestre: [
      { period: 'Q1 2024', cotacoes: { quantidade: 35, valor: 7200000 }, pedidos: { quantidade: 75, valor: 5100000 }, questionarios: { quantidade: 12, valor: 0 }, contratos: { quantidade: 6, valor: 15000000 } },
      { period: 'Q2 2024', cotacoes: { quantidade: 42, valor: 8500000 }, pedidos: { quantidade: 82, valor: 5800000 }, questionarios: { quantidade: 15, valor: 0 }, contratos: { quantidade: 8, valor: 18500000 } },
      { period: 'Q3 2024', cotacoes: { quantidade: 38, valor: 7800000 }, pedidos: { quantidade: 70, valor: 4900000 }, questionarios: { quantidade: 11, valor: 0 }, contratos: { quantidade: 5, valor: 12000000 } },
      { period: 'Q4 2024', cotacoes: { quantidade: 45, valor: 9200000 }, pedidos: { quantidade: 88, valor: 6200000 }, questionarios: { quantidade: 18, valor: 0 }, contratos: { quantidade: 9, valor: 20000000 } }
    ],
    ano: [
      { period: '2022', cotacoes: { quantidade: 120, valor: 24000000 }, pedidos: { quantidade: 280, valor: 18000000 }, questionarios: { quantidade: 35, valor: 0 }, contratos: { quantidade: 15, valor: 45000000 } },
      { period: '2023', cotacoes: { quantidade: 145, valor: 29500000 }, pedidos: { quantidade: 320, valor: 22000000 }, questionarios: { quantidade: 42, valor: 0 }, contratos: { quantidade: 22, valor: 65000000 } },
      { period: '2024', cotacoes: { quantidade: 160, valor: 32700000 }, pedidos: { quantidade: 315, valor: 22000000 }, questionarios: { quantidade: 56, valor: 0 }, contratos: { quantidade: 28, valor: 65500000 } }
    ]
  };

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `R$ ${(value / 1000000).toFixed(1)}M`;
    }
    return `R$ ${(value / 1000).toFixed(0)}K`;
  };

  const getChartData = () => {
    const data = transactionData[selectedPeriod as keyof typeof transactionData];
    
    if (selectedType === 'all') {
      if (viewMode === 'quantidade') {
        return data.map(item => ({
          period: item.period,
          'Cotações': item.cotacoes.quantidade,
          'Pedidos': item.pedidos.quantidade,
          'Questionários': item.questionarios.quantidade,
          'Contratos': item.contratos.quantidade
        }));
      } else {
        return data.map(item => ({
          period: item.period,
          'Cotações': item.cotacoes.valor / 1000000,
          'Pedidos': item.pedidos.valor / 1000000,
          'Contratos': item.contratos.valor / 1000000
        }));
      }
    } else {
      return data.map(item => {
        const typeData = (item as any)[selectedType];
        if (viewMode === 'quantidade') {
          return {
            period: item.period,
            'Quantidade': typeData.quantidade
          };
        } else {
          return {
            period: item.period,
            'Valor (R$ Mi)': typeData.valor / 1000000
          };
        }
      });
    }
  };

  const getTypeColors = () => {
    return {
      'Cotações': '#ef4444',
      'Pedidos': '#3b82f6', 
      'Questionários': '#10b981',
      'Contratos': '#8b5cf6',
      'Quantidade': '#3b82f6',
      'Valor (R$ Mi)': '#10b981'
    };
  };

  const calculateTotals = () => {
    const data = transactionData[selectedPeriod as keyof typeof transactionData];
    
    if (selectedType === 'all') {
      return {
        cotacoes: data.reduce((acc, item) => acc + item.cotacoes.quantidade, 0),
        pedidos: data.reduce((acc, item) => acc + item.pedidos.quantidade, 0),
        questionarios: data.reduce((acc, item) => acc + item.questionarios.quantidade, 0),
        contratos: data.reduce((acc, item) => acc + item.contratos.quantidade, 0),
        valorTotal: data.reduce((acc, item) => 
          acc + item.cotacoes.valor + item.pedidos.valor + item.contratos.valor, 0
        )
      };
    } else {
      const typeKey = selectedType as 'cotacoes' | 'pedidos' | 'questionarios' | 'contratos';
      return {
        quantidade: data.reduce((acc, item) => acc + item[typeKey].quantidade, 0),
        valor: data.reduce((acc, item) => acc + item[typeKey].valor, 0)
      };
    }
  };

  const totals = calculateTotals();
  const chartData = getChartData();
  const colors = getTypeColors();

  const getTypeLabel = (type: string) => {
    const labels = {
      cotacoes: 'Cotações',
      pedidos: 'Pedidos', 
      contratos: 'Contratos',
      questionarios: 'Questionários'
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
        <h2 className="text-2xl font-bold text-gray-900">📊 Análise de Transações</h2>
        
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <label className="font-medium text-gray-700 text-sm">Tipo:</label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                <SelectItem value="cotacoes">Cotações</SelectItem>
                <SelectItem value="pedidos">Pedidos</SelectItem>
                <SelectItem value="questionarios">Questionários</SelectItem>
                <SelectItem value="contratos">Contratos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-medium text-gray-700 text-sm">Visualizar:</label>
            <Select value={viewMode} onValueChange={setViewMode}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quantidade">Quantidade</SelectItem>
                <SelectItem value="valor" disabled={selectedType === 'questionarios'}>
                  Valor
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-medium text-gray-700 text-sm">Período:</label>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mes">Mês</SelectItem>
                <SelectItem value="trimestre">Trimestre</SelectItem>
                <SelectItem value="ano">Ano</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="h-[400px] mb-6">
        <ChartContainer config={{}}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
              <XAxis 
                dataKey="period" 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => 
                  viewMode === 'valor' ? `R$ ${value}M` : value.toString()
                }
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                        <p className="font-medium text-gray-900 mb-2">{label}</p>
                        {payload.map((item, index) => (
                          <p key={index} style={{ color: item.color }} className="text-sm">
                            {item.name}: {
                              viewMode === 'valor' 
                                ? `R$ ${Number(item.value).toFixed(1)}M`
                                : `${item.value} ${item.name === 'Quantidade' ? getTypeLabel(selectedType).toLowerCase() : String(item.name)?.toLowerCase()}`
                            }
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              
              {selectedType === 'all' ? (
                viewMode === 'quantidade' ? (
                  <>
                    <Bar dataKey="Cotações" fill={colors['Cotações']} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Pedidos" fill={colors['Pedidos']} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Questionários" fill={colors['Questionários']} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Contratos" fill={colors['Contratos']} radius={[4, 4, 0, 0]} />
                  </>
                ) : (
                  <>
                    <Bar dataKey="Cotações" fill={colors['Cotações']} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Pedidos" fill={colors['Pedidos']} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Contratos" fill={colors['Contratos']} radius={[4, 4, 0, 0]} />
                  </>
                )
              ) : (
                viewMode === 'quantidade' ? (
                  <Bar dataKey="Quantidade" fill={colors['Quantidade']} radius={[4, 4, 0, 0]} />
                ) : (
                  selectedType !== 'questionarios' && (
                    <Bar dataKey="Valor (R$ Mi)" fill={colors['Valor (R$ Mi)']} radius={[4, 4, 0, 0]} />
                  )
                )
              )}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Cards de Resumo Dinâmicos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {selectedType === 'all' ? (
          <>
            <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-400">
              <div className="text-sm text-gray-600">Cotações</div>
              <div className="text-2xl font-bold text-red-600">{totals.cotacoes}</div>
              <div className="text-xs text-gray-500">Total no período</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
              <div className="text-sm text-gray-600">Pedidos</div>
              <div className="text-2xl font-bold text-blue-600">{totals.pedidos}</div>
              <div className="text-xs text-gray-500">Total no período</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-400">
              <div className="text-sm text-gray-600">Questionários</div>
              <div className="text-2xl font-bold text-green-600">{totals.questionarios}</div>
              <div className="text-xs text-gray-500">Total no período</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-400">
              <div className="text-sm text-gray-600">Contratos</div>
              <div className="text-2xl font-bold text-purple-600">{totals.contratos}</div>
              <div className="text-xs text-gray-500">Total no período</div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
              <div className="text-sm text-gray-600">Quantidade</div>
              <div className="text-2xl font-bold text-blue-600">{(totals as any).quantidade}</div>
              <div className="text-xs text-gray-500">{getTypeLabel(selectedType)}</div>
            </div>
            {selectedType !== 'questionarios' && (
              <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-400">
                <div className="text-sm text-gray-600">Valor Total</div>
                <div className="text-2xl font-bold text-green-600">
                  {formatValue((totals as any).valor)}
                </div>
                <div className="text-xs text-gray-500">No período</div>
              </div>
            )}
            <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-400">
              <div className="text-sm text-gray-600">Período</div>
              <div className="text-2xl font-bold text-gray-600">
                {selectedPeriod === 'mes' ? '5 meses' : 
                 selectedPeriod === 'trimestre' ? '4 trim.' : '3 anos'}
              </div>
              <div className="text-xs text-gray-500">Analisados</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-400">
              <div className="text-sm text-gray-600">Média por Período</div>
              <div className="text-2xl font-bold text-yellow-600">
                {Math.round((totals as any).quantidade / 
                  (selectedPeriod === 'mes' ? 5 : selectedPeriod === 'trimestre' ? 4 : 3))}
              </div>
              <div className="text-xs text-gray-500">Por {selectedPeriod}</div>
            </div>
          </>
        )}
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Visualizando <strong>{viewMode === 'quantidade' ? 'quantidades' : 'valores'}</strong> de{' '}
          <strong>{selectedType === 'all' ? 'todos os tipos' : getTypeLabel(selectedType).toLowerCase()}</strong>{' '}
          por <strong>{selectedPeriod}</strong>
        </p>
      </div>
    </div>
  );
};

export default TransactionChart;

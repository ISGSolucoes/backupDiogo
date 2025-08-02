import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Target, Clock, DollarSign, Users } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export const DashboardMetas = () => {
  // Dados mockados para os gráficos
  const dadosEvolucao = [
    { mes: 'Jan', alcancadas: 8, total: 10 },
    { mes: 'Fev', alcancadas: 12, total: 15 },
    { mes: 'Mar', alcancadas: 9, total: 12 },
    { mes: 'Abr', alcancadas: 15, total: 18 },
    { mes: 'Mai', alcancadas: 11, total: 14 },
    { mes: 'Jun', alcancadas: 13, total: 16 },
    { mes: 'Jul', alcancadas: 8, total: 12 }
  ];

  const dadosCategoria = [
    { categoria: 'Sourcing', metas: 5, alcancadas: 3 },
    { categoria: 'Requisições', metas: 4, alcancadas: 4 },
    { categoria: 'Pedidos', metas: 2, alcancadas: 1 },
    { categoria: 'Fornecedores', metas: 3, alcancadas: 1 }
  ];

  const dadosStatus = [
    { status: 'No Prazo', valor: 8, cor: '#10b981' },
    { status: 'Atenção', valor: 3, cor: '#f59e0b' },
    { status: 'Crítica', valor: 1, cor: '#ef4444' }
  ];

  const indicadoresResumo = [
    {
      titulo: 'Taxa de Sucesso',
      valor: '66.7%',
      variacao: '+8.3%',
      tipo: 'positivo',
      icone: TrendingUp,
      descricao: '8 de 12 metas alcançadas'
    },
    {
      titulo: 'Saving Acumulado',
      valor: 'R$ 1.2M',
      variacao: '+15.2%',
      tipo: 'positivo',
      icone: DollarSign,
      descricao: 'Economia total no período'
    },
    {
      titulo: 'Metas em Risco',
      valor: '4',
      variacao: '-2',
      tipo: 'negativo',
      icone: Clock,
      descricao: 'Requerem atenção imediata'
    },
    {
      titulo: 'Equipes Engajadas',
      valor: '85%',
      variacao: '+12%',
      tipo: 'positivo',
      icone: Users,
      descricao: 'Participação ativa nas metas'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Indicadores de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {indicadoresResumo.map((indicador, index) => (
          <Card key={index} className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600">{indicador.titulo}</p>
                  <p className="text-2xl font-bold text-slate-900">{indicador.valor}</p>
                  <div className="flex items-center gap-1">
                    <span className={`text-xs font-medium ${
                      indicador.tipo === 'positivo' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {indicador.variacao}
                    </span>
                    <span className="text-xs text-slate-500">vs mês anterior</span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${
                  indicador.tipo === 'positivo' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <indicador.icone className={`h-6 w-6 ${
                    indicador.tipo === 'positivo' ? 'text-green-600' : 'text-red-600'
                  }`} />
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">{indicador.descricao}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráficos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evolução Mensal */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Evolução das Metas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dadosEvolucao}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="alcancadas" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="Metas Alcançadas"
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#94a3b8" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Total de Metas"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance por Categoria */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Performance por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosCategoria}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="categoria" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="metas" fill="#94a3b8" name="Total de Metas" />
                <Bar dataKey="alcancadas" fill="#10b981" name="Metas Alcançadas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Status das Metas e Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribuição por Status */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Status das Metas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={dadosStatus}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="valor"
                  label={({ status, valor }) => `${status}: ${valor}`}
                >
                  {dadosStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.cor} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { nome: 'Maria Santos', alcancadas: 4, total: 4, percentual: 100 },
                { nome: 'João Silva', alcancadas: 3, total: 4, percentual: 75 },
                { nome: 'Pedro Costa', alcancadas: 2, total: 3, percentual: 67 }
              ].map((performer, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{performer.nome}</p>
                    <p className="text-xs text-slate-600">
                      {performer.alcancadas}/{performer.total} metas
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">{performer.percentual}%</p>
                    <div className="w-16 h-2 bg-slate-200 rounded-full">
                      <div 
                        className="h-2 bg-green-500 rounded-full"
                        style={{ width: `${performer.percentual}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Próximos Marcos */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Próximos Marcos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { meta: 'Saving Q3', prazo: '15 dias', status: 'amarelo' },
                { meta: 'SLA Requisições', prazo: '7 dias', status: 'verde' },
                { meta: 'Qualificação Fornecedores', prazo: '30 dias', status: 'vermelho' }
              ].map((marco, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{marco.meta}</p>
                    <p className="text-xs text-slate-600">Vence em {marco.prazo}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    marco.status === 'verde' ? 'bg-green-500' :
                    marco.status === 'amarelo' ? 'bg-amber-500' : 'bg-red-500'
                  }`} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
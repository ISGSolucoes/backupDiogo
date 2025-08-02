
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardData {
  totalOrcamento: number;
  totalUtilizado: number;
  totalReservado: number;
  totalDisponivel: number;
  porcentagemUtilizada: number;
  centrosCustoComProblema: number;
  dadosGrafico: Array<{
    nome: string;
    orcado: number;
    utilizado: number;
    reservado: number;
    disponivel: number;
  }>;
}

export const DashboardOrcamentario = () => {
  const [data, setData] = useState<DashboardData>({
    totalOrcamento: 0,
    totalUtilizado: 0,
    totalReservado: 0,
    totalDisponivel: 0,
    porcentagemUtilizada: 0,
    centrosCustoComProblema: 0,
    dadosGrafico: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const { data: orcamentos, error } = await supabase
        .from('orcamentos')
        .select('*')
        .eq('ano', new Date().getFullYear());

      if (error) throw error;

      const totalOrcamento = orcamentos?.reduce((sum, item) => sum + item.valor_total, 0) || 0;
      const totalUtilizado = orcamentos?.reduce((sum, item) => sum + item.valor_utilizado, 0) || 0;
      const totalReservado = orcamentos?.reduce((sum, item) => sum + item.valor_reservado, 0) || 0;
      const totalDisponivel = orcamentos?.reduce((sum, item) => sum + item.valor_disponivel, 0) || 0;
      const porcentagemUtilizada = totalOrcamento > 0 ? ((totalUtilizado + totalReservado) / totalOrcamento) * 100 : 0;

      const centrosCustoComProblema = orcamentos?.filter(item => {
        const percentualUsado = ((item.valor_utilizado + item.valor_reservado) / item.valor_total) * 100;
        return percentualUsado >= 80;
      }).length || 0;

      const dadosGrafico = orcamentos?.map(item => ({
        nome: item.centro_custo,
        orcado: item.valor_total,
        utilizado: item.valor_utilizado,
        reservado: item.valor_reservado,
        disponivel: item.valor_disponivel
      })) || [];

      setData({
        totalOrcamento,
        totalUtilizado,
        totalReservado,
        totalDisponivel,
        porcentagemUtilizada,
        centrosCustoComProblema,
        dadosGrafico
      });
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const dadosPizza = [
    { name: 'Utilizado', value: data.totalUtilizado, color: '#ef4444' },
    { name: 'Reservado', value: data.totalReservado, color: '#f59e0b' },
    { name: 'Disponível', value: data.totalDisponivel, color: '#10b981' }
  ];

  if (loading) {
    return <div className="p-6">Carregando dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orçamento Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {data.totalOrcamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Para o ano {new Date().getFullYear()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilizado</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {data.totalUtilizado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {((data.totalUtilizado / data.totalOrcamento) * 100).toFixed(1)}% do orçamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservado</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {data.totalReservado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {((data.totalReservado / data.totalOrcamento) * 100).toFixed(1)}% do orçamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponível</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {data.totalDisponivel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {((data.totalDisponivel / data.totalOrcamento) * 100).toFixed(1)}% do orçamento
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Utilização por Centro de Custo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.dadosGrafico}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nome" />
                <YAxis />
                <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                <Bar dataKey="orcado" fill="#e5e7eb" name="Orçado" />
                <Bar dataKey="utilizado" fill="#ef4444" name="Utilizado" />
                <Bar dataKey="reservado" fill="#f59e0b" name="Reservado" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição do Orçamento</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dadosPizza}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dadosPizza.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumo Executivo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Utilização Total do Orçamento</span>
              <Badge variant={data.porcentagemUtilizada >= 95 ? 'destructive' : data.porcentagemUtilizada >= 80 ? 'secondary' : 'default'}>
                {data.porcentagemUtilizada.toFixed(1)}%
              </Badge>
            </div>
            <Progress value={data.porcentagemUtilizada} className="h-2" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Centros de Custo em Alerta:</span>
                  <span className="font-medium">{data.centrosCustoComProblema}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Taxa de Utilização:</span>
                  <span className="font-medium">{data.porcentagemUtilizada.toFixed(1)}%</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Economia Potencial:</span>
                  <span className="font-medium text-green-600">
                    R$ {(data.totalDisponivel).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Comprometimento:</span>
                  <span className="font-medium">
                    R$ {(data.totalUtilizado + data.totalReservado).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

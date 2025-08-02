
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, BarChart3, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RelatorioItem {
  id: string;
  centro_custo: string;
  categoria?: string;
  projeto?: string;
  valor_total: number;
  valor_utilizado: number;
  valor_reservado: number;
  valor_disponivel: number;
  percentual_utilizado: number;
  status: 'normal' | 'atencao' | 'critico';
}

export const RelatoriosOrcamentario = () => {
  const [dados, setDados] = useState<RelatorioItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [tipoRelatorio, setTipoRelatorio] = useState('situacao_atual');
  const [filtroAno, setFiltroAno] = useState(new Date().getFullYear().toString());
  const { toast } = useToast();

  useEffect(() => {
    carregarDados();
  }, [filtroAno]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const { data: orcamentos, error } = await supabase
        .from('orcamentos')
        .select('*')
        .eq('ano', parseInt(filtroAno))
        .order('centro_custo');

      if (error) throw error;

      const dadosProcessados = orcamentos?.map(item => {
        const percentual_utilizado = ((item.valor_utilizado + item.valor_reservado) / item.valor_total) * 100;
        let status: 'normal' | 'atencao' | 'critico' = 'normal';
        
        if (percentual_utilizado >= 95) status = 'critico';
        else if (percentual_utilizado >= 80) status = 'atencao';

        return {
          id: item.id,
          centro_custo: item.centro_custo,
          categoria: item.categoria,
          projeto: item.projeto,
          valor_total: item.valor_total,
          valor_utilizado: item.valor_utilizado,
          valor_reservado: item.valor_reservado,
          valor_disponivel: item.valor_disponivel,
          percentual_utilizado,
          status
        };
      }) || [];

      setDados(dadosProcessados);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do relatório.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportarRelatorio = async (formato: 'csv' | 'pdf') => {
    try {
      if (formato === 'csv') {
        const headers = ['Centro de Custo', 'Categoria', 'Projeto', 'Valor Total', 'Valor Utilizado', 'Valor Reservado', 'Valor Disponível', 'Percentual Utilizado', 'Status'];
        const csvContent = [
          headers.join(','),
          ...dados.map(item => [
            item.centro_custo,
            item.categoria || '',
            item.projeto || '',
            item.valor_total,
            item.valor_utilizado,
            item.valor_reservado,
            item.valor_disponivel,
            item.percentual_utilizado.toFixed(2) + '%',
            item.status
          ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `relatorio_orcamentario_${filtroAno}.csv`;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        toast({
          title: "Info",
          description: "Exportação em PDF será implementada em breve.",
        });
      }
    } catch (error) {
      console.error('Erro ao exportar relatório:', error);
      toast({
        title: "Erro",
        description: "Não foi possível exportar o relatório.",
        variant: "destructive",
      });
    }
  };

  const getTotalGeral = () => {
    return dados.reduce((acc, item) => ({
      valor_total: acc.valor_total + item.valor_total,
      valor_utilizado: acc.valor_utilizado + item.valor_utilizado,
      valor_reservado: acc.valor_reservado + item.valor_reservado,
      valor_disponivel: acc.valor_disponivel + item.valor_disponivel
    }), { valor_total: 0, valor_utilizado: 0, valor_reservado: 0, valor_disponivel: 0 });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'critico':
        return <Badge variant="destructive">Crítico</Badge>;
      case 'atencao':
        return <Badge variant="secondary">Atenção</Badge>;
      default:
        return <Badge variant="default">Normal</Badge>;
    }
  };

  const totalGeral = getTotalGeral();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Relatórios Orçamentários</h2>
        <div className="flex gap-2">
          <Select value={filtroAno} onValueChange={setFiltroAno}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2026">2026</SelectItem>
            </SelectContent>
          </Select>
          <Select value={tipoRelatorio} onValueChange={setTipoRelatorio}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Tipo de Relatório" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="situacao_atual">Situação Atual</SelectItem>
              <SelectItem value="historico_consumo">Histórico de Consumo</SelectItem>
              <SelectItem value="projecoes">Projeções</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => exportarRelatorio('csv')} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button onClick={() => exportarRelatorio('pdf')} variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Orçado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {totalGeral.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Utilizado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {totalGeral.valor_utilizado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Reservado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              R$ {totalGeral.valor_reservado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Disponível</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {totalGeral.valor_disponivel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Relatório Detalhado - {filtroAno}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Centro de Custo</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Projeto</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Utilizado</TableHead>
                <TableHead>Reservado</TableHead>
                <TableHead>Disponível</TableHead>
                <TableHead>% Utilizado</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dados.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.centro_custo}</TableCell>
                  <TableCell>{item.categoria || '-'}</TableCell>
                  <TableCell>{item.projeto || '-'}</TableCell>
                  <TableCell>R$ {item.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>R$ {item.valor_utilizado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>R$ {item.valor_reservado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>R$ {item.valor_disponivel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>{item.percentual_utilizado.toFixed(1)}%</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resumo Executivo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold">Indicadores Gerais</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Centros de Custo Monitorados:</span>
                  <span className="font-medium">{dados.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status Crítico:</span>
                  <span className="font-medium text-red-600">{dados.filter(d => d.status === 'critico').length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status Atenção:</span>
                  <span className="font-medium text-yellow-600">{dados.filter(d => d.status === 'atencao').length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status Normal:</span>
                  <span className="font-medium text-green-600">{dados.filter(d => d.status === 'normal').length}</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Performance Orçamentária</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Taxa de Utilização Média:</span>
                  <span className="font-medium">
                    {dados.length > 0 ? (dados.reduce((acc, item) => acc + item.percentual_utilizado, 0) / dados.length).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Maior Utilização:</span>
                  <span className="font-medium">
                    {dados.length > 0 ? Math.max(...dados.map(d => d.percentual_utilizado)).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Menor Utilização:</span>
                  <span className="font-medium">
                    {dados.length > 0 ? Math.min(...dados.map(d => d.percentual_utilizado)).toFixed(1) : 0}%
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

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  BarChart3, 
  Download, 
  FileText, 
  TrendingUp, 
  PieChart,
  Calendar,
  DollarSign,
  ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { addDays } from "date-fns";
import type { DateRange } from "react-day-picker";

export default function RelatoriosPedidos() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [filtros, setFiltros] = useState({
    periodo: addDays(new Date(), -30),
    status: '',
    tipo: '',
    valorMinimo: '',
    valorMaximo: '',
    centroCusto: ''
  });
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date()
  });

  const handleExportarRelatorio = async (formato: 'xlsx' | 'csv' | 'pdf') => {
    toast({
      title: "Gerando Relatório",
      description: `Preparando relatório em ${formato.toUpperCase()}...`,
    });

    try {
      let endpoint = '';
      if (formato === 'pdf') {
        endpoint = 'gerar-relatorio-pedidos-pdf';
      } else {
        endpoint = 'exportar-pedidos';
      }

      const response = await fetch(`https://lktdauwdmadjdnfbwnge.supabase.co/functions/v1/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ 
          filtros: {
            ...filtros,
            dataInicio: dateRange?.from?.toISOString(),
            dataFim: dateRange?.to?.toISOString(),
            valorMinimo: filtros.valorMinimo ? parseFloat(filtros.valorMinimo) : undefined,
            valorMaximo: filtros.valorMaximo ? parseFloat(filtros.valorMaximo) : undefined
          },
          formato
        })
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Relatorio-Pedidos-${new Date().toISOString().split('T')[0]}.${formato}`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast({
          title: "Sucesso",
          description: `Relatório ${formato.toUpperCase()} gerado com sucesso!`,
        });
      } else {
        throw new Error('Erro na geração do relatório');
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao gerar relatório",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/pedidos')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-primary" />
              Relatórios de Pedidos
            </h1>
            <p className="text-muted-foreground">
              Análises avançadas e exportação de dados de pedidos
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Filtros do Relatório
            </CardTitle>
            <CardDescription>
              Configure os parâmetros para gerar seu relatório personalizado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Período</Label>
              <DatePickerWithRange
                date={dateRange}
                onDateChange={setDateRange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={filtros.status} onValueChange={(value) => setFiltros(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="rascunho">Rascunho</SelectItem>
                    <SelectItem value="aguardando_aprovacao">Aguardando Aprovação</SelectItem>
                    <SelectItem value="aprovado">Aprovado</SelectItem>
                    <SelectItem value="enviado">Enviado</SelectItem>
                    <SelectItem value="confirmado">Confirmado</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={filtros.tipo} onValueChange={(value) => setFiltros(prev => ({ ...prev, tipo: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="material">Material</SelectItem>
                    <SelectItem value="servico">Serviço</SelectItem>
                    <SelectItem value="bem_permanente">Bem Permanente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valor Mínimo</Label>
                <Input
                  type="number"
                  placeholder="0,00"
                  value={filtros.valorMinimo}
                  onChange={(e) => setFiltros(prev => ({ ...prev, valorMinimo: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Valor Máximo</Label>
                <Input
                  type="number"
                  placeholder="999999,99"
                  value={filtros.valorMaximo}
                  onChange={(e) => setFiltros(prev => ({ ...prev, valorMaximo: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Centro de Custo</Label>
              <Input
                placeholder="Digite o centro de custo"
                value={filtros.centroCusto}
                onChange={(e) => setFiltros(prev => ({ ...prev, centroCusto: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Opções de Exportação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Exportar Relatório
            </CardTitle>
            <CardDescription>
              Escolha o formato de exportação desejado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Button 
                onClick={() => handleExportarRelatorio('xlsx')} 
                className="w-full justify-start gap-3 h-12"
              >
                <FileText className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Excel (.xlsx)</div>
                  <div className="text-sm opacity-70">Planilha completa com dados detalhados</div>
                </div>
              </Button>

              <Button 
                onClick={() => handleExportarRelatorio('csv')} 
                variant="outline"
                className="w-full justify-start gap-3 h-12"
              >
                <FileText className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">CSV (.csv)</div>
                  <div className="text-sm opacity-70">Formato universal para análise</div>
                </div>
              </Button>

              <Button 
                onClick={() => handleExportarRelatorio('pdf')} 
                variant="outline"
                className="w-full justify-start gap-3 h-12"
              >
                <FileText className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">PDF (.pdf)</div>
                  <div className="text-sm opacity-70">Relatório formatado para apresentação</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Relatórios Rápidos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Relatórios Rápidos
          </CardTitle>
          <CardDescription>
            Relatórios pré-configurados mais utilizados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => handleExportarRelatorio('xlsx')}
            >
              <DollarSign className="h-6 w-6" />
              <span className="text-sm">Relatório Financeiro</span>
            </Button>

            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => handleExportarRelatorio('xlsx')}
            >
              <PieChart className="h-6 w-6" />
              <span className="text-sm">Por Status</span>
            </Button>

            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => handleExportarRelatorio('xlsx')}
            >
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm">Performance Mensal</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
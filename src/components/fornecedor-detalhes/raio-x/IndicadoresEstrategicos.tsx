
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Fornecedor } from "@/types/fornecedor";
import { TrendingUp, TrendingDown, Clock, DollarSign, Target, Award } from "lucide-react";

interface IndicadoresEstrategicosProps {
  fornecedor: Fornecedor;
}

export const IndicadoresEstrategicos = ({ fornecedor }: IndicadoresEstrategicosProps) => {
  // Mock de dados realistas baseados no fornecedor
  const indicadores = {
    totalMovimentado: 1245000,
    numeroPedidos: 5,
    ticketMedio: 249000,
    numeroCotacoes: 12,
    numeroPremiacao: 6,
    categoriasAtendidas: ["MRO", "Serviços Técnicos", "Infraestrutura"],
    tempoMedioResposta: 3.5,
    tempoAte1Pedido: 20,
    slaMedioEntrega: 4.5,
    savingMedio: 7.3,
    ultimaParticipacao: "01/07/2025"
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarPercentual = (valor: number) => {
    return `${valor.toFixed(1)}%`;
  };

  const getCorSaving = (saving: number) => {
    if (saving >= 10) return "text-green-600";
    if (saving >= 5) return "text-amber-600";
    return "text-red-600";
  };

  const getCorSLA = (sla: number) => {
    if (sla <= 3) return "text-green-600";
    if (sla <= 5) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Total Movimentado */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Total Movimentado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatarMoeda(indicadores.totalMovimentado)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Soma dos pedidos emitidos
          </p>
        </CardContent>
      </Card>

      {/* Número de Pedidos */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Nº de Pedidos Emitidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {indicadores.numeroPedidos}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Somatória real
          </p>
        </CardContent>
      </Card>

      {/* Ticket Médio */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  🎯 Ticket Médio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {formatarMoeda(indicadores.ticketMedio)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total movimentado ÷ Nº de pedidos
                </p>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>Fórmula: R$ {indicadores.totalMovimentado.toLocaleString()} ÷ {indicadores.numeroPedidos} = {formatarMoeda(indicadores.ticketMedio)}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Número de Cotações */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Nº de Cotações Recebidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {indicadores.numeroCotacoes}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Histórico real
          </p>
        </CardContent>
      </Card>

      {/* Número de Premiações */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Award className="h-4 w-4" />
            Nº de Premiações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-600">
            {indicadores.numeroPremiacao}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Quantas vezes venceu uma cotação
          </p>
        </CardContent>
      </Card>

      {/* Categorias Atendidas */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Categorias Atendidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1">
            {indicadores.categoriasAtendidas.map((categoria, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {categoria}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tempo Médio de Resposta */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Tempo Médio de Resposta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {indicadores.tempoMedioResposta} dias
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Média entre convite e envio de cotação
          </p>
        </CardContent>
      </Card>

      {/* Tempo até 1º Pedido */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Tempo até 1º Pedido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {indicadores.tempoAte1Pedido} dias
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Data 1º pedido - data cadastro
          </p>
        </CardContent>
      </Card>

      {/* SLA Médio de Entrega */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  ⏱ SLA Médio de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getCorSLA(indicadores.slaMedioEntrega)}`}>
                  {indicadores.slaMedioEntrega} dias
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Baseado nos dados de pedido vs. entrega
                </p>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1">
              <p>SLA de Entrega:</p>
              <p className="text-green-600">• ≤ 3 dias: Excelente</p>
              <p className="text-amber-600">• 3-5 dias: Bom</p>
              <p className="text-red-600">• {'>'} 5 dias: Atenção</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Saving Médio */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  💰 Saving Médio (%)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getCorSaving(indicadores.savingMedio)}`}>
                  {formatarPercentual(indicadores.savingMedio)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Economia vs. menor cotação
                </p>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1">
              <p>Fórmula do Saving:</p>
              <p className="text-xs">((menor cotação - cotação vencedora) / menor cotação) × 100</p>
              <p className="text-xs mt-2">Exemplo:</p>
              <p className="text-xs">Menor: R$ 100.000 | Vencedora: R$ 93.000</p>
              <p className="text-xs">Saving: (100.000 - 93.000) / 100.000 = 7%</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Última Participação */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Última Participação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {indicadores.ultimaParticipacao}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Pode ser cotação ou pedido
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

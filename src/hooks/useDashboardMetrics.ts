
import { useQuery } from '@tanstack/react-query';
import { dashboardDataHistorico, DashboardMetrics } from '@/data/dashboardData';
import { FiltrosAvancados, filtrarDados } from '@/utils/filtrosUtils';

export const useDashboardMetrics = (filtros: FiltrosAvancados) => {
  const { data: metricas, isLoading } = useQuery({
    queryKey: ['dashboard-metrics', filtros],
    queryFn: async (): Promise<DashboardMetrics[]> => {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Aplicar filtros aos dados
      const dadosFiltrados = filtrarDados(dashboardDataHistorico, filtros);
      
      return dadosFiltrados;
    },
    refetchInterval: 300000 // Refetch a cada 5 minutos
  });

  // Agregar métricas por período quando múltiplos clientes estão selecionados
  const agregaMetricasPorPeriodo = (dados: DashboardMetrics[]): DashboardMetrics[] => {
    const agrupado = dados.reduce((acc, item) => {
      const key = item.periodo;
      if (!acc[key]) {
        acc[key] = {
          periodo: item.periodo,
          cliente: 'agregado',
          documentos: { validos: 0, pendentes: 0, vencidos: 0 },
          sla: { percentual: 0, totalEntregas: 0, comAtraso: 0, atrasoMaior5Dias: 0 },
          alertas: { nfForaPadrao: 0, documentacaoVencida: 0, entregaDivergencia: 0 },
          insights: {
            sugestaoContrato: { visualizado: 0, aplicado: 0, ignorado: 0 },
            revisaoPreco: { visualizado: 0, aplicado: 0, ignorado: 0 },
            reenvioDocumento: { visualizado: 0, aplicado: 0, ignorado: 0 }
          },
          pedidos: { quantidade: 0, valorTotal: 0 },
          faturamento: { anual: 0 },
          _count: 0
        };
      }

      // Somar valores
      acc[key].documentos.validos += item.documentos.validos;
      acc[key].documentos.pendentes += item.documentos.pendentes;
      acc[key].documentos.vencidos += item.documentos.vencidos;
      acc[key].sla.totalEntregas += item.sla.totalEntregas;
      acc[key].sla.comAtraso += item.sla.comAtraso;
      acc[key].sla.atrasoMaior5Dias += item.sla.atrasoMaior5Dias;
      acc[key].alertas.nfForaPadrao += item.alertas.nfForaPadrao;
      acc[key].alertas.documentacaoVencida += item.alertas.documentacaoVencida;
      acc[key].alertas.entregaDivergencia += item.alertas.entregaDivergencia;
      acc[key].insights.sugestaoContrato.visualizado += item.insights.sugestaoContrato.visualizado;
      acc[key].insights.sugestaoContrato.aplicado += item.insights.sugestaoContrato.aplicado;
      acc[key].insights.sugestaoContrato.ignorado += item.insights.sugestaoContrato.ignorado;
      acc[key].insights.revisaoPreco.visualizado += item.insights.revisaoPreco.visualizado;
      acc[key].insights.revisaoPreco.aplicado += item.insights.revisaoPreco.aplicado;
      acc[key].insights.revisaoPreco.ignorado += item.insights.revisaoPreco.ignorado;
      acc[key].insights.reenvioDocumento.visualizado += item.insights.reenvioDocumento.visualizado;
      acc[key].insights.reenvioDocumento.aplicado += item.insights.reenvioDocumento.aplicado;
      acc[key].insights.reenvioDocumento.ignorado += item.insights.reenvioDocumento.ignorado;
      acc[key].pedidos.quantidade += item.pedidos.quantidade;
      acc[key].pedidos.valorTotal += item.pedidos.valorTotal;
      acc[key].faturamento.anual += item.faturamento.anual;
      acc[key]._count += 1;

      return acc;
    }, {} as any);

    // Calcular médias onde necessário
    return Object.values(agrupado).map((item: any) => ({
      ...item,
      sla: {
        ...item.sla,
        percentual: item.sla.totalEntregas > 0 
          ? Math.round(((item.sla.totalEntregas - item.sla.comAtraso) / item.sla.totalEntregas) * 100)
          : 0
      }
    }));
  };

  const metricasProcessadas = metricas && filtros.clientes.length > 1 
    ? agregaMetricasPorPeriodo(metricas)
    : metricas || [];

  const metricsAtual = metricasProcessadas[metricasProcessadas.length - 1];
  const metricsAnterior = metricasProcessadas[metricasProcessadas.length - 2];

  return {
    metricas: metricasProcessadas,
    metricsAtual,
    metricsAnterior,
    isLoading,
    dadosBrutos: metricas || []
  };
};

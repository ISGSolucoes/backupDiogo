
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { FiltrosAvancados } from '@/components/portal-fornecedor/dashboard/FiltrosAvancados';
import { DashboardMetricas } from '@/components/portal-fornecedor/dashboard/DashboardMetricas';
import { GraficoDocumentosEvoluacao } from '@/components/portal-fornecedor/dashboard/GraficoDocumentosEvoluacao';
import { GraficoSLAEntregas } from '@/components/portal-fornecedor/dashboard/GraficoSLAEntregas';
import { GraficoAlertasFrequencia } from '@/components/portal-fornecedor/dashboard/GraficoAlertasFrequencia';
import { GraficoInsightsIA } from '@/components/portal-fornecedor/dashboard/GraficoInsightsIA';
import { GraficoPedidosVolume } from '@/components/portal-fornecedor/dashboard/GraficoPedidosVolume';
import { GraficoFaturamento } from '@/components/portal-fornecedor/dashboard/GraficoFaturamento';
import { GraficoClientesPerformance } from '@/components/portal-fornecedor/dashboard/GraficoClientesPerformance';
import { InsightsIA } from '@/components/portal-fornecedor/dashboard/InsightsIA';
import { filtrosIniciais } from '@/utils/filtrosUtils';

const PortalFornecedorDashboard = () => {
  const [filtros, setFiltros] = useState(filtrosIniciais);

  const { metricas, metricsAtual, metricsAnterior, isLoading, dadosBrutos } = useDashboardMetrics(filtros);

  const handleExportar = (formato: 'pdf' | 'csv' | 'excel') => {
    console.log(`Exportando dashboard em formato: ${formato}`);
    // Implementar lógica de exportação
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/portal-fornecedor">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white">📈 Dashboard Avançado</h1>
                <p className="text-white/90">Análise detalhada da sua performance</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportar('pdf')}
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportar('excel')}
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar Excel
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filtros Avançados */}
        <FiltrosAvancados
          filtros={filtros}
          onFiltrosChange={setFiltros}
          dadosDisponiveis={dadosBrutos}
        />

        {/* Métricas Principais */}
        <DashboardMetricas
          metricsAtual={metricsAtual}
          metricsAnterior={metricsAnterior}
        />

        {/* Insights da IA */}
        <InsightsIA
          metricsAtual={metricsAtual}
          metricsAnterior={metricsAnterior}
        />

        {/* Gráfico de Clientes */}
        <div className="mb-8">
          <GraficoClientesPerformance data={dadosBrutos} />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <GraficoDocumentosEvoluacao data={metricas || []} />
          <GraficoSLAEntregas data={metricas || []} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <GraficoAlertasFrequencia data={metricas || []} />
          <GraficoInsightsIA data={metricas || []} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <GraficoPedidosVolume data={metricas || []} />
          <GraficoFaturamento data={metricas || []} />
        </div>
      </div>
    </div>
  );
};

export default PortalFornecedorDashboard;

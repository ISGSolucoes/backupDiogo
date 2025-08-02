
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Filter, Calendar, Users, TrendingUp, X } from 'lucide-react';
import { FiltrosAvancados as FiltrosType } from '@/utils/filtrosUtils';
import { clientesDisponiveis } from '@/data/dashboardData';
import { 
  obterAnosDisponiveis, 
  obterMesesDisponiveis, 
  obterTrimestresDisponiveis,
  aplicarFiltrosRapidos 
} from '@/utils/filtrosUtils';

interface FiltrosAvancadosProps {
  filtros: FiltrosType;
  onFiltrosChange: (filtros: FiltrosType) => void;
  dadosDisponiveis: any[];
}

export const FiltrosAvancados = ({ filtros, onFiltrosChange, dadosDisponiveis }: FiltrosAvancadosProps) => {
  const anos = obterAnosDisponiveis(dadosDisponiveis);
  const meses = obterMesesDisponiveis();
  const trimestres = obterTrimestresDisponiveis();

  const handleFiltroChange = (campo: keyof FiltrosType, valor: any) => {
    onFiltrosChange({ ...filtros, [campo]: valor });
  };

  const handleClienteToggle = (clienteId: string) => {
    const novosClientes = filtros.clientes.includes(clienteId)
      ? filtros.clientes.filter(id => id !== clienteId)
      : [...filtros.clientes, clienteId];
    
    handleFiltroChange('clientes', novosClientes);
  };

  const handlePeriodoCustomizado = (campo: 'dataInicio' | 'dataFim', valor: string) => {
    handleFiltroChange('periodoCustomizado', {
      ...filtros.periodoCustomizado,
      [campo]: valor
    });
  };

  const handleFiltroRapido = (tipo: 'ultimo-trimestre' | 'ytd' | 'ultimos-12-meses') => {
    const novosFiltros = aplicarFiltrosRapidos(tipo);
    onFiltrosChange({ ...filtros, ...novosFiltros });
  };

  const limparFiltros = () => {
    onFiltrosChange({
      ano: '',
      mes: '',
      trimestre: '',
      clientes: [],
      periodoCustomizado: { dataInicio: '', dataFim: '' },
      comparativo: 'nenhum'
    });
  };

  const getFiltrosAtivos = () => {
    let ativos = 0;
    if (filtros.ano) ativos++;
    if (filtros.mes) ativos++;
    if (filtros.trimestre) ativos++;
    if (filtros.clientes.length > 0) ativos++;
    if (filtros.periodoCustomizado.dataInicio || filtros.periodoCustomizado.dataFim) ativos++;
    return ativos;
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">Filtros Avançados</span>
              {getFiltrosAtivos() > 0 && (
                <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                  {getFiltrosAtivos()} filtro{getFiltrosAtivos() > 1 ? 's' : ''} ativo{getFiltrosAtivos() > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={limparFiltros}>
              <X className="w-4 h-4 mr-2" />
              Limpar
            </Button>
          </div>

          {/* Filtros Rápidos */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-muted-foreground">Filtros Rápidos:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFiltroRapido('ultimo-trimestre')}
              className="h-8"
            >
              Último Trimestre
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFiltroRapido('ytd')}
              className="h-8"
            >
              YTD
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFiltroRapido('ultimos-12-meses')}
              className="h-8"
            >
              Últimos 12 meses
            </Button>
          </div>

          {/* Filtros Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filtro por Ano */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Ano</label>
              <select
                value={filtros.ano}
                onChange={(e) => handleFiltroChange('ano', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary"
              >
                <option value="">Todos os anos</option>
                {anos.map(ano => (
                  <option key={ano} value={ano}>{ano}</option>
                ))}
              </select>
            </div>

            {/* Filtro por Mês */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Mês</label>
              <select
                value={filtros.mes}
                onChange={(e) => handleFiltroChange('mes', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary"
              >
                <option value="">Todos os meses</option>
                {meses.map(mes => (
                  <option key={mes.valor} value={mes.valor}>{mes.label}</option>
                ))}
              </select>
            </div>

            {/* Filtro por Trimestre */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Trimestre</label>
              <select
                value={filtros.trimestre}
                onChange={(e) => handleFiltroChange('trimestre', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary"
              >
                <option value="">Todos os trimestres</option>
                {trimestres.map(trim => (
                  <option key={trim.valor} value={trim.valor}>{trim.label}</option>
                ))}
              </select>
            </div>

            {/* Filtro de Comparativo */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Comparativo</label>
              <select
                value={filtros.comparativo}
                onChange={(e) => handleFiltroChange('comparativo', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary"
              >
                <option value="nenhum">Nenhum</option>
                <option value="periodo-anterior">Período Anterior</option>
                <option value="ano-anterior">Mesmo Período Ano Anterior</option>
              </select>
            </div>
          </div>

          {/* Filtro por Clientes */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <label className="text-sm font-medium">Clientes</label>
            </div>
            <div className="flex flex-wrap gap-2">
              {clientesDisponiveis.map(cliente => (
                <button
                  key={cliente.id}
                  onClick={() => handleClienteToggle(cliente.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    filtros.clientes.includes(cliente.id)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-foreground border-border hover:bg-muted'
                  }`}
                >
                  {cliente.nome}
                </button>
              ))}
            </div>
          </div>

          {/* Período Customizado */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <label className="text-sm font-medium">Período Customizado</label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Data Início</label>
                <input
                  type="date"
                  value={filtros.periodoCustomizado.dataInicio}
                  onChange={(e) => handlePeriodoCustomizado('dataInicio', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Data Fim</label>
                <input
                  type="date"
                  value={filtros.periodoCustomizado.dataFim}
                  onChange={(e) => handlePeriodoCustomizado('dataFim', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

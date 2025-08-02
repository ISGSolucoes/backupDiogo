
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Filter, Calendar } from 'lucide-react';

interface FiltrosPeriodoProps {
  filtros: {
    periodo: string;
    cliente: string;
  };
  onFiltrosChange: (filtros: { periodo: string; cliente: string }) => void;
}

export const FiltrosPeriodo = ({ filtros, onFiltrosChange }: FiltrosPeriodoProps) => {
  const handlePeriodoChange = (periodo: string) => {
    onFiltrosChange({ ...filtros, periodo });
  };

  const handleClienteChange = (cliente: string) => {
    onFiltrosChange({ ...filtros, cliente });
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">Filtros:</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <select
              value={filtros.periodo}
              onChange={(e) => handlePeriodoChange(e.target.value)}
              className="px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary"
            >
              <option value="">Todos os Períodos</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2025-01">Janeiro 2025</option>
              <option value="2024-12">Dezembro 2024</option>
              <option value="2024-11">Novembro 2024</option>
              <option value="2024-10">Outubro 2024</option>
            </select>
          </div>

          <select
            value={filtros.cliente}
            onChange={(e) => handleClienteChange(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary"
          >
            <option value="todos">Todos os Clientes</option>
            <option value="petrobras">Petrobras S.A.</option>
            <option value="vale">Vale S.A.</option>
            <option value="ambev">Ambev S.A.</option>
            <option value="jbs">JBS S.A.</option>
          </select>

          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => onFiltrosChange({ periodo: '', cliente: 'todos' })}
              className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

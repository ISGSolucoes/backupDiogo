import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, Calendar } from 'lucide-react';

export const FiltrosMetas = () => {
  const [filtrosAtivos, setFiltrosAtivos] = useState<Record<string, string>>({});
  const [busca, setBusca] = useState('');

  const adicionarFiltro = (tipo: string, valor: string) => {
    setFiltrosAtivos(prev => ({
      ...prev,
      [tipo]: valor
    }));
  };

  const removerFiltro = (tipo: string) => {
    setFiltrosAtivos(prev => {
      const novos = { ...prev };
      delete novos[tipo];
      return novos;
    });
  };

  const limparFiltros = () => {
    setFiltrosAtivos({});
    setBusca('');
  };

  return (
    <Card className="border-slate-200">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Busca e Filtros Principais */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Buscar metas..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <Select onValueChange={(value) => adicionarFiltro('status', value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="verde">✅ No Prazo</SelectItem>
                  <SelectItem value="amarelo">⚠️ Atenção</SelectItem>
                  <SelectItem value="vermelho">🚨 Crítica</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => adicionarFiltro('categoria', value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="requisicao">Requisições</SelectItem>
                  <SelectItem value="pedido">Pedidos</SelectItem>
                  <SelectItem value="sourcing">Sourcing</SelectItem>
                  <SelectItem value="fornecedor">Fornecedores</SelectItem>
                  <SelectItem value="contrato">Contratos</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => adicionarFiltro('responsavel', value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Responsável" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="joao_silva">João Silva</SelectItem>
                  <SelectItem value="maria_santos">Maria Santos</SelectItem>
                  <SelectItem value="pedro_costa">Pedro Costa</SelectItem>
                  <SelectItem value="equipe_sourcing">Equipe Sourcing</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => adicionarFiltro('periodo', value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="este_mes">Este Mês</SelectItem>
                  <SelectItem value="trimestre_atual">Trimestre Atual</SelectItem>
                  <SelectItem value="este_ano">Este Ano</SelectItem>
                  <SelectItem value="personalizado">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filtros Ativos */}
          {Object.keys(filtrosAtivos).length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-slate-600 flex items-center gap-1">
                <Filter className="h-4 w-4" />
                Filtros ativos:
              </span>
              
              {Object.entries(filtrosAtivos).map(([tipo, valor]) => (
                <Badge key={tipo} variant="secondary" className="gap-1">
                  {tipo}: {valor}
                  <button
                    onClick={() => removerFiltro(tipo)}
                    className="ml-1 hover:bg-slate-300 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}

              <Button
                variant="ghost"
                size="sm"
                onClick={limparFiltros}
                className="text-slate-600 hover:text-slate-900"
              >
                Limpar todos
              </Button>
            </div>
          )}

          {/* Filtros Rápidos */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-slate-600">Filtros rápidos:</span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => adicionarFiltro('status', 'vermelho')}
              className="h-7 text-xs"
            >
              🚨 Metas Críticas
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => adicionarFiltro('periodo', 'este_mes')}
              className="h-7 text-xs"
            >
              <Calendar className="h-3 w-3 mr-1" />
              Este Mês
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => adicionarFiltro('categoria', 'sourcing')}
              className="h-7 text-xs"
            >
              💰 Saving
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => adicionarFiltro('status', 'verde')}
              className="h-7 text-xs"
            >
              ✅ No Prazo
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
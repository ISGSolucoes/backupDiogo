
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";

interface FiltroCategoriasProps {
  filtros: {
    busca: string;
    criticidade: string;
    responsavel: string;
    status: string;
  };
  onFiltrosChange: (filtros: any) => void;
}

export const FiltroCategorias = ({ filtros, onFiltrosChange }: FiltroCategoriasProps) => {
  const limparFiltros = () => {
    onFiltrosChange({
      busca: "",
      criticidade: "",
      responsavel: "",
      status: ""
    });
  };

  const temFiltrosAtivos = Object.values(filtros).some(valor => valor !== "");

  return (
    <div className="bg-white p-4 rounded-lg border border-slate-200">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-slate-700">
          <Filter className="h-4 w-4" />
          <span className="font-medium">Filtros:</span>
        </div>

        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar categoria..."
            value={filtros.busca}
            onChange={(e) => onFiltrosChange({ ...filtros, busca: e.target.value })}
            className="pl-10"
          />
        </div>

        <Select
          value={filtros.criticidade}
          onValueChange={(value) => onFiltrosChange({ ...filtros, criticidade: value })}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Criticidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="baixo">Baixo</SelectItem>
            <SelectItem value="medio">Médio</SelectItem>
            <SelectItem value="alto">Alto</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filtros.status}
          onValueChange={(value) => onFiltrosChange({ ...filtros, status: value })}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status Revisão" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="verde">Verde</SelectItem>
            <SelectItem value="amarelo">Amarelo</SelectItem>
            <SelectItem value="vermelho">Vermelho</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Responsável"
          value={filtros.responsavel}
          onChange={(e) => onFiltrosChange({ ...filtros, responsavel: e.target.value })}
          className="w-40"
        />

        {temFiltrosAtivos && (
          <Button
            variant="outline"
            size="sm"
            onClick={limparFiltros}
            className="text-slate-600"
          >
            <X className="mr-2 h-4 w-4" />
            Limpar
          </Button>
        )}
      </div>
    </div>
  );
};

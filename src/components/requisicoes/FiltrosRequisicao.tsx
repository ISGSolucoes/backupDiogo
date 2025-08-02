
import React, { useState } from "react";
import { Filter, Download, BarChart4, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { AnaliseDeGargalos } from "./AnaliseDeGargalos";

interface FiltrosRequisicaoProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const FiltrosRequisicao = ({ searchTerm, onSearchChange }: FiltrosRequisicaoProps) => {
  const [analiseGargalosAberta, setAnaliseGargalosAberta] = useState(false);
  
  const handleFiltrarAvancado = () => {
    toast.info("Filtro avançado (implementação futura)");
  };

  const handleExportar = () => {
    toast.success("Exportando dados de requisições");
  };

  const handleAnalisarGargalos = () => {
    setAnaliseGargalosAberta(true);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-4 rounded-lg border border-slate-200">
        <div className="w-full sm:w-72 relative">
          <Input
            placeholder="Buscar requisição..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9"
          />
          <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={handleFiltrarAvancado}>
            <Filter className="h-4 w-4 mr-1" /> Filtrar
          </Button>
          <Button variant="outline" onClick={handleExportar}>
            <Download className="h-4 w-4 mr-1" /> Exportar
          </Button>
          <Button variant="outline" onClick={handleAnalisarGargalos}>
            <BarChart4 className="h-4 w-4 mr-1" /> Análise de Gargalos
          </Button>
        </div>
      </div>
      
      <AnaliseDeGargalos 
        open={analiseGargalosAberta} 
        onOpenChange={setAnaliseGargalosAberta} 
      />
    </>
  );
};

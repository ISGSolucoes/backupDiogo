
import React, { useState } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { FiltrosDocumentos } from "@/types/documentos";

export interface FiltroDocumentosProps {
  filtros?: FiltrosDocumentos;
  onFiltroChange?: (filtros: FiltrosDocumentos) => void;
  onFiltrar?: (novosFiltros: FiltrosDocumentos) => void;
}

export const FiltroDocumentos = ({ filtros = { termo: "", tipo: "", status: "" }, onFiltroChange, onFiltrar }: FiltroDocumentosProps) => {
  const [termoLocal, setTermoLocal] = React.useState(filtros.termo || "");
  
  const handleFilterChange = (key: keyof FiltrosDocumentos, value: string) => {
    if (onFiltroChange) {
      onFiltroChange({
        ...filtros,
        [key]: value,
      });
    }
    
    if (onFiltrar) {
      onFiltrar({
        ...filtros,
        [key]: value,
      });
    }
  };
  
  const handleSearch = () => {
    if (onFiltroChange) {
      onFiltroChange({
        ...filtros,
        termo: termoLocal,
      });
    }
    
    if (onFiltrar) {
      onFiltrar({
        ...filtros,
        termo: termoLocal,
      });
    }
  };
  
  const handleReset = () => {
    setTermoLocal("");
    const resetFiltros = {
      termo: "",
      tipo: "",
      status: "",
    };
    
    if (onFiltroChange) {
      onFiltroChange(resetFiltros);
    }
    
    if (onFiltrar) {
      onFiltrar(resetFiltros);
    }
  };
  
  return (
    <div className="p-4 bg-slate-50 rounded-lg mb-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-1 md:col-span-2">
          <div className="flex">
            <Input
              placeholder="Buscar por nome do documento"
              value={termoLocal}
              onChange={(e) => setTermoLocal(e.target.value)}
              className="rounded-r-none"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button 
              onClick={handleSearch} 
              className="rounded-l-none px-3"
              variant="default"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div>
          <Select 
            value={filtros.tipo || "all_types"} 
            onValueChange={(value) => handleFilterChange("tipo", value === "all_types" ? "" : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tipo de Documento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_types">Todos os tipos</SelectItem>
              <SelectItem value="certidao">Certidão</SelectItem>
              <SelectItem value="contrato">Contrato</SelectItem>
              <SelectItem value="formulario">Formulário</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Select 
            value={filtros.status || "all_status"} 
            onValueChange={(value) => handleFilterChange("status", value === "all_status" ? "" : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_status">Todos os status</SelectItem>
              <SelectItem value="valido">Válidos</SelectItem>
              <SelectItem value="vencido">Vencidos</SelectItem>
              <SelectItem value="vence_em_breve">Vence em breve</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="md:col-span-4 flex justify-end">
          <Button 
            variant="outline" 
            onClick={handleReset}
            size="sm"
            className="flex items-center gap-1"
          >
            <X className="h-4 w-4" /> Limpar filtros
          </Button>
        </div>
      </div>
    </div>
  );
};

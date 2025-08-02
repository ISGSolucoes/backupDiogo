
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Search } from "lucide-react";

interface FiltroCNAEProps {
  cnaeSelecionados: string[];
  onCNAEChange: (cnaes: string[]) => void;
}

export const FiltroCNAE = ({ cnaeSelecionados, onCNAEChange }: FiltroCNAEProps) => {
  const [busca, setBusca] = useState("");
  
  // CNAEs mais comuns para demonstração
  const cnaesDisponiveis = [
    { codigo: "62.01-5", descricao: "Desenvolvimento de programas de computador sob encomenda" },
    { codigo: "62.02-3", descricao: "Desenvolvimento e licenciamento de programas de computador customizáveis" },
    { codigo: "46.21-4", descricao: "Comércio atacadista de café em grão" },
    { codigo: "47.11-3", descricao: "Comércio varejista de mercadorias em geral" },
    { codigo: "49.30-2", descricao: "Transporte rodoviário de carga" },
    { codigo: "68.10-2", descricao: "Compra e venda de imóveis próprios" },
    { codigo: "71.12-0", descricao: "Serviços de engenharia" },
    { codigo: "74.90-1", descricao: "Outras atividades profissionais, científicas e técnicas" },
    { codigo: "82.11-3", descricao: "Serviços combinados de escritório e apoio administrativo" },
    { codigo: "85.99-6", descricao: "Outras atividades de ensino" }
  ];

  const cnaesFiltrados = cnaesDisponiveis.filter(cnae => 
    cnae.codigo.toLowerCase().includes(busca.toLowerCase()) ||
    cnae.descricao.toLowerCase().includes(busca.toLowerCase())
  );

  const toggleCNAE = (codigo: string) => {
    if (cnaeSelecionados.includes(codigo)) {
      onCNAEChange(cnaeSelecionados.filter(c => c !== codigo));
    } else {
      onCNAEChange([...cnaeSelecionados, codigo]);
    }
  };

  const removerCNAE = (codigo: string) => {
    onCNAEChange(cnaeSelecionados.filter(c => c !== codigo));
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Segmento / CNAE *</Label>
      
      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Buscar CNAE ou descrição..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* CNAEs selecionados */}
      {cnaeSelecionados.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs text-slate-600">Selecionados:</Label>
          <div className="flex flex-wrap gap-2">
            {cnaeSelecionados.map((codigo) => {
              const cnae = cnaesDisponiveis.find(c => c.codigo === codigo);
              return (
                <Badge key={codigo} variant="secondary" className="flex items-center gap-1">
                  <span className="text-xs">{codigo}</span>
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-red-500" 
                    onClick={() => removerCNAE(codigo)}
                  />
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {/* Lista de CNAEs disponíveis */}
      <div className="max-h-40 overflow-y-auto space-y-2 border rounded-md p-2">
        {cnaesFiltrados.map((cnae) => (
          <div key={cnae.codigo} className="flex items-start space-x-2">
            <Checkbox
              id={cnae.codigo}
              checked={cnaeSelecionados.includes(cnae.codigo)}
              onCheckedChange={() => toggleCNAE(cnae.codigo)}
            />
            <div className="flex-1">
              <Label htmlFor={cnae.codigo} className="text-xs cursor-pointer">
                <span className="font-mono text-slate-600">{cnae.codigo}</span>
                <br />
                <span className="text-slate-800">{cnae.descricao}</span>
              </Label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

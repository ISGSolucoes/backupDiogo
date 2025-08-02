
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FiltroLocalizacaoProps {
  localizacao: {
    pais: string;
    estado: string;
    cidade: string;
    raio: string;
  };
  onLocalizacaoChange: (field: string, value: string) => void;
}

export const FiltroLocalizacao = ({ localizacao, onLocalizacaoChange }: FiltroLocalizacaoProps) => {
  const estados = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", 
    "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", 
    "RS", "RO", "RR", "SC", "SP", "SE", "TO"
  ];

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Localização</Label>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="pais" className="text-xs text-slate-600">País</Label>
          <Input
            id="pais"
            placeholder="Brasil"
            value={localizacao.pais}
            onChange={(e) => onLocalizacaoChange("pais", e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="estado" className="text-xs text-slate-600">Estado</Label>
          <Select value={localizacao.estado} onValueChange={(value) => onLocalizacaoChange("estado", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {estados.map((estado) => (
                <SelectItem key={estado} value={estado}>
                  {estado}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="cidade" className="text-xs text-slate-600">Cidade</Label>
          <Input
            id="cidade"
            placeholder="São Paulo"
            value={localizacao.cidade}
            onChange={(e) => onLocalizacaoChange("cidade", e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="raio" className="text-xs text-slate-600">Raio (km)</Label>
          <Input
            id="raio"
            type="number"
            placeholder="50"
            value={localizacao.raio}
            onChange={(e) => onLocalizacaoChange("raio", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

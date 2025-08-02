
import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface FiltroRegiaoProps {
  regioesSelecionadas: string[];
  onRegiaoChange: (regioes: string[]) => void;
}

const regioesBrasil = {
  "Sudeste": ["SP", "RJ", "MG", "ES"],
  "Sul": ["PR", "SC", "RS"],
  "Centro-Oeste": ["DF", "GO", "MT", "MS"],
  "Nordeste": ["AL", "BA", "CE", "MA", "PB", "PE", "PI", "RN", "SE"],
  "Norte": ["AC", "AP", "AM", "PA", "RO", "RR", "TO"]
};

const estadosNomes = {
  "SP": "São Paulo",
  "RJ": "Rio de Janeiro", 
  "MG": "Minas Gerais",
  "ES": "Espírito Santo",
  "PR": "Paraná",
  "SC": "Santa Catarina",
  "RS": "Rio Grande do Sul",
  "DF": "Distrito Federal",
  "GO": "Goiás",
  "MT": "Mato Grosso",
  "MS": "Mato Grosso do Sul",
  "AL": "Alagoas",
  "BA": "Bahia",
  "CE": "Ceará",
  "MA": "Maranhão",
  "PB": "Paraíba",
  "PE": "Pernambuco",
  "PI": "Piauí",
  "RN": "Rio Grande do Norte",
  "SE": "Sergipe",
  "AC": "Acre",
  "AP": "Amapá",
  "AM": "Amazonas",
  "PA": "Pará",
  "RO": "Rondônia",
  "RR": "Roraima",
  "TO": "Tocantins"
};

export const FiltroRegiao = ({ regioesSelecionadas, onRegiaoChange }: FiltroRegiaoProps) => {
  const handleRegiaoToggle = (regiao: string) => {
    const isSelected = regioesSelecionadas.includes(regiao);
    
    if (isSelected) {
      onRegiaoChange(regioesSelecionadas.filter(r => r !== regiao));
    } else {
      onRegiaoChange([...regioesSelecionadas, regiao]);
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Região</Label>
      
      <div className="space-y-4">
        {Object.entries(regioesBrasil).map(([nomeRegiao, estados]) => (
          <div key={nomeRegiao} className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`regiao-${nomeRegiao}`}
                checked={regioesSelecionadas.includes(nomeRegiao)}
                onCheckedChange={() => handleRegiaoToggle(nomeRegiao)}
              />
              <Label htmlFor={`regiao-${nomeRegiao}`} className="text-sm font-medium text-slate-700">
                {nomeRegiao}
              </Label>
            </div>
            <div className="ml-6 text-xs text-slate-500">
              {estados.map(uf => `${estadosNomes[uf as keyof typeof estadosNomes]} (${uf})`).join(", ")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

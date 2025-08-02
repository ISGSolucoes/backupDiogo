
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface FiltroFaturamentoProps {
  faturamento: string;
  faturamentoCustom: { min: string; max: string };
  onFaturamentoChange: (value: string) => void;
  onFaturamentoCustomChange: (values: { min: string; max: string }) => void;
}

export const FiltroFaturamento = ({ 
  faturamento, 
  faturamentoCustom, 
  onFaturamentoChange, 
  onFaturamentoCustomChange 
}: FiltroFaturamentoProps) => {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Faturamento Anual (R$)</Label>
      
      <div className="space-y-2">
        {/* Checkboxes para categorias predefinidas com faixas corretas */}
        <div className="space-y-2">
          {[
            { value: "mei", label: "MEI", faixa: "Até R$ 81 mil" },
            { value: "me", label: "Microempresa (ME)", faixa: "Até R$ 360 mil" },
            { value: "epp", label: "Empresa de Pequeno Porte (EPP)", faixa: "R$ 360 mil até R$ 4,8 milhões" },
            { value: "media", label: "Média Empresa", faixa: "R$ 4,8 milhões até R$ 300 milhões" },
            { value: "grande", label: "Grande Empresa", faixa: "Acima de R$ 300 milhões" }
          ].map((option) => (
            <div key={option.value} className="flex items-start space-x-2">
              <Checkbox
                id={option.value}
                checked={faturamento === option.value}
                onCheckedChange={(checked) => {
                  onFaturamentoChange(checked ? option.value : "");
                }}
              />
              <div className="flex-1">
                <Label htmlFor={option.value} className="text-sm cursor-pointer">
                  {option.label}
                </Label>
                <p className="text-xs text-slate-500">{option.faixa}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Range customizado */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="custom-range"
            checked={faturamento === "custom"}
            onCheckedChange={(checked) => {
              onFaturamentoChange(checked ? "custom" : "");
            }}
          />
          <Label htmlFor="custom-range" className="text-sm">Range customizado:</Label>
        </div>

        {faturamento === "custom" && (
          <div className="flex items-center space-x-2 ml-6">
            <span className="text-sm">De R$</span>
            <Input
              placeholder="500mil"
              value={faturamentoCustom.min}
              onChange={(e) => onFaturamentoCustomChange({ ...faturamentoCustom, min: e.target.value })}
              className="w-24"
            />
            <span className="text-sm">a R$</span>
            <Input
              placeholder="10Mi"
              value={faturamentoCustom.max}
              onChange={(e) => onFaturamentoCustomChange({ ...faturamentoCustom, max: e.target.value })}
              className="w-24"
            />
          </div>
        )}
      </div>
    </div>
  );
};


import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface FiltroFuncionariosProps {
  funcionarios: string;
  funcionariosCustom: { min: string; max: string };
  onFuncionariosChange: (value: string) => void;
  onFuncionariosCustomChange: (values: { min: string; max: string }) => void;
}

export const FiltroFuncionarios = ({ 
  funcionarios, 
  funcionariosCustom, 
  onFuncionariosChange, 
  onFuncionariosCustomChange 
}: FiltroFuncionariosProps) => {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Quantidade de Funcionários</Label>
      
      <div className="space-y-2">
        {/* Presets */}
        <div className="space-y-2">
          {[
            { value: "ate-9", label: "Até 9" },
            { value: "10-49", label: "10 a 49" },
            { value: "50-99", label: "50 a 99" },
            { value: "100-499", label: "100 a 499" },
            { value: "500+", label: "500+" }
          ].map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={option.value}
                checked={funcionarios === option.value}
                onCheckedChange={(checked) => {
                  onFuncionariosChange(checked ? option.value : "");
                }}
              />
              <Label htmlFor={option.value} className="text-sm">
                {option.label}
              </Label>
            </div>
          ))}
        </div>

        {/* Range customizado */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="funcionarios-custom"
            checked={funcionarios === "custom"}
            onCheckedChange={(checked) => {
              onFuncionariosChange(checked ? "custom" : "");
            }}
          />
          <Label htmlFor="funcionarios-custom" className="text-sm">Range customizado:</Label>
        </div>

        {funcionarios === "custom" && (
          <div className="flex items-center space-x-2 ml-6">
            <span className="text-sm">De</span>
            <Input
              type="number"
              placeholder="10"
              value={funcionariosCustom.min}
              onChange={(e) => onFuncionariosCustomChange({ ...funcionariosCustom, min: e.target.value })}
              className="w-20"
            />
            <span className="text-sm">até</span>
            <Input
              type="number"
              placeholder="100"
              value={funcionariosCustom.max}
              onChange={(e) => onFuncionariosCustomChange({ ...funcionariosCustom, max: e.target.value })}
              className="w-20"
            />
          </div>
        )}
      </div>
    </div>
  );
};

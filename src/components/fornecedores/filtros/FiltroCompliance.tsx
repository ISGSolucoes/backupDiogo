
import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FiltroComplianceProps {
  compliance: {
    documentacaoOk: boolean;
    esgValidado: boolean;
    semIncidentes: boolean;
    status: string;
  };
  onComplianceChange: (field: string, value: boolean | string) => void;
}

export const FiltroCompliance = ({ compliance, onComplianceChange }: FiltroComplianceProps) => {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Status no Sistema</Label>
      
      <div className="space-y-3">
        {/* Status no Sistema */}
        <div>
          <Select value={compliance.status} onValueChange={(value) => onComplianceChange("status", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="registrado">Registrado</SelectItem>
              <SelectItem value="em_registro">Em Registro</SelectItem>
              <SelectItem value="em_qualificacao">Em Qualificação</SelectItem>
              <SelectItem value="pendente_aprovacao">Pendentes de Aprovação</SelectItem>
              <SelectItem value="qualificado">Qualificado</SelectItem>
              <SelectItem value="preferido">Preferido</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Seção Compliance / ESG */}
        <div className="pt-3 border-t">
          <Label className="text-sm font-medium text-slate-700 mb-2 block">Compliance / ESG</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="documentacao-ok"
                checked={compliance.documentacaoOk}
                onCheckedChange={(checked) => onComplianceChange("documentacaoOk", !!checked)}
              />
              <Label htmlFor="documentacao-ok" className="text-sm">
                Documentação OK
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="esg-validado"
                checked={compliance.esgValidado}
                onCheckedChange={(checked) => onComplianceChange("esgValidado", !!checked)}
              />
              <Label htmlFor="esg-validado" className="text-sm">
                ESG Validado
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="sem-incidentes"
                checked={compliance.semIncidentes}
                onCheckedChange={(checked) => onComplianceChange("semIncidentes", !!checked)}
              />
              <Label htmlFor="sem-incidentes" className="text-sm">
                Sem Incidentes
              </Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

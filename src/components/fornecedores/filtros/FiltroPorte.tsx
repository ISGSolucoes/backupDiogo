
import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface FiltroPorteProps {
  porte: string;
  onPorteChange: (value: string) => void;
}

export const FiltroPorte = ({ porte, onPorteChange }: FiltroPorteProps) => {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Porte</Label>
      
      <div className="space-y-2">
        {[
          { value: "mei", label: "MEI" },
          { value: "me", label: "ME" },
          { value: "epp", label: "EPP" },
          { value: "media", label: "Média" },
          { value: "grande", label: "Grande" }
        ].map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <Checkbox
              id={`porte-${option.value}`}
              checked={porte === option.value}
              onCheckedChange={(checked) => {
                onPorteChange(checked ? option.value : "");
              }}
            />
            <Label htmlFor={`porte-${option.value}`} className="text-sm">
              {option.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

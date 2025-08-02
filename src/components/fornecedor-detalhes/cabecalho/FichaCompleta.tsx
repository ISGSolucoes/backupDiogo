
import React from "react";
import { Progress } from "@/components/ui/progress";

interface FichaCompletaProps {
  porcentagem: number;
}

export const FichaCompleta = ({ porcentagem }: FichaCompletaProps) => {
  return (
    <div className="pt-2">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-500">Ficha completa</span>
        <span className="font-medium">{porcentagem || 0}%</span>
      </div>
      <Progress value={porcentagem || 0} className="h-2" />
    </div>
  );
};

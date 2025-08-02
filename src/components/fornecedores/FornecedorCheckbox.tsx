
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface FornecedorCheckboxProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const FornecedorCheckbox = ({ 
  id, 
  checked, 
  onCheckedChange, 
  disabled = false 
}: FornecedorCheckboxProps) => {
  return (
    <Checkbox
      id={`fornecedor-${id}`}
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
    />
  );
};

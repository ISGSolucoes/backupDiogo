
import React from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HierarquiaButtonProps {
  cnpjRaiz: string;
  onClick: () => void;
}

export const HierarquiaButton = ({ cnpjRaiz, onClick }: HierarquiaButtonProps) => {
  if (!cnpjRaiz) return null;
  
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-slate-500">CNPJ Raiz: {cnpjRaiz}</span>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-7 px-2" 
        onClick={onClick}
      >
        <Share2 className="h-3.5 w-3.5" />
        <span className="ml-1 text-xs">Ver hierarquia</span>
      </Button>
    </div>
  );
};

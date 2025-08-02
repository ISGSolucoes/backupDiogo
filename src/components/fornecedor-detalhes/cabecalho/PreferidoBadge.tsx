
import React from "react";
import { Heart, HeartOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PreferidoBadgeProps {
  isPreferido: boolean;
  onPreferidoChange?: (preferido: boolean) => void;
  isAdmin?: boolean;
  fornecedorNome: string;
}

export const PreferidoBadge = ({ 
  isPreferido, 
  onPreferidoChange, 
  isAdmin = true, 
  fornecedorNome 
}: PreferidoBadgeProps) => {
  const handleTogglePreferido = () => {
    const novoStatus = !isPreferido;
    
    // Notificar o componente pai sobre a mudança
    if (onPreferidoChange) {
      onPreferidoChange(novoStatus);
    }
    
    toast.success(
      novoStatus 
        ? `${fornecedorNome} marcado como fornecedor preferido` 
        : `${fornecedorNome} removido dos fornecedores preferidos`
    );
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleTogglePreferido}
      className={isPreferido 
        ? "border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800" 
        : "border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
      }
    >
      {isPreferido ? (
        <>
          <HeartOff className="h-4 w-4 mr-2" />
          Remover Preferido
        </>
      ) : (
        <>
          <Heart className="h-4 w-4 mr-2" />
          Tornar Preferido
        </>
      )}
    </Button>
  );
};

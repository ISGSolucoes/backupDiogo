import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface SecaoContextualProps {
  titulo: string;
  icone: LucideIcon;
  contador?: number;
  children: React.ReactNode;
  className?: string;
}

export const SecaoContextual = ({ 
  titulo, 
  icone: Icone, 
  contador, 
  children, 
  className = "" 
}: SecaoContextualProps) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Cabeçalho da Seção */}
      <div className="flex items-center justify-between py-3 border-b-2 border-slate-200">
        <div className="flex items-center gap-3">
          <div className="icon-container icon-container-blue">
            <Icone className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">{titulo}</h3>
          {contador !== undefined && (
            <Badge variant="secondary" className="text-xs">
              {contador}
            </Badge>
          )}
        </div>
      </div>
      
      {/* Conteúdo da Seção */}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};
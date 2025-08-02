
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlocoComExpandir } from "./BlocoComExpandir";

export const FornecedoresRisco = () => {
  // Mock data - would come from API in real implementation
  const riscos = {
    alto: 2,
    medio: 1, 
    baixo: 3
  };

  return (
    <BlocoComExpandir 
      titulo="Radar de Fornecedores em Risco" 
      icone={<AlertCircle className="h-5 w-5 text-slate-500" />}
      maxHeight="200px"
    >
      <div className="p-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500 mt-1.5"></div>
            <p className="text-sm text-slate-800">
              <span className="font-semibold">{riscos.alto} fornecedores</span> com documentos vencidos
            </p>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-3 h-3 rounded-full bg-amber-500 mt-1.5"></div>
            <p className="text-sm text-slate-800">
              <span className="font-semibold">{riscos.medio} fornecedor</span> com NPS abaixo de 4
            </p>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-3 h-3 rounded-full bg-yellow-400 mt-1.5"></div>
            <p className="text-sm text-slate-800">
              <span className="font-semibold">{riscos.baixo} fornecedores</span> sem participação nos últimos 90 dias
            </p>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <Button variant="outline" size="sm" className="text-xs w-full">
            🔍 Ver lista completa
          </Button>
        </div>
      </div>
    </BlocoComExpandir>
  );
};

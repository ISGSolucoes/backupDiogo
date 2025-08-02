
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlocoComExpandir } from "./BlocoComExpandir";

export const ExportacoesRapidas = () => {
  // Functions to handle exports - would connect to actual export logic in real implementation
  const handleExport = (tipo: string, formato: string) => {
    console.log(`Exportando ${tipo} como ${formato}`);
    // In a real implementation, this would trigger the export
  };

  return (
    <BlocoComExpandir 
      titulo="Exportações Rápidas" 
      icone={<FileText className="h-5 w-5 text-slate-500" />}
      maxHeight="150px"
    >
      <div className="p-4">
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="text-xs"
            onClick={() => handleExport("fornecedores", "excel")}
          >
            📊 Fornecedores Excel
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="text-xs"
            onClick={() => handleExport("requisicoes", "csv")}
          >
            📑 Requisições CSV
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="text-xs"
            onClick={() => handleExport("cotacoes", "pdf")}
          >
            📄 Cotações PDF
          </Button>
        </div>
      </div>
    </BlocoComExpandir>
  );
};

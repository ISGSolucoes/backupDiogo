
import { FileText, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlocoComExpandir } from "./BlocoComExpandir";

interface Requisicao {
  id: string;
  numero: string;
  descricao: string;
  valor: string;
  status: "aprovada" | "pendente" | "rejeitada";
  data: string;
}

export const MinhasRequisicoes = () => {
  // Mock data
  const requisicoes: Requisicao[] = [
    {
      id: "1",
      numero: "REQ-2023-028",
      descricao: "Material de escritório",
      valor: "R$ 2.500,00",
      status: "pendente",
      data: "24/05/2023",
    },
    {
      id: "2",
      numero: "REQ-2023-027",
      descricao: "Serviços de manutenção",
      valor: "R$ 15.800,00",
      status: "aprovada",
      data: "22/05/2023",
    },
    {
      id: "3",
      numero: "REQ-2023-026",
      descricao: "Equipamentos de TI",
      valor: "R$ 8.350,00",
      status: "rejeitada",
      data: "20/05/2023",
    },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "aprovada": return "text-green-500";
      case "pendente": return "text-amber-500";
      case "rejeitada": return "text-red-500";
      default: return "text-slate-500";
    }
  };

  return (
    <BlocoComExpandir 
      titulo="Minhas Requisições" 
      icone={<FileText className="h-5 w-5 text-slate-500" />}
      actions={
        <Button variant="ghost" size="sm" className="text-xs">
          Ver todas
        </Button>
      }
    >
      <div className="divide-y divide-slate-100">
        {requisicoes.map((req) => (
          <div key={req.id} className="p-4 hover:bg-slate-50">
            <div className="flex justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">#{req.numero}</p>
                  <span className={`text-xs ${getStatusStyle(req.status)}`}>
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </span>
                </div>
                <p className="text-xs mt-1">{req.descricao}</p>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-xs text-slate-500">{req.data}</p>
                  <p className="text-xs font-medium">{req.valor}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        
        <div className="p-2 text-center">
          <Button variant="ghost" size="sm" className="text-xs">
            + Nova requisição
          </Button>
        </div>
      </div>
    </BlocoComExpandir>
  );
};

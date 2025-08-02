
import { TrendingUp } from "lucide-react";
import { BlocoComExpandir } from "./BlocoComExpandir";

export const DestaquesMes = () => {
  // Mock data - would come from analytics in real implementation
  const destaques = [
    { 
      id: 1, 
      titulo: "Fornecedor mais rápido",
      valor: "LogiPro",
      detalhe: "média: 2 dias"
    },
    { 
      id: 2, 
      titulo: "Maior saving",
      valor: "Evento EV-005",
      detalhe: "R$ 8.200"
    },
    { 
      id: 3, 
      titulo: "Requisição + rápida",
      valor: "REQ-026",
      detalhe: "aprovada em 3h"
    }
  ];

  return (
    <BlocoComExpandir 
      titulo="Destaques do Mês" 
      icone={<TrendingUp className="h-5 w-5 text-sourcexpress-blue" />}
      maxHeight="200px"
    >
      <div className="p-4">
        <ul className="space-y-2">
          {destaques.map(destaque => (
            <li key={destaque.id} className="flex items-center gap-2">
              <span className="flex-shrink-0">🏆</span>
              <div className="text-sm">
                <span className="font-medium">{destaque.titulo}: </span>
                <span>{destaque.valor} </span>
                <span className="text-slate-500">({destaque.detalhe})</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </BlocoComExpandir>
  );
};

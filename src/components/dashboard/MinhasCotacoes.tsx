
import { ShoppingBag, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlocoComExpandir } from "./BlocoComExpandir";

interface Cotacao {
  id: string;
  evento: string;
  descricao: string;
  prazo: string;
  propostas: number;
  status: "aberta" | "analise" | "concluida";
}

export const MinhasCotacoes = () => {
  // Mock data
  const cotacoes: Cotacao[] = [
    {
      id: "1",
      evento: "EV-007",
      descricao: "Compra de materiais",
      prazo: "27/05/2023",
      propostas: 3,
      status: "aberta",
    },
    {
      id: "2",
      evento: "EV-006",
      descricao: "Contratação de serviços",
      prazo: "22/05/2023",
      propostas: 5,
      status: "analise",
    },
    {
      id: "3",
      evento: "EV-005",
      descricao: "Equipamentos para TI",
      prazo: "20/05/2023",
      propostas: 4,
      status: "concluida",
    },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "aberta": return "bg-blue-100 text-blue-800";
      case "analise": return "bg-amber-100 text-amber-800";
      case "concluida": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <BlocoComExpandir 
      titulo="Minhas Cotações" 
      icone={<ShoppingBag className="h-5 w-5 text-slate-500" />}
      actions={
        <Button variant="ghost" size="sm" className="text-xs">
          Ver todas
        </Button>
      }
    >
      <div className="divide-y divide-slate-100">
        {cotacoes.map((cotacao) => (
          <div key={cotacao.id} className="p-4 hover:bg-slate-50">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{cotacao.evento}</p>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusStyle(cotacao.status)}`}>
                    {cotacao.status.charAt(0).toUpperCase() + cotacao.status.slice(1)}
                  </span>
                </div>
                <p className="text-xs mt-1">{cotacao.descricao}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-slate-500">Prazo: {cotacao.prazo}</p>
                  <p className="text-xs text-slate-500">•</p>
                  <p className="text-xs text-slate-500">{cotacao.propostas} propostas</p>
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
            + Novo evento
          </Button>
        </div>
      </div>
    </BlocoComExpandir>
  );
};

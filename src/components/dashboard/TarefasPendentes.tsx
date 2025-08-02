
import { CheckCircle, ChevronRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BlocoComExpandir } from "./BlocoComExpandir";

interface Tarefa {
  id: string;
  titulo: string;
  vencimento: string;
  prioridade: "alta" | "media" | "baixa";
  completa: boolean;
}

export const TarefasPendentes = () => {
  // Mock data
  const tarefas: Tarefa[] = [
    {
      id: "1",
      titulo: "Aprovar requisição #REQ-2023-028",
      vencimento: "Hoje",
      prioridade: "alta",
      completa: false,
    },
    {
      id: "2",
      titulo: "Analisar propostas do evento EV-007",
      vencimento: "Amanhã",
      prioridade: "alta",
      completa: false,
    },
    {
      id: "3",
      titulo: "Atualizar cadastro fornecedor ABC Ltda",
      vencimento: "26/05",
      prioridade: "media",
      completa: false,
    },
    {
      id: "4",
      titulo: "Revisar PO #PC-2023-112",
      vencimento: "28/05",
      prioridade: "baixa",
      completa: true,
    },
  ];

  const pendentes = tarefas.filter(t => !t.completa);
  const progresso = Math.round((tarefas.filter(t => t.completa).length / tarefas.length) * 100);
  
  const getPrioridadeStyle = (prioridade: string) => {
    switch (prioridade) {
      case "alta": return "text-red-500";
      case "media": return "text-amber-500";
      case "baixa": return "text-green-500";
      default: return "text-slate-500";
    }
  };

  return (
    <BlocoComExpandir titulo="Tarefas Pendentes">
      <div className="px-4 py-2">
        <div className="flex justify-between items-center text-sm text-slate-500 mb-1">
          <span>Progresso</span>
          <span className="font-medium">{progresso}%</span>
        </div>
        <Progress value={progresso} className="h-1.5" />
      </div>
      
      <div className="divide-y divide-slate-100">
        {pendentes.length > 0 ? (
          pendentes.map((tarefa) => (
            <div key={tarefa.id} className="p-4 hover:bg-slate-50 flex justify-between items-center">
              <div className="flex gap-3 flex-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 rounded-full border border-slate-200"
                >
                  <span className="sr-only">Marcar como concluída</span>
                </Button>
                <div>
                  <p className="text-sm font-medium">{tarefa.titulo}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {tarefa.prioridade === "alta" && (
                      <AlertCircle className="h-3 w-3 text-red-500" />
                    )}
                    <span className={`text-xs ${getPrioridadeStyle(tarefa.prioridade)}`}>
                      Vence: {tarefa.vencimento}
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-slate-500">
            <CheckCircle className="mx-auto h-8 w-8 text-green-500 mb-2" />
            <p>Todas as tarefas estão concluídas!</p>
          </div>
        )}
      </div>
    </BlocoComExpandir>
  );
};

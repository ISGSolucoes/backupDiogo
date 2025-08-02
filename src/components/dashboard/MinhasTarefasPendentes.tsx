import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  FileText,
  Calendar,
  Users,
  TrendingUp,
  Brain,
  Bell,
  Target,
  DollarSign,
  CheckSquare
} from "lucide-react";

interface TarefaPendente {
  id: string;
  tipo: "requisicao" | "fornecedor" | "contrato" | "cotacao" | "documento";
  titulo: string;
  descricao: string;
  prazo: string;
  prioridade: "alta" | "media" | "baixa";
  acoes: string[];
}

export const MinhasTarefasPendentes = () => {
  const [tarefas] = useState<TarefaPendente[]>([
    {
      id: "1",
      tipo: "requisicao",
      titulo: "REQ-203 • Material de Escritório",
      descricao: "Requisição de R$ 2.450 aguardando sua aprovação há 5 dias",
      prazo: "Atrasado há 2 dias",
      prioridade: "alta",
      acoes: ["Aprovar", "Analisar", "Rejeitar"]
    },
    {
      id: "2", 
      tipo: "fornecedor",
      titulo: "ABC Materiais Ltda",
      descricao: "Cadastro completo aguardando análise de compliance",
      prazo: "4 dias pendente",
      prioridade: "alta",
      acoes: ["Analisar", "Aprovar", "Solicitar docs"]
    },
    {
      id: "3",
      tipo: "contrato",
      titulo: "CNT-445 • Beta Corp",
      descricao: "Contrato de prestação de serviços pronto para assinatura",
      prazo: "3 dias pendente",
      prioridade: "media",
      acoes: ["Assinar", "Revisar"]
    },
    {
      id: "4",
      tipo: "cotacao",
      titulo: "COT-891 • Material de Construção", 
      descricao: "3 propostas recebidas, análise comparativa disponível",
      prazo: "1 hora atrás",
      prioridade: "media",
      acoes: ["Analisar", "Negociar"]
    }
  ]);

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "requisicao": return <FileText className="h-4 w-4 text-blue-500" />;
      case "fornecedor": return <Users className="h-4 w-4 text-green-500" />;
      case "contrato": return <FileText className="h-4 w-4 text-purple-500" />;
      case "cotacao": return <TrendingUp className="h-4 w-4 text-orange-500" />;
      case "documento": return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case "alta": return "border-l-red-500 bg-red-50";
      case "media": return "border-l-orange-500 bg-orange-50"; 
      case "baixa": return "border-l-green-500 bg-green-50";
      default: return "border-l-gray-300 bg-gray-50";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 card-shadow h-[400px] flex flex-col">
      <div className="p-4 border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="icon-container icon-container-red">
              <CheckSquare className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg">Minhas Tarefas Pendentes</h3>
            <Badge variant="destructive" className="text-xs">7</Badge>
          </div>
          <Button variant="ghost" size="sm" className="text-sm text-slate-600 hover:text-slate-800">
            Ver todas →
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {tarefas.map((tarefa) => (
            <div 
              key={tarefa.id}
              className={`p-4 rounded-lg border-l-4 ${getPrioridadeColor(tarefa.prioridade)} transition-all hover:shadow-sm`}
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-3 flex-1">
                  <div className="flex-shrink-0 mt-1">
                    {getTipoIcon(tarefa.tipo)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm text-slate-800">{tarefa.titulo}</h4>
                      <Badge variant="outline" className="text-xs capitalize">
                        {tarefa.tipo}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{tarefa.descricao}</p>
                    <p className="text-xs text-slate-500 mb-3">{tarefa.prazo}</p>
                    
                    <div className="flex gap-2">
                      {tarefa.acoes.map((acao, index) => (
                        <Button 
                          key={index}
                          size="sm" 
                          variant={index === 0 ? "default" : "outline"}
                          className="text-xs h-7"
                        >
                          {acao}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <div className="pt-2 text-center">
            <Button variant="ghost" size="sm" className="text-xs">
              Ver todas as tarefas →
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
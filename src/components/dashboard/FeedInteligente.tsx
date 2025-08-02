
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Calendar, FileText, ChevronRight, BarChart2, Bell } from "lucide-react";
import { BlocoComExpandir } from "./BlocoComExpandir";

type FeedItem = {
  id: string;
  tipo: "alerta" | "tarefa" | "evento" | "notificacao";
  titulo: string;
  descricao: string;
  tempo: string;
  icone: React.ReactNode;
  acoes?: { texto: string; tipo: "primary" | "outline" | "ghost" }[];
};

interface FeedInteligenteProps {
  filtro: "todos" | "alertas" | "tarefas" | "eventos";
}

export const FeedInteligente = ({ filtro }: FeedInteligenteProps) => {
  const [filtroAtivo, setFiltroAtivo] = useState<string>(filtro);

  // Mock data
  const feedItems: FeedItem[] = [
    {
      id: "1",
      tipo: "alerta",
      titulo: "Evento EV-007 parado há 3 dias",
      descricao: "📌 Rê detectou: Este evento não recebeu propostas e está próximo do prazo",
      tempo: "10 min atrás",
      icone: <AlertCircle className="h-5 w-5 text-red-500" />,
      acoes: [
        { texto: "Convidar fornecedores", tipo: "primary" },
        { texto: "Adiar prazo", tipo: "outline" },
      ],
    },
    {
      id: "2",
      tipo: "tarefa",
      titulo: "Pedido de compra #PC-2023-456 aguardando aprovação",
      descricao: "O pedido está na sua fila de aprovação desde 28/04",
      tempo: "2 horas atrás",
      icone: <FileText className="h-5 w-5 text-slate-500" />,
      acoes: [
        { texto: "Aprovar", tipo: "primary" },
        { texto: "Revisar", tipo: "outline" },
      ],
    },
    {
      id: "3",
      tipo: "evento",
      titulo: "Reunião com fornecedor ABC Materiais",
      descricao: "Negociação para contrato anual de suprimentos",
      tempo: "Amanhã, 14:00",
      icone: <Calendar className="h-5 w-5 text-sourcexpress-blue" />,
      acoes: [
        { texto: "Preparar pauta", tipo: "outline" },
        { texto: "Reagendar", tipo: "ghost" },
      ],
    },
  ];

  const filteredItems = filtroAtivo === "todos" 
    ? feedItems 
    : feedItems.filter(item => item.tipo === filtroAtivo);

  const getBadgeVariant = (tipo: string) => {
    switch (tipo) {
      case "alerta": return "destructive";
      case "tarefa": return "outline";
      case "evento": return "secondary";
      case "notificacao": return "default";
      default: return "default";
    }
  };

  const getButtonVariant = (tipo: "primary" | "outline" | "ghost") => {
    switch (tipo) {
      case "primary": return "default";
      case "outline": return "outline";
      case "ghost": return "ghost";
      default: return "default";
    }
  };

  const actions = (
    <div className="flex space-x-2">
      {["todos", "alertas", "tarefas", "eventos"].map((f) => (
        <Button 
          key={f} 
          variant={filtroAtivo === f ? "default" : "ghost"} 
          size="sm" 
          onClick={() => setFiltroAtivo(f)}
          className="text-xs"
        >
          {f.charAt(0).toUpperCase() + f.slice(1)}
        </Button>
      ))}
    </div>
  );

  return (
    <BlocoComExpandir 
      titulo="Feed de Atividades" 
      icone={<Bell className="h-5 w-5 text-slate-500" />}
      actions={actions}
      maxHeight="400px"
    >
      <div className="divide-y divide-slate-100">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div key={item.id} className="py-5 hover:bg-slate-50 px-4 transition-colors">
              <div className="flex gap-4">
                <div className="icon-container icon-container-blue flex-shrink-0">
                  {item.icone}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-semibold text-slate-800">{item.titulo}</h4>
                    <Badge variant={getBadgeVariant(item.tipo)} className="text-xs">
                      {item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mt-1.5">{item.descricao}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-slate-400">{item.tempo}</span>
                    <div className="flex space-x-2">
                      {item.acoes?.map((acao, i) => (
                        <Button 
                          key={i} 
                          variant={getButtonVariant(acao.tipo)}
                          size="sm" 
                          className="text-xs"
                        >
                          {acao.texto}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-slate-500">
            Nenhum item encontrado para o filtro selecionado
          </div>
        )}
      </div>
      
      {filteredItems.length > 0 && (
        <div className="pt-3 mt-3 border-t border-slate-100 text-center">
          <Button variant="ghost" size="sm" className="text-xs">
            Ver mais <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      )}
    </BlocoComExpandir>
  );
};

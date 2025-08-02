import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Clock, 
  AlertTriangle, 
  FileText, 
  Calendar,
  Users,
  Package
} from "lucide-react";

interface Deadline {
  id: string;
  tipo: "contrato" | "documento" | "fornecedor" | "evento";
  titulo: string;
  dataVencimento: string;
  diasRestantes: number;
  criticidade: "critica" | "alta" | "media";
  acao: string;
}

export const DeadlinesEAlertas = () => {
  const deadlines: Deadline[] = [
    {
      id: "1",
      tipo: "contrato",
      titulo: "Contrato ABC Materiais",
      dataVencimento: "15/05/2024",
      diasRestantes: 3,
      criticidade: "critica",
      acao: "Renovar"
    },
    {
      id: "2", 
      tipo: "documento",
      titulo: "Certidão Negativa XYZ Ltda",
      dataVencimento: "20/05/2024",
      diasRestantes: 8,
      criticidade: "alta",
      acao: "Solicitar"
    },
    {
      id: "3",
      tipo: "fornecedor",
      titulo: "Avaliação Fornecedor DEF",
      dataVencimento: "25/05/2024", 
      diasRestantes: 13,
      criticidade: "media",
      acao: "Avaliar"
    },
    {
      id: "4",
      tipo: "evento",
      titulo: "Evento EV-007 - Prazo Propostas",
      dataVencimento: "18/05/2024",
      diasRestantes: 6,
      criticidade: "alta",
      acao: "Prorrogar"
    }
  ];

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "contrato": return <FileText className="h-4 w-4 text-blue-500" />;
      case "documento": return <Package className="h-4 w-4 text-orange-500" />;
      case "fornecedor": return <Users className="h-4 w-4 text-purple-500" />;
      case "evento": return <Calendar className="h-4 w-4 text-green-500" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getCriticidadeColor = (criticidade: string, diasRestantes: number) => {
    if (diasRestantes <= 3) return "border-l-red-500 bg-red-50";
    if (diasRestantes <= 7) return "border-l-orange-500 bg-orange-50";
    return "border-l-yellow-500 bg-yellow-50";
  };

  const getCriticidadeBadge = (criticidade: string, diasRestantes: number) => {
    if (diasRestantes <= 3) return { variant: "destructive" as const, text: "CRÍTICO" };
    if (diasRestantes <= 7) return { variant: "secondary" as const, text: "URGENTE" };
    return { variant: "outline" as const, text: "ATENÇÃO" };
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 card-shadow h-[400px] flex flex-col">
      <div className="p-4 border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="icon-container icon-container-orange">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg">Deadlines & Alertas</h3>
            <Badge variant="destructive" className="text-xs">3 críticos</Badge>
          </div>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {deadlines.map((deadline) => {
            const badgeConfig = getCriticidadeBadge(deadline.criticidade, deadline.diasRestantes);
            return (
              <div 
                key={deadline.id}
                className={`p-3 rounded-lg border-l-2 ${getCriticidadeColor(deadline.criticidade, deadline.diasRestantes)} transition-all hover:shadow-sm`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getTipoIcon(deadline.tipo)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-semibold text-sm text-slate-800">{deadline.titulo}</h4>
                      <Badge variant={badgeConfig.variant} className="text-xs">
                        {badgeConfig.text}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Clock className="h-3 w-3" />
                        <span>{deadline.diasRestantes} dias • {deadline.dataVencimento}</span>
                      </div>
                      <Button size="sm" variant="outline" className="text-xs h-6">
                        {deadline.acao}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
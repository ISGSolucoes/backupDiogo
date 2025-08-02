import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Brain, 
  TrendingDown, 
  AlertTriangle, 
  Lightbulb,
  Zap
} from "lucide-react";

interface Sugestao {
  id: string;
  tipo: "economia" | "risco" | "melhoria" | "oportunidade";
  titulo: string;
  descricao: string;
  impacto: string;
  confiabilidade?: string;
  acao: string;
}

export const SugestoesInteligentes = () => {
  const sugestoes: Sugestao[] = [
    {
      id: "1",
      tipo: "economia", 
      titulo: "Economia de 18% em Papelaria",
      descricao: "Fornecedor Office Plus oferece produtos similares com R$ 2.340/mês de economia",
      impacto: "R$ 28.080/ano",
      confiabilidade: "95%",
      acao: "Negociar"
    },
    {
      id: "2",
      tipo: "risco",
      titulo: "DEF Ltda com 40% entregas atrasadas",
      descricao: "Padrão sistemático de atrasos identificado nos últimos 60 dias",
      impacto: "Alto risco operacional",
      acao: "Revisar contrato"
    },
    {
      id: "3", 
      tipo: "melhoria",
      titulo: "Automatizar aprovações até R$ 500",
      descricao: "Pode economizar 3h/semana em processos administrativos",
      impacto: "12h/mês de ganho",
      acao: "Implementar"
    }
  ];

  const getTipoConfig = (tipo: string) => {
    switch (tipo) {
      case "economia":
        return {
          icon: <TrendingDown className="h-4 w-4 text-green-500" />,
          color: "bg-green-50 border-green-200",
          badge: "success"
        };
      case "risco":
        return {
          icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
          color: "bg-red-50 border-red-200", 
          badge: "destructive"
        };
      case "melhoria":
        return {
          icon: <Lightbulb className="h-4 w-4 text-blue-500" />,
          color: "bg-blue-50 border-blue-200",
          badge: "secondary"
        };
      default:
        return {
          icon: <Zap className="h-4 w-4 text-purple-500" />,
          color: "bg-purple-50 border-purple-200",
          badge: "outline"
        };
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 card-shadow h-[400px] flex flex-col">
      <div className="p-4 border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="icon-container icon-container-purple">
              <Lightbulb className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg">Sugestões da Rê</h3>
            <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">IA</Badge>
          </div>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {sugestoes.map((sugestao) => {
            const config = getTipoConfig(sugestao.tipo);
            return (
              <div 
                key={sugestao.id}
                className={`p-4 rounded-lg border ${config.color} transition-all hover:shadow-sm`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {config.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm text-slate-800">{sugestao.titulo}</h4>
                      <Badge variant={config.badge as any} className="text-xs capitalize">
                        {sugestao.tipo}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{sugestao.descricao}</p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-slate-700">
                          💰 {sugestao.impacto}
                        </span>
                        {sugestao.confiabilidade && (
                          <span className="text-xs text-slate-500">
                            📊 {sugestao.confiabilidade} confiança
                          </span>
                        )}
                      </div>
                      <Button size="sm" variant="outline" className="text-xs h-7">
                        {sugestao.acao}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          <div className="pt-2 text-center">
            <Button variant="ghost" size="sm" className="text-xs">
              Ver todas as sugestões →
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
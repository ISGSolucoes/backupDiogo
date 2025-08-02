import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  DollarSign, 
  Package, 
  FileText, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Target,
  BarChart3
} from "lucide-react";

export const IndicadoresDoMes = () => {
  const indicadores = [
    {
      titulo: "Economia Realizada",
      valor: "R$ 31.200",
      meta: "R$ 28.000", 
      variacao: "+11.4%",
      progresso: 111,
      tipo: "positivo",
      icone: <DollarSign className="h-5 w-5 text-green-500" />
    },
    {
      titulo: "Cotações Finalizadas", 
      valor: "18",
      meta: "15",
      variacao: "+20%",
      progresso: 120,
      tipo: "positivo",
      icone: <Package className="h-5 w-5 text-blue-500" />
    },
    {
      titulo: "Contratos Assinados",
      valor: "7",
      meta: "10", 
      variacao: "-30%",
      progresso: 70,
      tipo: "negativo",
      icone: <FileText className="h-5 w-5 text-orange-500" />
    },
    {
      titulo: "Alertas Críticos",
      valor: "3",
      meta: "0",
      variacao: "+3",
      progresso: 0,
      tipo: "atencao",
      icone: <AlertTriangle className="h-5 w-5 text-red-500" />
    }
  ];

  const getTipoConfig = (tipo: string) => {
    switch (tipo) {
      case "positivo":
        return {
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          textColor: "text-green-700",
          icon: <TrendingUp className="h-3 w-3" />
        };
      case "negativo":
        return {
          bgColor: "bg-red-50", 
          borderColor: "border-red-200",
          textColor: "text-red-700",
          icon: <TrendingDown className="h-3 w-3" />
        };
      case "atencao":
        return {
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200", 
          textColor: "text-orange-700",
          icon: <AlertTriangle className="h-3 w-3" />
        };
      default:
        return {
          bgColor: "bg-slate-50",
          borderColor: "border-slate-200",
          textColor: "text-slate-700",
          icon: <TrendingUp className="h-3 w-3" />
        };
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 card-shadow h-[400px] flex flex-col">
      <div className="p-4 border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="icon-container icon-container-green">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg">Indicadores do Mês</h3>
          </div>
          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
            75% das metas atingidas
          </Badge>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {indicadores.map((indicador, index) => {
              const config = getTipoConfig(indicador.tipo);
              return (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border ${config.borderColor} ${config.bgColor} transition-all hover:shadow-sm`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {indicador.icone}
                      <span className="text-sm font-medium text-slate-700">
                        {indicador.titulo}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-slate-800">
                        {indicador.valor}
                      </span>
                      <div className={`flex items-center gap-1 text-xs ${config.textColor}`}>
                        {config.icon}
                        {indicador.variacao}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Meta: {indicador.meta}</span>
                      <div className="flex items-center gap-1">
                        <Target className="h-3 w-3 text-slate-400" />
                        <span className="text-slate-500">{indicador.progresso}%</span>
                      </div>
                    </div>
                    
                    {/* Barra de progresso */}
                    <div className="w-full bg-slate-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          indicador.progresso >= 100 ? 'bg-green-500' : 
                          indicador.progresso >= 70 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(indicador.progresso, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
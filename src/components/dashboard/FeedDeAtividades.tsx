
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bell, 
  Clock, 
  Users, 
  FileText, 
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Calendar,
  Activity
} from "lucide-react";
import { useFeedPreferences } from "@/hooks/useFeedPreferences";
import { FeedConfigModal } from "./FeedConfigModal";
import { useMemo } from "react";

interface AtividadeFeed {
  id: string;
  tipo: "acao" | "atualizacao" | "contato" | "economia" | "alerta" | "sucesso";
  autor: string;
  acao: string;
  objeto: string;
  tempo: string;
  relevancia: "alta" | "media" | "baixa";
  valor?: string;
  acaoInline?: string;
  timestamp: number;
}

export const FeedDeAtividades = () => {
  const { preferences, updatePreferences } = useFeedPreferences();

  const atividades: AtividadeFeed[] = [
    {
      id: "1",
      tipo: "economia",
      autor: "Rê (IA)",
      acao: "identificou economia de R$ 4.200",
      objeto: "Cotação COT-888 (Equipamentos TI)",
      tempo: "5 min atrás",
      relevancia: "alta",
      valor: "R$ 4.200",
      acaoInline: "Ver Detalhes",
      timestamp: Date.now() - 5 * 60 * 1000
    },
    {
      id: "2",
      tipo: "alerta",
      autor: "Sistema",
      acao: "detectou atraso crítico em",
      objeto: "Entrega do fornecedor Beta Corp",
      tempo: "15 min atrás",
      relevancia: "alta",
      acaoInline: "Contatar",
      timestamp: Date.now() - 15 * 60 * 1000
    },
    {
      id: "3",
      tipo: "acao",
      autor: "Maria Santos",
      acao: "aprovou",
      objeto: "Requisição REQ-199 (Material de Limpeza)",
      tempo: "1 hora atrás",
      relevancia: "media",
      acaoInline: "Ver Status",
      timestamp: Date.now() - 60 * 60 * 1000
    },
    {
      id: "4",
      tipo: "sucesso",
      autor: "Carlos Lima",
      acao: "finalizou",
      objeto: "Contrato CNT-442 (Serviços de Segurança)",
      tempo: "2 horas atrás",
      relevancia: "media",
      acaoInline: "Visualizar",
      timestamp: Date.now() - 2 * 60 * 60 * 1000
    },
    {
      id: "5",
      tipo: "contato",
      autor: "João Silva",
      acao: "entrou em contato com",
      objeto: "Fornecedor Alpha Materiais",
      tempo: "3 horas atrás",
      relevancia: "baixa",
      acaoInline: "Ver Conversa",
      timestamp: Date.now() - 3 * 60 * 60 * 1000
    },
    {
      id: "6",
      tipo: "atualizacao",
      autor: "Ana Costa",
      acao: "atualizou documentação de",
      objeto: "Fornecedor XYZ Produtos",
      tempo: "4 horas atrás",
      relevancia: "baixa",
      acaoInline: "Revisar",
      timestamp: Date.now() - 4 * 60 * 60 * 1000
    }
  ];

  const atividadesFiltradas = useMemo(() => {
    let filtradas = atividades;

    // Filtrar por tipos
    filtradas = filtradas.filter(atividade => 
      preferences.filtros.tipos.includes(atividade.tipo)
    );

    // Filtrar por relevância
    filtradas = filtradas.filter(atividade => 
      preferences.filtros.relevancia.includes(atividade.relevancia)
    );

    // Filtrar por período
    const periodoMs = preferences.filtros.periodo * 24 * 60 * 60 * 1000;
    const agora = Date.now();
    filtradas = filtradas.filter(atividade => 
      agora - atividade.timestamp <= periodoMs
    );

    // Filtrar por autores
    if (preferences.filtros.autores.length > 0) {
      filtradas = filtradas.filter(atividade => 
        preferences.filtros.autores.includes(atividade.autor)
      );
    }

    // Ordenar
    filtradas.sort((a, b) => {
      switch (preferences.ordenacao.criterio) {
        case 'tempo':
          return preferences.ordenacao.direcao === 'desc' 
            ? b.timestamp - a.timestamp
            : a.timestamp - b.timestamp;
        
        case 'relevancia':
          const relevanciaOrder = { alta: 3, media: 2, baixa: 1 };
          const scoreA = relevanciaOrder[a.relevancia];
          const scoreB = relevanciaOrder[b.relevancia];
          return preferences.ordenacao.direcao === 'desc' 
            ? scoreB - scoreA
            : scoreA - scoreB;
        
        case 'tipo':
          const indexA = preferences.ordenacao.tiposOrdem.indexOf(a.tipo);
          const indexB = preferences.ordenacao.tiposOrdem.indexOf(b.tipo);
          const orderA = indexA === -1 ? 999 : indexA;
          const orderB = indexB === -1 ? 999 : indexB;
          return preferences.ordenacao.direcao === 'desc' 
            ? orderB - orderA
            : orderA - orderB;
        
        default:
          return 0;
      }
    });

    // Limitar por items por página
    return filtradas.slice(0, preferences.layout.itemsPorPagina);
  }, [atividades, preferences]);

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "acao": return <FileText className="h-4 w-4 text-blue-500" />;
      case "atualizacao": return <Package className="h-4 w-4 text-green-500" />;
      case "contato": return <Users className="h-4 w-4 text-purple-500" />;
      case "economia": return <DollarSign className="h-4 w-4 text-green-600" />;
      case "alerta": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "sucesso": return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getRelevanciaColor = (relevancia: string, tipo: string) => {
    if (tipo === "economia") return "border-l-green-500 bg-green-50";
    if (tipo === "alerta") return "border-l-red-500 bg-red-50";
    if (tipo === "sucesso") return "border-l-blue-500 bg-blue-50";
    
    switch (relevancia) {
      case "alta": return "border-l-orange-500 bg-orange-50";
      case "media": return "border-l-blue-500 bg-blue-50";
      case "baixa": return "border-l-gray-500 bg-gray-50";
      default: return "border-l-gray-300 bg-slate-50";
    }
  };

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case "economia": return { variant: "default" as const, text: "💰 Economia", color: "bg-green-100 text-green-800" };
      case "alerta": return { variant: "destructive" as const, text: "⚠️ Alerta" };
      case "sucesso": return { variant: "secondary" as const, text: "✅ Concluído" };
      case "acao": return { variant: "outline" as const, text: "📋 Ação" };
      case "contato": return { variant: "outline" as const, text: "👥 Contato" };
      default: return { variant: "outline" as const, text: "📦 Update" };
    }
  };

  const alturaContainer = `${preferences.layout.altura}px`;

  return (
    <div className="bg-white rounded-lg border border-slate-200 card-shadow flex flex-col" style={{ height: alturaContainer }}>
      <div className="p-4 border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="icon-container icon-container-gray">
              <Activity className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg">Feed de Atividades</h3>
          </div>
          <FeedConfigModal onPreferencesChange={updatePreferences} />
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {atividadesFiltradas.map((atividade) => {
            const badgeConfig = getTipoBadge(atividade.tipo);
            const isCompact = preferences.layout.compacto;
            
            return (
              <div 
                key={atividade.id}
                className={`${isCompact ? 'p-2' : 'p-3'} rounded-lg border-l-2 ${getRelevanciaColor(atividade.relevancia, atividade.tipo)} transition-all hover:bg-slate-100`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getTipoIcon(atividade.tipo)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <Badge 
                        variant={badgeConfig.variant} 
                        className={`${isCompact ? 'text-xs' : 'text-xs'} ${badgeConfig.color || ''}`}
                      >
                        {badgeConfig.text}
                      </Badge>
                      {atividade.valor && (
                        <span className={`${isCompact ? 'text-xs' : 'text-xs'} font-bold text-green-600`}>
                          {atividade.valor}
                        </span>
                      )}
                    </div>
                    <p className={`${isCompact ? 'text-xs' : 'text-sm'} text-slate-800 ${isCompact ? 'mb-1' : 'mb-2'}`}>
                      <span className="font-medium">{atividade.autor}</span>
                      {" "}
                      <span className="text-slate-600">{atividade.acao}</span>
                      {" "}
                      <span className="font-medium">{atividade.objeto}</span>
                    </p>
                    <div className="flex justify-between items-center">
                      <p className={`${isCompact ? 'text-xs' : 'text-xs'} text-slate-500`}>
                        {atividade.tempo}
                      </p>
                      {atividade.acaoInline && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className={`${isCompact ? 'text-xs h-5 px-1' : 'text-xs h-6 px-2'}`}
                        >
                          {atividade.acaoInline}
                        </Button>
                      )}
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

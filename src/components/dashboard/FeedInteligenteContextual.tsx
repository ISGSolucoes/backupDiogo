import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertCircle, 
  Calendar, 
  FileText, 
  ChevronRight, 
  BarChart2, 
  Bell,
  Package,
  Users,
  Brain,
  User
} from "lucide-react";
import { BlocoComExpandir } from "./BlocoComExpandir";

type FeedItem = {
  id: string;
  modulo: "suprimentos" | "fornecedores" | "contratos" | "ia" | "pessoal";
  tipo: "alerta" | "tarefa" | "evento" | "notificacao";
  titulo: string;
  descricao: string;
  tempo: string;
  icone: React.ReactNode;
  prioridade: "alta" | "media" | "baixa";
  acoes?: { texto: string; tipo: "primary" | "outline" | "ghost" }[];
};

interface FeedInteligenteContextualProps {
  filtro?: "todos";
}

export const FeedInteligenteContextual = ({ filtro = "todos" }: FeedInteligenteContextualProps) => {
  const [tabAtiva, setTabAtiva] = useState<string>("todos");

  // Mock data organizado por contexto funcional
  const feedItems: FeedItem[] = [
    // SUPRIMENTOS & REQUISIÇÕES
    {
      id: "s1",
      modulo: "suprimentos",
      tipo: "alerta",
      titulo: "Evento EV-007 parado há 3 dias",
      descricao: "📌 Rê detectou: Este evento não recebeu propostas e está próximo do prazo",
      tempo: "10 min atrás",
      prioridade: "alta",
      icone: <AlertCircle className="h-4 w-4 text-red-500" />,
      acoes: [
        { texto: "Convidar fornecedores", tipo: "primary" },
        { texto: "Adiar prazo", tipo: "outline" },
      ],
    },
    {
      id: "s2",
      modulo: "suprimentos",
      tipo: "tarefa",
      titulo: "Requisição #REQ-203 passou do prazo",
      descricao: "Requisição de materiais de escritório aguardando aprovação há 5 dias",
      tempo: "2 horas atrás",
      prioridade: "alta",
      icone: <FileText className="h-4 w-4 text-red-500" />,
      acoes: [
        { texto: "Aprovar", tipo: "primary" },
        { texto: "Revisar", tipo: "outline" },
      ],
    },
    {
      id: "s3",
      modulo: "suprimentos",
      tipo: "notificacao",
      titulo: "Cotação #COT-891 recebeu 3 propostas",
      descricao: "Análise comparativa disponível para materiais de construção",
      tempo: "1 hora atrás",
      prioridade: "media",
      icone: <BarChart2 className="h-4 w-4 text-blue-500" />,
      acoes: [
        { texto: "Analisar", tipo: "primary" },
      ],
    },

    // FORNECEDORES
    {
      id: "f1",
      modulo: "fornecedores",
      tipo: "alerta",
      titulo: "Cadastro ABC Ltda parado há 4 dias",
      descricao: "📌 Rê detectou: Documentação incompleta está travando o processo",
      tempo: "30 min atrás",
      prioridade: "alta",
      icone: <AlertCircle className="h-4 w-4 text-red-500" />,
      acoes: [
        { texto: "Analisar", tipo: "primary" },
        { texto: "Solicitar docs", tipo: "outline" },
      ],
    },
    {
      id: "f2",
      modulo: "fornecedores",
      tipo: "tarefa",
      titulo: "5 fornecedores aguardando aprovação",
      descricao: "Cadastros completos na fila de aprovação do compliance",
      tempo: "1 hora atrás",
      prioridade: "media",
      icone: <Users className="h-4 w-4 text-orange-500" />,
      acoes: [
        { texto: "Revisar", tipo: "primary" },
      ],
    },
    {
      id: "f3",
      modulo: "fornecedores",
      tipo: "evento",
      titulo: "Reunião com XYZ Materiais",
      descricao: "Renegociação de contrato anual - sala de reuniões 3",
      tempo: "Amanhã, 14:00",
      prioridade: "media",
      icone: <Calendar className="h-4 w-4 text-blue-500" />,
      acoes: [
        { texto: "Preparar pauta", tipo: "outline" },
        { texto: "Reagendar", tipo: "ghost" },
      ],
    },

    // CONTRATOS & DOCUMENTOS
    {
      id: "c1",
      modulo: "contratos",
      tipo: "alerta",
      titulo: "3 contratos vencendo em 15 dias",
      descricao: "📌 Rê detectou: Contratos críticos precisam de renovação urgente",
      tempo: "2 horas atrás",
      prioridade: "alta",
      icone: <AlertCircle className="h-4 w-4 text-red-500" />,
      acoes: [
        { texto: "Renovar", tipo: "primary" },
        { texto: "Ver detalhes", tipo: "outline" },
      ],
    },
    {
      id: "c2",
      modulo: "contratos",
      tipo: "tarefa",
      titulo: "Contrato #CNT-445 aguarda assinatura",
      descricao: "Fornecedor Beta Corp - contrato de prestação de serviços",
      tempo: "3 horas atrás",
      prioridade: "media",
      icone: <FileText className="h-4 w-4 text-orange-500" />,
      acoes: [
        { texto: "Assinar", tipo: "primary" },
      ],
    },

    // SUGESTÕES DA RÊ (IA)
    {
      id: "ia1",
      modulo: "ia",
      tipo: "notificacao",
      titulo: "Oportunidade de economia identificada",
      descricao: "📊 Rê encontrou fornecedor alternativo 18% mais barato para categoria Papelaria",
      tempo: "4 horas atrás",
      prioridade: "media",
      icone: <Brain className="h-4 w-4 text-purple-500" />,
      acoes: [
        { texto: "Ver sugestão", tipo: "primary" },
      ],
    },
    {
      id: "ia2",
      modulo: "ia",
      tipo: "notificacao",
      titulo: "Padrão de atraso detectado",
      descricao: "📈 Fornecedor DEF Ltda tem 40% de entregas atrasadas nos últimos 60 dias",
      tempo: "6 horas atrás",
      prioridade: "media",
      icone: <Brain className="h-4 w-4 text-purple-500" />,
      acoes: [
        { texto: "Analisar", tipo: "outline" },
      ],
    },

    // ÁREA PESSOAL
    {
      id: "p1",
      modulo: "pessoal",
      tipo: "evento",
      titulo: "Reunião de planejamento mensal",
      descricao: "Revisão de KPIs e metas do setor de compras",
      tempo: "Segunda, 09:00",
      prioridade: "media",
      icone: <Calendar className="h-4 w-4 text-blue-500" />,
      acoes: [
        { texto: "Preparar", tipo: "outline" },
      ],
    },
  ];

  const getItemsByModulo = (modulo: string) => {
    if (modulo === "todos") return feedItems;
    return feedItems.filter(item => item.modulo === modulo);
  };

  const getModuloIcon = (modulo: string) => {
    switch (modulo) {
      case "suprimentos": return <Package className="h-4 w-4" />;
      case "fornecedores": return <Users className="h-4 w-4" />;
      case "contratos": return <FileText className="h-4 w-4" />;
      case "ia": return <Brain className="h-4 w-4" />;
      case "pessoal": return <User className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getModuloCount = (modulo: string) => {
    if (modulo === "todos") return feedItems.length;
    return feedItems.filter(item => item.modulo === modulo).length;
  };

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

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case "alta": return "border-l-red-500";
      case "media": return "border-l-orange-500";
      case "baixa": return "border-l-green-500";
      default: return "border-l-gray-300";
    }
  };

  const renderFeedItems = (items: FeedItem[]) => (
    <div className="divide-y divide-slate-100">
      {items.length > 0 ? (
        items.map((item) => (
          <div key={item.id} className={`py-4 hover:bg-slate-50 px-4 transition-colors border-l-2 ${getPrioridadeColor(item.prioridade)}`}>
            <div className="flex gap-3">
              <div className="icon-container icon-container-blue flex-shrink-0">
                {item.icone}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-slate-800 text-sm">{item.titulo}</h4>
                  <div className="flex gap-1">
                    <Badge variant={getBadgeVariant(item.tipo)} className="text-xs">
                      {item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mt-1">{item.descricao}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-slate-400">{item.tempo}</span>
                  <div className="flex space-x-1">
                    {item.acoes?.map((acao, i) => (
                      <Button 
                        key={i} 
                        variant={getButtonVariant(acao.tipo)}
                        size="sm" 
                        className="text-xs h-7"
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
          Nenhuma atividade encontrada neste contexto
        </div>
      )}
    </div>
  );

  return (
    <BlocoComExpandir 
      titulo="Feed Inteligente" 
      icone={<Bell className="h-5 w-5 text-slate-500" />}
      maxHeight="500px"
    >
      <Tabs value={tabAtiva} onValueChange={setTabAtiva} className="w-full">
        <TabsList className="grid w-full grid-cols-6 h-auto p-1">
          <TabsTrigger value="todos" className="flex items-center gap-1 text-xs py-2">
            <Bell className="h-3 w-3" />
            Todos ({getModuloCount("todos")})
          </TabsTrigger>
          <TabsTrigger value="suprimentos" className="flex items-center gap-1 text-xs py-2">
            <Package className="h-3 w-3" />
            Suprimentos ({getModuloCount("suprimentos")})
          </TabsTrigger>
          <TabsTrigger value="fornecedores" className="flex items-center gap-1 text-xs py-2">
            <Users className="h-3 w-3" />
            Fornecedores ({getModuloCount("fornecedores")})
          </TabsTrigger>
          <TabsTrigger value="contratos" className="flex items-center gap-1 text-xs py-2">
            <FileText className="h-3 w-3" />
            Contratos ({getModuloCount("contratos")})
          </TabsTrigger>
          <TabsTrigger value="ia" className="flex items-center gap-1 text-xs py-2">
            <Brain className="h-3 w-3" />
            IA ({getModuloCount("ia")})
          </TabsTrigger>
          <TabsTrigger value="pessoal" className="flex items-center gap-1 text-xs py-2">
            <User className="h-3 w-3" />
            Pessoal ({getModuloCount("pessoal")})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="todos" className="mt-4">
          {renderFeedItems(getItemsByModulo("todos"))}
        </TabsContent>
        
        <TabsContent value="suprimentos" className="mt-4">
          {renderFeedItems(getItemsByModulo("suprimentos"))}
        </TabsContent>
        
        <TabsContent value="fornecedores" className="mt-4">
          {renderFeedItems(getItemsByModulo("fornecedores"))}
        </TabsContent>
        
        <TabsContent value="contratos" className="mt-4">
          {renderFeedItems(getItemsByModulo("contratos"))}
        </TabsContent>
        
        <TabsContent value="ia" className="mt-4">
          {renderFeedItems(getItemsByModulo("ia"))}
        </TabsContent>
        
        <TabsContent value="pessoal" className="mt-4">
          {renderFeedItems(getItemsByModulo("pessoal"))}
        </TabsContent>
      </Tabs>
      
      {getItemsByModulo(tabAtiva).length > 0 && (
        <div className="pt-3 mt-3 border-t border-slate-100 text-center">
          <Button variant="ghost" size="sm" className="text-xs">
            Ver mais <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      )}
    </BlocoComExpandir>
  );
};
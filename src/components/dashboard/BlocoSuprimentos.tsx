import { Package, AlertCircle, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SecaoContextual } from "./SecaoContextual";

export const BlocoSuprimentos = () => {
  const eventosAbertos = [
    {
      id: "EV-007",
      titulo: "Materiais de Escritório Q2",
      status: "Aguardando propostas",
      prazo: "2 dias",
      prioridade: "alta"
    },
    {
      id: "EV-008", 
      titulo: "Equipamentos de TI",
      status: "Em análise",
      prazo: "5 dias",
      prioridade: "media"
    }
  ];

  const requisicoesNaoAprovadas = [
    {
      id: "REQ-203",
      solicitante: "Depto. Administrativo",
      valor: "R$ 2.450,00",
      diasPendente: 5
    },
    {
      id: "REQ-204",
      solicitante: "Depto. Vendas", 
      valor: "R$ 890,00",
      diasPendente: 2
    }
  ];

  const cotacoesAndamento = [
    {
      id: "COT-891",
      categoria: "Material de Construção",
      propostas: 3,
      melhorOferta: "R$ 15.200,00"
    }
  ];

  return (
    <SecaoContextual
      titulo="Suprimentos & Requisições"
      icone={Package}
      contador={eventosAbertos.length + requisicoesNaoAprovadas.length}
    >
      {/* Eventos Abertos */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            Eventos Abertos
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {eventosAbertos.map((evento) => (
              <div key={evento.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{evento.id}</span>
                    <Badge 
                      variant={evento.prioridade === "alta" ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {evento.prioridade}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600">{evento.titulo}</p>
                  <p className="text-xs text-slate-500">{evento.status} • {evento.prazo}</p>
                </div>
                <Button size="sm" variant="outline" className="text-xs">
                  Gerenciar
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Requisições Não Aprovadas */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4 text-red-500" />
            Requisições Pendentes
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {requisicoesNaoAprovadas.map((req) => (
              <div key={req.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{req.id}</span>
                    {req.diasPendente > 3 && (
                      <Badge variant="destructive" className="text-xs">
                        {req.diasPendente} dias
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-600">{req.solicitante}</p>
                  <p className="text-xs text-slate-500">{req.valor}</p>
                </div>
                <Button size="sm" className="text-xs">
                  Aprovar
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cotações em Andamento */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            Cotações em Andamento
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {cotacoesAndamento.map((cotacao) => (
              <div key={cotacao.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div>
                  <span className="font-semibold text-sm">{cotacao.id}</span>
                  <p className="text-sm text-slate-600">{cotacao.categoria}</p>
                  <p className="text-xs text-slate-500">
                    {cotacao.propostas} propostas • Melhor: {cotacao.melhorOferta}
                  </p>
                </div>
                <Button size="sm" variant="outline" className="text-xs">
                  Analisar
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </SecaoContextual>
  );
};
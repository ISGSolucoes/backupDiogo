import { Brain, TrendingDown, AlertTriangle, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SecaoContextual } from "./SecaoContextual";

export const BlocoSugestoesIA = () => {
  const oportunidadesEconomia = [
    {
      categoria: "Papelaria",
      economia: "18%",
      valorMensal: "R$ 2.340",
      fornecedorAlternativo: "Office Plus",
      confiabilidade: "95%"
    },
    {
      categoria: "Material de Limpeza",
      economia: "12%",
      valorMensal: "R$ 890",
      fornecedorAlternativo: "Clean Pro",
      confiabilidade: "87%"
    }
  ];

  const alertasPerformance = [
    {
      fornecedor: "DEF Ltda",
      problema: "40% entregas atrasadas",
      periodo: "últimos 60 dias",
      impacto: "alto",
      sugestao: "Revisar contrato ou buscar alternativas"
    },
    {
      fornecedor: "GHI Serviços",
      problema: "NPS em queda",
      periodo: "últimos 30 dias",
      impacto: "médio",
      sugestao: "Agendar reunião de alinhamento"
    }
  ];

  const melhorias = [
    {
      titulo: "Automatizar aprovação de baixo valor",
      descricao: "Requisições até R$ 500 podem ser aprovadas automaticamente",
      economia: "3h/semana",
      complexidade: "baixa"
    }
  ];

  return (
    <SecaoContextual
      titulo="Sugestões da Rê (IA)"
      icone={Brain}
      contador={oportunidadesEconomia.length + alertasPerformance.length}
    >
      {/* Oportunidades de Economia */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-green-500" />
            Oportunidades de Economia
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {oportunidadesEconomia.map((oportunidade, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg border border-purple-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{oportunidade.categoria}</span>
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                      -{oportunidade.economia}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600">
                    Economia: {oportunidade.valorMensal}/mês com {oportunidade.fornecedorAlternativo}
                  </p>
                  <p className="text-xs text-slate-500">
                    Confiabilidade: {oportunidade.confiabilidade}
                  </p>
                </div>
                <Button size="sm" className="text-xs">
                  Analisar
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alertas de Performance */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            Alertas de Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {alertasPerformance.map((alerta, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg border border-orange-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{alerta.fornecedor}</span>
                    <Badge 
                      variant={alerta.impacto === "alto" ? "destructive" : "outline"}
                      className="text-xs"
                    >
                      {alerta.impacto}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600">{alerta.problema} • {alerta.periodo}</p>
                  <p className="text-xs text-slate-500">💡 {alerta.sugestao}</p>
                </div>
                <Button size="sm" variant="outline" className="text-xs">
                  Investigar
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Melhorias de Processo */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-blue-500" />
            Melhorias de Processo
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {melhorias.map((melhoria, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg border border-blue-200">
                <div>
                  <span className="font-semibold text-sm">{melhoria.titulo}</span>
                  <p className="text-sm text-slate-600">{melhoria.descricao}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-slate-500">Economia: {melhoria.economia}</p>
                    <Badge variant="outline" className="text-xs">
                      {melhoria.complexidade}
                    </Badge>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="text-xs">
                  Implementar
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </SecaoContextual>
  );
};
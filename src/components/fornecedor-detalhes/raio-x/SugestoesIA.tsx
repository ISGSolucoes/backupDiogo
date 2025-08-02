
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Fornecedor } from "@/types/fornecedor";
import { Brain, TrendingUp, AlertTriangle, Star, Target, CheckCircle } from "lucide-react";

interface SugestoesIAProps {
  fornecedor: Fornecedor;
}

interface SugestaoIA {
  id: string;
  tipo: "recomendacao" | "alerta" | "oportunidade" | "acao";
  titulo: string;
  descricao: string;
  impacto: "alto" | "medio" | "baixo";
  prioridade: "urgente" | "alta" | "media" | "baixa";
  categoria: string;
  acaoSugerida?: string;
  icone: React.ReactNode;
  cor: string;
}

export const SugestoesIA = ({ fornecedor }: SugestoesIAProps) => {
  const sugestoes: SugestaoIA[] = [
    {
      id: "1",
      tipo: "recomendacao",
      titulo: "Candidato a Fornecedor Preferido",
      descricao: "Fornecedor premiado 3 vezes com menor SLA nos últimos 60 dias. Performance consistente e confiável.",
      impacto: "alto",
      prioridade: "alta",
      categoria: "Classificação",
      acaoSugerida: "Elevar para categoria 'Preferido'",
      icone: <Star className="h-4 w-4" />,
      cor: "bg-green-100 border-green-200 text-green-800"
    },
    {
      id: "2",
      tipo: "oportunidade",
      titulo: "Saving Acumulado Significativo",
      descricao: "Saving acumulado de R$ 70 mil nos últimos 12 meses. Recomendado para expansão de categorias.",
      impacto: "alto",
      prioridade: "media",
      categoria: "Economia",
      acaoSugerida: "Expandir para novas categorias",
      icone: <TrendingUp className="h-4 w-4" />,
      cor: "bg-blue-100 border-blue-200 text-blue-800"
    },
    {
      id: "3",
      tipo: "alerta",
      titulo: "Cotação Frequente Acima da Média",
      descricao: "Alta frequência de participação mas cotação consistentemente 15% acima da média de mercado.",
      impacto: "medio",
      prioridade: "media",
      categoria: "Preço",
      acaoSugerida: "Negociar condições comerciais",
      icone: <AlertTriangle className="h-4 w-4" />,
      cor: "bg-amber-100 border-amber-200 text-amber-800"
    },
    {
      id: "4",
      tipo: "acao",
      titulo: "Oportunidade de Negociação",
      descricao: "Ticket médio de R$ 249k sugere potencial para negociação de desconto por volume.",
      impacto: "medio",
      prioridade: "baixa",
      categoria: "Negociação",
      acaoSugerida: "Propor contrato de volume",
      icone: <Target className="h-4 w-4" />,
      cor: "bg-purple-100 border-purple-200 text-purple-800"
    },
    {
      id: "5",
      tipo: "recomendacao",
      titulo: "Excelente SLA de Entrega",
      descricao: "SLA médio de 4.5 dias está dentro da meta. Fornecedor confiável para entregas críticas.",
      impacto: "alto",
      prioridade: "baixa",
      categoria: "Operacional",
      acaoSugerida: "Priorizar para pedidos urgentes",
      icone: <CheckCircle className="h-4 w-4" />,
      cor: "bg-green-100 border-green-200 text-green-800"
    }
  ];

  const getPrioridadeBadge = (prioridade: SugestaoIA["prioridade"]) => {
    const cores = {
      urgente: "bg-red-100 text-red-800",
      alta: "bg-orange-100 text-orange-800",
      media: "bg-yellow-100 text-yellow-800",
      baixa: "bg-gray-100 text-gray-800"
    };
    return cores[prioridade];
  };

  const getImpactoBadge = (impacto: SugestaoIA["impacto"]) => {
    const cores = {
      alto: "bg-red-100 text-red-800",
      medio: "bg-amber-100 text-amber-800",
      baixo: "bg-gray-100 text-gray-800"
    };
    return cores[impacto];
  };

  const handleExecutarAcao = (sugestao: SugestaoIA) => {
    // Aqui seria implementada a lógica para executar a ação
    console.log(`Executando ação para: ${sugestao.titulo}`);
  };

  return (
    <div className="space-y-4">
      {/* Header com estatísticas */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600" />
          <span className="text-lg font-semibold">Análise Inteligente</span>
        </div>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>
            <strong>{sugestoes.filter(s => s.tipo === "recomendacao").length}</strong> recomendações
          </span>
          <span>
            <strong>{sugestoes.filter(s => s.tipo === "alerta").length}</strong> alertas
          </span>
          <span>
            <strong>{sugestoes.filter(s => s.tipo === "oportunidade").length}</strong> oportunidades
          </span>
        </div>
      </div>

      {/* Lista de sugestões */}
      <div className="space-y-3">
        {sugestoes.map((sugestao) => (
          <Card key={sugestao.id} className={`border-l-4 ${sugestao.cor.includes('green') ? 'border-l-green-500' : 
            sugestao.cor.includes('blue') ? 'border-l-blue-500' : 
            sugestao.cor.includes('amber') ? 'border-l-amber-500' : 
            sugestao.cor.includes('purple') ? 'border-l-purple-500' : 'border-l-gray-500'}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {sugestao.icone}
                  <CardTitle className="text-lg">{sugestao.titulo}</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className={getPrioridadeBadge(sugestao.prioridade)}>
                    {sugestao.prioridade}
                  </Badge>
                  <Badge variant="outline" className={getImpactoBadge(sugestao.impacto)}>
                    {sugestao.impacto}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">{sugestao.descricao}</p>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{sugestao.categoria}</Badge>
                {sugestao.acaoSugerida && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExecutarAcao(sugestao)}
                    className="text-sm"
                  >
                    {sugestao.acaoSugerida}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Resumo executivo */}
      <Card className="bg-slate-50 border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Resumo Executivo da IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-white rounded-lg border">
              <p className="text-sm">
                <strong>Recomendação Principal:</strong> {fornecedor.nome} demonstra performance consistente com 
                saving acumulado de R$ 70 mil e SLA médio de 4.5 dias. Recomendado para elevação à categoria 
                'Preferido' com expansão para novas categorias de fornecimento.
              </p>
            </div>
            <div className="p-3 bg-white rounded-lg border">
              <p className="text-sm">
                <strong>Próximos Passos:</strong> Negociar condições comerciais para otimizar preços e 
                propor contrato de volume aproveitando o ticket médio elevado de R$ 249k.
              </p>
            </div>
            <div className="p-3 bg-white rounded-lg border">
              <p className="text-sm">
                <strong>Impacto Esperado:</strong> Potencial de economia adicional de 3-5% através da 
                negociação de volume e redução de 20% no tempo de ciclo de cotação.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

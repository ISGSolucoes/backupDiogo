
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, FileText, X, TrendingDown } from "lucide-react";

interface SugestoesAposAvaliacaoProps {
  scoreAvaliacao: number;
  fornecedorNome: string;
  onFechar?: () => void;
}

export const SugestoesAposAvaliacao = ({ 
  scoreAvaliacao, 
  fornecedorNome,
  onFechar 
}: SugestoesAposAvaliacaoProps) => {
  const [alertasFechados, setAlertasFechados] = useState<string[]>([]);

  const getSugestoesPorScore = (score: number) => {
    const sugestoes = [];

    if (score < 7) {
      sugestoes.push({
        id: "plano-acao-score-baixo",
        titulo: "Alguns fornecedores receberam score abaixo de 7",
        descricao: "Considere criar um plano de ação.",
        acao: "Criar Plano de Ação",
        icone: AlertTriangle,
        urgencia: "alta"
      });
    }

    if (score < 5) {
      sugestoes.push({
        id: "revisar-fornecedor",
        titulo: "Score crítico detectado",
        descricao: `${fornecedorNome} precisa de atenção imediata`,
        acao: "Revisar Fornecedor",
        icone: TrendingDown,
        urgencia: "alta"
      });
    }

    // Sugestão geral sempre presente
    sugestoes.push({
      id: "documentar-avaliacao",
      titulo: "Avaliação concluída",
      descricao: "Documente os próximos passos necessários",
      acao: "Ver Histórico",
      icone: FileText,
      urgencia: "baixa"
    });

    return sugestoes;
  };

  const sugestoes = getSugestoesPorScore(scoreAvaliacao).filter(
    sugestao => !alertasFechados.includes(sugestao.id)
  );

  const fecharAlerta = (alertaId: string) => {
    setAlertasFechados(prev => [...prev, alertaId]);
  };

  const fecharTodos = () => {
    if (onFechar) {
      onFechar();
    }
  };

  if (sugestoes.length === 0) return null;

  const getCorUrgencia = (urgencia: string) => {
    const cores = {
      alta: "bg-red-100 text-red-700 border-red-200",
      media: "bg-yellow-100 text-yellow-700 border-yellow-200", 
      baixa: "bg-green-100 text-green-700 border-green-200"
    };
    return cores[urgencia as keyof typeof cores] || cores.baixa;
  };

  return (
    <div className="fixed bottom-20 right-6 z-40 w-80">
      <div className="border rounded-lg p-3 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-800">Próximos passos:</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-white/50"
            onClick={fecharTodos}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
        
        <div className="space-y-2">
          {sugestoes.map((sugestao) => {
            const Icon = sugestao.icone;
            return (
              <Card key={sugestao.id} className={`${getCorUrgencia(sugestao.urgencia)} border relative`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-1 right-1 h-6 w-6 p-0 hover:bg-white/50"
                  onClick={() => fecharAlerta(sugestao.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
                <CardContent className="p-3 pr-8">
                  <div className="flex items-start gap-3">
                    <div className="bg-white rounded-full p-1">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium mb-1">{sugestao.titulo}</h4>
                      <p className="text-xs opacity-80 mb-2">{sugestao.descricao}</p>
                      <Button 
                        size="sm" 
                        className="h-6 text-xs bg-white hover:bg-slate-50 text-slate-700 border"
                      >
                        {sugestao.acao}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

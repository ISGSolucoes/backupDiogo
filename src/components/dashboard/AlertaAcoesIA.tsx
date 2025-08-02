
import React from "react";
import { Brain, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useAcoesRecomendadas } from "@/hooks/useAcoesRecomendadas";
import { useNavigate } from "react-router-dom";

export const AlertaAcoesIA = () => {
  const { data: acoes = [] } = useAcoesRecomendadas();
  const navigate = useNavigate();
  
  const acoesUrgentes = acoes.filter(acao => acao.prioridade === 'alta').length;
  const totalAcoes = acoes.length;

  if (totalAcoes === 0) return null;

  const handleVerAcoes = () => {
    navigate('/fornecedores');
    // Em uma implementação mais sofisticada, poderia abrir o modal diretamente
  };

  return (
    <Alert className="border-orange-200 bg-orange-50">
      <Brain className="h-4 w-4 text-orange-600" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>
            Você tem <strong>{totalAcoes} ações recomendadas pela IA</strong> para revisar hoje.
          </span>
          {acoesUrgentes > 0 && (
            <Badge variant="destructive" className="text-xs">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {acoesUrgentes} urgentes
            </Badge>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={handleVerAcoes}>
          Ver Ações
        </Button>
      </AlertDescription>
    </Alert>
  );
};

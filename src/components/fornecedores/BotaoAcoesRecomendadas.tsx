
import React, { useState } from "react";
import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAcoesRecomendadas } from "@/hooks/useAcoesRecomendadas";
import { AcoesRecomendadasModal } from "./AcoesRecomendadasModal";

export const BotaoAcoesRecomendadas = () => {
  const [modalAberto, setModalAberto] = useState(false);
  const { data: acoes = [] } = useAcoesRecomendadas();
  
  const acoesUrgentes = acoes.filter(acao => acao.prioridade === 'alta').length;
  const totalAcoes = acoes.length;

  return (
    <>
      <Button 
        onClick={() => setModalAberto(true)}
        variant="outline"
        className="relative flex items-center gap-2"
      >
        <Brain className="h-4 w-4" />
        Ações Recomendadas pela IA
        {totalAcoes > 0 && (
          <Badge 
            variant={acoesUrgentes > 0 ? "destructive" : "secondary"} 
            className="text-xs"
          >
            {totalAcoes}
          </Badge>
        )}
      </Button>
      
      <AcoesRecomendadasModal 
        open={modalAberto}
        onOpenChange={setModalAberto}
      />
    </>
  );
};

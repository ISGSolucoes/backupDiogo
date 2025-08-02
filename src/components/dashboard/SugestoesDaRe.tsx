
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlocoComExpandir } from "./BlocoComExpandir";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Sugestao {
  id: string;
  texto: string;
  tipo: "economia" | "processo" | "fornecedor" | "insight";
}

export const SugestoesDaRe = () => {
  // Mock data
  const sugestoes: Sugestao[] = [
    {
      id: "1",
      texto: "Você poderia economizar 15% no contrato XYZ consolidando os pedidos mensais.",
      tipo: "economia",
    },
    {
      id: "2",
      texto: "O fornecedor ABC não atualiza documentação há 3 meses. Deseja enviar lembrete?",
      tipo: "fornecedor",
    },
    {
      id: "3",
      texto: "3 eventos similares foram criados este mês. Que tal consolidá-los para maior economia?",
      tipo: "processo",
    },
  ];

  const getTipoIcon = (tipo: string) => {
    return <Sparkles className="h-4 w-4 text-sourcexpress-purple" />;
  };

  const getTooltipDescricao = (tipo: string) => {
    switch (tipo) {
      case "economia":
        return "Aplicar esta sugestão iniciará um processo de consolidação de pedidos, que poderá gerar economia estimada.";
      case "fornecedor":
        return "Ao aplicar, um lembrete será enviado automaticamente ao fornecedor sobre a documentação pendente.";
      case "processo":
        return "Aplicar esta sugestão abrirá o assistente de consolidação de eventos para unificá-los.";
      case "insight":
        return "Ao aplicar, você verá uma análise detalhada com recomendações específicas.";
      default:
        return "Aplicar esta sugestão da IA Rê.";
    }
  };

  const getIgnorarDescricao = (tipo: string) => {
    switch (tipo) {
      case "economia":
        return "Esta sugestão será arquivada e não aparecerá novamente. Você pode reativá-la nas configurações.";
      case "fornecedor":
        return "O lembrete não será enviado e esta sugestão será arquivada temporariamente.";
      case "processo":
        return "Esta sugestão será ignorada e arquivada. A IA não sugerirá esta consolidação novamente.";
      case "insight":
        return "Este insight será ignorado. Você pode ver todos os insights arquivados nas configurações.";
      default:
        return "Ignorar esta sugestão da IA Rê.";
    }
  };

  return (
    <BlocoComExpandir 
      titulo="Sugestões da Rê" 
      icone={<Sparkles className="h-5 w-5 text-sourcexpress-purple" />}
      maxHeight="300px"
    >
      <div className="divide-y divide-slate-100">
        {sugestoes.map((sugestao) => (
          <div key={sugestao.id} className="p-4 hover:bg-slate-50">
            <div className="flex gap-3">
              <div className="mt-0.5 bg-sourcexpress-purple/10 p-1 rounded-full">
                {getTipoIcon(sugestao.tipo)}
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-700">{sugestao.texto}</p>
                <div className="flex justify-end mt-2 space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-xs">
                          Ignorar
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs text-sm">
                        <p>{getIgnorarDescricao(sugestao.tipo)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="default" size="sm" className="text-xs">
                          Aplicar
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs text-sm">
                        <p>{getTooltipDescricao(sugestao.tipo)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </BlocoComExpandir>
  );
};


import React, { useState } from "react";
import { toast } from "sonner";
import { ExpandedDialog } from "@/components/ui/expanded-dialog";
import { useFullscreenModal } from "@/hooks/useFullscreenModal";
import { Button } from "@/components/ui/button";
import { SelecionarFornecedor } from "./etapas/SelecionarFornecedor";
import { DesignarAvaliador } from "./etapas/DesignarAvaliador";
import { PreencherQuestionario } from "./etapas/PreencherQuestionario";
import { ConfirmarEnviar } from "./etapas/ConfirmarEnviar";
import { Fornecedor } from "@/types/fornecedor";
import { Award, CheckCircle2, FileQuestion, UserCheck } from "lucide-react";

interface AvaliarDesempenhoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

type Etapa = 1 | 2 | 3 | 4;

export const AvaliarDesempenhoModal: React.FC<AvaliarDesempenhoModalProps> = ({
  open,
  onOpenChange,
  onComplete
}) => {
  const [etapaAtual, setEtapaAtual] = useState<Etapa>(1);
  const [fornecedoresSelecionados, setFornecedoresSelecionados] = useState<Fornecedor[]>([]);
  const [avaliador, setAvaliador] = useState<string>("");
  const [respostas, setRespostas] = useState<Record<string, any>>({});
  const [resultadoAvaliacao, setResultadoAvaliacao] = useState<any>(null);
  
  const { isFullscreen, toggleFullscreen } = useFullscreenModal();

  const avancarEtapa = () => {
    if (etapaAtual < 4) {
      setEtapaAtual((etapaAtual + 1) as Etapa);
    }
  };

  const voltarEtapa = () => {
    if (etapaAtual > 1) {
      setEtapaAtual((etapaAtual - 1) as Etapa);
    }
  };

  const fecharModal = () => {
    // Resetar o estado ao fechar o modal
    setEtapaAtual(1);
    setFornecedoresSelecionados([]);
    setAvaliador("");
    setRespostas({});
    setResultadoAvaliacao(null);
    onOpenChange(false);
  };

  const handleFornecedoresSelecionados = (fornecedores: Fornecedor[]) => {
    setFornecedoresSelecionados(fornecedores);
  };

  const handleAvaliadorSelecionado = (novoAvaliador: string) => {
    setAvaliador(novoAvaliador);
  };

  const handleRespostasQuestionario = (novasRespostas: Record<string, any>) => {
    setRespostas(novasRespostas);
  };

  const handleSubmit = () => {
    // Simular cálculo de score pela IA
    const calcularScore = () => {
      // Contar respostas positivas (Sim)
      const respostasPositivas = Object.entries(respostas).filter(
        ([id, valor]) => 
          id !== "pergunta7" && // Excluir comentário
          id !== "pergunta6" && // Excluir problema crítico (é negativo)
          valor === true
      ).length;
      
      // Total de perguntas Sim/Não (exceto a de problema crítico)
      const totalPerguntas = 5;
      
      // Calcular score em escala de 0 a 10
      const score = Math.round((respostasPositivas / totalPerguntas) * 10);
      
      // Se houver problema crítico, reduzir o score
      if (respostas.pergunta6 === true) {
        return Math.max(0, score - 2); // Reduz 2 pontos, mas não abaixo de 0
      }
      
      return score;
    };

    const identificarPontoForte = () => {
      if (respostas.pergunta1) return "Cumpre os prazos acordados";
      if (respostas.pergunta2) return "Entrega com qualidade satisfatória";
      if (respostas.pergunta3) return "Boa comunicação com a equipe";
      if (respostas.pergunta4) return "Atende aos requisitos técnicos";
      if (respostas.pergunta5) return "Recomendado pela equipe interna";
      return "Sem pontos fortes destacados";
    };

    const identificarPontoFraco = () => {
      if (!respostas.pergunta1) return "Não cumpre os prazos acordados";
      if (!respostas.pergunta2) return "Qualidade abaixo do esperado";
      if (!respostas.pergunta3) return "Comunicação inadequada";
      if (!respostas.pergunta4) return "Não atende requisitos técnicos";
      if (!respostas.pergunta5) return "Não é recomendado pela equipe";
      return null;
    };

    const gerarAlerta = () => {
      if (respostas.pergunta6) return "ALERTA: Ocorreram problemas críticos na entrega";
      return null;
    };

    // Calcular o resultado da avaliação
    const score = calcularScore();
    const pontoForte = identificarPontoForte();
    const pontoFraco = identificarPontoFraco();
    const alerta = gerarAlerta();

    const resultado = {
      score,
      pontoForte,
      pontoFraco,
      alerta,
      comentario: respostas.pergunta7 || "",
      avaliador,
      data: new Date().toLocaleDateString("pt-BR"),
    };

    setResultadoAvaliacao(resultado);

    // Simular salvamento no banco de dados
    setTimeout(() => {
      // Exibir notificação de sucesso
      if (fornecedoresSelecionados.length === 1) {
        toast.success(`Avaliação do fornecedor ${fornecedoresSelecionados[0].nome} concluída. Score: ${score}/10`);
      } else {
        toast.success(`Avaliação de ${fornecedoresSelecionados.length} fornecedores concluída.`);
      }
      
      // Se houver score baixo, exibir alerta
      if (score < 7) {
        toast.warning("Alguns fornecedores receberam score abaixo de 7. Considere criar um plano de ação.", {
          duration: 5000,
        });
      }
      
      onComplete();
      fecharModal();
    }, 1500);
  };

  // Render step content
  const renderizarEtapa = () => {
    switch (etapaAtual) {
      case 1:
        return (
          <SelecionarFornecedor 
            onFornecedoresSelecionados={handleFornecedoresSelecionados} 
            fornecedoresSelecionados={fornecedoresSelecionados}
          />
        );
      case 2:
        return (
          <DesignarAvaliador 
            onAvaliadorSelecionado={handleAvaliadorSelecionado}
            avaliadorAtual={avaliador}
          />
        );
      case 3:
        return (
          <PreencherQuestionario 
            onRespostasChange={handleRespostasQuestionario}
            respostasAtuais={respostas}
          />
        );
      case 4:
        return (
          <ConfirmarEnviar 
            fornecedores={fornecedoresSelecionados}
            avaliador={avaliador}
            respostas={respostas}
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  // Step titles and descriptions
  const getTituloEtapa = () => {
    switch (etapaAtual) {
      case 1: return "Selecionar Fornecedores";
      case 2: return "Designar Avaliador";
      case 3: return "Preencher Questionário";
      case 4: return "Confirmar e Enviar";
      default: return "";
    }
  };

  const getDescricaoEtapa = () => {
    switch (etapaAtual) {
      case 1: return "Selecione um ou mais fornecedores para avaliar";
      case 2: return "Quem será responsável pela avaliação?";
      case 3: return "Preencha o questionário de avaliação abaixo";
      case 4: return "Verifique as informações e confirme o envio";
      default: return "";
    }
  };

  const getIconeEtapa = () => {
    switch (etapaAtual) {
      case 1: return <Award className="h-5 w-5 text-blue-600 mr-2" />;
      case 2: return <UserCheck className="h-5 w-5 text-blue-600 mr-2" />;
      case 3: return <FileQuestion className="h-5 w-5 text-blue-600 mr-2" />;
      case 4: return <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2" />;
      default: return null;
    }
  };

  return (
    <ExpandedDialog
      open={open}
      onOpenChange={onOpenChange}
      title={getTituloEtapa()}
      description={getDescricaoEtapa()}
      fullscreen={isFullscreen}
      onToggleFullscreen={toggleFullscreen}
      className="flex flex-col"
    >
      <div className="flex-1 overflow-y-auto">
        {/* Progress Indicator */}
        <div className="flex justify-between mb-6 px-2">
          {[1, 2, 3, 4].map((etapa) => (
            <div key={etapa} className="flex flex-col items-center">
              <div 
                className={`rounded-full w-8 h-8 flex items-center justify-center mb-1 ${
                  etapa === etapaAtual 
                    ? 'bg-blue-600 text-white' 
                    : etapa < etapaAtual 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-gray-100 text-gray-400'
                }`}
              >
                {etapa}
              </div>
              <div 
                className={`text-xs ${
                  etapa === etapaAtual 
                    ? 'text-blue-600 font-medium' 
                    : etapa < etapaAtual 
                      ? 'text-blue-400' 
                      : 'text-gray-400'
                }`}
              >
                Etapa {etapa}
              </div>
            </div>
          ))}
        </div>

        {/* Current step content */}
        <div className="py-4">
          {renderizarEtapa()}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex-shrink-0 border-t pt-4 mt-6">
        <div className="flex justify-between">
          <div>
            <Button 
              variant="outline" 
              onClick={fecharModal}
            >
              Cancelar
            </Button>
          </div>
          <div className="flex gap-2">
            {etapaAtual > 1 && (
              <Button 
                variant="outline" 
                onClick={voltarEtapa}
              >
                Voltar
              </Button>
            )}
            {etapaAtual < 4 ? (
              <Button 
                onClick={avancarEtapa}
                disabled={
                  (etapaAtual === 1 && fornecedoresSelecionados.length === 0) ||
                  (etapaAtual === 2 && !avaliador)
                }
              >
                Avançar
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
              >
                Finalizar
              </Button>
            )}
          </div>
        </div>
      </div>
    </ExpandedDialog>
  );
};

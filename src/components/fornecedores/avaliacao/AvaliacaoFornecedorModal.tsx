
import React, { useState } from "react";
import { toast } from "sonner";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetFooter, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SelecionarFornecedor } from "./etapas/SelecionarFornecedor";
import { DesignarAvaliador } from "./etapas/DesignarAvaliador";
import { PreencherQuestionario } from "./etapas/PreencherQuestionario";
import { ConfirmarEnviar } from "./etapas/ConfirmarEnviar";
import { Fornecedor } from "@/types/fornecedor";
import { AvaliacaoDesempenho } from "@/types/avaliacao";
import { Award, CheckCircle2, FileQuestion, UserCheck } from "lucide-react";

interface AvaliacaoFornecedorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

type Etapa = 1 | 2 | 3 | 4;

export const AvaliacaoFornecedorModal: React.FC<AvaliacaoFornecedorModalProps> = ({
  open,
  onOpenChange,
  onComplete
}) => {
  const [etapaAtual, setEtapaAtual] = useState<Etapa>(1);
  const [fornecedoresSelecionados, setFornecedoresSelecionados] = useState<Fornecedor[]>([]);
  const [avaliador, setAvaliador] = useState<string>("");
  const [respostas, setRespostas] = useState<Record<string, any>>({});
  const [resultadoAvaliacao, setResultadoAvaliacao] = useState<any>(null);

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
      const respostasPositivas = Object.values(respostas).filter(
        (resposta) => resposta === true || resposta === "Sim"
      ).length;
      
      // Calcular porcentagem (excluindo comentário)
      const totalPerguntas = 6; // 6 perguntas Sim/Não
      const score = Math.round((respostasPositivas / totalPerguntas) * 10);
      
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
      toast.success(`Avaliação concluída com sucesso. Score: ${score}/10`);
      onComplete();
      fecharModal();
    }, 1500);
  };

  // Renderizar conteúdo da etapa atual
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

  // Títulos e descrições para cada etapa
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[95vw] max-w-[95vw] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            {getIconeEtapa()}
            {getTituloEtapa()}
          </SheetTitle>
          <SheetDescription>
            {getDescricaoEtapa()}
          </SheetDescription>
        </SheetHeader>

        {/* Indicador de Progresso */}
        <div className="flex justify-between mb-6 mt-4 px-2">
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

        {/* Conteúdo da etapa atual */}
        <div className="py-4">
          {renderizarEtapa()}
        </div>

        {/* Botões de navegação */}
        <SheetFooter className="flex justify-between sm:justify-between">
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
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

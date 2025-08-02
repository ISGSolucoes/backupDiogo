
import React from "react";
import { Button } from "@/components/ui/button";
import { Fornecedor } from "@/types/fornecedor";
import { Award, Check, AlertCircle, User, MessageSquare } from "lucide-react";

interface ConfirmarEnviarProps {
  fornecedores: Fornecedor[];
  avaliador: string;
  respostas: Record<string, any>;
  onSubmit: () => void;
}

export const ConfirmarEnviar: React.FC<ConfirmarEnviarProps> = ({
  fornecedores,
  avaliador,
  respostas,
  onSubmit
}) => {
  // Calcular o score preliminar
  const calcularScorePreliminar = () => {
    // Contar respostas positivas (Sim)
    const respostasPositivas = Object.entries(respostas)
      .filter(([id, valor]) => 
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

  const scorePreliminar = calcularScorePreliminar();

  // Determinar a classe de cor com base no score
  const getScoreColorClass = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  // Verificar se todas as perguntas obrigatórias foram respondidas
  const temRespostasPendentes = () => {
    for (let i = 1; i <= 6; i++) {
      const perguntaId = `pergunta${i}`;
      if (respostas[perguntaId] === undefined) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 rounded-md border border-green-100">
        <div className="flex items-start">
          <Check className="h-6 w-6 text-green-600 mr-2 mt-0.5" />
          <div>
            <h3 className="font-medium text-green-800">Quase lá!</h3>
            <p className="text-sm text-green-700 mt-1">
              Revise os dados abaixo e confirme para finalizar a avaliação.
            </p>
          </div>
        </div>
      </div>

      {/* Resumo da avaliação */}
      <div className="space-y-5">
        {/* Fornecedores */}
        <div className="border rounded-md p-4">
          <h3 className="text-sm font-medium flex items-center mb-3">
            <Award className="h-4 w-4 mr-2 text-blue-600" /> 
            Fornecedores selecionados
          </h3>
          <div className="space-y-2">
            {fornecedores.map((fornecedor) => (
              <div key={fornecedor.id} className="flex justify-between text-sm p-2 bg-slate-50 rounded-md">
                <span>{fornecedor.nome}</span>
                <span className="text-slate-500">{fornecedor.cnpj}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Avaliador */}
        <div className="border rounded-md p-4">
          <h3 className="text-sm font-medium flex items-center mb-3">
            <User className="h-4 w-4 mr-2 text-blue-600" /> 
            Responsável pela avaliação
          </h3>
          <div className="text-sm bg-slate-50 p-2 rounded-md">
            {avaliador}
          </div>
        </div>

        {/* Score Preliminar */}
        <div className="border rounded-md p-4">
          <h3 className="text-sm font-medium flex items-center mb-3">
            <MessageSquare className="h-4 w-4 mr-2 text-blue-600" /> 
            Análise Preliminar
          </h3>
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Score Calculado:</span>
            <span className={`text-xl font-bold ${getScoreColorClass(scorePreliminar)}`}>
              {scorePreliminar}/10
            </span>
          </div>
          
          {/* Alerta para problemas críticos */}
          {respostas.pergunta6 === true && (
            <div className="bg-red-50 border border-red-100 rounded-md p-3 text-sm mb-3 flex items-start">
              <AlertCircle className="h-4 w-4 text-red-600 mr-2 mt-0.5" />
              <div>
                <span className="font-medium text-red-800">Problema crítico detectado</span>
                <p className="text-red-700 mt-1">
                  Foi registrado um problema crítico com este fornecedor. Isto resultou em 
                  uma redução no score final.
                </p>
              </div>
            </div>
          )}
          
          {/* Comentário, se houver */}
          {respostas.pergunta7 && (
            <div className="mt-3">
              <h4 className="text-sm font-medium mb-1">Comentário registrado:</h4>
              <div className="bg-slate-50 p-2 rounded-md text-sm italic">
                "{respostas.pergunta7}"
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Botão de submissão */}
      <div className="flex justify-center mt-6">
        <Button
          onClick={onSubmit}
          size="lg"
          disabled={temRespostasPendentes()}
          className="w-full"
        >
          Confirmar e Finalizar Avaliação
        </Button>
      </div>
      
      {temRespostasPendentes() && (
        <p className="text-sm text-red-600 text-center">
          Existem perguntas não respondidas no questionário. Volte à etapa anterior para completá-las.
        </p>
      )}
    </div>
  );
};

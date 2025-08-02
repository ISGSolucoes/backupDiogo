
import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatarData } from "@/utils/dateUtils";

interface PreencherQuestionarioProps {
  onRespostasChange: (respostas: Record<string, any>) => void;
  respostasAtuais: Record<string, any>;
}

const perguntas = [
  {
    id: "produto_servico",
    texto: "Produto/Serviço",
    tipo: "texto"
  },
  {
    id: "descricao",
    texto: "Descrição detalhada",
    tipo: "texto"
  },
  {
    id: "quantidade",
    texto: "Quantidade desejada",
    tipo: "numero"
  },
  {
    id: "unidade",
    texto: "Unidade de medida",
    tipo: "select"
  },
  {
    id: "valor_orcado",
    texto: "Valor orçado (R$)",
    tipo: "valor"
  },
  {
    id: "pergunta1",
    texto: "O fornecedor cumpriu o prazo acordado?",
    tipo: "simNao"
  },
  {
    id: "pergunta2",
    texto: "A qualidade do material/serviço foi satisfatória?",
    tipo: "simNao"
  },
  {
    id: "pergunta3",
    texto: "Houve boa comunicação com a equipe?",
    tipo: "simNao"
  },
  {
    id: "pergunta4",
    texto: "A entrega atendeu aos requisitos?",
    tipo: "simNao"
  },
  {
    id: "pergunta5",
    texto: "Você recomendaria esse fornecedor?",
    tipo: "simNao"
  },
  {
    id: "pergunta6",
    texto: "Houve algum problema crítico?",
    tipo: "simNao"
  },
  {
    id: "data_necessidade",
    texto: "Data de necessidade",
    tipo: "data"
  },
  {
    id: "pergunta7",
    texto: "Comentário adicional",
    tipo: "texto"
  }
];

export const PreencherQuestionario: React.FC<PreencherQuestionarioProps> = ({
  onRespostasChange,
  respostasAtuais
}) => {
  const [respostas, setRespostas] = useState<Record<string, any>>(respostasAtuais || {});

  useEffect(() => {
    // Atualizar o componente pai quando as respostas mudarem
    onRespostasChange(respostas);
  }, [respostas, onRespostasChange]);

  const handleSimNaoChange = (perguntaId: string, value: string) => {
    setRespostas({
      ...respostas,
      [perguntaId]: value === "sim"
    });
  };

  const handleTextChange = (perguntaId: string, value: string) => {
    setRespostas({
      ...respostas,
      [perguntaId]: value
    });
  };

  const handleNumberChange = (perguntaId: string, value: string) => {
    setRespostas({
      ...respostas,
      [perguntaId]: value ? Number(value) : null
    });
  };

  const handleDateChange = (perguntaId: string, value: string) => {
    setRespostas({
      ...respostas,
      [perguntaId]: value
    });
  };

  const handleSelectChange = (perguntaId: string, value: string) => {
    setRespostas({
      ...respostas,
      [perguntaId]: value
    });
  };

  const renderPergunta = (pergunta: any) => {
    switch (pergunta.tipo) {
      case "texto":
        return (
          <Textarea
            id={pergunta.id}
            placeholder={`Digite ${pergunta.texto.toLowerCase()} aqui...`}
            value={respostas[pergunta.id] || ""}
            onChange={(e) => handleTextChange(pergunta.id, e.target.value)}
            className="min-h-[100px]"
          />
        );
      case "simNao":
        return (
          <RadioGroup
            value={respostas[pergunta.id] === true ? "sim" : respostas[pergunta.id] === false ? "nao" : ""}
            onValueChange={(value) => handleSimNaoChange(pergunta.id, value)}
            className="flex space-x-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sim" id={`${pergunta.id}-sim`} />
              <Label htmlFor={`${pergunta.id}-sim`}>Sim</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nao" id={`${pergunta.id}-nao`} />
              <Label htmlFor={`${pergunta.id}-nao`}>Não</Label>
            </div>
          </RadioGroup>
        );
      case "numero":
        return (
          <Input
            id={pergunta.id}
            type="number"
            placeholder="0"
            value={respostas[pergunta.id] || ""}
            onChange={(e) => handleNumberChange(pergunta.id, e.target.value)}
            min={0}
          />
        );
      case "valor":
        return (
          <Input
            id={pergunta.id}
            type="number"
            placeholder="0.00"
            value={respostas[pergunta.id] || ""}
            onChange={(e) => handleNumberChange(pergunta.id, e.target.value)}
            step="0.01"
            min={0}
            className="text-right"
          />
        );
      case "data":
        return (
          <Input
            id={pergunta.id}
            type="date"
            value={respostas[pergunta.id] || ""}
            onChange={(e) => handleDateChange(pergunta.id, e.target.value)}
          />
        );
      case "select":
        return (
          <Select
            value={respostas[pergunta.id] || ""}
            onValueChange={(value) => handleSelectChange(pergunta.id, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a unidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="un">Unidade</SelectItem>
              <SelectItem value="cx">Caixa</SelectItem>
              <SelectItem value="kg">Quilograma</SelectItem>
              <SelectItem value="l">Litro</SelectItem>
              <SelectItem value="m">Metro</SelectItem>
              <SelectItem value="m2">Metro quadrado</SelectItem>
              <SelectItem value="h">Hora</SelectItem>
              <SelectItem value="srv">Serviço</SelectItem>
            </SelectContent>
          </Select>
        );
      default:
        return <p>Tipo de pergunta não suportado</p>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 p-4 rounded-md mb-4">
        <h3 className="text-sm font-medium text-slate-800 mb-1">Instruções:</h3>
        <p className="text-sm text-slate-600">
          Preencha os detalhes do produto/serviço requisitado e responda às perguntas sobre o desempenho do fornecedor.
          Estas informações serão utilizadas para calcular o score final e identificar pontos fortes e fracos.
        </p>
      </div>

      <div className="space-y-6">
        {/* Campos de requisição destacados */}
        <div className="border-2 border-amber-200 rounded-md p-4 bg-amber-50">
          <h3 className="text-lg font-medium text-amber-800 mb-3">Detalhes da Requisição</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {perguntas.slice(0, 2).map((pergunta) => (
              <div key={pergunta.id} className="border rounded-md p-4 bg-white">
                <Label htmlFor={pergunta.id} className="font-medium mb-2 block">
                  {pergunta.texto}
                </Label>
                {renderPergunta(pergunta)}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {perguntas.slice(2, 5).map((pergunta) => (
              <div key={pergunta.id} className="border rounded-md p-4 bg-white">
                <Label htmlFor={pergunta.id} className="font-medium mb-2 block">
                  {pergunta.texto}
                </Label>
                {renderPergunta(pergunta)}
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <div className="border rounded-md p-4 bg-white">
              <Label htmlFor="data_necessidade" className="font-medium mb-2 block">
                Data de necessidade
              </Label>
              {renderPergunta(perguntas.find(p => p.id === "data_necessidade"))}
            </div>
          </div>
        </div>
        
        {/* Perguntas de avaliação */}
        <h3 className="text-lg font-medium text-slate-800 mt-6">Avaliação do Fornecedor</h3>
        {perguntas.slice(5, 11).map((pergunta) => (
          <div key={pergunta.id} className="border rounded-md p-4">
            <Label htmlFor={pergunta.id} className="font-medium mb-3 block">
              {pergunta.texto}
            </Label>
            {renderPergunta(pergunta)}
          </div>
        ))}
        
        {/* Comentário adicional */}
        <div className="border rounded-md p-4">
          <Label htmlFor="pergunta7" className="font-medium mb-3 block">
            {perguntas[perguntas.length - 1].texto}
          </Label>
          {renderPergunta(perguntas[perguntas.length - 1])}
        </div>
      </div>
    </div>
  );
};


import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Star, Save, AlertCircle } from "lucide-react";
import { Fornecedor } from "@/types/fornecedor";
import { toast } from "sonner";

interface AvaliarFornecedorProps {
  fornecedor: Fornecedor;
  onAvaliacaoCompleta: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const AvaliarFornecedor = ({ 
  fornecedor, 
  onAvaliacaoCompleta, 
  isOpen = false, 
  onClose 
}: AvaliarFornecedorProps) => {
  const [qualidadeScore, setQualidadeScore] = useState([75]);
  const [prazoScore, setPrazoScore] = useState([80]);
  const [precoScore, setPrecoScore] = useState([70]);
  const [atendimentoScore, setAtendimentoScore] = useState([85]);
  const [classificacao, setClassificacao] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const criterios = [
    {
      nome: "Qualidade",
      score: qualidadeScore,
      setScore: setQualidadeScore,
      descricao: "Qualidade dos produtos/serviços fornecidos"
    },
    {
      nome: "Prazo",
      score: prazoScore,
      setScore: setPrazoScore,
      descricao: "Cumprimento de prazos de entrega"
    },
    {
      nome: "Preço",
      score: precoScore,
      setScore: setPrecoScore,
      descricao: "Competitividade de preços"
    },
    {
      nome: "Atendimento",
      score: atendimentoScore,
      setScore: setAtendimentoScore,
      descricao: "Qualidade do atendimento e suporte"
    }
  ];

  const calcularMediaGeral = () => {
    const soma = qualidadeScore[0] + prazoScore[0] + precoScore[0] + atendimentoScore[0];
    return Math.round(soma / 4);
  };

  const obterClassificacaoAutomatica = (media: number) => {
    if (media >= 90) return "A - Excelente";
    if (media >= 80) return "B - Bom";
    if (media >= 70) return "C - Regular";
    if (media >= 60) return "D - Insatisfatório";
    return "E - Crítico";
  };

  const handleSalvarAvaliacao = () => {
    const media = calcularMediaGeral();
    const classificacaoFinal = classificacao || obterClassificacaoAutomatica(media);
    
    console.log("Avaliação salva:", {
      fornecedor: fornecedor.nome,
      qualidade: qualidadeScore[0],
      prazo: prazoScore[0],
      preco: precoScore[0],
      atendimento: atendimentoScore[0],
      media,
      classificacao: classificacaoFinal,
      observacoes
    });

    onAvaliacaoCompleta();
    if (onClose) onClose();
  };

  const mediaGeral = calcularMediaGeral();
  const classificacaoSugerida = obterClassificacaoAutomatica(mediaGeral);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Avaliar Fornecedor - {fornecedor.nome}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Critérios de Avaliação */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Critérios de Avaliação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {criterios.map((criterio) => (
                <div key={criterio.nome} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">{criterio.nome}</Label>
                      <p className="text-xs text-muted-foreground">{criterio.descricao}</p>
                    </div>
                    <Badge variant="outline" className="text-sm">
                      {criterio.score[0]}%
                    </Badge>
                  </div>
                  <Slider
                    value={criterio.score}
                    onValueChange={criterio.setScore}
                    min={0}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Resultado da Avaliação */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resultado da Avaliação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{mediaGeral}%</div>
                <div className="text-sm text-muted-foreground">Média Geral</div>
              </div>

              <div className="space-y-2">
                <Label>Classificação Final</Label>
                <Select value={classificacao} onValueChange={setClassificacao}>
                  <SelectTrigger>
                    <SelectValue placeholder={classificacaoSugerida} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A - Excelente">A - Excelente</SelectItem>
                    <SelectItem value="B - Bom">B - Bom</SelectItem>
                    <SelectItem value="C - Regular">C - Regular</SelectItem>
                    <SelectItem value="D - Insatisfatório">D - Insatisfatório</SelectItem>
                    <SelectItem value="E - Crítico">E - Crítico</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Sugerido: {classificacaoSugerida}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Observações */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Adicione observações sobre a avaliação do fornecedor..."
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Alertas */}
          {mediaGeral < 70 && (
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-orange-700">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Atenção</span>
              </div>
              <p className="text-sm text-orange-600 mt-1">
                A média geral está abaixo de 70%. Considere criar um plano de melhoria.
              </p>
            </div>
          )}

          {/* Ações */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSalvarAvaliacao} className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              Salvar Avaliação
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

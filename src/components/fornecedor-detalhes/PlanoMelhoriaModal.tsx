
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { TrendingUp, AlertTriangle, CheckCircle2, Target, Clock, User } from "lucide-react";
import { toast } from "sonner";

interface PlanoMelhoriaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fornecedorNome: string;
}

export const PlanoMelhoriaModal = ({ open, onOpenChange, fornecedorNome }: PlanoMelhoriaModalProps) => {
  const [observacoes, setObservacoes] = useState("");

  const pontosIdentificados = [
    {
      categoria: "Qualidade",
      prioridade: "alta",
      descricao: "Percentual de defeitos acima da média",
      acao: "Implementar controle de qualidade mais rigoroso",
      prazo: "30 dias",
      responsavel: "Depto. Qualidade"
    },
    {
      categoria: "Prazo",
      prioridade: "media",
      descricao: "Atrasos eventuais em entregas",
      acao: "Estabelecer buffer de segurança no cronograma",
      prazo: "15 dias",
      responsavel: "Logística"
    },
    {
      categoria: "Documentação",
      prioridade: "baixa",
      descricao: "Documentos técnicos incompletos",
      acao: "Padronizar templates de documentação",
      prazo: "45 dias",
      responsavel: "Engenharia"
    }
  ];

  const handleSalvarPlano = () => {
    toast.success("Plano de melhoria salvo com sucesso!");
    onOpenChange(false);
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case "alta": return "bg-red-100 text-red-700 border-red-200";
      case "media": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "baixa": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Plano de Melhoria - {fornecedorNome}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumo Executivo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumo Executivo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">3</div>
                  <div className="text-sm text-muted-foreground">Pontos de Melhoria</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">90 dias</div>
                  <div className="text-sm text-muted-foreground">Prazo Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">85%</div>
                  <div className="text-sm text-muted-foreground">Score Esperado</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pontos de Melhoria */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pontos Identificados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pontosIdentificados.map((ponto, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <span className="font-medium">{ponto.categoria}</span>
                        <Badge className={getPrioridadeColor(ponto.prioridade)}>
                          {ponto.prioridade}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="pl-6 space-y-2">
                      <p className="text-sm text-muted-foreground">{ponto.descricao}</p>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          <span className="font-medium">Ação:</span>
                          <span>{ponto.acao}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span className="font-medium">Prazo:</span>
                          <span>{ponto.prazo}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span className="font-medium">Responsável:</span>
                          <span>{ponto.responsavel}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Observações */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Observações Adicionais</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Adicione observações específicas sobre o plano de melhoria..."
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSalvarPlano} className="bg-blue-600 hover:bg-blue-700">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Salvar Plano
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

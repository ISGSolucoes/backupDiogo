
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { TrendingUp, AlertTriangle, CheckCircle2, Target, Clock, User } from "lucide-react";
import { toast } from "sonner";

interface PlanoMelhoriaPerformanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fornecedorNome: string;
}

export const PlanoMelhoriaPerformanceModal = ({ open, onOpenChange, fornecedorNome }: PlanoMelhoriaPerformanceModalProps) => {
  const [observacoes, setObservacoes] = useState("");

  const pontosIdentificados = [
    {
      categoria: "Entrega no Prazo",
      prioridade: "alta",
      score: 7.5,
      meta: 9.0,
      descricao: "2 atrasos > 3 dias no último trimestre",
      acao: "Implementar buffer de segurança no cronograma",
      prazo: "30 dias",
      responsavel: "Logística"
    },
    {
      categoria: "Custo",
      prioridade: "media",
      score: 6.5,
      meta: 8.0,
      descricao: "Aumento de 9% sobre período anterior",
      acao: "Renegociar contratos e buscar eficiências",
      prazo: "45 dias",
      responsavel: "Comercial"
    }
  ];

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case "alta": return "bg-red-100 text-red-700 border-red-200";
      case "media": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "baixa": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleSalvarPlano = () => {
    toast.success("Plano de melhoria de performance salvo com sucesso!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Plano de Melhoria de Performance - {fornecedorNome}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Análise de Oportunidades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">2</div>
                  <div className="text-sm text-muted-foreground">Critérios Abaixo da Meta</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">75 dias</div>
                  <div className="text-sm text-muted-foreground">Prazo Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">8.8</div>
                  <div className="text-sm text-muted-foreground">Score Projetado</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Oportunidades Identificadas</CardTitle>
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
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Atual: {ponto.score} | Meta: {ponto.meta}</div>
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

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Observações do Plano</CardTitle>
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

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSalvarPlano} className="bg-green-600 hover:bg-green-700">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Salvar Plano
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

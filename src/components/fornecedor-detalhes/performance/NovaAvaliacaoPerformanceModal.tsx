
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BarChart, User, Calendar, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface NovaAvaliacaoPerformanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fornecedorNome: string;
}

export const NovaAvaliacaoPerformanceModal = ({ open, onOpenChange, fornecedorNome }: NovaAvaliacaoPerformanceModalProps) => {
  const [avaliador, setAvaliador] = useState("");
  const [tipoAvaliacao, setTipoAvaliacao] = useState("trimestral");
  const [observacoes, setObservacoes] = useState("");

  const avaliadores = [
    { id: "carlos.souza", nome: "Carlos Souza", area: "Compras" },
    { id: "ana.lima", nome: "Ana Lima", area: "Qualidade" },
    { id: "pedro.santos", nome: "Pedro Santos", area: "Suprimentos" }
  ];

  const handleIniciarAvaliacao = () => {
    if (!avaliador) {
      toast.error("Selecione um avaliador");
      return;
    }

    toast.success("Nova avaliação de performance iniciada!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-blue-500" />
            Nova Avaliação de Performance - {fornecedorNome}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configurações da Avaliação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Avaliação</Label>
                  <Select value={tipoAvaliacao} onValueChange={setTipoAvaliacao}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trimestral">Trimestral</SelectItem>
                      <SelectItem value="semestral">Semestral</SelectItem>
                      <SelectItem value="anual">Anual</SelectItem>
                      <SelectItem value="pontual">Pontual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Avaliador Responsável</Label>
                  <Select value={avaliador} onValueChange={setAvaliador}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar avaliador" />
                    </SelectTrigger>
                    <SelectContent>
                      {avaliadores.map((av) => (
                        <SelectItem key={av.id} value={av.id}>
                          {av.nome} - {av.area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Critérios de Avaliação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Badge variant="outline" className="w-full justify-center">
                    Entrega no Prazo (30%)
                  </Badge>
                  <Badge variant="outline" className="w-full justify-center">
                    Qualidade (30%)
                  </Badge>
                  <Badge variant="outline" className="w-full justify-center">
                    Custo (10%)
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Badge variant="outline" className="w-full justify-center">
                    Relacionamento (20%)
                  </Badge>
                  <Badge variant="outline" className="w-full justify-center">
                    ESG / Compliance (10%)
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Observações Iniciais</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Adicione observações sobre o contexto desta avaliação..."
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleIniciarAvaliacao} className="bg-blue-600 hover:bg-blue-700">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Iniciar Avaliação
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

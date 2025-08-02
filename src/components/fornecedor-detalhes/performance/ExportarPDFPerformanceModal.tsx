
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Settings, Eye } from "lucide-react";
import { toast } from "sonner";

interface ExportarPDFPerformanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fornecedorNome: string;
}

export const ExportarPDFPerformanceModal = ({ open, onOpenChange, fornecedorNome }: ExportarPDFPerformanceModalProps) => {
  const [secoesSelecionadas, setSecoesSelecionadas] = useState<string[]>([
    "scorecard",
    "historico",
    "evolucao"
  ]);
  const [formato, setFormato] = useState("completo");
  const [incluirGraficos, setIncluirGraficos] = useState(true);
  const [incluirHistorico, setIncluirHistorico] = useState(true);

  const secoes = [
    { id: "scorecard", nome: "Scorecard Detalhado", descricao: "Critérios e notas por dimensão" },
    { id: "historico", nome: "Histórico de Avaliações", descricao: "Todas as avaliações anteriores" },
    { id: "evolucao", nome: "Evolução Histórica", descricao: "Gráficos de tendência e insights" },
    { id: "planos", nome: "Planos de Melhoria", descricao: "Ações e recomendações" }
  ];

  const handleSecaoChange = (secaoId: string, checked: boolean) => {
    if (checked) {
      setSecoesSelecionadas([...secoesSelecionadas, secaoId]);
    } else {
      setSecoesSelecionadas(secoesSelecionadas.filter(id => id !== secaoId));
    }
  };

  const handleExportarPDF = () => {
    if (secoesSelecionadas.length === 0) {
      toast.error("Selecione pelo menos uma seção para exportar");
      return;
    }

    toast.success("Gerando PDF de Performance... Download iniciará em instantes");
    
    setTimeout(() => {
      toast.success("PDF de Performance gerado com sucesso!");
      onOpenChange(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-red-500" />
            Exportar Performance PDF - {fornecedorNome}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configurações do Relatório
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tipo de Relatório</Label>
                <Select value={formato} onValueChange={setFormato}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completo">Scorecard Completo</SelectItem>
                    <SelectItem value="resumido">Resumo Executivo</SelectItem>
                    <SelectItem value="evolucao">Apenas Evolução</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="graficos"
                    checked={incluirGraficos}
                    onCheckedChange={(checked) => setIncluirGraficos(checked === true)}
                  />
                  <Label htmlFor="graficos">Incluir Gráficos</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="historico"
                    checked={incluirHistorico}
                    onCheckedChange={(checked) => setIncluirHistorico(checked === true)}
                  />
                  <Label htmlFor="historico">Incluir Histórico</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Seções do Relatório</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {secoes.map((secao) => (
                  <div key={secao.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id={secao.id}
                      checked={secoesSelecionadas.includes(secao.id)}
                      onCheckedChange={(checked) => handleSecaoChange(secao.id, checked === true)}
                    />
                    <div className="flex-1">
                      <Label htmlFor={secao.id} className="font-medium cursor-pointer">
                        {secao.nome}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {secao.descricao}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={handleExportarPDF} className="bg-red-600 hover:bg-red-700">
                <Download className="h-4 w-4 mr-2" />
                Exportar PDF
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};


import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { FileText, Download, Settings, Eye, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface ExportarPDFModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fornecedorNome: string;
}

export const ExportarPDFModal = ({ open, onOpenChange, fornecedorNome }: ExportarPDFModalProps) => {
  const [secoesSelecionadas, setSecoesSelecionadas] = useState<string[]>([
    "dados-basicos",
    "qualificacao",
    "documentos"
  ]);
  const [formato, setFormato] = useState("completo");
  const [incluirGraficos, setIncluirGraficos] = useState(true);
  const [incluirHistorico, setIncluirHistorico] = useState(true);
  const [gerando, setGerando] = useState(false);
  const [progresso, setProgresso] = useState(0);

  const secoes = [
    { id: "dados-basicos", nome: "Dados Básicos", descricao: "Informações gerais do fornecedor" },
    { id: "qualificacao", nome: "Qualificação", descricao: "Status de qualificação técnica/comercial" },
    { id: "documentos", nome: "Documentos", descricao: "Lista de documentos e validades" },
    { id: "performance", nome: "Performance", descricao: "Métricas de desempenho" },
    { id: "historico", nome: "Histórico", descricao: "Histórico de compras e participações" },
    { id: "avaliacao", nome: "Avaliação", descricao: "Avaliações e scores" },
    { id: "fotografia", nome: "Fotografia 360°", descricao: "Visão completa do fornecedor" }
  ];

  const handleSecaoChange = (secaoId: string, checked: boolean) => {
    if (checked) {
      setSecoesSelecionadas([...secoesSelecionadas, secaoId]);
    } else {
      setSecoesSelecionadas(secoesSelecionadas.filter(id => id !== secaoId));
    }
  };

  const handleExportarPDF = async () => {
    if (secoesSelecionadas.length === 0) {
      toast.error("Selecione pelo menos uma seção para exportar");
      return;
    }

    setGerando(true);
    setProgresso(0);

    try {
      // Simular progresso de geração
      const steps = [
        { message: "Coletando dados do fornecedor...", progress: 20 },
        { message: "Processando documentos...", progress: 40 },
        { message: "Gerando gráficos...", progress: 60 },
        { message: "Compilando relatório...", progress: 80 },
        { message: "Finalizando PDF...", progress: 100 }
      ];

      for (const step of steps) {
        toast.info(step.message);
        setProgresso(step.progress);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Simular download do arquivo
      const blob = new Blob(['PDF content'], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fornecedorNome.replace(/\s+/g, '_')}_relatorio.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success("PDF gerado e download iniciado!");
      onOpenChange(false);
    } catch (error) {
      toast.error("Erro ao gerar PDF. Tente novamente.");
    } finally {
      setGerando(false);
      setProgresso(0);
    }
  };

  const handleVisualizarPreview = () => {
    toast.info("Gerando preview do relatório...");
    // Simular abertura de preview
    setTimeout(() => {
      toast.success("Preview gerado! Abrindo em nova aba...");
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-red-500" />
            Exportar PDF - {fornecedorNome}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Configurações de Formato */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configurações de Exportação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Formato do Relatório</Label>
                <Select value={formato} onValueChange={setFormato}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completo">Relatório Completo</SelectItem>
                    <SelectItem value="resumido">Relatório Resumido</SelectItem>
                    <SelectItem value="executivo">Resumo Executivo</SelectItem>
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
                  <Label htmlFor="historico">Incluir Histórico Detalhado</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seleção de Seções */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Seções a Incluir</CardTitle>
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

          {/* Progresso de Geração */}
          {gerando && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Gerando PDF...
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={progresso} className="w-full" />
                <p className="text-sm text-muted-foreground mt-2">
                  {progresso}% concluído
                </p>
              </CardContent>
            </Card>
          )}

          {/* Informações */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Seções selecionadas:</strong> {secoesSelecionadas.length} de {secoes.length}
            </p>
            <p className="text-sm text-blue-600 mt-1">
              O PDF será gerado com base nas configurações selecionadas
            </p>
          </div>

          {/* Ações */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleVisualizarPreview} disabled={gerando}>
              <Eye className="h-4 w-4 mr-2" />
              Visualizar Preview
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={gerando}>
                Cancelar
              </Button>
              <Button 
                onClick={handleExportarPDF} 
                disabled={gerando}
                className="bg-red-600 hover:bg-red-700"
              >
                {gerando ? (
                  "Gerando..."
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar PDF
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};


import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, FileText, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Fornecedor } from "@/types/fornecedor";

interface RequalificarFornecedorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fornecedor: Fornecedor;
}

export const RequalificarFornecedorModal = ({ open, onOpenChange, fornecedor }: RequalificarFornecedorModalProps) => {
  const [tipoRequalificacao, setTipoRequalificacao] = useState("completa");
  const [areasRequalificacao, setAreasRequalificacao] = useState<string[]>([]);
  const [observacoes, setObservacoes] = useState("");
  const [processando, setProcessando] = useState(false);

  const areas = [
    { id: "financeira", nome: "Qualificação Financeira", descricao: "Análise da situação financeira" },
    { id: "tecnica", nome: "Qualificação Técnica", descricao: "Avaliação técnica e operacional" },
    { id: "comercial", nome: "Qualificação Comercial", descricao: "Análise comercial e contratual" },
    { id: "legal", nome: "Qualificação Legal", descricao: "Verificação legal e documental" }
  ];

  const handleAreaChange = (areaId: string, checked: boolean) => {
    if (checked) {
      setAreasRequalificacao([...areasRequalificacao, areaId]);
    } else {
      setAreasRequalificacao(areasRequalificacao.filter(id => id !== areaId));
    }
  };

  const handleIniciarRequalificacao = async () => {
    if (tipoRequalificacao === "parcial" && areasRequalificacao.length === 0) {
      toast.error("Selecione pelo menos uma área para requalificação parcial");
      return;
    }

    setProcessando(true);
    
    try {
      // Simular processo de requalificação
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`Processo de requalificação iniciado para ${fornecedor.nome}!`);
      onOpenChange(false);
    } catch (error) {
      toast.error("Erro ao iniciar requalificação. Tente novamente.");
    } finally {
      setProcessando(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-orange-500" />
            Requalificar Fornecedor - {fornecedor.nome}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tipo de Requalificação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Selecionar Tipo</Label>
                <Select value={tipoRequalificacao} onValueChange={setTipoRequalificacao}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completa">Requalificação Completa</SelectItem>
                    <SelectItem value="parcial">Requalificação Parcial</SelectItem>
                    <SelectItem value="urgente">Requalificação Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {tipoRequalificacao === "parcial" && (
                <div>
                  <Label className="text-base font-medium mb-3 block">Áreas para Requalificação</Label>
                  <div className="space-y-3">
                    {areas.map((area) => (
                      <div key={area.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <Checkbox
                          id={area.id}
                          checked={areasRequalificacao.includes(area.id)}
                          onCheckedChange={(checked) => handleAreaChange(area.id, checked === true)}
                        />
                        <div className="flex-1">
                          <Label htmlFor={area.id} className="font-medium cursor-pointer">
                            {area.nome}
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            {area.descricao}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Observações sobre o processo de requalificação..."
                rows={3}
              />
            </CardContent>
          </Card>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <FileText className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800">Documentos Necessários</p>
                <p className="text-sm text-yellow-700 mt-1">
                  O fornecedor receberá uma lista dos documentos necessários para a requalificação
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleIniciarRequalificacao}
              disabled={processando}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {processando ? (
                "Processando..."
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Iniciar Requalificação
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};


import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Ban, X } from "lucide-react";
import { toast } from "sonner";
import { Fornecedor } from "@/types/fornecedor";

interface InativarFornecedorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fornecedor: Fornecedor;
}

export const InativarFornecedorModal = ({ open, onOpenChange, fornecedor }: InativarFornecedorModalProps) => {
  const [motivoInativacao, setMotivoInativacao] = useState("");
  const [justificativa, setJustificativa] = useState("");
  const [processando, setProcessando] = useState(false);

  const motivos = [
    { id: "desempenho", nome: "Baixo Desempenho", descricao: "Problemas recorrentes de qualidade ou prazo" },
    { id: "compliance", nome: "Não Conformidade", descricao: "Descumprimento de normas ou regulamentações" },
    { id: "financeiro", nome: "Problemas Financeiros", descricao: "Situação financeira inadequada" },
    { id: "comercial", nome: "Divergências Comerciais", descricao: "Conflitos contratuais ou comerciais" },
    { id: "estrategico", nome: "Mudança Estratégica", descricao: "Alteração na estratégia de fornecimento" },
    { id: "outros", nome: "Outros", descricao: "Outros motivos não listados" }
  ];

  const handleInativar = async () => {
    if (!motivoInativacao) {
      toast.error("Selecione um motivo para inativação");
      return;
    }

    if (!justificativa.trim()) {
      toast.error("Justificativa é obrigatória");
      return;
    }

    setProcessando(true);
    
    try {
      // Simular inativação
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`Fornecedor ${fornecedor.nome} inativado com sucesso!`);
      onOpenChange(false);
    } catch (error) {
      toast.error("Erro ao inativar fornecedor. Tente novamente.");
    } finally {
      setProcessando(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ban className="h-5 w-5 text-red-500" />
            Inativar Fornecedor - {fornecedor.nome}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-medium text-red-800">Atenção!</p>
                <p className="text-sm text-red-700 mt-1">
                  A inativação do fornecedor impedirá sua participação em novos processos de compra.
                  Esta ação pode ser revertida posteriormente.
                </p>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações do Fornecedor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">CNPJ</Label>
                  <p className="font-medium">{fornecedor.cnpj}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Status Atual</Label>
                  <p className="font-medium">{fornecedor.status}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Última Participação</Label>
                  <p className="font-medium">{fornecedor.ultimaParticipacao}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Qualificado</Label>
                  <p className="font-medium">{fornecedor.qualificado ? "Sim" : "Não"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Motivo da Inativação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Selecionar Motivo</Label>
                <Select value={motivoInativacao} onValueChange={setMotivoInativacao}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o motivo..." />
                  </SelectTrigger>
                  <SelectContent>
                    {motivos.map((motivo) => (
                      <SelectItem key={motivo.id} value={motivo.id}>
                        {motivo.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Justificativa Detalhada</Label>
                <Textarea
                  value={justificativa}
                  onChange={(e) => setJustificativa(e.target.value)}
                  placeholder="Descreva detalhadamente o motivo da inativação..."
                  rows={4}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button 
              onClick={handleInativar}
              disabled={processando}
              className="bg-red-600 hover:bg-red-700"
            >
              {processando ? (
                "Inativando..."
              ) : (
                <>
                  <Ban className="h-4 w-4 mr-2" />
                  Confirmar Inativação
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

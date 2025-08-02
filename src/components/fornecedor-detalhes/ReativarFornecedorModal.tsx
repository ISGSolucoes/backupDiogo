
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Fornecedor } from "@/types/fornecedor";

interface ReativarFornecedorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fornecedor: Fornecedor;
}

export const ReativarFornecedorModal = ({ open, onOpenChange, fornecedor }: ReativarFornecedorModalProps) => {
  const [verificacoes, setVerificacoes] = useState<string[]>([]);
  const [observacoes, setObservacoes] = useState("");
  const [processando, setProcessando] = useState(false);

  const itensVerificacao = [
    { id: "documentos", nome: "Documentação atualizada", descricao: "Certificados e licenças válidos" },
    { id: "financeiro", nome: "Situação financeira", descricao: "Análise da situação financeira atual" },
    { id: "compliance", nome: "Conformidade", descricao: "Verificação de conformidade com normas" },
    { id: "desempenho", nome: "Avaliação de desempenho", descricao: "Revisão do histórico de desempenho" }
  ];

  const handleVerificacaoChange = (itemId: string, checked: boolean) => {
    if (checked) {
      setVerificacoes([...verificacoes, itemId]);
    } else {
      setVerificacoes(verificacoes.filter(id => id !== itemId));
    }
  };

  const handleReativar = async () => {
    if (verificacoes.length !== itensVerificacao.length) {
      toast.error("Todos os itens de verificação devem ser confirmados");
      return;
    }

    setProcessando(true);
    
    try {
      // Simular reativação
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`Fornecedor ${fornecedor.nome} reativado com sucesso!`);
      onOpenChange(false);
    } catch (error) {
      toast.error("Erro ao reativar fornecedor. Tente novamente.");
    } finally {
      setProcessando(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Reativar Fornecedor - {fornecedor.nome}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-800">Reativação de Fornecedor</p>
                <p className="text-sm text-green-700 mt-1">
                  Confirme os itens de verificação abaixo antes de reativar o fornecedor.
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
                  <p className="font-medium text-red-600">{fornecedor.status}</p>
                </div>
                {fornecedor.dataInativacao && (
                  <div>
                    <Label className="text-sm text-muted-foreground">Data de Inativação</Label>
                    <p className="font-medium">{fornecedor.dataInativacao}</p>
                  </div>
                )}
                {fornecedor.motivoInativacao && (
                  <div>
                    <Label className="text-sm text-muted-foreground">Motivo da Inativação</Label>
                    <p className="font-medium">{fornecedor.motivoInativacao}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Verificações Obrigatórias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {itensVerificacao.map((item) => (
                  <div key={item.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id={item.id}
                      checked={verificacoes.includes(item.id)}
                      onCheckedChange={(checked) => handleVerificacaoChange(item.id, checked === true)}
                    />
                    <div className="flex-1">
                      <Label htmlFor={item.id} className="font-medium cursor-pointer">
                        {item.nome}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.descricao}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
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
                placeholder="Observações sobre a reativação..."
                rows={3}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleReativar}
              disabled={processando || verificacoes.length !== itensVerificacao.length}
              className="bg-green-600 hover:bg-green-700"
            >
              {processando ? (
                "Reativando..."
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Confirmar Reativação
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};


import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle, FileText, Calendar } from "lucide-react";
import { toast } from "sonner";
import { Fornecedor } from "@/types/fornecedor";

interface AtivarFornecedorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fornecedor: Fornecedor;
}

export const AtivarFornecedorModal = ({ open, onOpenChange, fornecedor }: AtivarFornecedorModalProps) => {
  const [justificativa, setJustificativa] = useState("");
  const [novoStatus, setNovoStatus] = useState<string>("registrado");
  const [documentosValidados, setDocumentosValidados] = useState(false);
  const [complianceVerificado, setComplianceVerificado] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Verificar pré-requisitos para ativação
  const preRequisitos = [
    {
      id: "documentos",
      titulo: "Documentos Obrigatórios",
      status: documentosValidados ? "ok" : "pendente",
      descricao: "CNPJ, Inscrição Estadual, Contrato Social"
    },
    {
      id: "compliance",
      titulo: "Verificação de Compliance",
      status: complianceVerificado ? "ok" : "pendente",
      descricao: "CPF/CNPJ validado, sem restrições"
    },
    {
      id: "cadastro",
      titulo: "Cadastro Completo",
      status: "ok",
      descricao: "Informações básicas preenchidas"
    }
  ];

  const podeAtivar = documentosValidados && complianceVerificado && justificativa.length > 10;

  const handleAtivar = async () => {
    if (!podeAtivar) {
      toast.error("Preencha todos os pré-requisitos para ativar o fornecedor");
      return;
    }

    setIsLoading(true);
    
    try {
      // Simular chamada à API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Em produção, aqui seria feita a chamada real para ativar o fornecedor
      console.log("Ativando fornecedor:", {
        fornecedorId: fornecedor.id,
        novoStatus,
        justificativa,
        documentosValidados,
        complianceVerificado
      });
      
      toast.success(`Fornecedor ${fornecedor.nome} ativado com sucesso!`);
      onOpenChange(false);
      
      // Reset do formulário
      setJustificativa("");
      setNovoStatus("registrado");
      setDocumentosValidados(false);
      setComplianceVerificado(false);
      
    } catch (error) {
      console.error("Erro ao ativar fornecedor:", error);
      toast.error("Erro ao ativar fornecedor. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Ativar Fornecedor
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do Fornecedor */}
          <div className="bg-slate-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Fornecedor a ser ativado:</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Nome:</span> {fornecedor.nome}
              </div>
              <div>
                <span className="font-medium">CNPJ:</span> {fornecedor.cnpj}
              </div>
              <div>
                <span className="font-medium">Status Atual:</span> {fornecedor.status}
              </div>
              <div>
                <span className="font-medium">Cidade:</span> {fornecedor.cidade} - {fornecedor.uf}
              </div>
            </div>
          </div>

          {/* Pré-requisitos */}
          <div>
            <h3 className="font-semibold mb-3">Pré-requisitos para Ativação:</h3>
            <div className="space-y-3">
              {preRequisitos.map((req) => (
                <div key={req.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  {req.status === "ok" ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="font-medium">{req.titulo}</div>
                    <div className="text-sm text-slate-600">{req.descricao}</div>
                  </div>
                  {req.id === "documentos" && (
                    <Checkbox
                      checked={documentosValidados}
                      onCheckedChange={(checked) => setDocumentosValidados(checked as boolean)}
                    />
                  )}
                  {req.id === "compliance" && (
                    <Checkbox
                      checked={complianceVerificado}
                      onCheckedChange={(checked) => setComplianceVerificado(checked as boolean)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Status de Ativação */}
          <div>
            <Label htmlFor="novoStatus">Status após ativação:</Label>
            <Select value={novoStatus} onValueChange={setNovoStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="registrado">Registrado</SelectItem>
                <SelectItem value="em_qualificacao">Em Qualificação</SelectItem>
                <SelectItem value="qualificado">Qualificado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Justificativa */}
          <div>
            <Label htmlFor="justificativa">Justificativa para ativação: *</Label>
            <Textarea
              id="justificativa"
              placeholder="Descreva o motivo da ativação e as verificações realizadas..."
              value={justificativa}
              onChange={(e) => setJustificativa(e.target.value)}
              className="mt-2"
              rows={4}
            />
            <div className="text-sm text-slate-500 mt-1">
              {justificativa.length}/500 caracteres
            </div>
          </div>

          {/* Alerta de Validação */}
          {!podeAtivar && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Para ativar o fornecedor, é necessário:
                <ul className="list-disc ml-4 mt-1">
                  {!documentosValidados && <li>Validar documentos obrigatórios</li>}
                  {!complianceVerificado && <li>Verificar compliance</li>}
                  {justificativa.length <= 10 && <li>Preencher justificativa (mínimo 10 caracteres)</li>}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleAtivar} 
            disabled={!podeAtivar || isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? "Ativando..." : "Ativar Fornecedor"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

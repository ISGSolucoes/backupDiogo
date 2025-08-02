
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Send, Eye } from "lucide-react";
import { toast } from "sonner";
import { Fornecedor } from "@/types/fornecedor";

interface ConvidarFornecedorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fornecedor: Fornecedor;
}

export const ConvidarFornecedorModal = ({ open, onOpenChange, fornecedor }: ConvidarFornecedorModalProps) => {
  const [templateSelecionado, setTemplateSelecionado] = useState("padrao");
  const [mensagemPersonalizada, setMensagemPersonalizada] = useState("");
  const [enviando, setEnviando] = useState(false);

  const templates = [
    { id: "padrao", nome: "Convite Padrão", descricao: "Template padrão para convite de fornecedores" },
    { id: "atualizacao", nome: "Atualização Cadastral", descricao: "Convite para atualização de dados" },
    { id: "requalificacao", nome: "Requalificação", descricao: "Convite para processo de requalificação" },
    { id: "personalizado", nome: "Mensagem Personalizada", descricao: "Criar mensagem customizada" }
  ];

  const handleEnviarConvite = async () => {
    setEnviando(true);
    
    try {
      // Simular envio de convite
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`Convite enviado com sucesso para ${fornecedor.nome}!`);
      onOpenChange(false);
    } catch (error) {
      toast.error("Erro ao enviar convite. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  };

  const handlePreview = () => {
    toast.info("Abrindo preview do convite...");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-blue-500" />
            Convidar Fornecedor - {fornecedor.nome}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações do Convite</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">CNPJ</Label>
                  <p className="font-medium">{fornecedor.cnpj}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Status Atual</Label>
                  <p className="font-medium">{fornecedor.status}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Template do Convite</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Selecionar Template</Label>
                <Select value={templateSelecionado} onValueChange={setTemplateSelecionado}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {templateSelecionado === "personalizado" && (
                <div>
                  <Label>Mensagem Personalizada</Label>
                  <Textarea
                    value={mensagemPersonalizada}
                    onChange={(e) => setMensagemPersonalizada(e.target.value)}
                    placeholder="Digite sua mensagem personalizada..."
                    rows={4}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={handlePreview}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleEnviarConvite}
                disabled={enviando}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {enviando ? (
                  "Enviando..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Convite
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


import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { RefreshCw, Save } from "lucide-react";
import { toast } from "sonner";
import { Fornecedor } from "@/types/fornecedor";

interface AtualizarFornecedorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fornecedor: Fornecedor;
}

export const AtualizarFornecedorModal = ({ open, onOpenChange, fornecedor }: AtualizarFornecedorModalProps) => {
  const [camposAtualizacao, setCamposAtualizacao] = useState<string[]>([]);
  const [dadosAtualizados, setDadosAtualizados] = useState({
    nome: fornecedor.nome,
    email: fornecedor.email || "",
    telefone: fornecedor.telefone || "",
    endereco: fornecedor.endereco || "",
  });
  const [observacoes, setObservacoes] = useState("");
  const [salvando, setSalvando] = useState(false);

  const camposDisponiveis = [
    { id: "dados-basicos", nome: "Dados Básicos", descricao: "Nome, razão social, CNPJ" },
    { id: "contato", nome: "Informações de Contato", descricao: "E-mail, telefone, endereço" },
    { id: "financeiro", nome: "Dados Financeiros", descricao: "Faturamento, situação fiscal" },
    { id: "documentos", nome: "Documentação", descricao: "Certificados, licenças, certidões" },
    { id: "categorias", nome: "Categorias", descricao: "Categorias de fornecimento" }
  ];

  const handleCampoChange = (campoId: string, checked: boolean) => {
    if (checked) {
      setCamposAtualizacao([...camposAtualizacao, campoId]);
    } else {
      setCamposAtualizacao(camposAtualizacao.filter(id => id !== campoId));
    }
  };

  const handleSalvarAtualizacao = async () => {
    if (camposAtualizacao.length === 0) {
      toast.error("Selecione pelo menos um campo para atualizar");
      return;
    }

    setSalvando(true);
    
    try {
      // Simular atualização
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`Dados atualizados com sucesso para ${fornecedor.nome}!`);
      onOpenChange(false);
    } catch (error) {
      toast.error("Erro ao atualizar dados. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  };

  const handleSincronizarDados = () => {
    toast.info("Sincronizando dados com fontes externas...");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-purple-500" />
            Atualizar Fornecedor - {fornecedor.nome}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Campos para Atualização</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {camposDisponiveis.map((campo) => (
                  <div key={campo.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id={campo.id}
                      checked={camposAtualizacao.includes(campo.id)}
                      onCheckedChange={(checked) => handleCampoChange(campo.id, checked === true)}
                    />
                    <div className="flex-1">
                      <Label htmlFor={campo.id} className="font-medium cursor-pointer">
                        {campo.nome}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {campo.descricao}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {camposAtualizacao.includes("dados-basicos") && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dados Básicos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Nome/Razão Social</Label>
                  <Input
                    value={dadosAtualizados.nome}
                    onChange={(e) => setDadosAtualizados({...dadosAtualizados, nome: e.target.value})}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {camposAtualizacao.includes("contato") && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações de Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>E-mail</Label>
                    <Input
                      value={dadosAtualizados.email}
                      onChange={(e) => setDadosAtualizados({...dadosAtualizados, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Telefone</Label>
                    <Input
                      value={dadosAtualizados.telefone}
                      onChange={(e) => setDadosAtualizados({...dadosAtualizados, telefone: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label>Endereço</Label>
                  <Input
                    value={dadosAtualizados.endereco}
                    onChange={(e) => setDadosAtualizados({...dadosAtualizados, endereco: e.target.value})}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Observações sobre a atualização..."
                rows={3}
              />
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={handleSincronizarDados}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Sincronizar Dados
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleSalvarAtualizacao}
                disabled={salvando}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {salvando ? (
                  "Salvando..."
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Alterações
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

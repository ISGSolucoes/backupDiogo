
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users,
  Mail,
  MessageSquare,
  CheckSquare,
  Star,
  Send,
  X,
  Archive
} from 'lucide-react';
import { toast } from "sonner";
import { SelecionarTemplateModal } from './SelecionarTemplateModal';
import type { TemplateAcaoLote } from '@/types/acoes-lote';

interface FornecedorSelecionado {
  id: string;
  nome: string;
  cnpj: string;
  email: string;
  categoria?: string;
}

interface AcoesLoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fornecedoresSelecionados: FornecedorSelecionado[];
  onExecutarAcao?: (acao: any, fornecedores: any[]) => Promise<void>;
}

export const AcoesLoteModal: React.FC<AcoesLoteModalProps> = ({
  open,
  onOpenChange,
  fornecedoresSelecionados,
  onExecutarAcao
}) => {
  const [templateSelecionado, setTemplateSelecionado] = useState<TemplateAcaoLote | null>(null);
  const [modalTemplateOpen, setModalTemplateOpen] = useState(false);
  const [etapaAtual, setEtapaAtual] = useState<'selecionar' | 'configurar' | 'enviar'>('selecionar');

  const handleSelecionarTemplate = (template: TemplateAcaoLote) => {
    setTemplateSelecionado(template);
    setModalTemplateOpen(false);
    setEtapaAtual('configurar');
  };

  const handleVoltarSelecao = () => {
    setTemplateSelecionado(null);
    setEtapaAtual('selecionar');
  };

  const handleEnviarAcao = () => {
    if (!templateSelecionado) {
      toast.error('Selecione um template');
      return;
    }

    // Simular envio
    toast.success(`Ação enviada para ${fornecedoresSelecionados.length} fornecedores`);
    onOpenChange(false);
    
    // Reset
    setTemplateSelecionado(null);
    setEtapaAtual('selecionar');
  };

  const obterIconeTipoAcao = (tipoAcao: string) => {
    switch (tipoAcao) {
      case 'comunicado':
        return <MessageSquare className="h-4 w-4" />;
      case 'pesquisa_cliente':
        return <Users className="h-4 w-4" />;
      case 'convite':
        return <Mail className="h-4 w-4" />;
      case 'avaliacao_interna':
        return <CheckSquare className="h-4 w-4" />;
      case 'requalificacao':
        return <Star className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Ações em Lote - {fornecedoresSelecionados.length} fornecedores
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {etapaAtual === 'selecionar' && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Selecione um Template</h3>
                  <p className="text-muted-foreground">
                    Escolha um template para aplicar aos fornecedores selecionados
                  </p>
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={() => setModalTemplateOpen(true)}
                    size="lg"
                    className="flex items-center gap-2"
                  >
                    <Archive className="h-5 w-5" />
                    Selecionar Template
                  </Button>
                </div>

                {/* Lista de Fornecedores Selecionados */}
                <div className="border rounded-lg p-4 bg-muted/50">
                  <h4 className="font-medium mb-3">Fornecedores Selecionados:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {fornecedoresSelecionados.slice(0, 6).map((fornecedor) => (
                      <div key={fornecedor.id} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span className="font-medium">{fornecedor.nome}</span>
                        <span className="text-muted-foreground">({fornecedor.cnpj})</span>
                      </div>
                    ))}
                    {fornecedoresSelecionados.length > 6 && (
                      <div className="text-sm text-muted-foreground">
                        +{fornecedoresSelecionados.length - 6} outros...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {etapaAtual === 'configurar' && templateSelecionado && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Configurar Envio</h3>
                    <p className="text-muted-foreground">
                      Revise os dados antes de enviar
                    </p>
                  </div>
                  <Button variant="outline" onClick={handleVoltarSelecao}>
                    <X className="h-4 w-4 mr-2" />
                    Alterar Template
                  </Button>
                </div>

                {/* Resumo do Template */}
                <div className="border rounded-lg p-4 bg-muted/50">
                  <div className="flex items-center gap-2 mb-3">
                    {obterIconeTipoAcao(templateSelecionado.tipo_acao)}
                    <h4 className="font-medium">{templateSelecionado.nome}</h4>
                    <Badge variant="outline">{templateSelecionado.finalidade}</Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <p><strong>Tipo:</strong> {templateSelecionado.tipo_acao.replace('_', ' ')}</p>
                    <p><strong>Categoria:</strong> {templateSelecionado.categoria || 'Não especificado'}</p>
                    <p><strong>Validade:</strong> {templateSelecionado.validade_dias} dias</p>
                    {templateSelecionado.permite_anonimato && (
                      <p><strong>Permite respostas anônimas:</strong> Sim</p>
                    )}
                  </div>

                  {templateSelecionado.conteudo_texto && (
                    <div className="mt-4 p-3 bg-background rounded border">
                      <p className="text-sm font-medium mb-2">Preview do Conteúdo:</p>
                      <div className="text-sm text-muted-foreground max-h-32 overflow-y-auto">
                        {templateSelecionado.conteudo_texto.substring(0, 300)}
                        {templateSelecionado.conteudo_texto.length > 300 && '...'}
                      </div>
                    </div>
                  )}
                </div>

                {/* Resumo dos Fornecedores */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">
                    Será enviado para {fornecedoresSelecionados.length} fornecedores:
                  </h4>
                  <div className="max-h-48 overflow-y-auto">
                    {fornecedoresSelecionados.map((fornecedor) => (
                      <div key={fornecedor.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                        <div>
                          <p className="font-medium">{fornecedor.nome}</p>
                          <p className="text-sm text-muted-foreground">{fornecedor.cnpj}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">{fornecedor.email}</p>
                          {fornecedor.categoria && (
                            <Badge variant="secondary" className="text-xs">
                              {fornecedor.categoria}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleVoltarSelecao}>
                    Voltar
                  </Button>
                  <Button onClick={handleEnviarAcao} size="lg">
                    <Send className="h-4 w-4 mr-2" />
                    Enviar para {fornecedoresSelecionados.length} Fornecedores
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Seleção de Template */}
      <SelecionarTemplateModal
        open={modalTemplateOpen}
        onOpenChange={setModalTemplateOpen}
        onSelecionarTemplate={handleSelecionarTemplate}
      />
    </>
  );
};

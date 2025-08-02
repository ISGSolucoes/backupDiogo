import React, { useState } from 'react';
import { ExpandedDialog } from "@/components/ui/expanded-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Archive,
  Search,
  Loader2
} from 'lucide-react';
import { toast } from "sonner";
import { useTemplatesAcaoLote } from '@/hooks/useTemplatesAcaoLote';
import { useBibliotecaIntegracao } from '@/hooks/useBibliotecaIntegracao';
import { useFullscreenModal } from '@/hooks/useFullscreenModal';
import type { TemplateAcaoLote } from '@/types/acoes-lote';
import { FINALIDADES_BIBLIOTECA } from '@/constants/biblioteca-constantes';
import { FormularioNovoTemplate } from './FormularioNovoTemplate';
import { TabelaTemplates } from './TabelaTemplates';
import { AbaBiblioteca } from './AbaBiblioteca';

interface RepositorioTemplatesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelecionarTemplate?: (template: TemplateAcaoLote) => void;
}

export const RepositorioTemplatesModal: React.FC<RepositorioTemplatesModalProps> = ({
  open,
  onOpenChange,
  onSelecionarTemplate
}) => {
  const { 
    templates, 
    loading, 
    criarTemplate, 
    duplicarTemplate, 
    inativarTemplate 
  } = useTemplatesAcaoLote();
  
  const {
    documentosAprovados,
    loading: loadingBiblioteca,
    buscarDocumentosAprovados,
    criarTemplateDeDocumento
  } = useBibliotecaIntegracao();
  
  const { isFullscreen, toggleFullscreen } = useFullscreenModal(false);
  
  const [filtroFinalidade, setFiltroFinalidade] = useState<string>('todas');
  const [buscaTexto, setBuscaTexto] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [novoTemplate, setNovoTemplate] = useState<Partial<TemplateAcaoLote>>({
    nome: '',
    finalidade: '',
    tipo_acao: 'comunicado',
    categoria: '',
    conteudo_texto: '',
    permite_anonimato: false,
    validade_dias: 30,
    campos_formulario: [],
    configuracoes: {}
  });

  const templatesFiltrados = templates.filter(template => {
    const matchFinalidade = filtroFinalidade === 'todas' || 
      template.finalidade === filtroFinalidade ||
      (!template.finalidade && filtroFinalidade === template.tipo_acao);
    
    const matchTexto = !buscaTexto || 
      template.nome.toLowerCase().includes(buscaTexto.toLowerCase()) ||
      template.categoria?.toLowerCase().includes(buscaTexto.toLowerCase()) ||
      template.finalidade?.toLowerCase().includes(buscaTexto.toLowerCase());
    
    return matchFinalidade && matchTexto;
  });

  const handleCriarTemplate = async () => {
    if (!novoTemplate.nome || !novoTemplate.finalidade) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    try {
      await criarTemplate({
        nome: novoTemplate.nome || '',
        finalidade: novoTemplate.finalidade || 'Comunicado',
        tipo_acao: novoTemplate.tipo_acao || 'comunicado',
        categoria: novoTemplate.categoria,
        conteudo_texto: novoTemplate.conteudo_texto,
        campos_formulario: novoTemplate.campos_formulario || [],
        configuracoes: novoTemplate.configuracoes || {},
        permite_anonimato: novoTemplate.permite_anonimato || false,
        validade_dias: novoTemplate.validade_dias || 30,
        is_ativo: true
      });

      setNovoTemplate({
        nome: '',
        finalidade: '',
        tipo_acao: 'comunicado',
        categoria: '',
        conteudo_texto: '',
        permite_anonimato: false,
        validade_dias: 30,
        campos_formulario: [],
        configuracoes: {}
      });
      setMostrarFormulario(false);
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  const handleCriarTemplateDaBiblioteca = async (documento: any) => {
    const nomeTemplate = `Template: ${documento.nome}`;
    
    try {
      const dadosTemplate = await criarTemplateDeDocumento(documento, nomeTemplate);
      await criarTemplate(dadosTemplate);
      toast.success('Template criado com base no documento da biblioteca!');
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  const handleDuplicarTemplate = async (template: TemplateAcaoLote) => {
    try {
      await duplicarTemplate(template);
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  const handleInativarTemplate = async (templateId: string) => {
    try {
      await inativarTemplate(templateId);
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  return (
    <ExpandedDialog 
      open={open} 
      onOpenChange={onOpenChange}
      title="Repositório de Templates"
      fullscreen={isFullscreen}
      onToggleFullscreen={toggleFullscreen}
      className="overflow-y-auto"
    >
      <Tabs defaultValue="listar" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="listar">Templates Salvos</TabsTrigger>
          <TabsTrigger value="biblioteca">Da Biblioteca</TabsTrigger>
          <TabsTrigger value="criar">Criar Novo</TabsTrigger>
        </TabsList>

        <TabsContent value="listar" className="space-y-4">
          {/* Filtros para templates salvos */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar templates..."
                  value={buscaTexto}
                  onChange={(e) => setBuscaTexto(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filtroFinalidade} onValueChange={setFiltroFinalidade}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Finalidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as finalidades</SelectItem>
                {FINALIDADES_BIBLIOTECA.map((finalidade) => (
                  <SelectItem key={finalidade} value={finalidade}>
                    {finalidade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Carregando templates...</span>
            </div>
          )}

          {!loading && (
            <TabelaTemplates
              templates={templatesFiltrados}
              onSelecionarTemplate={onSelecionarTemplate}
              onDuplicarTemplate={handleDuplicarTemplate}
              onInativarTemplate={handleInativarTemplate}
            />
          )}

          {!loading && templatesFiltrados.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Archive className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum template encontrado</p>
              {templates.length === 0 && (
                <p className="text-sm mt-2">
                  Comece criando seu primeiro template na aba "Criar Novo"
                </p>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="biblioteca" className="space-y-4">
          <AbaBiblioteca
            documentos={documentosAprovados}
            loading={loadingBiblioteca}
            onAtualizarDocumentos={() => buscarDocumentosAprovados()}
            onCriarTemplateDaBiblioteca={handleCriarTemplateDaBiblioteca}
          />
        </TabsContent>

        <TabsContent value="criar" className="space-y-4">
          <div className="border rounded-lg p-6">
            <h3 className="font-medium mb-4">Criar Novo Template</h3>
            <FormularioNovoTemplate
              novoTemplate={novoTemplate}
              setNovoTemplate={setNovoTemplate}
              onCriar={handleCriarTemplate}
              onCancelar={() => setMostrarFormulario(false)}
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Fechar
        </Button>
      </div>
    </ExpandedDialog>
  );
};

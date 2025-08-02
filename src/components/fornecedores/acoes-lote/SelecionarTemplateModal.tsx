import React, { useState, useEffect, useCallback } from 'react';
import { ExpandedDialog } from "@/components/ui/expanded-dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Archive,
  Send,
  CheckCircle,
  AlertCircle,
  Search,
  Upload,
  Plus
} from 'lucide-react';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useTemplatesAcaoLote } from '@/hooks/useTemplatesAcaoLote';
import { useBibliotecaIntegracao } from '@/hooks/useBibliotecaIntegracao';
import { useFullscreenModal } from '@/hooks/useFullscreenModal';
import type { TemplateAcaoLote } from '@/types/acoes-lote';
import { BuscarSelecionarTemplate } from './template-modal/BuscarSelecionarTemplate';
import { ImportarNovoTemplate } from './template-modal/ImportarNovoTemplate';
import { CriarTemplateManual } from './template-modal/CriarTemplateManual';


interface DocumentoParaTemplate {
  id: string;
  nome: string;
  finalidade: string;
  area: string;
  tipo_arquivo: string;
  url_arquivo: string;
  descricao?: string;
  tags?: string[];
  conteudo_base?: string;
  publico: boolean;
}

interface SelecionarTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelecionarTemplate?: (template: TemplateAcaoLote) => void;
  onEnviarParaFornecedores?: (template: TemplateAcaoLote, disparo?: any) => Promise<void>;
}

export const SelecionarTemplateModal: React.FC<SelecionarTemplateModalProps> = ({
  open,
  onOpenChange,
  onSelecionarTemplate,
  onEnviarParaFornecedores
}) => {
  const [templateSelecionado, setTemplateSelecionado] = useState<TemplateAcaoLote | null>(null);
  const [documentoSelecionado, setDocumentoSelecionado] = useState<DocumentoParaTemplate | null>(null);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [abaSelecionada, setAbaSelecionada] = useState<string>('buscar');

  const { isFullscreen, toggleFullscreen } = useFullscreenModal(false);

  const { 
    templates, 
    loading, 
    criarTemplate, 
    atualizarTemplate,
    duplicarTemplate, 
    inativarTemplate 
  } = useTemplatesAcaoLote();
  
  const {
    documentosAprovados,
    loading: loadingBiblioteca,
    buscarDocumentosAprovados,
    criarTemplateDeDocumento
  } = useBibliotecaIntegracao();

  // Função memoizada para buscar documentos
  const buscarDocumentos = useCallback(() => {
    console.log('Buscando documentos da biblioteca...');
    buscarDocumentosAprovados();
  }, [buscarDocumentosAprovados]);

  // Buscar documentos apenas quando modal abrir pela primeira vez
  useEffect(() => {
    if (open && documentosAprovados.length === 0) {
      buscarDocumentos();
    }
  }, [open, documentosAprovados.length, buscarDocumentos]);

  const handleSelecionarTemplate = (template: TemplateAcaoLote) => {
    setTemplateSelecionado(template);
    setDocumentoSelecionado(null);
    setModoEdicao(false);
    console.log('Template selecionado:', template);
  };

  const handleSelecionarDocumento = (documento: DocumentoParaTemplate) => {
    setDocumentoSelecionado(documento);
    setTemplateSelecionado(null);
    setModoEdicao(false);
    console.log('Documento selecionado:', documento);
  };

  const handleCriarTemplate = async (dadosTemplate: Partial<TemplateAcaoLote>) => {
    try {
      const novoTemplate = await criarTemplate({
        ...dadosTemplate,
        is_ativo: true
      } as Omit<TemplateAcaoLote, 'id' | 'created_at' | 'updated_at'>);
      
      setTemplateSelecionado(novoTemplate);
      setDocumentoSelecionado(null);
      setModoEdicao(false);
      toast.success('Template criado com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar template');
    }
  };

  const handleEditarTemplate = () => {
    setModoEdicao(true);
  };

  const handleSalvarEdicao = async (dadosAtualizados: Partial<TemplateAcaoLote>) => {
    if (!templateSelecionado) return;

    try {
      const templateAtualizado = await atualizarTemplate(templateSelecionado.id, dadosAtualizados);
      setTemplateSelecionado(templateAtualizado);
      setModoEdicao(false);
      toast.success('Template atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar template');
    }
  };

  const handleExcluirTemplate = async () => {
    if (!templateSelecionado) return;

    try {
      await inativarTemplate(templateSelecionado.id);
      setTemplateSelecionado(null);
      toast.success('Template removido');
    } catch (error) {
      toast.error('Erro ao remover template');
    }
  };

  const handleEnviarAgora = async () => {
    let templateParaEnvio = templateSelecionado;

    // Se documento da biblioteca foi selecionado, converter para template
    if (documentoSelecionado && !templateSelecionado) {
      try {
        console.log('Convertendo documento em template...', documentoSelecionado);
        
        const dadosTemplate = await criarTemplateDeDocumento(
          documentoSelecionado, 
          `Template: ${documentoSelecionado.nome}`
        );
        
        templateParaEnvio = await criarTemplate({
          ...dadosTemplate,
          is_ativo: true
        } as Omit<TemplateAcaoLote, 'id' | 'created_at' | 'updated_at'>);

        toast.success('Documento convertido em template!');
      } catch (error) {
        console.error('Erro ao converter documento:', error);
        toast.error('Erro ao converter documento em template');
        return;
      }
    }

    if (templateParaEnvio) {
      try {
        // Criar disparo em lote no banco
        const { data: novoDisparo, error: disparoError } = await supabase
          .from('disparo_acao_lote')
          .insert({
            nome_disparo: `${templateParaEnvio.finalidade}: ${templateParaEnvio.nome}`,
            tipo_acao: templateParaEnvio.tipo_acao,
            template_id: templateParaEnvio.id,
            total_fornecedores: 0, // Será atualizado pelo callback
            status: 'preparando',
            configuracoes: {
              template_id: templateParaEnvio.id,
              permite_anonimato: templateParaEnvio.permite_anonimato,
              validade_dias: templateParaEnvio.validade_dias
            }
          })
          .select()
          .single();

        if (disparoError) {
          throw disparoError;
        }

        console.log('Disparo criado:', novoDisparo);
        
        // Chamar callback para processamento
        if (onEnviarParaFornecedores) {
          await onEnviarParaFornecedores(templateParaEnvio, novoDisparo);
        } else if (onSelecionarTemplate) {
          onSelecionarTemplate(templateParaEnvio);
        }

        toast.success('Disparo criado! Processando envios...');
        onOpenChange(false);
      } catch (error) {
        console.error('Erro ao criar disparo:', error);
        toast.error('Erro ao iniciar disparo');
      }
    }
  };

  const handleLimparSelecao = () => {
    setTemplateSelecionado(null);
    setDocumentoSelecionado(null);
    setModoEdicao(false);
  };

  const handleImportarArquivo = async (arquivo: File, metadados: any) => {
    try {
      const novoTemplate = await criarTemplate({
        nome: metadados.nome,
        finalidade: metadados.finalidade,
        tipo_acao: metadados.tipo_acao,
        categoria: metadados.categoria,
        conteudo_texto: metadados.conteudo_texto,
        campos_formulario: [],
        configuracoes: {
          arquivo_origem: arquivo.name,
          tipo_arquivo: arquivo.type,
          tamanho_arquivo: arquivo.size
        },
        permite_anonimato: false,
        validade_dias: metadados.validade_dias,
        is_ativo: true
      });

      setTemplateSelecionado(novoTemplate);
      setDocumentoSelecionado(null);
      setAbaSelecionada('buscar');
      toast.success('Template importado com sucesso!');
    } catch (error) {
      toast.error('Erro ao importar arquivo');
    }
  };

  // Verificar se há algo selecionado (template ou documento)
  const temSelecao = templateSelecionado || documentoSelecionado;
  const nomeSelecao = templateSelecionado?.nome || documentoSelecionado?.nome;

  return (
    <ExpandedDialog 
      open={open} 
      onOpenChange={onOpenChange}
      title="Templates e Envio"
      fullscreen={isFullscreen}
      onToggleFullscreen={toggleFullscreen}
      className="overflow-hidden"
    >
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Área Principal - 3 Blocos */}
        <div className="flex-1 flex flex-col lg:flex-row gap-4">
          <Tabs value={abaSelecionada} onValueChange={setAbaSelecionada} className="flex-1">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="buscar" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Buscar
              </TabsTrigger>
              <TabsTrigger value="importar" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Importar
              </TabsTrigger>
              <TabsTrigger value="criar" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Criar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="buscar" className="flex-1 mt-4">
              <BuscarSelecionarTemplate
                templates={templates}
                documentos={documentosAprovados}
                loading={loading}
                loadingBiblioteca={loadingBiblioteca}
                templateSelecionado={templateSelecionado}
                documentoSelecionado={documentoSelecionado}
                onSelecionarTemplate={handleSelecionarTemplate}
                onSelecionarDocumento={handleSelecionarDocumento}
                onDuplicarTemplate={duplicarTemplate}
                onExcluirTemplate={inativarTemplate}
                onCriarTemplateDaBiblioteca={criarTemplateDeDocumento}
                onAtualizarDocumentos={buscarDocumentos}
                onEnviarTemplate={handleEnviarAgora}
              />
            </TabsContent>

            <TabsContent value="importar" className="flex-1 mt-4">
              <ImportarNovoTemplate
                onImportarArquivo={handleImportarArquivo}
              />
            </TabsContent>

            <TabsContent value="criar" className="flex-1 mt-4">
              <CriarTemplateManual
                onCriarTemplate={handleCriarTemplate}
                templateParaEditar={modoEdicao ? templateSelecionado : null}
                onSalvarEdicao={handleSalvarEdicao}
                onCancelarEdicao={() => setModoEdicao(false)}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Indicador de Seleção */}
        <div className="border-t pt-4">
          <div className="text-sm text-muted-foreground">
            {temSelecao ? (
              <span className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                {templateSelecionado ? 'Template' : 'Documento'} selecionado: {nomeSelecao}
              </span>
            ) : (
              <span className="flex items-center gap-2 text-gray-500">
                <AlertCircle className="h-4 w-4" />
                Selecione um template ou documento para continuar
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Botão Cancelar - Fora do conteúdo principal */}
      <div className="flex justify-center pt-4">
        <Button variant="outline" onClick={() => onOpenChange(false)} className="min-w-24">
          Cancelar
        </Button>
      </div>
    </ExpandedDialog>
  );
};

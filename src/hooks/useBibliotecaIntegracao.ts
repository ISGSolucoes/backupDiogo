import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BibliotecaDocumento } from '@/types/biblioteca-documentos';
import { TipoAcaoLote } from '@/types/acoes-lote';
import { MAPEAMENTO_ACAO_FINALIDADE, obterTipoAcaoPorFinalidade } from '@/constants/biblioteca-constantes';

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

export const useBibliotecaIntegracao = () => {
  const [documentosAprovados, setDocumentosAprovados] = useState<DocumentoParaTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buscarDocumentosAprovados = async (tipoAcao?: TipoAcaoLote) => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('biblioteca_documentos')
        .select('*')
        .eq('status', 'aprovado') // Buscar apenas aprovados, independente de serem públicos
        .order('criado_em', { ascending: false });

      // Filtrar por finalidades relevantes para o tipo de ação
      if (tipoAcao && MAPEAMENTO_ACAO_FINALIDADE[tipoAcao]) {
        const finalidadesRelevantes = MAPEAMENTO_ACAO_FINALIDADE[tipoAcao];
        query = query.in('finalidade', finalidadesRelevantes);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // Transformar dados para o formato usado nos templates
      const documentosTransformados = (data || []).map((doc: any) => ({
        id: doc.id,
        nome: doc.nome_original,
        finalidade: doc.finalidade,
        area: doc.area,
        tipo_arquivo: doc.tipo_arquivo,
        url_arquivo: doc.url_arquivo,
        descricao: doc.descricao || '',
        tags: doc.tags || [],
        conteudo_base: doc.observacoes || '', // Usar observações como conteúdo base
        publico: doc.publico || false // Incluir informação de visibilidade
      }));

      setDocumentosAprovados(documentosTransformados);
    } catch (err) {
      console.error('Erro ao buscar documentos da biblioteca:', err);
      setError('Erro ao carregar documentos da biblioteca');
      toast.error('Erro ao carregar documentos da biblioteca');
    } finally {
      setLoading(false);
    }
  };

  const criarTemplateDeDocumento = async (documento: DocumentoParaTemplate, nomeTemplate: string) => {
    try {
      // Usar a nova função helper para mapear finalidade para tipo de ação
      const tipoAcao = obterTipoAcaoPorFinalidade(documento.finalidade);

      return {
        nome: nomeTemplate,
        finalidade: documento.finalidade,
        tipo_acao: tipoAcao,
        categoria: documento.area,
        conteudo_texto: documento.conteudo_base || `Template baseado no documento: ${documento.nome}`,
        campos_formulario: [],
        configuracoes: {
          documento_origem_id: documento.id,
          documento_origem_nome: documento.nome,
          criado_da_biblioteca: true
        },
        permite_anonimato: tipoAcao === 'pesquisa_cliente',
        validade_dias: 30,
        is_ativo: true
      };
    } catch (err) {
      console.error('Erro ao criar template do documento:', err);
      toast.error('Erro ao criar template');
      throw err;
    }
  };

  useEffect(() => {
    buscarDocumentosAprovados();
  }, []);

  return {
    documentosAprovados,
    loading,
    error,
    buscarDocumentosAprovados,
    criarTemplateDeDocumento
  };
};

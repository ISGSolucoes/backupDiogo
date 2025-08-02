import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BibliotecaDocumento, DocumentoUpload, FiltrosBiblioteca } from '@/types/biblioteca-documentos';

export const useBibliotecaDocumentos = () => {
  const [documentos, setDocumentos] = useState<BibliotecaDocumento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buscarDocumentos = async (filtros?: FiltrosBiblioteca) => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('biblioteca_documentos')
        .select('*')
        .order('criado_em', { ascending: false });

      // Aplicar filtros
      if (filtros?.area) {
        query = query.eq('area', filtros.area);
      }
      if (filtros?.finalidade) {
        query = query.eq('finalidade', filtros.finalidade);
      }
      if (filtros?.tipo_arquivo) {
        query = query.eq('tipo_arquivo', filtros.tipo_arquivo);
      }
      if (filtros?.status) {
        query = query.eq('status', filtros.status);
      }
      if (filtros?.busca) {
        query = query.or(`nome_original.ilike.%${filtros.busca}%,descricao.ilike.%${filtros.busca}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setDocumentos((data || []) as BibliotecaDocumento[]);
    } catch (err) {
      console.error('Erro ao buscar documentos:', err);
      setError('Erro ao carregar documentos');
      toast.error('Erro ao carregar documentos');
    } finally {
      setLoading(false);
    }
  };

  const uploadDocumento = async (documentoData: DocumentoUpload): Promise<void> => {
    try {
      setLoading(true);
      
      // Upload do arquivo para storage
      const fileExt = documentoData.file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('biblioteca-documentos')
        .upload(filePath, documentoData.file);

      if (uploadError) {
        throw uploadError;
      }

      // Obter URL do arquivo
      const { data: { publicUrl } } = supabase.storage
        .from('biblioteca-documentos')
        .getPublicUrl(filePath);

      // Salvar metadados no banco
      const { data, error } = await supabase
        .from('biblioteca_documentos')
        .insert([{
          nome_arquivo: fileName,
          nome_original: documentoData.nome_arquivo,
          descricao: documentoData.descricao,
          tipo_arquivo: fileExt?.toLowerCase() || '',
          tamanho_bytes: documentoData.file.size,
          url_arquivo: publicUrl,
          area: documentoData.area,
          finalidade: documentoData.finalidade,
          categoria: documentoData.categoria,
          tags: documentoData.tags || [],
          publico: documentoData.publico,
          areas_permitidas: documentoData.areas_permitidas || [],
          cargos_permitidos: documentoData.cargos_permitidos || [],
          data_validade: documentoData.data_validade,
          notificar_vencimento: documentoData.notificar_vencimento,
          observacoes: documentoData.observacoes,
          criado_por: (await supabase.auth.getUser()).data.user?.id || '',
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      setDocumentos(prev => [data as BibliotecaDocumento, ...prev]);
      toast.success('Documento enviado com sucesso!');
    } catch (err) {
      console.error('Erro ao fazer upload:', err);
      toast.error('Erro ao enviar documento');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const baixarDocumento = async (documento: BibliotecaDocumento) => {
    try {
      // Incrementar contador de downloads
      await supabase
        .from('biblioteca_documentos')
        .update({ 
          downloads_count: documento.downloads_count + 1,
          ultimo_download: new Date().toISOString()
        })
        .eq('id', documento.id);

      // Fazer download do arquivo
      const { data, error } = await supabase.storage
        .from('biblioteca-documentos')
        .download(documento.nome_arquivo);

      if (error) {
        throw error;
      }

      // Criar link para download
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = documento.nome_original;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Download iniciado!');
    } catch (err) {
      console.error('Erro ao baixar documento:', err);
      toast.error('Erro ao baixar documento');
    }
  };

  const aprovarDocumento = async (id: string) => {
    try {
      const { error } = await supabase
        .from('biblioteca_documentos')
        .update({ 
          status: 'aprovado',
          aprovado_em: new Date().toISOString(),
          aprovado_por: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      setDocumentos(prev => 
        prev.map(doc => 
          doc.id === id 
            ? { ...doc, status: 'aprovado' as const }
            : doc
        )
      );
      toast.success('Documento aprovado!');
    } catch (err) {
      console.error('Erro ao aprovar documento:', err);
      toast.error('Erro ao aprovar documento');
    }
  };

  const rejeitarDocumento = async (id: string, motivo: string) => {
    try {
      const { error } = await supabase
        .from('biblioteca_documentos')
        .update({ 
          status: 'rejeitado',
          motivo_rejeicao: motivo
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      setDocumentos(prev => 
        prev.map(doc => 
          doc.id === id 
            ? { ...doc, status: 'rejeitado' as const, motivo_rejeicao: motivo }
            : doc
        )
      );
      toast.success('Documento rejeitado!');
    } catch (err) {
      console.error('Erro ao rejeitar documento:', err);
      toast.error('Erro ao rejeitar documento');
    }
  };

  useEffect(() => {
    buscarDocumentos();
  }, []);

  return {
    documentos,
    loading,
    error,
    buscarDocumentos,
    uploadDocumento,
    baixarDocumento,
    aprovarDocumento,
    rejeitarDocumento
  };
};
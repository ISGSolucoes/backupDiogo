
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { TemplateAcaoLote } from '@/types/acoes-lote';

export const useTemplatesAcaoLote = () => {
  const [templates, setTemplates] = useState<TemplateAcaoLote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('template_acao_lote')
        .select('*')
        .eq('is_ativo', true)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform database response to match our TypeScript types
      const transformedData = (data || []).map((item: any) => ({
        ...item,
        tipo_acao: item.tipo_acao as TemplateAcaoLote['tipo_acao'],
        campos_formulario: (item.campos_formulario as any) || [],
        configuracoes: (item.configuracoes as any) || {},
        finalidade: item.finalidade || '' // Adicionar campo finalidade
      }));

      setTemplates(transformedData);
    } catch (err) {
      console.error('Erro ao buscar templates:', err);
      setError('Erro ao carregar templates');
      toast.error('Erro ao carregar templates');
    } finally {
      setLoading(false);
    }
  };

  const criarTemplate = async (template: Omit<TemplateAcaoLote, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Transform data to match database schema
      const dbTemplate = {
        nome: template.nome,
        finalidade: template.finalidade || '', // Incluir finalidade
        tipo_acao: template.tipo_acao,
        categoria: template.categoria,
        conteudo_texto: template.conteudo_texto,
        campos_formulario: template.campos_formulario as any,
        configuracoes: template.configuracoes as any,
        permite_anonimato: template.permite_anonimato,
        validade_dias: template.validade_dias,
        is_ativo: template.is_ativo,
        created_by: template.created_by
      };

      const { data, error } = await supabase
        .from('template_acao_lote')
        .insert([dbTemplate])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Transform response back to our TypeScript types
      const transformedData = {
        ...data,
        tipo_acao: data.tipo_acao as TemplateAcaoLote['tipo_acao'],
        campos_formulario: (data.campos_formulario as any) || [],
        configuracoes: (data.configuracoes as any) || {},
        finalidade: (data as any).finalidade || ''
      };

      setTemplates(prev => [transformedData, ...prev]);
      toast.success('Template criado com sucesso!');
      return transformedData;
    } catch (err) {
      console.error('Erro ao criar template:', err);
      toast.error('Erro ao criar template');
      throw err;
    }
  };

  const atualizarTemplate = async (id: string, updates: Partial<TemplateAcaoLote>) => {
    try {
      // Transform updates to match database schema
      const dbUpdates: any = {};
      if (updates.nome !== undefined) dbUpdates.nome = updates.nome;
      if (updates.finalidade !== undefined) dbUpdates.finalidade = updates.finalidade;
      if (updates.tipo_acao !== undefined) dbUpdates.tipo_acao = updates.tipo_acao;
      if (updates.categoria !== undefined) dbUpdates.categoria = updates.categoria;
      if (updates.conteudo_texto !== undefined) dbUpdates.conteudo_texto = updates.conteudo_texto;
      if (updates.campos_formulario !== undefined) dbUpdates.campos_formulario = updates.campos_formulario as any;
      if (updates.configuracoes !== undefined) dbUpdates.configuracoes = updates.configuracoes as any;
      if (updates.permite_anonimato !== undefined) dbUpdates.permite_anonimato = updates.permite_anonimato;
      if (updates.validade_dias !== undefined) dbUpdates.validade_dias = updates.validade_dias;
      if (updates.is_ativo !== undefined) dbUpdates.is_ativo = updates.is_ativo;

      const { data, error } = await supabase
        .from('template_acao_lote')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Transform response back to our TypeScript types
      const transformedData = {
        ...data,
        tipo_acao: data.tipo_acao as TemplateAcaoLote['tipo_acao'],
        campos_formulario: (data.campos_formulario as any) || [],
        configuracoes: (data.configuracoes as any) || {},
        finalidade: (data as any).finalidade || ''
      };

      setTemplates(prev => 
        prev.map(t => t.id === id ? transformedData : t)
      );
      toast.success('Template atualizado com sucesso!');
      return transformedData;
    } catch (err) {
      console.error('Erro ao atualizar template:', err);
      toast.error('Erro ao atualizar template');
      throw err;
    }
  };

  const duplicarTemplate = async (template: TemplateAcaoLote) => {
    try {
      const templateDuplicado = {
        nome: `${template.nome} (Cópia)`,
        finalidade: template.finalidade,
        tipo_acao: template.tipo_acao,
        categoria: template.categoria,
        conteudo_texto: template.conteudo_texto,
        campos_formulario: template.campos_formulario,
        configuracoes: template.configuracoes,
        permite_anonimato: template.permite_anonimato,
        validade_dias: template.validade_dias,
        is_ativo: true
      };

      return await criarTemplate(templateDuplicado);
    } catch (err) {
      console.error('Erro ao duplicar template:', err);
      toast.error('Erro ao duplicar template');
      throw err;
    }
  };

  const inativarTemplate = async (id: string) => {
    try {
      await atualizarTemplate(id, { is_ativo: false });
      setTemplates(prev => prev.filter(t => t.id !== id));
      toast.success('Template inativado');
    } catch (err) {
      console.error('Erro ao inativar template:', err);
      toast.error('Erro ao inativar template');
      throw err;
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return {
    templates,
    loading,
    error,
    criarTemplate,
    atualizarTemplate,
    duplicarTemplate,
    inativarTemplate,
    refetch: fetchTemplates
  };
};

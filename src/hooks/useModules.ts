import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Module, ModuleWorkspace, FeatureFlag } from '@/types/modular';
import { toast } from 'sonner';

// Tipos para as novas estruturas de regras granulares
export interface BusinessRuleCategory {
  id: string;
  module_id: string;
  name: string;
  description?: string;
  parent_id?: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BusinessRuleTemplate {
  id: string;
  category_id: string;
  rule_key: string;
  name: string;
  description: string;
  rule_type: 'boolean' | 'numeric' | 'text' | 'select';
  default_value: any;
  options?: any;
  validation_schema?: any;
  dependencies?: string[];
  conflicts?: string[];
  impact_level: 'low' | 'medium' | 'high' | 'critical';
  order_index: number;
  is_core: boolean;
  requires_approval: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceBusinessRule {
  id: string;
  workspace_id: string;
  rule_template_id: string;
  is_enabled: boolean;
  custom_value?: any;
  configured_by?: string;
  configured_at: string;
  approved_by?: string;
  approved_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  rule_template?: BusinessRuleTemplate;
}

export const useModules = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [workspaces, setWorkspaces] = useState<ModuleWorkspace[]>([]);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([]);
  const [businessRuleCategories, setBusinessRuleCategories] = useState<BusinessRuleCategory[]>([]);
  const [businessRuleTemplates, setBusinessRuleTemplates] = useState<BusinessRuleTemplate[]>([]);
  const [workspaceBusinessRules, setWorkspaceBusinessRules] = useState<WorkspaceBusinessRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModules = async () => {
    try {
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setModules((data || []) as Module[]);
    } catch (err) {
      console.error('Erro ao buscar módulos:', err);
      setError('Erro ao carregar módulos');
      toast.error('Erro ao carregar módulos');
    }
  };

  const fetchWorkspaces = async () => {
    try {
      const { data, error } = await supabase
        .from('module_workspaces')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setWorkspaces((data || []) as ModuleWorkspace[]);
    } catch (err) {
      console.error('Erro ao buscar workspaces:', err);
      setError('Erro ao carregar workspaces');
    }
  };

  const fetchFeatureFlags = async () => {
    try {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('*')
        .order('flag_name');
      
      if (error) throw error;
      setFeatureFlags((data || []) as FeatureFlag[]);
    } catch (err) {
      console.error('Erro ao buscar feature flags:', err);
      setError('Erro ao carregar configurações');
    }
  };

  const fetchBusinessRuleCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('business_rule_categories')
        .select('*')
        .order('order_index');
      
      if (error) throw error;
      setBusinessRuleCategories((data || []) as BusinessRuleCategory[]);
    } catch (err) {
      console.error('Erro ao buscar categorias de regras:', err);
      setError('Erro ao carregar categorias de regras');
    }
  };

  const fetchBusinessRuleTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('business_rule_templates')
        .select('*')
        .order('order_index');
      
      if (error) throw error;
      setBusinessRuleTemplates((data || []) as BusinessRuleTemplate[]);
    } catch (err) {
      console.error('Erro ao buscar templates de regras:', err);
      setError('Erro ao carregar templates de regras');
    }
  };

  const fetchWorkspaceBusinessRules = async () => {
    try {
      const { data, error } = await supabase
        .from('workspace_business_rules')
        .select(`
          *,
          rule_template:business_rule_templates(*)
        `)
        .order('configured_at');
      
      if (error) throw error;
      setWorkspaceBusinessRules((data || []) as WorkspaceBusinessRule[]);
    } catch (err) {
      console.error('Erro ao buscar regras do workspace:', err);
      setError('Erro ao carregar regras do workspace');
    }
  };

  const toggleBusinessRule = async (ruleId: string, enabled: boolean, customValue?: any) => {
    try {
      const { error } = await supabase
        .from('workspace_business_rules')
        .update({ 
          is_enabled: enabled,
          custom_value: customValue || null,
          configured_at: new Date().toISOString()
        })
        .eq('id', ruleId);
      
      if (error) throw error;
      
      setWorkspaceBusinessRules(prev => prev.map(rule => 
        rule.id === ruleId 
          ? { ...rule, is_enabled: enabled, custom_value: customValue || null }
          : rule
      ));
      
      toast.success(`Regra ${enabled ? 'ativada' : 'desativada'} com sucesso`);
    } catch (err) {
      console.error('Erro ao alterar regra de negócio:', err);
      toast.error('Erro ao alterar regra de negócio');
    }
  };

  const toggleModule = async (moduleId: string, enabled: boolean) => {
    try {
      const status = enabled ? 'ativo' : 'inativo';
      const { error } = await supabase
        .from('modules')
        .update({ status })
        .eq('id', moduleId);
      
      if (error) throw error;
      
      setModules(prev => prev.map(module => 
        module.id === moduleId 
          ? { ...module, status: status as 'ativo' | 'inativo' | 'manutencao' }
          : module
      ));
      
      toast.success(`Módulo ${enabled ? 'ativado' : 'desativado'} com sucesso`);
    } catch (err) {
      console.error('Erro ao alterar status do módulo:', err);
      toast.error('Erro ao alterar status do módulo');
    }
  };

  const updateWorkspace = async (workspaceId: string, configuration: Record<string, any>) => {
    try {
      const { error } = await supabase
        .from('module_workspaces')
        .update({ configuration })
        .eq('id', workspaceId);
      
      if (error) throw error;
      
      setWorkspaces(prev => prev.map(workspace => 
        workspace.id === workspaceId 
          ? { ...workspace, configuration, updated_at: new Date().toISOString() }
          : workspace
      ));
      
      toast.success('Workspace atualizado com sucesso');
    } catch (err) {
      console.error('Erro ao atualizar workspace:', err);
      toast.error('Erro ao atualizar workspace');
    }
  };

  const toggleFeatureFlag = async (flagId: string, enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('feature_flags')
        .update({ is_enabled: enabled })
        .eq('id', flagId);
      
      if (error) throw error;
      
      setFeatureFlags(prev => prev.map(flag => 
        flag.id === flagId 
          ? { ...flag, is_enabled: enabled }
          : flag
      ));
      
      toast.success(`Feature ${enabled ? 'ativada' : 'desativada'} com sucesso`);
    } catch (err) {
      console.error('Erro ao alterar feature flag:', err);
      toast.error('Erro ao alterar configuração');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchModules(),
        fetchWorkspaces(), 
        fetchFeatureFlags(),
        fetchBusinessRuleCategories(),
        fetchBusinessRuleTemplates(),
        fetchWorkspaceBusinessRules()
      ]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    modules,
    workspaces,
    featureFlags,
    businessRuleCategories,
    businessRuleTemplates,
    workspaceBusinessRules,
    loading,
    error,
    toggleModule,
    updateWorkspace,
    toggleFeatureFlag,
    toggleBusinessRule,
    refetch: () => {
      fetchModules();
      fetchWorkspaces();
      fetchFeatureFlags();
      fetchBusinessRuleCategories();
      fetchBusinessRuleTemplates();
      fetchWorkspaceBusinessRules();
    }
  };
};
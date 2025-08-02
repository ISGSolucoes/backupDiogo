
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Settings2, Save, RotateCcw, Clock, CheckCircle2, AlertCircle, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BusinessRuleCategory {
  id: string;
  name: string;
  description: string;
  order_index: number;
}

interface BusinessRuleTemplate {
  id: string;
  category_id: string;
  rule_key: string;
  name: string;
  description: string;
  rule_type: 'boolean' | 'numeric' | 'text' | 'select';
  default_value: any;
  options?: any;
  impact_level: 'low' | 'medium' | 'high' | 'critical';
  order_index: number;
  is_core: boolean;
  requires_approval: boolean;
}

interface WorkspaceBusinessRule {
  id: string;
  rule_template_id: string;
  is_enabled: boolean;
  custom_value: any;
  configured_by?: string;
  configured_at: string;
  notes?: string;
}

interface GranularRulesConfigProps {
  workspace: {
    id: string;
    name: string;
    description?: string;
    module_id: string;
  };
  moduleId: string;
  searchTerm?: string;
}

export const GranularRulesConfig = ({ workspace, moduleId, searchTerm = '' }: GranularRulesConfigProps) => {
  const [categories, setCategories] = useState<BusinessRuleCategory[]>([]);
  const [templates, setTemplates] = useState<BusinessRuleTemplate[]>([]);
  const [workspaceRules, setWorkspaceRules] = useState<WorkspaceBusinessRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadBusinessRules();
  }, [workspace.id, moduleId]);

  useEffect(() => {
    // Auto-expand categories that contain search matches
    if (searchTerm && templates.length > 0) {
      const matchingTemplates = templates.filter(t => 
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchingCategoryIds = [...new Set(matchingTemplates.map(t => t.category_id))];
      setExpandedCategories(matchingCategoryIds);
    }
  }, [searchTerm, templates]);

  const loadBusinessRules = async () => {
    try {
      setLoading(true);

      // Carregar categorias
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('business_rule_categories')
        .select('*')
        .eq('module_id', moduleId)
        .order('order_index');

      if (categoriesError) throw categoriesError;

      // Carregar templates de regras
      const { data: templatesData, error: templatesError } = await supabase
        .from('business_rule_templates')
        .select('*')
        .in('category_id', categoriesData?.map(c => c.id) || [])
        .order('order_index');

      if (templatesError) throw templatesError;

      // Carregar regras configuradas do workspace
      const { data: workspaceRulesData, error: workspaceRulesError } = await supabase
        .from('workspace_business_rules')
        .select('*')
        .eq('workspace_id', workspace.id);

      if (workspaceRulesError) throw workspaceRulesError;

      setCategories(categoriesData || []);
      setTemplates((templatesData || []) as BusinessRuleTemplate[]);
      setWorkspaceRules(workspaceRulesData || []);
    } catch (error) {
      console.error('Erro ao carregar regras de negócio:', error);
      toast({
        title: "Erro ao carregar regras",
        description: "Não foi possível carregar as regras de negócio.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateRule = async (templateId: string, isEnabled: boolean, customValue?: any, notes?: string) => {
    try {
      setSaving(true);

      const existingRule = workspaceRules.find(r => r.rule_template_id === templateId);

      if (existingRule) {
        // Update existing rule
        const { error } = await supabase
          .from('workspace_business_rules')
          .update({
            is_enabled: isEnabled,
            custom_value: customValue,
            notes: notes,
            configured_at: new Date().toISOString()
          })
          .eq('id', existingRule.id);

        if (error) throw error;

        setWorkspaceRules(prev => prev.map(r => 
          r.id === existingRule.id 
            ? { ...r, is_enabled: isEnabled, custom_value: customValue, notes, configured_at: new Date().toISOString() }
            : r
        ));
      } else {
        // Create new rule
        const { data, error } = await supabase
          .from('workspace_business_rules')
          .insert({
            workspace_id: workspace.id,
            rule_template_id: templateId,
            is_enabled: isEnabled,
            custom_value: customValue,
            notes: notes
          })
          .select()
          .single();

        if (error) throw error;

        setWorkspaceRules(prev => [...prev, data]);
      }

      toast({
        title: "Regra atualizada",
        description: "A configuração da regra foi salva com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao atualizar regra:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a configuração da regra.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getImpactColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactIcon = (level: string) => {
    switch (level) {
      case 'low': return CheckCircle2;
      case 'medium': return Clock;
      case 'high': return AlertCircle;
      case 'critical': return AlertTriangle;
      default: return Settings2;
    }
  };

  const filterTemplates = (categoryId: string) => {
    let filtered = templates.filter(t => t.category_id === categoryId);
    
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.rule_key.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (categories.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Settings2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhuma Regra Disponível</h3>
          <p className="text-muted-foreground">
            Este módulo ainda não possui regras granulares configuradas.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Regras Granulares - {workspace.name}
          </CardTitle>
          <CardDescription>
            Configure as regras específicas para este workspace. Regras marcadas como "Core" são essenciais para o funcionamento do sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion 
            type="multiple" 
            value={expandedCategories} 
            onValueChange={setExpandedCategories}
            className="space-y-4"
          >
            {categories.map((category) => {
              const categoryTemplates = filterTemplates(category.id);
              
              if (searchTerm && categoryTemplates.length === 0) {
                return null;
              }

              return (
                <AccordionItem key={category.id} value={category.id} className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between w-full mr-4">
                      <div className="text-left">
                        <h3 className="font-semibold">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {categoryTemplates.length} regras
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    {categoryTemplates.map((template) => {
                      const workspaceRule = workspaceRules.find(r => r.rule_template_id === template.id);
                      const isEnabled = workspaceRule?.is_enabled || false;
                      const customValue = workspaceRule?.custom_value || template.default_value;
                      const ImpactIcon = getImpactIcon(template.impact_level);

                      return (
                        <Card key={template.id} className="border-l-4 border-l-primary/20">
                          <CardContent className="p-4 space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium">{template.name}</h4>
                                  {template.is_core && (
                                    <Badge variant="outline" className="text-xs">
                                      <Shield className="h-3 w-3 mr-1" />
                                      Core
                                    </Badge>
                                  )}
                                  {template.requires_approval && (
                                    <Badge variant="secondary" className="text-xs">
                                      <AlertTriangle className="h-3 w-3 mr-1" />
                                      Requer Aprovação
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">{template.description}</p>
                                <div className="flex items-center gap-2">
                                  <Badge className={`text-xs ${getImpactColor(template.impact_level)}`}>
                                    <ImpactIcon className="h-3 w-3 mr-1" />
                                    Impacto {template.impact_level}
                                  </Badge>
                                  <code className="text-xs bg-muted px-2 py-1 rounded">
                                    {template.rule_key}
                                  </code>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <Switch
                                  checked={isEnabled}
                                  onCheckedChange={(checked) => updateRule(template.id, checked, customValue)}
                                  disabled={saving}
                                />
                              </div>
                            </div>

                            {/* Campos customizáveis quando habilitado */}
                            {isEnabled && template.rule_type !== 'boolean' && (
                              <div className="space-y-2 pl-4 border-l-2 border-muted">
                                <Label className="text-sm font-medium">
                                  Valor Personalizado:
                                </Label>
                                {template.rule_type === 'numeric' ? (
                                  <Input
                                    type="number"
                                    value={customValue || ''}
                                    onChange={(e) => updateRule(template.id, isEnabled, e.target.value)}
                                    placeholder={`Valor padrão: ${template.default_value}`}
                                    className="w-48"
                                  />
                                ) : template.rule_type === 'text' ? (
                                  <Input
                                    value={customValue || ''}
                                    onChange={(e) => updateRule(template.id, isEnabled, e.target.value)}
                                    placeholder={`Valor padrão: ${template.default_value}`}
                                  />
                                ) : null}
                              </div>
                            )}

                            {/* Notas de configuração */}
                            {isEnabled && (
                              <div className="space-y-2 pl-4 border-l-2 border-muted">
                                <Label className="text-sm font-medium">
                                  Observações (opcional):
                                </Label>
                                <Textarea
                                  value={workspaceRule?.notes || ''}
                                  onChange={(e) => updateRule(template.id, isEnabled, customValue, e.target.value)}
                                  placeholder="Adicione observações sobre esta configuração..."
                                  className="h-20"
                                />
                              </div>
                            )}

                            {/* Informações de configuração */}
                            {workspaceRule && (
                              <div className="text-xs text-muted-foreground pt-2 border-t">
                                Última configuração: {new Date(workspaceRule.configured_at).toLocaleString('pt-BR')}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Search, Settings, AlertTriangle, CheckCircle, Clock, Shield, Zap, Clock4 } from 'lucide-react';
import { 
  useModules, 
  BusinessRuleCategory, 
  BusinessRuleTemplate, 
  WorkspaceBusinessRule 
} from '@/hooks/useModules';
import { ModuleWorkspace } from '@/types/modular';

interface BusinessRulesConfigProps {
  workspace: ModuleWorkspace;
  moduleId: string;
}

export const BusinessRulesConfig = ({ workspace, moduleId }: BusinessRulesConfigProps) => {
  const { 
    businessRuleCategories, 
    businessRuleTemplates, 
    workspaceBusinessRules,
    toggleBusinessRule 
  } = useModules();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImpactLevel, setSelectedImpactLevel] = useState<string>('');

  // Filtrar categorias para este módulo
  const moduleCategories = useMemo(() => {
    return businessRuleCategories.filter(category => category.module_id === moduleId);
  }, [businessRuleCategories, moduleId]);

  // Agrupar templates por categoria
  const templatesByCategory = useMemo(() => {
    const grouped: Record<string, BusinessRuleTemplate[]> = {};
    
    moduleCategories.forEach(category => {
      grouped[category.id] = businessRuleTemplates.filter(template => 
        template.category_id === category.id &&
        (searchTerm === '' || 
         template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         template.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedImpactLevel === '' || template.impact_level === selectedImpactLevel)
      );
    });
    
    return grouped;
  }, [moduleCategories, businessRuleTemplates, searchTerm, selectedImpactLevel]);

  // Mapear regras ativas do workspace
  const activeRules = useMemo(() => {
    const rulesMap: Record<string, WorkspaceBusinessRule> = {};
    workspaceBusinessRules
      .filter(rule => rule.workspace_id === workspace.id)
      .forEach(rule => {
        rulesMap[rule.rule_template_id] = rule;
      });
    return rulesMap;
  }, [workspaceBusinessRules, workspace.id]);

  const getImpactColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-success/10 text-success border-success/20';
      case 'medium':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'high':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'critical':
        return 'bg-destructive/20 text-destructive border-destructive/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getImpactIcon = (level: string) => {
    switch (level) {
      case 'low':
        return <CheckCircle className="h-3 w-3" />;
      case 'medium':
        return <Clock4 className="h-3 w-3" />;
      case 'high':
        return <Zap className="h-3 w-3" />;
      case 'critical':
        return <Shield className="h-3 w-3" />;
      default:
        return <Settings className="h-3 w-3" />;
    }
  };

  // Organizador de regras por subcategorias baseado no nome
  const organizeRulesBySubcategory = (templates: BusinessRuleTemplate[]) => {
    const subcategories: Record<string, BusinessRuleTemplate[]> = {};
    
    templates.forEach(template => {
      // Extrair numeração do nome da regra para agrupar subcategorias
      const match = template.name.match(/^([\d.]+\s*[A-Za-z\s]*)/);
      let subcategoryKey = 'Outras Regras';
      
      if (match) {
        const prefix = match[1].trim();
        // Se contém ponto, é uma subcategoria (ex: "1.1", "2.3")
        if (prefix.includes('.')) {
          const parts = prefix.split('.');
          if (parts.length >= 2) {
            subcategoryKey = `${parts[0]}.${parts[1]} - Subcategoria`;
          }
        } else if (prefix.match(/^\d+/)) {
          subcategoryKey = `${prefix} - Categoria Principal`;
        }
      }
      
      if (!subcategories[subcategoryKey]) {
        subcategories[subcategoryKey] = [];
      }
      subcategories[subcategoryKey].push(template);
    });
    
    return subcategories;
  };

  const handleRuleToggle = async (template: BusinessRuleTemplate, enabled: boolean, customValue?: any) => {
    const activeRule = activeRules[template.id];
    if (activeRule) {
      await toggleBusinessRule(activeRule.id, enabled, customValue);
    }
  };

  const renderRuleControl = (template: BusinessRuleTemplate) => {
    const activeRule = activeRules[template.id];
    const value = activeRule?.custom_value || template.default_value;
    const isEnabled = activeRule?.is_enabled || false;

    return (
      <div className="flex items-center gap-3">
        <Checkbox
          id={`rule-${template.id}`}
          checked={isEnabled}
          onCheckedChange={(checked) => handleRuleToggle(template, checked as boolean)}
          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
        
        {template.rule_type === 'numeric' && isEnabled && (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={value || ''}
              onChange={(e) => handleRuleToggle(template, true, parseFloat(e.target.value) || 0)}
              className="w-20 h-8 text-sm"
              placeholder="0"
            />
            <span className="text-xs text-muted-foreground">
              {template.rule_key.includes('month') ? 'meses' : 
               template.rule_key.includes('day') ? 'dias' : 
               template.rule_key.includes('percent') ? '%' : 'un'}
            </span>
          </div>
        )}
        
        {template.rule_type === 'text' && isEnabled && (
          <Input
            type="text"
            value={value || ''}
            onChange={(e) => handleRuleToggle(template, true, e.target.value)}
            className="flex-1 h-8 text-sm"
            placeholder="Digite o valor..."
          />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Regras de Negócio - {workspace.name}
          </CardTitle>
          <CardDescription>
            Configure as regras granulares que definem o comportamento do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filtros */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Buscar regras</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Digite para buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="impact">Nível de Impacto</Label>
              <select
                id="impact"
                value={selectedImpactLevel}
                onChange={(e) => setSelectedImpactLevel(e.target.value)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Todos</option>
                <option value="low">Baixo</option>
                <option value="medium">Médio</option>
                <option value="high">Alto</option>
                <option value="critical">Crítico</option>
              </select>
            </div>
          </div>

          {/* Regras por categoria em formato organizado */}
          <div className="space-y-6">
            {moduleCategories.map((category) => {
              const categoryTemplates = templatesByCategory[category.id] || [];
              const activeCount = categoryTemplates.filter(template => 
                activeRules[template.id]?.is_enabled
              ).length;
              
              if (categoryTemplates.length === 0 && searchTerm) return null;

              const subcategorizedRules = organizeRulesBySubcategory(categoryTemplates);

              return (
                <Card key={category.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/50 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {category.name}
                          <Badge variant="outline" className="font-normal">
                            {activeCount}/{categoryTemplates.length} ativas
                          </Badge>
                        </CardTitle>
                        {category.description && (
                          <CardDescription className="text-sm">
                            {category.description}
                          </CardDescription>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-0">
                    {categoryTemplates.length === 0 ? (
                      <div className="p-6 text-center text-muted-foreground">
                        Nenhuma regra encontrada para os filtros atuais.
                      </div>
                    ) : (
                      <Accordion type="multiple" className="w-full">
                        {Object.entries(subcategorizedRules).map(([subcategoryName, rules]) => (
                          <AccordionItem key={subcategoryName} value={subcategoryName} className="border-0">
                            <AccordionTrigger className="px-6 py-4 hover:bg-muted/30 hover:no-underline">
                              <div className="flex items-center justify-between w-full mr-4">
                                <span className="font-medium text-sm">
                                  {subcategoryName.replace(' - Subcategoria', '').replace(' - Categoria Principal', '')}
                                </span>
                                <Badge variant="secondary" className="text-xs">
                                  {rules.filter(rule => activeRules[rule.id]?.is_enabled).length}/{rules.length}
                                </Badge>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-4 space-y-3">
                              {rules.map((template, index) => {
                                const activeRule = activeRules[template.id];
                                const isEnabled = activeRule?.is_enabled || false;
                                
                                return (
                                  <div key={template.id}>
                                    <div className="flex items-start gap-3 py-3">
                                      {renderRuleControl(template)}
                                      <div className="flex-1 min-w-0">
                                        <Label 
                                          htmlFor={`rule-${template.id}`}
                                          className={`text-sm cursor-pointer block ${isEnabled ? 'text-foreground' : 'text-muted-foreground'}`}
                                        >
                                          {template.name}
                                        </Label>
                                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                          {template.description}
                                        </p>
                                        
                                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                                          <Badge 
                                            variant="outline" 
                                            className={`${getImpactColor(template.impact_level)} text-xs px-1.5 py-0.5`}
                                          >
                                            {getImpactIcon(template.impact_level)}
                                            <span className="ml-1 capitalize">{template.impact_level}</span>
                                          </Badge>
                                          
                                          {template.is_core && (
                                            <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                                              Core
                                            </Badge>
                                          )}
                                          
                                          {template.requires_approval && (
                                            <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                                              Requer Aprovação
                                            </Badge>
                                          )}
                                          
                                          {isEnabled && activeRule?.configured_at && (
                                            <span className="text-xs text-muted-foreground">
                                              Ativada em {new Date(activeRule.configured_at).toLocaleDateString('pt-BR')}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    {index < rules.length - 1 && <Separator className="opacity-50" />}
                                  </div>
                                );
                              })}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {moduleCategories.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma categoria de regras configurada para este módulo</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
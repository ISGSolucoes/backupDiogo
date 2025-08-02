
-- Criar tabela para categorias de regras de negócio
CREATE TABLE public.business_rule_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  parent_id uuid REFERENCES public.business_rule_categories(id),
  order_index integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Criar tabela para templates de regras granulares
CREATE TABLE public.business_rule_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id uuid NOT NULL REFERENCES public.business_rule_categories(id),
  rule_key text NOT NULL, -- chave única para identificar a regra
  name text NOT NULL,
  description text NOT NULL,
  rule_type text NOT NULL DEFAULT 'boolean', -- boolean, numeric, text, select
  default_value jsonb DEFAULT 'false'::jsonb,
  options jsonb, -- para regras do tipo select/multi-select
  validation_schema jsonb, -- schema de validação
  dependencies text[], -- regras que dependem desta
  conflicts text[], -- regras que conflitam com esta
  impact_level text NOT NULL DEFAULT 'low', -- low, medium, high, critical
  order_index integer NOT NULL DEFAULT 0,
  is_core boolean NOT NULL DEFAULT false, -- se é regra essencial do sistema
  requires_approval boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(rule_key, category_id)
);

-- Criar tabela para configurações ativas das regras por workspace  
CREATE TABLE public.workspace_business_rules (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id uuid NOT NULL REFERENCES public.module_workspaces(id),
  rule_template_id uuid NOT NULL REFERENCES public.business_rule_templates(id),
  is_enabled boolean NOT NULL DEFAULT false,
  custom_value jsonb, -- valor customizado se diferente do default
  configured_by uuid,
  configured_at timestamp with time zone NOT NULL DEFAULT now(),
  approved_by uuid,
  approved_at timestamp with time zone,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(workspace_id, rule_template_id)
);

-- Criar tabela para histórico de mudanças nas regras
CREATE TABLE public.business_rule_changes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_rule_id uuid NOT NULL REFERENCES public.workspace_business_rules(id),
  change_type text NOT NULL, -- enabled, disabled, value_changed
  old_value jsonb,
  new_value jsonb,
  changed_by uuid NOT NULL,
  change_reason text,
  approved_by uuid,
  approved_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Criar índices para performance
CREATE INDEX idx_business_rule_categories_module_id ON public.business_rule_categories(module_id);
CREATE INDEX idx_business_rule_categories_parent_id ON public.business_rule_categories(parent_id);
CREATE INDEX idx_business_rule_templates_category_id ON public.business_rule_templates(category_id);
CREATE INDEX idx_business_rule_templates_rule_key ON public.business_rule_templates(rule_key);
CREATE INDEX idx_workspace_business_rules_workspace_id ON public.workspace_business_rules(workspace_id);
CREATE INDEX idx_workspace_business_rules_template_id ON public.workspace_business_rules(rule_template_id);
CREATE INDEX idx_business_rule_changes_workspace_rule_id ON public.business_rule_changes(workspace_rule_id);

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.business_rule_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_rule_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_business_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_rule_changes ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS
CREATE POLICY "Permitir acesso completo às categorias de regras" 
  ON public.business_rule_categories FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Permitir acesso completo aos templates de regras" 
  ON public.business_rule_templates FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Permitir acesso completo às regras de workspace" 
  ON public.workspace_business_rules FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Permitir acesso completo ao histórico de mudanças" 
  ON public.business_rule_changes FOR ALL USING (true) WITH CHECK (true);

-- Inserir dados de exemplo para módulo de fornecedores
INSERT INTO public.business_rule_categories (module_id, name, description, order_index) VALUES
  ((SELECT id FROM public.modules WHERE type = 'fornecedores' LIMIT 1), 'Cadastro e Validação', 'Regras para cadastro e validação de fornecedores', 1),
  ((SELECT id FROM public.modules WHERE type = 'fornecedores' LIMIT 1), 'Aprovação e Workflow', 'Regras para processos de aprovação', 2),
  ((SELECT id FROM public.modules WHERE type = 'fornecedores' LIMIT 1), 'Documentação', 'Regras para documentos obrigatórios', 3),
  ((SELECT id FROM public.modules WHERE type = 'fornecedores' LIMIT 1), 'Compliance e Risco', 'Regras de conformidade e análise de risco', 4),
  ((SELECT id FROM public.modules WHERE type = 'fornecedores' LIMIT 1), 'Integração e Comunicação', 'Regras para integrações externas', 5);

-- Inserir templates de regras para fornecedores
INSERT INTO public.business_rule_templates (category_id, rule_key, name, description, rule_type, default_value, impact_level, requires_approval) VALUES
  ((SELECT id FROM public.business_rule_categories WHERE name = 'Cadastro e Validação' LIMIT 1), 'require_cnpj_validation', 'Validação CNPJ obrigatória', 'Exige validação online do CNPJ na Receita Federal', 'boolean', 'true'::jsonb, 'high', true),
  ((SELECT id FROM public.business_rule_categories WHERE name = 'Cadastro e Validação' LIMIT 1), 'allow_duplicate_cnpj', 'Permitir CNPJ duplicado', 'Permite cadastrar fornecedores com mesmo CNPJ', 'boolean', 'false'::jsonb, 'critical', true),
  ((SELECT id FROM public.business_rule_categories WHERE name = 'Cadastro e Validação' LIMIT 1), 'require_financial_data', 'Dados financeiros obrigatórios', 'Exige preenchimento de informações financeiras', 'boolean', 'true'::jsonb, 'medium', false),
  ((SELECT id FROM public.business_rule_categories WHERE name = 'Aprovação e Workflow' LIMIT 1), 'auto_approve_limit', 'Limite para auto-aprovação', 'Valor limite para aprovação automática (R$)', 'numeric', '1000'::jsonb, 'high', true),
  ((SELECT id FROM public.business_rule_categories WHERE name = 'Aprovação e Workflow' LIMIT 1), 'require_manager_approval', 'Aprovação de gestor obrigatória', 'Sempre exige aprovação do gestor', 'boolean', 'true'::jsonb, 'medium', false),
  ((SELECT id FROM public.business_rule_categories WHERE name = 'Documentação' LIMIT 1), 'require_certidoes', 'Certidões obrigatórias', 'Exige upload de certidões negativas', 'boolean', 'true'::jsonb, 'high', false),
  ((SELECT id FROM public.business_rule_categories WHERE name = 'Compliance e Risco' LIMIT 1), 'blacklist_check', 'Verificação de lista negra', 'Verifica fornecedor em listas restritivas', 'boolean', 'true'::jsonb, 'critical', true),
  ((SELECT id FROM public.business_rule_categories WHERE name = 'Integração e Comunicação' LIMIT 1), 'send_welcome_email', 'Email de boas-vindas', 'Envia email automático após aprovação', 'boolean', 'true'::jsonb, 'low', false);

-- Função para aplicar regras padrão quando workspace é criado
CREATE OR REPLACE FUNCTION public.apply_default_business_rules()
RETURNS trigger AS $$
BEGIN
  -- Inserir regras padrão para o novo workspace baseado no módulo
  INSERT INTO public.workspace_business_rules (workspace_id, rule_template_id, is_enabled, custom_value)
  SELECT 
    NEW.id,
    brt.id,
    CASE WHEN brt.default_value::text = 'true' THEN true ELSE false END,
    brt.default_value
  FROM public.business_rule_templates brt
  JOIN public.business_rule_categories brc ON brt.category_id = brc.id
  WHERE brc.module_id = NEW.module_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para aplicar regras padrão automaticamente
CREATE TRIGGER apply_default_business_rules_trigger
  AFTER INSERT ON public.module_workspaces
  FOR EACH ROW EXECUTE FUNCTION public.apply_default_business_rules();

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION public.update_business_rule_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar timestamps
CREATE TRIGGER update_business_rule_categories_updated_at
  BEFORE UPDATE ON public.business_rule_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_business_rule_updated_at();

CREATE TRIGGER update_business_rule_templates_updated_at
  BEFORE UPDATE ON public.business_rule_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_business_rule_updated_at();

CREATE TRIGGER update_workspace_business_rules_updated_at
  BEFORE UPDATE ON public.workspace_business_rules
  FOR EACH ROW EXECUTE FUNCTION public.update_business_rule_updated_at();

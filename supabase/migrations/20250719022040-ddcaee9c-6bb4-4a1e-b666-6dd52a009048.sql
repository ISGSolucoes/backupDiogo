
-- Criar tabelas para o sistema modular
CREATE TABLE public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT '1.0.0',
  description TEXT,
  is_core BOOLEAN NOT NULL DEFAULT false,
  dependencies TEXT[] DEFAULT '{}',
  api_prefix TEXT,
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'manutencao')),
  config_schema JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(name),
  UNIQUE(type)
);

-- Tabela de workspaces por módulo
CREATE TABLE public.module_workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  configuration JSONB DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de templates de workflow
CREATE TABLE public.workflow_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  config JSONB DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de regras de negócio
CREATE TABLE public.business_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES module_workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  condition_type TEXT NOT NULL,
  condition_config JSONB DEFAULT '{}',
  action_config JSONB DEFAULT '{}',
  priority INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de permissões por módulo
CREATE TABLE public.module_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL,
  permissions JSONB DEFAULT '{}',
  area TEXT,
  cost_center TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  granted_by UUID,
  granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Tabela de feature flags
CREATE TABLE public.feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  flag_name TEXT NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  config JSONB DEFAULT '{}',
  environment TEXT NOT NULL DEFAULT 'production',
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(module_id, flag_name, environment)
);

-- Inserir módulos iniciais
INSERT INTO public.modules (name, type, version, description, is_core, dependencies, api_prefix, status) VALUES
('Core Services', 'core', '1.0.0', 'Serviços centrais: autenticação, usuários, permissões', true, '{}', '/api/core', 'ativo'),
('Gestão de Fornecedores', 'fornecedores', '1.0.0', 'Cadastro, qualificação e gestão de fornecedores', false, '{"core"}', '/api/fornecedores', 'ativo'),
('Requisições Internas', 'requisicoes', '1.0.0', 'Solicitações de compra entre áreas', false, '{"core"}', '/api/requisicoes', 'ativo'),
('Gestão de Pedidos', 'pedidos', '1.0.0', 'Criação e acompanhamento de pedidos de compra', false, '{"core", "fornecedores"}', '/api/pedidos', 'ativo');

-- Inserir workspace inicial
INSERT INTO public.module_workspaces (module_id, name, description, configuration, is_active)
SELECT id, 'Workspace Principal - ' || name, 'Configuração principal do módulo ' || name, '{}', true
FROM public.modules
WHERE type = 'core';

-- Inserir feature flag de exemplo
INSERT INTO public.feature_flags (module_id, flag_name, is_enabled, config, environment)
SELECT id, 'advanced_search', true, '{}', 'production'
FROM public.modules
WHERE type = 'fornecedores';

-- Habilitar RLS
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

-- Políticas RLS (permitindo acesso completo por enquanto)
CREATE POLICY "Permitir acesso completo aos módulos" 
ON public.modules FOR ALL 
USING (true) WITH CHECK (true);

CREATE POLICY "Permitir acesso completo aos workspaces" 
ON public.module_workspaces FOR ALL 
USING (true) WITH CHECK (true);

CREATE POLICY "Permitir acesso completo aos templates" 
ON public.workflow_templates FOR ALL 
USING (true) WITH CHECK (true);

CREATE POLICY "Permitir acesso completo às regras" 
ON public.business_rules FOR ALL 
USING (true) WITH CHECK (true);

CREATE POLICY "Permitir acesso completo às permissões" 
ON public.module_permissions FOR ALL 
USING (true) WITH CHECK (true);

CREATE POLICY "Permitir acesso completo às feature flags" 
ON public.feature_flags FOR ALL 
USING (true) WITH CHECK (true);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_module_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER trigger_update_modules_updated_at
  BEFORE UPDATE ON public.modules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_module_updated_at();

CREATE TRIGGER trigger_update_module_workspaces_updated_at
  BEFORE UPDATE ON public.module_workspaces
  FOR EACH ROW
  EXECUTE FUNCTION public.update_module_updated_at();

CREATE TRIGGER trigger_update_workflow_templates_updated_at
  BEFORE UPDATE ON public.workflow_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_module_updated_at();

CREATE TRIGGER trigger_update_business_rules_updated_at
  BEFORE UPDATE ON public.business_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_module_updated_at();

CREATE TRIGGER trigger_update_feature_flags_updated_at
  BEFORE UPDATE ON public.feature_flags
  FOR EACH ROW
  EXECUTE FUNCTION public.update_module_updated_at();

-- Índices para performance
CREATE INDEX idx_modules_type ON modules(type);
CREATE INDEX idx_modules_status ON modules(status);
CREATE INDEX idx_module_workspaces_module_id ON module_workspaces(module_id);
CREATE INDEX idx_feature_flags_module_id ON feature_flags(module_id);
CREATE INDEX idx_module_permissions_user_id ON module_permissions(user_id);
CREATE INDEX idx_module_permissions_module_id ON module_permissions(module_id);


-- Expandir tabela module_permissions para suportar permissões multicamadas
ALTER TABLE public.module_permissions 
ADD COLUMN functional_permissions JSONB DEFAULT '{}',
ADD COLUMN visibility_scope JSONB DEFAULT '{}',
ADD COLUMN category_access TEXT[] DEFAULT '{}',
ADD COLUMN unit_access TEXT[] DEFAULT '{}',
ADD COLUMN real_role TEXT,
ADD COLUMN notes TEXT;

-- Criar enum para ações funcionais por módulo
CREATE TYPE public.functional_action AS ENUM (
  -- Ações gerais
  'create', 'read', 'update', 'delete', 'approve', 'reject',
  -- Fornecedores
  'view_supplier_xray', 'suspend_supplier', 'approve_supplier', 'edit_supplier_data',
  'invite_supplier', 'evaluate_supplier', 'qualify_supplier',
  -- Requisições
  'create_requisition', 'view_all_requisitions', 'view_unit_requisitions', 
  'approve_requisition_l1', 'approve_requisition_l2', 'cancel_requisition',
  -- Sourcing
  'create_quotation', 'send_to_suppliers', 'track_responses', 'edit_quotation',
  'cancel_quotation', 'resubmit_quotation',
  -- Pedidos
  'create_order', 'approve_order', 'send_to_portal', 'track_order',
  'cancel_order', 'edit_order',
  -- Dashboards
  'view_global_dashboard', 'view_unit_dashboard', 'view_category_dashboard',
  'export_reports', 'view_analytics'
);

-- Criar enum para escopos de visibilidade
CREATE TYPE public.visibility_scope AS ENUM (
  'own_only', 'unit_only', 'category_only', 'area_only', 'all'
);

-- Tabela para templates de cargo (para facilitar configuração)
CREATE TABLE public.role_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  module_type TEXT NOT NULL,
  default_functional_permissions JSONB DEFAULT '{}',
  default_visibility_scope JSONB DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na nova tabela
ALTER TABLE public.role_templates ENABLE ROW LEVEL SECURITY;

-- Política RLS para role_templates
CREATE POLICY "Permitir acesso completo aos templates de cargo" 
ON public.role_templates FOR ALL 
USING (true) WITH CHECK (true);

-- Inserir templates de cargo padrão
INSERT INTO public.role_templates (name, description, module_type, default_functional_permissions, default_visibility_scope) VALUES
('Comprador Regional', 'Comprador responsável por categorias específicas em uma região', 'fornecedores', 
 '{"view_supplier_xray": true, "create_requisition": true, "create_quotation": true, "send_to_suppliers": true}',
 '{"suppliers": "category_only", "requisitions": "unit_only", "quotations": "own_only"}'),
 
('Gestor de Suprimentos', 'Gestor com visão ampla dos processos de compras', 'fornecedores',
 '{"view_supplier_xray": true, "approve_supplier": true, "approve_requisition_l1": true, "view_global_dashboard": true}',
 '{"suppliers": "all", "requisitions": "area_only", "dashboard": "area_only"}'),
 
('Aprovador Nível 1', 'Aprovador de primeiro nível para requisições', 'requisicoes',
 '{"approve_requisition_l1": true, "view_unit_requisitions": true}',
 '{"requisitions": "unit_only"}'),
 
('Aprovador Nível 2', 'Aprovador de segundo nível para requisições de alto valor', 'requisicoes',
 '{"approve_requisition_l2": true, "view_all_requisitions": true}',
 '{"requisitions": "all"}'),
 
('Analista de Sourcing', 'Responsável por processos de cotação e sourcing', 'sourcing',
 '{"create_quotation": true, "send_to_suppliers": true, "track_responses": true, "view_supplier_xray": true}',
 '{"quotations": "own_only", "suppliers": "category_only"}');

-- Função para aplicar template de cargo a um usuário
CREATE OR REPLACE FUNCTION public.apply_role_template(
  _user_id UUID,
  _module_id UUID,
  _template_id UUID,
  _category_access TEXT[] DEFAULT '{}',
  _unit_access TEXT[] DEFAULT '{}'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  template_record RECORD;
BEGIN
  -- Buscar o template
  SELECT * INTO template_record FROM public.role_templates WHERE id = _template_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Template não encontrado';
  END IF;
  
  -- Inserir ou atualizar permissão do usuário
  INSERT INTO public.module_permissions (
    module_id, user_id, role, functional_permissions, visibility_scope,
    category_access, unit_access, real_role
  ) VALUES (
    _module_id, _user_id, 'user', 
    template_record.default_functional_permissions,
    template_record.default_visibility_scope,
    _category_access, _unit_access, template_record.name
  )
  ON CONFLICT (module_id, user_id) 
  DO UPDATE SET
    functional_permissions = template_record.default_functional_permissions,
    visibility_scope = template_record.default_visibility_scope,
    category_access = _category_access,
    unit_access = _unit_access,
    real_role = template_record.name;
END;
$$;

-- Função para verificar permissão funcional específica
CREATE OR REPLACE FUNCTION public.has_functional_permission(
  _user_id UUID, 
  _module_id UUID, 
  _action TEXT
)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (mp.functional_permissions->>_action)::boolean, 
    false
  )
  FROM public.module_permissions mp
  WHERE mp.user_id = _user_id 
    AND mp.module_id = _module_id 
    AND mp.is_active = true;
$$;

-- Função para obter escopo de visibilidade
CREATE OR REPLACE FUNCTION public.get_visibility_scope(
  _user_id UUID, 
  _module_id UUID, 
  _context TEXT
)
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    mp.visibility_scope->>_context,
    'own_only'
  )
  FROM public.module_permissions mp
  WHERE mp.user_id = _user_id 
    AND mp.module_id = _module_id 
    AND mp.is_active = true;
$$;

-- Índices para performance
CREATE INDEX idx_module_permissions_functional ON module_permissions USING GIN (functional_permissions);
CREATE INDEX idx_module_permissions_visibility ON module_permissions USING GIN (visibility_scope);
CREATE INDEX idx_module_permissions_category_access ON module_permissions USING GIN (category_access);
CREATE INDEX idx_module_permissions_unit_access ON module_permissions USING GIN (unit_access);

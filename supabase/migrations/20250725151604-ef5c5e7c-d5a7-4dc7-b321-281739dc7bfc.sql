-- EMERGENCY SECURITY FIX: Remove public access and implement proper RLS policies

-- 1. DROP all existing permissive policies that allow public access
DROP POLICY IF EXISTS "Permitir acesso completo aos pedidos" ON public.pedidos;
DROP POLICY IF EXISTS "Permitir acesso completo aos itens" ON public.itens_pedido;
DROP POLICY IF EXISTS "Permitir acesso completo aos módulos" ON public.modules;
DROP POLICY IF EXISTS "Permitir acesso completo aos workspaces" ON public.module_workspaces;
DROP POLICY IF EXISTS "Permitir acesso completo às permissões" ON public.module_permissions;
DROP POLICY IF EXISTS "Permitir acesso completo aos templates de regras" ON public.business_rule_templates;
DROP POLICY IF EXISTS "Permitir acesso completo às regras de workspace" ON public.workspace_business_rules;
DROP POLICY IF EXISTS "Permitir acesso completo às regras" ON public.business_rules;
DROP POLICY IF EXISTS "Permitir acesso completo às feature flags" ON public.feature_flags;
DROP POLICY IF EXISTS "Permitir acesso completo aos templates de cargo" ON public.role_templates;
DROP POLICY IF EXISTS "Permitir acesso completo aos templates" ON public.template_acao_lote;
DROP POLICY IF EXISTS "Permitir acesso completo ao histórico de mudanças" ON public.business_rule_changes;
DROP POLICY IF EXISTS "Permitir acesso completo aos convites" ON public.convites_fornecedor;
DROP POLICY IF EXISTS "Permitir acesso completo aos contatos" ON public.contatos_fornecedor;
DROP POLICY IF EXISTS "Permitir acesso completo aos aceites" ON public.aceites_fornecedor;
DROP POLICY IF EXISTS "Permitir acesso completo aos relacionamentos" ON public.relacionamentos_clientes_fornecedores;
DROP POLICY IF EXISTS "Permitir acesso completo aos participantes" ON public.participantes_sourcing;
DROP POLICY IF EXISTS "Permitir acesso completo às ações recomendadas" ON public.acoes_recomendadas;
DROP POLICY IF EXISTS "Permitir acesso completo aos disparos por fornecedor" ON public.disparo_fornecedor;
DROP POLICY IF EXISTS "Permitir acesso completo aos comunicados" ON public.registro_comunicado;
DROP POLICY IF EXISTS "Permitir acesso completo às políticas de cliente" ON public.sourcing_client_policies;
DROP POLICY IF EXISTS "Permitir acesso completo às regras de setor" ON public.sourcing_sector_rules;

-- 2. CREATE proper authenticated-user-only policies for critical business tables

-- PEDIDOS (Orders) - Critical business data
CREATE POLICY "Authenticated users can view orders" 
ON public.pedidos FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can create orders" 
ON public.pedidos FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = criado_por);

CREATE POLICY "Authenticated users can update own orders" 
ON public.pedidos FOR UPDATE 
TO authenticated 
USING (auth.uid() = criado_por);

CREATE POLICY "Admins can manage all orders" 
ON public.pedidos FOR ALL 
TO authenticated 
USING (is_admin(auth.uid()));

-- ITENS_PEDIDO (Order Items)
CREATE POLICY "Authenticated users can view order items" 
ON public.itens_pedido FOR SELECT 
TO authenticated 
USING (EXISTS (
  SELECT 1 FROM public.pedidos p 
  WHERE p.id = pedido_id 
  AND (p.criado_por = auth.uid() OR is_admin(auth.uid()))
));

CREATE POLICY "Order creators can manage items" 
ON public.itens_pedido FOR ALL 
TO authenticated 
USING (EXISTS (
  SELECT 1 FROM public.pedidos p 
  WHERE p.id = pedido_id 
  AND p.criado_por = auth.uid()
));

-- MODULE_PERMISSIONS (User Permissions) - Admin only
CREATE POLICY "Only admins can view permissions" 
ON public.module_permissions FOR SELECT 
TO authenticated 
USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can manage permissions" 
ON public.module_permissions FOR ALL 
TO authenticated 
USING (is_admin(auth.uid()));

-- MODULES (System Modules) - Admin only
CREATE POLICY "Authenticated users can view active modules" 
ON public.modules FOR SELECT 
TO authenticated 
USING (status = 'ativo');

CREATE POLICY "Only admins can manage modules" 
ON public.modules FOR INSERT, UPDATE, DELETE 
TO authenticated 
USING (is_admin(auth.uid()));

-- BUSINESS_RULE_TEMPLATES - Admin only
CREATE POLICY "Authenticated users can view rule templates" 
ON public.business_rule_templates FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Only admins can manage rule templates" 
ON public.business_rule_templates FOR INSERT, UPDATE, DELETE 
TO authenticated 
USING (is_admin(auth.uid()));

-- WORKSPACE_BUSINESS_RULES - Admin only
CREATE POLICY "Authenticated users can view workspace rules" 
ON public.workspace_business_rules FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Only admins can manage workspace rules" 
ON public.workspace_business_rules FOR INSERT, UPDATE, DELETE 
TO authenticated 
USING (is_admin(auth.uid()));

-- FEATURE_FLAGS - Admin only
CREATE POLICY "Only admins can view feature flags" 
ON public.feature_flags FOR SELECT 
TO authenticated 
USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can manage feature flags" 
ON public.feature_flags FOR INSERT, UPDATE, DELETE 
TO authenticated 
USING (is_admin(auth.uid()));

-- ROLE_TEMPLATES - Admin only
CREATE POLICY "Only admins can view role templates" 
ON public.role_templates FOR SELECT 
TO authenticated 
USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can manage role templates" 
ON public.role_templates FOR INSERT, UPDATE, DELETE 
TO authenticated 
USING (is_admin(auth.uid()));

-- 3. Secure remaining tables with basic authentication requirements

-- CONVITES_FORNECEDOR - Require authentication
CREATE POLICY "Authenticated users can view supplier invites" 
ON public.convites_fornecedor FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can create supplier invites" 
ON public.convites_fornecedor FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = enviado_por);

-- CONTATOS_FORNECEDOR - Require authentication
CREATE POLICY "Authenticated users can view supplier contacts" 
ON public.contatos_fornecedor FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can manage supplier contacts" 
ON public.contatos_fornecedor FOR INSERT, UPDATE, DELETE 
TO authenticated 
USING (true);

-- TEMPLATE_ACAO_LOTE - Admin only
CREATE POLICY "Authenticated users can view action templates" 
ON public.template_acao_lote FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Only admins can manage action templates" 
ON public.template_acao_lote FOR INSERT, UPDATE, DELETE 
TO authenticated 
USING (is_admin(auth.uid()));

-- BUSINESS_RULE_CHANGES - Admin only
CREATE POLICY "Only admins can view rule changes" 
ON public.business_rule_changes FOR SELECT 
TO authenticated 
USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can create rule changes" 
ON public.business_rule_changes FOR INSERT 
TO authenticated 
WITH CHECK (is_admin(auth.uid()));

-- 4. Fix database functions security (search_path)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = _user_id
      AND ur.role = _role
      AND ur.is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT public.has_role(_user_id, 'admin');
$$;

CREATE OR REPLACE FUNCTION public.get_user_profile(_user_id uuid DEFAULT auth.uid())
RETURNS TABLE(id uuid, nome_completo text, email text, area text, cargo text, centro_custo text, telefone text, avatar_url text, status user_status, roles app_role[], pode_aprovar_nivel_1 boolean, pode_aprovar_nivel_2 boolean, limite_aprovacao numeric, pode_criar_requisicoes boolean, pode_ver_todos boolean)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT 
    p.id,
    p.nome_completo,
    p.email,
    p.area,
    p.cargo,
    p.centro_custo,
    p.telefone,
    p.avatar_url,
    p.status,
    ARRAY_AGG(DISTINCT ur.role) FILTER (WHERE ur.role IS NOT NULL) as roles,
    BOOL_OR(ur.role = 'aprovador_nivel_1' OR ur.role = 'gestor' OR ur.role = 'admin') as pode_aprovar_nivel_1,
    BOOL_OR(ur.role = 'aprovador_nivel_2' OR ur.role = 'gestor' OR ur.role = 'admin') as pode_aprovar_nivel_2,
    MAX(ur.limite_aprovacao) as limite_aprovacao,
    BOOL_OR(ur.role IN ('solicitante', 'aprovador_nivel_1', 'aprovador_nivel_2', 'gestor', 'admin')) as pode_criar_requisicoes,
    BOOL_OR(ur.role IN ('gestor', 'admin')) as pode_ver_todos
  FROM public.profiles p
  LEFT JOIN public.user_roles ur ON p.id = ur.user_id AND ur.is_active = true
  WHERE p.id = _user_id
  GROUP BY p.id, p.nome_completo, p.email, p.area, p.cargo, p.centro_custo, p.telefone, p.avatar_url, p.status;
$$;
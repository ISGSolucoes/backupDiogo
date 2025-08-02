-- EMERGENCY SECURITY FIX: Remove public access and implement proper RLS policies
-- Part 1: Remove dangerous public policies and add secure ones

-- DROP all existing permissive policies that allow public access
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

-- CREATE proper authenticated-user-only policies for critical business tables

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
USING (auth.uid() = criado_por)
WITH CHECK (auth.uid() = criado_por);

CREATE POLICY "Admins can manage all orders" 
ON public.pedidos FOR ALL 
TO authenticated 
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

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
  AND (p.criado_por = auth.uid() OR is_admin(auth.uid()))
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.pedidos p 
  WHERE p.id = pedido_id 
  AND (p.criado_por = auth.uid() OR is_admin(auth.uid()))
));

-- MODULE_PERMISSIONS (User Permissions) - Admin only
CREATE POLICY "Only admins can view permissions" 
ON public.module_permissions FOR SELECT 
TO authenticated 
USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can manage permissions" 
ON public.module_permissions FOR ALL 
TO authenticated 
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- MODULES (System Modules) - Admin only
CREATE POLICY "Authenticated users can view active modules" 
ON public.modules FOR SELECT 
TO authenticated 
USING (status = 'ativo');

CREATE POLICY "Only admins can manage modules" 
ON public.modules FOR INSERT 
TO authenticated 
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Only admins can update modules" 
ON public.modules FOR UPDATE 
TO authenticated 
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Only admins can delete modules" 
ON public.modules FOR DELETE 
TO authenticated 
USING (is_admin(auth.uid()));
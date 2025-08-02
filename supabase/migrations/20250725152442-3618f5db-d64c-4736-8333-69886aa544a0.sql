-- Phase 2: Fix remaining tables and secure remaining database functions

-- Add policies for remaining critical tables that were exposed
CREATE POLICY "Authenticated users can view workspace rules" 
ON public.workspace_business_rules FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Only admins can manage workspace rules" 
ON public.workspace_business_rules FOR INSERT 
TO authenticated 
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Only admins can update workspace rules" 
ON public.workspace_business_rules FOR UPDATE 
TO authenticated 
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Only admins can delete workspace rules" 
ON public.workspace_business_rules FOR DELETE 
TO authenticated 
USING (is_admin(auth.uid()));

-- BUSINESS_RULES
CREATE POLICY "Authenticated users can view business rules" 
ON public.business_rules FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Only admins can manage business rules" 
ON public.business_rules FOR INSERT 
TO authenticated 
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Only admins can update business rules" 
ON public.business_rules FOR UPDATE 
TO authenticated 
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Only admins can delete business rules" 
ON public.business_rules FOR DELETE 
TO authenticated 
USING (is_admin(auth.uid()));

-- FEATURE_FLAGS
CREATE POLICY "Only admins can view feature flags" 
ON public.feature_flags FOR SELECT 
TO authenticated 
USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can manage feature flags insert" 
ON public.feature_flags FOR INSERT 
TO authenticated 
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Only admins can manage feature flags update" 
ON public.feature_flags FOR UPDATE 
TO authenticated 
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Only admins can manage feature flags delete" 
ON public.feature_flags FOR DELETE 
TO authenticated 
USING (is_admin(auth.uid()));

-- ROLE_TEMPLATES
CREATE POLICY "Only admins can view role templates" 
ON public.role_templates FOR SELECT 
TO authenticated 
USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can manage role templates insert" 
ON public.role_templates FOR INSERT 
TO authenticated 
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Only admins can manage role templates update" 
ON public.role_templates FOR UPDATE 
TO authenticated 
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Only admins can manage role templates delete" 
ON public.role_templates FOR DELETE 
TO authenticated 
USING (is_admin(auth.uid()));

-- Secure remaining exposed tables with basic authentication
CREATE POLICY "Authenticated users can view supplier relationships" 
ON public.relacionamentos_clientes_fornecedores FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can manage supplier relationships insert" 
ON public.relacionamentos_clientes_fornecedores FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage supplier relationships update" 
ON public.relacionamentos_clientes_fornecedores FOR UPDATE 
TO authenticated 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage supplier relationships delete" 
ON public.relacionamentos_clientes_fornecedores FOR DELETE 
TO authenticated 
USING (auth.uid() IS NOT NULL);

-- ACEITES_FORNECEDOR
CREATE POLICY "Authenticated users can view supplier acceptances" 
ON public.aceites_fornecedor FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can create supplier acceptances" 
ON public.aceites_fornecedor FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() IS NOT NULL);

-- PARTICIPANTES_SOURCING
CREATE POLICY "Authenticated users can view sourcing participants" 
ON public.participantes_sourcing FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can manage sourcing participants insert" 
ON public.participantes_sourcing FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage sourcing participants update" 
ON public.participantes_sourcing FOR UPDATE 
TO authenticated 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage sourcing participants delete" 
ON public.participantes_sourcing FOR DELETE 
TO authenticated 
USING (auth.uid() IS NOT NULL);

-- ACOES_RECOMENDADAS
CREATE POLICY "Authenticated users can view recommended actions" 
ON public.acoes_recomendadas FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can manage recommended actions insert" 
ON public.acoes_recomendadas FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage recommended actions update" 
ON public.acoes_recomendadas FOR UPDATE 
TO authenticated 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage recommended actions delete" 
ON public.acoes_recomendadas FOR DELETE 
TO authenticated 
USING (auth.uid() IS NOT NULL);

-- DISPARO_FORNECEDOR
CREATE POLICY "Authenticated users can view supplier dispatches" 
ON public.disparo_fornecedor FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can manage supplier dispatches insert" 
ON public.disparo_fornecedor FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage supplier dispatches update" 
ON public.disparo_fornecedor FOR UPDATE 
TO authenticated 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage supplier dispatches delete" 
ON public.disparo_fornecedor FOR DELETE 
TO authenticated 
USING (auth.uid() IS NOT NULL);

-- REGISTRO_COMUNICADO
CREATE POLICY "Authenticated users can view communications" 
ON public.registro_comunicado FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can manage communications insert" 
ON public.registro_comunicado FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage communications update" 
ON public.registro_comunicado FOR UPDATE 
TO authenticated 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage communications delete" 
ON public.registro_comunicado FOR DELETE 
TO authenticated 
USING (auth.uid() IS NOT NULL);

-- SOURCING_CLIENT_POLICIES
CREATE POLICY "Authenticated users can view client policies" 
ON public.sourcing_client_policies FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Only admins can manage client policies insert" 
ON public.sourcing_client_policies FOR INSERT 
TO authenticated 
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Only admins can manage client policies update" 
ON public.sourcing_client_policies FOR UPDATE 
TO authenticated 
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Only admins can manage client policies delete" 
ON public.sourcing_client_policies FOR DELETE 
TO authenticated 
USING (is_admin(auth.uid()));

-- SOURCING_SECTOR_RULES
CREATE POLICY "Authenticated users can view sector rules" 
ON public.sourcing_sector_rules FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Only admins can manage sector rules insert" 
ON public.sourcing_sector_rules FOR INSERT 
TO authenticated 
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Only admins can manage sector rules update" 
ON public.sourcing_sector_rules FOR UPDATE 
TO authenticated 
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Only admins can manage sector rules delete" 
ON public.sourcing_sector_rules FOR DELETE 
TO authenticated 
USING (is_admin(auth.uid()));
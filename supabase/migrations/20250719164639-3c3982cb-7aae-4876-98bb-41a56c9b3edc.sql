-- Sistema de Governança e Auditoria Avançada

-- 1. Tabela para Super Admins (SourceXpress)
CREATE TABLE public.platform_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  level TEXT NOT NULL DEFAULT 'super_admin', -- super_admin, platform_support
  granted_by UUID,
  granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  revoked_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  permissions JSONB DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Tabela de Auditoria Global (imutável)
CREATE TABLE public.global_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL, -- config_change, permission_grant, module_toggle, critical_action
  action TEXT NOT NULL,
  user_id UUID NOT NULL,
  user_type TEXT NOT NULL, -- super_admin, client_admin, user
  workspace_id UUID,
  module_id UUID,
  target_table TEXT,
  target_id UUID,
  old_data JSONB,
  new_data JSONB,
  risk_level TEXT NOT NULL DEFAULT 'low', -- low, medium, high, critical
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  -- Campos para prevenção de alteração
  hash_verificacao TEXT,
  assinatura_digital TEXT
);

-- 3. Tabela de Configurações Protegidas
CREATE TABLE public.protected_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  protection_level TEXT NOT NULL DEFAULT 'medium', -- low, medium, high, critical
  requires_confirmation BOOLEAN DEFAULT false,
  requires_super_admin BOOLEAN DEFAULT false,
  last_changed_by UUID,
  last_changed_at TIMESTAMP WITH TIME ZONE,
  change_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Tabela de Intervenções do SourceXpress
CREATE TABLE public.platform_interventions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intervention_type TEXT NOT NULL, -- ghost_access, config_fix, emergency_block, audit_export
  super_admin_id UUID NOT NULL,
  target_workspace_id UUID,
  target_user_id UUID,
  reason TEXT NOT NULL,
  actions_taken JSONB,
  client_notified BOOLEAN DEFAULT false,
  notification_sent_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  impact_level TEXT NOT NULL DEFAULT 'low',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. Tabela de Alertas de Segurança
CREATE TABLE public.security_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type TEXT NOT NULL, -- suspicious_activity, config_tampering, mass_changes, failed_access
  severity TEXT NOT NULL DEFAULT 'medium', -- low, medium, high, critical
  workspace_id UUID,
  user_id UUID,
  description TEXT NOT NULL,
  details JSONB,
  auto_resolved BOOLEAN DEFAULT false,
  resolved_by UUID,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inserir configurações protegidas padrão
INSERT INTO public.protected_settings (setting_key, setting_value, protection_level, requires_super_admin) VALUES
('system.audit_retention_days', '{"value": 2555}', 'critical', true),
('system.allow_audit_deletion', '{"value": false}', 'critical', true),
('workspace.max_admin_users', '{"value": 3}', 'high', false),
('security.force_2fa_admins', '{"value": true}', 'high', false),
('compliance.mandatory_approval_chain', '{"value": true}', 'high', false);

-- Função para registrar auditoria automática
CREATE OR REPLACE FUNCTION public.register_audit_event(
  p_event_type TEXT,
  p_action TEXT,
  p_user_id UUID,
  p_user_type TEXT,
  p_workspace_id UUID DEFAULT NULL,
  p_module_id UUID DEFAULT NULL,
  p_target_table TEXT DEFAULT NULL,
  p_target_id UUID DEFAULT NULL,
  p_old_data JSONB DEFAULT NULL,
  p_new_data JSONB DEFAULT NULL,
  p_risk_level TEXT DEFAULT 'low'
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  audit_id UUID;
BEGIN
  INSERT INTO public.global_audit_log (
    event_type, action, user_id, user_type, workspace_id, module_id,
    target_table, target_id, old_data, new_data, risk_level,
    ip_address, user_agent, session_id
  ) VALUES (
    p_event_type, p_action, p_user_id, p_user_type, p_workspace_id, p_module_id,
    p_target_table, p_target_id, p_old_data, p_new_data, p_risk_level,
    inet_client_addr(), 
    current_setting('application_name', true),
    current_setting('jwt.claims.session_id', true)
  ) RETURNING id INTO audit_id;
  
  RETURN audit_id;
END;
$$;

-- Função para verificar se usuário é Super Admin
CREATE OR REPLACE FUNCTION public.is_super_admin(p_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.platform_admins
    WHERE user_id = p_user_id 
      AND is_active = true 
      AND revoked_at IS NULL
  );
$$;

-- Função para verificar permissões de configuração
CREATE OR REPLACE FUNCTION public.can_change_setting(p_setting_key TEXT, p_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
DECLARE
  setting_record RECORD;
  user_is_super BOOLEAN;
BEGIN
  -- Buscar configuração
  SELECT * INTO setting_record FROM public.protected_settings WHERE setting_key = p_setting_key;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Verificar se é super admin
  user_is_super := public.is_super_admin(p_user_id);
  
  -- Se requer super admin e usuário não é, negar
  IF setting_record.requires_super_admin AND NOT user_is_super THEN
    RETURN false;
  END IF;
  
  -- Se é crítico e não é super admin, negar
  IF setting_record.protection_level = 'critical' AND NOT user_is_super THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$;

-- Trigger para auditoria automática em mudanças críticas
CREATE OR REPLACE FUNCTION public.audit_critical_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Auditar mudanças em permissões de módulo
  IF TG_TABLE_NAME = 'module_permissions' THEN
    PERFORM public.register_audit_event(
      'permission_change',
      CASE WHEN TG_OP = 'INSERT' THEN 'permission_granted'
           WHEN TG_OP = 'UPDATE' THEN 'permission_modified'
           WHEN TG_OP = 'DELETE' THEN 'permission_revoked'
      END,
      COALESCE(NEW.user_id, OLD.user_id),
      'system',
      NULL,
      COALESCE(NEW.module_id, OLD.module_id),
      TG_TABLE_NAME,
      COALESCE(NEW.id, OLD.id),
      CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE row_to_json(OLD) END,
      CASE WHEN TG_OP = 'INSERT' THEN row_to_json(NEW) ELSE row_to_json(NEW) END,
      'high'
    );
  END IF;
  
  -- Auditar mudanças em regras de negócio
  IF TG_TABLE_NAME = 'workspace_business_rules' THEN
    PERFORM public.register_audit_event(
      'config_change',
      'business_rule_changed',
      auth.uid(),
      'client_admin',
      NEW.workspace_id,
      NULL,
      TG_TABLE_NAME,
      COALESCE(NEW.id, OLD.id),
      row_to_json(OLD),
      row_to_json(NEW),
      'medium'
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Aplicar triggers
CREATE TRIGGER audit_module_permissions_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.module_permissions
  FOR EACH ROW EXECUTE FUNCTION public.audit_critical_changes();

CREATE TRIGGER audit_business_rules_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.workspace_business_rules
  FOR EACH ROW EXECUTE FUNCTION public.audit_critical_changes();

-- RLS Policies
ALTER TABLE public.platform_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.protected_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_alerts ENABLE ROW LEVEL SECURITY;

-- Somente Super Admins podem ver platform_admins
CREATE POLICY "Super admins can manage platform admins" 
  ON public.platform_admins FOR ALL 
  USING (public.is_super_admin(auth.uid()));

-- Audit log é apenas leitura para admins
CREATE POLICY "Admins can read audit logs" 
  ON public.global_audit_log FOR SELECT 
  USING (public.is_admin(auth.uid()) OR public.is_super_admin(auth.uid()));

-- Sistema pode inserir em audit log
CREATE POLICY "System can insert audit logs" 
  ON public.global_audit_log FOR INSERT 
  WITH CHECK (true);

-- Protected settings
CREATE POLICY "Admins can read protected settings" 
  ON public.protected_settings FOR SELECT 
  USING (public.is_admin(auth.uid()) OR public.is_super_admin(auth.uid()));

CREATE POLICY "Super admins can modify protected settings" 
  ON public.protected_settings FOR ALL 
  USING (public.is_super_admin(auth.uid()));

-- Platform interventions
CREATE POLICY "Super admins can manage interventions" 
  ON public.platform_interventions FOR ALL 
  USING (public.is_super_admin(auth.uid()));

-- Security alerts
CREATE POLICY "Admins can see security alerts" 
  ON public.security_alerts FOR SELECT 
  USING (public.is_admin(auth.uid()) OR public.is_super_admin(auth.uid()));

CREATE POLICY "System can create security alerts" 
  ON public.security_alerts FOR INSERT 
  WITH CHECK (true);

-- Indexes para performance
CREATE INDEX idx_audit_log_user_id ON public.global_audit_log(user_id);
CREATE INDEX idx_audit_log_workspace_id ON public.global_audit_log(workspace_id);
CREATE INDEX idx_audit_log_created_at ON public.global_audit_log(created_at);
CREATE INDEX idx_audit_log_risk_level ON public.global_audit_log(risk_level);
CREATE INDEX idx_security_alerts_workspace ON public.security_alerts(workspace_id);
CREATE INDEX idx_platform_admins_user_id ON public.platform_admins(user_id);
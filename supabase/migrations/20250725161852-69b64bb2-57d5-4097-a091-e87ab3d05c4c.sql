-- Fix Function Search Path Mutable vulnerabilities
-- Add SET search_path = public to all vulnerable functions

-- 1. Fix gerar_numero_pedido
CREATE OR REPLACE FUNCTION public.gerar_numero_pedido()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
DECLARE
  novo_numero VARCHAR(20);
  contador INTEGER;
BEGIN
  -- Buscar o próximo número sequencial para o ano atual
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(numero_pedido FROM 'PO-' || EXTRACT(YEAR FROM NOW())::text || '-(.*)') AS INTEGER)
  ), 0) + 1
  INTO contador
  FROM public.pedidos
  WHERE numero_pedido LIKE 'PO-' || EXTRACT(YEAR FROM NOW())::text || '-%';
  
  -- Gerar número no formato PO-YYYY-NNNNNN
  novo_numero := 'PO-' || EXTRACT(YEAR FROM NOW())::text || '-' || LPAD(contador::text, 6, '0');
  
  NEW.numero_pedido := novo_numero;
  RETURN NEW;
END;
$function$;

-- 2. Fix atualizar_valor_total_pedido
CREATE OR REPLACE FUNCTION public.atualizar_valor_total_pedido()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  -- Atualizar valor total do pedido
  UPDATE public.pedidos 
  SET valor_total = (
    SELECT COALESCE(SUM(valor_total), 0)
    FROM public.itens_pedido 
    WHERE pedido_id = COALESCE(NEW.pedido_id, OLD.pedido_id)
  ),
  updated_at = NOW()
  WHERE id = COALESCE(NEW.pedido_id, OLD.pedido_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- 3. Fix has_role (CRITICAL)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.profiles p ON ur.user_id = p.id
    WHERE p.id = _user_id
      AND ur.role = _role
      AND ur.is_active = true
      AND (ur.data_fim IS NULL OR ur.data_fim >= CURRENT_DATE)
  );
$function$;

-- 4. Fix is_admin (CRITICAL)
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = public
AS $function$
  SELECT public.has_role(_user_id, 'admin');
$function$;

-- 5. Fix get_user_profile (CRITICAL)
CREATE OR REPLACE FUNCTION public.get_user_profile(_user_id uuid DEFAULT auth.uid())
 RETURNS TABLE(id uuid, nome_completo text, email text, area text, cargo text, centro_custo text, telefone text, avatar_url text, status user_status, roles app_role[], pode_aprovar_nivel_1 boolean, pode_aprovar_nivel_2 boolean, limite_aprovacao numeric, pode_criar_requisicoes boolean, pode_ver_todos boolean)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = public
AS $function$
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
$function$;

-- 6. Fix handle_new_user (CRITICAL)
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (
    id, 
    nome_completo, 
    email,
    area
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome_completo', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'area', 'Não Definido')
  );
  
  -- Dar papel de solicitante por padrão
  INSERT INTO public.user_roles (user_id, role) 
  VALUES (NEW.id, 'solicitante');
  
  RETURN NEW;
END;
$function$;

-- 7. Fix is_super_admin
CREATE OR REPLACE FUNCTION public.is_super_admin(p_user_id uuid DEFAULT auth.uid())
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.platform_admins
    WHERE user_id = p_user_id 
      AND is_active = true 
      AND revoked_at IS NULL
  );
$function$;

-- 8. Fix apply_role_template
CREATE OR REPLACE FUNCTION public.apply_role_template(_user_id uuid, _module_id uuid, _template_id uuid, _category_access text[] DEFAULT '{}'::text[], _unit_access text[] DEFAULT '{}'::text[])
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
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
$function$;

-- 9. Fix has_functional_permission
CREATE OR REPLACE FUNCTION public.has_functional_permission(_user_id uuid, _module_id uuid, _action text)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = public
AS $function$
  SELECT COALESCE(
    (mp.functional_permissions->>_action)::boolean, 
    false
  )
  FROM public.module_permissions mp
  WHERE mp.user_id = _user_id 
    AND mp.module_id = _module_id 
    AND mp.is_active = true;
$function$;

-- 10. Fix get_visibility_scope
CREATE OR REPLACE FUNCTION public.get_visibility_scope(_user_id uuid, _module_id uuid, _context text)
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = public
AS $function$
  SELECT COALESCE(
    mp.visibility_scope->>_context,
    'own_only'
  )
  FROM public.module_permissions mp
  WHERE mp.user_id = _user_id 
    AND mp.module_id = _module_id 
    AND mp.is_active = true;
$function$;

-- Fix all update triggers
CREATE OR REPLACE FUNCTION public.update_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_fornecedores_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_contatos_fornecedor_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_unidades_operacionais_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_categorias_fornecimento_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_relacionamentos_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_convites_fornecedor_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_sourcing_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_requisicao_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_module_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_business_rule_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_job_roles_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_template_acao_lote_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_biblioteca_documentos_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_orcamento_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;
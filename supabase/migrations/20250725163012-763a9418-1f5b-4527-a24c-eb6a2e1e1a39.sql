-- Fix remaining functions with mutable search_path vulnerability
-- Adding SET search_path = public to all remaining vulnerable functions

-- Fix validate_single_principal_contact
CREATE OR REPLACE FUNCTION public.validate_single_principal_contact()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  -- Se está marcando como principal, remove principal dos outros
  IF NEW.principal = true THEN
    UPDATE public.contatos_fornecedor 
    SET principal = false 
    WHERE fornecedor_id = NEW.fornecedor_id AND id != NEW.id AND principal = true;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Fix validate_single_principal_unit
CREATE OR REPLACE FUNCTION public.validate_single_principal_unit()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  -- Se está marcando como principal, remove principal das outras
  IF NEW.principal = true THEN
    UPDATE public.unidades_operacionais 
    SET principal = false 
    WHERE fornecedor_id = NEW.fornecedor_id AND id != NEW.id AND principal = true;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Fix create_portal_user
CREATE OR REPLACE FUNCTION public.create_portal_user(p_cadastro_id uuid, p_email text, p_password text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  user_id UUID;
  password_hash TEXT;
BEGIN
  -- Gerar hash da senha (simplificado para demo)
  password_hash := crypt(p_password, gen_salt('bf'));
  
  -- Inserir usuário
  INSERT INTO public.portal_fornecedor_users (
    cadastro_fornecedor_id, email, password_hash
  ) VALUES (
    p_cadastro_id, p_email, password_hash
  ) RETURNING id INTO user_id;
  
  -- Atualizar status do cadastro
  UPDATE public.cadastro_fornecedores 
  SET status_cadastro = 'cadastrado'
  WHERE id = p_cadastro_id;
  
  RETURN user_id;
END;
$function$;

-- Fix validate_portal_login
CREATE OR REPLACE FUNCTION public.validate_portal_login(p_email text, p_password text)
 RETURNS TABLE(user_id uuid, cadastro_id uuid, is_valid boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.cadastro_fornecedor_id,
    CASE 
      WHEN u.password_hash = crypt(p_password, u.password_hash) THEN true
      ELSE false
    END as is_valid
  FROM public.portal_fornecedor_users u
  WHERE u.email = p_email AND u.status = 'ativo';
END;
$function$;

-- Fix gerar_codigo_sourcing
CREATE OR REPLACE FUNCTION public.gerar_codigo_sourcing()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
DECLARE
  novo_codigo VARCHAR(50);
  contador INTEGER;
BEGIN
  -- Buscar o próximo número sequencial para o ano atual
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(codigo_projeto FROM 'SRC-' || EXTRACT(YEAR FROM NOW())::text || '-(.*)') AS INTEGER)
  ), 0) + 1
  INTO contador
  FROM public.projetos_sourcing
  WHERE codigo_projeto LIKE 'SRC-' || EXTRACT(YEAR FROM NOW())::text || '-%';
  
  -- Gerar código no formato SRC-YYYY-NNNNNN
  novo_codigo := 'SRC-' || EXTRACT(YEAR FROM NOW())::text || '-' || LPAD(contador::text, 6, '0');
  
  NEW.codigo_projeto := novo_codigo;
  RETURN NEW;
END;
$function$;

-- Fix gerar_numero_requisicao
CREATE OR REPLACE FUNCTION public.gerar_numero_requisicao()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
DECLARE
  novo_numero VARCHAR(50);
  contador INTEGER;
BEGIN
  -- Buscar o próximo número sequencial para o ano atual
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(numero_requisicao FROM 'REQ-' || EXTRACT(YEAR FROM NOW())::text || '-(.*)') AS INTEGER)
  ), 0) + 1
  INTO contador
  FROM public.requisicoes
  WHERE numero_requisicao LIKE 'REQ-' || EXTRACT(YEAR FROM NOW())::text || '-%';
  
  -- Gerar número no formato REQ-YYYY-NNNNNN
  novo_numero := 'REQ-' || EXTRACT(YEAR FROM NOW())::text || '-' || LPAD(contador::text, 6, '0');
  
  NEW.numero_requisicao := novo_numero;
  RETURN NEW;
END;
$function$;

-- Fix calcular_valor_total_item
CREATE OR REPLACE FUNCTION public.calcular_valor_total_item()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.valor_total_estimado := NEW.quantidade * NEW.preco_estimado;
  RETURN NEW;
END;
$function$;

-- Fix atualizar_valor_total_requisicao
CREATE OR REPLACE FUNCTION public.atualizar_valor_total_requisicao()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  -- Atualizar valor estimado da requisição
  UPDATE public.requisicoes 
  SET valor_estimado = (
    SELECT COALESCE(SUM(valor_total_estimado), 0)
    FROM public.itens_requisicao 
    WHERE requisicao_id = COALESCE(NEW.requisicao_id, OLD.requisicao_id)
  ),
  updated_at = NOW()
  WHERE id = COALESCE(NEW.requisicao_id, OLD.requisicao_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Fix registrar_historico_pedido
CREATE OR REPLACE FUNCTION public.registrar_historico_pedido()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  -- Registrar no histórico apenas mudanças de status
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.historico_pedido (
      pedido_id, evento, status_anterior, status_novo,
      dados_anteriores, dados_novos, usuario_id, origem
    ) VALUES (
      NEW.id, 'status_alterado', OLD.status::text, NEW.status::text,
      row_to_json(OLD), row_to_json(NEW), NEW.criado_por, 'web'
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Fix registrar_historico_requisicao
CREATE OR REPLACE FUNCTION public.registrar_historico_requisicao()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  -- Registrar mudanças de status
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.historico_requisicao (
      requisicao_id, evento, status_anterior, status_novo,
      dados_anteriores, dados_novos, usuario_nome, origem
    ) VALUES (
      NEW.id, 'status_alterado', OLD.status::text, NEW.status::text,
      row_to_json(OLD), row_to_json(NEW), 
      COALESCE(NEW.aprovador_atual_nome, 'Sistema'), 'sistema'
    );
  END IF;
  
  -- Registrar criação
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.historico_requisicao (
      requisicao_id, evento, descricao, usuario_nome, origem
    ) VALUES (
      NEW.id, 'requisicao_criada', 
      'Requisição criada: ' || NEW.titulo,
      NEW.solicitante_nome, 'web'
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Fix registrar_acao_pedido
CREATE OR REPLACE FUNCTION public.registrar_acao_pedido(pedido_id_param uuid, acao text, usuario_id_param uuid, usuario_nome text, detalhes text DEFAULT NULL::text)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
DECLARE
  nova_acao jsonb;
  historico_atual jsonb;
BEGIN
  -- Criar nova ação
  nova_acao := jsonb_build_object(
    'timestamp', now(),
    'acao', acao,
    'usuario_id', usuario_id_param,
    'usuario_nome', usuario_nome,
    'detalhes', detalhes
  );
  
  -- Buscar histórico atual
  SELECT COALESCE(historico_acoes, '[]'::jsonb) INTO historico_atual 
  FROM public.pedidos WHERE id = pedido_id_param;
  
  -- Adicionar nova ação ao histórico
  UPDATE public.pedidos 
  SET historico_acoes = historico_atual || nova_acao,
      updated_at = now()
  WHERE id = pedido_id_param;
END;
$function$;

-- Fix apply_default_business_rules
CREATE OR REPLACE FUNCTION public.apply_default_business_rules()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  -- Inserir regras padrão para o novo workspace baseado no módulo
  INSERT INTO public.workspace_business_rules (workspace_id, rule_template_id, is_enabled, custom_value, configured_at)
  SELECT 
    NEW.id,
    brt.id,
    CASE 
      WHEN brt.rule_type = 'boolean' AND brt.default_value::text = 'true' THEN true 
      ELSE false 
    END,
    brt.default_value,
    NOW()
  FROM public.business_rule_templates brt
  JOIN public.business_rule_categories brc ON brt.category_id = brc.id
  WHERE brc.module_id = NEW.module_id;
  
  RETURN NEW;
END;
$function$;

-- Fix register_audit_event
CREATE OR REPLACE FUNCTION public.register_audit_event(p_event_type text, p_action text, p_user_id uuid, p_user_type text, p_workspace_id uuid DEFAULT NULL::uuid, p_module_id uuid DEFAULT NULL::uuid, p_target_table text DEFAULT NULL::text, p_target_id uuid DEFAULT NULL::uuid, p_old_data jsonb DEFAULT NULL::jsonb, p_new_data jsonb DEFAULT NULL::jsonb, p_risk_level text DEFAULT 'low'::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
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
$function$;

-- Fix can_change_setting
CREATE OR REPLACE FUNCTION public.can_change_setting(p_setting_key text, p_user_id uuid DEFAULT auth.uid())
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path = public
AS $function$
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
$function$;

-- Fix audit_critical_changes
CREATE OR REPLACE FUNCTION public.audit_critical_changes()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
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
$function$;

-- Fix apply_job_role_permissions
CREATE OR REPLACE FUNCTION public.apply_job_role_permissions(user_id uuid, job_role_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  role_record RECORD;
  module_record RECORD;
BEGIN
  -- Buscar o cargo
  SELECT * INTO role_record FROM public.job_roles WHERE id = job_role_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Cargo não encontrado';
  END IF;
  
  -- Limpar permissões existentes
  DELETE FROM public.module_permissions WHERE user_id = apply_job_role_permissions.user_id;
  
  -- Aplicar permissões para cada módulo ativo
  FOR module_record IN SELECT * FROM public.modules WHERE status = 'ativo' LOOP
    INSERT INTO public.module_permissions (
      module_id, user_id, role, functional_permissions, visibility_scope, real_role
    ) VALUES (
      module_record.id, 
      apply_job_role_permissions.user_id, 
      'user',
      role_record.permissions_template,
      role_record.visibility_scope,
      role_record.name
    );
  END LOOP;
  
  -- Atualizar profile
  UPDATE public.profiles 
  SET job_role_id = apply_job_role_permissions.job_role_id,
      updated_at = now()
  WHERE id = apply_job_role_permissions.user_id;
END;
$function$;

-- Fix get_effective_permissions
CREATE OR REPLACE FUNCTION public.get_effective_permissions(user_id uuid, module_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  base_permissions JSONB := '{}';
  override_record RECORD;
  result_permissions JSONB;
BEGIN
  -- Buscar permissões base do cargo
  SELECT mp.functional_permissions INTO base_permissions
  FROM public.module_permissions mp
  WHERE mp.user_id = get_effective_permissions.user_id 
    AND mp.module_id = get_effective_permissions.module_id;
  
  result_permissions := COALESCE(base_permissions, '{}');
  
  -- Aplicar overrides
  FOR override_record IN 
    SELECT action_key, override_value 
    FROM public.permission_overrides 
    WHERE user_id = get_effective_permissions.user_id 
      AND module_id = get_effective_permissions.module_id
      AND (expires_at IS NULL OR expires_at > now())
  LOOP
    result_permissions := jsonb_set(
      result_permissions, 
      ARRAY[override_record.action_key], 
      to_jsonb(override_record.override_value)
    );
  END LOOP;
  
  RETURN result_permissions;
END;
$function$;

-- Fix criar_po_automatico
CREATE OR REPLACE FUNCTION public.criar_po_automatico(p_origem text, p_origem_id uuid, p_fornecedor_id text DEFAULT NULL::text, p_fornecedor_cnpj text DEFAULT NULL::text, p_fornecedor_nome text DEFAULT NULL::text, p_solicitante_id uuid DEFAULT NULL::uuid, p_centro_custo text DEFAULT NULL::text, p_projeto text DEFAULT NULL::text, p_data_entrega_prevista date DEFAULT NULL::date, p_itens jsonb DEFAULT '[]'::jsonb, p_observacoes text DEFAULT NULL::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  novo_pedido_id uuid;
  item_record jsonb;
  sequencia_item integer := 1;
BEGIN
  -- Inserir pedido principal
  INSERT INTO public.pedidos (
    origem_demanda,
    fornecedor_id,
    fornecedor_cnpj,
    fornecedor_razao_social,
    criado_por,
    centro_custo,
    projeto_atividade,
    data_entrega_prevista,
    observacoes,
    status,
    tipo,
    moeda,
    valor_total
  ) VALUES (
    p_origem,
    p_fornecedor_id,
    p_fornecedor_cnpj,
    p_fornecedor_nome,
    p_solicitante_id,
    p_centro_custo,
    p_projeto,
    p_data_entrega_prevista,
    p_observacoes,
    'rascunho'::status_pedido,
    'material'::tipo_pedido,
    'BRL',
    0
  )
  RETURNING id INTO novo_pedido_id;

  -- Inserir itens do pedido
  FOR item_record IN SELECT * FROM jsonb_array_elements(p_itens)
  LOOP
    INSERT INTO public.itens_pedido (
      pedido_id,
      sequencia,
      descricao,
      especificacao,
      quantidade,
      unidade,
      preco_unitario,
      valor_total,
      codigo_produto,
      categoria_familia,
      centro_custo_item
    ) VALUES (
      novo_pedido_id,
      sequencia_item,
      item_record->>'descricao',
      item_record->>'especificacao',
      (item_record->>'quantidade')::numeric,
      item_record->>'unidade',
      COALESCE((item_record->>'preco_unitario')::numeric, 0),
      COALESCE((item_record->>'quantidade')::numeric, 0) * COALESCE((item_record->>'preco_unitario')::numeric, 0),
      item_record->>'codigo_produto',
      item_record->>'categoria',
      COALESCE(item_record->>'centro_custo', p_centro_custo)
    );
    
    sequencia_item := sequencia_item + 1;
  END LOOP;

  -- Registrar ação no histórico
  PERFORM public.registrar_acao_pedido(
    novo_pedido_id,
    'Pedido criado automaticamente via ' || p_origem,
    p_solicitante_id,
    'Sistema Automático',
    'Origem: ' || p_origem || ' (ID: ' || p_origem_id::text || ')'
  );

  RETURN novo_pedido_id;
END;
$function$;

-- Fix criar_po_manual
CREATE OR REPLACE FUNCTION public.criar_po_manual(p_dados_pedido jsonb, p_itens jsonb, p_usuario_id uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  pedido_id uuid;
BEGIN
  -- Validar dados obrigatórios
  IF p_dados_pedido->>'fornecedor_id' IS NULL THEN
    RAISE EXCEPTION 'Fornecedor é obrigatório para criação manual de pedido';
  END IF;

  -- Criar pedido usando função padrão
  SELECT public.criar_po_automatico(
    'manual',
    gen_random_uuid(),
    p_dados_pedido->>'fornecedor_id',
    p_dados_pedido->>'fornecedor_cnpj',
    p_dados_pedido->>'fornecedor_nome',
    p_usuario_id,
    p_dados_pedido->>'centro_custo',
    p_dados_pedido->>'projeto',
    (p_dados_pedido->>'data_entrega_prevista')::date,
    p_itens,
    p_dados_pedido->>'observacoes'
  ) INTO pedido_id;

  RETURN pedido_id;
END;
$function$;

-- Fix processar_requisicao_aprovada
CREATE OR REPLACE FUNCTION public.processar_requisicao_aprovada()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
DECLARE
  requisicao_data record;
  itens_requisicao jsonb;
  pedido_id uuid;
BEGIN
  -- Verificar se status mudou para aprovada e deve pular sourcing
  IF NEW.status = 'aprovada' AND OLD.status != 'aprovada' THEN
    
    -- Buscar dados da requisição
    SELECT 
      solicitante_id,
      centro_custo,
      valor_estimado,
      data_necessidade,
      observacoes
    INTO requisicao_data
    FROM public.requisicoes 
    WHERE id = NEW.id;

    -- Buscar itens da requisição
    SELECT jsonb_agg(
      jsonb_build_object(
        'descricao', ir.descricao,
        'especificacao', ir.especificacao_tecnica,
        'quantidade', ir.quantidade,
        'unidade', ir.unidade_medida,
        'preco_unitario', ir.preco_estimado,
        'codigo_produto', ir.codigo_produto,
        'categoria', ir.categoria
      )
    ) INTO itens_requisicao
    FROM public.itens_requisicao ir
    WHERE ir.requisicao_id = NEW.id;

    -- Criar pedido automaticamente (apenas se não foi para sourcing)
    -- Verificar se deve pular sourcing baseado em valor ou configuração
    IF NEW.observacoes ILIKE '%pular_sourcing%' OR NEW.valor_estimado < 1000 THEN
      SELECT public.criar_po_automatico(
        'requisicao',
        NEW.id,
        NULL, -- fornecedor será definido manualmente
        NULL,
        NULL,
        requisicao_data.solicitante_id,
        requisicao_data.centro_custo,
        NULL,
        requisicao_data.data_necessidade,
        COALESCE(itens_requisicao, '[]'::jsonb),
        'Pedido gerado automaticamente da requisição aprovada'
      ) INTO pedido_id;

      -- Log da criação
      RAISE NOTICE 'Pedido % criado automaticamente da requisição %', pedido_id, NEW.id;
    END IF;
    
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Fix should_apply_budget_control
CREATE OR REPLACE FUNCTION public.should_apply_budget_control(p_tipo_requisicao tipo_requisicao, p_valor_estimado numeric, p_centro_custo character varying, p_categoria character varying DEFAULT NULL::character varying)
 RETURNS boolean
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
DECLARE
  regra RECORD;
  should_apply BOOLEAN := FALSE;
BEGIN
  -- Buscar regras ativas
  FOR regra IN 
    SELECT * FROM public.regras_orcamentarias 
    WHERE ativo = true 
    ORDER BY created_at
  LOOP
    -- Verificar tipo de condição
    CASE regra.tipo_condicao
      WHEN 'global' THEN
        should_apply := TRUE;
      WHEN 'por_tipo' THEN
        IF (regra.condicao_config->>'tipos')::jsonb ? p_tipo_requisicao::text THEN
          should_apply := TRUE;
        END IF;
      WHEN 'por_valor' THEN
        IF p_valor_estimado >= (regra.condicao_config->>'valor_minimo')::numeric THEN
          should_apply := TRUE;
        END IF;
      WHEN 'por_centro_custo' THEN
        IF (regra.condicao_config->>'centros_custo')::jsonb ? p_centro_custo THEN
          should_apply := TRUE;
        END IF;
      WHEN 'por_categoria' THEN
        IF p_categoria IS NOT NULL AND (regra.condicao_config->>'categorias')::jsonb ? p_categoria THEN
          should_apply := TRUE;
        END IF;
    END CASE;
    
    -- Se uma regra se aplica, parar a verificação
    IF should_apply THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN should_apply;
END;
$function$;

-- Fix create_budget_reservation
CREATE OR REPLACE FUNCTION public.create_budget_reservation(p_requisicao_id uuid, p_centro_custo character varying, p_valor_reservado numeric, p_categoria character varying DEFAULT NULL::character varying, p_projeto character varying DEFAULT NULL::character varying)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
DECLARE
  orcamento_id UUID;
  reserva_id UUID;
  ano_atual INTEGER := EXTRACT(YEAR FROM NOW());
BEGIN
  -- Buscar orçamento correspondente
  SELECT id INTO orcamento_id 
  FROM public.orcamentos 
  WHERE ano = ano_atual 
    AND centro_custo = p_centro_custo
    AND (projeto = p_projeto OR (projeto IS NULL AND p_projeto IS NULL))
    AND (categoria = p_categoria OR (categoria IS NULL AND p_categoria IS NULL))
  LIMIT 1;
  
  -- Se não encontrar orçamento, criar um
  IF orcamento_id IS NULL THEN
    INSERT INTO public.orcamentos (ano, centro_custo, projeto, categoria, valor_total)
    VALUES (ano_atual, p_centro_custo, p_projeto, p_categoria, 0)
    RETURNING id INTO orcamento_id;
  END IF;
  
  -- Criar reserva
  INSERT INTO public.reserva_orcamentaria (
    requisicao_id, orcamento_id, valor_reservado, data_expiracao
  ) VALUES (
    p_requisicao_id, orcamento_id, p_valor_reservado, 
    NOW() + INTERVAL '30 days'
  )
  RETURNING id INTO reserva_id;
  
  RETURN reserva_id;
END;
$function$;

-- Fix alterar_status_pedido
CREATE OR REPLACE FUNCTION public.alterar_status_pedido(p_pedido_id uuid, p_novo_status status_pedido, p_usuario_id uuid, p_usuario_nome text, p_justificativa text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
DECLARE
  pedido_atual record;
  resultado jsonb;
BEGIN
  -- Buscar pedido atual
  SELECT * INTO pedido_atual FROM public.pedidos WHERE id = p_pedido_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('sucesso', false, 'erro', 'Pedido não encontrado');
  END IF;

  -- Validações de transição de status mais detalhadas
  CASE pedido_atual.status
    WHEN 'rascunho' THEN
      IF p_novo_status NOT IN ('aguardando_aprovacao', 'cancelado') THEN
        RETURN jsonb_build_object('sucesso', false, 'erro', 'De rascunho só é possível ir para: aguardando aprovação ou cancelado');
      END IF;
    WHEN 'aguardando_aprovacao' THEN
      IF p_novo_status NOT IN ('aprovado', 'rejeitado', 'cancelado') THEN
        RETURN jsonb_build_object('sucesso', false, 'erro', 'De aguardando aprovação só é possível ir para: aprovado, rejeitado ou cancelado');
      END IF;
    WHEN 'aprovado' THEN
      IF p_novo_status NOT IN ('enviado', 'cancelado') THEN
        RETURN jsonb_build_object('sucesso', false, 'erro', 'De aprovado só é possível ir para: enviado ou cancelado');
      END IF;
    WHEN 'enviado' THEN
      IF p_novo_status NOT IN ('confirmado', 'aguardando_confirmacao', 'cancelado') THEN
        RETURN jsonb_build_object('sucesso', false, 'erro', 'De enviado só é possível ir para: confirmado, aguardando confirmação ou cancelado');
      END IF;
    WHEN 'confirmado' THEN
      IF p_novo_status NOT IN ('entregue', 'cancelado') THEN
        RETURN jsonb_build_object('sucesso', false, 'erro', 'De confirmado só é possível ir para: entregue ou cancelado');
      END IF;
    WHEN 'entregue' THEN
      IF p_novo_status NOT IN ('recebido', 'finalizado') THEN
        RETURN jsonb_build_object('sucesso', false, 'erro', 'De entregue só é possível ir para: recebido ou finalizado');
      END IF;
    WHEN 'recebido' THEN
      IF p_novo_status NOT IN ('finalizado') THEN
        RETURN jsonb_build_object('sucesso', false, 'erro', 'De recebido só é possível ir para: finalizado');
      END IF;
    ELSE
      RETURN jsonb_build_object('sucesso', false, 'erro', 'Status atual não permite alteração');
  END CASE;

  -- Atualizar status
  UPDATE public.pedidos 
  SET 
    status = p_novo_status,
    updated_at = now(),
    aprovado_por = CASE WHEN p_novo_status = 'aprovado' THEN p_usuario_id ELSE aprovado_por END,
    data_aprovacao = CASE WHEN p_novo_status = 'aprovado' THEN now() ELSE data_aprovacao END,
    data_envio_portal = CASE WHEN p_novo_status = 'enviado' THEN now() ELSE data_envio_portal END
  WHERE id = p_pedido_id;

  -- Registrar ação no histórico
  PERFORM public.registrar_acao_pedido(
    p_pedido_id,
    'Status alterado de ' || pedido_atual.status || ' para ' || p_novo_status,
    p_usuario_id,
    p_usuario_nome,
    p_justificativa
  );

  -- Retornar sucesso
  RETURN jsonb_build_object(
    'sucesso', true, 
    'status_anterior', pedido_atual.status,
    'status_novo', p_novo_status,
    'mensagem', 'Status alterado com sucesso'
  );
END;
$function$;

-- Fix validar_pedido_para_envio
CREATE OR REPLACE FUNCTION public.validar_pedido_para_envio(pedido_id_param uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
DECLARE
  pedido_data RECORD;
  validacao_resultado jsonb := '{"valido": true, "erros": [], "alertas": []}';
  tem_itens boolean;
  count_itens integer;
BEGIN
  -- Buscar dados do pedido
  SELECT * INTO pedido_data FROM public.pedidos WHERE id = pedido_id_param;
  
  IF NOT FOUND THEN
    validacao_resultado := jsonb_set(validacao_resultado, '{valido}', 'false');
    validacao_resultado := jsonb_set(validacao_resultado, '{erros}', 
      validacao_resultado->'erros' || '["Pedido não encontrado"]');
    RETURN validacao_resultado;
  END IF;
  
  -- Verificar se tem itens
  SELECT COUNT(*) INTO count_itens FROM public.itens_pedido WHERE pedido_id = pedido_id_param;
  tem_itens := count_itens > 0;
  
  IF NOT tem_itens THEN
    validacao_resultado := jsonb_set(validacao_resultado, '{valido}', 'false');
    validacao_resultado := jsonb_set(validacao_resultado, '{erros}', 
      validacao_resultado->'erros' || '["Pedido deve ter pelo menos um item"]');
  END IF;
  
  -- Validações obrigatórias conforme PRD
  IF pedido_data.fornecedor_cnpj IS NULL OR pedido_data.fornecedor_cnpj = '' THEN
    validacao_resultado := jsonb_set(validacao_resultado, '{valido}', 'false');
    validacao_resultado := jsonb_set(validacao_resultado, '{erros}', 
      validacao_resultado->'erros' || '["CNPJ do fornecedor é obrigatório"]');
  END IF;
  
  IF pedido_data.fornecedor_razao_social IS NULL OR pedido_data.fornecedor_razao_social = '' THEN
    validacao_resultado := jsonb_set(validacao_resultado, '{valido}', 'false');
    validacao_resultado := jsonb_set(validacao_resultado, '{erros}', 
      validacao_resultado->'erros' || '["Razão social do fornecedor é obrigatória"]');
  END IF;
  
  IF pedido_data.local_entrega IS NULL OR pedido_data.local_entrega = '' THEN
    validacao_resultado := jsonb_set(validacao_resultado, '{valido}', 'false');
    validacao_resultado := jsonb_set(validacao_resultado, '{erros}', 
      validacao_resultado->'erros' || '["Local de entrega é obrigatório"]');
  END IF;
  
  IF pedido_data.data_entrega_prevista IS NULL THEN
    validacao_resultado := jsonb_set(validacao_resultado, '{valido}', 'false');
    validacao_resultado := jsonb_set(validacao_resultado, '{erros}', 
      validacao_resultado->'erros' || '["Data de entrega é obrigatória"]');
  END IF;
  
  IF pedido_data.condicao_pagamento IS NULL OR pedido_data.condicao_pagamento = '' THEN
    validacao_resultado := jsonb_set(validacao_resultado, '{valido}', 'false');
    validacao_resultado := jsonb_set(validacao_resultado, '{erros}', 
      validacao_resultado->'erros' || '["Condição de pagamento é obrigatória"]');
  END IF;

  IF pedido_data.centro_custo IS NULL OR pedido_data.centro_custo = '' THEN
    validacao_resultado := jsonb_set(validacao_resultado, '{valido}', 'false');
    validacao_resultado := jsonb_set(validacao_resultado, '{erros}', 
      validacao_resultado->'erros' || '["Centro de custo é obrigatório"]');
  END IF;
  
  -- Alertas (não impedem envio mas são importantes)
  IF pedido_data.fornecedor_status != 'ativo' THEN
    validacao_resultado := jsonb_set(validacao_resultado, '{alertas}', 
      validacao_resultado->'alertas' || '["Fornecedor não está com status ativo"]');
  END IF;

  IF pedido_data.valor_total <= 0 THEN
    validacao_resultado := jsonb_set(validacao_resultado, '{alertas}', 
      validacao_resultado->'alertas' || '["Valor total do pedido é zero ou negativo"]');
  END IF;

  IF pedido_data.responsavel_interno_nome IS NULL OR pedido_data.responsavel_interno_nome = '' THEN
    validacao_resultado := jsonb_set(validacao_resultado, '{alertas}', 
      validacao_resultado->'alertas' || '["Responsável interno não definido"]');
  END IF;
  
  RETURN validacao_resultado;
END;
$function$;

-- Fix processar_cotacao_premiada
CREATE OR REPLACE FUNCTION public.processar_cotacao_premiada()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
DECLARE
  cotacao_data record;
  itens_cotacao jsonb;
  pedido_id uuid;
BEGIN
  -- Verificar se status mudou para premiada
  IF NEW.status = 'premiada' AND OLD.status != 'premiada' THEN
    
    -- Buscar dados da cotação
    SELECT 
      fornecedor_id,
      centro_custo,
      valor_total,
      data_necessidade,
      observacoes,
      solicitante_id
    INTO cotacao_data
    FROM public.cotacoes 
    WHERE id = NEW.id;

    -- Buscar itens da cotação (assumindo estrutura similar)
    SELECT jsonb_agg(
      jsonb_build_object(
        'descricao', ic.descricao,
        'especificacao', ic.especificacao_tecnica,
        'quantidade', ic.quantidade,
        'unidade', ic.unidade_medida,
        'preco_unitario', ic.preco_premiado,
        'codigo_produto', ic.codigo_produto,
        'categoria', ic.categoria
      )
    ) INTO itens_cotacao
    FROM public.itens_cotacao ic
    WHERE ic.cotacao_id = NEW.id;

    -- Criar pedido automaticamente
    SELECT public.criar_po_automatico(
      'cotacao',
      NEW.id,
      cotacao_data.fornecedor_id,
      NULL, -- CNPJ será preenchido depois
      NULL, -- Razão social será preenchida depois
      cotacao_data.solicitante_id,
      cotacao_data.centro_custo,
      NULL, -- projeto será definido manualmente
      cotacao_data.data_necessidade,
      COALESCE(itens_cotacao, '[]'::jsonb),
      'Pedido gerado automaticamente da cotação premiada'
    ) INTO pedido_id;

    -- Log da criação
    RAISE NOTICE 'Pedido % criado automaticamente da cotação %', pedido_id, NEW.id;
    
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Fix processar_contrato_vigente
CREATE OR REPLACE FUNCTION public.processar_contrato_vigente()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
DECLARE
  contrato_data record;
  itens_contrato jsonb;
  pedido_id uuid;
BEGIN
  -- Verificar se status mudou para vigente e tem flag de gerar PO automático
  IF NEW.status = 'vigente' AND OLD.status != 'vigente' THEN
    
    -- Buscar dados do contrato
    SELECT 
      fornecedor_id,
      centro_custo,
      data_inicio,
      observacoes,
      gerar_po_automatico
    INTO contrato_data
    FROM public.contratos 
    WHERE id = NEW.id;

    -- Só gerar PO se estiver configurado para isso
    IF contrato_data.gerar_po_automatico = true THEN
      
      -- Buscar itens padrão do contrato (assumindo estrutura)
      SELECT jsonb_agg(
        jsonb_build_object(
          'descricao', ict.descricao,
          'especificacao', ict.especificacao,
          'quantidade', ict.quantidade_padrao,
          'unidade', ict.unidade,
          'preco_unitario', ict.preco_contrato,
          'codigo_produto', ict.codigo_produto,
          'categoria', ict.categoria
        )
      ) INTO itens_contrato
      FROM public.itens_contrato ict
      WHERE ict.contrato_id = NEW.id AND ict.gerar_po_inicial = true;

      -- Criar pedido automaticamente apenas se houver itens para PO inicial
      IF itens_contrato IS NOT NULL THEN
        SELECT public.criar_po_automatico(
          'contrato',
          NEW.id,
          contrato_data.fornecedor_id,
          NULL, -- CNPJ será preenchido depois
          NULL, -- Razão social será preenchida depois  
          auth.uid(), -- usuário atual como solicitante
          contrato_data.centro_custo,
          NULL, -- projeto será definido manualmente
          CURRENT_DATE + INTERVAL '30 days', -- 30 dias a partir de hoje
          itens_contrato,
          'Pedido gerado automaticamente do contrato vigente'
        ) INTO pedido_id;

        -- Log da criação
        RAISE NOTICE 'Pedido % criado automaticamente do contrato %', pedido_id, NEW.id;
      END IF;
      
    END IF;
    
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Fix criar_solicitacao_sourcing
CREATE OR REPLACE FUNCTION public.criar_solicitacao_sourcing()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
DECLARE
  recomendacoes JSONB;
BEGIN
  -- Verificar se requisição foi aprovada e valor >= 1000
  IF NEW.status = 'aprovada' AND OLD.status != 'aprovada' AND NEW.valor_estimado >= 1000 THEN
    
    -- Gerar recomendações de fornecedores (simuladas por enquanto)
    recomendacoes := '[
      {
        "fornecedor_id": "1",
        "nome": "Fornecedor Alpha",
        "score": 85,
        "razao": "Histórico excelente na categoria",
        "categoria_match": true,
        "historico_performance": 92
      },
      {
        "fornecedor_id": "2", 
        "nome": "Fornecedor Beta",
        "score": 78,
        "razao": "Preços competitivos",
        "categoria_match": true,
        "historico_performance": 85
      }
    ]'::jsonb;
    
    -- Criar solicitação de sourcing
    INSERT INTO public.solicitacoes_sourcing (
      requisicao_id,
      valor_estimado,
      categoria,
      observacoes,
      recomendacoes_fornecedores
    ) VALUES (
      NEW.id,
      NEW.valor_estimado,
      'categoria_generica',
      'Solicitação criada automaticamente após aprovação da requisição',
      recomendacoes
    );
    
    -- Registrar no histórico da requisição
    INSERT INTO public.historico_requisicao (
      requisicao_id,
      evento,
      descricao,
      usuario_nome,
      origem
    ) VALUES (
      NEW.id,
      'encaminhado_sourcing',
      'Requisição encaminhada automaticamente para Sourcing (valor >= R$ 1.000)',
      'Sistema Automático',
      'sistema'
    );
    
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Fix processar_sourcing_finalizado
CREATE OR REPLACE FUNCTION public.processar_sourcing_finalizado()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
DECLARE
  projeto_data RECORD;
  itens_sourcing JSONB;
  pedido_id UUID;
BEGIN
  -- Verificar se status mudou para finalizado
  IF NEW.status = 'finalizado' AND OLD.status != 'finalizado' THEN
    
    -- Buscar dados do projeto
    SELECT 
      fornecedor_vencedor_id,
      valor_estimado,
      data_limite_resposta,
      proposta_vencedora,
      criado_por,
      requisicao_origem_id
    INTO projeto_data
    FROM public.projetos_sourcing 
    WHERE id = NEW.id;

    -- Simular itens do sourcing (baseado na proposta vencedora)
    SELECT jsonb_agg(
      jsonb_build_object(
        'descricao', 'Item do Sourcing ' || NEW.codigo_projeto,
        'especificacao', 'Especificação técnica do item',
        'quantidade', 1,
        'unidade', 'UN',
        'preco_unitario', projeto_data.valor_estimado,
        'codigo_produto', 'SRC-' || substr(NEW.id::text, 1, 8),
        'categoria', 'Categoria Sourcing'
      )
    ) INTO itens_sourcing;

    -- Criar pedido automaticamente
    SELECT public.criar_po_automatico(
      'sourcing',
      NEW.id,
      projeto_data.fornecedor_vencedor_id,
      NULL, -- CNPJ será preenchido depois
      NULL, -- Razão social será preenchida depois
      projeto_data.criado_por,
      'Centro de Custo Sourcing',
      NULL,
      projeto_data.data_limite_resposta::date,
      COALESCE(itens_sourcing, '[]'::jsonb),
      'Pedido gerado automaticamente do projeto de sourcing finalizado'
    ) INTO pedido_id;

    -- Atualizar histórico da requisição original se existir
    IF projeto_data.requisicao_origem_id IS NOT NULL THEN
      INSERT INTO public.historico_requisicao (
        requisicao_id,
        evento,
        descricao,
        usuario_nome,
        origem
      ) VALUES (
        projeto_data.requisicao_origem_id,
        'pedido_criado_sourcing',
        'Pedido criado automaticamente após finalização do sourcing ' || NEW.codigo_projeto,
        'Sistema Automático',
        'sistema'
      );
    END IF;
    
  END IF;
  
  RETURN NEW;
END;
$function$;
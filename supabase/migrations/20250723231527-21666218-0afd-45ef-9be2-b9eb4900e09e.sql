-- FASE 1: Completar estrutura do módulo de pedidos conforme PRD

-- Atualizar tabela pedidos com campos obrigatórios em falta
ALTER TABLE public.pedidos 
ADD COLUMN IF NOT EXISTS projeto_atividade text,
ADD COLUMN IF NOT EXISTS conta_contabil text,
ADD COLUMN IF NOT EXISTS responsavel_interno_email text,
ADD COLUMN IF NOT EXISTS checklist_validacao_completo boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS origem_id uuid,
ADD COLUMN IF NOT EXISTS permite_fracionamento boolean DEFAULT false;

-- Atualizar tabela itens_pedido com campos em falta
ALTER TABLE public.itens_pedido
ADD COLUMN IF NOT EXISTS codigo_interno_cliente text,
ADD COLUMN IF NOT EXISTS data_entrega_solicitada date,
ADD COLUMN IF NOT EXISTS tolerancia_atraso_dias integer DEFAULT 2,
ADD COLUMN IF NOT EXISTS observacoes_tecnicas_detalhadas text;

-- Função para alterar status do pedido (atualizar a existente)
CREATE OR REPLACE FUNCTION public.alterar_status_pedido(
  p_pedido_id uuid,
  p_novo_status status_pedido,
  p_usuario_id uuid,
  p_usuario_nome text,
  p_justificativa text DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql
AS $$
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
$$;

-- Função melhorada para validação de pedido
CREATE OR REPLACE FUNCTION public.validar_pedido_para_envio(pedido_id_param uuid)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
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
$$;
-- Completar triggers automáticos apenas para tabelas existentes

-- Ativar trigger para requisições aprovadas (já existe a função)
CREATE TRIGGER trigger_requisicao_aprovada
  AFTER UPDATE ON public.requisicoes
  FOR EACH ROW
  EXECUTE FUNCTION public.processar_requisicao_aprovada();

-- Função para alterar status do pedido com validações
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

  -- Validações de transição de status
  CASE pedido_atual.status
    WHEN 'rascunho' THEN
      IF p_novo_status NOT IN ('em_aprovacao', 'cancelado') THEN
        RETURN jsonb_build_object('sucesso', false, 'erro', 'Transição de status inválida');
      END IF;
    WHEN 'em_aprovacao' THEN
      IF p_novo_status NOT IN ('aprovado', 'rejeitado', 'cancelado') THEN
        RETURN jsonb_build_object('sucesso', false, 'erro', 'Transição de status inválida');
      END IF;
    WHEN 'aprovado' THEN
      IF p_novo_status NOT IN ('emitido', 'cancelado') THEN
        RETURN jsonb_build_object('sucesso', false, 'erro', 'Transição de status inválida');
      END IF;
    WHEN 'emitido' THEN
      IF p_novo_status NOT IN ('aguardando_confirmacao', 'cancelado') THEN
        RETURN jsonb_build_object('sucesso', false, 'erro', 'Transição de status inválida');
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
    data_aprovacao = CASE WHEN p_novo_status = 'aprovado' THEN now() ELSE data_aprovacao END
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
    'status_novo', p_novo_status
  );
END;
$$;
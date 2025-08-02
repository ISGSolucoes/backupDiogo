-- Completar triggers automáticos para criação de PO

-- Trigger para processar cotações premiadas (quando cotacao.status muda para 'premiada')
CREATE OR REPLACE FUNCTION public.processar_cotacao_premiada()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  cotacao_data record;
  itens_cotacao jsonb;
  pedido_id uuid;
BEGIN
  -- Verificar se status mudou para premiada
  IF NEW.status = 'premiada' AND OLD.status != 'premiada' THEN
    
    -- Buscar dados da cotação
    SELECT 
      c.solicitante_id,
      c.centro_custo,
      c.valor_total,
      c.data_necessidade,
      c.observacoes,
      c.fornecedor_selecionado_id,
      c.fornecedor_selecionado_nome,
      c.fornecedor_selecionado_cnpj
    INTO cotacao_data
    FROM public.cotacoes c 
    WHERE c.id = NEW.id;

    -- Buscar itens da cotação premiada
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
    WHERE ic.cotacao_id = NEW.id AND ic.selecionado = true;

    -- Criar pedido automaticamente
    SELECT public.criar_po_automatico(
      'cotacao',
      NEW.id,
      cotacao_data.fornecedor_selecionado_id,
      cotacao_data.fornecedor_selecionado_cnpj,
      cotacao_data.fornecedor_selecionado_nome,
      cotacao_data.solicitante_id,
      cotacao_data.centro_custo,
      NULL,
      cotacao_data.data_necessidade,
      COALESCE(itens_cotacao, '[]'::jsonb),
      'Pedido gerado automaticamente da cotação premiada'
    ) INTO pedido_id;

    -- Log da criação
    RAISE NOTICE 'Pedido % criado automaticamente da cotação premiada %', pedido_id, NEW.id;
    
  END IF;
  
  RETURN NEW;
END;
$$;

-- Ativar trigger para cotações premiadas
CREATE TRIGGER trigger_cotacao_premiada
  AFTER UPDATE ON public.cotacoes
  FOR EACH ROW
  EXECUTE FUNCTION public.processar_cotacao_premiada();

-- Ativar trigger para requisições aprovadas (descomentando)
CREATE TRIGGER trigger_requisicao_aprovada
  AFTER UPDATE ON public.requisicoes
  FOR EACH ROW
  EXECUTE FUNCTION public.processar_requisicao_aprovada();

-- Função para processar contratos ativos e gerar POs periódicos
CREATE OR REPLACE FUNCTION public.processar_contrato_vigente()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  contrato_data record;
  itens_contrato jsonb;
  pedido_id uuid;
BEGIN
  -- Verificar se status mudou para vigente e tem configuração de pedidos automáticos
  IF NEW.status = 'vigente' AND OLD.status != 'vigente' AND NEW.gerar_pedidos_automaticos = true THEN
    
    -- Buscar dados do contrato
    SELECT 
      c.responsavel_id,
      c.centro_custo,
      c.valor_total,
      c.data_fim,
      c.observacoes,
      c.fornecedor_id,
      c.fornecedor_nome,
      c.fornecedor_cnpj
    INTO contrato_data
    FROM public.contratos c 
    WHERE c.id = NEW.id;

    -- Buscar itens do contrato
    SELECT jsonb_agg(
      jsonb_build_object(
        'descricao', ic.descricao,
        'especificacao', ic.especificacao,
        'quantidade', ic.quantidade_contratada,
        'unidade', ic.unidade,
        'preco_unitario', ic.preco_unitario,
        'codigo_produto', ic.codigo_produto,
        'categoria', ic.categoria
      )
    ) INTO itens_contrato
    FROM public.itens_contrato ic
    WHERE ic.contrato_id = NEW.id;

    -- Criar primeiro pedido baseado no contrato
    SELECT public.criar_po_automatico(
      'contrato',
      NEW.id,
      contrato_data.fornecedor_id,
      contrato_data.fornecedor_cnpj,
      contrato_data.fornecedor_nome,
      contrato_data.responsavel_id,
      contrato_data.centro_custo,
      NULL,
      CURRENT_DATE + INTERVAL '30 days', -- prazo padrão de 30 dias
      COALESCE(itens_contrato, '[]'::jsonb),
      'Pedido gerado automaticamente do contrato vigente'
    ) INTO pedido_id;

    -- Log da criação
    RAISE NOTICE 'Pedido % criado automaticamente do contrato vigente %', pedido_id, NEW.id;
    
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger para contratos vigentes (se a tabela existir)
-- CREATE TRIGGER trigger_contrato_vigente
--   AFTER UPDATE ON public.contratos
--   FOR EACH ROW
--   EXECUTE FUNCTION public.processar_contrato_vigente();

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
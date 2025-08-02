-- Criar função para gerar pedido automaticamente
CREATE OR REPLACE FUNCTION public.criar_po_automatico(
  p_origem text,
  p_origem_id uuid,
  p_fornecedor_id text DEFAULT NULL,
  p_fornecedor_cnpj text DEFAULT NULL,
  p_fornecedor_nome text DEFAULT NULL,
  p_solicitante_id uuid DEFAULT NULL,
  p_centro_custo text DEFAULT NULL,
  p_projeto text DEFAULT NULL,
  p_data_entrega_prevista date DEFAULT NULL,
  p_itens jsonb DEFAULT '[]'::jsonb,
  p_observacoes text DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Função para criar PO manual com validações
CREATE OR REPLACE FUNCTION public.criar_po_manual(
  p_dados_pedido jsonb,
  p_itens jsonb,
  p_usuario_id uuid
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Função que será chamada quando requisições forem aprovadas (quando a tabela existir)
CREATE OR REPLACE FUNCTION public.processar_requisicao_aprovada()
RETURNS trigger
LANGUAGE plpgsql
AS $$
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
$$;

-- Trigger será criado quando a tabela requisicoes existir
-- CREATE TRIGGER trigger_requisicao_aprovada
--   AFTER UPDATE ON public.requisicoes
--   FOR EACH ROW
--   EXECUTE FUNCTION public.processar_requisicao_aprovada();
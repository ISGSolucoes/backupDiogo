-- FASE 2: Implementar funções de criação automática de PO conforme PRD

-- Ativar triggers que já existem mas podem não estar ativos
-- O trigger da requisição já foi criado na migração anterior

-- Função para processar cotação premiada
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
$$;

-- Função para processar contrato vigente
CREATE OR REPLACE FUNCTION public.processar_contrato_vigente()
RETURNS trigger
LANGUAGE plpgsql
AS $$
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
$$;

-- Criar triggers se as tabelas existirem
-- Trigger para cotações
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cotacoes') THEN
        DROP TRIGGER IF EXISTS trigger_cotacao_premiada ON public.cotacoes;
        CREATE TRIGGER trigger_cotacao_premiada
        AFTER UPDATE ON public.cotacoes
        FOR EACH ROW
        EXECUTE FUNCTION public.processar_cotacao_premiada();
    END IF;
END $$;

-- Trigger para contratos  
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'contratos') THEN
        DROP TRIGGER IF EXISTS trigger_contrato_vigente ON public.contratos;
        CREATE TRIGGER trigger_contrato_vigente
        AFTER UPDATE ON public.contratos
        FOR EACH ROW
        EXECUTE FUNCTION public.processar_contrato_vigente();
    END IF;
END $$;
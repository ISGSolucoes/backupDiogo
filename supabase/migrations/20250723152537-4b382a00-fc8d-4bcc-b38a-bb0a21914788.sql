-- Atualizar tabela pedidos com campos da estrutura completa
ALTER TABLE public.pedidos
ADD COLUMN IF NOT EXISTS data_emissao timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS origem_demanda text,
ADD COLUMN IF NOT EXISTS tipo_detalhado text DEFAULT 'produto',
ADD COLUMN IF NOT EXISTS fornecedor_razao_social text,
ADD COLUMN IF NOT EXISTS fornecedor_cnpj text,
ADD COLUMN IF NOT EXISTS fornecedor_endereco_faturamento text,
ADD COLUMN IF NOT EXISTS fornecedor_responsavel_nome text,
ADD COLUMN IF NOT EXISTS fornecedor_responsavel_email text,
ADD COLUMN IF NOT EXISTS fornecedor_status text DEFAULT 'ativo',
ADD COLUMN IF NOT EXISTS condicao_pagamento text,
ADD COLUMN IF NOT EXISTS forma_pagamento text,
ADD COLUMN IF NOT EXISTS impostos jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS descontos_acrescimos numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS local_entrega text,
ADD COLUMN IF NOT EXISTS data_entrega_prevista date,
ADD COLUMN IF NOT EXISTS tipo_frete text DEFAULT 'CIF',
ADD COLUMN IF NOT EXISTS transportadora text,
ADD COLUMN IF NOT EXISTS instrucoes_entrega text,
ADD COLUMN IF NOT EXISTS aceita_entrega_parcial boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS prazo_maximo_atraso integer DEFAULT 2,
ADD COLUMN IF NOT EXISTS requisicao_vinculada text,
ADD COLUMN IF NOT EXISTS cotacao_vinculada text,
ADD COLUMN IF NOT EXISTS contrato_vinculado text,
ADD COLUMN IF NOT EXISTS ordem_servico text,
ADD COLUMN IF NOT EXISTS responsavel_interno_id uuid,
ADD COLUMN IF NOT EXISTS responsavel_interno_nome text,
ADD COLUMN IF NOT EXISTS observacoes_internas text,
ADD COLUMN IF NOT EXISTS observacoes_fornecedor text,
ADD COLUMN IF NOT EXISTS checklist_validacao jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS historico_acoes jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS permite_edicao boolean DEFAULT true;

-- Atualizar tabela itens_pedido com campos adicionais
ALTER TABLE public.itens_pedido
ADD COLUMN IF NOT EXISTS categoria_familia text,
ADD COLUMN IF NOT EXISTS projeto_atividade text,
ADD COLUMN IF NOT EXISTS observacoes_tecnicas text,
ADD COLUMN IF NOT EXISTS aceita_fracionamento boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS tolerancia_atraso integer DEFAULT 2,
ADD COLUMN IF NOT EXISTS codigo_fornecedor text,
ADD COLUMN IF NOT EXISTS especificacao_tecnica text,
ADD COLUMN IF NOT EXISTS lote_serie text;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_pedidos_fornecedor_cnpj ON public.pedidos(fornecedor_cnpj);
CREATE INDEX IF NOT EXISTS idx_pedidos_data_entrega ON public.pedidos(data_entrega_prevista);
CREATE INDEX IF NOT EXISTS idx_pedidos_responsavel ON public.pedidos(responsavel_interno_id);
CREATE INDEX IF NOT EXISTS idx_itens_categoria ON public.itens_pedido(categoria_familia);

-- Função para validar pedido antes do envio
CREATE OR REPLACE FUNCTION public.validar_pedido_para_envio(pedido_id_param uuid)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  pedido_data RECORD;
  validacao_resultado jsonb := '{"valido": true, "erros": [], "alertas": []}';
  tem_itens boolean;
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
  SELECT EXISTS(SELECT 1 FROM public.itens_pedido WHERE pedido_id = pedido_id_param) INTO tem_itens;
  
  IF NOT tem_itens THEN
    validacao_resultado := jsonb_set(validacao_resultado, '{valido}', 'false');
    validacao_resultado := jsonb_set(validacao_resultado, '{erros}', 
      validacao_resultado->'erros' || '["Pedido deve ter pelo menos um item"]');
  END IF;
  
  -- Validações obrigatórias
  IF pedido_data.fornecedor_cnpj IS NULL OR pedido_data.fornecedor_cnpj = '' THEN
    validacao_resultado := jsonb_set(validacao_resultado, '{valido}', 'false');
    validacao_resultado := jsonb_set(validacao_resultado, '{erros}', 
      validacao_resultado->'erros' || '["CNPJ do fornecedor é obrigatório"]');
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
  
  -- Alertas (não impedem envio)
  IF pedido_data.fornecedor_status != 'ativo' THEN
    validacao_resultado := jsonb_set(validacao_resultado, '{alertas}', 
      validacao_resultado->'alertas' || '["Fornecedor não está com status ativo"]');
  END IF;
  
  RETURN validacao_resultado;
END;
$$;

-- Função para registrar ações no histórico
CREATE OR REPLACE FUNCTION public.registrar_acao_pedido(
  pedido_id_param uuid,
  acao text,
  usuario_id_param uuid,
  usuario_nome text,
  detalhes text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
AS $$
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
$$;
-- Criar tabela para logs de integração com portal
CREATE TABLE IF NOT EXISTS public.logs_integracao_portal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID NOT NULL REFERENCES public.pedidos(id),
  fornecedor_id TEXT NOT NULL,
  operacao TEXT NOT NULL,
  status TEXT NOT NULL,
  dados_enviados JSONB,
  dados_recebidos JSONB,
  portal_pedido_id TEXT,
  token_portal TEXT,
  tentativa INTEGER DEFAULT 1,
  erro_detalhes TEXT,
  data_operacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_logs_portal_pedido_id ON public.logs_integracao_portal(pedido_id);
CREATE INDEX IF NOT EXISTS idx_logs_portal_fornecedor_id ON public.logs_integracao_portal(fornecedor_id);
CREATE INDEX IF NOT EXISTS idx_logs_portal_operacao ON public.logs_integracao_portal(operacao);
CREATE INDEX IF NOT EXISTS idx_logs_portal_data ON public.logs_integracao_portal(data_operacao);

-- Adicionar campos necessários na tabela pedidos se não existirem
DO $$ 
BEGIN
  -- Verificar e adicionar portal_pedido_id se não existir
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='pedidos' AND column_name='portal_pedido_id') THEN
    ALTER TABLE public.pedidos ADD COLUMN portal_pedido_id TEXT;
  END IF;
  
  -- Verificar e adicionar status_portal se não existir  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='pedidos' AND column_name='status_portal') THEN
    ALTER TABLE public.pedidos ADD COLUMN status_portal TEXT;
  END IF;
  
  -- Verificar e adicionar data_resposta_fornecedor se não existir
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='pedidos' AND column_name='data_resposta_fornecedor') THEN
    ALTER TABLE public.pedidos ADD COLUMN data_resposta_fornecedor TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- Enable RLS na tabela de logs
ALTER TABLE public.logs_integracao_portal ENABLE ROW LEVEL SECURITY;

-- Policy para logs (apenas admins e usuários autenticados podem ver)
CREATE POLICY "Authenticated users can view integration logs" 
ON public.logs_integracao_portal 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Policy para inserção (permitir inserção via edge function)
CREATE POLICY "System can insert integration logs" 
ON public.logs_integracao_portal 
FOR INSERT 
WITH CHECK (true);
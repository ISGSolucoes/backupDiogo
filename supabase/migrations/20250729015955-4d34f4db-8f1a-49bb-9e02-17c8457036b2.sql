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

-- Criar tabela de fornecedores se não existir (simplificada)
CREATE TABLE IF NOT EXISTS public.fornecedores (
  id TEXT PRIMARY KEY,
  cnpj TEXT NOT NULL,
  razao_social TEXT NOT NULL,
  nome_fantasia TEXT,
  email_principal TEXT,
  telefone TEXT,
  endereco JSONB,
  status TEXT NOT NULL DEFAULT 'ativo',
  portal_config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inserir alguns fornecedores exemplo
INSERT INTO public.fornecedores (id, cnpj, razao_social, nome_fantasia, email_principal, telefone, status) 
VALUES 
  ('1', '12.345.678/0001-90', 'TechSupply Solutions Ltda', 'TechSupply', 'contato@techsupply.com', '(11) 9999-9999', 'ativo'),
  ('2', '98.765.432/0001-10', 'Industrial Parts Ltda', 'Industrial Parts', 'vendas@industrialparts.com', '(11) 8888-8888', 'ativo'),
  ('3', '11.222.333/0001-44', 'MetalWorks Corporation', 'MetalWorks', 'comercial@metalworks.com', '(11) 7777-7777', 'ativo')
ON CONFLICT (id) DO NOTHING;

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

-- Enable RLS na tabela de fornecedores
ALTER TABLE public.fornecedores ENABLE ROW LEVEL SECURITY;

-- Policies para fornecedores
CREATE POLICY "Authenticated users can view suppliers" 
ON public.fornecedores 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage suppliers" 
ON public.fornecedores 
FOR ALL 
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));
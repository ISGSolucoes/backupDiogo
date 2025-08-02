-- Criar tabela para controlar convites de registro de fornecedores
CREATE TABLE public.convites_fornecedor (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_empresa TEXT NOT NULL,
  email_contato TEXT NOT NULL,
  mensagem_convite TEXT,
  token_unico TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  status TEXT NOT NULL DEFAULT 'enviado' CHECK (status IN ('enviado', 'visualizado', 'cadastrado', 'expirado')),
  enviado_por UUID,
  data_envio TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_visualizacao TIMESTAMP WITH TIME ZONE,
  data_cadastro TIMESTAMP WITH TIME ZONE,
  data_expiracao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '30 days'),
  tentativas_envio INTEGER NOT NULL DEFAULT 1,
  ultimo_erro TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.convites_fornecedor ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Permitir acesso completo aos convites" 
ON public.convites_fornecedor 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Índices para performance
CREATE INDEX idx_convites_fornecedor_token ON public.convites_fornecedor(token_unico);
CREATE INDEX idx_convites_fornecedor_email ON public.convites_fornecedor(email_contato);
CREATE INDEX idx_convites_fornecedor_status ON public.convites_fornecedor(status);
CREATE INDEX idx_convites_fornecedor_data_envio ON public.convites_fornecedor(data_envio);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_convites_fornecedor_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_convites_fornecedor_updated_at
  BEFORE UPDATE ON public.convites_fornecedor
  FOR EACH ROW
  EXECUTE FUNCTION public.update_convites_fornecedor_updated_at();
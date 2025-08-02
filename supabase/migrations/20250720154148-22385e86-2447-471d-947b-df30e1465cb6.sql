-- Criar tabelas para sistema de ações em lote

-- 1. Templates de ação em lote
CREATE TABLE public.template_acao_lote (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  tipo_acao TEXT NOT NULL CHECK (tipo_acao IN ('avaliacao_interna', 'pesquisa_cliente', 'convite', 'requalificacao', 'comunicado')),
  categoria TEXT,
  conteudo_texto TEXT,
  campos_formulario JSONB DEFAULT '[]'::jsonb,
  configuracoes JSONB DEFAULT '{}'::jsonb,
  permite_anonimato BOOLEAN DEFAULT false,
  validade_dias INTEGER DEFAULT 30,
  is_ativo BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Disparos de ação em lote
CREATE TABLE public.disparo_acao_lote (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID REFERENCES public.template_acao_lote(id),
  nome_disparo TEXT NOT NULL,
  tipo_acao TEXT NOT NULL,
  total_fornecedores INTEGER DEFAULT 0,
  enviados INTEGER DEFAULT 0,
  abertos INTEGER DEFAULT 0,
  respondidos INTEGER DEFAULT 0,
  falhas INTEGER DEFAULT 0,
  status TEXT DEFAULT 'preparando' CHECK (status IN ('preparando', 'enviando', 'concluido', 'falhou')),
  disparado_por UUID,
  disparado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  concluido_em TIMESTAMP WITH TIME ZONE,
  configuracoes JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Detalhes por fornecedor do disparo
CREATE TABLE public.disparo_fornecedor (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  disparo_id UUID REFERENCES public.disparo_acao_lote(id) ON DELETE CASCADE,
  fornecedor_id TEXT NOT NULL,
  fornecedor_nome TEXT NOT NULL,
  fornecedor_cnpj TEXT NOT NULL,
  fornecedor_email TEXT NOT NULL,
  status_envio TEXT DEFAULT 'pendente' CHECK (status_envio IN ('pendente', 'enviado', 'aberto', 'respondido', 'falhou')),
  data_envio TIMESTAMP WITH TIME ZONE,
  data_abertura TIMESTAMP WITH TIME ZONE,
  data_resposta TIMESTAMP WITH TIME ZONE,
  token_rastreio TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  erro_envio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Respostas de pesquisa com clientes
CREATE TABLE public.resposta_pesquisa_cliente (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  disparo_fornecedor_id UUID REFERENCES public.disparo_fornecedor(id),
  disparo_id UUID REFERENCES public.disparo_acao_lote(id),
  fornecedor_id TEXT NOT NULL,
  respostas JSONB DEFAULT '{}'::jsonb,
  nota_nps INTEGER CHECK (nota_nps >= 0 AND nota_nps <= 10),
  comentarios TEXT,
  anonimo BOOLEAN DEFAULT false,
  ip_resposta INET,
  respondido_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Registro de comunicados
CREATE TABLE public.registro_comunicado (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  disparo_fornecedor_id UUID REFERENCES public.disparo_fornecedor(id),
  disparo_id UUID REFERENCES public.disparo_acao_lote(id),
  fornecedor_id TEXT NOT NULL,
  titulo TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  anexos JSONB DEFAULT '[]'::jsonb,
  lido BOOLEAN DEFAULT false,
  data_leitura TIMESTAMP WITH TIME ZONE,
  token_leitura TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. Histórico de ações por fornecedor
CREATE TABLE public.historico_acao_fornecedor (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fornecedor_id TEXT NOT NULL,
  fornecedor_nome TEXT NOT NULL,
  disparo_id UUID REFERENCES public.disparo_acao_lote(id),
  tipo_acao TEXT NOT NULL,
  template_nome TEXT,
  status_final TEXT,
  detalhes JSONB DEFAULT '{}'::jsonb,
  executado_por UUID,
  executado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Adicionar campo email_principal na tabela de fornecedores (se não existir)
-- Nota: Assumindo que já existe uma estrutura de fornecedores, apenas comentando
-- ALTER TABLE public.fornecedores ADD COLUMN IF NOT EXISTS email_principal TEXT;

-- Indexes para performance
CREATE INDEX idx_template_acao_lote_tipo ON public.template_acao_lote(tipo_acao);
CREATE INDEX idx_template_acao_lote_ativo ON public.template_acao_lote(is_ativo);
CREATE INDEX idx_disparo_acao_lote_status ON public.disparo_acao_lote(status);
CREATE INDEX idx_disparo_fornecedor_disparo_id ON public.disparo_fornecedor(disparo_id);
CREATE INDEX idx_disparo_fornecedor_fornecedor_id ON public.disparo_fornecedor(fornecedor_id);
CREATE INDEX idx_disparo_fornecedor_status ON public.disparo_fornecedor(status_envio);
CREATE INDEX idx_historico_acao_fornecedor_id ON public.historico_acao_fornecedor(fornecedor_id);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION public.update_template_acao_lote_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_template_acao_lote_updated_at
  BEFORE UPDATE ON public.template_acao_lote
  FOR EACH ROW
  EXECUTE FUNCTION public.update_template_acao_lote_updated_at();

CREATE TRIGGER update_disparo_fornecedor_updated_at
  BEFORE UPDATE ON public.disparo_fornecedor
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- RLS Policies
ALTER TABLE public.template_acao_lote ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disparo_acao_lote ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disparo_fornecedor ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resposta_pesquisa_cliente ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registro_comunicado ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historico_acao_fornecedor ENABLE ROW LEVEL SECURITY;

-- Políticas permissivas para usuários autenticados
CREATE POLICY "Permitir acesso completo aos templates" ON public.template_acao_lote FOR ALL USING (true);
CREATE POLICY "Permitir acesso completo aos disparos" ON public.disparo_acao_lote FOR ALL USING (true);
CREATE POLICY "Permitir acesso completo aos disparos por fornecedor" ON public.disparo_fornecedor FOR ALL USING (true);
CREATE POLICY "Permitir acesso completo às respostas" ON public.resposta_pesquisa_cliente FOR ALL USING (true);
CREATE POLICY "Permitir acesso completo aos comunicados" ON public.registro_comunicado FOR ALL USING (true);
CREATE POLICY "Permitir acesso completo ao histórico" ON public.historico_acao_fornecedor FOR ALL USING (true);
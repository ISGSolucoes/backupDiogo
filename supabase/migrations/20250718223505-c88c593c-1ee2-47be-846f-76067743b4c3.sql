-- Criar enums para o módulo de pedidos
CREATE TYPE public.status_pedido AS ENUM (
  'rascunho',
  'aguardando_aprovacao', 
  'aprovado',
  'rejeitado',
  'enviado',
  'visualizado',
  'questionado',
  'confirmado',
  'alteracao_solicitada',
  'cancelado',
  'finalizado'
);

CREATE TYPE public.tipo_pedido AS ENUM ('material', 'servico', 'misto');

CREATE TYPE public.tipo_aprovacao AS ENUM ('individual', 'comite', 'paralelo');

CREATE TYPE public.status_aprovacao AS ENUM ('pendente', 'aprovado', 'rejeitado', 'expirado');

CREATE TYPE public.status_integracao AS ENUM ('pendente', 'enviando', 'sucesso', 'erro', 'timeout');

CREATE TYPE public.tipo_operacao_portal AS ENUM ('envio_pedido', 'webhook_resposta', 'sincronizacao', 'reenvio');

CREATE TYPE public.tipo_resposta_portal AS ENUM ('aceitar', 'questionar', 'alterar', 'recusar');

-- Tabela principal de pedidos
CREATE TABLE public.pedidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_pedido VARCHAR(20) UNIQUE NOT NULL,
  
  -- Referências para outros módulos existentes
  cotacao_id UUID, -- referência para futuro módulo de cotações
  requisicao_id UUID, -- referência para futuro módulo de requisições
  fornecedor_id TEXT NOT NULL, -- usar como string por enquanto
  
  -- Status e workflow
  status status_pedido NOT NULL DEFAULT 'rascunho',
  tipo tipo_pedido NOT NULL DEFAULT 'material',
  
  -- Datas
  data_criacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  data_aprovacao TIMESTAMP WITH TIME ZONE,
  data_envio_portal TIMESTAMP WITH TIME ZONE,
  data_resposta_fornecedor TIMESTAMP WITH TIME ZONE,
  data_entrega_solicitada DATE NOT NULL,
  
  -- Valores
  valor_total DECIMAL(15,2) NOT NULL DEFAULT 0,
  moeda VARCHAR(3) NOT NULL DEFAULT 'BRL',
  
  -- Condições comerciais
  condicoes_pagamento TEXT,
  observacoes TEXT,
  centro_custo VARCHAR(50),
  
  -- Integração com portal do fornecedor
  portal_pedido_id VARCHAR(100),
  status_portal VARCHAR(30),
  
  -- Controle de usuário
  criado_por UUID NOT NULL,
  aprovado_por UUID,
  empresa_id UUID NOT NULL DEFAULT gen_random_uuid(), -- assumindo estrutura multi-tenant
  versao INTEGER NOT NULL DEFAULT 1,
  
  -- Audit trail
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  -- Constraints
  CONSTRAINT chk_valor_positivo CHECK (valor_total >= 0),
  CONSTRAINT chk_data_entrega_futura CHECK (data_entrega_solicitada >= CURRENT_DATE)
);

-- Tabela de itens do pedido
CREATE TABLE public.itens_pedido (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID NOT NULL REFERENCES public.pedidos(id) ON DELETE CASCADE,
  
  -- Identificação do item
  sequencia INTEGER NOT NULL,
  codigo_produto VARCHAR(100),
  codigo_interno VARCHAR(100),
  
  -- Descrição
  descricao TEXT NOT NULL,
  especificacao TEXT,
  observacoes TEXT,
  
  -- Quantidades e valores
  quantidade DECIMAL(12,4) NOT NULL,
  unidade VARCHAR(20) NOT NULL,
  preco_unitario DECIMAL(12,4) NOT NULL,
  valor_total DECIMAL(15,2) NOT NULL,
  
  -- Datas e local
  data_entrega_item DATE,
  local_entrega TEXT,
  
  -- Classificação
  categoria_id UUID,
  subcategoria_id UUID,
  centro_custo_item VARCHAR(50),
  
  -- Controle
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT chk_quantidade_positiva CHECK (quantidade > 0),
  CONSTRAINT chk_preco_positivo CHECK (preco_unitario > 0),
  UNIQUE (pedido_id, sequencia)
);

-- Tabela de aprovações
CREATE TABLE public.aprovacoes_pedido (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID NOT NULL REFERENCES public.pedidos(id) ON DELETE CASCADE,
  
  -- Workflow
  nivel INTEGER NOT NULL,
  tipo_aprovacao tipo_aprovacao NOT NULL DEFAULT 'individual',
  status_aprovacao status_aprovacao NOT NULL DEFAULT 'pendente',
  
  -- Aprovador
  aprovador_id UUID NOT NULL,
  data_solicitacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  data_aprovacao TIMESTAMP WITH TIME ZONE,
  data_expiracao TIMESTAMP WITH TIME ZONE,
  
  -- Detalhes
  comentarios TEXT,
  motivo_rejeicao TEXT,
  anexos JSONB DEFAULT '[]',
  
  -- Audit
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabela de integrações com portal
CREATE TABLE public.integracoes_portal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID NOT NULL REFERENCES public.pedidos(id) ON DELETE CASCADE,
  
  -- Dados da integração
  tipo_operacao tipo_operacao_portal NOT NULL,
  status_integracao status_integracao NOT NULL DEFAULT 'pendente',
  tentativa INTEGER NOT NULL DEFAULT 1,
  
  -- Request/Response
  dados_enviados JSONB,
  resposta_recebida JSONB,
  erro_integracao TEXT,
  
  -- Portal
  portal_pedido_id VARCHAR(100),
  portal_url VARCHAR(500),
  
  -- Timing
  data_tentativa TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  data_sucesso TIMESTAMP WITH TIME ZONE,
  proxima_tentativa TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  ip_origem INET,
  user_agent TEXT,
  headers_request JSONB,
  
  -- Audit
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabela de anexos
CREATE TABLE public.anexos_pedido (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID REFERENCES public.pedidos(id) ON DELETE CASCADE,
  item_id UUID REFERENCES public.itens_pedido(id) ON DELETE CASCADE,
  
  -- Arquivo
  nome_arquivo VARCHAR(255) NOT NULL,
  nome_original VARCHAR(255) NOT NULL,
  tipo_mime VARCHAR(100) NOT NULL,
  tamanho_bytes BIGINT NOT NULL,
  
  -- Storage
  bucket VARCHAR(100),
  caminho_arquivo TEXT NOT NULL,
  url_publica TEXT,
  
  -- Metadata
  descricao TEXT,
  tipo_anexo VARCHAR(50),
  
  -- Controle
  criado_por UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT chk_tamanho_arquivo CHECK (tamanho_bytes > 0),
  CONSTRAINT chk_apenas_uma_referencia CHECK (
    (pedido_id IS NOT NULL)::int + 
    (item_id IS NOT NULL)::int = 1
  )
);

-- Tabela de histórico/auditoria
CREATE TABLE public.historico_pedido (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID NOT NULL REFERENCES public.pedidos(id) ON DELETE CASCADE,
  
  -- Evento
  evento VARCHAR(50) NOT NULL,
  status_anterior VARCHAR(30),
  status_novo VARCHAR(30),
  
  -- Dados da alteração
  dados_anteriores JSONB,
  dados_novos JSONB,
  campos_alterados TEXT[],
  
  -- Usuário e contexto
  usuario_id UUID,
  ip_address INET,
  user_agent TEXT,
  origem VARCHAR(50), -- web, mobile, api, sistema, webhook
  
  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Função para gerar número do pedido automaticamente
CREATE OR REPLACE FUNCTION public.gerar_numero_pedido()
RETURNS TRIGGER AS $$
DECLARE
  novo_numero VARCHAR(20);
  contador INTEGER;
BEGIN
  -- Buscar o próximo número sequencial para o ano atual
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(numero_pedido FROM 'PO-' || EXTRACT(YEAR FROM NOW())::text || '-(.*)') AS INTEGER)
  ), 0) + 1
  INTO contador
  FROM public.pedidos
  WHERE numero_pedido LIKE 'PO-' || EXTRACT(YEAR FROM NOW())::text || '-%';
  
  -- Gerar número no formato PO-YYYY-NNNNNN
  novo_numero := 'PO-' || EXTRACT(YEAR FROM NOW())::text || '-' || LPAD(contador::text, 6, '0');
  
  NEW.numero_pedido := novo_numero;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para gerar número automaticamente
CREATE TRIGGER trigger_gerar_numero_pedido
  BEFORE INSERT ON public.pedidos
  FOR EACH ROW
  WHEN (NEW.numero_pedido IS NULL OR NEW.numero_pedido = '')
  EXECUTE FUNCTION public.gerar_numero_pedido();

-- Função para atualizar valor total do pedido
CREATE OR REPLACE FUNCTION public.atualizar_valor_total_pedido()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualizar valor total do pedido
  UPDATE public.pedidos 
  SET valor_total = (
    SELECT COALESCE(SUM(valor_total), 0)
    FROM public.itens_pedido 
    WHERE pedido_id = COALESCE(NEW.pedido_id, OLD.pedido_id)
  ),
  updated_at = NOW()
  WHERE id = COALESCE(NEW.pedido_id, OLD.pedido_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar valor total automaticamente
CREATE TRIGGER trigger_atualizar_valor_total_insert
  AFTER INSERT ON public.itens_pedido
  FOR EACH ROW
  EXECUTE FUNCTION public.atualizar_valor_total_pedido();

CREATE TRIGGER trigger_atualizar_valor_total_update
  AFTER UPDATE ON public.itens_pedido
  FOR EACH ROW
  EXECUTE FUNCTION public.atualizar_valor_total_pedido();

CREATE TRIGGER trigger_atualizar_valor_total_delete
  AFTER DELETE ON public.itens_pedido
  FOR EACH ROW
  EXECUTE FUNCTION public.atualizar_valor_total_pedido();

-- Função para registrar histórico
CREATE OR REPLACE FUNCTION public.registrar_historico_pedido()
RETURNS TRIGGER AS $$
BEGIN
  -- Registrar no histórico apenas mudanças de status
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.historico_pedido (
      pedido_id, evento, status_anterior, status_novo,
      dados_anteriores, dados_novos, usuario_id, origem
    ) VALUES (
      NEW.id, 'status_alterado', OLD.status::text, NEW.status::text,
      row_to_json(OLD), row_to_json(NEW), NEW.criado_por, 'web'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para histórico
CREATE TRIGGER trigger_historico_pedido
  AFTER UPDATE ON public.pedidos
  FOR EACH ROW
  EXECUTE FUNCTION public.registrar_historico_pedido();

-- Índices para performance
CREATE INDEX idx_pedidos_numero ON public.pedidos(numero_pedido);
CREATE INDEX idx_pedidos_fornecedor ON public.pedidos(fornecedor_id);
CREATE INDEX idx_pedidos_status ON public.pedidos(status);
CREATE INDEX idx_pedidos_empresa ON public.pedidos(empresa_id);
CREATE INDEX idx_pedidos_criador ON public.pedidos(criado_por);
CREATE INDEX idx_pedidos_data_criacao ON public.pedidos(data_criacao);
CREATE INDEX idx_pedidos_portal_id ON public.pedidos(portal_pedido_id);

CREATE INDEX idx_itens_pedido ON public.itens_pedido(pedido_id);
CREATE INDEX idx_itens_sequencia ON public.itens_pedido(pedido_id, sequencia);
CREATE INDEX idx_itens_categoria ON public.itens_pedido(categoria_id);

CREATE INDEX idx_aprovacoes_pedido ON public.aprovacoes_pedido(pedido_id);
CREATE INDEX idx_aprovacoes_aprovador ON public.aprovacoes_pedido(aprovador_id);
CREATE INDEX idx_aprovacoes_status ON public.aprovacoes_pedido(status_aprovacao);
CREATE INDEX idx_aprovacoes_data ON public.aprovacoes_pedido(data_solicitacao);

CREATE INDEX idx_integracoes_pedido ON public.integracoes_portal(pedido_id);
CREATE INDEX idx_integracoes_status ON public.integracoes_portal(status_integracao);
CREATE INDEX idx_integracoes_tipo ON public.integracoes_portal(tipo_operacao);
CREATE INDEX idx_integracoes_data ON public.integracoes_portal(data_tentativa);

CREATE INDEX idx_anexos_pedido ON public.anexos_pedido(pedido_id);
CREATE INDEX idx_anexos_item ON public.anexos_pedido(item_id);

CREATE INDEX idx_historico_pedido ON public.historico_pedido(pedido_id);
CREATE INDEX idx_historico_evento ON public.historico_pedido(evento);
CREATE INDEX idx_historico_data ON public.historico_pedido(created_at);
CREATE INDEX idx_historico_usuario ON public.historico_pedido(usuario_id);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itens_pedido ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aprovacoes_pedido ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integracoes_portal ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anexos_pedido ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historico_pedido ENABLE ROW LEVEL SECURITY;

-- Políticas RLS básicas (para desenvolvimento - ajustar conforme autenticação)
CREATE POLICY "Permitir acesso completo aos pedidos" 
ON public.pedidos 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Permitir acesso completo aos itens" 
ON public.itens_pedido 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Permitir acesso completo às aprovações" 
ON public.aprovacoes_pedido 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Permitir acesso completo às integrações" 
ON public.integracoes_portal 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Permitir acesso completo aos anexos" 
ON public.anexos_pedido 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Permitir acesso completo ao histórico" 
ON public.historico_pedido 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Criar storage bucket para anexos de pedidos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('pedidos-anexos', 'pedidos-anexos', false);

-- Políticas de storage para anexos
CREATE POLICY "Permitir upload de anexos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'pedidos-anexos');

CREATE POLICY "Permitir leitura de anexos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'pedidos-anexos');

CREATE POLICY "Permitir atualização de anexos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'pedidos-anexos');

CREATE POLICY "Permitir exclusão de anexos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'pedidos-anexos');

-- Inserir dados de exemplo
INSERT INTO public.pedidos (
  fornecedor_id, data_entrega_solicitada, condicoes_pagamento,
  observacoes, centro_custo, criado_por, valor_total
) VALUES 
(
  '1', '2025-08-15', '30 dias',
  'Pedido de exemplo para materiais de escritório', 'CC001',
  gen_random_uuid(), 2500.00
),
(
  '2', '2025-08-20', '15 dias',
  'Pedido urgente para equipamentos', 'CC002',
  gen_random_uuid(), 15000.00
);

-- Inserir itens de exemplo
INSERT INTO public.itens_pedido (
  pedido_id, sequencia, descricao, quantidade, unidade, 
  preco_unitario, valor_total
) 
SELECT 
  p.id, 1, 'Papel A4 75g/m²', 10, 'Pacote', 25.00, 250.00
FROM public.pedidos p 
WHERE p.fornecedor_id = '1'
LIMIT 1;

INSERT INTO public.itens_pedido (
  pedido_id, sequencia, descricao, quantidade, unidade, 
  preco_unitario, valor_total
) 
SELECT 
  p.id, 2, 'Canetas esferográficas azuis', 50, 'Unidade', 1.50, 75.00
FROM public.pedidos p 
WHERE p.fornecedor_id = '1'
LIMIT 1;
-- Criar tipos ENUM para requisições
CREATE TYPE public.status_requisicao AS ENUM (
  'rascunho',
  'enviada',
  'em_aprovacao',
  'aprovada',
  'rejeitada',
  'em_cotacao',
  'cotacao_recebida',
  'finalizada',
  'cancelada'
);

CREATE TYPE public.prioridade_requisicao AS ENUM (
  'baixa',
  'media',
  'alta',
  'urgente'
);

CREATE TYPE public.tipo_requisicao AS ENUM (
  'material',
  'servico',
  'equipamento',
  'software',
  'infraestrutura',
  'outros'
);

CREATE TYPE public.status_aprovacao_req AS ENUM (
  'pendente',
  'aprovada',
  'rejeitada',
  'delegada'
);

-- Tabela principal de requisições
CREATE TABLE public.requisicoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_requisicao VARCHAR(50) UNIQUE NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT,
  tipo tipo_requisicao NOT NULL DEFAULT 'material',
  status status_requisicao NOT NULL DEFAULT 'rascunho',
  prioridade prioridade_requisicao NOT NULL DEFAULT 'media',
  
  -- Datas
  data_criacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_necessidade DATE NOT NULL,
  data_aprovacao TIMESTAMP WITH TIME ZONE,
  data_finalizacao TIMESTAMP WITH TIME ZONE,
  
  -- Valores
  valor_estimado NUMERIC(15,2) DEFAULT 0,
  valor_aprovado NUMERIC(15,2),
  
  -- Responsáveis
  solicitante_id UUID NOT NULL,
  solicitante_nome TEXT NOT NULL,
  solicitante_area TEXT NOT NULL,
  aprovador_atual_id UUID,
  aprovador_atual_nome TEXT,
  
  -- Justificativas
  justificativa TEXT,
  observacoes TEXT,
  
  -- Centro de custo
  centro_custo VARCHAR(50),
  conta_contabil VARCHAR(50),
  
  -- Integração
  cotacao_id UUID,
  pedido_id UUID,
  
  -- Auditoria
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Tabela de itens da requisição
CREATE TABLE public.itens_requisicao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requisicao_id UUID NOT NULL REFERENCES requisicoes(id) ON DELETE CASCADE,
  sequencia INTEGER NOT NULL,
  
  -- Produto/Serviço
  codigo_produto VARCHAR(100),
  descricao TEXT NOT NULL,
  especificacao TEXT,
  unidade VARCHAR(20) NOT NULL DEFAULT 'UN',
  quantidade NUMERIC(10,3) NOT NULL,
  
  -- Valores
  preco_estimado NUMERIC(15,2) DEFAULT 0,
  valor_total_estimado NUMERIC(15,2) GENERATED ALWAYS AS (quantidade * preco_estimado) STORED,
  
  -- Entrega
  data_necessidade DATE,
  local_entrega TEXT,
  
  -- Observações
  observacoes TEXT,
  urgente BOOLEAN DEFAULT false,
  
  -- Auditoria
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(requisicao_id, sequencia)
);

-- Tabela de workflow de aprovação
CREATE TABLE public.aprovacoes_requisicao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requisicao_id UUID NOT NULL REFERENCES requisicoes(id) ON DELETE CASCADE,
  
  -- Hierarquia
  nivel INTEGER NOT NULL,
  ordem INTEGER NOT NULL,
  
  -- Aprovador
  aprovador_id UUID NOT NULL,
  aprovador_nome TEXT NOT NULL,
  aprovador_cargo TEXT,
  aprovador_area TEXT,
  
  -- Status
  status status_aprovacao_req NOT NULL DEFAULT 'pendente',
  
  -- Datas
  data_solicitacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_resposta TIMESTAMP WITH TIME ZONE,
  data_expiracao TIMESTAMP WITH TIME ZONE,
  
  -- Feedback
  comentarios TEXT,
  motivo_rejeicao TEXT,
  condicoes_aprovacao TEXT,
  
  -- Delegação
  delegado_para_id UUID,
  delegado_para_nome TEXT,
  motivo_delegacao TEXT,
  
  -- Auditoria
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(requisicao_id, nivel, ordem)
);

-- Tabela de histórico e comentários
CREATE TABLE public.historico_requisicao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requisicao_id UUID NOT NULL REFERENCES requisicoes(id) ON DELETE CASCADE,
  
  -- Evento
  evento VARCHAR(100) NOT NULL,
  descricao TEXT,
  
  -- Mudanças de status
  status_anterior VARCHAR(50),
  status_novo VARCHAR(50),
  
  -- Dados alterados
  dados_anteriores JSONB,
  dados_novos JSONB,
  campos_alterados TEXT[],
  
  -- Comentários e comunicação
  comentario TEXT,
  publico BOOLEAN DEFAULT true,
  
  -- Responsável
  usuario_id UUID,
  usuario_nome TEXT NOT NULL,
  usuario_area TEXT,
  
  -- Contexto técnico
  ip_address INET,
  user_agent TEXT,
  origem VARCHAR(50) DEFAULT 'web',
  
  -- Auditoria
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de anexos da requisição
CREATE TABLE public.anexos_requisicao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requisicao_id UUID NOT NULL REFERENCES requisicoes(id) ON DELETE CASCADE,
  item_id UUID REFERENCES itens_requisicao(id) ON DELETE CASCADE,
  
  -- Arquivo
  nome_arquivo VARCHAR(255) NOT NULL,
  nome_original VARCHAR(255) NOT NULL,
  tipo_mime VARCHAR(100) NOT NULL,
  tamanho_bytes BIGINT NOT NULL,
  
  -- Storage
  bucket VARCHAR(100) DEFAULT 'requisicoes-anexos',
  caminho_arquivo TEXT NOT NULL,
  url_publica TEXT,
  
  -- Metadados
  descricao TEXT,
  tipo_anexo VARCHAR(50), -- 'especificacao', 'orcamento', 'imagem', 'documento'
  
  -- Responsável
  enviado_por UUID NOT NULL,
  enviado_por_nome TEXT NOT NULL,
  
  -- Auditoria
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_requisicoes_status ON requisicoes(status);
CREATE INDEX idx_requisicoes_prioridade ON requisicoes(prioridade);
CREATE INDEX idx_requisicoes_solicitante ON requisicoes(solicitante_id);
CREATE INDEX idx_requisicoes_data_criacao ON requisicoes(data_criacao);
CREATE INDEX idx_requisicoes_data_necessidade ON requisicoes(data_necessidade);

CREATE INDEX idx_aprovacoes_requisicao_aprovador ON aprovacoes_requisicao(aprovador_id);
CREATE INDEX idx_aprovacoes_requisicao_status ON aprovacoes_requisicao(status);
CREATE INDEX idx_aprovacoes_requisicao_nivel ON aprovacoes_requisicao(requisicao_id, nivel, ordem);

CREATE INDEX idx_historico_requisicao_data ON historico_requisicao(requisicao_id, created_at DESC);
CREATE INDEX idx_historico_requisicao_evento ON historico_requisicao(evento);

-- Função para gerar número da requisição
CREATE OR REPLACE FUNCTION public.gerar_numero_requisicao()
RETURNS TRIGGER AS $$
DECLARE
  novo_numero VARCHAR(50);
  contador INTEGER;
BEGIN
  -- Buscar o próximo número sequencial para o ano atual
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(numero_requisicao FROM 'REQ-' || EXTRACT(YEAR FROM NOW())::text || '-(.*)') AS INTEGER)
  ), 0) + 1
  INTO contador
  FROM public.requisicoes
  WHERE numero_requisicao LIKE 'REQ-' || EXTRACT(YEAR FROM NOW())::text || '-%';
  
  -- Gerar número no formato REQ-YYYY-NNNNNN
  novo_numero := 'REQ-' || EXTRACT(YEAR FROM NOW())::text || '-' || LPAD(contador::text, 6, '0');
  
  NEW.numero_requisicao := novo_numero;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para gerar número da requisição
CREATE TRIGGER trigger_gerar_numero_requisicao
  BEFORE INSERT ON public.requisicoes
  FOR EACH ROW
  EXECUTE FUNCTION public.gerar_numero_requisicao();

-- Função para atualizar valor total da requisição
CREATE OR REPLACE FUNCTION public.atualizar_valor_total_requisicao()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualizar valor estimado da requisição
  UPDATE public.requisicoes 
  SET valor_estimado = (
    SELECT COALESCE(SUM(valor_total_estimado), 0)
    FROM public.itens_requisicao 
    WHERE requisicao_id = COALESCE(NEW.requisicao_id, OLD.requisicao_id)
  ),
  updated_at = NOW()
  WHERE id = COALESCE(NEW.requisicao_id, OLD.requisicao_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar valor total
CREATE TRIGGER trigger_atualizar_valor_total_requisicao
  AFTER INSERT OR UPDATE OR DELETE ON public.itens_requisicao
  FOR EACH ROW
  EXECUTE FUNCTION public.atualizar_valor_total_requisicao();

-- Função para registrar histórico automático
CREATE OR REPLACE FUNCTION public.registrar_historico_requisicao()
RETURNS TRIGGER AS $$
BEGIN
  -- Registrar mudanças de status
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.historico_requisicao (
      requisicao_id, evento, status_anterior, status_novo,
      dados_anteriores, dados_novos, usuario_nome, origem
    ) VALUES (
      NEW.id, 'status_alterado', OLD.status::text, NEW.status::text,
      row_to_json(OLD), row_to_json(NEW), 
      COALESCE(NEW.aprovador_atual_nome, 'Sistema'), 'sistema'
    );
  END IF;
  
  -- Registrar criação
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.historico_requisicao (
      requisicao_id, evento, descricao, usuario_nome, origem
    ) VALUES (
      NEW.id, 'requisicao_criada', 
      'Requisição criada: ' || NEW.titulo,
      NEW.solicitante_nome, 'web'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para histórico automático
CREATE TRIGGER trigger_registrar_historico_requisicao
  AFTER INSERT OR UPDATE ON public.requisicoes
  FOR EACH ROW
  EXECUTE FUNCTION public.registrar_historico_requisicao();

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION public.update_requisicao_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para updated_at
CREATE TRIGGER trigger_update_requisicao_updated_at
  BEFORE UPDATE ON public.requisicoes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_requisicao_updated_at();

CREATE TRIGGER trigger_update_itens_requisicao_updated_at
  BEFORE UPDATE ON public.itens_requisicao
  FOR EACH ROW
  EXECUTE FUNCTION public.update_requisicao_updated_at();

CREATE TRIGGER trigger_update_aprovacoes_requisicao_updated_at
  BEFORE UPDATE ON public.aprovacoes_requisicao
  FOR EACH ROW
  EXECUTE FUNCTION public.update_requisicao_updated_at();

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.requisicoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itens_requisicao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aprovacoes_requisicao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historico_requisicao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anexos_requisicao ENABLE ROW LEVEL SECURITY;

-- Políticas RLS (permitindo acesso completo por enquanto)
CREATE POLICY "Permitir acesso completo às requisições" 
ON public.requisicoes FOR ALL 
USING (true) WITH CHECK (true);

CREATE POLICY "Permitir acesso completo aos itens" 
ON public.itens_requisicao FOR ALL 
USING (true) WITH CHECK (true);

CREATE POLICY "Permitir acesso completo às aprovações" 
ON public.aprovacoes_requisicao FOR ALL 
USING (true) WITH CHECK (true);

CREATE POLICY "Permitir acesso completo ao histórico" 
ON public.historico_requisicao FOR ALL 
USING (true) WITH CHECK (true);

CREATE POLICY "Permitir acesso completo aos anexos" 
ON public.anexos_requisicao FOR ALL 
USING (true) WITH CHECK (true);

-- Criar bucket para anexos de requisições
INSERT INTO storage.buckets (id, name, public) 
VALUES ('requisicoes-anexos', 'requisicoes-anexos', false)
ON CONFLICT (id) DO NOTHING;

-- Políticas para storage de anexos
CREATE POLICY "Permitir upload de anexos" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'requisicoes-anexos');

CREATE POLICY "Permitir visualização de anexos" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'requisicoes-anexos');

CREATE POLICY "Permitir atualização de anexos" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'requisicoes-anexos');

CREATE POLICY "Permitir exclusão de anexos" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'requisicoes-anexos');
-- Criar tabela para solicitações de sourcing (passagem de bastão automática)
CREATE TABLE public.solicitacoes_sourcing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requisicao_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'nova' CHECK (status IN ('nova', 'processando', 'projeto_criado', 'rejeitada')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  processed_by UUID,
  auto_created_project_id UUID,
  recomendacoes_fornecedores JSONB DEFAULT '[]'::jsonb,
  valor_estimado NUMERIC,
  categoria TEXT,
  observacoes TEXT
);

-- Criar tabela para projetos de sourcing reais
CREATE TABLE public.projetos_sourcing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo_projeto VARCHAR(50) UNIQUE,
  solicitacao_sourcing_id UUID,
  requisicao_origem_id UUID,
  nome_projeto TEXT NOT NULL,
  descricao TEXT,
  tipo_evento TEXT NOT NULL DEFAULT 'rfq' CHECK (tipo_evento IN ('rfq', 'rfp', 'leilao')),
  status TEXT NOT NULL DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'ativo', 'finalizado', 'cancelado')),
  valor_estimado NUMERIC,
  data_abertura TIMESTAMP WITH TIME ZONE,
  data_fechamento TIMESTAMP WITH TIME ZONE,
  data_limite_resposta TIMESTAMP WITH TIME ZONE,
  criterios_avaliacao JSONB DEFAULT '{}'::jsonb,
  fornecedores_convidados JSONB DEFAULT '[]'::jsonb,
  fornecedor_vencedor_id TEXT,
  proposta_vencedora JSONB,
  criado_por UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.solicitacoes_sourcing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projetos_sourcing ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Permitir acesso completo às solicitações de sourcing" 
ON public.solicitacoes_sourcing FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Permitir acesso completo aos projetos de sourcing" 
ON public.projetos_sourcing FOR ALL USING (true) WITH CHECK (true);

-- Índices para performance
CREATE INDEX idx_solicitacoes_sourcing_requisicao ON public.solicitacoes_sourcing(requisicao_id);
CREATE INDEX idx_solicitacoes_sourcing_status ON public.solicitacoes_sourcing(status);
CREATE INDEX idx_projetos_sourcing_solicitacao ON public.projetos_sourcing(solicitacao_sourcing_id);
CREATE INDEX idx_projetos_sourcing_status ON public.projetos_sourcing(status);

-- Função para gerar código do projeto sourcing
CREATE OR REPLACE FUNCTION public.gerar_codigo_sourcing()
RETURNS TRIGGER AS $$
DECLARE
  novo_codigo VARCHAR(50);
  contador INTEGER;
BEGIN
  -- Buscar o próximo número sequencial para o ano atual
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(codigo_projeto FROM 'SRC-' || EXTRACT(YEAR FROM NOW())::text || '-(.*)') AS INTEGER)
  ), 0) + 1
  INTO contador
  FROM public.projetos_sourcing
  WHERE codigo_projeto LIKE 'SRC-' || EXTRACT(YEAR FROM NOW())::text || '-%';
  
  -- Gerar código no formato SRC-YYYY-NNNNNN
  novo_codigo := 'SRC-' || EXTRACT(YEAR FROM NOW())::text || '-' || LPAD(contador::text, 6, '0');
  
  NEW.codigo_projeto := novo_codigo;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para gerar código automaticamente
CREATE TRIGGER trigger_gerar_codigo_sourcing
  BEFORE INSERT ON public.projetos_sourcing
  FOR EACH ROW
  WHEN (NEW.codigo_projeto IS NULL)
  EXECUTE FUNCTION public.gerar_codigo_sourcing();

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_sourcing_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para updated_at
CREATE TRIGGER update_sourcing_updated_at
  BEFORE UPDATE ON public.projetos_sourcing
  FOR EACH ROW
  EXECUTE FUNCTION public.update_sourcing_updated_at();

-- Função para criar solicitação de sourcing automaticamente
CREATE OR REPLACE FUNCTION public.criar_solicitacao_sourcing()
RETURNS TRIGGER AS $$
DECLARE
  recomendacoes JSONB;
BEGIN
  -- Verificar se requisição foi aprovada e valor >= 1000
  IF NEW.status = 'aprovada' AND OLD.status != 'aprovada' AND NEW.valor_estimado >= 1000 THEN
    
    -- Gerar recomendações de fornecedores (simuladas por enquanto)
    recomendacoes := '[
      {
        "fornecedor_id": "1",
        "nome": "Fornecedor Alpha",
        "score": 85,
        "razao": "Histórico excelente na categoria",
        "categoria_match": true,
        "historico_performance": 92
      },
      {
        "fornecedor_id": "2", 
        "nome": "Fornecedor Beta",
        "score": 78,
        "razao": "Preços competitivos",
        "categoria_match": true,
        "historico_performance": 85
      }
    ]'::jsonb;
    
    -- Criar solicitação de sourcing
    INSERT INTO public.solicitacoes_sourcing (
      requisicao_id,
      valor_estimado,
      categoria,
      observacoes,
      recomendacoes_fornecedores
    ) VALUES (
      NEW.id,
      NEW.valor_estimado,
      'categoria_generica', -- pode ser melhorado com dados reais
      'Solicitação criada automaticamente após aprovação da requisição',
      recomendacoes
    );
    
    -- Registrar no histórico da requisição
    INSERT INTO public.historico_requisicao (
      requisicao_id,
      evento,
      descricao,
      usuario_nome,
      origem
    ) VALUES (
      NEW.id,
      'encaminhado_sourcing',
      'Requisição encaminhada automaticamente para Sourcing (valor >= R$ 1.000)',
      'Sistema Automático',
      'sistema'
    );
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para criar solicitação de sourcing automaticamente
CREATE TRIGGER trigger_criar_solicitacao_sourcing
  AFTER UPDATE ON public.requisicoes
  FOR EACH ROW
  EXECUTE FUNCTION public.criar_solicitacao_sourcing();
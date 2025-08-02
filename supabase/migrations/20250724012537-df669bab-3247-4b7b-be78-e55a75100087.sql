-- Criar apenas a tabela de solicitações de sourcing (a tabela projetos_sourcing já existe)
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

-- Habilitar RLS
ALTER TABLE public.solicitacoes_sourcing ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Permitir acesso completo às solicitações de sourcing" 
ON public.solicitacoes_sourcing FOR ALL USING (true) WITH CHECK (true);

-- Índices para performance
CREATE INDEX idx_solicitacoes_sourcing_requisicao ON public.solicitacoes_sourcing(requisicao_id);
CREATE INDEX idx_solicitacoes_sourcing_status ON public.solicitacoes_sourcing(status);

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
      'categoria_generica',
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

-- Trigger para criar pedido automaticamente quando sourcing finalizado
CREATE OR REPLACE FUNCTION public.processar_sourcing_finalizado()
RETURNS TRIGGER AS $$
DECLARE
  projeto_data RECORD;
  itens_sourcing JSONB;
  pedido_id UUID;
BEGIN
  -- Verificar se status mudou para finalizado
  IF NEW.status = 'finalizado' AND OLD.status != 'finalizado' THEN
    
    -- Buscar dados do projeto
    SELECT 
      fornecedor_vencedor_id,
      valor_estimado,
      data_limite_resposta,
      proposta_vencedora,
      criado_por,
      requisicao_origem_id
    INTO projeto_data
    FROM public.projetos_sourcing 
    WHERE id = NEW.id;

    -- Simular itens do sourcing (baseado na proposta vencedora)
    SELECT jsonb_agg(
      jsonb_build_object(
        'descricao', 'Item do Sourcing ' || NEW.codigo_projeto,
        'especificacao', 'Especificação técnica do item',
        'quantidade', 1,
        'unidade', 'UN',
        'preco_unitario', projeto_data.valor_estimado,
        'codigo_produto', 'SRC-' || substr(NEW.id::text, 1, 8),
        'categoria', 'Categoria Sourcing'
      )
    ) INTO itens_sourcing;

    -- Criar pedido automaticamente
    SELECT public.criar_po_automatico(
      'sourcing',
      NEW.id,
      projeto_data.fornecedor_vencedor_id,
      NULL, -- CNPJ será preenchido depois
      NULL, -- Razão social será preenchida depois
      projeto_data.criado_por,
      'Centro de Custo Sourcing',
      NULL,
      projeto_data.data_limite_resposta::date,
      COALESCE(itens_sourcing, '[]'::jsonb),
      'Pedido gerado automaticamente do projeto de sourcing finalizado'
    ) INTO pedido_id;

    -- Atualizar histórico da requisição original se existir
    IF projeto_data.requisicao_origem_id IS NOT NULL THEN
      INSERT INTO public.historico_requisicao (
        requisicao_id,
        evento,
        descricao,
        usuario_nome,
        origem
      ) VALUES (
        projeto_data.requisicao_origem_id,
        'pedido_criado_sourcing',
        'Pedido criado automaticamente após finalização do sourcing ' || NEW.codigo_projeto,
        'Sistema Automático',
        'sistema'
      );
    END IF;
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para processar sourcing finalizado
CREATE TRIGGER trigger_processar_sourcing_finalizado
  AFTER UPDATE ON public.projetos_sourcing
  FOR EACH ROW
  EXECUTE FUNCTION public.processar_sourcing_finalizado();

-- Criar tabela para orçamentos por centro de custo/projeto
CREATE TABLE public.orcamentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ano INTEGER NOT NULL,
  centro_custo VARCHAR(50) NOT NULL,
  projeto VARCHAR(100),
  valor_total NUMERIC(15,2) NOT NULL DEFAULT 0,
  valor_utilizado NUMERIC(15,2) NOT NULL DEFAULT 0,
  valor_reservado NUMERIC(15,2) NOT NULL DEFAULT 0,
  valor_disponivel NUMERIC(15,2) GENERATED ALWAYS AS (valor_total - valor_utilizado - valor_reservado) STORED,
  categoria VARCHAR(100),
  aprovado_por UUID,
  aprovado_em TIMESTAMP WITH TIME ZONE,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(ano, centro_custo, projeto, categoria)
);

-- Criar tabela para reservas orçamentárias
CREATE TABLE public.reserva_orcamentaria (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requisicao_id UUID REFERENCES public.requisicoes(id) ON DELETE CASCADE,
  orcamento_id UUID REFERENCES public.orcamentos(id) ON DELETE CASCADE,
  valor_reservado NUMERIC(15,2) NOT NULL,
  valor_realizado NUMERIC(15,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'ativa' CHECK (status IN ('ativa', 'confirmada', 'cancelada', 'expirada')),
  data_reserva TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_confirmacao TIMESTAMP WITH TIME ZONE,
  data_expiracao TIMESTAMP WITH TIME ZONE,
  motivo_cancelamento TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para regras orçamentárias específicas
CREATE TABLE public.regras_orcamentarias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  ativo BOOLEAN DEFAULT true,
  tipo_condicao VARCHAR(50) NOT NULL, -- 'global', 'por_tipo', 'por_valor', 'por_categoria', 'por_centro_custo'
  condicao_config JSONB DEFAULT '{}',
  nivel_controle VARCHAR(50) DEFAULT 'centro_custo', -- 'projeto', 'centro_custo', 'rubrica'
  percentual_alerta NUMERIC(5,2) DEFAULT 80.0,
  permite_excecao BOOLEAN DEFAULT true,
  emails_notificacao TEXT[],
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para histórico de exceções orçamentárias
CREATE TABLE public.excecoes_orcamentarias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requisicao_id UUID REFERENCES public.requisicoes(id) ON DELETE CASCADE,
  orcamento_id UUID REFERENCES public.orcamentos(id),
  valor_excedente NUMERIC(15,2) NOT NULL,
  justificativa TEXT NOT NULL,
  aprovada_por UUID,
  aprovada_em TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovada', 'rejeitada')),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_orcamentos_centro_custo ON public.orcamentos(centro_custo);
CREATE INDEX idx_orcamentos_ano ON public.orcamentos(ano);
CREATE INDEX idx_reserva_orcamentaria_requisicao ON public.reserva_orcamentaria(requisicao_id);
CREATE INDEX idx_reserva_orcamentaria_status ON public.reserva_orcamentaria(status);
CREATE INDEX idx_regras_orcamentarias_ativo ON public.regras_orcamentarias(ativo);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_orcamento_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER trigger_update_orcamentos_updated_at
  BEFORE UPDATE ON public.orcamentos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_orcamento_updated_at();

CREATE TRIGGER trigger_update_reserva_orcamentaria_updated_at
  BEFORE UPDATE ON public.reserva_orcamentaria
  FOR EACH ROW
  EXECUTE FUNCTION public.update_orcamento_updated_at();

CREATE TRIGGER trigger_update_regras_orcamentarias_updated_at
  BEFORE UPDATE ON public.regras_orcamentarias
  FOR EACH ROW
  EXECUTE FUNCTION public.update_orcamento_updated_at();

CREATE TRIGGER trigger_update_excecoes_orcamentarias_updated_at
  BEFORE UPDATE ON public.excecoes_orcamentarias
  FOR EACH ROW
  EXECUTE FUNCTION public.update_orcamento_updated_at();

-- Função para verificar se deve aplicar controle orçamentário
CREATE OR REPLACE FUNCTION public.should_apply_budget_control(
  p_tipo_requisicao tipo_requisicao,
  p_valor_estimado NUMERIC,
  p_centro_custo VARCHAR,
  p_categoria VARCHAR DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  regra RECORD;
  should_apply BOOLEAN := FALSE;
BEGIN
  -- Buscar regras ativas
  FOR regra IN 
    SELECT * FROM public.regras_orcamentarias 
    WHERE ativo = true 
    ORDER BY created_at
  LOOP
    -- Verificar tipo de condição
    CASE regra.tipo_condicao
      WHEN 'global' THEN
        should_apply := TRUE;
      WHEN 'por_tipo' THEN
        IF (regra.condicao_config->>'tipos')::jsonb ? p_tipo_requisicao::text THEN
          should_apply := TRUE;
        END IF;
      WHEN 'por_valor' THEN
        IF p_valor_estimado >= (regra.condicao_config->>'valor_minimo')::numeric THEN
          should_apply := TRUE;
        END IF;
      WHEN 'por_centro_custo' THEN
        IF (regra.condicao_config->>'centros_custo')::jsonb ? p_centro_custo THEN
          should_apply := TRUE;
        END IF;
      WHEN 'por_categoria' THEN
        IF p_categoria IS NOT NULL AND (regra.condicao_config->>'categorias')::jsonb ? p_categoria THEN
          should_apply := TRUE;
        END IF;
    END CASE;
    
    -- Se uma regra se aplica, parar a verificação
    IF should_apply THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN should_apply;
END;
$$ LANGUAGE plpgsql;

-- Função para criar/atualizar reserva orçamentária
CREATE OR REPLACE FUNCTION public.create_budget_reservation(
  p_requisicao_id UUID,
  p_centro_custo VARCHAR,
  p_valor_reservado NUMERIC,
  p_categoria VARCHAR DEFAULT NULL,
  p_projeto VARCHAR DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  orcamento_id UUID;
  reserva_id UUID;
  ano_atual INTEGER := EXTRACT(YEAR FROM NOW());
BEGIN
  -- Buscar orçamento correspondente
  SELECT id INTO orcamento_id 
  FROM public.orcamentos 
  WHERE ano = ano_atual 
    AND centro_custo = p_centro_custo
    AND (projeto = p_projeto OR (projeto IS NULL AND p_projeto IS NULL))
    AND (categoria = p_categoria OR (categoria IS NULL AND p_categoria IS NULL))
  LIMIT 1;
  
  -- Se não encontrar orçamento, criar um
  IF orcamento_id IS NULL THEN
    INSERT INTO public.orcamentos (ano, centro_custo, projeto, categoria, valor_total)
    VALUES (ano_atual, p_centro_custo, p_projeto, p_categoria, 0)
    RETURNING id INTO orcamento_id;
  END IF;
  
  -- Criar reserva
  INSERT INTO public.reserva_orcamentaria (
    requisicao_id, orcamento_id, valor_reservado, data_expiracao
  ) VALUES (
    p_requisicao_id, orcamento_id, p_valor_reservado, 
    NOW() + INTERVAL '30 days'
  )
  RETURNING id INTO reserva_id;
  
  RETURN reserva_id;
END;
$$ LANGUAGE plpgsql;

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.orcamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reserva_orcamentaria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regras_orcamentarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.excecoes_orcamentarias ENABLE ROW LEVEL SECURITY;

-- Políticas RLS (permitindo acesso completo por enquanto)
CREATE POLICY "Permitir acesso completo aos orçamentos" 
ON public.orcamentos FOR ALL 
USING (true) WITH CHECK (true);

CREATE POLICY "Permitir acesso completo às reservas" 
ON public.reserva_orcamentaria FOR ALL 
USING (true) WITH CHECK (true);

CREATE POLICY "Permitir acesso completo às regras" 
ON public.regras_orcamentarias FOR ALL 
USING (true) WITH CHECK (true);

CREATE POLICY "Permitir acesso completo às exceções" 
ON public.excecoes_orcamentarias FOR ALL 
USING (true) WITH CHECK (true);

-- Inserir algumas regras padrão
INSERT INTO public.regras_orcamentarias (nome, tipo_condicao, condicao_config, nivel_controle) VALUES
('Controle Global', 'global', '{}', 'centro_custo'),
('Controle por Valor Alto', 'por_valor', '{"valor_minimo": 10000}', 'centro_custo'),
('Controle por Tipo Material', 'por_tipo', '{"tipos": ["material", "equipamento"]}', 'centro_custo');

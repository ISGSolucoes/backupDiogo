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

-- Função para calcular valor total do item
CREATE OR REPLACE FUNCTION public.calcular_valor_total_item()
RETURNS TRIGGER AS $$
BEGIN
  NEW.valor_total_estimado := NEW.quantidade * NEW.preco_estimado;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION public.update_requisicao_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER trigger_gerar_numero_requisicao
  BEFORE INSERT ON public.requisicoes
  FOR EACH ROW
  EXECUTE FUNCTION public.gerar_numero_requisicao();

CREATE TRIGGER trigger_calcular_valor_total_item
  BEFORE INSERT OR UPDATE ON public.itens_requisicao
  FOR EACH ROW
  EXECUTE FUNCTION public.calcular_valor_total_item();

CREATE TRIGGER trigger_atualizar_valor_total_requisicao
  AFTER INSERT OR UPDATE OR DELETE ON public.itens_requisicao
  FOR EACH ROW
  EXECUTE FUNCTION public.atualizar_valor_total_requisicao();

CREATE TRIGGER trigger_registrar_historico_requisicao
  AFTER INSERT OR UPDATE ON public.requisicoes
  FOR EACH ROW
  EXECUTE FUNCTION public.registrar_historico_requisicao();

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

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.requisicoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itens_requisicao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aprovacoes_requisicao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historico_requisicao ENABLE ROW LEVEL SECURITY;

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
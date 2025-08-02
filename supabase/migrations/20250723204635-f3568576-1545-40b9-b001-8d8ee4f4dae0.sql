-- Criar tabelas para configurações de sourcing

-- Tabela para regras por setor
CREATE TABLE public.sourcing_sector_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setor_codigo VARCHAR(50) NOT NULL,
  setor_nome TEXT NOT NULL,
  evento_padrao TEXT NOT NULL DEFAULT 'rfp',
  leilao_habilitado BOOLEAN NOT NULL DEFAULT true,
  peso_tecnico_minimo INTEGER DEFAULT 30,
  peso_comercial_minimo INTEGER DEFAULT 30,
  campos_obrigatorios TEXT[] DEFAULT '{}',
  campos_ocultos TEXT[] DEFAULT '{}',
  aprovacao_obrigatoria BOOLEAN DEFAULT false,
  valor_minimo_aprovacao NUMERIC DEFAULT 0,
  observacoes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para regras por categoria de compra
CREATE TABLE public.sourcing_category_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  categoria_codigo VARCHAR(50) NOT NULL,
  categoria_nome TEXT NOT NULL,
  setor_codigo VARCHAR(50),
  evento_sugerido TEXT,
  leilao_permitido BOOLEAN DEFAULT true,
  peso_tecnico_sugerido INTEGER,
  peso_comercial_sugerido INTEGER,
  criterios_padrao TEXT[] DEFAULT '{}',
  validacoes_especificas TEXT[] DEFAULT '{}',
  prazo_minimo_dias INTEGER DEFAULT 5,
  prazo_maximo_dias INTEGER DEFAULT 30,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para políticas específicas de clientes
CREATE TABLE public.sourcing_client_policies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_codigo VARCHAR(50) NOT NULL,
  cliente_nome TEXT NOT NULL,
  evento_obrigatorio TEXT,
  leilao_proibido BOOLEAN DEFAULT false,
  peso_tecnico_minimo INTEGER,
  aprovacao_dupla BOOLEAN DEFAULT false,
  documentos_obrigatorios TEXT[] DEFAULT '{}',
  restricoes_fornecedor JSONB DEFAULT '{}',
  prazo_resposta_minimo INTEGER DEFAULT 7,
  observacoes_politica TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para configurações de comportamento de eventos
CREATE TABLE public.sourcing_event_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo_evento VARCHAR(20) NOT NULL,
  nome_exibicao TEXT NOT NULL,
  descricao TEXT,
  tooltip_info TEXT,
  permite_leilao BOOLEAN DEFAULT false,
  peso_tecnico_padrao INTEGER DEFAULT 40,
  peso_comercial_padrao INTEGER DEFAULT 60,
  campos_obrigatorios TEXT[] DEFAULT '{}',
  campos_opcionais TEXT[] DEFAULT '{}',
  prazo_padrao_dias INTEGER DEFAULT 15,
  icone VARCHAR(50),
  cor_tema VARCHAR(20),
  ordem_exibicao INTEGER DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para templates de configuração por departamento
CREATE TABLE public.sourcing_department_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  departamento_codigo VARCHAR(50) NOT NULL,
  departamento_nome TEXT NOT NULL,
  responsavel_nome TEXT,
  responsavel_email TEXT,
  configuracao_padrao JSONB DEFAULT '{}',
  setores_permitidos TEXT[] DEFAULT '{}',
  categorias_permitidas TEXT[] DEFAULT '{}',
  limite_valor_aprovacao NUMERIC DEFAULT 0,
  requer_multiplas_cotacoes BOOLEAN DEFAULT true,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inserir dados iniciais para configurações de eventos
INSERT INTO public.sourcing_event_configurations (tipo_evento, nome_exibicao, descricao, tooltip_info, permite_leilao, peso_tecnico_padrao, peso_comercial_padrao, icone, cor_tema, ordem_exibicao) VALUES
('rfi', 'RFI - Request for Information', 'Solicitação de Informações', 'Usado para coleta inicial de informações sobre fornecedores e soluções. Ideal para mapeamento de mercado.', false, 60, 40, 'Info', 'blue', 1),
('rfp', 'RFP - Request for Proposal', 'Solicitação de Proposta', 'Processo formal de cotação com critérios técnicos e comerciais. Mais adequado para compras complexas.', true, 50, 50, 'FileText', 'green', 2),
('rfq', 'RFQ - Request for Quote', 'Solicitação de Cotação', 'Cotação simples focada em preço. Ideal para produtos padronizados e especificações claras.', true, 20, 80, 'Calculator', 'orange', 3),
('leilao', 'Leilão Reverso', 'Leilão Eletrônico', 'Disputa eletrônica onde fornecedores competem em tempo real. Máxima competitividade de preços.', true, 10, 90, 'Gavel', 'red', 4);

-- Inserir dados iniciais para regras por setor
INSERT INTO public.sourcing_sector_rules (setor_codigo, setor_nome, evento_padrao, leilao_habilitado, peso_tecnico_minimo, campos_obrigatorios) VALUES
('industria', 'Indústria', 'rfp', true, 40, '{"especificacao_tecnica","certificacoes","prazo_entrega"}'),
('construcao', 'Construção Civil', 'rfp', true, 50, '{"memorial_descritivo","certidoes","prazo_execucao"}'),
('saude', 'Saúde', 'rfp', false, 60, '{"registro_anvisa","certificacoes","rastreabilidade"}'),
('servicos', 'Serviços', 'rfq', true, 30, '{"escopo_servicos","metodologia","equipe"}'),
('tecnologia', 'Tecnologia', 'rfp', true, 70, '{"arquitetura_solucao","seguranca","integracao"}');

-- Inserir dados iniciais para categorias de compra
INSERT INTO public.sourcing_category_rules (categoria_codigo, categoria_nome, setor_codigo, evento_sugerido, peso_tecnico_sugerido, criterios_padrao) VALUES
('materiais_eletricos', 'Materiais Elétricos', 'industria', 'rfq', 30, '{"certificacao_inmetro","normas_tecnicas","garantia"}'),
('consultoria_estrategica', 'Consultoria Estratégica', 'servicos', 'rfp', 80, '{"metodologia","experiencia","cases_sucesso"}'),
('equipamentos_medicos', 'Equipamentos Médicos', 'saude', 'rfp', 90, '{"registro_anvisa","manutencao","treinamento"}'),
('software_desenvolvimento', 'Desenvolvimento de Software', 'tecnologia', 'rfp', 85, '{"arquitetura","seguranca","documentacao"}');

-- Habilitar RLS
ALTER TABLE public.sourcing_sector_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sourcing_category_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sourcing_client_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sourcing_event_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sourcing_department_templates ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Permitir acesso completo às regras de setor" ON public.sourcing_sector_rules FOR ALL USING (true);
CREATE POLICY "Permitir acesso completo às regras de categoria" ON public.sourcing_category_rules FOR ALL USING (true);
CREATE POLICY "Permitir acesso completo às políticas de cliente" ON public.sourcing_client_policies FOR ALL USING (true);
CREATE POLICY "Permitir acesso completo às configurações de evento" ON public.sourcing_event_configurations FOR ALL USING (true);
CREATE POLICY "Permitir acesso completo aos templates de departamento" ON public.sourcing_department_templates FOR ALL USING (true);

-- Triggers para updated_at
CREATE TRIGGER update_sourcing_sector_rules_updated_at
  BEFORE UPDATE ON public.sourcing_sector_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_sourcing_category_rules_updated_at
  BEFORE UPDATE ON public.sourcing_category_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_sourcing_client_policies_updated_at
  BEFORE UPDATE ON public.sourcing_client_policies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_sourcing_event_configurations_updated_at
  BEFORE UPDATE ON public.sourcing_event_configurations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_sourcing_department_templates_updated_at
  BEFORE UPDATE ON public.sourcing_department_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Criar tabela principal de fornecedores (entidade base)
CREATE TABLE public.fornecedores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo_documento TEXT NOT NULL CHECK (tipo_documento IN ('cnpj', 'cpf')),
  documento TEXT NOT NULL, -- CNPJ ou CPF limpo (apenas números)
  documento_formatado TEXT NOT NULL, -- CNPJ/CPF formatado
  
  -- Dados da pessoa jurídica (CNPJ)
  razao_social TEXT,
  nome_fantasia TEXT,
  inscricao_estadual TEXT,
  inscricao_municipal TEXT,
  situacao_receita TEXT,
  porte_empresa TEXT,
  natureza_juridica TEXT,
  
  -- Dados da pessoa física (CPF)
  nome_completo TEXT,
  rg_ou_cnh TEXT,
  profissao TEXT,
  e_mei BOOLEAN DEFAULT FALSE,
  cnpj_mei TEXT,
  
  -- Dados de atividade econômica
  cnae_principal_codigo TEXT,
  cnae_principal_descricao TEXT,
  cnaes_secundarios JSONB DEFAULT '[]',
  
  -- Controle
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'bloqueado', 'pendente_validacao')),
  data_fundacao DATE,
  validado_receita BOOLEAN DEFAULT FALSE,
  data_validacao_receita TIMESTAMP WITH TIME ZONE,
  ultimo_erro_validacao TEXT,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  
  -- Índices únicos
  UNIQUE(documento, tipo_documento)
);

-- Tabela de contatos do fornecedor (múltiplos contatos por CNPJ)
CREATE TABLE public.contatos_fornecedor (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fornecedor_id UUID NOT NULL REFERENCES public.fornecedores(id) ON DELETE CASCADE,
  
  -- Dados do contato
  nome TEXT NOT NULL,
  sobrenome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  cargo TEXT,
  departamento TEXT,
  
  -- Configurações
  principal BOOLEAN DEFAULT FALSE, -- Contato principal
  ativo BOOLEAN DEFAULT TRUE,
  perfil_acesso TEXT DEFAULT 'operacional' CHECK (perfil_acesso IN ('admin', 'operacional', 'visualizacao')),
  
  -- Controle de acesso
  email_verificado BOOLEAN DEFAULT FALSE,
  data_verificacao_email TIMESTAMP WITH TIME ZONE,
  token_verificacao TEXT,
  ultimo_acesso TIMESTAMP WITH TIME ZONE,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Índices únicos por fornecedor
  UNIQUE(fornecedor_id, email)
);

-- Tabela de unidades operacionais (endereços e filiais)
CREATE TABLE public.unidades_operacionais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fornecedor_id UUID NOT NULL REFERENCES public.fornecedores(id) ON DELETE CASCADE,
  
  -- Identificação da unidade
  nome_unidade TEXT,
  tipo_unidade TEXT DEFAULT 'matriz' CHECK (tipo_unidade IN ('matriz', 'filial', 'deposito', 'escritorio', 'fabrica')),
  codigo_interno TEXT,
  
  -- Endereço completo
  logradouro TEXT NOT NULL,
  numero TEXT NOT NULL,
  complemento TEXT,
  bairro TEXT NOT NULL,
  cidade TEXT NOT NULL,
  estado TEXT NOT NULL,
  cep TEXT NOT NULL,
  pais TEXT NOT NULL DEFAULT 'Brasil',
  
  -- Dados adicionais
  telefone TEXT,
  email TEXT,
  responsavel TEXT,
  
  -- Controle
  ativa BOOLEAN DEFAULT TRUE,
  principal BOOLEAN DEFAULT FALSE, -- Endereço principal
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de categorias de fornecimento por contato
CREATE TABLE public.categorias_fornecimento (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contato_id UUID NOT NULL REFERENCES public.contatos_fornecedor(id) ON DELETE CASCADE,
  
  -- Categorização
  categoria_principal TEXT NOT NULL,
  subcategorias TEXT[],
  descricao_servicos TEXT,
  capacidade_mensal TEXT,
  regiao_atendimento TEXT[],
  
  -- Qualificações
  certificacoes TEXT[],
  referencias_clientes TEXT[],
  portfolio_url TEXT,
  
  -- Controle
  ativa BOOLEAN DEFAULT TRUE,
  data_inicio DATE DEFAULT CURRENT_DATE,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de relacionamentos cliente-fornecedor
CREATE TABLE public.relacionamentos_clientes_fornecedores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fornecedor_id UUID NOT NULL REFERENCES public.fornecedores(id) ON DELETE CASCADE,
  contato_id UUID NOT NULL REFERENCES public.contatos_fornecedor(id) ON DELETE CASCADE,
  
  -- Identificação do cliente (pode vir de diferentes sistemas)
  cliente_codigo TEXT,
  cliente_nome TEXT,
  cliente_cnpj TEXT,
  
  -- Status do relacionamento
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'ativo', 'inativo', 'bloqueado')),
  data_inicio DATE,
  data_aceite TIMESTAMP WITH TIME ZONE,
  data_fim DATE,
  
  -- Controle de convite
  convite_id UUID REFERENCES public.convites_fornecedor(id),
  origem TEXT NOT NULL CHECK (origem IN ('convite_cliente', 'auto_registro', 'migracao')),
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Índice único por relacionamento
  UNIQUE(fornecedor_id, contato_id, cliente_codigo)
);

-- Tabela de aceites (logs de aceite de termos)
CREATE TABLE public.aceites_fornecedor (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contato_id UUID NOT NULL REFERENCES public.contatos_fornecedor(id) ON DELETE CASCADE,
  
  -- Tipo de aceite
  tipo_aceite TEXT NOT NULL CHECK (tipo_aceite IN ('termos_uso', 'politica_privacidade', 'relacionamento_cliente', 'codigo_conduta')),
  versao_documento TEXT NOT NULL,
  
  -- Dados do aceite
  ip_aceite INET,
  user_agent TEXT,
  data_aceite TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Contexto
  relacionamento_id UUID REFERENCES public.relacionamentos_clientes_fornecedores(id),
  detalhes_contexto JSONB DEFAULT '{}',
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Atualizar tabela de convites para incluir relacionamento
ALTER TABLE public.convites_fornecedor ADD COLUMN IF NOT EXISTS cliente_codigo TEXT;
ALTER TABLE public.convites_fornecedor ADD COLUMN IF NOT EXISTS cliente_nome TEXT;
ALTER TABLE public.convites_fornecedor ADD COLUMN IF NOT EXISTS categorias_solicitadas TEXT[];
ALTER TABLE public.convites_fornecedor ADD COLUMN IF NOT EXISTS mensagem_personalizada TEXT;

-- Habilitar RLS em todas as novas tabelas
ALTER TABLE public.fornecedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contatos_fornecedor ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unidades_operacionais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias_fornecimento ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relacionamentos_clientes_fornecedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aceites_fornecedor ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso (temporariamente abertas para desenvolvimento)
CREATE POLICY "Permitir acesso completo aos fornecedores" ON public.fornecedores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acesso completo aos contatos" ON public.contatos_fornecedor FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acesso completo às unidades" ON public.unidades_operacionais FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acesso completo às categorias" ON public.categorias_fornecimento FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acesso completo aos relacionamentos" ON public.relacionamentos_clientes_fornecedores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acesso completo aos aceites" ON public.aceites_fornecedor FOR ALL USING (true) WITH CHECK (true);

-- Índices para performance
CREATE INDEX idx_fornecedores_documento ON public.fornecedores(documento);
CREATE INDEX idx_fornecedores_tipo_documento ON public.fornecedores(tipo_documento);
CREATE INDEX idx_fornecedores_status ON public.fornecedores(status);

CREATE INDEX idx_contatos_fornecedor_id ON public.contatos_fornecedor(fornecedor_id);
CREATE INDEX idx_contatos_email ON public.contatos_fornecedor(email);
CREATE INDEX idx_contatos_principal ON public.contatos_fornecedor(fornecedor_id, principal) WHERE principal = true;

CREATE INDEX idx_unidades_fornecedor_id ON public.unidades_operacionais(fornecedor_id);
CREATE INDEX idx_unidades_principal ON public.unidades_operacionais(fornecedor_id, principal) WHERE principal = true;

CREATE INDEX idx_categorias_contato_id ON public.categorias_fornecimento(contato_id);
CREATE INDEX idx_categorias_ativa ON public.categorias_fornecimento(contato_id, ativa) WHERE ativa = true;

CREATE INDEX idx_relacionamentos_fornecedor ON public.relacionamentos_clientes_fornecedores(fornecedor_id);
CREATE INDEX idx_relacionamentos_contato ON public.relacionamentos_clientes_fornecedores(contato_id);
CREATE INDEX idx_relacionamentos_cliente ON public.relacionamentos_clientes_fornecedores(cliente_codigo);
CREATE INDEX idx_relacionamentos_status ON public.relacionamentos_clientes_fornecedores(status);

CREATE INDEX idx_aceites_contato_id ON public.aceites_fornecedor(contato_id);
CREATE INDEX idx_aceites_tipo ON public.aceites_fornecedor(tipo_aceite);
CREATE INDEX idx_aceites_data ON public.aceites_fornecedor(data_aceite);

-- Functions para atualização automática de updated_at
CREATE OR REPLACE FUNCTION public.update_fornecedores_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_contatos_fornecedor_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_unidades_operacionais_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_categorias_fornecimento_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_relacionamentos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualização automática
CREATE TRIGGER update_fornecedores_updated_at
  BEFORE UPDATE ON public.fornecedores
  FOR EACH ROW
  EXECUTE FUNCTION public.update_fornecedores_updated_at();

CREATE TRIGGER update_contatos_fornecedor_updated_at
  BEFORE UPDATE ON public.contatos_fornecedor
  FOR EACH ROW
  EXECUTE FUNCTION public.update_contatos_fornecedor_updated_at();

CREATE TRIGGER update_unidades_operacionais_updated_at
  BEFORE UPDATE ON public.unidades_operacionais
  FOR EACH ROW
  EXECUTE FUNCTION public.update_unidades_operacionais_updated_at();

CREATE TRIGGER update_categorias_fornecimento_updated_at
  BEFORE UPDATE ON public.categorias_fornecimento
  FOR EACH ROW
  EXECUTE FUNCTION public.update_categorias_fornecimento_updated_at();

CREATE TRIGGER update_relacionamentos_updated_at
  BEFORE UPDATE ON public.relacionamentos_clientes_fornecedores
  FOR EACH ROW
  EXECUTE FUNCTION public.update_relacionamentos_updated_at();

-- Function para validar se só existe um contato principal por fornecedor
CREATE OR REPLACE FUNCTION public.validate_single_principal_contact()
RETURNS TRIGGER AS $$
BEGIN
  -- Se está marcando como principal, remove principal dos outros
  IF NEW.principal = true THEN
    UPDATE public.contatos_fornecedor 
    SET principal = false 
    WHERE fornecedor_id = NEW.fornecedor_id AND id != NEW.id AND principal = true;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_single_principal_contact
  BEFORE INSERT OR UPDATE ON public.contatos_fornecedor
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_single_principal_contact();

-- Function similar para unidades operacionais
CREATE OR REPLACE FUNCTION public.validate_single_principal_unit()
RETURNS TRIGGER AS $$
BEGIN
  -- Se está marcando como principal, remove principal das outras
  IF NEW.principal = true THEN
    UPDATE public.unidades_operacionais 
    SET principal = false 
    WHERE fornecedor_id = NEW.fornecedor_id AND id != NEW.id AND principal = true;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_single_principal_unit
  BEFORE INSERT OR UPDATE ON public.unidades_operacionais
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_single_principal_unit();

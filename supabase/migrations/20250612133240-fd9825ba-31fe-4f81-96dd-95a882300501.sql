
-- Tabela para armazenar os cadastros de fornecedores
CREATE TABLE public.cadastro_fornecedores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Seção 1: Identificação do Cadastro
  origem_cadastro TEXT NOT NULL,
  
  -- Seção 2: Tipo de Fornecedor
  tipo_fornecedor TEXT NOT NULL CHECK (tipo_fornecedor IN ('cpf', 'cnpj')),
  
  -- Campos para Pessoa Jurídica (CNPJ)
  cnpj TEXT,
  razao_social TEXT,
  nome_fantasia TEXT,
  inscricao_estadual TEXT,
  inscricao_municipal TEXT,
  
  -- Campos para Pessoa Física (CPF)
  cpf TEXT,
  nome_completo TEXT,
  rg_ou_cnh TEXT,
  profissao TEXT,
  e_mei BOOLEAN DEFAULT FALSE,
  cnpj_mei TEXT,
  
  -- Seção 4: Endereço
  endereco_rua TEXT NOT NULL,
  endereco_numero TEXT NOT NULL,
  endereco_edificio TEXT,
  endereco_sala TEXT,
  endereco_andar TEXT,
  endereco_complemento TEXT,
  endereco_bairro TEXT NOT NULL,
  endereco_cidade TEXT NOT NULL,
  endereco_estado TEXT NOT NULL,
  endereco_cep TEXT NOT NULL,
  endereco_pais TEXT NOT NULL DEFAULT 'Brasil',
  
  -- Seção 5: Contato
  contato_nome TEXT NOT NULL,
  contato_sobrenome TEXT NOT NULL,
  contato_email TEXT NOT NULL,
  contato_telefone TEXT NOT NULL,
  contato_idioma TEXT NOT NULL DEFAULT 'PT',
  contato_local TEXT,
  
  -- Seção 6: Informações de Fornecimento
  categoria_fornecimento TEXT NOT NULL,
  regiao_fornecimento TEXT NOT NULL,
  
  -- Seção 7: Extras
  aceite_nda BOOLEAN DEFAULT FALSE,
  tem_contato_cliente BOOLEAN,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para melhor performance
CREATE INDEX idx_cadastro_fornecedores_tipo ON public.cadastro_fornecedores(tipo_fornecedor);
CREATE INDEX idx_cadastro_fornecedores_created_at ON public.cadastro_fornecedores(created_at);
CREATE INDEX idx_cadastro_fornecedores_cnpj ON public.cadastro_fornecedores(cnpj) WHERE cnpj IS NOT NULL;
CREATE INDEX idx_cadastro_fornecedores_cpf ON public.cadastro_fornecedores(cpf) WHERE cpf IS NOT NULL;

-- Tabela para anexos/documentos
CREATE TABLE public.cadastro_fornecedor_documentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cadastro_id UUID NOT NULL REFERENCES public.cadastro_fornecedores(id) ON DELETE CASCADE,
  nome_arquivo TEXT NOT NULL,
  tipo_arquivo TEXT,
  tamanho_kb INTEGER,
  url_arquivo TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS (Row Level Security) - Como é um formulário público, vamos permitir inserção para todos
ALTER TABLE public.cadastro_fornecedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cadastro_fornecedor_documentos ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção pública (autorregistro)
CREATE POLICY "Permitir inserção pública de cadastros" 
  ON public.cadastro_fornecedores 
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Política para permitir leitura apenas para usuários autenticados (admin)
CREATE POLICY "Permitir leitura para usuários autenticados" 
  ON public.cadastro_fornecedores 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Políticas similares para documentos
CREATE POLICY "Permitir inserção pública de documentos" 
  ON public.cadastro_fornecedor_documentos 
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Permitir leitura de documentos para usuários autenticados" 
  ON public.cadastro_fornecedor_documentos 
  FOR SELECT 
  TO authenticated
  USING (true);

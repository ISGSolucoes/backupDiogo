
-- Criar tabela para biblioteca central de documentos
CREATE TABLE public.biblioteca_documentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_arquivo TEXT NOT NULL,
  nome_original TEXT NOT NULL,
  descricao TEXT,
  tipo_arquivo TEXT NOT NULL, -- 'pdf', 'doc', 'docx', 'ppt', 'pptx', etc
  tamanho_bytes BIGINT NOT NULL,
  url_arquivo TEXT NOT NULL,
  
  -- Metadados organizacionais
  area TEXT NOT NULL, -- 'RH', 'Financeiro', 'Suprimentos', etc
  finalidade TEXT NOT NULL, -- 'Comunicado', 'Contrato', 'Formulário', etc
  categoria TEXT, -- Subcategoria opcional
  tags TEXT[], -- Array de tags para busca
  
  -- Controle de versão
  versao INTEGER DEFAULT 1,
  versao_anterior_id UUID REFERENCES public.biblioteca_documentos(id),
  
  -- Controle de acesso
  publico BOOLEAN DEFAULT false,
  areas_permitidas TEXT[], -- Array de áreas que podem acessar
  cargos_permitidos TEXT[], -- Array de cargos que podem acessar
  
  -- Aprovação
  status TEXT DEFAULT 'pendente', -- 'pendente', 'aprovado', 'rejeitado'
  aprovado_por UUID,
  aprovado_em TIMESTAMP WITH TIME ZONE,
  motivo_rejeicao TEXT,
  
  -- Controle de validade
  data_validade DATE,
  notificar_vencimento BOOLEAN DEFAULT false,
  
  -- Metadados de upload
  criado_por UUID NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Estatísticas de uso
  downloads_count INTEGER DEFAULT 0,
  ultimo_download TIMESTAMP WITH TIME ZONE,
  
  -- Observações
  observacoes TEXT
);

-- Criar índices para performance
CREATE INDEX idx_biblioteca_documentos_area ON public.biblioteca_documentos(area);
CREATE INDEX idx_biblioteca_documentos_finalidade ON public.biblioteca_documentos(finalidade);
CREATE INDEX idx_biblioteca_documentos_tipo_arquivo ON public.biblioteca_documentos(tipo_arquivo);
CREATE INDEX idx_biblioteca_documentos_status ON public.biblioteca_documentos(status);
CREATE INDEX idx_biblioteca_documentos_criado_por ON public.biblioteca_documentos(criado_por);

-- Criar trigger para atualizar timestamp
CREATE OR REPLACE FUNCTION update_biblioteca_documentos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_biblioteca_documentos_updated_at
  BEFORE UPDATE ON public.biblioteca_documentos
  FOR EACH ROW
  EXECUTE FUNCTION update_biblioteca_documentos_updated_at();

-- Habilitar RLS
ALTER TABLE public.biblioteca_documentos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Usuários autenticados podem ver documentos públicos ou de suas áreas"
  ON public.biblioteca_documentos
  FOR SELECT
  USING (
    publico = true OR
    areas_permitidas IS NULL OR
    areas_permitidas = '{}' OR
    (SELECT area FROM public.profiles WHERE id = auth.uid()) = ANY(areas_permitidas)
  );

CREATE POLICY "Usuários podem criar documentos"
  ON public.biblioteca_documentos
  FOR INSERT
  WITH CHECK (auth.uid() = criado_por);

CREATE POLICY "Criadores podem atualizar seus documentos"
  ON public.biblioteca_documentos
  FOR UPDATE
  USING (auth.uid() = criado_por);

CREATE POLICY "Admins podem gerenciar todos os documentos"
  ON public.biblioteca_documentos
  FOR ALL
  USING (is_admin(auth.uid()));

-- Criar bucket de storage
INSERT INTO storage.buckets (id, name, public) 
VALUES ('biblioteca-documentos', 'biblioteca-documentos', false);

-- Política de storage para upload
CREATE POLICY "Usuários autenticados podem fazer upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'biblioteca-documentos' AND auth.uid() IS NOT NULL);

-- Política de storage para download
CREATE POLICY "Usuários podem baixar documentos permitidos"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'biblioteca-documentos' AND
    EXISTS (
      SELECT 1 FROM public.biblioteca_documentos bd
      WHERE bd.url_arquivo LIKE '%' || name
      AND (
        bd.publico = true OR
        bd.areas_permitidas IS NULL OR
        bd.areas_permitidas = '{}' OR
        (SELECT area FROM public.profiles WHERE id = auth.uid()) = ANY(bd.areas_permitidas)
      )
    )
  );

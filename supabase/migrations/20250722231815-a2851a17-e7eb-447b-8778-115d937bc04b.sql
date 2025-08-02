-- Criar tabela para usuários do portal fornecedor
CREATE TABLE public.portal_fornecedor_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cadastro_fornecedor_id UUID REFERENCES public.cadastro_fornecedores(id),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ativo',
  ultimo_acesso TIMESTAMP WITH TIME ZONE,
  reset_token TEXT,
  reset_token_expires TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.portal_fornecedor_users ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção durante cadastro
CREATE POLICY "Permitir inserção de novos usuários" 
ON public.portal_fornecedor_users 
FOR INSERT 
WITH CHECK (true);

-- Política para usuários verem apenas seus próprios dados
CREATE POLICY "Usuários podem ver próprios dados" 
ON public.portal_fornecedor_users 
FOR SELECT 
USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Política para usuários atualizarem próprios dados
CREATE POLICY "Usuários podem atualizar próprios dados" 
ON public.portal_fornecedor_users 
FOR UPDATE 
USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Trigger para updated_at
CREATE TRIGGER update_portal_fornecedor_users_updated_at
BEFORE UPDATE ON public.portal_fornecedor_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Adicionar colunas de relacionamento na tabela de cadastro
ALTER TABLE public.cadastro_fornecedores 
ADD COLUMN convite_id UUID REFERENCES public.convites_fornecedor(id),
ADD COLUMN status_cadastro TEXT DEFAULT 'pendente',
ADD COLUMN aprovado_em TIMESTAMP WITH TIME ZONE,
ADD COLUMN aprovado_por UUID;

-- Função para criar usuário do portal após cadastro
CREATE OR REPLACE FUNCTION public.create_portal_user(
  p_cadastro_id UUID,
  p_email TEXT,
  p_password TEXT
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id UUID;
  password_hash TEXT;
BEGIN
  -- Gerar hash da senha (simplificado para demo)
  password_hash := crypt(p_password, gen_salt('bf'));
  
  -- Inserir usuário
  INSERT INTO public.portal_fornecedor_users (
    cadastro_fornecedor_id, email, password_hash
  ) VALUES (
    p_cadastro_id, p_email, password_hash
  ) RETURNING id INTO user_id;
  
  -- Atualizar status do cadastro
  UPDATE public.cadastro_fornecedores 
  SET status_cadastro = 'cadastrado'
  WHERE id = p_cadastro_id;
  
  RETURN user_id;
END;
$$;

-- Função para validar login
CREATE OR REPLACE FUNCTION public.validate_portal_login(
  p_email TEXT,
  p_password TEXT
) RETURNS TABLE(
  user_id UUID,
  cadastro_id UUID,
  is_valid BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.cadastro_fornecedor_id,
    CASE 
      WHEN u.password_hash = crypt(p_password, u.password_hash) THEN true
      ELSE false
    END as is_valid
  FROM public.portal_fornecedor_users u
  WHERE u.email = p_email AND u.status = 'ativo';
END;
$$;
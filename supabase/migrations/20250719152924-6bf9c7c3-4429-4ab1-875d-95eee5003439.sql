-- Criar enum para papéis do sistema
CREATE TYPE public.app_role AS ENUM (
  'admin',
  'gestor', 
  'aprovador_nivel_1',
  'aprovador_nivel_2',
  'solicitante'
);

-- Criar enum para status do usuário
CREATE TYPE public.user_status AS ENUM (
  'ativo',
  'inativo',
  'pendente_ativacao'
);

-- Tabela de perfis de usuários
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome_completo TEXT NOT NULL,
  email TEXT NOT NULL,
  area TEXT NOT NULL,
  cargo TEXT,
  centro_custo TEXT,
  telefone TEXT,
  avatar_url TEXT,
  status user_status NOT NULL DEFAULT 'pendente_ativacao',
  primeiro_acesso BOOLEAN DEFAULT true,
  ultimo_acesso TIMESTAMP WITH TIME ZONE,
  configuracoes JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabela de papéis de usuários (relacionamento many-to-many)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  area_especifica TEXT, -- Para limitar papel a uma área específica
  centro_custo_especifico TEXT, -- Para limitar papel a um centro de custo
  limite_aprovacao DECIMAL, -- Limite de valor para aprovação
  delegado_para UUID REFERENCES public.profiles(id), -- Delegação temporária
  data_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
  data_fim DATE, -- Para papéis temporários
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, role, area_especifica, centro_custo_especifico)
);

-- Tabela de configurações organizacionais
CREATE TABLE public.organizational_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_config TEXT NOT NULL, -- 'area', 'centro_custo', 'hierarquia_aprovacao'
  codigo TEXT NOT NULL,
  nome TEXT NOT NULL,
  descricao TEXT,
  config_data JSONB DEFAULT '{}'::jsonb,
  parent_id UUID REFERENCES public.organizational_config(id),
  ordem INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(tipo_config, codigo)
);

-- Tabela de auditoria de mudanças de perfil
CREATE TABLE public.profile_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  changed_by UUID REFERENCES public.profiles(id) NOT NULL,
  action TEXT NOT NULL, -- 'created', 'updated', 'role_added', 'role_removed', etc.
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizational_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_audit ENABLE ROW LEVEL SECURITY;

-- Função para verificar se usuário tem papel específico
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.profiles p ON ur.user_id = p.id
    WHERE p.id = _user_id
      AND ur.role = _role
      AND ur.is_active = true
      AND (ur.data_fim IS NULL OR ur.data_fim >= CURRENT_DATE)
  );
$$;

-- Função para verificar se usuário é admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT public.has_role(_user_id, 'admin');
$$;

-- Função para obter perfil completo do usuário
CREATE OR REPLACE FUNCTION public.get_user_profile(_user_id UUID DEFAULT auth.uid())
RETURNS TABLE (
  id UUID,
  nome_completo TEXT,
  email TEXT,
  area TEXT,
  cargo TEXT,
  centro_custo TEXT,
  telefone TEXT,
  avatar_url TEXT,
  status user_status,
  roles app_role[],
  pode_aprovar_nivel_1 BOOLEAN,
  pode_aprovar_nivel_2 BOOLEAN,
  limite_aprovacao DECIMAL,
  pode_criar_requisicoes BOOLEAN,
  pode_ver_todos BOOLEAN
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT 
    p.id,
    p.nome_completo,
    p.email,
    p.area,
    p.cargo,
    p.centro_custo,
    p.telefone,
    p.avatar_url,
    p.status,
    ARRAY_AGG(DISTINCT ur.role) FILTER (WHERE ur.role IS NOT NULL) as roles,
    BOOL_OR(ur.role = 'aprovador_nivel_1' OR ur.role = 'gestor' OR ur.role = 'admin') as pode_aprovar_nivel_1,
    BOOL_OR(ur.role = 'aprovador_nivel_2' OR ur.role = 'gestor' OR ur.role = 'admin') as pode_aprovar_nivel_2,
    MAX(ur.limite_aprovacao) as limite_aprovacao,
    BOOL_OR(ur.role IN ('solicitante', 'aprovador_nivel_1', 'aprovador_nivel_2', 'gestor', 'admin')) as pode_criar_requisicoes,
    BOOL_OR(ur.role IN ('gestor', 'admin')) as pode_ver_todos
  FROM public.profiles p
  LEFT JOIN public.user_roles ur ON p.id = ur.user_id AND ur.is_active = true
  WHERE p.id = _user_id
  GROUP BY p.id, p.nome_completo, p.email, p.area, p.cargo, p.centro_custo, p.telefone, p.avatar_url, p.status;
$$;

-- Trigger para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    nome_completo, 
    email,
    area
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome_completo', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'area', 'Não Definido')
  );
  
  -- Dar papel de solicitante por padrão
  INSERT INTO public.user_roles (user_id, role) 
  VALUES (NEW.id, 'solicitante');
  
  RETURN NEW;
END;
$$;

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Aplicar triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_organizational_config_updated_at
  BEFORE UPDATE ON public.organizational_config
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Políticas RLS para profiles
CREATE POLICY "Usuários podem ver próprio perfil" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Admins podem ver todos os perfis" 
ON public.profiles FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Usuários podem atualizar próprio perfil" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Admins podem atualizar qualquer perfil" 
ON public.profiles FOR UPDATE 
USING (public.is_admin(auth.uid()));

-- Políticas RLS para user_roles
CREATE POLICY "Usuários podem ver próprios papéis" 
ON public.user_roles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins podem ver todos os papéis" 
ON public.user_roles FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Apenas admins podem modificar papéis" 
ON public.user_roles FOR ALL 
USING (public.is_admin(auth.uid()));

-- Políticas RLS para organizational_config
CREATE POLICY "Todos usuários autenticados podem ver config organizacional" 
ON public.organizational_config FOR SELECT 
TO authenticated USING (true);

CREATE POLICY "Apenas admins podem modificar config organizacional" 
ON public.organizational_config FOR ALL 
USING (public.is_admin(auth.uid()));

-- Políticas RLS para profile_audit
CREATE POLICY "Usuários podem ver auditoria do próprio perfil" 
ON public.profile_audit FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins podem ver toda auditoria" 
ON public.profile_audit FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Sistema pode inserir auditoria" 
ON public.profile_audit FOR INSERT 
WITH CHECK (true);

-- Inserir configurações organizacionais padrão
INSERT INTO public.organizational_config (tipo_config, codigo, nome, descricao) VALUES
('area', 'FACILITIES', 'Facilities', 'Gestão de instalações e infraestrutura'),
('area', 'SUPRIMENTOS', 'Suprimentos', 'Compras e gestão de fornecedores'),
('area', 'FINANCEIRO', 'Financeiro', 'Controladoria e gestão financeira'),
('area', 'TI', 'Tecnologia da Informação', 'Sistemas e infraestrutura tecnológica'),
('area', 'COMERCIAL', 'Comercial', 'Vendas e relacionamento com clientes'),
('area', 'DIRETORIA', 'Diretoria', 'Alta direção'),
('centro_custo', 'CC001', 'Administrativo', 'Centro de custo administrativo'),
('centro_custo', 'CC002', 'Operacional', 'Centro de custo operacional'),
('centro_custo', 'CC003', 'Vendas', 'Centro de custo de vendas'),
('centro_custo', 'CC004', 'Marketing', 'Centro de custo de marketing');
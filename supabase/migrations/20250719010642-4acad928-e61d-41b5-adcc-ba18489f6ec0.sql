-- Limpar objetos existentes se houver
DROP TABLE IF EXISTS public.anexos_requisicao CASCADE;
DROP TABLE IF EXISTS public.historico_requisicao CASCADE;
DROP TABLE IF EXISTS public.aprovacoes_requisicao CASCADE;
DROP TABLE IF EXISTS public.itens_requisicao CASCADE;
DROP TABLE IF EXISTS public.requisicoes CASCADE;

DROP TYPE IF EXISTS public.status_requisicao CASCADE;
DROP TYPE IF EXISTS public.prioridade_requisicao CASCADE;
DROP TYPE IF EXISTS public.tipo_requisicao CASCADE;
DROP TYPE IF EXISTS public.status_aprovacao_req CASCADE;

-- Criar tipos ENUM para requisições
CREATE TYPE public.status_requisicao AS ENUM (
  'rascunho',
  'enviada',
  'em_aprovacao',
  'aprovada',
  'rejeitada',
  'em_cotacao',
  'cotacao_recebida',
  'finalizada',
  'cancelada'
);

CREATE TYPE public.prioridade_requisicao AS ENUM (
  'baixa',
  'media',
  'alta',
  'urgente'
);

CREATE TYPE public.tipo_requisicao AS ENUM (
  'material',
  'servico',
  'equipamento',
  'software',
  'infraestrutura',
  'outros'
);

CREATE TYPE public.status_aprovacao_req AS ENUM (
  'pendente',
  'aprovada',
  'rejeitada',
  'delegada'
);

-- Tabela principal de requisições
CREATE TABLE public.requisicoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_requisicao VARCHAR(50) UNIQUE NOT NULL DEFAULT '',
  titulo TEXT NOT NULL,
  descricao TEXT,
  tipo tipo_requisicao NOT NULL DEFAULT 'material',
  status status_requisicao NOT NULL DEFAULT 'rascunho',
  prioridade prioridade_requisicao NOT NULL DEFAULT 'media',
  
  -- Datas
  data_criacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_necessidade DATE NOT NULL,
  data_aprovacao TIMESTAMP WITH TIME ZONE,
  data_finalizacao TIMESTAMP WITH TIME ZONE,
  
  -- Valores
  valor_estimado NUMERIC(15,2) DEFAULT 0,
  valor_aprovado NUMERIC(15,2),
  
  -- Responsáveis
  solicitante_id UUID NOT NULL,
  solicitante_nome TEXT NOT NULL,
  solicitante_area TEXT NOT NULL,
  aprovador_atual_id UUID,
  aprovador_atual_nome TEXT,
  
  -- Justificativas
  justificativa TEXT,
  observacoes TEXT,
  
  -- Centro de custo
  centro_custo VARCHAR(50),
  conta_contabil VARCHAR(50),
  
  -- Integração
  cotacao_id UUID,
  pedido_id UUID,
  
  -- Auditoria
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Tabela de itens da requisição
CREATE TABLE public.itens_requisicao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requisicao_id UUID NOT NULL REFERENCES requisicoes(id) ON DELETE CASCADE,
  sequencia INTEGER NOT NULL,
  
  -- Produto/Serviço
  codigo_produto VARCHAR(100),
  descricao TEXT NOT NULL,
  especificacao TEXT,
  unidade VARCHAR(20) NOT NULL DEFAULT 'UN',
  quantidade NUMERIC(10,3) NOT NULL,
  
  -- Valores
  preco_estimado NUMERIC(15,2) DEFAULT 0,
  valor_total_estimado NUMERIC(15,2),
  
  -- Entrega
  data_necessidade DATE,
  local_entrega TEXT,
  
  -- Observações
  observacoes TEXT,
  urgente BOOLEAN DEFAULT false,
  
  -- Auditoria
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(requisicao_id, sequencia)
);

-- Tabela de workflow de aprovação
CREATE TABLE public.aprovacoes_requisicao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requisicao_id UUID NOT NULL REFERENCES requisicoes(id) ON DELETE CASCADE,
  
  -- Hierarquia
  nivel INTEGER NOT NULL,
  ordem INTEGER NOT NULL,
  
  -- Aprovador
  aprovador_id UUID NOT NULL,
  aprovador_nome TEXT NOT NULL,
  aprovador_cargo TEXT,
  aprovador_area TEXT,
  
  -- Status
  status status_aprovacao_req NOT NULL DEFAULT 'pendente',
  
  -- Datas
  data_solicitacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_resposta TIMESTAMP WITH TIME ZONE,
  data_expiracao TIMESTAMP WITH TIME ZONE,
  
  -- Feedback
  comentarios TEXT,
  motivo_rejeicao TEXT,
  condicoes_aprovacao TEXT,
  
  -- Delegação
  delegado_para_id UUID,
  delegado_para_nome TEXT,
  motivo_delegacao TEXT,
  
  -- Auditoria
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(requisicao_id, nivel, ordem)
);

-- Tabela de histórico e comentários
CREATE TABLE public.historico_requisicao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requisicao_id UUID NOT NULL REFERENCES requisicoes(id) ON DELETE CASCADE,
  
  -- Evento
  evento VARCHAR(100) NOT NULL,
  descricao TEXT,
  
  -- Mudanças de status
  status_anterior VARCHAR(50),
  status_novo VARCHAR(50),
  
  -- Dados alterados
  dados_anteriores JSONB,
  dados_novos JSONB,
  campos_alterados TEXT[],
  
  -- Comentários e comunicação
  comentario TEXT,
  publico BOOLEAN DEFAULT true,
  
  -- Responsável
  usuario_id UUID,
  usuario_nome TEXT NOT NULL,
  usuario_area TEXT,
  
  -- Contexto técnico
  ip_address INET,
  user_agent TEXT,
  origem VARCHAR(50) DEFAULT 'web',
  
  -- Auditoria
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar bucket para anexos se não existir
INSERT INTO storage.buckets (id, name, public) 
VALUES ('requisicoes-anexos', 'requisicoes-anexos', false)
ON CONFLICT (id) DO NOTHING;
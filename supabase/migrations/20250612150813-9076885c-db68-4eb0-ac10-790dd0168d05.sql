
-- Criar enum para tipos de ação recomendada
CREATE TYPE public.tipo_acao_recomendada AS ENUM (
  'documento_vencendo',
  'documento_vencido', 
  'avaliacao_pendente',
  'fornecedor_inativo',
  'desempenho_baixo',
  'promover_preferencial',
  'reavaliar_qualificacao',
  'solicitar_atualizacao'
);

-- Criar enum para prioridade das ações
CREATE TYPE public.prioridade_acao AS ENUM ('alta', 'media', 'baixa');

-- Criar tabela para armazenar ações recomendadas pela IA
CREATE TABLE public.acoes_recomendadas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fornecedor_id TEXT NOT NULL,
  fornecedor_nome TEXT NOT NULL,
  fornecedor_cnpj TEXT NOT NULL,
  tipo_acao tipo_acao_recomendada NOT NULL,
  prioridade prioridade_acao NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  justificativa TEXT,
  sugerida_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  executada BOOLEAN DEFAULT false,
  executada_em TIMESTAMP WITH TIME ZONE,
  executada_por TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar índices para melhor performance
CREATE INDEX idx_acoes_recomendadas_fornecedor_id ON public.acoes_recomendadas(fornecedor_id);
CREATE INDEX idx_acoes_recomendadas_prioridade ON public.acoes_recomendadas(prioridade);
CREATE INDEX idx_acoes_recomendadas_executada ON public.acoes_recomendadas(executada);
CREATE INDEX idx_acoes_recomendadas_sugerida_em ON public.acoes_recomendadas(sugerida_em);

-- Habilitar RLS
ALTER TABLE public.acoes_recomendadas ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS (assumindo que será público por enquanto, pode ser ajustado com autenticação)
CREATE POLICY "Permitir acesso completo às ações recomendadas" 
ON public.acoes_recomendadas 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Inserir alguns dados de exemplo
INSERT INTO public.acoes_recomendadas (
  fornecedor_id, fornecedor_nome, fornecedor_cnpj, tipo_acao, prioridade, 
  titulo, descricao, justificativa
) VALUES 
(
  '1', 'Tech Solutions Ltda', '12.345.678/0001-90', 'documento_vencendo', 'alta',
  'Certidão de FGTS vence em 7 dias',
  'O documento Certidão de FGTS está próximo do vencimento e precisa ser atualizado',
  'Documento crítico para manutenção da qualificação do fornecedor'
),
(
  '1', 'Tech Solutions Ltda', '12.345.678/0001-90', 'avaliacao_pendente', 'media',
  'Questionário não atualizado há mais de 6 meses', 
  'O questionário de qualificação não é atualizado há 6 meses',
  'Manter qualificação atualizada conforme política interna'
),
(
  '3', 'Transportes Rápidos SA', '45.678.912/0001-34', 'fornecedor_inativo', 'alta',
  'Fornecedor inativo há mais de 90 dias',
  'Fornecedor está inativo mas pode ter potencial de reativação',
  'Análise de inatividade detectou possível oportunidade de reengajamento'
),
(
  '2', 'ABC Materiais de Escritório', '98.765.432/0001-10', 'promover_preferencial', 'baixa',
  'Destaque em custo-benefício',
  'Fornecedor apresenta excelente relação custo-benefício',
  'Análise de performance indica potencial para status preferencial'
),
(
  '5', 'Equipamentos Industriais LTDA', '34.567.890/0001-12', 'reavaliar_qualificacao', 'media',
  'Avaliação pendente há 180 dias',
  'Última avaliação de qualificação foi há mais de 6 meses',
  'Manutenção da conformidade com ciclo de avaliações'
);

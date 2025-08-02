-- Inserir dados de exemplo para demonstrar o workflow
INSERT INTO public.requisicoes (
  titulo, descricao, tipo, status, prioridade,
  data_necessidade, valor_estimado,
  solicitante_id, solicitante_nome, solicitante_area,
  justificativa, centro_custo
) VALUES
(
  'Material de Escritório - Janeiro 2025',
  'Aquisição de material de escritório para equipe de Facilities incluindo papel A4, canetas, pastas e outros itens básicos',
  'material',
  'em_aprovacao',
  'media',
  '2025-02-15',
  2450.00,
  gen_random_uuid(),
  'Maria Santos',
  'Facilities',
  'Reposição de estoque de material de escritório que está acabando',
  'FAC-001'
),
(
  'Licenças Microsoft Office 365',
  'Renovação de licenças Microsoft Office 365 para equipe de TI',
  'software',
  'aprovada',
  'alta',
  '2025-01-30',
  12800.00,
  gen_random_uuid(),
  'João Silva',
  'TI',
  'Licenças expirando em 15 dias, necessário renovar para continuidade dos trabalhos',
  'TI-002'
),
(
  'Serviços de Manutenção Predial',
  'Contratação de serviços de manutenção preventiva do ar condicionado corporativo',
  'servico',
  'aguardando_aprovacao',
  'urgente',
  '2025-01-25',
  8500.00,
  gen_random_uuid(),
  'Ana Costa',
  'Facilities',
  'Equipamentos apresentando problemas e clima quente aumentando demanda',
  'FAC-001'
);

-- Inserir itens para as requisições
INSERT INTO public.itens_requisicao (
  requisicao_id, sequencia, descricao, unidade, quantidade, preco_estimado
) 
SELECT 
  r.id,
  1,
  'Papel A4 75g - Resma 500 folhas',
  'UN',
  20,
  12.50
FROM public.requisicoes r WHERE r.titulo LIKE 'Material de Escritório%'

UNION ALL

SELECT 
  r.id,
  2,
  'Caneta Esferográfica Azul',
  'CX',
  5,
  45.00
FROM public.requisicoes r WHERE r.titulo LIKE 'Material de Escritório%'

UNION ALL

SELECT 
  r.id,
  1,
  'Licença Microsoft Office 365 Business Premium',
  'UN',
  50,
  256.00
FROM public.requisicoes r WHERE r.titulo LIKE 'Licenças Microsoft%'

UNION ALL

SELECT 
  r.id,
  1,
  'Manutenção Preventiva - Ar Condicionado Split',
  'HR',
  40,
  212.50
FROM public.requisicoes r WHERE r.titulo LIKE 'Serviços de Manutenção%';

-- Inserir workflow de aprovação para as requisições
INSERT INTO public.aprovacoes_requisicao (
  requisicao_id, nivel, ordem, aprovador_id, aprovador_nome, aprovador_cargo, aprovador_area, status
)
SELECT 
  r.id,
  1,
  1,
  gen_random_uuid(),
  'Carlos Lima',
  'Supervisor',
  'Facilities',
  CASE 
    WHEN r.status = 'aprovada' THEN 'aprovada'::status_aprovacao_req
    WHEN r.status = 'em_aprovacao' THEN 'pendente'::status_aprovacao_req
    ELSE 'pendente'::status_aprovacao_req
  END
FROM public.requisicoes r

UNION ALL

SELECT 
  r.id,
  2,
  1,
  gen_random_uuid(),
  'Roberto Santos',
  'Gerente de Compras',
  'Suprimentos',
  CASE 
    WHEN r.status = 'aprovada' THEN 'aprovada'::status_aprovacao_req
    ELSE 'pendente'::status_aprovacao_req
  END
FROM public.requisicoes r WHERE r.valor_estimado > 5000;

-- Inserir histórico das requisições
INSERT INTO public.historico_requisicao (
  requisicao_id, evento, descricao, usuario_nome, usuario_area
)
SELECT 
  r.id,
  'requisicao_criada',
  'Requisição criada: ' || r.titulo,
  r.solicitante_nome,
  r.solicitante_area
FROM public.requisicoes r

UNION ALL

SELECT 
  r.id,
  'enviada_para_aprovacao',
  'Requisição enviada para aprovação do supervisor',
  r.solicitante_nome,
  r.solicitante_area
FROM public.requisicoes r WHERE r.status != 'rascunho'

UNION ALL

SELECT 
  r.id,
  'aprovacao_nivel_1',
  'Aprovada pelo supervisor - Carlos Lima',
  'Carlos Lima',
  'Facilities'
FROM public.requisicoes r WHERE r.status = 'aprovada';
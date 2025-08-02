-- Dados de teste para o fluxo automático de compras

-- 1. Inserir algumas requisições aprovadas nos últimos 7 dias
INSERT INTO requisicoes (
  titulo, descricao, tipo, status, prioridade, 
  data_necessidade, valor_estimado, 
  solicitante_nome, solicitante_email, centro_custo
) VALUES 
('Material de Escritório - Papelaria', 'Compra de papel, canetas e material básico', 'material', 'aprovado', 'media', 
 current_date + interval '15 days', 2500.00, 
 'João Silva', 'joao.silva@empresa.com', 'ADMIN001'),
('Material de Escritório - Impressão', 'Toners e cartuchos para impressoras', 'material', 'aprovado', 'media',
 current_date + interval '20 days', 1800.00,
 'Maria Santos', 'maria.santos@empresa.com', 'ADMIN001'),
('Equipamentos de TI', 'Notebooks e periféricos', 'material', 'aprovado', 'alta',
 current_date + interval '30 days', 15000.00,
 'Carlos Tech', 'carlos.tech@empresa.com', 'TI001'),
('Equipamentos de TI - Acessórios', 'Mouses, teclados e monitores', 'material', 'aprovado', 'media',
 current_date + interval '25 days', 3200.00,
 'Ana Costa', 'ana.costa@empresa.com', 'TI001'),
('Serviços de Manutenção', 'Manutenção preventiva equipamentos', 'servico', 'aprovado', 'alta',
 current_date + interval '10 days', 5500.00,
 'Roberto Manutenção', 'roberto.man@empresa.com', 'MANUT001');

-- 2. Inserir itens para essas requisições
WITH req_ids AS (
  SELECT id, titulo FROM requisicoes 
  WHERE titulo IN (
    'Material de Escritório - Papelaria',
    'Material de Escritório - Impressão', 
    'Equipamentos de TI',
    'Equipamentos de TI - Acessórios',
    'Serviços de Manutenção'
  )
)
INSERT INTO itens_requisicao (requisicao_id, descricao, quantidade, preco_estimado, unidade, categoria)
SELECT 
  r.id,
  CASE r.titulo
    WHEN 'Material de Escritório - Papelaria' THEN 'Papel A4 500 folhas'
    WHEN 'Material de Escritório - Impressão' THEN 'Toner HP LaserJet'
    WHEN 'Equipamentos de TI' THEN 'Notebook Dell Inspiron'
    WHEN 'Equipamentos de TI - Acessórios' THEN 'Monitor 24 polegadas'
    WHEN 'Serviços de Manutenção' THEN 'Manutenção preventiva mensal'
  END,
  CASE r.titulo
    WHEN 'Material de Escritório - Papelaria' THEN 50
    WHEN 'Material de Escritório - Impressão' THEN 12
    WHEN 'Equipamentos de TI' THEN 10
    WHEN 'Equipamentos de TI - Acessórios' THEN 8
    WHEN 'Serviços de Manutenção' THEN 1
  END,
  CASE r.titulo
    WHEN 'Material de Escritório - Papelaria' THEN 25.00
    WHEN 'Material de Escritório - Impressão' THEN 150.00
    WHEN 'Equipamentos de TI' THEN 1500.00
    WHEN 'Equipamentos de TI - Acessórios' THEN 400.00
    WHEN 'Serviços de Manutenção' THEN 5500.00
  END,
  CASE r.titulo
    WHEN 'Material de Escritório - Papelaria' THEN 'PCT'
    WHEN 'Material de Escritório - Impressão' THEN 'UN'
    WHEN 'Equipamentos de TI' THEN 'UN'
    WHEN 'Equipamentos de TI - Acessórios' THEN 'UN'
    WHEN 'Serviços de Manutenção' THEN 'SV'
  END,
  CASE r.titulo
    WHEN 'Material de Escritório - Papelaria' THEN 'Material de Escritório'
    WHEN 'Material de Escritório - Impressão' THEN 'Material de Escritório'
    WHEN 'Equipamentos de TI' THEN 'Equipamentos de TI'
    WHEN 'Equipamentos de TI - Acessórios' THEN 'Equipamentos de TI'
    WHEN 'Serviços de Manutenção' THEN 'Serviços'
  END
FROM req_ids r;

-- 3. Inserir aprovações para essas requisições
WITH req_ids AS (
  SELECT id FROM requisicoes 
  WHERE titulo IN (
    'Material de Escritório - Papelaria',
    'Material de Escritório - Impressão', 
    'Equipamentos de TI',
    'Equipamentos de TI - Acessórios',
    'Serviços de Manutenção'
  )
)
INSERT INTO aprovacoes_requisicao (requisicao_id, aprovador_nome, aprovador_email, status, data_aprovacao)
SELECT 
  id,
  'Diretor Compras',
  'diretor.compras@empresa.com',
  'aprovado',
  current_timestamp - interval '2 days'
FROM req_ids;

-- 4. Inserir fornecedores de teste
INSERT INTO cadastro_fornecedores (
  origem_cadastro, tipo_fornecedor, cnpj, razao_social, nome_fantasia,
  endereco_rua, endereco_numero, endereco_bairro, endereco_cidade, endereco_estado, endereco_cep,
  contato_nome, contato_sobrenome, contato_email, contato_telefone,
  categoria_fornecimento, regiao_fornecimento, status_cadastro
) VALUES 
('portal', 'juridica', '12.345.678/0001-90', 'Papelaria Moderna Ltda', 'Papelaria Moderna',
 'Rua das Flores', '123', 'Centro', 'São Paulo', 'SP', '01234-567',
 'Pedro', 'Oliveira', 'pedro@papelaria.com', '(11) 99999-1111',
 'Material de Escritório', 'Sudeste', 'aprovado'),
('portal', 'juridica', '98.765.432/0001-10', 'TechSupply Equipamentos', 'TechSupply',
 'Av. Tecnologia', '456', 'Tech Park', 'São Paulo', 'SP', '01234-890',
 'Ana', 'Ferreira', 'ana@techsupply.com', '(11) 99999-2222',
 'Equipamentos de TI', 'Sudeste', 'aprovado'),
('portal', 'juridica', '11.222.333/0001-44', 'ServiMaint Soluções', 'ServiMaint',
 'Rua Industrial', '789', 'Industrial', 'São Paulo', 'SP', '01234-111',
 'Carlos', 'Maintenance', 'carlos@servimaint.com', '(11) 99999-3333',
 'Serviços', 'Sudeste', 'aprovado'),
('portal', 'juridica', '55.666.777/0001-88', 'Office Plus Suprimentos', 'Office Plus',
 'Rua Comercial', '321', 'Comercial', 'São Paulo', 'SP', '01234-222',
 'Lucia', 'Santos', 'lucia@officeplus.com', '(11) 99999-4444',
 'Material de Escritório', 'Sudeste', 'aprovado'),
('portal', 'juridica', '99.888.777/0001-66', 'MegaTech Distribuidor', 'MegaTech',
 'Av. Digital', '654', 'Tech Valley', 'São Paulo', 'SP', '01234-333',
 'Roberto', 'Silva', 'roberto@megatech.com', '(11) 99999-5555',
 'Equipamentos de TI', 'Sudeste', 'aprovado');

-- 5. Criar histórico de pedidos para os fornecedores (simulando performance)
WITH fornecedores AS (
  SELECT id::text as fornecedor_id, razao_social, contato_email
  FROM cadastro_fornecedores 
  WHERE status_cadastro = 'aprovado'
)
INSERT INTO pedidos (
  numero_pedido, fornecedor_id, fornecedor_razao_social, fornecedor_responsavel_email,
  status, valor_total, data_criacao, data_entrega_solicitada,
  criado_por, empresa_id
)
SELECT 
  'PED-2024-' || LPAD((ROW_NUMBER() OVER())::text, 6, '0'),
  f.fornecedor_id,
  f.razao_social,
  f.contato_email,
  'finalizado',
  (1000 + (RANDOM() * 5000))::numeric(10,2),
  current_timestamp - (RANDOM() * interval '90 days'),
  current_date - (RANDOM() * 30)::int,
  gen_random_uuid(),
  gen_random_uuid()
FROM fornecedores f
CROSS JOIN generate_series(1, 3) -- 3 pedidos por fornecedor
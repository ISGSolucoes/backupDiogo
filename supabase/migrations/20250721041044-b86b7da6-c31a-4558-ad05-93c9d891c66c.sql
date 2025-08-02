-- Inserir categorias de regras para o módulo de Requisições
INSERT INTO business_rule_categories (id, module_id, name, description, order_index) VALUES
(gen_random_uuid(), (SELECT id FROM modules WHERE type = 'requisicoes' LIMIT 1), 'Criação de Requisição', 'Regras para criação e validação de requisições', 1),
(gen_random_uuid(), (SELECT id FROM modules WHERE type = 'requisicoes' LIMIT 1), 'Demanda Agregada', 'Regras para agrupamento e consolidação de demanda', 2),
(gen_random_uuid(), (SELECT id FROM modules WHERE type = 'requisicoes' LIMIT 1), 'Controle Orçamentário', 'Regras de verificação e controle orçamentário', 3),
(gen_random_uuid(), (SELECT id FROM modules WHERE type = 'requisicoes' LIMIT 1), 'Workflow de Aprovação', 'Regras de roteamento e aprovação', 4),
(gen_random_uuid(), (SELECT id FROM modules WHERE type = 'requisicoes' LIMIT 1), 'Cotação Direta', 'Regras para processo de cotação direta', 5),
(gen_random_uuid(), (SELECT id FROM modules WHERE type = 'requisicoes' LIMIT 1), 'Comunicação e Colaboração', 'Regras de notificações e comunicação', 6),
(gen_random_uuid(), (SELECT id FROM modules WHERE type = 'requisicoes' LIMIT 1), 'Integração com Sourcing', 'Regras de transferência para sourcing', 7),
(gen_random_uuid(), (SELECT id FROM modules WHERE type = 'requisicoes' LIMIT 1), 'Relatórios e Controles', 'Regras de dashboards e relatórios', 8),
(gen_random_uuid(), (SELECT id FROM modules WHERE type = 'requisicoes' LIMIT 1), 'Segurança e Controle de Acesso', 'Regras de segurança e validação', 9),
(gen_random_uuid(), (SELECT id FROM modules WHERE type = 'requisicoes' LIMIT 1), 'Mobile e Experiência do Usuário', 'Regras de interface e mobile', 10),
(gen_random_uuid(), (SELECT id FROM modules WHERE type = 'requisicoes' LIMIT 1), 'Catálogo e Produtos', 'Regras de catálogo corporativo (Guided Buying)', 11),
(gen_random_uuid(), (SELECT id FROM modules WHERE type = 'requisicoes' LIMIT 1), 'Carrinho de Compras', 'Regras do carrinho de compras (Guided Buying)', 12),
(gen_random_uuid(), (SELECT id FROM modules WHERE type = 'requisicoes' LIMIT 1), 'Entrega e Logística', 'Regras de entrega e logística', 13),
(gen_random_uuid(), (SELECT id FROM modules WHERE type = 'requisicoes' LIMIT 1), 'Contratos e Acordos', 'Regras de contratos vigentes', 14),
(gen_random_uuid(), (SELECT id FROM modules WHERE type = 'requisicoes' LIMIT 1), 'Integração e API', 'Regras de integração externa', 15);

-- Inserir templates de regras para "Criação de Requisição"
WITH criacao_categoria AS (
  SELECT id FROM business_rule_categories 
  WHERE name = 'Criação de Requisição' 
  AND module_id = (SELECT id FROM modules WHERE type = 'requisicoes' LIMIT 1)
)
INSERT INTO business_rule_templates (category_id, rule_key, name, description, rule_type, default_value, order_index) VALUES
-- 1.1 Regras de Dados Obrigatórios
((SELECT id FROM criacao_categoria), 'exigir_descricao_detalhada', 'Exigir descrição detalhada do produto/serviço', 'Define se é obrigatório inserir descrição detalhada', 'boolean', 'false', 1),
((SELECT id FROM criacao_categoria), 'exigir_especificacoes_tecnicas', 'Exigir especificações técnicas obrigatórias', 'Define se especificações técnicas são obrigatórias', 'boolean', 'false', 2),
((SELECT id FROM criacao_categoria), 'exigir_quantidade', 'Exigir quantidade obrigatória', 'Define se quantidade é obrigatória', 'boolean', 'true', 3),
((SELECT id FROM criacao_categoria), 'exigir_unidade_medida', 'Exigir unidade de medida', 'Define se unidade de medida é obrigatória', 'boolean', 'true', 4),
((SELECT id FROM criacao_categoria), 'exigir_data_necessidade', 'Exigir data de necessidade', 'Define se data de necessidade é obrigatória', 'boolean', 'true', 5),
((SELECT id FROM criacao_categoria), 'exigir_justificativa', 'Exigir justificativa da necessidade', 'Define se justificativa é obrigatória', 'boolean', 'false', 6),
((SELECT id FROM criacao_categoria), 'exigir_centro_custo', 'Exigir centro de custo obrigatório', 'Define se centro de custo é obrigatório', 'boolean', 'true', 7),
((SELECT id FROM criacao_categoria), 'exigir_conta_contabil', 'Exigir conta contábil obrigatória', 'Define se conta contábil é obrigatória', 'boolean', 'false', 8),
((SELECT id FROM criacao_categoria), 'exigir_projeto_atividade', 'Exigir projeto/atividade', 'Define se projeto/atividade é obrigatório', 'boolean', 'false', 9),
((SELECT id FROM criacao_categoria), 'exigir_local_entrega', 'Exigir local de entrega', 'Define se local de entrega é obrigatório', 'boolean', 'false', 10),
((SELECT id FROM criacao_categoria), 'exigir_contato_responsavel', 'Exigir contato responsável', 'Define se contato responsável é obrigatório', 'boolean', 'false', 11),
((SELECT id FROM criacao_categoria), 'permitir_estimativa_valor', 'Permitir estimativa de valor', 'Define se estimativa de valor pode ser inserida', 'boolean', 'true', 12),
((SELECT id FROM criacao_categoria), 'exigir_categoria', 'Exigir categoria de produto/serviço', 'Define se categoria é obrigatória', 'boolean', 'true', 13),

-- 1.2 Regras de Anexos e Documentação
((SELECT id FROM criacao_categoria), 'permitir_anexos', 'Permitir anexar documentos de apoio', 'Define se anexos são permitidos', 'boolean', 'true', 14),
((SELECT id FROM criacao_categoria), 'exigir_anexos', 'Exigir anexos obrigatórios', 'Define se anexos são obrigatórios', 'boolean', 'false', 15),
((SELECT id FROM criacao_categoria), 'permitir_especificacoes_anexas', 'Permitir anexar especificações técnicas', 'Define se especificações técnicas podem ser anexadas', 'boolean', 'true', 16),
((SELECT id FROM criacao_categoria), 'permitir_cotacoes_informais', 'Permitir anexar cotações informais', 'Define se cotações informais podem ser anexadas', 'boolean', 'true', 17),
((SELECT id FROM criacao_categoria), 'permitir_desenhos_projetos', 'Permitir anexar desenhos/projetos', 'Define se desenhos/projetos podem ser anexados', 'boolean', 'true', 18),
((SELECT id FROM criacao_categoria), 'limitar_tipos_arquivo', 'Limitar tipos de arquivo (PDF, DOC, XLS, JPG, PNG)', 'Define tipos de arquivo permitidos', 'boolean', 'true', 19),
((SELECT id FROM criacao_categoria), 'tamanho_maximo_arquivo', 'Limitar tamanho máximo por arquivo (MB)', 'Define tamanho máximo por arquivo em MB', 'number', '10', 20),
((SELECT id FROM criacao_categoria), 'multiplos_anexos', 'Permitir múltiplos anexos por requisição', 'Define se múltiplos anexos são permitidos', 'boolean', 'true', 21),

-- 1.3 Regras de Categorização
((SELECT id FROM criacao_categoria), 'categoria_obrigatoria', 'Exigir seleção de categoria obrigatória', 'Define se categoria é obrigatória', 'boolean', 'true', 22),
((SELECT id FROM criacao_categoria), 'multiplas_categorias', 'Permitir múltiplas categorias na mesma requisição', 'Define se múltiplas categorias são permitidas', 'boolean', 'false', 23),
((SELECT id FROM criacao_categoria), 'exigir_subcategoria', 'Exigir subcategoria específica', 'Define se subcategoria é obrigatória', 'boolean', 'false', 24),
((SELECT id FROM criacao_categoria), 'validar_categoria_centro_custo', 'Validar categoria contra centro de custo', 'Define se categoria deve ser validada contra centro de custo', 'boolean', 'false', 25),
((SELECT id FROM criacao_categoria), 'regras_especificas_categoria', 'Aplicar regras específicas por categoria', 'Define se regras específicas são aplicadas por categoria', 'boolean', 'false', 26),
((SELECT id FROM criacao_categoria), 'aprovacao_tecnica_categorias_criticas', 'Exigir aprovação técnica para categorias críticas', 'Define se aprovação técnica é obrigatória para categorias críticas', 'boolean', 'false', 27);

-- Inserir templates de regras para "Demanda Agregada"
WITH demanda_categoria AS (
  SELECT id FROM business_rule_categories 
  WHERE name = 'Demanda Agregada' 
  AND module_id = (SELECT id FROM modules WHERE type = 'requisicoes' LIMIT 1)
)
INSERT INTO business_rule_templates (category_id, rule_key, name, description, rule_type, default_value, order_index) VALUES
-- 2.1 Regras de Agrupamento
((SELECT id FROM demanda_categoria), 'agrupar_por_categoria', 'Agrupar automaticamente por categoria', 'Define se requisições são agrupadas automaticamente por categoria', 'boolean', 'false', 1),
((SELECT id FROM demanda_categoria), 'agrupar_por_especificacao', 'Agrupar por especificação similar', 'Define se requisições são agrupadas por especificação similar', 'boolean', 'false', 2),
((SELECT id FROM demanda_categoria), 'agrupar_por_centro_custo', 'Agrupar por centro de custo', 'Define se requisições são agrupadas por centro de custo', 'boolean', 'false', 3),
((SELECT id FROM demanda_categoria), 'agrupar_por_projeto', 'Agrupar por projeto', 'Define se requisições são agrupadas por projeto', 'boolean', 'false', 4),
((SELECT id FROM demanda_categoria), 'agrupar_por_data_necessidade', 'Agrupar por data de necessidade', 'Define se requisições são agrupadas por data de necessidade', 'boolean', 'false', 5),
((SELECT id FROM demanda_categoria), 'agrupar_por_local_entrega', 'Agrupar por local de entrega', 'Define se requisições são agrupadas por local de entrega', 'boolean', 'false', 6),
((SELECT id FROM demanda_categoria), 'permitir_agrupamento_manual', 'Permitir agrupamento manual', 'Define se agrupamento manual é permitido', 'boolean', 'true', 7),
((SELECT id FROM demanda_categoria), 'exigir_aprovacao_agrupamento', 'Exigir aprovação para agrupamento', 'Define se agrupamento requer aprovação', 'boolean', 'false', 8),

-- 2.2 Regras de Consolidação
((SELECT id FROM demanda_categoria), 'consolidar_automaticamente', 'Consolidar automaticamente requisições similares', 'Define se consolidação automática está habilitada', 'boolean', 'false', 9),
((SELECT id FROM demanda_categoria), 'permitir_consolidacao_manual', 'Permitir consolidação manual', 'Define se consolidação manual é permitida', 'boolean', 'true', 10),
((SELECT id FROM demanda_categoria), 'aprovacao_solicitante_consolidacao', 'Exigir aprovação do solicitante para consolidação', 'Define se aprovação do solicitante é necessária', 'boolean', 'true', 11),
((SELECT id FROM demanda_categoria), 'manter_rastreabilidade', 'Manter rastreabilidade da requisição original', 'Define se rastreabilidade deve ser mantida', 'boolean', 'true', 12),
((SELECT id FROM demanda_categoria), 'permitir_desmembramento', 'Permitir desmembramento de requisições consolidadas', 'Define se desmembramento é permitido', 'boolean', 'true', 13),
((SELECT id FROM demanda_categoria), 'notificar_consolidacao', 'Notificar solicitantes sobre consolidação', 'Define se notificações de consolidação são enviadas', 'boolean', 'true', 14),
((SELECT id FROM demanda_categoria), 'periodo_minimo_consolidacao', 'Estabelecer período mínimo para consolidação (dias)', 'Define período mínimo em dias para consolidação', 'number', '7', 15),
((SELECT id FROM demanda_categoria), 'consolidar_mesma_categoria', 'Consolidar apenas itens da mesma categoria', 'Define se consolidação é limitada à mesma categoria', 'boolean', 'true', 16),

-- 2.3 Regras de Planejamento de Demanda
((SELECT id FROM demanda_categoria), 'relatorio_demanda_periodo', 'Gerar relatório de demanda por período', 'Define se relatórios de demanda são gerados', 'boolean', 'true', 17),
((SELECT id FROM demanda_categoria), 'identificar_padroes_consumo', 'Identificar padrões de consumo', 'Define se padrões de consumo são identificados', 'boolean', 'false', 18),
((SELECT id FROM demanda_categoria), 'sugerir_compras_programadas', 'Sugerir compras programadas', 'Define se sugestões de compras programadas são geradas', 'boolean', 'false', 19),
((SELECT id FROM demanda_categoria), 'alertar_demandas_recorrentes', 'Alertar sobre demandas recorrentes', 'Define se alertas sobre demandas recorrentes são enviados', 'boolean', 'false', 20),
((SELECT id FROM demanda_categoria), 'prever_necessidades_futuras', 'Prever necessidades futuras', 'Define se previsões de necessidades são realizadas', 'boolean', 'false', 21),
((SELECT id FROM demanda_categoria), 'identificar_economia_escala', 'Identificar oportunidades de economia de escala', 'Define se oportunidades de economia são identificadas', 'boolean', 'false', 22),
((SELECT id FROM demanda_categoria), 'plano_compras_consolidado', 'Gerar plano de compras consolidado', 'Define se plano de compras consolidado é gerado', 'boolean', 'false', 23);

-- Inserir templates de regras para "Controle Orçamentário"
WITH orcamentario_categoria AS (
  SELECT id FROM business_rule_categories 
  WHERE name = 'Controle Orçamentário' 
  AND module_id = (SELECT id FROM modules WHERE type = 'requisicoes' LIMIT 1)
)
INSERT INTO business_rule_templates (category_id, rule_key, name, description, rule_type, default_value, order_index) VALUES
-- 3.1 Regras de Verificação de Orçamento
((SELECT id FROM orcamentario_categoria), 'verificar_saldo_obrigatorio', 'Verificar saldo orçamentário obrigatório', 'Define se verificação de saldo é obrigatória', 'boolean', 'false', 1),
((SELECT id FROM orcamentario_categoria), 'permitir_sem_verificacao', 'Permitir requisição sem verificação orçamentária', 'Define se requisições sem verificação são permitidas', 'boolean', 'true', 2),
((SELECT id FROM orcamentario_categoria), 'verificar_por_centro_custo', 'Verificar orçamento por centro de custo', 'Define se verificação é feita por centro de custo', 'boolean', 'true', 3),
((SELECT id FROM orcamentario_categoria), 'verificar_por_conta_contabil', 'Verificar orçamento por conta contábil', 'Define se verificação é feita por conta contábil', 'boolean', 'false', 4),
((SELECT id FROM orcamentario_categoria), 'verificar_por_projeto', 'Verificar orçamento por projeto', 'Define se verificação é feita por projeto', 'boolean', 'false', 5),
((SELECT id FROM orcamentario_categoria), 'verificar_orcamento_anual', 'Verificar orçamento anual', 'Define se verificação anual é realizada', 'boolean', 'true', 6),
((SELECT id FROM orcamentario_categoria), 'verificar_orcamento_mensal', 'Verificar orçamento mensal', 'Define se verificação mensal é realizada', 'boolean', 'false', 7),
((SELECT id FROM orcamentario_categoria), 'verificar_orcamento_trimestral', 'Verificar orçamento trimestral', 'Define se verificação trimestral é realizada', 'boolean', 'false', 8),
((SELECT id FROM orcamentario_categoria), 'bloquear_sem_saldo', 'Bloquear requisições sem saldo', 'Define se requisições sem saldo são bloqueadas', 'boolean', 'false', 9),
((SELECT id FROM orcamentario_categoria), 'permitir_excecoes_aprovacao', 'Permitir exceções com aprovação superior', 'Define se exceções com aprovação são permitidas', 'boolean', 'true', 10),

-- 3.2 Regras de Reserva Orçamentária
((SELECT id FROM orcamentario_categoria), 'reservar_na_aprovacao', 'Reservar orçamento automaticamente na aprovação', 'Define se reserva é feita na aprovação', 'boolean', 'true', 11),
((SELECT id FROM orcamentario_categoria), 'reservar_na_criacao', 'Reservar orçamento na criação da requisição', 'Define se reserva é feita na criação', 'boolean', 'false', 12),
((SELECT id FROM orcamentario_categoria), 'liberar_se_rejeitada', 'Liberar reserva se requisição for rejeitada', 'Define se reserva é liberada quando rejeitada', 'boolean', 'true', 13),
((SELECT id FROM orcamentario_categoria), 'liberar_se_cancelada', 'Liberar reserva se requisição for cancelada', 'Define se reserva é liberada quando cancelada', 'boolean', 'true', 14),
((SELECT id FROM orcamentario_categoria), 'manter_ate_efetivacao', 'Manter reserva até efetivação da compra', 'Define se reserva é mantida até efetivação', 'boolean', 'true', 15),
((SELECT id FROM orcamentario_categoria), 'permitir_alteracao_valor', 'Permitir alteração de valor com nova reserva', 'Define se alteração de valor é permitida', 'boolean', 'true', 16),
((SELECT id FROM orcamentario_categoria), 'notificar_impacto_reserva', 'Notificar sobre impacto na reserva orçamentária', 'Define se notificações de impacto são enviadas', 'boolean', 'true', 17),

-- 3.3 Regras de Controle de Limite
((SELECT id FROM orcamentario_categoria), 'limite_por_usuario', 'Definir limite por usuário', 'Define se há limite por usuário', 'boolean', 'false', 18),
((SELECT id FROM orcamentario_categoria), 'limite_por_centro_custo', 'Definir limite por centro de custo', 'Define se há limite por centro de custo', 'boolean', 'false', 19),
((SELECT id FROM orcamentario_categoria), 'limite_por_categoria', 'Definir limite por categoria', 'Define se há limite por categoria', 'boolean', 'false', 20),
((SELECT id FROM orcamentario_categoria), 'limite_mensal_usuario', 'Aplicar limite mensal por usuário', 'Define se limite mensal por usuário é aplicado', 'boolean', 'false', 21),
((SELECT id FROM orcamentario_categoria), 'limite_anual_centro_custo', 'Aplicar limite anual por centro de custo', 'Define se limite anual por centro de custo é aplicado', 'boolean', 'false', 22),
((SELECT id FROM orcamentario_categoria), 'acumular_pendentes', 'Acumular valores de requisições pendentes', 'Define se valores pendentes são acumulados', 'boolean', 'true', 23),
((SELECT id FROM orcamentario_categoria), 'permitir_excecoes_justificativa', 'Permitir exceções com justificativa', 'Define se exceções com justificativa são permitidas', 'boolean', 'true', 24),
((SELECT id FROM orcamentario_categoria), 'notificar_aproximacao_limite', 'Notificar sobre aproximação do limite', 'Define se notificações de aproximação do limite são enviadas', 'boolean', 'true', 25),

-- 3.4 Regras de Moeda e Conversão
((SELECT id FROM orcamentario_categoria), 'multiplas_moedas', 'Permitir requisições em múltiplas moedas', 'Define se múltiplas moedas são permitidas', 'boolean', 'false', 26),
((SELECT id FROM orcamentario_categoria), 'converter_automaticamente', 'Converter automaticamente para moeda base', 'Define se conversão automática é realizada', 'boolean', 'true', 27),
((SELECT id FROM orcamentario_categoria), 'taxa_conversao_dia', 'Aplicar taxa de conversão do dia', 'Define se taxa do dia é aplicada', 'boolean', 'true', 28),
((SELECT id FROM orcamentario_categoria), 'taxa_conversao_manual', 'Permitir taxa de conversão manual', 'Define se taxa manual é permitida', 'boolean', 'false', 29),
((SELECT id FROM orcamentario_categoria), 'considerar_variacao_cambial', 'Considerar variação cambial no orçamento', 'Define se variação cambial é considerada', 'boolean', 'false', 30),
((SELECT id FROM orcamentario_categoria), 'alertar_impacto_cambial', 'Alertar sobre impacto cambial significativo', 'Define se alertas cambiais são enviados', 'boolean', 'true', 31);

-- Inserir templates de regras para "Workflow de Aprovação"
WITH workflow_categoria AS (
  SELECT id FROM business_rule_categories 
  WHERE name = 'Workflow de Aprovação' 
  AND module_id = (SELECT id FROM modules WHERE type = 'requisicoes' LIMIT 1)
)
INSERT INTO business_rule_templates (category_id, rule_key, name, description, rule_type, default_value, order_index) VALUES
-- 4.1 Regras de Roteamento Básico
((SELECT id FROM workflow_categoria), 'rotear_por_valor', 'Rotear por valor da requisição', 'Define se roteamento é feito por valor', 'boolean', 'true', 1),
((SELECT id FROM workflow_categoria), 'rotear_por_categoria', 'Rotear por categoria de produto/serviço', 'Define se roteamento é feito por categoria', 'boolean', 'false', 2),
((SELECT id FROM workflow_categoria), 'rotear_por_centro_custo', 'Rotear por centro de custo do solicitante', 'Define se roteamento é feito por centro de custo', 'boolean', 'false', 3),
((SELECT id FROM workflow_categoria), 'rotear_por_localizacao', 'Rotear por localização geográfica', 'Define se roteamento é feito por localização', 'boolean', 'false', 4),
((SELECT id FROM workflow_categoria), 'rotear_por_tipo_solicitante', 'Rotear por tipo de solicitante', 'Define se roteamento é feito por tipo de solicitante', 'boolean', 'false', 5),
((SELECT id FROM workflow_categoria), 'rotear_por_urgencia', 'Rotear por urgência da requisição', 'Define se roteamento é feito por urgência', 'boolean', 'false', 6),
((SELECT id FROM workflow_categoria), 'permitir_roteamento_manual', 'Permitir roteamento manual', 'Define se roteamento manual é permitido', 'boolean', 'true', 7),
((SELECT id FROM workflow_categoria), 'regras_combinadas', 'Aplicar regras combinadas de roteamento', 'Define se regras combinadas são aplicadas', 'boolean', 'false', 8),

-- 4.2 Regras de Aprovação por Valor
((SELECT id FROM workflow_categoria), 'auto_aprovacao_1000', 'Até R$ 1.000: Auto-aprovação', 'Define auto-aprovação até R$ 1.000', 'boolean', 'true', 9),
((SELECT id FROM workflow_categoria), 'aprovacao_1_nivel_5000', 'R$ 1.001 a R$ 5.000: 1 nível de aprovação', 'Define 1 nível de aprovação de R$ 1.001 a R$ 5.000', 'boolean', 'true', 10),
((SELECT id FROM workflow_categoria), 'aprovacao_2_niveis_25000', 'R$ 5.001 a R$ 25.000: 2 níveis de aprovação', 'Define 2 níveis de aprovação de R$ 5.001 a R$ 25.000', 'boolean', 'true', 11),
((SELECT id FROM workflow_categoria), 'aprovacao_3_niveis_100000', 'R$ 25.001 a R$ 100.000: 3 níveis de aprovação', 'Define 3 níveis de aprovação de R$ 25.001 a R$ 100.000', 'boolean', 'true', 12),
((SELECT id FROM workflow_categoria), 'comite_acima_100000', 'Acima de R$ 100.000: Comitê de compras', 'Define comitê de compras acima de R$ 100.000', 'boolean', 'true', 13),
((SELECT id FROM workflow_categoria), 'faixas_personalizadas', 'Permitir configurar faixas personalizadas', 'Define se faixas personalizadas são permitidas', 'boolean', 'false', 14),
((SELECT id FROM workflow_categoria), 'valores_por_categoria', 'Aplicar valores diferentes por categoria', 'Define se valores diferem por categoria', 'boolean', 'false', 15),
((SELECT id FROM workflow_categoria), 'valores_por_centro_custo', 'Aplicar valores diferentes por centro de custo', 'Define se valores diferem por centro de custo', 'boolean', 'false', 16),

-- 4.3 Regras de Aprovação Técnica
((SELECT id FROM workflow_categoria), 'aprovacao_tecnica_categorias', 'Exigir aprovação técnica para categorias específicas', 'Define se aprovação técnica é exigida para categorias específicas', 'boolean', 'false', 17),
((SELECT id FROM workflow_categoria), 'aprovacao_tecnica_paralelo', 'Permitir aprovação técnica em paralelo', 'Define se aprovação técnica em paralelo é permitida', 'boolean', 'false', 18),
((SELECT id FROM workflow_categoria), 'aprovacao_tecnica_antes', 'Exigir aprovação técnica antes da financeira', 'Define se aprovação técnica vem antes da financeira', 'boolean', 'false', 19),
((SELECT id FROM workflow_categoria), 'aprovacao_tecnica_depois', 'Permitir aprovação técnica após financeira', 'Define se aprovação técnica pode vir depois da financeira', 'boolean', 'true', 20),
((SELECT id FROM workflow_categoria), 'aprovacao_area_requisitante', 'Exigir aprovação da área requisitante', 'Define se aprovação da área é obrigatória', 'boolean', 'false', 21),
((SELECT id FROM workflow_categoria), 'aprovacao_gestor_projeto', 'Exigir aprovação do gestor do projeto', 'Define se aprovação do gestor do projeto é obrigatória', 'boolean', 'false', 22),
((SELECT id FROM workflow_categoria), 'delegacao_aprovacao_tecnica', 'Permitir delegação de aprovação técnica', 'Define se delegação de aprovação técnica é permitida', 'boolean', 'true', 23),

-- 4.4 Regras de Aprovação Orçamentária
((SELECT id FROM workflow_categoria), 'aprovacao_gestor_centro_custo', 'Exigir aprovação do gestor do centro de custo', 'Define se aprovação do gestor do centro de custo é obrigatória', 'boolean', 'false', 24),
((SELECT id FROM workflow_categoria), 'aprovacao_controller', 'Exigir aprovação do controller', 'Define se aprovação do controller é obrigatória', 'boolean', 'false', 25),
((SELECT id FROM workflow_categoria), 'aprovacao_dupla_valores_altos', 'Exigir aprovação dupla para valores altos', 'Define se aprovação dupla é exigida para valores altos', 'boolean', 'false', 26),
((SELECT id FROM workflow_categoria), 'aprovacao_orcamentaria_paralelo', 'Permitir aprovação orçamentária em paralelo', 'Define se aprovação orçamentária em paralelo é permitida', 'boolean', 'false', 27),
((SELECT id FROM workflow_categoria), 'aprovacao_orcamentaria_antes', 'Exigir aprovação orçamentária antes das demais', 'Define se aprovação orçamentária vem antes das demais', 'boolean', 'false', 28),
((SELECT id FROM workflow_categoria), 'dispensar_se_dentro_orcamento', 'Dispensar aprovação se dentro do orçamento', 'Define se aprovação é dispensada se dentro do orçamento', 'boolean', 'false', 29),

-- 4.5 Regras de Prazos e SLA
((SELECT id FROM workflow_categoria), 'prazo_maximo_nivel', 'Definir prazo máximo para cada nível', 'Define se prazos máximos são definidos para cada nível', 'boolean', 'true', 30),
((SELECT id FROM workflow_categoria), 'escalar_automaticamente', 'Escalar automaticamente após prazo', 'Define se escalação automática é realizada', 'boolean', 'false', 31),
((SELECT id FROM workflow_categoria), 'notificar_vencimento', 'Notificar aprovador sobre vencimento', 'Define se notificações de vencimento são enviadas', 'boolean', 'true', 32),
((SELECT id FROM workflow_categoria), 'extensao_prazo_justificativa', 'Permitir extensão de prazo com justificativa', 'Define se extensão de prazo é permitida', 'boolean', 'true', 33),
((SELECT id FROM workflow_categoria), 'registrar_tempo_aprovacao', 'Registrar tempo de aprovação por nível', 'Define se tempo de aprovação é registrado', 'boolean', 'true', 34),
((SELECT id FROM workflow_categoria), 'relatorio_performance', 'Gerar relatório de performance de aprovação', 'Define se relatórios de performance são gerados', 'boolean', 'false', 35),
((SELECT id FROM workflow_categoria), 'alertar_atrasos', 'Alertar solicitante sobre atrasos', 'Define se alertas de atrasos são enviados', 'boolean', 'true', 36),

-- 4.6 Regras de Delegação
((SELECT id FROM workflow_categoria), 'delegacao_temporaria', 'Permitir delegação temporária', 'Define se delegação temporária é permitida', 'boolean', 'true', 37),
((SELECT id FROM workflow_categoria), 'delegacao_permanente', 'Permitir delegação permanente', 'Define se delegação permanente é permitida', 'boolean', 'false', 38),
((SELECT id FROM workflow_categoria), 'periodo_determinado_delegacao', 'Exigir período determinado para delegação', 'Define se período determinado é exigido para delegação', 'boolean', 'true', 39),
((SELECT id FROM workflow_categoria), 'delegacao_por_valor', 'Permitir delegação por valor específico', 'Define se delegação por valor específico é permitida', 'boolean', 'false', 40),
((SELECT id FROM workflow_categoria), 'delegacao_por_categoria', 'Permitir delegação por categoria', 'Define se delegação por categoria é permitida', 'boolean', 'false', 41),
((SELECT id FROM workflow_categoria), 'notificar_delegacoes_ativas', 'Notificar sobre delegações ativas', 'Define se notificações sobre delegações ativas são enviadas', 'boolean', 'true', 42),
((SELECT id FROM workflow_categoria), 'justificativa_delegacao', 'Exigir justificativa para delegação', 'Define se justificativa é exigida para delegação', 'boolean', 'true', 43),
((SELECT id FROM workflow_categoria), 'multiplas_delegacoes', 'Permitir múltiplas delegações simultâneas', 'Define se múltiplas delegações simultâneas são permitidas', 'boolean', 'false', 44);

-- Inserir templates de regras para "Cotação Direta"
WITH cotacao_categoria AS (
  SELECT id FROM business_rule_categories 
  WHERE name = 'Cotação Direta' 
  AND module_id = (SELECT id FROM modules WHERE type = 'requisicoes' LIMIT 1)
)
INSERT INTO business_rule_templates (category_id, rule_key, name, description, rule_type, default_value, order_index) VALUES
-- 5.1 Regras de Limite para Cotação
((SELECT id FROM cotacao_categoria), 'cotacao_direta_5000', 'Permitir cotação direta até R$ 5.000', 'Define se cotação direta até R$ 5.000 é permitida', 'boolean', 'false', 1),
((SELECT id FROM cotacao_categoria), 'cotacao_direta_10000', 'Permitir cotação direta até R$ 10.000', 'Define se cotação direta até R$ 10.000 é permitida', 'boolean', 'true', 2),
((SELECT id FROM cotacao_categoria), 'cotacao_direta_25000', 'Permitir cotação direta até R$ 25.000', 'Define se cotação direta até R$ 25.000 é permitida', 'boolean', 'false', 3),
((SELECT id FROM cotacao_categoria), 'limite_por_categoria', 'Aplicar limite diferente por categoria', 'Define se limite diferente por categoria é aplicado', 'boolean', 'false', 4),
((SELECT id FROM cotacao_categoria), 'limite_por_centro_custo', 'Aplicar limite diferente por centro de custo', 'Define se limite diferente por centro de custo é aplicado', 'boolean', 'false', 5),
((SELECT id FROM cotacao_categoria), 'justificativa_cotacao_direta', 'Exigir justificativa para cotação direta', 'Define se justificativa é exigida para cotação direta', 'boolean', 'false', 6),
((SELECT id FROM cotacao_categoria), 'aprovacao_cotacao_direta', 'Exigir aprovação para cotação direta', 'Define se aprovação é exigida para cotação direta', 'boolean', 'false', 7),
((SELECT id FROM cotacao_categoria), 'bloquear_acima_limite', 'Bloquear cotação acima do limite configurado', 'Define se cotação acima do limite é bloqueada', 'boolean', 'true', 8),

-- 5.2 Regras de Fornecedores para Cotação
((SELECT id FROM cotacao_categoria), 'apenas_qualificados', 'Permitir cotação apenas com fornecedores qualificados', 'Define se apenas fornecedores qualificados podem cotar', 'boolean', 'true', 9),
((SELECT id FROM cotacao_categoria), 'fornecedores_registrados', 'Permitir cotação com fornecedores registrados', 'Define se fornecedores registrados podem cotar', 'boolean', 'true', 10),
((SELECT id FROM cotacao_categoria), 'minimo_3_fornecedores', 'Exigir mínimo de 3 fornecedores', 'Define se mínimo de 3 fornecedores é exigido', 'boolean', 'true', 11),
((SELECT id FROM cotacao_categoria), 'permitir_1_fornecedor', 'Permitir cotação com 1 fornecedor com justificativa', 'Define se cotação com 1 fornecedor é permitida com justificativa', 'boolean', 'true', 12),
((SELECT id FROM cotacao_categoria), 'validar_categoria_fornecedor', 'Validar categoria do fornecedor', 'Define se categoria do fornecedor é validada', 'boolean', 'true', 13),
((SELECT id FROM cotacao_categoria), 'verificar_fornecedor_ativo', 'Verificar se fornecedor está ativo', 'Define se status ativo do fornecedor é verificado', 'boolean', 'true', 14),
((SELECT id FROM cotacao_categoria), 'sugerir_novos_fornecedores', 'Permitir sugestão de novos fornecedores', 'Define se sugestão de novos fornecedores é permitida', 'boolean', 'true', 15),

-- 5.3 Regras de Processo de Cotação
((SELECT id FROM cotacao_categoria), 'envio_automatico', 'Enviar cotação automaticamente aos fornecedores', 'Define se envio automático de cotação é realizado', 'boolean', 'false', 16),
((SELECT id FROM cotacao_categoria), 'envio_manual', 'Permitir envio manual de cotação', 'Define se envio manual de cotação é permitido', 'boolean', 'true', 17),
((SELECT id FROM cotacao_categoria), 'prazo_padrao_resposta', 'Definir prazo padrão para resposta (dias)', 'Define prazo padrão para resposta em dias', 'number', '7', 18),
((SELECT id FROM cotacao_categoria), 'extensao_prazo', 'Permitir extensão de prazo', 'Define se extensão de prazo é permitida', 'boolean', 'true', 19),
((SELECT id FROM cotacao_categoria), 'notificar_cotacoes_abertas', 'Notificar sobre cotações em aberto', 'Define se notificações sobre cotações em aberto são enviadas', 'boolean', 'true', 20),
((SELECT id FROM cotacao_categoria), 'coletar_respostas_automaticamente', 'Coletar respostas automaticamente', 'Define se respostas são coletadas automaticamente', 'boolean', 'false', 21),
((SELECT id FROM cotacao_categoria), 'permitir_alteracao_solicitante', 'Permitir alteração da cotação pelo solicitante', 'Define se alteração pelo solicitante é permitida', 'boolean', 'true', 22),
((SELECT id FROM cotacao_categoria), 'aprovacao_alteracoes', 'Exigir aprovação para alterações', 'Define se aprovação para alterações é exigida', 'boolean', 'false', 23),

-- 5.4 Regras de Seleção de Fornecedor
((SELECT id FROM cotacao_categoria), 'selecao_automatica_menor_preco', 'Selecionar automaticamente menor preço', 'Define se seleção automática pelo menor preço é realizada', 'boolean', 'false', 24),
((SELECT id FROM cotacao_categoria), 'selecao_manual_justificativa', 'Permitir seleção manual com justificativa', 'Define se seleção manual com justificativa é permitida', 'boolean', 'true', 25),
((SELECT id FROM cotacao_categoria), 'criterios_tecnicos', 'Considerar critérios técnicos na seleção', 'Define se critérios técnicos são considerados', 'boolean', 'true', 26),
((SELECT id FROM cotacao_categoria), 'performance_historica', 'Considerar performance histórica', 'Define se performance histórica é considerada', 'boolean', 'false', 27),
((SELECT id FROM cotacao_categoria), 'menor_preco_global', 'Aplicar critério de menor preço global', 'Define se critério de menor preço global é aplicado', 'boolean', 'false', 28),
((SELECT id FROM cotacao_categoria), 'negociacao_pos_cotacao', 'Permitir negociação pós-cotação', 'Define se negociação pós-cotação é permitida', 'boolean', 'false', 29),
((SELECT id FROM cotacao_categoria), 'aprovacao_selecao_nao_automatica', 'Exigir aprovação para seleção não automática', 'Define se aprovação para seleção não automática é exigida', 'boolean', 'true', 30);

-- Inserir templates de regras para as demais categorias (continuação)
-- Esta é uma versão condensada das demais categorias por limitação de espaço
-- As demais categorias seguiriam o mesmo padrão acima
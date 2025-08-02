
-- Inserir categorias para o módulo de pedidos
INSERT INTO public.business_rule_categories (id, module_id, name, description, order_index) 
VALUES 
  -- Assumindo que existe um módulo de pedidos
  (gen_random_uuid(), (SELECT id FROM modules WHERE type = 'pedidos' LIMIT 1), '1. Regras de Criação de Pedidos', 'Controla origem, numeração e dados obrigatórios dos pedidos', 1),
  (gen_random_uuid(), (SELECT id FROM modules WHERE type = 'pedidos' LIMIT 1), '2. Regras de Validação e Aprovação', 'Define validações prévias, workflow e prazos de aprovação', 2),
  (gen_random_uuid(), (SELECT id FROM modules WHERE type = 'pedidos' LIMIT 1), '3. Regras de Transmissão ao Fornecedor', 'Controla envio, formato e versionamento de pedidos', 3),
  (gen_random_uuid(), (SELECT id FROM modules WHERE type = 'pedidos' LIMIT 1), '4. Regras do Portal do Fornecedor', 'Define acesso, visualização e funcionalidades do portal', 4),
  (gen_random_uuid(), (SELECT id FROM modules WHERE type = 'pedidos' LIMIT 1), '5. Regras de Confirmação de Pedidos', 'Controla processo, validação e status de confirmação', 5),
  (gen_random_uuid(), (SELECT id FROM modules WHERE type = 'pedidos' LIMIT 1), '6. Regras de Avisos de Entrega', 'Define criação, validação e notificações de entrega', 6),
  (gen_random_uuid(), (SELECT id FROM modules WHERE type = 'pedidos' LIMIT 1), '7. Regras de Recebimento e Conferência', 'Controla processo, qualidade e devoluções', 7),
  (gen_random_uuid(), (SELECT id FROM modules WHERE type = 'pedidos' LIMIT 1), '8. Regras de Comunicação e Colaboração', 'Define mensagens, documentos e colaboração', 8),
  (gen_random_uuid(), (SELECT id FROM modules WHERE type = 'pedidos' LIMIT 1), '9. Regras de Alterações de Pedidos', 'Controla solicitação, aprovação e impacto de alterações', 9),
  (gen_random_uuid(), (SELECT id FROM modules WHERE type = 'pedidos' LIMIT 1), '10. Regras de Cancelamento', 'Define processo, custos e reposição de cancelamentos', 10),
  (gen_random_uuid(), (SELECT id FROM modules WHERE type = 'pedidos' LIMIT 1), '11. Regras de Performance e Monitoramento', 'Controla KPIs, performance e alertas', 11),
  (gen_random_uuid(), (SELECT id FROM modules WHERE type = 'pedidos' LIMIT 1), '12. Regras de Relatórios e Analytics', 'Define dashboards, relatórios e analytics avançados', 12),
  (gen_random_uuid(), (SELECT id FROM modules WHERE type = 'pedidos' LIMIT 1), '13. Regras de Integração', 'Controla integração ERP, externa e APIs', 13);

-- Inserir regras para categoria 1 (Criação de Pedidos)
INSERT INTO public.business_rule_templates (
  category_id, rule_key, name, description, rule_type, default_value, 
  impact_level, order_index, is_core, requires_approval
) VALUES 
  -- 1.1 Regras de Origem do Pedido
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Criação de Pedidos' LIMIT 1), 'auto_create_from_events', 'Criar pedidos automaticamente de eventos adjudicados', 'Geração automática de pedidos quando eventos de compra são adjudicados', 'boolean', 'true', 'high', 1, false, true),
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Criação de Pedidos' LIMIT 1), 'auto_create_from_quotes', 'Criar pedidos automaticamente de cotações diretas', 'Geração automática de pedidos a partir de cotações aprovadas', 'boolean', 'true', 'medium', 2, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Criação de Pedidos' LIMIT 1), 'auto_create_from_requisitions', 'Criar pedidos automaticamente de requisições aprovadas', 'Geração automática de pedidos de requisições com fornecedor definido', 'boolean', 'false', 'medium', 3, false, true),
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Criação de Pedidos' LIMIT 1), 'allow_manual_creation', 'Permitir criação manual de pedidos', 'Possibilita criação manual de pedidos pelos compradores', 'boolean', 'true', 'medium', 4, true, false),
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Criação de Pedidos' LIMIT 1), 'import_external_orders', 'Importar pedidos de sistemas externos', 'Permite importação de pedidos de ERPs e outros sistemas', 'boolean', 'false', 'high', 5, false, true),
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Criação de Pedidos' LIMIT 1), 'create_from_umbrella_contracts', 'Criar pedidos de contratos guarda-chuva', 'Geração de pedidos baseados em contratos pré-negociados', 'boolean', 'true', 'medium', 6, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Criação de Pedidos' LIMIT 1), 'allow_call_off_orders', 'Permitir pedidos de call-off', 'Possibilita pedidos de chamada de contratos existentes', 'boolean', 'true', 'medium', 7, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Criação de Pedidos' LIMIT 1), 'require_approval_manual_orders', 'Exigir aprovação para pedidos manuais', 'Pedidos criados manualmente precisam de aprovação', 'boolean', 'true', 'high', 8, false, true),
  
  -- 1.2 Regras de Numeração
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Criação de Pedidos' LIMIT 1), 'sequential_numbering', 'Aplicar numeração sequencial automática', 'Numeração automática e sequencial dos pedidos', 'boolean', 'true', 'high', 9, true, false),
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Criação de Pedidos' LIMIT 1), 'numbering_by_cost_center', 'Usar numeração por centro de custo', 'Numeração específica por centro de custo', 'boolean', 'false', 'medium', 10, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Criação de Pedidos' LIMIT 1), 'numbering_by_order_type', 'Aplicar numeração por tipo de pedido', 'Numeração diferenciada por tipo de pedido', 'boolean', 'false', 'medium', 11, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Criação de Pedidos' LIMIT 1), 'include_year_month_numbering', 'Incluir ano/mês na numeração', 'Numeração inclui período de criação', 'boolean', 'true', 'low', 12, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Criação de Pedidos' LIMIT 1), 'allow_custom_numbering', 'Permitir numeração personalizada', 'Possibilita numeração customizada por usuário', 'boolean', 'false', 'medium', 13, false, true),
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Criação de Pedidos' LIMIT 1), 'unique_numbering_per_company', 'Manter numeração única por empresa', 'Numeração única dentro de cada empresa', 'boolean', 'true', 'high', 14, true, false),
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Criação de Pedidos' LIMIT 1), 'prefixes_by_business_unit', 'Aplicar prefixos por unidade de negócio', 'Prefixos específicos para cada unidade', 'boolean', 'false', 'medium', 15, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Criação de Pedidos' LIMIT 1), 'include_location_code', 'Incluir código da localização', 'Código da localização na numeração', 'boolean', 'false', 'low', 16, false, false),
  
  -- 1.3 Regras de Dados Obrigatórios
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Criação de Pedidos' LIMIT 1), 'require_supplier', 'Exigir fornecedor obrigatório', 'Fornecedor é campo obrigatório no pedido', 'boolean', 'true', 'critical', 17, true, false),
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Criação de Pedidos' LIMIT 1), 'require_delivery_date', 'Exigir data de entrega obrigatória', 'Data de entrega é obrigatória', 'boolean', 'true', 'high', 18, true, false),
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Criação de Pedidos' LIMIT 1), 'require_delivery_location', 'Exigir local de entrega obrigatório', 'Local de entrega deve ser especificado', 'boolean', 'true', 'high', 19, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Criação de Pedidos' LIMIT 1), 'require_cost_center', 'Exigir centro de custo obrigatório', 'Centro de custo é obrigatório', 'boolean', 'true', 'high', 20, true, false),
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Criação de Pedidos' LIMIT 1), 'require_accounting_account', 'Exigir conta contábil obrigatória', 'Conta contábil deve ser informada', 'boolean', 'true', 'high', 21, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Criação de Pedidos' LIMIT 1), 'require_payment_terms', 'Exigir condições de pagamento', 'Condições de pagamento obrigatórias', 'boolean', 'true', 'medium', 22, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Criação de Pedidos' LIMIT 1), 'require_order_responsible', 'Exigir responsável pelo pedido', 'Responsável pelo pedido deve ser definido', 'boolean', 'true', 'medium', 23, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Criação de Pedidos' LIMIT 1), 'require_delivery_contact', 'Exigir contato para entrega', 'Contato para entrega é obrigatório', 'boolean', 'false', 'medium', 24, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Criação de Pedidos' LIMIT 1), 'require_technical_notes', 'Exigir observações técnicas', 'Observações técnicas obrigatórias', 'boolean', 'false', 'medium', 25, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Criação de Pedidos' LIMIT 1), 'require_project_code', 'Exigir código do projeto', 'Código do projeto deve ser informado', 'boolean', 'false', 'medium', 26, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Criação de Pedidos' LIMIT 1), 'allow_custom_mandatory_fields', 'Permitir campos personalizados obrigatórios', 'Campos customizados podem ser obrigatórios', 'boolean', 'false', 'medium', 27, false, true);

-- Inserir regras para categoria 2 (Validação e Aprovação)
INSERT INTO public.business_rule_templates (
  category_id, rule_key, name, description, rule_type, default_value, 
  impact_level, order_index, is_core, requires_approval
) VALUES 
  -- 2.1 Regras de Validação Prévia
  ((SELECT id FROM business_rule_categories WHERE name = '2. Regras de Validação e Aprovação' LIMIT 1), 'validate_active_qualified_supplier', 'Validar fornecedor ativo e qualificado', 'Verifica se o fornecedor está ativo e qualificado', 'boolean', 'true', 'critical', 1, true, false),
  ((SELECT id FROM business_rule_categories WHERE name = '2. Regras de Validação e Aprovação' LIMIT 1), 'check_supplier_documentation', 'Verificar documentação do fornecedor em dia', 'Validação de documentos obrigatórios em vigência', 'boolean', 'true', 'high', 2, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '2. Regras de Validação e Aprovação' LIMIT 1), 'validate_budget_balance', 'Validar saldo orçamentário disponível', 'Verifica disponibilidade orçamentária', 'boolean', 'true', 'critical', 3, true, false),
  ((SELECT id FROM business_rule_categories WHERE name = '2. Regras de Validação e Aprovação' LIMIT 1), 'check_supplier_credit_limit', 'Verificar limite de crédito do fornecedor', 'Validação do limite de crédito disponível', 'boolean', 'true', 'high', 4, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '2. Regras de Validação e Aprovação' LIMIT 1), 'validate_supplier_bank_data', 'Validar dados bancários do fornecedor', 'Verificação de dados bancários atualizados', 'boolean', 'true', 'medium', 5, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '2. Regras de Validação e Aprovação' LIMIT 1), 'check_allowed_category', 'Verificar se categoria está permitida', 'Validação de categoria autorizada para o fornecedor', 'boolean', 'true', 'high', 6, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '2. Regras de Validação e Aprovação' LIMIT 1), 'validate_prices_against_table', 'Validar preços contra tabela/contrato', 'Verificação de preços contra referências', 'boolean', 'true', 'medium', 7, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '2. Regras de Validação e Aprovação' LIMIT 1), 'check_stock_availability', 'Verificar disponibilidade de estoque', 'Validação de disponibilidade em estoque', 'boolean', 'false', 'medium', 8, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '2. Regras de Validação e Aprovação' LIMIT 1), 'validate_delivery_address', 'Validar endereço de entrega', 'Verificação de endereço válido para entrega', 'boolean', 'true', 'medium', 9, false, false),
  
  -- 2.2 Regras de Workflow de Aprovação
  ((SELECT id FROM business_rule_categories WHERE name = '2. Regras de Validação e Aprovação' LIMIT 1), 'approval_by_order_value', 'Aplicar aprovação por valor do pedido', 'Workflow de aprovação baseado no valor', 'boolean', 'true', 'critical', 10, true, true),
  ((SELECT id FROM business_rule_categories WHERE name = '2. Regras de Validação e Aprovação' LIMIT 1), 'approval_by_category', 'Aplicar aprovação por categoria', 'Aprovação específica por categoria de produto', 'boolean', 'true', 'high', 11, false, true),
  ((SELECT id FROM business_rule_categories WHERE name = '2. Regras de Validação e Aprovação' LIMIT 1), 'require_original_requester_approval', 'Exigir aprovação do solicitante original', 'Aprovação do solicitante da requisição', 'boolean', 'true', 'medium', 12, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '2. Regras de Validação e Aprovação' LIMIT 1), 'require_technical_approval', 'Exigir aprovação técnica para categorias específicas', 'Aprovação técnica para produtos críticos', 'boolean', 'true', 'high', 13, false, true),
  ((SELECT id FROM business_rule_categories WHERE name = '2. Regras de Validação e Aprovação' LIMIT 1), 'require_budget_approval', 'Exigir aprovação orçamentária', 'Aprovação da área orçamentária', 'boolean', 'true', 'high', 14, false, true),
  ((SELECT id FROM business_rule_categories WHERE name = '2. Regras de Validação e Aprovação' LIMIT 1), 'approval_by_cost_center', 'Aplicar aprovação por centro de custo', 'Aprovação específica do centro de custo', 'boolean', 'true', 'medium', 15, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '2. Regras de Validação e Aprovação' LIMIT 1), 'require_legal_approval_contracts', 'Exigir aprovação jurídica para contratos', 'Aprovação jurídica obrigatória', 'boolean', 'true', 'high', 16, false, true),
  ((SELECT id FROM business_rule_categories WHERE name = '2. Regras de Validação e Aprovação' LIMIT 1), 'allow_parallel_approval', 'Permitir aprovação em paralelo', 'Aprovações simultâneas quando possível', 'boolean', 'false', 'medium', 17, false, true),
  ((SELECT id FROM business_rule_categories WHERE name = '2. Regras de Validação e Aprovação' LIMIT 1), 'require_sequential_approval', 'Aplicar aprovação sequencial obrigatória', 'Aprovações em sequência definida', 'boolean', 'true', 'medium', 18, false, true),
  ((SELECT id FROM business_rule_categories WHERE name = '2. Regras de Validação e Aprovação' LIMIT 1), 'allow_approval_delegation', 'Permitir delegação de aprovação', 'Possibilita delegar aprovações', 'boolean', 'true', 'medium', 19, false, false),
  
  -- 2.3 Regras de Prazos de Aprovação
  ((SELECT id FROM business_rule_categories WHERE name = '2. Regras de Validação e Aprovação' LIMIT 1), 'define_sla_approval_level', 'Definir SLA por nível de aprovação', 'SLA específico para cada nível', 'boolean', 'true', 'medium', 20, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '2. Regras de Validação e Aprovação' LIMIT 1), 'auto_escalate_after_deadline', 'Escalar automaticamente após prazo', 'Escalação automática por prazo vencido', 'boolean', 'true', 'high', 21, false, true),
  ((SELECT id FROM business_rule_categories WHERE name = '2. Regras de Validação e Aprovação' LIMIT 1), 'notify_approvers_deadline', 'Notificar aprovadores sobre vencimento', 'Notificações de prazos para aprovadores', 'boolean', 'true', 'medium', 22, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '2. Regras de Validação e Aprovação' LIMIT 1), 'allow_email_approval', 'Permitir aprovação via e-mail', 'Aprovação pode ser feita por e-mail', 'boolean', 'false', 'medium', 23, false, true),
  ((SELECT id FROM business_rule_categories WHERE name = '2. Regras de Validação e Aprovação' LIMIT 1), 'require_system_only_approval', 'Exigir aprovação apenas no sistema', 'Aprovação exclusivamente pelo sistema', 'boolean', 'true', 'high', 24, false, true),
  ((SELECT id FROM business_rule_categories WHERE name = '2. Regras de Validação e Aprovação' LIMIT 1), 'track_approval_time', 'Registrar tempo de aprovação', 'Log de tempos de cada aprovação', 'boolean', 'true', 'low', 25, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '2. Regras de Validação e Aprovação' LIMIT 1), 'generate_approval_reports', 'Gerar relatórios de performance de aprovação', 'Relatórios de performance do workflow', 'boolean', 'true', 'low', 26, false, false);

-- Inserir algumas regras das outras categorias principais
INSERT INTO public.business_rule_templates (
  category_id, rule_key, name, description, rule_type, default_value, 
  impact_level, order_index, is_core, requires_approval
) VALUES 
  -- 3. Regras de Transmissão ao Fornecedor
  ((SELECT id FROM business_rule_categories WHERE name = '3. Regras de Transmissão ao Fornecedor' LIMIT 1), 'auto_send_after_approval', 'Enviar pedido automaticamente após aprovação', 'Envio automático quando aprovado', 'boolean', 'true', 'high', 1, true, false),
  ((SELECT id FROM business_rule_categories WHERE name = '3. Regras de Transmissão ao Fornecedor' LIMIT 1), 'require_manual_send', 'Exigir envio manual do pedido', 'Envio manual obrigatório', 'boolean', 'false', 'medium', 2, false, true),
  ((SELECT id FROM business_rule_categories WHERE name = '3. Regras de Transmissão ao Fornecedor' LIMIT 1), 'auto_email_send', 'Enviar por e-mail automaticamente', 'Envio automático por e-mail', 'boolean', 'true', 'medium', 3, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '3. Regras de Transmissão ao Fornecedor' LIMIT 1), 'make_available_supplier_portal', 'Disponibilizar no portal do fornecedor', 'Publicação no portal do fornecedor', 'boolean', 'true', 'high', 4, true, false),
  ((SELECT id FROM business_rule_categories WHERE name = '3. Regras de Transmissão ao Fornecedor' LIMIT 1), 'send_via_edi', 'Enviar por EDI', 'Transmissão via EDI quando disponível', 'boolean', 'false', 'medium', 5, false, true),
  ((SELECT id FROM business_rule_categories WHERE name = '3. Regras de Transmissão ao Fornecedor' LIMIT 1), 'integrate_supplier_api', 'Integrar com sistema do fornecedor via API', 'Integração direta via API', 'boolean', 'false', 'high', 6, false, true),
  ((SELECT id FROM business_rule_categories WHERE name = '3. Regras de Transmissão ao Fornecedor' LIMIT 1), 'require_receipt_confirmation', 'Exigir confirmação de recebimento', 'Confirmação obrigatória de recebimento', 'boolean', 'true', 'medium', 7, false, false),
  
  -- 4. Regras do Portal do Fornecedor
  ((SELECT id FROM business_rule_categories WHERE name = '4. Regras do Portal do Fornecedor' LIMIT 1), 'require_unique_login', 'Exigir login único por fornecedor', 'Um login por fornecedor', 'boolean', 'false', 'medium', 1, false, true),
  ((SELECT id FROM business_rule_categories WHERE name = '4. Regras do Portal do Fornecedor' LIMIT 1), 'allow_multiple_users', 'Permitir múltiplos usuários por fornecedor', 'Vários usuários por fornecedor', 'boolean', 'true', 'medium', 2, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '4. Regras do Portal do Fornecedor' LIMIT 1), 'require_two_factor_auth', 'Aplicar autenticação de dois fatores', '2FA obrigatório no portal', 'boolean', 'false', 'high', 3, false, true),
  ((SELECT id FROM business_rule_categories WHERE name = '4. Regras do Portal do Fornecedor' LIMIT 1), 'integrate_sso', 'Integrar com SSO (Single Sign-On)', 'Integração com sistemas SSO', 'boolean', 'false', 'high', 4, false, true),
  ((SELECT id FROM business_rule_categories WHERE name = '4. Regras do Portal do Fornecedor' LIMIT 1), 'define_access_profiles', 'Definir diferentes perfis de acesso', 'Perfis de acesso diferenciados', 'boolean', 'true', 'medium', 5, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '4. Regras do Portal do Fornecedor' LIMIT 1), 'control_access_by_cnpj', 'Controlar acesso por filial/CNPJ', 'Controle por CNPJ específico', 'boolean', 'true', 'medium', 6, false, false),
  
  -- 5. Regras de Confirmação de Pedidos
  ((SELECT id FROM business_rule_categories WHERE name = '5. Regras de Confirmação de Pedidos' LIMIT 1), 'require_mandatory_confirmation', 'Exigir confirmação obrigatória', 'Confirmação obrigatória de todos os pedidos', 'boolean', 'true', 'critical', 1, true, false),
  ((SELECT id FROM business_rule_categories WHERE name = '5. Regras de Confirmação de Pedidos' LIMIT 1), 'allow_optional_confirmation', 'Permitir confirmação opcional', 'Confirmação opcional para alguns casos', 'boolean', 'false', 'medium', 2, false, true),
  ((SELECT id FROM business_rule_categories WHERE name = '5. Regras de Confirmação de Pedidos' LIMIT 1), 'define_confirmation_deadline', 'Definir prazo para confirmação', 'Prazo limite para confirmação', 'numeric', '3', 'high', 3, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '5. Regras de Confirmação de Pedidos' LIMIT 1), 'allow_partial_confirmation', 'Permitir confirmação parcial', 'Confirmação item por item', 'boolean', 'true', 'medium', 4, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '5. Regras de Confirmação de Pedidos' LIMIT 1), 'allow_delivery_date_change', 'Permitir alteração de prazos na confirmação', 'Alteração de datas durante confirmação', 'boolean', 'true', 'medium', 5, false, false),
  
  -- Algumas regras das demais categorias para demonstrar a estrutura
  ((SELECT id FROM business_rule_categories WHERE name = '11. Regras de Performance e Monitoramento' LIMIT 1), 'measure_confirmation_time', 'Medir tempo de confirmação', 'KPI de tempo médio de confirmação', 'boolean', 'true', 'low', 1, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '11. Regras de Performance e Monitoramento' LIMIT 1), 'track_delivery_punctuality', 'Acompanhar pontualidade de entrega', 'Monitoramento de entregas no prazo', 'boolean', 'true', 'medium', 2, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '11. Regras de Performance e Monitoramento' LIMIT 1), 'monitor_receipt_quality', 'Monitorar qualidade dos recebimentos', 'KPI de qualidade dos recebimentos', 'boolean', 'true', 'medium', 3, false, false),
  
  ((SELECT id FROM business_rule_categories WHERE name = '13. Regras de Integração' LIMIT 1), 'sync_orders_with_erp', 'Sincronizar pedidos com ERP', 'Sincronização automática com ERP', 'boolean', 'true', 'critical', 1, true, true),
  ((SELECT id FROM business_rule_categories WHERE name = '13. Regras de Integração' LIMIT 1), 'integrate_receipts_automatically', 'Integrar recebimentos automaticamente', 'Integração automática de recebimentos', 'boolean', 'true', 'high', 2, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '13. Regras de Integração' LIMIT 1), 'sync_financial_data', 'Sincronizar dados financeiros', 'Sincronização de dados financeiros', 'boolean', 'true', 'high', 3, false, true);

-- Inserir regras de configuração global (valores numéricos configuráveis)
INSERT INTO public.business_rule_templates (
  category_id, rule_key, name, description, rule_type, default_value, 
  impact_level, order_index, is_core, requires_approval
) VALUES 
  ((SELECT id FROM business_rule_categories WHERE name = '5. Regras de Confirmação de Pedidos' LIMIT 1), 'confirmation_deadline_days', 'Prazo para confirmação de pedido (dias)', 'Prazo padrão em dias para confirmação', 'numeric', '3', 'medium', 10, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '6. Regras de Avisos de Entrega' LIMIT 1), 'default_delivery_days', 'Prazo para entrega padrão (dias)', 'Prazo padrão para entrega', 'numeric', '15', 'medium', 1, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '7. Regras de Recebimento e Conferência' LIMIT 1), 'quantity_tolerance_percent', 'Tolerância para quantidade (%)', 'Percentual de tolerância para quantidades', 'numeric', '5', 'medium', 1, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '6. Regras de Avisos de Entrega' LIMIT 1), 'delivery_tolerance_days', 'Tolerância para prazo (dias)', 'Tolerância em dias para entregas', 'numeric', '2', 'medium', 2, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Criação de Pedidos' LIMIT 1), 'minimum_order_value', 'Valor mínimo para pedido (R$)', 'Valor mínimo para criação de pedidos', 'numeric', '100', 'medium', 28, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '4. Regras do Portal do Fornecedor' LIMIT 1), 'portal_session_minutes', 'Sessão do portal (minutos)', 'Tempo de sessão do portal em minutos', 'numeric', '60', 'low', 10, false, false);

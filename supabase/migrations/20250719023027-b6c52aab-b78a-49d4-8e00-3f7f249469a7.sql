
-- Adicionar mais feature flags relevantes para cada módulo
INSERT INTO public.feature_flags (module_id, flag_name, is_enabled, config, environment) VALUES
-- Fornecedores
((SELECT id FROM modules WHERE type = 'fornecedores'), 'bulk_operations', false, '{"max_bulk_size": 100}', 'production'),
((SELECT id FROM modules WHERE type = 'fornecedores'), 'risk_analysis', true, '{"auto_calculate": true, "alert_threshold": 0.7}', 'production'),
((SELECT id FROM modules WHERE type = 'fornecedores'), 'duplicate_detection', true, '{"similarity_threshold": 0.85}', 'production'),
((SELECT id FROM modules WHERE type = 'fornecedores'), 'external_search', false, '{"providers": ["serasa", "spc"]}', 'production'),

-- Requisições
((SELECT id FROM modules WHERE type = 'requisicoes'), 'auto_approval', false, '{"max_value": 1000, "trusted_areas": ["TI", "RH"]}', 'production'),
((SELECT id FROM modules WHERE type = 'requisicoes'), 'budget_control', true, '{"check_budget": true, "block_over_budget": false}', 'production'),
((SELECT id FROM modules WHERE type = 'requisicoes'), 'multi_approval', true, '{"parallel_approval": false}', 'production'),
((SELECT id FROM modules WHERE type = 'requisicoes'), 'urgent_requests', true, '{"bypass_approval": false}', 'production'),

-- Pedidos
((SELECT id FROM modules WHERE type = 'pedidos'), 'supplier_integration', false, '{"auto_send": false, "portal_sync": true}', 'production'),
((SELECT id FROM modules WHERE type = 'pedidos'), 'electronic_signature', false, '{"provider": "docusign", "required": false}', 'production'),
((SELECT id FROM modules WHERE type = 'pedidos'), 'delivery_tracking', true, '{"real_time": false, "notifications": true}', 'production'),
((SELECT id FROM modules WHERE type = 'pedidos'), 'price_validation', true, '{"tolerance": 0.05, "auto_block": false}', 'production');

-- Adicionar mais workspaces de exemplo
INSERT INTO public.module_workspaces (module_id, name, description, configuration, is_active) VALUES
((SELECT id FROM modules WHERE type = 'fornecedores'), 'Workspace Desenvolvimento', 'Configurações para ambiente de desenvolvimento', '{"debug_mode": true, "test_data": true, "validation_strict": false}', true),
((SELECT id FROM modules WHERE type = 'requisicoes'), 'Workspace Aprovação Rápida', 'Configurações para aprovações simplificadas', '{"auto_approval_limit": 500, "skip_manager_approval": true}', true),
((SELECT id FROM modules WHERE type = 'pedidos'), 'Workspace Portal Integrado', 'Configurações para integração com portal de fornecedores', '{"portal_enabled": true, "auto_sync": true, "notification_emails": ["compras@empresa.com"]}', true);

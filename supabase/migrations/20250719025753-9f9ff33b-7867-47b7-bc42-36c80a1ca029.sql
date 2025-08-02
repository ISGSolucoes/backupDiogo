
-- Primeiro, vamos inserir as categorias organizadas para o módulo de fornecedores
INSERT INTO public.business_rule_categories (id, module_id, name, description, order_index) 
VALUES 
  -- Assumindo que existe um módulo de fornecedores, vamos usar um ID fixo
  (gen_random_uuid(), (SELECT id FROM modules WHERE type = 'fornecedores' LIMIT 1), '1. Regras de Registro e Onboarding', 'Controla como fornecedores são registrados e integrados ao sistema', 1),
  (gen_random_uuid(), (SELECT id FROM modules WHERE type = 'fornecedores' LIMIT 1), '2. Regras de Qualificação', 'Define critérios e processos para qualificação de fornecedores', 2),
  (gen_random_uuid(), (SELECT id FROM modules WHERE type = 'fornecedores' LIMIT 1), '3. Regras de Cotação e Seleção', 'Controla participação em cotações e critérios de seleção', 3),
  (gen_random_uuid(), (SELECT id FROM modules WHERE type = 'fornecedores' LIMIT 1), '4. Regras de Performance e Avaliação', 'Define como a performance dos fornecedores é medida', 4),
  (gen_random_uuid(), (SELECT id FROM modules WHERE type = 'fornecedores' LIMIT 1), '5. Regras de Gestão de Risco', 'Controla monitoramento e mitigação de riscos', 5),
  (gen_random_uuid(), (SELECT id FROM modules WHERE type = 'fornecedores' LIMIT 1), '6. Regras de Monitoramento e Alertas', 'Define alertas automáticos e monitoramento contínuo', 6),
  (gen_random_uuid(), (SELECT id FROM modules WHERE type = 'fornecedores' LIMIT 1), '7. Regras de Desenvolvimento', 'Controla programas de desenvolvimento de fornecedores', 7),
  (gen_random_uuid(), (SELECT id FROM modules WHERE type = 'fornecedores' LIMIT 1), '8. Regras de Auditoria', 'Define processos de auditoria e compliance', 8),
  (gen_random_uuid(), (SELECT id FROM modules WHERE type = 'fornecedores' LIMIT 1), '9. Regras de Portal do Fornecedor', 'Controla funcionalidades do portal de fornecedores', 9),
  (gen_random_uuid(), (SELECT id FROM modules WHERE type = 'fornecedores' LIMIT 1), '10. Regras de Integração e Segurança', 'Define integrações e políticas de segurança', 10);

-- Agora vamos inserir as regras granulares para a categoria 1 (Registro e Onboarding)
INSERT INTO public.business_rule_templates (
  category_id, rule_key, name, description, rule_type, default_value, 
  impact_level, order_index, is_core, requires_approval
) VALUES 
  -- 1.1 Regras de Convite e Acesso
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Registro e Onboarding' LIMIT 1), 'allow_self_registration', 'Permitir que fornecedores se auto-registrem no portal', 'Permite que novos fornecedores se cadastrem diretamente no portal sem convite', 'boolean', 'true', 'medium', 1, false, true),
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Registro e Onboarding' LIMIT 1), 'require_formal_invitation', 'Exigir convite formal para registro de novos fornecedores', 'Apenas fornecedores com convite formal podem se registrar', 'boolean', 'false', 'high', 2, false, true),
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Registro e Onboarding' LIMIT 1), 'allow_public_link_registration', 'Permitir registro através de link público', 'Disponibiliza link público para cadastro de fornecedores', 'boolean', 'true', 'medium', 3, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Registro e Onboarding' LIMIT 1), 'require_access_code', 'Exigir código de acesso para registro', 'Solicita código específico durante o processo de registro', 'boolean', 'false', 'medium', 4, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Registro e Onboarding' LIMIT 1), 'allow_multiple_users_per_supplier', 'Permitir múltiplos usuários por fornecedor', 'Permite que um fornecedor tenha vários usuários cadastrados', 'boolean', 'true', 'low', 5, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Registro e Onboarding' LIMIT 1), 'require_approval_new_users', 'Exigir aprovação para cada novo usuário do fornecedor', 'Novos usuários precisam de aprovação antes de acessar o sistema', 'boolean', 'true', 'medium', 6, false, true),
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Registro e Onboarding' LIMIT 1), 'allow_supplier_deactivate_users', 'Permitir fornecedores desativarem seus próprios usuários', 'Fornecedores podem gerenciar seus próprios usuários', 'boolean', 'true', 'low', 7, false, false),
  
  -- 1.2 Regras de Documentação Básica
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Registro e Onboarding' LIMIT 1), 'require_cnpj_brazilian_companies', 'Exigir CNPJ obrigatório para empresas brasileiras', 'CNPJ é obrigatório para empresas no Brasil', 'boolean', 'true', 'high', 8, true, true),
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Registro e Onboarding' LIMIT 1), 'allow_cpf_only_registration', 'Permitir cadastro apenas com CPF', 'Aceita cadastro de pessoa física apenas com CPF', 'boolean', 'true', 'medium', 9, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Registro e Onboarding' LIMIT 1), 'accept_international_suppliers', 'Aceitar fornecedores internacionais sem CNPJ', 'Permite cadastro de fornecedores estrangeiros', 'boolean', 'true', 'medium', 10, false, true),
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Registro e Onboarding' LIMIT 1), 'require_state_registration', 'Exigir inscrição estadual obrigatória', 'Inscrição estadual é obrigatória no cadastro', 'boolean', 'false', 'medium', 11, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Registro e Onboarding' LIMIT 1), 'validate_cnpj_automatically', 'Validar CNPJ automaticamente com Receita Federal', 'Integração automática com Receita Federal para validação', 'boolean', 'true', 'high', 12, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Registro e Onboarding' LIMIT 1), 'allow_duplicate_cnpj', 'Permitir CNPJ duplicado (matriz/filial)', 'Aceita o mesmo CNPJ para matriz e filiais', 'boolean', 'true', 'medium', 13, false, true),
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Registro e Onboarding' LIMIT 1), 'require_complete_address', 'Exigir endereço completo obrigatório', 'Todos os campos de endereço são obrigatórios', 'boolean', 'true', 'medium', 14, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Registro e Onboarding' LIMIT 1), 'validate_cep_automatically', 'Validar CEP automaticamente', 'Busca automática de endereço por CEP', 'boolean', 'true', 'low', 15, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Registro e Onboarding' LIMIT 1), 'allow_multiple_addresses', 'Permitir múltiplos endereços por fornecedor', 'Fornecedor pode cadastrar vários endereços', 'boolean', 'true', 'low', 16, false, false),
  
  -- 1.3 Regras de Categorização
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Registro e Onboarding' LIMIT 1), 'require_category_selection', 'Exigir seleção de categoria obrigatória no registro', 'Fornecedor deve escolher ao menos uma categoria', 'boolean', 'true', 'high', 17, true, false),
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Registro e Onboarding' LIMIT 1), 'allow_multiple_categories', 'Permitir múltiplas categorias por fornecedor', 'Fornecedor pode atuar em várias categorias', 'boolean', 'true', 'medium', 18, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Registro e Onboarding' LIMIT 1), 'require_approval_new_categories', 'Exigir aprovação para adicionar novas categorias', 'Novas categorias precisam ser aprovadas', 'boolean', 'true', 'medium', 19, false, true),
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Registro e Onboarding' LIMIT 1), 'allow_supplier_change_categories', 'Permitir fornecedor alterar suas próprias categorias', 'Fornecedor pode modificar suas categorias', 'boolean', 'false', 'medium', 20, false, true),
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Registro e Onboarding' LIMIT 1), 'require_justification_category_change', 'Exigir justificativa para mudança de categoria', 'Mudanças de categoria precisam de justificativa', 'boolean', 'true', 'medium', 21, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '1. Regras de Registro e Onboarding' LIMIT 1), 'block_category_change_after_qualification', 'Bloquear alteração de categoria após qualificação', 'Categorias não podem ser alteradas após qualificação', 'boolean', 'true', 'high', 22, false, true);

-- Inserir regras para a categoria 2 (Qualificação)
INSERT INTO public.business_rule_templates (
  category_id, rule_key, name, description, rule_type, default_value, 
  impact_level, order_index, is_core, requires_approval
) VALUES 
  -- 2.1 Regras de Processo de Qualificação
  ((SELECT id FROM business_rule_categories WHERE name = '2. Regras de Qualificação' LIMIT 1), 'require_qualification_before_quote', 'Exigir qualificação obrigatória antes de cotar', 'Apenas fornecedores qualificados podem participar de cotações', 'boolean', 'true', 'critical', 1, true, true),
  ((SELECT id FROM business_rule_categories WHERE name = '2. Regras de Qualificação' LIMIT 1), 'allow_quote_registered_only', 'Permitir cotação com fornecedores apenas registrados', 'Fornecedores registrados podem cotar sem qualificação', 'boolean', 'false', 'high', 2, false, true),
  ((SELECT id FROM business_rule_categories WHERE name = '2. Regras de Qualificação' LIMIT 1), 'require_specific_qualification_by_category', 'Exigir qualificação específica por categoria', 'Cada categoria tem seu próprio processo de qualificação', 'boolean', 'true', 'high', 3, false, true),
  ((SELECT id FROM business_rule_categories WHERE name = '2. Regras de Qualificação' LIMIT 1), 'allow_generic_qualification', 'Permitir qualificação genérica para todas as categorias', 'Uma qualificação vale para todas as categorias', 'boolean', 'false', 'medium', 4, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '2. Regras de Qualificação' LIMIT 1), 'require_periodic_requalification', 'Exigir renovação periódica da qualificação', 'Qualificação tem validade e precisa ser renovada', 'boolean', 'true', 'high', 5, false, true),
  ((SELECT id FROM business_rule_categories WHERE name = '2. Regras de Qualificação' LIMIT 1), 'qualification_validity_months', 'Validade da qualificação (meses)', 'Período em meses para renovação da qualificação', 'numeric', '24', 'medium', 6, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '2. Regras de Qualificação' LIMIT 1), 'allow_conditional_qualification', 'Permitir qualificação condicional/temporária', 'Qualificação com condições específicas', 'boolean', 'true', 'medium', 7, false, true),
  ((SELECT id FROM business_rule_categories WHERE name = '2. Regras de Qualificação' LIMIT 1), 'require_requalification_after_inactivity', 'Exigir re-qualificação após período de inatividade', 'Fornecedores inativos precisam se re-qualificar', 'boolean', 'true', 'medium', 8, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '2. Regras de Qualificação' LIMIT 1), 'inactivity_period_months', 'Período de inatividade para re-qualificação (meses)', 'Meses sem movimentação que requer re-qualificação', 'numeric', '12', 'medium', 9, false, false);

-- Inserir algumas regras da categoria 3 (Cotação e Seleção) como exemplo
INSERT INTO public.business_rule_templates (
  category_id, rule_key, name, description, rule_type, default_value, 
  impact_level, order_index, is_core, requires_approval
) VALUES 
  -- 3.1 Regras de Participação em Cotações
  ((SELECT id FROM business_rule_categories WHERE name = '3. Regras de Cotação e Seleção' LIMIT 1), 'quote_only_qualified_suppliers', 'Permitir cotação apenas com fornecedores qualificados', 'Apenas fornecedores qualificados podem participar', 'boolean', 'true', 'critical', 1, true, true),
  ((SELECT id FROM business_rule_categories WHERE name = '3. Regras de Cotação e Seleção' LIMIT 1), 'minimum_suppliers_per_quote', 'Número mínimo de fornecedores por cotação', 'Quantidade mínima de fornecedores para uma cotação', 'numeric', '3', 'high', 2, true, true),
  ((SELECT id FROM business_rule_categories WHERE name = '3. Regras de Cotação e Seleção' LIMIT 1), 'quote_response_deadline_days', 'Prazo para resposta de cotação (dias)', 'Prazo padrão em dias para fornecedores responderem', 'numeric', '7', 'medium', 3, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '3. Regras de Cotação e Seleção' LIMIT 1), 'allow_price_negotiation', 'Permitir negociação pós-cotação', 'Possibilita negociar preços após recebimento das propostas', 'boolean', 'true', 'medium', 4, false, false),
  ((SELECT id FROM business_rule_categories WHERE name = '3. Regras de Cotação e Seleção' LIMIT 1), 'require_justification_not_lowest_price', 'Exigir justificativa para não seleção do menor preço', 'Justificativa obrigatória quando não escolher menor preço', 'boolean', 'true', 'high', 5, true, true);

-- Corrigir o trigger para aplicação automática de regras padrão
CREATE OR REPLACE FUNCTION public.apply_default_business_rules()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  -- Inserir regras padrão para o novo workspace baseado no módulo
  INSERT INTO public.workspace_business_rules (workspace_id, rule_template_id, is_enabled, custom_value, configured_at)
  SELECT 
    NEW.id,
    brt.id,
    CASE 
      WHEN brt.rule_type = 'boolean' AND brt.default_value::text = 'true' THEN true 
      ELSE false 
    END,
    brt.default_value,
    NOW()
  FROM public.business_rule_templates brt
  JOIN public.business_rule_categories brc ON brt.category_id = brc.id
  WHERE brc.module_id = NEW.module_id;
  
  RETURN NEW;
END;
$function$;

-- Criar o trigger se não existir
DROP TRIGGER IF EXISTS apply_default_rules_trigger ON public.module_workspaces;
CREATE TRIGGER apply_default_rules_trigger
  AFTER INSERT ON public.module_workspaces
  FOR EACH ROW
  EXECUTE FUNCTION public.apply_default_business_rules();


export type ModuleType = 
  | 'core'
  | 'fornecedores' 
  | 'requisicoes'
  | 'pedidos'
  | 'sourcing'
  | 'cleanse'
  | 'categorias'
  | 'relatorios'
  | 'documentos';

export type WorkspaceStatus = 'ativo' | 'inativo' | 'manutencao';

export interface Module {
  id: string;
  name: string;
  type: ModuleType;
  version: string;
  description?: string;
  is_core: boolean;
  dependencies: string[];
  api_prefix?: string;
  status: WorkspaceStatus;
  config_schema: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ModuleWorkspace {
  id: string;
  module_id: string;
  name: string;
  description?: string;
  configuration: Record<string, any>;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkflowTemplate {
  id: string;
  module_id: string;
  name: string;
  type: string;
  config: Record<string, any>;
  is_active: boolean;
  is_default: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface BusinessRule {
  id: string;
  module_id: string;
  workspace_id?: string;
  name: string;
  condition_type: string;
  condition_config: Record<string, any>;
  action_config: Record<string, any>;
  priority: number;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ModulePermission {
  id: string;
  module_id: string;
  user_id: string;
  role: string;
  permissions: Record<string, any>;
  area?: string;
  cost_center?: string;
  is_active: boolean;
  granted_by?: string;
  granted_at: string;
  expires_at?: string;
}

export interface FeatureFlag {
  id: string;
  module_id: string;
  flag_name: string;
  is_enabled: boolean;
  config: Record<string, any>;
  environment: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

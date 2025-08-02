export interface FunctionalPermissions {
  // Ações gerais
  create?: boolean;
  read?: boolean;
  update?: boolean;
  delete?: boolean;
  approve?: boolean;
  reject?: boolean;
  
  // Fornecedores
  view_supplier_xray?: boolean;
  suspend_supplier?: boolean;
  approve_supplier?: boolean;
  edit_supplier_data?: boolean;
  invite_supplier?: boolean;
  evaluate_supplier?: boolean;
  qualify_supplier?: boolean;
  
  // Requisições
  create_requisition?: boolean;
  view_all_requisitions?: boolean;
  view_unit_requisitions?: boolean;
  approve_requisition_l1?: boolean;
  approve_requisition_l2?: boolean;
  cancel_requisition?: boolean;
  
  // Sourcing
  create_quotation?: boolean;
  send_to_suppliers?: boolean;
  track_responses?: boolean;
  edit_quotation?: boolean;
  cancel_quotation?: boolean;
  resubmit_quotation?: boolean;
  
  // Pedidos
  create_order?: boolean;
  approve_order?: boolean;
  send_to_portal?: boolean;
  track_order?: boolean;
  cancel_order?: boolean;
  edit_order?: boolean;
  
  // Dashboards
  view_global_dashboard?: boolean;
  view_unit_dashboard?: boolean;
  view_category_dashboard?: boolean;
  export_reports?: boolean;
  view_analytics?: boolean;
}

export interface VisibilityScope {
  suppliers?: 'own_only' | 'unit_only' | 'category_only' | 'area_only' | 'all';
  requisitions?: 'own_only' | 'unit_only' | 'category_only' | 'area_only' | 'all';
  quotations?: 'own_only' | 'unit_only' | 'category_only' | 'area_only' | 'all';
  orders?: 'own_only' | 'unit_only' | 'category_only' | 'area_only' | 'all';
  dashboard?: 'own_only' | 'unit_only' | 'category_only' | 'area_only' | 'all';
}

export interface UserPermissions {
  id: string;
  module_id: string;
  user_id: string;
  role: string;
  functional_permissions: FunctionalPermissions;
  visibility_scope: VisibilityScope;
  category_access: string[];
  unit_access: string[];
  real_role?: string;
  is_active: boolean;
  modules?: {
    name: string;
    type: string;
    is_active?: boolean;
  };
}

export interface RoleTemplate {
  id: string;
  name: string;
  description?: string;
  module_type: string;
  default_functional_permissions: FunctionalPermissions;
  default_visibility_scope: VisibilityScope;
  is_active: boolean;
}

export type FunctionalAction = keyof FunctionalPermissions;
export type VisibilityContext = keyof VisibilityScope;
export interface SourcingProject {
  id: string;
  name: string;
  description?: string;
  type: 'cotacao' | 'leilao' | 'rfp';
  status: 'rascunho' | 'ativo' | 'finalizado' | 'cancelado';
  created_at: string;
  updated_at: string;
  created_by: string;
  deadline?: string;
  budget_min?: number;
  budget_max?: number;
  currency: string;
  requirements: string[];
  criteria: EvaluationCriteria[];
}

export interface EvaluationCriteria {
  id: string;
  name: string;
  weight: number;
  type: 'numeric' | 'boolean' | 'text' | 'rating';
  description?: string;
  required: boolean;
  min_value?: number;
  max_value?: number;
  options?: string[];
}

export interface Supplier {
  id: string;
  tipo_documento: string;
  documento: string;
  documento_formatado: string;
  razao_social: string;
  nome_fantasia?: string;
  inscricao_estadual?: string;
  inscricao_municipal?: string;
  situacao_receita?: string;
  porte_empresa?: string;
  natureza_juridica?: string;
  nome_completo?: string;
  rg_ou_cnh?: string;
  profissao?: string;
  e_mei: boolean;
  cnpj_mei?: string;
  cnae_principal_codigo: string;
  cnae_principal_descricao: string;
  cnaes_secundarios: any;
  status: string;
  data_fundacao?: string;
  validado_receita: boolean;
  data_validacao_receita?: string;
  ultimo_erro_validacao?: string;
  created_at: string;
  updated_at?: string;
  created_by: string;
}

export interface SupplierProposal {
  id: string;
  project_id: string;
  supplier_id: string;
  status: 'enviada' | 'analise' | 'aprovada' | 'rejeitada';
  total_value: number;
  delivery_time: number;
  delivery_unit: 'dias' | 'semanas' | 'meses';
  proposal_date: string;
  items: ProposalItem[];
  evaluations: ProposalEvaluation[];
  score?: number;
  notes?: string;
}

export interface ProposalItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total_price: number;
  delivery_time?: number;
  specifications?: Record<string, any>;
}

export interface ProposalEvaluation {
  id: string;
  criteria_id: string;
  value: any;
  evaluator_id: string;
  evaluated_at: string;
  notes?: string;
}

export interface AuctionEvent {
  id: string;
  project_id: string;
  name: string;
  start_date: string;
  end_date: string;
  status: 'agendado' | 'ativo' | 'finalizado' | 'cancelado';
  type: 'aberto' | 'fechado' | 'holandes';
  minimum_bid?: number;
  bid_increment?: number;
  participants: string[];
  bids: AuctionBid[];
}

export interface AuctionBid {
  id: string;
  auction_id: string;
  supplier_id: string;
  amount: number;
  bid_time: string;
  rank: number;
  active: boolean;
}

export interface SourcingStage {
  id: string;
  name: string;
  order: number;
  required: boolean;
  completed: boolean;
  started_at?: string;
  completed_at?: string;
  approver?: string;
  notes?: string;
}

export interface AIRecommendation {
  id: string;
  type: 'supplier' | 'criteria' | 'price' | 'risk';
  title: string;
  description: string;
  confidence: number;
  data: Record<string, any>;
  created_at: string;
}

export interface RiskAssessment {
  supplier_id: string;
  overall_risk: 'low' | 'medium' | 'high';
  financial_risk: number;
  delivery_risk: number;
  quality_risk: number;
  compliance_risk: number;
  factors: string[];
  last_updated: string;
}

// Novas interfaces para os recursos avançados
export interface LoteItem {
  id: string;
  description: string;
  type: 'material' | 'servico' | 'misto';
  lote_id?: string;
  quantidade?: number;
  unit?: string;
  specifications?: Record<string, any>;
}

export interface Lote {
  id: string;
  name: string;
  description?: string;
  type: 'material' | 'servico' | 'misto';
  order: number;
  items: LoteItem[];
}
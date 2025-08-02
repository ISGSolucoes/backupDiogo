export interface Orcamento {
  id: string;
  ano: number;
  centro_custo: string;
  projeto?: string;
  valor_total: number;
  valor_utilizado: number;
  valor_reservado: number;
  valor_disponivel: number;
  categoria?: string;
  aprovado_por?: string;
  aprovado_em?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export interface ReservaOrcamentaria {
  id: string;
  requisicao_id: string;
  orcamento_id: string;
  valor_reservado: number;
  valor_realizado: number;
  status: 'ativa' | 'confirmada' | 'cancelada' | 'expirada';
  data_reserva: string;
  data_confirmacao?: string;
  data_expiracao?: string;
  motivo_cancelamento?: string;
  created_at: string;
  updated_at: string;
}

export interface RegraOrcamentaria {
  id: string;
  nome: string;
  ativo: boolean;
  tipo_condicao: 'global' | 'por_tipo' | 'por_valor' | 'por_categoria' | 'por_centro_custo';
  condicao_config: Record<string, any>;
  nivel_controle: 'projeto' | 'centro_custo' | 'rubrica';
  percentual_alerta: number;
  permite_excecao: boolean;
  emails_notificacao?: string[];
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ExcecaoOrcamentaria {
  id: string;
  requisicao_id: string;
  orcamento_id?: string;
  valor_excedente: number;
  justificativa: string;
  aprovada_por?: string;
  aprovada_em?: string;
  status: 'pendente' | 'aprovada' | 'rejeitada';
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export interface SaldoOrcamentario {
  centro_custo: string;
  projeto?: string;
  categoria?: string;
  valor_total: number;
  valor_disponivel: number;
  valor_reservado: number;
  valor_utilizado: number;
  percentual_usado: number;
  tem_saldo_suficiente: boolean;
  status_alerta: 'normal' | 'atencao' | 'critico';
}

export interface ConfiguracaoControleOrcamentario {
  ativo: boolean;
  modo: 'global' | 'condicional' | 'desativado';
  regras_ativas: string[];
  notificacoes_ativas: boolean;
  emails_notificacao: string[];
}
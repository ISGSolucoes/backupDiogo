
export type TipoAcaoRecomendada = 
  | 'documento_vencendo'
  | 'documento_vencido'
  | 'avaliacao_pendente'
  | 'fornecedor_inativo'
  | 'desempenho_baixo'
  | 'promover_preferencial'
  | 'reavaliar_qualificacao'
  | 'solicitar_atualizacao';

export type PrioridadeAcao = 'alta' | 'media' | 'baixa';

export interface AcaoRecomendada {
  id: string;
  fornecedor_id: string;
  fornecedor_nome: string;
  fornecedor_cnpj: string;
  tipo_acao: TipoAcaoRecomendada;
  prioridade: PrioridadeAcao;
  titulo: string;
  descricao: string;
  justificativa?: string;
  sugerida_em: string;
  executada: boolean;
  executada_em?: string;
  executada_por?: string;
  created_at: string;
  updated_at: string;
}

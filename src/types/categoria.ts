
export type CriticidadeCategoria = 'baixo' | 'medio' | 'alto';
export type ImpactoCategoria = 'baixo' | 'medio' | 'alto';
export type StatusRevisao = 'verde' | 'amarelo' | 'vermelho';
export type ModeloCompra = 'spot' | 'contrato' | 'leilao' | 'catalogo' | 'framework';

export interface Categoria {
  id: string;
  parent_id?: string;
  nome_categoria: string;
  descricao: string;
  nivel: number;
  tipo_critico: CriticidadeCategoria;
  tipo_impacto: ImpactoCategoria;
  score_risco: number;
  score_complexidade: number;
  responsavel_id: string;
  responsavel_nome: string;
  atualizado_em: string;
  subcategorias?: Categoria[];
  
  // Campos calculados
  total_fornecedores: number;
  fornecedores_ativos: number;
  gasto_acumulado: number;
  sla_medio: number;
  status_revisao: StatusRevisao;
  ultima_revisao: string;
}

export interface EstrategiaCategoria {
  id: string;
  category_id: string;
  objetivo_estrategico: string;
  acao_recomendada: string;
  modelo_compra: ModeloCompra;
  meta_saving: number;
  sazonalidade: string;
  periodicidade_revisao: number; // em meses
  created_at: string;
  updated_at: string;
}

export interface FornecedorCategoria {
  id: string;
  category_id: string;
  fornecedor_id: string;
  fornecedor_nome: string;
  fornecedor_cnpj: string;
  nivel_de_adesao: number;
  data_ultimo_pedido: string;
  status_homologado: boolean;
  documentos_exigidos: string[];
  score_qualificacao: number;
  sla_medio: number;
  valor_comprado: number;
}

export interface IndicadorCategoria {
  categoria_id: string;
  custo_por_categoria: number;
  sla_entrega: number;
  rotatividade_fornecedores: number;
  ocorrencias: number;
  saving_real: number;
  nps_medio: number;
  periodo_referencia: string;
}

export interface SugestaoIA {
  categoria_id: string;
  acao_recomendada: string;
  justificativa: string;
  meta_saving: number;
  fornecedores_sugeridos: string[];
  prioridade: 'baixa' | 'media' | 'alta';
  created_at: string;
}

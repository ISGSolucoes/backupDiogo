export type RegimeTributario = 'simples' | 'presumido' | 'real' | null;
export type OrigemImposto = 'manual' | 'calculado' | 'template';
export type FonteValorTributo = 'fornecedor' | 'calculado';

export interface ImpostoItem {
  aliquota?: number;
  valor?: number;
  base?: number;
  origem: OrigemImposto;
  editable: boolean;
  locked_reason?: string;
}

export interface ImpostoCustomizado {
  nome: string;
  aliquota?: number;
  valor?: number;
  origem: OrigemImposto;
  editable: boolean;
}

export interface TributosDetalhados {
  icms: ImpostoItem;
  ipi: ImpostoItem;
  iss: ImpostoItem;
  pisCofins: ImpostoItem;
  outrosImpostos: ImpostoCustomizado[];
}

export interface ItemPropostaComImpostos {
  id: string;
  codigo: string;
  descricao: string;
  especificacao: string;
  quantidade: number;
  unidade: string;
  precoUnitario: number;
  precoTotal: number;
  observacoes: string;
  preenchido: boolean;
  
  // Campos de impostos
  regimeTributario: RegimeTributario;
  impostos: TributosDetalhados;
  valorSemImpostos: number;
  fonteDoValorTributo: FonteValorTributo;
}

export interface ModeloFiscal {
  exigir_detalhamento_impostos: boolean;
  regimes_aceitos: RegimeTributario[];
  impostos_obrigatorios: string[];
  permitir_edicao_impostos: boolean;
  calcular_automatico: boolean;
}

export interface TaxCalculationInput {
  valor: number;
  regimeTributario: RegimeTributario;
  estado?: string;
  categoria?: string;
  tipo: 'material' | 'servico';
}
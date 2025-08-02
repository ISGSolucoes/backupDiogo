
export interface FornecedorExterno {
  id: string;
  nome: string;
  cnpj: string;
  cidade: string;
  uf: string;
  tipo: string;
  ultimaAtualizacao: string;
  score: number;
  telefone?: string;
  email?: string;
  endereco?: string;
  certificacoes?: string[];
  statusNaBase?: 'registrado' | 'em_registro' | 'pendente' | 'qualificado' | 'preferido' | null;
  dataCadastro?: string;
  totalUnidadesGrupo?: number;
  idNaBase?: string;
}

export interface ResultadosBuscaExternaProps {
  quantidade: number;
  termo: string;
  onImportarClick: (fornecedor: FornecedorExterno) => void;
}

export interface SegmentoEstatisticas {
  totalEmpresas: number;
  percentualDoTotal: number;
  dadosPorRegiao: Record<string, { quantidade: number; percentual: number }>;
  dadosPorEstado: Record<string, { quantidade: number; percentual: number }>;
  dadosPorCidade: Record<string, { quantidade: number; percentual: number }>;
}

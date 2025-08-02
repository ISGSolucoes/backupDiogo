
export interface Fornecedor {
  id: string;
  nome: string;
  cnpj: string;
  categoria: string;
  status: StatusFornecedor;
  tipoFornecedor: TipoFornecedor;
  ultimaParticipacao: string;
  uf: string;
  cidade: string;
  porte: PorteFornecedor;
  tipoEmpresa: TipoEmpresa;
  qualificado: boolean;
  preferido: boolean;
  dataCadastro: string;
  ultimaAtualizacao?: string;
  completo?: number;
  cnpjRaiz?: string;
  funcionarios?: number;
  faturamento?: string;
  cnae?: string;
  subcategoria?: string;
  qualificacoesPorArea?: QualificacaoArea[];
  motivoInativacao?: MotivoInativacao;
  dataInativacao?: string;
  usuarioInativacao?: string;
  observacaoInativacao?: string;
  acoesPendentes?: AcaoPendente[];
  quantidadeFiliais?: number;
  
  // Novos campos para personalização
  classificacao?: 'direto' | 'indireto';
  financeiro?: 'OPEX' | 'CAPEX';
  segmento?: string;
  descricao?: string;
  avaliacao?: 'avaliado' | 'nao_avaliado' | 'parcial';
  score?: number;
  transacional?: 'ativo' | 'somente_cotado' | 'sem_historico';
  criticidade?: 'alta' | 'media' | 'baixa';
  
  // Novos campos de contato
  email?: string;
  telefone?: string;
  endereco?: string;
  pais?: string;
  estado?: string;
}

export type StatusFornecedor = "convidado" | "ativo" | "registrado" | "em_registro" | "em_qualificacao" | "pendente_aprovacao" | "qualificado" | "preferido" | "inativo" | "aguardando_complementacao" | "pendente_com_ressalvas" | "aguardando_atualizacao";
export type TipoFornecedor = "industria" | "servico" | "mista";
export type PorteFornecedor = "pequeno" | "medio" | "grande";
export type TipoEmpresa = "ltda" | "sa" | "mei" | "epp";

export type MotivoInativacao = 
  | "manual" 
  | "inatividade_automatica" 
  | "documento_vencido" 
  | "descadastramento_usuario"
  | "bloqueio_interno";

export interface AlertaFornecedor {
  id: string;
  fornecedor_id: string;
  tipo: string;
  mensagem: string;
  acaoSugerida: string;
  prioridade: string;
  data: string;
}

export interface HistoricoFornecedor {
  id: string;
  fornecedor_id: string;
  data: string;
  tipoEvento: string;
  descricao: string;
  usuario: string;
  detalhes: any;
}

export interface HierarquiaItem {
  id: string;
  nome: string;
  cnpj: string;
  tipoUnidade: string;
  status: string;
  cidade: string;
  uf: string;
  ultimaParticipacao: string;
  dataCadastro?: string;
}

export interface UtilizacaoArea {
  area: string;
  participacoes: number;
  notaMedia: number;
  ultimaParticipacao: string;
}

export interface QualificacaoArea {
  area: string;
  status: 'qualificado' | 'em_qualificacao' | 'reprovado' | 'pendente';
  dataQualificacao?: string;
  pontuacao?: number;
  observacoes?: string;
}

export interface RiscoFornecedor {
  legal: 'baixo' | 'medio' | 'alto';
  financeiro: 'baixo' | 'medio' | 'alto';
  operacional: 'baixo' | 'medio' | 'alto';
  ambiental: 'baixo' | 'medio' | 'alto';
}

export interface AcaoPendente {
  id: string;
  tipo: 'documento' | 'qualificacao' | 'participacao' | 'atualizacao';
  descricao: string;
  acaoSugerida: string;
  prioridade: 'alta' | 'media' | 'baixa';
  dataIdentificacao: string;
  prazoExecucao?: string;
}

// Novo tipo para configuração de colunas
export interface ConfiguracaoColuna {
  key: keyof Fornecedor | 'acoes';
  label: string;
  visible: boolean;
  order: number;
  width?: string;
  required?: boolean;
  requiresApprovalForExport?: boolean;
}

export interface PresetColunas {
  id: string;
  nome: string;
  descricao: string;
  colunas: ConfiguracaoColuna[];
}

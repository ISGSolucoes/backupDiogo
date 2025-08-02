export type StatusDocumento = 'pendente' | 'respondido' | 'aprovado' | 'rejeitado' | 'em_analise' | 
  // Status específicos para Pedidos
  'confirmado' | 'parcialmente_confirmado' | 'recusado' | 'enviado' | 'entregue' |
  // Status específicos para Cotações  
  'respondida' | 'premiada' | 'respondendo' | 'rascunho' | 'vencida' |
  // Status específicos para Contratos
  'assinado' | 'em_negociacao' | 'renovado' | 'cancelado' |
  // Status específicos para Qualificações
  'qualificado' | 'desqualificado' | 'em_processo' | 'documentacao_pendente' |
  // Status específicos para Avaliações
  'concluida' | 'em_andamento' | 'agendada';

export type TipoDocumento = 'cotacao' | 'pedido' | 'contrato' | 'qualificacao' | 'comunicado' | 'avaliacao';
export type PerfilContato = 'admin' | 'operacional' | 'visualizacao';

export interface DocumentoTransacao {
  id: string;
  tipo: TipoDocumento;
  numero: string;
  titulo: string;
  descricao: string;
  status: StatusDocumento;
  dataRecebimento: string;
  dataResposta?: string;
  prazoResposta?: string;
  valor?: string;
  prioridade: 'alta' | 'media' | 'baixa';
  acoes: string[];
  anexos?: string[];
  historico: HistoricoTransacao[];
}

export interface HistoricoTransacao {
  id: string;
  data: string;
  acao: string;
  usuario: string;
  observacoes?: string;
}

export interface ContatoFornecedor {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  cargo?: string;
  perfil: PerfilContato;
  ativo: boolean;
  ultimoAcesso?: string;
  permissoes: string[];
}

export interface ClientePortal {
  id: string;
  nome: string;
  cnpj: string;
  codigo: string;
  relacionamentoDesde: string;
  status: 'ativo' | 'inativo' | 'suspenso';
  categoria: string;
  volumeMensal: string;
  scoreRelacionamento: number;
  responsavelComercial?: string;
  ultimaInteracao: string;
  documentosPendentes: number;
  documentosRespondidos: number;
  documentosAprovados: number;
  documentos: DocumentoTransacao[];
  contatos: ContatoFornecedor[];
  estatisticas: {
    cotacoes: { total: number; pendentes: number; aprovadas: number };
    pedidos: { total: number; pendentes: number; entregues: number };
    contratos: { total: number; pendentes: number; assinados: number };
    qualificacoes: { total: number; pendentes: number; aprovadas: number };
    avaliacoes: { total: number; pendentes: number; concluidas: number };
  };
  configuracoes: {
    notificacoes: boolean;
    prioridadeAutomatica: boolean;
    integracaoPortal: boolean;
  };
}

export interface DadosFornecedor {
  id: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  responsavelPrincipal: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  uf: string;
  scoreGeral: number;
  clientesAtivos: number;
  documentosPendentes: number;
  volumeMensalTotal: string;
  categoriaFornecedor: string;
  certificacoes: string[];
  statusPortal: 'ativo' | 'pendente' | 'bloqueado';
}

// Mapeamentos para cards dinâmicos
export interface StatusConfig {
  key: string;
  label: string;
  icon: any;
  color: string;
  borderColor: string;
  bgColor: string;
  iconColor: string;
  description: string;
}

export interface TipoStatusMapping {
  [key: string]: StatusConfig[];
}

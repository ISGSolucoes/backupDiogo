
export type TipoMensagem = 'texto' | 'arquivo' | 'sistema' | 'acao' | 'prazo';
export type StatusMensagem = 'enviada' | 'entregue' | 'lida' | 'respondida';
export type TipoParticipante = 'comprador' | 'fornecedor' | 'ia' | 'sistema';

export type ContextoChat = 
  | 'gestao_fornecedores'
  | 'cotacoes'
  | 'propostas'
  | 'documentos'
  | 'pedidos_contratos'
  | 'assistente_virtual';

export interface ParticipanteChat {
  id: string;
  nome: string;
  tipo: TipoParticipante;
  avatar?: string;
  online: boolean;
}

export interface AnexoMensagem {
  id: string;
  nome: string;
  tipo: string;
  tamanho: number;
  url: string;
}

export interface AcaoMensagem {
  id: string;
  texto: string;
  tipo: 'primary' | 'secondary' | 'danger';
  acao: string;
  parametros?: Record<string, any>;
}

export interface Mensagem {
  id: string;
  chatId: string;
  remetente: ParticipanteChat;
  tipo: TipoMensagem;
  conteudo: string;
  timestamp: string;
  status: StatusMensagem;
  contexto?: ContextoChat;
  anexos?: AnexoMensagem[];
  acoes?: AcaoMensagem[];
  prazoVencimento?: string;
  respostaRapida?: string[];
  editada?: boolean;
  importante?: boolean;
}

export interface Chat {
  id: string;
  titulo: string;
  contexto: ContextoChat;
  participantes: ParticipanteChat[];
  ultimaMensagem?: Mensagem;
  mensagensNaoLidas: number;
  ativo: boolean;
  criadoEm: string;
  referenciaId?: string; // ID da cotação, fornecedor, etc.
}

export interface FiltroChat {
  contexto?: ContextoChat[];
  participante?: string;
  dataInicio?: string;
  dataFim?: string;
  naoLidas?: boolean;
  importantes?: boolean;
}

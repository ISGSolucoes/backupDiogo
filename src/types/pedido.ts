export type StatusPedido = 
  | 'rascunho'
  | 'aguardando_aprovacao'
  | 'aprovado'
  | 'rejeitado'
  | 'enviado'
  | 'visualizado'
  | 'questionado'
  | 'confirmado'
  | 'alteracao_solicitada'
  | 'cancelado'
  | 'finalizado';

export type TipoPedido = 'material' | 'servico' | 'misto';

export type TipoAprovacao = 'individual' | 'comite' | 'paralelo';

export type StatusAprovacao = 'pendente' | 'aprovado' | 'rejeitado' | 'expirado';

export type StatusIntegracao = 'pendente' | 'enviando' | 'sucesso' | 'erro' | 'timeout';

export type TipoOperacaoPortal = 'envio_pedido' | 'webhook_resposta' | 'sincronizacao' | 'reenvio';

export type TipoRespostaPortal = 'aceitar' | 'questionar' | 'alterar' | 'recusar';

export interface Pedido {
  id: string;
  numero_pedido: string;
  cotacao_id?: string;
  requisicao_id?: string;
  fornecedor_id: string;
  
  // Status e workflow
  status: StatusPedido;
  tipo: TipoPedido;
  
  // Datas
  data_criacao: string;
  data_aprovacao?: string;
  data_envio_portal?: string;
  data_resposta_fornecedor?: string;
  data_entrega_solicitada: string;
  
  // Valores
  valor_total: number;
  moeda: string;
  
  // Condições comerciais
  condicoes_pagamento?: string;
  observacoes?: string;
  centro_custo?: string;
  
  // Integração com portal
  portal_pedido_id?: string;
  status_portal?: string;
  
  // Controle
  criado_por: string;
  aprovado_por?: string;
  empresa_id: string;
  versao: number;
  
  // Audit
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  
  // Relacionamentos
  itens?: ItemPedido[];
  aprovacoes?: AprovacaoPedido[];
  integracoes?: IntegracaoPortal[];
  anexos?: AnexoPedido[];
  historico?: HistoricoPedido[];
}

export interface ItemPedido {
  id: string;
  pedido_id: string;
  
  // Identificação
  sequencia: number;
  codigo_produto?: string;
  codigo_interno?: string;
  
  // Descrição
  descricao: string;
  especificacao?: string;
  observacoes?: string;
  
  // Quantidades e valores
  quantidade: number;
  unidade: string;
  preco_unitario: number;
  valor_total: number;
  
  // Datas e local
  data_entrega_item?: string;
  local_entrega?: string;
  
  // Classificação
  categoria_id?: string;
  subcategoria_id?: string;
  centro_custo_item?: string;
  
  // Controle
  created_at: string;
  updated_at: string;
}

export interface AprovacaoPedido {
  id: string;
  pedido_id: string;
  
  // Workflow
  nivel: number;
  tipo_aprovacao: TipoAprovacao;
  status_aprovacao: StatusAprovacao;
  
  // Aprovador
  aprovador_id: string;
  data_solicitacao: string;
  data_aprovacao?: string;
  data_expiracao?: string;
  
  // Detalhes
  comentarios?: string;
  motivo_rejeicao?: string;
  anexos: any[];
  
  // Audit
  created_at: string;
  updated_at: string;
}

export interface IntegracaoPortal {
  id: string;
  pedido_id: string;
  
  // Dados da integração
  tipo_operacao: TipoOperacaoPortal;
  status_integracao: StatusIntegracao;
  tentativa: number;
  
  // Request/Response
  dados_enviados?: any;
  resposta_recebida?: any;
  erro_integracao?: string;
  
  // Portal
  portal_pedido_id?: string;
  portal_url?: string;
  
  // Timing
  data_tentativa: string;
  data_sucesso?: string;
  proxima_tentativa?: string;
  
  // Metadata
  ip_origem?: string;
  user_agent?: string;
  headers_request?: any;
  
  // Audit
  created_at: string;
}

export interface AnexoPedido {
  id: string;
  pedido_id?: string;
  item_id?: string;
  
  // Arquivo
  nome_arquivo: string;
  nome_original: string;
  tipo_mime: string;
  tamanho_bytes: number;
  
  // Storage
  bucket?: string;
  caminho_arquivo: string;
  url_publica?: string;
  
  // Metadata
  descricao?: string;
  tipo_anexo?: string;
  
  // Controle
  criado_por: string;
  created_at: string;
}

export interface HistoricoPedido {
  id: string;
  pedido_id: string;
  
  // Evento
  evento: string;
  status_anterior?: string;
  status_novo?: string;
  
  // Dados da alteração
  dados_anteriores?: any;
  dados_novos?: any;
  campos_alterados?: string[];
  
  // Usuário e contexto
  usuario_id?: string;
  ip_address?: string;
  user_agent?: string;
  origem?: string;
  
  // Timestamp
  created_at: string;
}

// DTOs para requests
export interface CriarPedidoRequest {
  fornecedor_id: string;
  data_entrega_solicitada: string;
  condicoes_pagamento?: string;
  observacoes?: string;
  centro_custo: string;
  tipo: TipoPedido;
  itens: CriarItemPedidoRequest[];
}

export interface CriarItemPedidoRequest {
  descricao: string;
  especificacao?: string;
  quantidade: number;
  unidade: string;
  preco_unitario: number;
  data_entrega_item?: string;
  observacoes?: string;
  categoria_id?: string;
  centro_custo_item?: string;
}

export interface ProcessarAprovacaoRequest {
  acao: 'aprovar' | 'rejeitar' | 'solicitar_alteracao';
  comentarios?: string;
  motivo_rejeicao?: string;
  campos_alteracao?: string[];
  anexos?: string[]; // IDs dos anexos
}

export interface WebhookPortalRequest {
  pedido_origem_id: string;
  portal_pedido_id: string;
  fornecedor_id: string;
  tipo_resposta: TipoRespostaPortal;
  dados_resposta: {
    confirmacao_prazo?: string;
    observacoes?: string;
    questionamentos?: Questionamento[];
    alteracoes_propostas?: AlteracaoProposta[];
    motivo_recusa?: string;
    anexos?: string[];
  };
  timestamp: string;
  assinatura: string;
}

export interface Questionamento {
  item_id?: string;
  campo: string;
  pergunta: string;
  urgencia: 'baixa' | 'media' | 'alta';
  prazo_resposta?: string;
}

export interface AlteracaoProposta {
  item_id?: string;
  tipo: 'prazo' | 'preco' | 'especificacao' | 'quantidade';
  valor_atual: any;
  valor_proposto: any;
  justificativa: string;
  impacto_valor?: number;
}

// Filtros e consultas
export interface FiltrosPedidos {
  status?: StatusPedido[];
  fornecedor_id?: string;
  criado_por?: string;
  data_inicio?: string;
  data_fim?: string;
  valor_min?: number;
  valor_max?: number;
  centro_custo?: string;
  tipo?: TipoPedido;
}

// DTOs de Response
export interface PedidoResponse {
  id: string;
  numero_pedido: string;
  status: StatusPedido;
  tipo: TipoPedido;
  
  // Datas
  data_criacao: string;
  data_aprovacao?: string;
  data_envio_portal?: string;
  data_entrega_solicitada: string;
  
  // Valores
  valor_total: number;
  moeda: string;
  
  // Relacionamentos
  fornecedor: FornecedorSummary;
  criador: UsuarioSummary;
  aprovador?: UsuarioSummary;
  
  // Dados comerciais
  condicoes_pagamento?: string;
  observacoes?: string;
  centro_custo: string;
  
  // Itens
  itens: ItemPedidoResponse[];
  
  // Status de workflow
  aprovacoes_pendentes: number;
  proxima_aprovacao?: ProximaAprovacaoResponse;
  
  // Integração Portal
  status_portal?: string;
  portal_pedido_id?: string;
  ultima_integracao?: IntegracaoPortalResponse;
  resposta_fornecedor?: RespostaFornecedorResponse;
  
  // Metadata
  criado_em: string;
  atualizado_em: string;
  versao: number;
}

export interface FornecedorSummary {
  id: string;
  nome: string;
  cnpj: string;
  email?: string;
}

export interface UsuarioSummary {
  id: string;
  nome: string;
  email: string;
  cargo?: string;
}

export interface ItemPedidoResponse {
  id: string;
  sequencia: number;
  descricao: string;
  quantidade: number;
  unidade: string;
  preco_unitario: number;
  valor_total: number;
  status?: string;
}

export interface ProximaAprovacaoResponse {
  nivel: number;
  aprovador: UsuarioSummary;
  prazo_expiracao?: string;
  comentarios?: string;
}

export interface IntegracaoPortalResponse {
  status: StatusIntegracao;
  data_tentativa: string;
  tentativas: number;
  erro?: string;
  portal_url?: string;
}

export interface RespostaFornecedorResponse {
  tipo_resposta: TipoRespostaPortal;
  data_resposta: string;
  confirmacao_prazo?: string;
  observacoes?: string;
  questionamentos?: Questionamento[];
  alteracoes_propostas?: AlteracaoProposta[];
  motivo_recusa?: string;
  anexos?: string[];
}

// Dashboard avançado
export interface DashboardResponse {
  resumo: {
    total_pedidos: number;
    valor_total: number;
    aprovacoes_pendentes: number;
    respostas_pendentes: number;
    erros_integracao: number;
  };
  
  pedidos_por_status: StatusCount[];
  pedidos_urgentes: PedidoUrgente[];
  aprovacoes_pendentes: AprovacaoPendente[];
  problemas_integracao: ProblemaIntegracao[];
  
  metricas: {
    tempo_medio_aprovacao: number; // em horas
    taxa_aprovacao: number; // percentual
    tempo_medio_resposta_fornecedor: number; // em horas
    taxa_sucesso_integracao: number; // percentual
  };
  
  graficos: {
    pedidos_por_mes: ChartData[];
    top_fornecedores: ChartData[];
    gastos_por_categoria: ChartData[];
    status_integracao: ChartData[];
  };
}

export interface StatusCount {
  status: StatusPedido;
  count: number;
  valor_total: number;
}

export interface PedidoUrgente {
  id: string;
  numero_pedido: string;
  fornecedor: string;
  dias_restantes: number;
  valor: number;
  motivo_urgencia: string;
}

export interface AprovacaoPendente {
  id: string;
  pedido_numero: string;
  aprovador: UsuarioSummary;
  dias_pendente: number;
  valor: number;
  urgencia: 'baixa' | 'media' | 'alta';
}

export interface ProblemaIntegracao {
  pedido_id: string;
  numero_pedido: string;
  erro: string;
  tentativas: number;
  ultima_tentativa: string;
}

export interface ChartData {
  label: string;
  value: number;
  color?: string;
  metadata?: Record<string, any>;
}

// WebSocket Events
export interface WebSocketClientEvents {
  'subscribe:pedido': { pedido_id: string };
  'subscribe:dashboard': {};
  'subscribe:aprovacoes': { usuario_id: string };
  'pedido:typing': { pedido_id: string; usuario: string };
  'pedido:viewing': { pedido_id: string };
}

export interface WebSocketServerEvents {
  'pedido:status_changed': {
    pedido_id: string;
    status_anterior: StatusPedido;
    status_novo: StatusPedido;
    usuario: string;
    timestamp: string;
  };
  
  'pedido:aprovacao_solicitada': {
    pedido_id: string;
    aprovador_id: string;
    nivel: number;
    prazo_expiracao: string;
  };
  
  'pedido:aprovado': {
    pedido_id: string;
    aprovador: UsuarioSummary;
    comentarios?: string;
    timestamp: string;
  };
  
  'pedido:rejeitado': {
    pedido_id: string;
    aprovador: UsuarioSummary;
    motivo: string;
    timestamp: string;
  };
  
  'pedido:enviado_portal': {
    pedido_id: string;
    fornecedor: FornecedorSummary;
    portal_pedido_id: string;
    timestamp: string;
  };
  
  'pedido:erro_portal': {
    pedido_id: string;
    erro: string;
    tentativa: number;
    timestamp: string;
  };
  
  'pedido:resposta_portal': {
    pedido_id: string;
    tipo_resposta: TipoRespostaPortal;
    timestamp: string;
  };
  
  'dashboard:atualizado': {
    resumo: DashboardResponse['resumo'];
    timestamp: string;
  };
  
  'alerta:prazo_vencendo': {
    pedido_id: string;
    dias_restantes: number;
  };
  
  'alerta:aprovacao_atrasada': {
    pedido_id: string;
    aprovador: UsuarioSummary;
    dias_atraso: number;
  };
  
  'alerta:integracao_falhando': {
    pedido_id: string;
    tentativas: number;
    ultimo_erro: string;
  };
}

export interface DashboardPedidos {
  total_pedidos: number;
  pedidos_por_status: Record<StatusPedido, number>;
  valor_total_mes: number;
  pedidos_aguardando_aprovacao: number;
  pedidos_aguardando_resposta: number;
  pedidos_proximos_vencimento: number;
  tempo_medio_aprovacao: number;
  taxa_aprovacao: number;
}

// Utilitários para status
export const StatusColors: Record<StatusPedido, string> = {
  rascunho: 'text-muted-foreground bg-muted',
  aguardando_aprovacao: 'text-warning-foreground bg-warning',
  aprovado: 'text-success-foreground bg-success',
  rejeitado: 'text-destructive-foreground bg-destructive',
  enviado: 'text-info-foreground bg-info',
  visualizado: 'text-primary-foreground bg-primary',
  questionado: 'text-orange-700 bg-orange-100',
  confirmado: 'text-green-700 bg-green-100',
  alteracao_solicitada: 'text-amber-700 bg-amber-100',
  cancelado: 'text-gray-700 bg-gray-100',
  finalizado: 'text-emerald-700 bg-emerald-100'
};

export const StatusLabels: Record<StatusPedido, string> = {
  rascunho: 'Rascunho',
  aguardando_aprovacao: 'Aguardando Aprovação',
  aprovado: 'Aprovado',
  rejeitado: 'Rejeitado',
  enviado: 'Enviado',
  visualizado: 'Visualizado',
  questionado: 'Questionado',
  confirmado: 'Confirmado',
  alteracao_solicitada: 'Alteração Solicitada',
  cancelado: 'Cancelado',
  finalizado: 'Finalizado'
};

export const TipoLabels: Record<TipoPedido, string> = {
  material: 'Material',
  servico: 'Serviço',
  misto: 'Misto'
};
export interface TemplateAcaoLote {
  id: string;
  nome: string;
  finalidade: string;
  tipo_acao: TipoAcaoLote;
  categoria?: string;
  conteudo_texto?: string;
  campos_formulario: CampoFormulario[];
  configuracoes: Record<string, any>;
  permite_anonimato: boolean;
  validade_dias: number;
  is_ativo: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface DisparoAcaoLote {
  id: string;
  template_id?: string;
  nome_disparo: string;
  tipo_acao: TipoAcaoLote;
  total_fornecedores: number;
  enviados: number;
  abertos: number;
  respondidos: number;
  falhas: number;
  status: StatusDisparo;
  disparado_por?: string;
  disparado_em: string;
  concluido_em?: string;
  configuracoes: Record<string, any>;
  created_at: string;
}

export interface DisparoFornecedor {
  id: string;
  disparo_id: string;
  fornecedor_id: string;
  fornecedor_nome: string;
  fornecedor_cnpj: string;
  fornecedor_email: string;
  status_envio: StatusEnvio;
  data_envio?: string;
  data_abertura?: string;
  data_resposta?: string;
  token_rastreio: string;
  erro_envio?: string;
  created_at: string;
  updated_at: string;
}

export interface HistoricoAcaoFornecedor {
  id: string;
  fornecedor_id: string;
  fornecedor_nome: string;
  disparo_id?: string;
  tipo_acao: TipoAcaoLote;
  template_nome?: string;
  status_final?: string;
  detalhes: Record<string, any>;
  executado_por?: string;
  executado_em: string;
  created_at: string;
}

export interface CampoFormulario {
  id: string;
  nome: string;
  tipo: 'texto' | 'numero' | 'data' | 'escala' | 'multipla_escolha' | 'comentario';
  obrigatorio: boolean;
  opcoes?: string[];
  configuracao?: Record<string, any>;
}

export interface FornecedorCSV {
  id?: string;
  cnpj: string;
  razao_social?: string;
  email_principal?: string;
  categoria?: string;
  status?: string;
}

export interface ValidacaoImportacao {
  validos: FornecedorValidado[];
  invalidos: FornecedorInvalido[];
  duplicados: string[];
  semEmail: FornecedorValidado[];
}

export interface FornecedorValidado {
  fornecedor_id: string;
  cnpj: string;
  razao_social: string;
  email_principal?: string;
  categoria?: string;
  status?: string;
  linha: number;
}

export interface FornecedorInvalido {
  linha: number;
  cnpj?: string;
  razao_social?: string;
  erro: string;
}

export interface ConfiguracaoAcao {
  tipo: TipoAcaoLote;
  template_id?: string;
  titulo?: string;
  conteudo?: string;
  anexos?: string[];
  prazo_resposta?: number;
  permite_anonimato?: boolean;
  responsavel?: string;
  campos_customizados?: Record<string, any>;
}

export type TipoAcaoLote = 
  | 'avaliacao_interna' 
  | 'pesquisa_cliente' 
  | 'convite' 
  | 'requalificacao' 
  | 'comunicado';

export type StatusDisparo = 
  | 'preparando' 
  | 'enviando' 
  | 'concluido' 
  | 'falhou';

export type StatusEnvio = 
  | 'pendente' 
  | 'enviado' 
  | 'aberto' 
  | 'respondido' 
  | 'falhou';

export interface MetricasDisparo {
  total: number;
  enviados: number;
  abertos: number;
  respondidos: number;
  falhas: number;
  taxa_abertura: number;
  taxa_resposta: number;
}
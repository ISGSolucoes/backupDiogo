export type StatusConvite = 'enviado' | 'visualizado' | 'cadastrado' | 'expirado';

export interface ConviteFornecedor {
  id: string;
  nome_empresa: string;
  email_contato: string;
  mensagem_convite?: string;
  token_unico: string;
  status: StatusConvite;
  enviado_por?: string;
  data_envio: string;
  data_visualizacao?: string;
  data_cadastro?: string;
  data_expiracao: string;
  tentativas_envio: number;
  ultimo_erro?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CriarConviteRequest {
  nome_empresa: string;
  email_contato: string;
  mensagem_convite?: string;
  enviado_por?: string;
}

export interface EnviarConviteResponse {
  convite_id: string;
  token_unico: string;
  link_cadastro: string;
  status: 'sucesso' | 'erro';
  mensagem: string;
  erro?: string;
}

export interface StatusConviteResponse {
  id: string;
  status: StatusConvite;
  nome_empresa: string;
  email_contato: string;
  data_envio: string;
  data_expiracao: string;
  data_visualizacao?: string;
  data_cadastro?: string;
  dias_restantes: number;
  expirado: boolean;
}

export interface ConviteLabels {
  [key: string]: string;
}

export const StatusConviteLabels: ConviteLabels = {
  enviado: 'Enviado',
  visualizado: 'Visualizado',
  cadastrado: 'Cadastrado',
  expirado: 'Expirado'
};

export const StatusConviteColors: ConviteLabels = {
  enviado: 'bg-blue-100 text-blue-800',
  visualizado: 'bg-yellow-100 text-yellow-800',
  cadastrado: 'bg-green-100 text-green-800',
  expirado: 'bg-red-100 text-red-800'
};
export interface BibliotecaDocumento {
  id: string;
  nome_arquivo: string;
  nome_original: string;
  descricao?: string;
  tipo_arquivo: string;
  tamanho_bytes: number;
  url_arquivo: string;
  
  // Metadados organizacionais
  area: string;
  finalidade: string;
  categoria?: string;
  tags?: string[];
  modulo?: string;
  
  // Controle de versão
  versao: number;
  versao_anterior_id?: string;
  
  // Controle de acesso
  publico: boolean;
  areas_permitidas?: string[];
  cargos_permitidos?: string[];
  
  // Aprovação
  status: 'pendente' | 'aprovado' | 'rejeitado';
  aprovado_por?: string;
  aprovado_em?: string;
  motivo_rejeicao?: string;
  
  // Controle de validade
  data_validade?: string;
  notificar_vencimento: boolean;
  
  // Metadados
  criado_por: string;
  criado_em: string;
  atualizado_em: string;
  
  // Estatísticas
  downloads_count: number;
  ultimo_download?: string;
  
  // Observações
  observacoes?: string;
}

export interface DocumentoUpload {
  file: File;
  nome_arquivo: string;
  descricao?: string;
  area: string;
  finalidade: string;
  categoria?: string;
  tags?: string[];
  modulo?: string;
  publico: boolean;
  areas_permitidas?: string[];
  cargos_permitidos?: string[];
  data_validade?: string;
  notificar_vencimento: boolean;
  observacoes?: string;
}

export interface FiltrosBiblioteca {
  busca?: string;
  area?: string;
  finalidade?: string;
  tipo_arquivo?: string;
  status?: string;
  modulo?: string;
}

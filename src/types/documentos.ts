
export type TipoDocumento = 'certidao' | 'contrato' | 'formulario' | 'outro';

export interface Documento {
  id: string;
  fornecedor_id: string;
  tipo: TipoDocumento;
  nome: string;
  versao: string; // Garantindo que a versão seja sempre string
  validade?: string; // ISO date string
  dataUpload?: string; // Added to match the actual usage
  status: 'valido' | 'vencido' | 'pendente';
  upload_por: string; // user ID or name
  upload_data: string; // ISO date string
  tamanho: number; // Size in MB
  formato: string;
  arquivo_url: string;
  ativo: boolean;
}

export interface DocumentoFormData {
  tipo: TipoDocumento;
  nome: string;
  validade?: string;
  arquivo: File | null;
}

export interface FiltrosDocumentos {
  termo?: string;
  tipo?: string;
  status?: string;
}


export type TipoFornecimento = 'produto' | 'servico' | 'misto' | 'servico_recorrente';
export type AreaSolicitante = 'compras' | 'engenharia' | 'logistica' | 'qualidade' | 'financeiro' | 'suprimentos' | 'juridico' | 'outro';
export type FormatoModelo = 'pdf' | 'doc' | 'docx' | 'xlsx' | 'interno';

export interface PerguntaQuestionario {
  id: string;
  texto: string;
  tipo: 'texto' | 'opcoes' | 'numero' | 'data' | 'upload' | 'boolean' | 'checkbox';
  obrigatorio: boolean;
  opcoes?: string[]; // Para perguntas de múltipla escolha
  permiteUpload?: boolean; // Se permite anexar documento
  tipoDocumento?: string; // Tipo de documento esperado se permiteUpload=true
  pontuacaoMaxima?: number; // Pontuação máxima para esta pergunta (para cálculo de score)
  sugestaoIA?: string; // Sugestão de resposta pela IA
}

export interface SecaoQuestionario {
  id: string;
  titulo: string;
  descricao?: string;
  perguntas: PerguntaQuestionario[];
}

export interface ModeloQuestionario {
  id: string;
  nome: string;
  tipoFornecimento: TipoFornecimento;
  areas: AreaSolicitante[]; // Múltiplas áreas podem usar o mesmo modelo
  secoes: SecaoQuestionario[];
  versao: number;
  dataCriacao: string;
  personalizado: boolean;
  fornecedorId?: string; // Se for personalizado para um fornecedor específico
  ativo: boolean;
  pontuacaoMinima?: number; // Pontuação mínima para qualificação automática
}

export interface RespostaQuestionario {
  perguntaId: string;
  resposta: string | string[] | boolean;
  documentoId?: string; // ID do documento anexado, se houver
  observacao?: string; // Observações adicionais feitas pelo avaliador
  pontuacaoAtribuida?: number; // Pontuação atribuída a esta resposta
}

export interface QuestionarioPreenchido {
  id: string;
  modeloId: string;
  fornecedorId: string;
  tipoFornecimento: TipoFornecimento;
  areas: AreaSolicitante[];
  respostas: RespostaQuestionario[];
  dataEnvio: string;
  dataResposta?: string;
  status: 'enviado' | 'emAndamento' | 'respondido' | 'analisado' | 'aprovado' | 'reprovado';
  notaFinal?: number;
  comentarioAnalise?: string;
  analisadoPor?: string;
  dataAnalise?: string;
}

// Novas interfaces para a biblioteca de modelos
export interface ModeloBiblioteca {
  id: string;
  nome: string;
  descricao: string;
  tipoFornecimento: TipoFornecimento;
  areas: AreaSolicitante[];
  formato: FormatoModelo;
  arquivoUrl: string;
  dataCriacao: string;
  versao: string;
  autor: string;
  tags: string[];
  downloads: number;
  ultimoDownload?: string;
  tamanhoKb?: number;
  ativo: boolean;
  envios?: number; // Novo campo para rastrear envios
  ultimoEnvio?: string; // Novo campo para rastrear último envio
}

export interface FiltroBiblioteca {
  tipoFornecimento?: TipoFornecimento | 'todos';
  area?: AreaSolicitante | 'todas';
  formato?: FormatoModelo;
  termo?: string;
  ordenacao: 'recentes' | 'populares' | 'alfabetica';
}

// Nova interface para o envio de questionários
export interface EnvioQuestionario {
  id: string;
  modeloId: string;
  fornecedorId: string;
  dataEnvio: string;
  status: 'enviado' | 'visualizado' | 'respondido';
  dataPrazo?: string;
  observacoes?: string;
  contatoId: string; // ID do contato para quem foi enviado
  contatoEmail: string; // Email do contato para quem foi enviado
  contatoNome: string; // Nome do contato para quem foi enviado
}

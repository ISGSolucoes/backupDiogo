
import type { TipoAcaoLote } from '@/types/acoes-lote';

export const FINALIDADES_BIBLIOTECA = [
  'Procedimento',
  'Política',
  'Manual',
  'Formulário',
  'Contrato',
  'Certificação',
  'Relatório',
  'Auditoria',
  'Treinamento',
  'Comunicado',
  'Outro'
] as const;

export const AREAS_BIBLIOTECA = [
  'Compras',
  'Financeiro',
  'Jurídico',
  'Qualidade',
  'Engenharia',
  'Logística',
  'Recursos Humanos',
  'Compliance',
  'TI',
  'Geral'
] as const;

export const TIPOS_ARQUIVO = [
  'pdf',
  'doc',
  'docx',
  'xls',
  'xlsx',
  'ppt',
  'pptx',
  'txt',
  'jpg',
  'jpeg',
  'png',
  'zip',
  'rar'
] as const;

export const MODULOS_SISTEMA = [
  'Fornecedores',
  'Requisições',
  'Pedidos',
  'Sourcing',
  'Categorias',
  'Cleanse',
  'Orçamentário',
  'Metas',
  'Admin',
  'Relatórios',
  'Geral'
] as const;

// Mapeamento de ações para finalidades relevantes
export const MAPEAMENTO_ACAO_FINALIDADE = {
  'comunicado': ['Comunicado', 'Política', 'Procedimento'],
  'pesquisa_cliente': ['Formulário', 'Pesquisa', 'Avaliação'],
  'avaliacao_interna': ['Certificação', 'Documento', 'Relatório'],
  'convite': ['Comunicado', 'Formulário'],
  'requalificacao': ['Auditoria', 'Treinamento']
} as const;

// Função para mapear finalidade para tipo de ação
export const obterTipoAcaoPorFinalidade = (finalidade: string): TipoAcaoLote => {
  // Mapeamento inverso - dado uma finalidade, retorna o tipo de ação mais provável
  switch (finalidade) {
    case 'Comunicado':
    case 'Política':
    case 'Procedimento':
      return 'comunicado';
    case 'Formulário':
    case 'Pesquisa':
    case 'Avaliação':
      return 'pesquisa_cliente';
    case 'Certificação':
    case 'Documento':
    case 'Relatório':
      return 'avaliacao_interna';
    case 'Auditoria':
    case 'Treinamento':
      return 'requalificacao';
    default:
      return 'comunicado';
  }
};

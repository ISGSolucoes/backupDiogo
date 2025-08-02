
import { stringParaData } from './dateUtils';

export type TipoDocumentoTempo = 'pedido' | 'cotacao' | 'qualificacao';

/**
 * Determina se um documento é considerado "novo" baseado nas regras de tempo:
 * - Pedidos: novos até 3 dias
 * - Cotações: novas até 1 dia
 * - Qualificações: novas até 3 dias
 */
export const isDocumentoNovo = (
  tipoDocumento: TipoDocumentoTempo,
  dataRecebimento: string
): boolean => {
  const dataDoc = stringParaData(dataRecebimento);
  if (!dataDoc) return false;

  const agora = new Date();
  const diferencaMs = agora.getTime() - dataDoc.getTime();
  const diferencaDias = Math.floor(diferencaMs / (1000 * 60 * 60 * 24));

  const prazosPorTipo = {
    pedido: 3,
    cotacao: 1,
    qualificacao: 3
  };

  return diferencaDias <= prazosPorTipo[tipoDocumento];
};

/**
 * Calcula há quantos dias um documento foi recebido
 */
export const diasDesdeRecebimento = (dataRecebimento: string): number => {
  const dataDoc = stringParaData(dataRecebimento);
  if (!dataDoc) return 0;

  const agora = new Date();
  const diferencaMs = agora.getTime() - dataDoc.getTime();
  return Math.floor(diferencaMs / (1000 * 60 * 60 * 24));
};

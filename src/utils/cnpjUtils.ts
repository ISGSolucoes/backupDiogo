
/**
 * Remove a formatação do CNPJ, mantendo apenas os números
 */
export const removerFormatacaoCnpj = (cnpj: string): string => {
  return cnpj.replace(/[.\-\/]/g, '');
};

/**
 * Formatar CNPJ com pontos, barras e traços
 */
export const formatarCnpj = (cnpj: string): string => {
  const cnpjLimpo = cnpj.replace(/\D/g, '');
  
  if (cnpjLimpo.length !== 14) {
    return cnpj; // Retorna original se não tiver 14 dígitos
  }
  
  return cnpjLimpo.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

/**
 * Extrair CNPJ raiz (primeiros 8 dígitos)
 */
export const extrairCnpjRaiz = (cnpj: string): string => {
  const cnpjLimpo = cnpj.replace(/\D/g, '');
  return cnpjLimpo.substring(0, 8);
};

/**
 * Verificar se é CNPJ matriz (termina com 0001)
 */
export const isCnpjMatriz = (cnpj: string): boolean => {
  const cnpjLimpo = cnpj.replace(/\D/g, '');
  return cnpjLimpo.endsWith('0001');
};

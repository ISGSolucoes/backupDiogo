
export const formatarTelefone = (telefone: string): string => {
  if (!telefone) return '';
  
  // Remove tudo que não é número
  const numeros = telefone.replace(/\D/g, '');
  
  // Formata conforme o tamanho
  if (numeros.length === 10) {
    return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else if (numeros.length === 11) {
    return numeros.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4');
  }
  
  return telefone;
};

export const formatarEndereco = (endereco: string): string => {
  if (!endereco) return '';
  
  // Trunca endereços muito longos
  return endereco.length > 50 ? `${endereco.substring(0, 47)}...` : endereco;
};

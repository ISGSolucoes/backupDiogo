
import { format, isValid, parse, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * Formata uma string de data para exibição no formato brasileiro (DD/MM/YYYY)
 * Suporta vários formatos de entrada: DD/MM/YYYY, YYYY-MM-DD, ISO string, timestamp, etc.
 * 
 * @param dataStr String contendo a data em qualquer formato
 * @param formatoSaida Formato de saída (padrão: dd/MM/yyyy)
 * @returns String formatada ou "-" se não conseguir formatar
 */
export const formatarData = (dataStr: string | undefined | null, formatoSaida: string = "dd/MM/yyyy"): string => {
  if (!dataStr) return "-";
  
  try {
    // Verificar se já está no formato desejado (evita processamento desnecessário)
    if (dataStr.match(/^\d{2}\/\d{2}\/\d{4}$/) && formatoSaida === "dd/MM/yyyy") {
      // Validar se é uma data válida
      const parts = dataStr.split('/');
      const testDate = new Date(
        parseInt(parts[2]), 
        parseInt(parts[1]) - 1, 
        parseInt(parts[0])
      );
      
      if (testDate.getDate() === parseInt(parts[0]) && 
          testDate.getMonth() === parseInt(parts[1]) - 1 &&
          testDate.getFullYear() === parseInt(parts[2])) {
        return dataStr; // Já está no formato correto e é válida
      }
    }
    
    // Primeiro tenta interpretar como data no formato DD/MM/YYYY
    const parsedDateDDMMYYYY = parse(dataStr, "dd/MM/yyyy", new Date());
    if (isValid(parsedDateDDMMYYYY)) {
      return format(parsedDateDDMMYYYY, formatoSaida, { locale: ptBR });
    }
    
    // Tenta interpretar como data no formato YYYY-MM-DD
    const parsedDateISO = parse(dataStr, "yyyy-MM-dd", new Date());
    if (isValid(parsedDateISO)) {
      return format(parsedDateISO, formatoSaida, { locale: ptBR });
    }
    
    // Tenta interpretar como ISO string completo (com hora)
    try {
      const isoDate = parseISO(dataStr);
      if (isValid(isoDate)) {
        return format(isoDate, formatoSaida, { locale: ptBR });
      }
    } catch (e) {
      // Se falhar, continua tentando outros formatos
    }
    
    // Tenta interpretar como timestamp ou outros formatos
    const timestamp = Date.parse(dataStr);
    if (!isNaN(timestamp)) {
      return format(new Date(timestamp), formatoSaida, { locale: ptBR });
    }
    
    // Tenta extrair mês/ano para formato como "05/2023"
    const monthYearMatch = dataStr.match(/(\d{1,2})\/(\d{4})/);
    if (monthYearMatch) {
      const month = parseInt(monthYearMatch[1]);
      const year = parseInt(monthYearMatch[2]);
      if (month >= 1 && month <= 12 && year >= 1900 && year <= 2100) {
        return `${String(month).padStart(2, '0')}/${year}`;
      }
    }
  } catch (e) {
    console.error("Erro ao formatar data:", dataStr, e);
  }
  
  return "-"; // Retorna um traço se não conseguir formatar
};

/**
 * Converte uma string de data em um objeto Date
 * Suporta vários formatos de entrada: DD/MM/YYYY, YYYY-MM-DD, ISO string, timestamp, etc.
 * 
 * @param dataStr String contendo a data em qualquer formato
 * @returns Objeto Date ou null se não conseguir converter
 */
export const stringParaData = (dataStr: string | undefined | null): Date | null => {
  if (!dataStr) return null;
  
  try {
    // Tenta interpretar como data no formato DD/MM/YYYY
    const parsedDateDDMMYYYY = parse(dataStr, "dd/MM/yyyy", new Date());
    if (isValid(parsedDateDDMMYYYY)) {
      return parsedDateDDMMYYYY;
    }
    
    // Tenta interpretar como data no formato YYYY-MM-DD
    const parsedDateISO = parse(dataStr, "yyyy-MM-dd", new Date());
    if (isValid(parsedDateISO)) {
      return parsedDateISO;
    }
    
    // Tenta interpretar como ISO string
    const isoDate = parseISO(dataStr);
    if (isValid(isoDate)) {
      return isoDate;
    }
    
    // Tenta interpretar como timestamp
    const timestamp = Date.parse(dataStr);
    if (!isNaN(timestamp)) {
      return new Date(timestamp);
    }
  } catch (e) {
    console.error("Erro ao converter data:", dataStr, e);
  }
  
  return null;
};

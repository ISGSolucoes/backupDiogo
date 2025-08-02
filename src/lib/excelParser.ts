/**
 * Utilitários para processamento de arquivos Excel
 */

export interface ExcelParseResult {
  success: boolean;
  data?: any[];
  errors?: string[];
  headers?: string[];
}

export interface ExcelColumn {
  key: string;
  name: string;
  required: boolean;
  type: 'string' | 'number' | 'date' | 'boolean';
  validator?: (value: any) => boolean;
}

export class ExcelParser {
  /**
   * Configurações padrão para importação de fornecedores
   */
  static getSupplierColumns(): ExcelColumn[] {
    return [
      {
        key: 'razao_social',
        name: 'Razão Social',
        required: true,
        type: 'string'
      },
      {
        key: 'nome_fantasia', 
        name: 'Nome Fantasia',
        required: false,
        type: 'string'
      },
      {
        key: 'documento',
        name: 'CNPJ/CPF',
        required: true,
        type: 'string',
        validator: (value) => this.validateDocument(value)
      },
      {
        key: 'email',
        name: 'Email',
        required: false,
        type: 'string',
        validator: (value) => this.validateEmail(value)
      },
      {
        key: 'telefone',
        name: 'Telefone',
        required: false,
        type: 'string'
      },
      {
        key: 'endereco',
        name: 'Endereço',
        required: false,
        type: 'string'
      },
      {
        key: 'cidade',
        name: 'Cidade',
        required: false,
        type: 'string'
      },
      {
        key: 'estado',
        name: 'Estado',
        required: false,
        type: 'string'
      }
    ];
  }

  /**
   * Configurações padrão para importação de produtos/serviços
   */
  static getProductColumns(): ExcelColumn[] {
    return [
      {
        key: 'codigo',
        name: 'Código',
        required: true,
        type: 'string'
      },
      {
        key: 'descricao',
        name: 'Descrição',
        required: true,
        type: 'string'
      },
      {
        key: 'categoria',
        name: 'Categoria',
        required: true,
        type: 'string'
      },
      {
        key: 'unidade',
        name: 'Unidade de Medida',
        required: true,
        type: 'string'
      },
      {
        key: 'preco_referencia',
        name: 'Preço de Referência',
        required: false,
        type: 'number'
      },
      {
        key: 'especificacoes',
        name: 'Especificações',
        required: false,
        type: 'string'
      }
    ];
  }

  /**
   * Valida um documento (CNPJ ou CPF)
   */
  private static validateDocument(document: string): boolean {
    if (!document) return false;
    
    const cleanDoc = document.replace(/\D/g, '');
    
    // CNPJ tem 14 dígitos
    if (cleanDoc.length === 14) {
      return this.validateCNPJ(cleanDoc);
    }
    
    // CPF tem 11 dígitos
    if (cleanDoc.length === 11) {
      return this.validateCPF(cleanDoc);
    }
    
    return false;
  }

  /**
   * Valida CNPJ
   */
  private static validateCNPJ(cnpj: string): boolean {
    if (cnpj.length !== 14) return false;
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{13}$/.test(cnpj)) return false;
    
    // Validar dígitos verificadores
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(0))) return false;
    
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    return resultado === parseInt(digitos.charAt(1));
  }

  /**
   * Valida CPF
   */
  private static validateCPF(cpf: string): boolean {
    if (cpf.length !== 11) return false;
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    // Validar primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;
    
    // Validar segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf.charAt(10));
  }

  /**
   * Valida email
   */
  private static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Normaliza valor baseado no tipo
   */
  static normalizeValue(value: any, type: ExcelColumn['type']): any {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    switch (type) {
      case 'string':
        return String(value).trim();
      
      case 'number':
        const num = parseFloat(String(value).replace(',', '.'));
        return isNaN(num) ? null : num;
      
      case 'boolean':
        const str = String(value).toLowerCase().trim();
        return str === 'true' || str === '1' || str === 'sim' || str === 's';
      
      case 'date':
        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date.toISOString();
      
      default:
        return value;
    }
  }

  /**
   * Valida uma linha de dados contra as colunas definidas
   */
  static validateRow(row: Record<string, any>, columns: ExcelColumn[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    columns.forEach(column => {
      const value = row[column.key];

      // Verificar campos obrigatórios
      if (column.required && (value === null || value === undefined || value === '')) {
        errors.push(`Campo obrigatório "${column.name}" está vazio`);
        return;
      }

      // Aplicar validador customizado se existir
      if (value && column.validator && !column.validator(value)) {
        errors.push(`Valor inválido para "${column.name}": ${value}`);
      }
    });

    return { valid: errors.length === 0, errors };
  }

  /**
   * Converte dados para formato de importação
   */
  static convertToImportFormat(
    data: any[], 
    columns: ExcelColumn[], 
    headerMapping?: Record<string, string>
  ): { success: boolean; data: any[]; errors: string[] } {
    const convertedData: any[] = [];
    const allErrors: string[] = [];

    data.forEach((row, index) => {
      const convertedRow: Record<string, any> = {};
      
      // Mapear headers se fornecido
      const mappedRow = headerMapping ? this.mapHeaders(row, headerMapping) : row;

      // Normalizar valores
      columns.forEach(column => {
        const rawValue = mappedRow[column.key];
        convertedRow[column.key] = this.normalizeValue(rawValue, column.type);
      });

      // Validar linha
      const validation = this.validateRow(convertedRow, columns);
      if (!validation.valid) {
        allErrors.push(`Linha ${index + 1}: ${validation.errors.join(', ')}`);
      } else {
        convertedData.push(convertedRow);
      }
    });

    return {
      success: allErrors.length === 0,
      data: convertedData,
      errors: allErrors
    };
  }

  /**
   * Mapeia headers de acordo com o mapeamento fornecido
   */
  private static mapHeaders(row: Record<string, any>, mapping: Record<string, string>): Record<string, any> {
    const mappedRow: Record<string, any> = {};
    
    Object.keys(mapping).forEach(originalHeader => {
      const newKey = mapping[originalHeader];
      if (row[originalHeader] !== undefined) {
        mappedRow[newKey] = row[originalHeader];
      }
    });

    return mappedRow;
  }

  /**
   * Gera template Excel para download
   */
  static generateTemplate(columns: ExcelColumn[]): Record<string, any> {
    const headers = columns.map(col => col.name);
    const example = columns.reduce((acc, col) => {
      acc[col.name] = this.getExampleValue(col);
      return acc;
    }, {} as Record<string, any>);

    return {
      headers,
      example
    };
  }

  /**
   * Gera valor de exemplo para uma coluna
   */
  private static getExampleValue(column: ExcelColumn): string {
    switch (column.key) {
      case 'razao_social':
        return 'Empresa Exemplo LTDA';
      case 'nome_fantasia':
        return 'Empresa Exemplo';
      case 'documento':
        return '12.345.678/0001-90';
      case 'email':
        return 'contato@empresa.com';
      case 'telefone':
        return '(11) 1234-5678';
      case 'endereco':
        return 'Rua Exemplo, 123';
      case 'cidade':
        return 'São Paulo';
      case 'estado':
        return 'SP';
      case 'codigo':
        return 'PROD001';
      case 'descricao':
        return 'Produto de exemplo';
      case 'categoria':
        return 'Categoria A';
      case 'unidade':
        return 'UN';
      case 'preco_referencia':
        return '100.00';
      default:
        return column.type === 'number' ? '0' : 'Exemplo';
    }
  }
}
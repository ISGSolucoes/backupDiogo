
import { useState, useEffect } from 'react';
import { ConfiguracaoColuna } from '@/types/fornecedor';

const STORAGE_KEY = 'fornecedores_colunas_config';

const CONFIGURACAO_PADRAO: ConfiguracaoColuna[] = [
  { key: 'nome', label: 'Razão Social', visible: true, order: 0, required: true },
  { key: 'cnpj', label: 'CNPJ', visible: true, order: 1, required: true },
  { key: 'cnpjRaiz', label: 'Raiz CNPJ', visible: false, order: 2 },
  { key: 'quantidadeFiliais', label: 'Qtd Filiais', visible: false, order: 3 },
  { key: 'dataCadastro', label: 'Data Cadastro', visible: false, order: 4 },
  { key: 'ultimaParticipacao', label: 'Última Participação', visible: true, order: 5 },
  { key: 'status', label: 'Status', visible: true, order: 6 },
  { key: 'tipoFornecedor', label: 'Tipo', visible: false, order: 7 },
  { key: 'classificacao', label: 'Classificação', visible: false, order: 8 },
  { key: 'categoria', label: 'Categoria', visible: true, order: 9 },
  { key: 'financeiro', label: 'Financeiro', visible: false, order: 10 },
  { key: 'segmento', label: 'Segmento', visible: false, order: 11 },
  { key: 'descricao', label: 'Descrição', visible: false, order: 12 },
  { key: 'porte', label: 'Porte', visible: false, order: 13 },
  { key: 'avaliacao', label: 'Avaliação', visible: false, order: 14 },
  { key: 'score', label: 'Score', visible: false, order: 15 },
  { key: 'transacional', label: 'Transacional', visible: false, order: 16 },
  { key: 'criticidade', label: 'Criticidade', visible: false, order: 17 },
  { key: 'cidade', label: 'Cidade', visible: false, order: 18 },
  { key: 'uf', label: 'UF', visible: false, order: 19 },
  { key: 'qualificado', label: 'Qualificado', visible: false, order: 20 },
  { key: 'preferido', label: 'Preferido', visible: false, order: 21 },
  // Novos campos de contato
  { key: 'email', label: 'E-mail', visible: false, order: 22, requiresApprovalForExport: true },
  { key: 'telefone', label: 'Telefone', visible: false, order: 23, requiresApprovalForExport: true },
  { key: 'endereco', label: 'Endereço', visible: false, order: 24, requiresApprovalForExport: true },
  { key: 'pais', label: 'País', visible: false, order: 25 },
  { key: 'estado', label: 'Estado', visible: false, order: 26 },
  { key: 'acoes', label: 'Ações', visible: true, order: 27, required: true }
];

export const useColunasPersonalizadas = () => {
  const [configuracao, setConfiguracao] = useState<ConfiguracaoColuna[]>(CONFIGURACAO_PADRAO);

  // Carregar configuração do localStorage
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem(STORAGE_KEY);
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        // Verificar se a configuração tem todos os campos necessários
        const configCompleta = CONFIGURACAO_PADRAO.map(padrao => {
          const saved = parsedConfig.find((c: ConfiguracaoColuna) => c.key === padrao.key);
          return saved ? { ...padrao, ...saved } : padrao;
        });
        setConfiguracao(configCompleta);
      }
    } catch (error) {
      console.error('Erro ao carregar configuração de colunas:', error);
      setConfiguracao(CONFIGURACAO_PADRAO);
    }
  }, []);

  // Salvar configuração no localStorage
  const salvarConfiguracao = (novaConfiguracao: ConfiguracaoColuna[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(novaConfiguracao));
      setConfiguracao(novaConfiguracao);
    } catch (error) {
      console.error('Erro ao salvar configuração de colunas:', error);
    }
  };

  // Resetar para configuração padrão
  const resetarConfiguracao = () => {
    localStorage.removeItem(STORAGE_KEY);
    setConfiguracao(CONFIGURACAO_PADRAO);
  };

  // Obter colunas visíveis ordenadas
  const colunasVisiveis = configuracao
    .filter(col => col.visible)
    .sort((a, b) => a.order - b.order);

  // Obter configuração de uma coluna específica
  const getConfiguracaoColuna = (key: ConfiguracaoColuna['key']) => {
    return configuracao.find(col => col.key === key);
  };

  return {
    configuracao,
    colunasVisiveis,
    salvarConfiguracao,
    resetarConfiguracao,
    getConfiguracaoColuna
  };
};

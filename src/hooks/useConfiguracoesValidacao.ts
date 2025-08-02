import { useState, useEffect } from 'react';

export type NivelValidacao = 'off' | 'warn' | 'required';

export interface ConfiguracaoValidacao {
  fornecedorHomologado: NivelValidacao;
  validarSaldoOrcamentario: NivelValidacao;
  exigirContaContabil: NivelValidacao;
  exigirCentroCusto: NivelValidacao;
  exigirProjetoAtividade: NivelValidacao;
  exigirResponsavelInterno: NivelValidacao;
  validarDataEntrega: NivelValidacao;
  exigirCondicaoPagamento: NivelValidacao;
  validarLocalEntrega: NivelValidacao;
  exigirObservacoesTecnicas: NivelValidacao;
}

export interface ConfiguracaoAprovacao {
  aprovacaoPorValor: {
    [valor: string]: string[]; // valor limite -> perfis de aprovação
  };
  aprovacaoAutomatica: boolean;
  escalonamentoAutomatico: boolean;
  prazoAprovacaoHoras: number;
}

export interface ConfiguracoesCliente {
  validacoes: ConfiguracaoValidacao;
  aprovacao: ConfiguracaoAprovacao;
  clienteId: string;
  ativo: boolean;
}

// Configurações padrão baseadas no PRD
const configuracoesPadrao: ConfiguracaoValidacao = {
  fornecedorHomologado: 'warn',
  validarSaldoOrcamentario: 'off',
  exigirContaContabil: 'off',
  exigirCentroCusto: 'required',
  exigirProjetoAtividade: 'off',
  exigirResponsavelInterno: 'required',
  validarDataEntrega: 'required',
  exigirCondicaoPagamento: 'required',
  validarLocalEntrega: 'required',
  exigirObservacoesTecnicas: 'off'
};

const aprovacaoPadrao: ConfiguracaoAprovacao = {
  aprovacaoPorValor: {
    '10000': ['Comprador'],
    '50000': ['Comprador', 'Coordenador'],
    '200000': ['Comprador', 'Coordenador', 'Gerente']
  },
  aprovacaoAutomatica: false,
  escalonamentoAutomatico: true,
  prazoAprovacaoHoras: 48
};

const STORAGE_KEY = 'sourcexpress_configuracoes_validacao';

export function useConfiguracoesValidacao() {
  const [configuracoes, setConfiguracoes] = useState<ConfiguracoesCliente>({
    validacoes: configuracoesPadrao,
    aprovacao: aprovacaoPadrao,
    clienteId: 'default',
    ativo: true
  });
  const [loading, setLoading] = useState(false);

  // Carregar configurações do localStorage
  const carregarConfiguracoes = async () => {
    try {
      setLoading(true);
      const configSalvas = localStorage.getItem(STORAGE_KEY);
      
      if (configSalvas) {
        const parsed = JSON.parse(configSalvas);
        setConfiguracoes({
          validacoes: { ...configuracoesPadrao, ...parsed.validacoes },
          aprovacao: { ...aprovacaoPadrao, ...parsed.aprovacao },
          clienteId: parsed.clienteId || 'default',
          ativo: parsed.ativo !== false
        });
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      // Manter configurações padrão em caso de erro
    } finally {
      setLoading(false);
    }
  };

  // Salvar configurações no localStorage
  const salvarConfiguracoes = async (novasConfiguracoes: ConfiguracoesCliente) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(novasConfiguracoes));
      setConfiguracoes(novasConfiguracoes);
      return { success: true };
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      return { success: false, error };
    }
  };

  // Validar campo específico baseado na configuração
  const validarCampo = (campo: keyof ConfiguracaoValidacao, valor: any): {
    valido: boolean;
    nivel: NivelValidacao;
    mensagem?: string;
  } => {
    const nivel = configuracoes.validacoes[campo];
    
    if (nivel === 'off') {
      return { valido: true, nivel };
    }

    const estaVazio = !valor || (typeof valor === 'string' && valor.trim() === '');
    
    if (estaVazio) {
      const mensagens = {
        fornecedorHomologado: 'Fornecedor deve estar homologado',
        validarSaldoOrcamentario: 'Saldo orçamentário insuficiente',
        exigirContaContabil: 'Conta contábil é obrigatória',
        exigirCentroCusto: 'Centro de custo é obrigatório',
        exigirProjetoAtividade: 'Projeto/Atividade é obrigatório',
        exigirResponsavelInterno: 'Responsável interno é obrigatório',
        validarDataEntrega: 'Data de entrega é obrigatória',
        exigirCondicaoPagamento: 'Condição de pagamento é obrigatória',
        validarLocalEntrega: 'Local de entrega é obrigatório',
        exigirObservacoesTecnicas: 'Observações técnicas são obrigatórias'
      };

      return {
        valido: nivel === 'warn',
        nivel,
        mensagem: mensagens[campo]
      };
    }

    return { valido: true, nivel };
  };

  // Validar pedido completo baseado nas configurações
  const validarPedidoCompleto = (pedido: any): {
    valido: boolean;
    erros: string[];
    alertas: string[];
  } => {
    const resultado = {
      valido: true,
      erros: [] as string[],
      alertas: [] as string[]
    };

    // Mapear campos do pedido para configurações de validação
    const camposParaValidar = [
      { campo: 'exigirCentroCusto' as const, valor: pedido.centro_custo },
      { campo: 'exigirContaContabil' as const, valor: pedido.conta_contabil },
      { campo: 'exigirProjetoAtividade' as const, valor: pedido.projeto_atividade },
      { campo: 'exigirResponsavelInterno' as const, valor: pedido.responsavel_interno_nome },
      { campo: 'validarDataEntrega' as const, valor: pedido.data_entrega_prevista },
      { campo: 'exigirCondicaoPagamento' as const, valor: pedido.condicao_pagamento },
      { campo: 'validarLocalEntrega' as const, valor: pedido.local_entrega }
    ];

    camposParaValidar.forEach(({ campo, valor }) => {
      const validacao = validarCampo(campo, valor);
      
      if (!validacao.valido) {
        if (validacao.nivel === 'required') {
          resultado.erros.push(validacao.mensagem || `Campo ${campo} é obrigatório`);
          resultado.valido = false;
        } else if (validacao.nivel === 'warn') {
          resultado.alertas.push(validacao.mensagem || `Atenção: ${campo}`);
        }
      }
    });

    return resultado;
  };

  useEffect(() => {
    carregarConfiguracoes();
  }, []);

  return {
    configuracoes,
    loading,
    carregarConfiguracoes,
    salvarConfiguracoes,
    validarCampo,
    validarPedidoCompleto
  };
}
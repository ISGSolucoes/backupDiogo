import { useState, useCallback } from 'react';
import { 
  TributosDetalhados, 
  TaxCalculationInput, 
  RegimeTributario,
  ImpostoItem 
} from '@/types/impostos';

// Tabelas de alíquotas por estado e regime
const ALIQUOTAS_ICMS: Record<string, number> = {
  'SP': 18,
  'RJ': 20,
  'MG': 18,
  'RS': 17,
  'PR': 19,
  'SC': 17,
  // Adicionar outros estados conforme necessário
};

const ALIQUOTAS_IPI: Record<string, number> = {
  'materiais_eletronicos': 10,
  'equipamentos_industriais': 5,
  'servicos': 0,
  'default': 10,
};

export const useTaxCalculation = () => {
  const [isCalculating, setIsCalculating] = useState(false);

  const createEmptyImposto = (editable: boolean = true): ImpostoItem => ({
    aliquota: 0,
    valor: 0,
    base: 0,
    origem: 'manual',
    editable,
  });

  const createEmptyTributos = (): TributosDetalhados => ({
    icms: createEmptyImposto(),
    ipi: createEmptyImposto(),
    iss: createEmptyImposto(),
    pisCofins: createEmptyImposto(),
    outrosImpostos: [],
  });

  const calculateTaxes = useCallback(async (input: TaxCalculationInput): Promise<TributosDetalhados> => {
    setIsCalculating(true);
    
    try {
      // Simular delay de cálculo
      await new Promise(resolve => setTimeout(resolve, 500));

      const { valor, regimeTributario, estado = 'SP', categoria = 'default', tipo } = input;

      const impostos = createEmptyTributos();

      if (!valor || !regimeTributario) {
        return impostos;
      }

      const base = valor;

      switch (regimeTributario) {
        case 'simples':
          // Simples Nacional - tributação simplificada
          impostos.icms = {
            aliquota: 6, // Alíquota média do Simples
            valor: base * 0.06,
            base,
            origem: 'calculado',
            editable: true, // Permite discriminação se o cliente exigir
          };
          break;

        case 'presumido':
        case 'real':
          // Lucro Presumido/Real - cálculo completo
          const aliquotaICMS = ALIQUOTAS_ICMS[estado] || 18;
          const aliquotaIPI = ALIQUOTAS_IPI[categoria] || ALIQUOTAS_IPI.default;

          impostos.icms = {
            aliquota: aliquotaICMS,
            valor: base * (aliquotaICMS / 100),
            base,
            origem: 'calculado',
            editable: true,
          };

          if (tipo === 'material') {
            impostos.ipi = {
              aliquota: aliquotaIPI,
              valor: base * (aliquotaIPI / 100),
              base,
              origem: 'calculado',
              editable: true,
            };
          }

          if (tipo === 'servico') {
            impostos.iss = {
              aliquota: 5, // Alíquota padrão de ISS
              valor: base * 0.05,
              base,
              origem: 'calculado',
              editable: true,
            };
          }

          impostos.pisCofins = {
            aliquota: 3.65, // PIS + COFINS
            valor: base * 0.0365,
            base,
            origem: 'calculado',
            editable: true,
          };
          break;

        default:
          break;
      }

      return impostos;
    } finally {
      setIsCalculating(false);
    }
  }, []);

  const calculateTotalWithTaxes = useCallback((valor: number, impostos: TributosDetalhados): number => {
    const totalImpostos = 
      (impostos.icms?.valor || 0) +
      (impostos.ipi?.valor || 0) +
      (impostos.iss?.valor || 0) +
      (impostos.pisCofins?.valor || 0) +
      impostos.outrosImpostos.reduce((acc, imp) => acc + (imp.valor || 0), 0);

    return valor + totalImpostos;
  }, []);

  const validateTaxData = useCallback((regimeTributario: RegimeTributario, valor: number): boolean => {
    return !!(regimeTributario && valor > 0);
  }, []);

  const applyTaxRules = useCallback((
    regimeTributario: RegimeTributario,
    impostos: TributosDetalhados,
    modelo?: { exigir_detalhamento_impostos?: boolean; permitir_edicao_impostos?: boolean }
  ): TributosDetalhados => {
    if (!modelo) return impostos;

    const { exigir_detalhamento_impostos, permitir_edicao_impostos } = modelo;

    // Se não exige detalhamento e é Simples, bloquear edição
    if (!exigir_detalhamento_impostos && regimeTributario === 'simples') {
      return {
        ...impostos,
        icms: { ...impostos.icms, editable: false, locked_reason: 'Regime Simples Nacional - detalhamento opcional' },
        ipi: { ...impostos.ipi, editable: false, locked_reason: 'Regime Simples Nacional - detalhamento opcional' },
        iss: { ...impostos.iss, editable: false, locked_reason: 'Regime Simples Nacional - detalhamento opcional' },
        pisCofins: { ...impostos.pisCofins, editable: false, locked_reason: 'Regime Simples Nacional - detalhamento opcional' },
      };
    }

    // Se não permite edição global, bloquear todos
    if (!permitir_edicao_impostos) {
      const locked_reason = 'Edição bloqueada pelo modelo da RFP';
      return {
        ...impostos,
        icms: { ...impostos.icms, editable: false, locked_reason },
        ipi: { ...impostos.ipi, editable: false, locked_reason },
        iss: { ...impostos.iss, editable: false, locked_reason },
        pisCofins: { ...impostos.pisCofins, editable: false, locked_reason },
      };
    }

    return impostos;
  }, []);

  return {
    calculateTaxes,
    calculateTotalWithTaxes,
    validateTaxData,
    applyTaxRules,
    createEmptyTributos,
    isCalculating,
  };
};
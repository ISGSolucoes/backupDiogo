import { useState, useEffect, useMemo } from "react";

export interface PropostaComparacao {
  id: string;
  fornecedor: {
    id: string;
    nome: string;
    documento: string;
    avatar?: string;
  };
  status: 'enviada' | 'analise' | 'aprovada' | 'rejeitada';
  valorTotal: number;
  valorComImpostos: number;
  tributos: number;
  prazoEntrega: number;
  unidadePrazo: string;
  dataEnvio: string;
  documentos: {
    total: number;
    enviados: number;
  };
  itens: ItemProposta[];
  notaTecnica: number;
  notaComercial: number;
  notaFinal: number;
  ranking: number;
  observacoes?: string;
  anexos: AnexoProposta[];
  avaliacoesCriterios: Record<string, any>;
}

export interface ItemProposta {
  id: string;
  descricao: string;
  quantidade: number;
  unidade: string;
  precoUnitario: number;
  precoTotal: number;
  tributos: number;
  prazoEntrega?: number;
  observacoes?: string;
}

export interface AnexoProposta {
  id: string;
  nome: string;
  tipo: string;
  tamanho: number;
  dataUpload: string;
}

export interface RFPData {
  id: string;
  name: string;
  cliente: string;
  categoria: string;
  status: string;
  dataEncerramento: string;
  convidados: number;
  pesoTecnico: number;
  pesoComercial: number;
  criterios: any[];
  itensTemplate: any[];
}

export interface ResumoAnalise {
  menorPreco: number;
  precoMedio: number;
  maiorPreco: number;
  melhorNota: number;
  fornecedorMenorPreco: string;
  fornecedorMelhorNota: string;
  economiaTotal: number;
  percentualEconomia: number;
}

export function useProposalComparison(rfpId: string) {
  const [loading, setLoading] = useState(true);
  const [propostas, setPropostas] = useState<PropostaComparacao[]>([]);

  // Dados simulados da RFP
  const rfpData: RFPData = {
    id: rfpId,
    name: "RFP - ERP + Serviços de Implementação",
    cliente: "GOV123",
    categoria: "Tecnologia - ERP",
    status: "encerrado",
    dataEncerramento: "2025-07-22T18:00:00",
    convidados: 7,
    pesoTecnico: 60,
    pesoComercial: 40,
    criterios: [
      { id: "1", nome: "Experiência mínima 2 anos", peso: 15, tipo: "boolean" },
      { id: "2", nome: "Equipe com certificação", peso: 20, tipo: "boolean" },
      { id: "3", nome: "Plano de implantação detalhado", peso: 25, tipo: "rating" },
      { id: "4", nome: "Atendimento SLA exigido", peso: 20, tipo: "boolean" },
      { id: "5", nome: "Documentação completa", peso: 20, tipo: "boolean" }
    ],
    itensTemplate: [
      { id: "1", descricao: "Licença ERP - Módulo Financeiro", quantidade: 1, unidade: "un" },
      { id: "2", descricao: "Serviço de Implementação ERP", quantidade: 1, unidade: "projeto" },
      { id: "3", descricao: "Treinamento da Equipe", quantidade: 20, unidade: "horas" }
    ]
  };

  // Dados simulados das propostas
  const propostasSimuladas: PropostaComparacao[] = [
    {
      id: "prop1",
      fornecedor: {
        id: "forn1",
        nome: "TechSupply Solutions",
        documento: "12.345.678/0001-90"
      },
      status: "enviada",
      valorTotal: 185000,
      valorComImpostos: 217000,
      tributos: 32000,
      prazoEntrega: 45,
      unidadePrazo: "dias",
      dataEnvio: "2025-07-20T14:30:00",
      documentos: { total: 5, enviados: 5 },
      itens: [
        {
          id: "item1",
          descricao: "Licença ERP - Módulo Financeiro",
          quantidade: 1,
          unidade: "un",
          precoUnitario: 85000,
          precoTotal: 85000,
          tributos: 15300
        },
        {
          id: "item2", 
          descricao: "Serviço de Implementação ERP",
          quantidade: 1,
          unidade: "projeto",
          precoUnitario: 65000,
          precoTotal: 65000,
          tributos: 11700,
          observacoes: "Inclui migração de dados"
        },
        {
          id: "item3",
          descricao: "Treinamento da Equipe",
          quantidade: 20,
          unidade: "horas",
          precoUnitario: 1750,
          precoTotal: 35000,
          tributos: 5000
        }
      ],
      notaTecnica: 8.9,
      notaComercial: 7.8,
      notaFinal: 8.1,
      ranking: 1,
      observacoes: "Proposta completa e bem estruturada",
      anexos: [
        { id: "anx1", nome: "Proposta_Tecnica.pdf", tipo: "pdf", tamanho: 2048000, dataUpload: "2025-07-20T14:30:00" },
        { id: "anx2", nome: "Cronograma.xlsx", tipo: "xlsx", tamanho: 512000, dataUpload: "2025-07-20T14:35:00" }
      ],
      avaliacoesCriterios: {
        "1": true,
        "2": true,
        "3": 9,
        "4": true,
        "5": true
      }
    },
    {
      id: "prop2",
      fornecedor: {
        id: "forn2",
        nome: "Innovate Systems",
        documento: "23.456.789/0001-01"
      },
      status: "enviada",
      valorTotal: 179500,
      valorComImpostos: 179500,
      tributos: 0,
      prazoEntrega: 60,
      unidadePrazo: "dias",
      dataEnvio: "2025-07-21T16:45:00",
      documentos: { total: 5, enviados: 5 },
      itens: [
        {
          id: "item1",
          descricao: "Licença ERP - Módulo Financeiro",
          quantidade: 1,
          unidade: "un",
          precoUnitario: 79500,
          precoTotal: 79500,
          tributos: 0
        },
        {
          id: "item2",
          descricao: "Serviço de Implementação ERP", 
          quantidade: 1,
          unidade: "projeto",
          precoUnitario: 61000,
          precoTotal: 61000,
          tributos: 0,
          observacoes: "Não inclui treinamento"
        },
        {
          id: "item3",
          descricao: "Treinamento da Equipe",
          quantidade: 20,
          unidade: "horas",
          precoUnitario: 1950,
          precoTotal: 39000,
          tributos: 0
        }
      ],
      notaTecnica: 7.5,
      notaComercial: 8.9,
      notaFinal: 7.7,
      ranking: 2,
      observacoes: "Preço competitivo mas menor experiência",
      anexos: [
        { id: "anx3", nome: "Proposta_Comercial.pdf", tipo: "pdf", tamanho: 1536000, dataUpload: "2025-07-21T16:45:00" }
      ],
      avaliacoesCriterios: {
        "1": true,
        "2": false,
        "3": 7,
        "4": false,
        "5": true
      }
    },
    {
      id: "prop3",
      fornecedor: {
        id: "forn3",
        nome: "Enterprise Solutions",
        documento: "34.567.890/0001-12"
      },
      status: "enviada",
      valorTotal: 200000,
      valorComImpostos: 238000,
      tributos: 38000,
      prazoEntrega: 50,
      unidadePrazo: "dias",
      dataEnvio: "2025-07-22T10:15:00",
      documentos: { total: 5, enviados: 2 },
      itens: [
        {
          id: "item1",
          descricao: "Licença ERP - Módulo Financeiro",
          quantidade: 1,
          unidade: "un",
          precoUnitario: 95000,
          precoTotal: 95000,
          tributos: 18050
        },
        {
          id: "item2",
          descricao: "Serviço de Implementação ERP",
          quantidade: 1,
          unidade: "projeto", 
          precoUnitario: 70000,
          precoTotal: 70000,
          tributos: 13300
        },
        {
          id: "item3",
          descricao: "Treinamento da Equipe",
          quantidade: 20,
          unidade: "horas",
          precoUnitario: 1750,
          precoTotal: 35000,
          tributos: 6650
        }
      ],
      notaTecnica: 6.2,
      notaComercial: 6.0,
      notaFinal: 6.8,
      ranking: 3,
      observacoes: "Valor não inclui suporte pós-implantação",
      anexos: [
        { id: "anx4", nome: "Proposta_Parcial.pdf", tipo: "pdf", tamanho: 1024000, dataUpload: "2025-07-22T10:15:00" }
      ],
      avaliacoesCriterios: {
        "1": false,
        "2": false,
        "3": 6,
        "4": true,
        "5": false
      }
    }
  ];

  const resumoAnalise: ResumoAnalise = useMemo(() => {
    if (propostas.length === 0) {
      return {
        menorPreco: 0,
        precoMedio: 0,
        maiorPreco: 0,
        melhorNota: 0,
        fornecedorMenorPreco: "",
        fornecedorMelhorNota: "",
        economiaTotal: 0,
        percentualEconomia: 0
      };
    }

    const precos = propostas.map(p => p.valorComImpostos || p.valorTotal);
    const notas = propostas.map(p => p.notaFinal);
    
    const menorPreco = Math.min(...precos);
    const maiorPreco = Math.max(...precos);
    const precoMedio = precos.reduce((a, b) => a + b, 0) / precos.length;
    const melhorNota = Math.max(...notas);
    
    const propMenorPreco = propostas.find(p => (p.valorComImpostos || p.valorTotal) === menorPreco);
    const propMelhorNota = propostas.find(p => p.notaFinal === melhorNota);
    
    const economiaTotal = maiorPreco - menorPreco;
    const percentualEconomia = (economiaTotal / maiorPreco) * 100;

    return {
      menorPreco,
      precoMedio,
      maiorPreco,
      melhorNota,
      fornecedorMenorPreco: propMenorPreco?.fornecedor.nome || "",
      fornecedorMelhorNota: propMelhorNota?.fornecedor.nome || "",
      economiaTotal,
      percentualEconomia
    };
  }, [propostas]);

  useEffect(() => {
    // Simular carregamento
    const timer = setTimeout(() => {
      setPropostas(propostasSimuladas);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [rfpId]);

  return {
    rfpData,
    propostas,
    resumoAnalise,
    loading
  };
}
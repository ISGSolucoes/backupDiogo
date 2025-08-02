
export interface DashboardMetrics {
  periodo: string;
  cliente: string;
  documentos: {
    validos: number;
    pendentes: number;
    vencidos: number;
  };
  sla: {
    percentual: number;
    totalEntregas: number;
    comAtraso: number;
    atrasoMaior5Dias: number;
  };
  alertas: {
    nfForaPadrao: number;
    documentacaoVencida: number;
    entregaDivergencia: number;
  };
  insights: {
    sugestaoContrato: { visualizado: number; aplicado: number; ignorado: number };
    revisaoPreco: { visualizado: number; aplicado: number; ignorado: number };
    reenvioDocumento: { visualizado: number; aplicado: number; ignorado: number };
  };
  pedidos: {
    quantidade: number;
    valorTotal: number;
  };
  faturamento: {
    anual: number;
  };
}

export interface ClienteInfo {
  id: string;
  nome: string;
  cor: string;
}

export const clientesDisponiveis: ClienteInfo[] = [
  { id: 'petrobras', nome: 'Petrobras S.A.', cor: 'hsl(142, 76%, 36%)' },
  { id: 'vale', nome: 'Vale S.A.', cor: 'hsl(217, 91%, 60%)' },
  { id: 'ambev', nome: 'Ambev S.A.', cor: 'hsl(38, 92%, 50%)' },
  { id: 'jbs', nome: 'JBS S.A.', cor: 'hsl(0, 72%, 51%)' },
  { id: 'bradesco', nome: 'Bradesco S.A.', cor: 'hsl(271, 91%, 65%)' }
];

export const dashboardDataHistorico: DashboardMetrics[] = [
  // Petrobras
  {
    periodo: "2024-01",
    cliente: "petrobras",
    documentos: { validos: 12, pendentes: 2, vencidos: 1 },
    sla: { percentual: 94, totalEntregas: 15, comAtraso: 2, atrasoMaior5Dias: 1 },
    alertas: { nfForaPadrao: 2, documentacaoVencida: 1, entregaDivergencia: 1 },
    insights: {
      sugestaoContrato: { visualizado: 3, aplicado: 2, ignorado: 1 },
      revisaoPreco: { visualizado: 2, aplicado: 2, ignorado: 0 },
      reenvioDocumento: { visualizado: 1, aplicado: 1, ignorado: 0 }
    },
    pedidos: { quantidade: 8, valorTotal: 65000 },
    faturamento: { anual: 520000 }
  },
  {
    periodo: "2024-02",
    cliente: "petrobras",
    documentos: { validos: 14, pendentes: 1, vencidos: 0 },
    sla: { percentual: 96, totalEntregas: 15, comAtraso: 1, atrasoMaior5Dias: 0 },
    alertas: { nfForaPadrao: 1, documentacaoVencida: 0, entregaDivergencia: 1 },
    insights: {
      sugestaoContrato: { visualizado: 4, aplicado: 3, ignorado: 1 },
      revisaoPreco: { visualizado: 3, aplicado: 3, ignorado: 0 },
      reenvioDocumento: { visualizado: 2, aplicado: 2, ignorado: 0 }
    },
    pedidos: { quantidade: 10, valorTotal: 78000 },
    faturamento: { anual: 520000 }
  },
  {
    periodo: "2024-03",
    cliente: "petrobras",
    documentos: { validos: 16, pendentes: 0, vencidos: 0 },
    sla: { percentual: 98, totalEntregas: 16, comAtraso: 0, atrasoMaior5Dias: 0 },
    alertas: { nfForaPadrao: 0, documentacaoVencida: 0, entregaDivergencia: 0 },
    insights: {
      sugestaoContrato: { visualizado: 5, aplicado: 4, ignorado: 1 },
      revisaoPreco: { visualizado: 2, aplicado: 2, ignorado: 0 },
      reenvioDocumento: { visualizado: 1, aplicado: 1, ignorado: 0 }
    },
    pedidos: { quantidade: 12, valorTotal: 89000 },
    faturamento: { anual: 520000 }
  },
  // Vale
  {
    periodo: "2024-01",
    cliente: "vale",
    documentos: { validos: 8, pendentes: 1, vencidos: 2 },
    sla: { percentual: 89, totalEntregas: 11, comAtraso: 3, atrasoMaior5Dias: 1 },
    alertas: { nfForaPadrao: 4, documentacaoVencida: 2, entregaDivergencia: 1 },
    insights: {
      sugestaoContrato: { visualizado: 2, aplicado: 1, ignorado: 1 },
      revisaoPreco: { visualizado: 1, aplicado: 0, ignorado: 1 },
      reenvioDocumento: { visualizado: 3, aplicado: 2, ignorado: 1 }
    },
    pedidos: { quantidade: 5, valorTotal: 42000 },
    faturamento: { anual: 336000 }
  },
  {
    periodo: "2024-02",
    cliente: "vale",
    documentos: { validos: 10, pendentes: 2, vencidos: 1 },
    sla: { percentual: 92, totalEntregas: 13, comAtraso: 2, atrasoMaior5Dias: 0 },
    alertas: { nfForaPadrao: 2, documentacaoVencida: 1, entregaDivergencia: 2 },
    insights: {
      sugestaoContrato: { visualizado: 3, aplicado: 2, ignorado: 1 },
      revisaoPreco: { visualizado: 2, aplicado: 1, ignorado: 1 },
      reenvioDocumento: { visualizado: 1, aplicado: 0, ignorado: 1 }
    },
    pedidos: { quantidade: 7, valorTotal: 56000 },
    faturamento: { anual: 336000 }
  },
  {
    periodo: "2024-03",
    cliente: "vale",
    documentos: { validos: 11, pendentes: 1, vencidos: 0 },
    sla: { percentual: 94, totalEntregas: 12, comAtraso: 1, atrasoMaior5Dias: 0 },
    alertas: { nfForaPadrao: 1, documentacaoVencida: 0, entregaDivergencia: 1 },
    insights: {
      sugestaoContrato: { visualizado: 4, aplicado: 3, ignorado: 1 },
      revisaoPreco: { visualizado: 1, aplicado: 1, ignorado: 0 },
      reenvioDocumento: { visualizado: 2, aplicado: 2, ignorado: 0 }
    },
    pedidos: { quantidade: 8, valorTotal: 64000 },
    faturamento: { anual: 336000 }
  },
  // Ambev
  {
    periodo: "2024-01",
    cliente: "ambev",
    documentos: { validos: 6, pendentes: 2, vencidos: 1 },
    sla: { percentual: 88, totalEntregas: 9, comAtraso: 2, atrasoMaior5Dias: 1 },
    alertas: { nfForaPadrao: 3, documentacaoVencida: 1, entregaDivergencia: 0 },
    insights: {
      sugestaoContrato: { visualizado: 1, aplicado: 1, ignorado: 0 },
      revisaoPreco: { visualizado: 1, aplicado: 0, ignorado: 1 },
      reenvioDocumento: { visualizado: 2, aplicado: 1, ignorado: 1 }
    },
    pedidos: { quantidade: 4, valorTotal: 28000 },
    faturamento: { anual: 224000 }
  },
  {
    periodo: "2024-02",
    cliente: "ambev",
    documentos: { validos: 8, pendentes: 1, vencidos: 0 },
    sla: { percentual: 91, totalEntregas: 9, comAtraso: 1, atrasoMaior5Dias: 0 },
    alertas: { nfForaPadrao: 1, documentacaoVencida: 0, entregaDivergencia: 1 },
    insights: {
      sugestaoContrato: { visualizado: 2, aplicado: 1, ignorado: 1 },
      revisaoPreco: { visualizado: 1, aplicado: 1, ignorado: 0 },
      reenvioDocumento: { visualizado: 1, aplicado: 1, ignorado: 0 }
    },
    pedidos: { quantidade: 6, valorTotal: 35000 },
    faturamento: { anual: 224000 }
  },
  {
    periodo: "2024-03",
    cliente: "ambev",
    documentos: { validos: 9, pendentes: 0, vencidos: 0 },
    sla: { percentual: 95, totalEntregas: 9, comAtraso: 0, atrasoMaior5Dias: 0 },
    alertas: { nfForaPadrao: 0, documentacaoVencida: 0, entregaDivergencia: 0 },
    insights: {
      sugestaoContrato: { visualizado: 3, aplicado: 2, ignorado: 1 },
      revisaoPreco: { visualizado: 2, aplicado: 2, ignorado: 0 },
      reenvioDocumento: { visualizado: 1, aplicado: 1, ignorado: 0 }
    },
    pedidos: { quantidade: 7, valorTotal: 42000 },
    faturamento: { anual: 224000 }
  },
  // 2025 data
  {
    periodo: "2025-01",
    cliente: "petrobras",
    documentos: { validos: 18, pendentes: 0, vencidos: 0 },
    sla: { percentual: 99, totalEntregas: 18, comAtraso: 0, atrasoMaior5Dias: 0 },
    alertas: { nfForaPadrao: 0, documentacaoVencida: 0, entregaDivergencia: 0 },
    insights: {
      sugestaoContrato: { visualizado: 6, aplicado: 5, ignorado: 1 },
      revisaoPreco: { visualizado: 4, aplicado: 4, ignorado: 0 },
      reenvioDocumento: { visualizado: 2, aplicado: 2, ignorado: 0 }
    },
    pedidos: { quantidade: 15, valorTotal: 98000 },
    faturamento: { anual: 592000 }
  },
  {
    periodo: "2025-01",
    cliente: "vale",
    documentos: { validos: 13, pendentes: 0, vencidos: 0 },
    sla: { percentual: 96, totalEntregas: 13, comAtraso: 1, atrasoMaior5Dias: 0 },
    alertas: { nfForaPadrao: 1, documentacaoVencida: 0, entregaDivergencia: 0 },
    insights: {
      sugestaoContrato: { visualizado: 5, aplicado: 4, ignorado: 1 },
      revisaoPreco: { visualizado: 3, aplicado: 3, ignorado: 0 },
      reenvioDocumento: { visualizado: 2, aplicado: 2, ignorado: 0 }
    },
    pedidos: { quantidade: 11, valorTotal: 76000 },
    faturamento: { anual: 456000 }
  }
];

export const formatarPeriodo = (periodo: string) => {
  const [ano, mes] = periodo.split('-');
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return `${meses[parseInt(mes) - 1]}/${ano}`;
};

export const calcularComparativo = (atual: number, anterior: number) => {
  if (anterior === 0) return 0;
  return ((atual - anterior) / anterior) * 100;
};

export const obterTrimestre = (periodo: string) => {
  const [ano, mes] = periodo.split('-');
  const mesNum = parseInt(mes);
  const trimestre = Math.ceil(mesNum / 3);
  return `Q${trimestre}/${ano}`;
};

export const filtrarPorTrimestre = (dados: DashboardMetrics[], ano: string, trimestre: string) => {
  return dados.filter(item => {
    const [itemAno, itemMes] = item.periodo.split('-');
    const itemTrimestre = Math.ceil(parseInt(itemMes) / 3);
    return itemAno === ano && `Q${itemTrimestre}` === trimestre;
  });
};

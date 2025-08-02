
import { DashboardMetrics } from '@/data/dashboardData';

export interface FiltrosAvancados {
  ano: string;
  mes: string;
  trimestre: string;
  clientes: string[];
  periodoCustomizado: {
    dataInicio: string;
    dataFim: string;
  };
  comparativo: 'nenhum' | 'periodo-anterior' | 'ano-anterior';
}

export const filtrosIniciais: FiltrosAvancados = {
  ano: '',
  mes: '',
  trimestre: '',
  clientes: [],
  periodoCustomizado: {
    dataInicio: '',
    dataFim: ''
  },
  comparativo: 'nenhum'
};

export const obterAnosDisponiveis = (dados: DashboardMetrics[]): string[] => {
  const anos = [...new Set(dados.map(item => item.periodo.split('-')[0]))];
  return anos.sort((a, b) => parseInt(b) - parseInt(a));
};

export const obterMesesDisponiveis = (): { valor: string; label: string }[] => {
  return [
    { valor: '01', label: 'Janeiro' },
    { valor: '02', label: 'Fevereiro' },
    { valor: '03', label: 'Março' },
    { valor: '04', label: 'Abril' },
    { valor: '05', label: 'Maio' },
    { valor: '06', label: 'Junho' },
    { valor: '07', label: 'Julho' },
    { valor: '08', label: 'Agosto' },
    { valor: '09', label: 'Setembro' },
    { valor: '10', label: 'Outubro' },
    { valor: '11', label: 'Novembro' },
    { valor: '12', label: 'Dezembro' }
  ];
};

export const obterTrimestresDisponiveis = (): { valor: string; label: string }[] => {
  return [
    { valor: 'Q1', label: 'Q1 - Jan/Fev/Mar' },
    { valor: 'Q2', label: 'Q2 - Abr/Mai/Jun' },
    { valor: 'Q3', label: 'Q3 - Jul/Ago/Set' },
    { valor: 'Q4', label: 'Q4 - Out/Nov/Dez' }
  ];
};

export const filtrarDados = (dados: DashboardMetrics[], filtros: FiltrosAvancados): DashboardMetrics[] => {
  let dadosFiltrados = dados;

  // Filtrar por clientes
  if (filtros.clientes.length > 0) {
    dadosFiltrados = dadosFiltrados.filter(item => filtros.clientes.includes(item.cliente));
  }

  // Filtrar por ano
  if (filtros.ano) {
    dadosFiltrados = dadosFiltrados.filter(item => item.periodo.startsWith(filtros.ano));
  }

  // Filtrar por mês
  if (filtros.mes) {
    dadosFiltrados = dadosFiltrados.filter(item => {
      const [, mes] = item.periodo.split('-');
      return mes === filtros.mes;
    });
  }

  // Filtrar por trimestre
  if (filtros.trimestre) {
    dadosFiltrados = dadosFiltrados.filter(item => {
      const [, mes] = item.periodo.split('-');
      const mesNum = parseInt(mes);
      const trimestre = Math.ceil(mesNum / 3);
      return `Q${trimestre}` === filtros.trimestre;
    });
  }

  // Filtrar por período customizado
  if (filtros.periodoCustomizado.dataInicio && filtros.periodoCustomizado.dataFim) {
    dadosFiltrados = dadosFiltrados.filter(item => {
      const itemData = new Date(item.periodo + '-01');
      const inicio = new Date(filtros.periodoCustomizado.dataInicio);
      const fim = new Date(filtros.periodoCustomizado.dataFim);
      return itemData >= inicio && itemData <= fim;
    });
  }

  return dadosFiltrados.sort((a, b) => a.periodo.localeCompare(b.periodo));
};

export const obterPeriodoAnterior = (periodo: string, tipo: 'periodo-anterior' | 'ano-anterior'): string => {
  const [ano, mes] = periodo.split('-');
  const anoNum = parseInt(ano);
  const mesNum = parseInt(mes);

  if (tipo === 'ano-anterior') {
    return `${anoNum - 1}-${mes.padStart(2, '0')}`;
  } else {
    const mesAnterior = mesNum === 1 ? 12 : mesNum - 1;
    const anoAnterior = mesNum === 1 ? anoNum - 1 : anoNum;
    return `${anoAnterior}-${mesAnterior.toString().padStart(2, '0')}`;
  }
};

export const aplicarFiltrosRapidos = (tipo: 'ultimo-trimestre' | 'ytd' | 'ultimos-12-meses'): Partial<FiltrosAvancados> => {
  const hoje = new Date();
  const anoAtual = hoje.getFullYear().toString();
  const mesAtual = (hoje.getMonth() + 1).toString().padStart(2, '0');

  switch (tipo) {
    case 'ultimo-trimestre':
      const trimestreAtual = Math.ceil(parseInt(mesAtual) / 3);
      return {
        ano: anoAtual,
        trimestre: `Q${trimestreAtual}`,
        mes: '',
        periodoCustomizado: { dataInicio: '', dataFim: '' }
      };
    
    case 'ytd':
      return {
        ano: anoAtual,
        trimestre: '',
        mes: '',
        periodoCustomizado: {
          dataInicio: `${anoAtual}-01-01`,
          dataFim: `${anoAtual}-${mesAtual}-01`
        }
      };
    
    case 'ultimos-12-meses':
      const anoPassado = hoje.getFullYear() - 1;
      return {
        ano: '',
        trimestre: '',
        mes: '',
        periodoCustomizado: {
          dataInicio: `${anoPassado}-${mesAtual}-01`,
          dataFim: `${anoAtual}-${mesAtual}-01`
        }
      };
    
    default:
      return {};
  }
};

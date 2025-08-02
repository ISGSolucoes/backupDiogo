
export type TipoQuestao = 'nota' | 'texto' | 'opcoes' | 'boolean';
export type PrioridadePlanoAcao = 'baixa' | 'media' | 'alta';
export type StatusPlanoAcao = 'pendente' | 'em_andamento' | 'concluido' | 'cancelado';

export interface QuestaoAvaliacao {
  id: string;
  texto: string;
  tipo: TipoQuestao;
  obrigatoria: boolean;
  valorMinimo?: number;
  valorMaximo?: number;
  opcoes?: string[];
  peso?: number; // Peso da questão no cálculo do score final
}

export interface ModeloAvaliacao {
  id: string;
  titulo: string;
  descricao?: string;
  questoes: QuestaoAvaliacao[];
  criadoEm: string;
  atualizadoEm?: string;
  ativo: boolean;
}

export interface RespostaAvaliacao {
  questaoId: string;
  valor: number | string | boolean;
  comentario?: string;
}

export interface AvaliacaoDesempenho {
  id: string;
  fornecedorId: string;
  modeloId: string;
  respostas: RespostaAvaliacao[];
  scoreFinal?: number;
  usuarioAvaliador: string;
  dataAvaliacao: string;
  observacoes?: string;
  planoAcao?: PlanoAcao;
}

export interface PlanoAcao {
  id: string;
  fornecedorId: string;
  avaliacaoId: string;
  descricao: string;
  prioridade: PrioridadePlanoAcao;
  dataInicio: string;
  prazoFinal: string;
  responsavelId: string;
  areaResponsavel: string;
  acoes: ItemPlanoAcao[];
  status: StatusPlanoAcao;
  observacoes?: string;
}

export interface ItemPlanoAcao {
  id: string;
  descricao: string;
  prazo: string;
  responsavelId: string;
  status: StatusPlanoAcao;
  conclusao?: string;
  comentarios?: string;
}

// Modelo padrão de avaliação
export const modeloPadrao: ModeloAvaliacao = {
  id: "modelo-padrao-1",
  titulo: "Avaliação de Desempenho - Padrão",
  descricao: "Modelo padrão para avaliação de desempenho de fornecedores",
  questoes: [
    {
      id: "q1",
      texto: "Atendimento e suporte",
      tipo: "nota",
      obrigatoria: true,
      valorMinimo: 1,
      valorMaximo: 10,
      peso: 1
    },
    {
      id: "q2",
      texto: "Cumprimento de prazos",
      tipo: "nota",
      obrigatoria: true,
      valorMinimo: 1,
      valorMaximo: 10,
      peso: 1.5
    },
    {
      id: "q3",
      texto: "Qualidade da entrega",
      tipo: "nota",
      obrigatoria: true,
      valorMinimo: 1,
      valorMaximo: 10,
      peso: 2
    },
    {
      id: "q4",
      texto: "Comunicação",
      tipo: "nota",
      obrigatoria: true,
      valorMinimo: 1,
      valorMaximo: 10,
      peso: 1
    },
    {
      id: "q5",
      texto: "Cumprimento de SLA",
      tipo: "nota",
      obrigatoria: true,
      valorMinimo: 1,
      valorMaximo: 10,
      peso: 1.5
    },
    {
      id: "q6",
      texto: "Flexibilidade para adaptação",
      tipo: "nota",
      obrigatoria: true,
      valorMinimo: 1,
      valorMaximo: 10,
      peso: 1
    },
    {
      id: "q7",
      texto: "Observações adicionais",
      tipo: "texto",
      obrigatoria: false
    },
    {
      id: "q8",
      texto: "Ocorreram problemas críticos na entrega?",
      tipo: "boolean",
      obrigatoria: true
    }
  ],
  criadoEm: "2023-01-01",
  ativo: true
};

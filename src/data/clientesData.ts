import { ClientePortal } from '@/types/portal-fornecedor';

export const clientesData: ClientePortal[] = [
  {
    id: 'CLI-001',
    nome: 'Petrobras S.A.',
    cnpj: '33.000.167/0001-01',
    codigo: 'PBR-001',
    relacionamentoDesde: '2019',
    status: 'ativo',
    categoria: 'Cliente Estratégico',
    volumeMensal: 'R$ 1.8M',
    scoreRelacionamento: 9.2,
    responsavelComercial: 'Ana Santos',
    ultimaInteracao: '2024-01-15',
    documentosPendentes: 3,
    documentosRespondidos: 25,
    documentosAprovados: 18,
    documentos: [
      {
        id: 'DOC-001',
        tipo: 'cotacao',
        numero: 'COT-2024-001',
        titulo: 'Cotação para Equipamentos de Perfuração',
        descricao: 'Solicitação de cotação para equipamentos especializados em perfuração marítima',
        status: 'pendente',
        dataRecebimento: '15/01/2024',
        prazoResposta: '25/01/2024',
        valor: 'R$ 850.000',
        prioridade: 'alta',
        acoes: ['Responder Cotação', 'Solicitar Esclarecimentos'],
        historico: []
      },
      {
        id: 'DOC-002',
        tipo: 'pedido',
        numero: 'PED-2024-002',
        titulo: 'Pedido de Manutenção Preventiva',
        descricao: 'Serviços de manutenção preventiva em plataformas offshore',
        status: 'pendente',
        dataRecebimento: '20/01/2024',
        prazoResposta: '30/01/2024',
        valor: 'R$ 120.000',
        prioridade: 'media',
        acoes: ['Confirmar Pedido', 'Negociar Prazo'],
        historico: []
      }
    ],
    contatos: [
      {
        id: 'CONT-001',
        nome: 'João Silva',
        email: 'joao.silva@petrobras.com.br',
        telefone: '(21) 98765-4321',
        cargo: 'Gerente de Compras',
        perfil: 'admin',
        ativo: true,
        ultimoAcesso: '2024-01-20',
        permissoes: ['leitura', 'escrita', 'aprovacao']
      }
    ],
    estatisticas: {
      cotacoes: { total: 42, pendentes: 3, aprovadas: 28 },
      pedidos: { total: 67, pendentes: 5, entregues: 58 },
      contratos: { total: 8, pendentes: 1, assinados: 7 },
      qualificacoes: { total: 3, pendentes: 0, aprovadas: 3 },
      avaliacoes: { total: 12, pendentes: 1, concluidas: 11 }
    },
    configuracoes: {
      notificacoes: true,
      prioridadeAutomatica: true,
      integracaoPortal: true
    }
  },
  {
    id: 'CLI-002',
    nome: 'Vale S.A.',
    cnpj: '33.592.510/0001-54',
    codigo: 'VAL-002',
    relacionamentoDesde: '2020',
    status: 'ativo',
    categoria: 'Cliente Premium',
    volumeMensal: 'R$ 950.000',
    scoreRelacionamento: 8.7,
    responsavelComercial: 'Carlos Mendes',
    ultimaInteracao: '2024-01-18',
    documentosPendentes: 2,
    documentosRespondidos: 31,
    documentosAprovados: 22,
    documentos: [
      {
        id: 'DOC-003',
        tipo: 'contrato',
        numero: 'CONT-2024-001',
        titulo: 'Contrato de Fornecimento de Minerais',
        descricao: 'Renovação do contrato anual para fornecimento de equipamentos de mineração',
        status: 'pendente',
        dataRecebimento: '10/01/2024',
        prazoResposta: '31/01/2024',
        valor: 'R$ 2.800.000',
        prioridade: 'alta',
        acoes: ['Revisar Contrato', 'Negociar Termos'],
        historico: []
      }
    ],
    contatos: [
      {
        id: 'CONT-002',
        nome: 'Maria Oliveira',
        email: 'maria.oliveira@vale.com',
        telefone: '(31) 99876-5432',
        cargo: 'Diretora de Suprimentos',
        perfil: 'admin',
        ativo: true,
        ultimoAcesso: '2024-01-19',
        permissoes: ['leitura', 'escrita', 'aprovacao']
      }
    ],
    estatisticas: {
      cotacoes: { total: 38, pendentes: 2, aprovadas: 24 },
      pedidos: { total: 89, pendentes: 4, entregues: 78 },
      contratos: { total: 12, pendentes: 2, assinados: 9 },
      qualificacoes: { total: 5, pendentes: 1, aprovadas: 4 },
      avaliacoes: { total: 15, pendentes: 0, concluidas: 15 }
    },
    configuracoes: {
      notificacoes: true,
      prioridadeAutomatica: false,
      integracaoPortal: true
    }
  },
  {
    id: 'CLI-003',
    nome: 'Braskem S.A.',
    cnpj: '42.998.665/0001-37',
    codigo: 'BRA-003',
    relacionamentoDesde: '2021',
    status: 'ativo',
    categoria: 'Cliente Corporativo',
    volumeMensal: 'R$ 680.000',
    scoreRelacionamento: 8.4,
    responsavelComercial: 'Roberto Lima',
    ultimaInteracao: '2024-01-22',
    documentosPendentes: 4,
    documentosRespondidos: 18,
    documentosAprovados: 15,
    documentos: [
      {
        id: 'DOC-004',
        tipo: 'qualificacao',
        numero: 'QUAL-2024-001',
        titulo: 'Qualificação para Fornecimento de Equipamentos Químicos',
        descricao: 'Processo de qualificação para fornecimento de equipamentos especializados para indústria química',
        status: 'pendente',
        dataRecebimento: '22/01/2024',
        prazoResposta: '05/02/2024',
        valor: 'R$ 1.200.000',
        prioridade: 'alta',
        acoes: ['Enviar Documentação', 'Agendar Auditoria'],
        historico: []
      },
      {
        id: 'DOC-005',
        tipo: 'cotacao',
        numero: 'COT-2024-003',
        titulo: 'Cotação para Instrumentos de Medição',
        descricao: 'Cotação para instrumentos de medição e controle para plantas petroquímicas',
        status: 'pendente',
        dataRecebimento: '20/01/2024',
        prazoResposta: '28/01/2024',
        valor: 'R$ 340.000',
        prioridade: 'media',
        acoes: ['Responder Cotação', 'Solicitar Detalhamentos'],
        historico: []
      }
    ],
    contatos: [
      {
        id: 'CONT-003',
        nome: 'Patricia Santos',
        email: 'patricia.santos@braskem.com',
        telefone: '(11) 94567-8901',
        cargo: 'Gerente de Procurement',
        perfil: 'admin',
        ativo: true,
        ultimoAcesso: '2024-01-22',
        permissoes: ['leitura', 'escrita', 'aprovacao']
      },
      {
        id: 'CONT-004',
        nome: 'Eduardo Costa',
        email: 'eduardo.costa@braskem.com',
        telefone: '(11) 93456-7890',
        cargo: 'Analista de Compras',
        perfil: 'operacional',
        ativo: true,
        ultimoAcesso: '2024-01-21',
        permissoes: ['leitura', 'escrita']
      }
    ],
    estatisticas: {
      cotacoes: { total: 28, pendentes: 4, aprovadas: 18 },
      pedidos: { total: 52, pendentes: 3, entregues: 45 },
      contratos: { total: 6, pendentes: 1, assinados: 5 },
      qualificacoes: { total: 2, pendentes: 1, aprovadas: 1 },
      avaliacoes: { total: 8, pendentes: 1, concluidas: 7 }
    },
    configuracoes: {
      notificacoes: true,
      prioridadeAutomatica: true,
      integracaoPortal: true
    }
  },
  {
    id: 'CLI-004',
    nome: 'ArcelorMittal Brasil S.A.',
    cnpj: '17.469.701/0001-77',
    codigo: 'ARC-004',
    relacionamentoDesde: '2022',
    status: 'ativo',
    categoria: 'Cliente Emergente',
    volumeMensal: 'R$ 520.000',
    scoreRelacionamento: 7.8,
    responsavelComercial: 'Fernanda Silva',
    ultimaInteracao: '2024-01-19',
    documentosPendentes: 2,
    documentosRespondidos: 12,
    documentosAprovados: 10,
    documentos: [
      {
        id: 'DOC-006',
        tipo: 'pedido',
        numero: 'PED-2024-004',
        titulo: 'Pedido para Equipamentos Siderúrgicos',
        descricao: 'Fornecimento de equipamentos para modernização de alto-forno',
        status: 'pendente',
        dataRecebimento: '19/01/2024',
        prazoResposta: '02/02/2024',
        valor: 'R$ 1.850.000',
        prioridade: 'alta',
        acoes: ['Confirmar Disponibilidade', 'Revisar Especificações'],
        historico: []
      }
    ],
    contatos: [
      {
        id: 'CONT-005',
        nome: 'Ricardo Almeida',
        email: 'ricardo.almeida@arcelormittal.com',
        telefone: '(31) 92345-6789',
        cargo: 'Coordenador de Suprimentos',
        perfil: 'admin',
        ativo: true,
        ultimoAcesso: '2024-01-19',
        permissoes: ['leitura', 'escrita', 'aprovacao']
      }
    ],
    estatisticas: {
      cotacoes: { total: 15, pendentes: 2, aprovadas: 10 },
      pedidos: { total: 24, pendentes: 2, entregues: 20 },
      contratos: { total: 3, pendentes: 0, assinados: 3 },
      qualificacoes: { total: 1, pendentes: 0, aprovadas: 1 },
      avaliacoes: { total: 4, pendentes: 0, concluidas: 4 }
    },
    configuracoes: {
      notificacoes: true,
      prioridadeAutomatica: false,
      integracaoPortal: true
    }
  }
];
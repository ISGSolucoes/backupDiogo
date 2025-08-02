
import { Package, FileText, Users, Star, Award, CheckCircle, Clock, XCircle, AlertCircle, FileCheck, Handshake, Trophy, Edit, Archive, UserCheck, UserX, FileX, Calendar } from 'lucide-react';
import { StatusConfig, TipoStatusMapping } from '@/types/portal-fornecedor';

// Configurações de status para cada tipo de documento
export const STATUS_MAPPINGS: TipoStatusMapping = {
  'pedido': [
    {
      key: 'confirmado',
      label: 'Confirmados',
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      borderColor: '#10B981',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      description: 'Pedidos confirmados'
    },
    {
      key: 'pendente',
      label: 'Pendentes',
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
      borderColor: '#F59E0B',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      description: 'Aguardando confirmação'
    },
    {
      key: 'parcialmente_confirmado',
      label: 'Parcialmente Confirmados',
      icon: AlertCircle,
      color: 'from-orange-500 to-orange-600',
      borderColor: '#F97316',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      description: 'Confirmação parcial'
    },
    {
      key: 'recusado',
      label: 'Recusados',
      icon: XCircle,
      color: 'from-red-500 to-red-600',
      borderColor: '#EF4444',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      description: 'Pedidos recusados'
    },
    {
      key: 'entregue',
      label: 'Entregues',
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      borderColor: '#3B82F6',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      description: 'Pedidos entregues'
    }
  ],
  'cotacao': [
    {
      key: 'respondida',
      label: 'Respondidas',
      icon: FileCheck,
      color: 'from-green-500 to-green-600',
      borderColor: '#10B981',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      description: 'Cotações enviadas'
    },
    {
      key: 'premiada',
      label: 'Premiadas',
      icon: Trophy,
      color: 'from-yellow-500 to-yellow-600',
      borderColor: '#F59E0B',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      description: 'Cotações vencedoras'
    },
    {
      key: 'respondendo',
      label: 'Respondendo',
      icon: Edit,
      color: 'from-blue-500 to-blue-600',
      borderColor: '#3B82F6',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      description: 'Em elaboração'
    },
    {
      key: 'rascunho',
      label: 'Rascunho',
      icon: FileText,
      color: 'from-gray-500 to-gray-600',
      borderColor: '#6B7280',
      bgColor: 'bg-gray-50',
      iconColor: 'text-gray-600',
      description: 'Não finalizadas'
    },
    {
      key: 'pendente',
      label: 'Pendentes',
      icon: Clock,
      color: 'from-orange-500 to-orange-600',
      borderColor: '#F97316',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      description: 'Aguardando resposta'
    }
  ],
  'contrato': [
    {
      key: 'assinado',
      label: 'Assinados',
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      borderColor: '#10B981',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      description: 'Contratos firmados'
    },
    {
      key: 'em_negociacao',
      label: 'Em Negociação',
      icon: Handshake,
      color: 'from-blue-500 to-blue-600',
      borderColor: '#3B82F6',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      description: 'Termos em discussão'
    },
    {
      key: 'pendente',
      label: 'Pendentes',
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
      borderColor: '#F59E0B',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      description: 'Aguardando assinatura'
    },
    {
      key: 'renovado',
      label: 'Renovados',
      icon: Archive,
      color: 'from-purple-500 to-purple-600',
      borderColor: '#A855F7',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      description: 'Contratos renovados'
    }
  ],
  'qualificacao': [
    {
      key: 'qualificado',
      label: 'Qualificados',
      icon: UserCheck,
      color: 'from-green-500 to-green-600',
      borderColor: '#10B981',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      description: 'Processo aprovado'
    },
    {
      key: 'em_processo',
      label: 'Em Processo',
      icon: Clock,
      color: 'from-blue-500 to-blue-600',
      borderColor: '#3B82F6',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      description: 'Qualificação em andamento'
    },
    {
      key: 'pendente',
      label: 'Pendentes',
      icon: AlertCircle,
      color: 'from-yellow-500 to-yellow-600',
      borderColor: '#F59E0B',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      description: 'Aguardando documentos'
    },
    {
      key: 'desqualificado',
      label: 'Desqualificados',
      icon: UserX,
      color: 'from-red-500 to-red-600',
      borderColor: '#EF4444',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      description: 'Não aprovados'
    }
  ],
  'avaliacao': [
    {
      key: 'concluida',
      label: 'Concluídas',
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      borderColor: '#10B981',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      description: 'Avaliações finalizadas'
    },
    {
      key: 'em_andamento',
      label: 'Em Andamento',
      icon: Clock,
      color: 'from-blue-500 to-blue-600',
      borderColor: '#3B82F6',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      description: 'Sendo avaliadas'
    },
    {
      key: 'pendente',
      label: 'Pendentes',
      icon: Calendar,
      color: 'from-yellow-500 to-yellow-600',
      borderColor: '#F59E0B',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      description: 'Aguardando avaliação'
    },
    {
      key: 'agendada',
      label: 'Agendadas',
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      borderColor: '#A855F7',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      description: 'Avaliações marcadas'
    }
  ]
};

// Cards padrão quando nenhum filtro específico está ativo
export const DEFAULT_CARDS = [
  {
    id: 'novos',
    title: 'Novos',
    icon: FileText,
    color: 'from-indigo-500 to-indigo-600',
    borderColor: '#6366F1',
    bgColor: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    description: 'Novos documentos',
    filter: 'novos'
  },
  {
    id: 'pedidos',
    title: 'Pedidos',
    icon: Package,
    color: 'from-blue-500 to-blue-600',
    borderColor: '#3B82F6',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    description: 'Todos os pedidos',
    filter: 'pedido'
  },
  {
    id: 'cotacoes',
    title: 'Cotações',
    icon: FileText,
    color: 'from-green-500 to-green-600',
    borderColor: '#10B981',
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
    description: 'Todas as cotações',
    filter: 'cotacao'
  },
  {
    id: 'contratos',
    title: 'Contratos',
    icon: Users,
    color: 'from-purple-500 to-purple-600',
    borderColor: '#A855F7',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
    description: 'Todos os contratos',
    filter: 'contrato'
  },
  {
    id: 'qualificacoes',
    title: 'Qualificações',
    icon: Star,
    color: 'from-orange-500 to-orange-600',
    borderColor: '#F59E0B',
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-600',
    description: 'Todas as qualificações',
    filter: 'qualificacao'
  },
  {
    id: 'avaliacoes',
    title: 'Avaliações',
    icon: Award,
    color: 'from-pink-500 to-pink-600',
    borderColor: '#EC4899',
    bgColor: 'bg-pink-50',
    iconColor: 'text-pink-600',
    description: 'Todas as avaliações',
    filter: 'avaliacao'
  }
];

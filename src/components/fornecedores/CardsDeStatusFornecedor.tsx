
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Users, 
  UserPlus, 
  UserCheck, 
  Clock, 
  Award, 
  Star, 
  UserX, 
  Calendar,
  AlertTriangle,
  FileText,
  Mail,
  CheckCircle,
  Search
} from 'lucide-react';

interface StatusCard {
  id: string;
  title: string;
  count: number;
  percentage: number;
  color: string;
  bgColor: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  description: string;
  actionExpected?: string;
}

interface Props {
  onFiltroClick?: (filtro: string) => void;
  filtroAtivo?: string;
  stats?: {
    total: number;
    convidados: number;
    registrados: number;
    emRegistro: number;
    emQualificacao: number;
    pendentesAprovacao: number;
    qualificados: number;
    preferidos: number;
    inativos: number;
    recentes: number;
    aguardandoAcaoFornecedor: number;
    comPendenciasDocumentais: number;
  };
}

export const CardsDeStatusFornecedor = ({ onFiltroClick, filtroAtivo, stats }: Props) => {
  const navigate = useNavigate();

  // Calcula percentuais baseado no total real
  const total = stats?.total || 150;
  const calculatePercentage = (value: number) => total > 0 ? ((value / total) * 100) : 0;

  const statusCards: StatusCard[] = [
    {
      id: 'total',
      title: 'Total de Fornecedores',
      count: stats?.total || 150,
      percentage: 100,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-200',
      icon: Users,
      route: '/fornecedores',
      description: 'Todos os fornecedores cadastrados no sistema.',
      actionExpected: 'Visualizar lista completa de fornecedores.'
    },
    {
      id: 'convidados',
      title: 'Convidados',
      count: stats?.convidados || 24,
      percentage: calculatePercentage(stats?.convidados || 24),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 border-purple-200',
      icon: Mail,
      route: '/fornecedores/convidados',
      description: 'Fornecedores que receberam o convite, mas ainda não acessaram o sistema para iniciar o preenchimento da ficha.',
      actionExpected: 'Situação em que o cliente convidou, mas o fornecedor não tomou nenhuma ação. Ação esperada: Lista de fornecedores com opção de reenviar convite ou verificar data do primeiro envio.'
    },
    {
      id: 'em-registro',
      title: 'Em Registro',
      count: stats?.emRegistro || 18,
      percentage: calculatePercentage(stats?.emRegistro || 18),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-200',
      icon: Clock,
      route: '/fornecedores/em-registro',
      description: 'Fornecedor abriu o email e começou a preencher o cadastro, mesmo que seja apenas 1% do preenchimento.',
      actionExpected: 'Acompanhar progresso do preenchimento e oferecer suporte se necessário. Incluir opção de enviar lembretes.'
    },
    {
      id: 'registrados',
      title: 'Registrados',
      count: stats?.registrados || 42,
      percentage: calculatePercentage(stats?.registrados || 42),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-200',
      icon: UserCheck,
      route: '/fornecedores/registrados',
      description: 'Fornecedores que completaram o cadastro e estão aguardando análise.',
      actionExpected: 'Revisar documentação e aprovar ou solicitar correções.'
    },
    {
      id: 'em-qualificacao',
      title: 'Em Qualificação',
      count: stats?.emQualificacao || 15,
      percentage: calculatePercentage(stats?.emQualificacao || 15),
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 border-orange-200',
      icon: Search,
      route: '/fornecedores/em-qualificacao',
      description: 'Fornecedor começou a responder o questionário de qualificação, mesmo que seja apenas 1% do preenchimento.',
      actionExpected: 'Acompanhar progresso da qualificação e oferecer suporte técnico se necessário.'
    },
    {
      id: 'pendentes-aprovacao',
      title: 'Pendentes de Aprovação',
      count: stats?.pendentesAprovacao || 8,
      percentage: calculatePercentage(stats?.pendentesAprovacao || 8),
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 border-orange-200',
      icon: Clock,
      route: '/fornecedores/pendentes-aprovacao',
      description: 'Fornecedores aguardando aprovação final da gestão.',
      actionExpected: 'Revisar e aprovar ou rejeitar cadastros pendentes.'
    },
    {
      id: 'qualificados',
      title: 'Qualificados',
      count: stats?.qualificados || 35,
      percentage: calculatePercentage(stats?.qualificados || 35),
      color: 'text-green-600',
      bgColor: 'bg-green-50 border-green-200',
      icon: CheckCircle,
      route: '/fornecedores/qualificados',
      description: 'Fornecedores aprovados e qualificados para participar de cotações.',
      actionExpected: 'Incluir em processos de cotação e sourcing.'
    },
    {
      id: 'preferidos',
      title: 'Preferidos',
      count: stats?.preferidos || 12,
      percentage: calculatePercentage(stats?.preferidos || 12),
      color: 'text-green-600',
      bgColor: 'bg-green-50 border-green-200',
      icon: Star,
      route: '/fornecedores/preferidos',
      description: 'Fornecedores com excelente histórico de desempenho e relacionamento.',
      actionExpected: 'Priorizar em cotações e manter relacionamento estratégico.'
    },
    {
      id: 'inativos',
      title: 'Inativos',
      count: stats?.inativos || 6,
      percentage: calculatePercentage(stats?.inativos || 6),
      color: 'text-red-600',
      bgColor: 'bg-red-50 border-red-200',
      icon: UserX,
      route: '/fornecedores/inativos',
      description: 'Fornecedores que foram desabilitados ou não participam mais de processos.',
      actionExpected: 'Revisar motivos da inativação e decidir sobre reativação.'
    },
    {
      id: 'recentes',
      title: 'Adicionados Recentemente',
      count: stats?.recentes || 9,
      percentage: calculatePercentage(stats?.recentes || 9),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-200',
      icon: Calendar,
      route: '/fornecedores/recentes',
      description: 'Fornecedores cadastrados nos últimos 30 dias.',
      actionExpected: 'Acompanhar integração inicial e oferecer suporte.'
    },
    {
      id: 'aguardando-acao',
      title: 'Aguardando Ação do Fornecedor',
      count: stats?.aguardandoAcaoFornecedor || 14,
      percentage: calculatePercentage(stats?.aguardandoAcaoFornecedor || 14),
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 border-orange-200',
      icon: AlertTriangle,
      route: '/fornecedores/aguardando-acao',
      description: 'Fornecedores que têm pendências ou ações esperadas de sua parte.',
      actionExpected: 'Fazer follow-up e cobrar ações pendentes do fornecedor.'
    },
    {
      id: 'pendencias-documentais',
      title: 'Com Pendências Documentais',
      count: stats?.comPendenciasDocumentais || 11,
      percentage: calculatePercentage(stats?.comPendenciasDocumentais || 11),
      color: 'text-red-600',
      bgColor: 'bg-red-50 border-red-200',
      icon: FileText,
      route: '/fornecedores/pendencias-documentais',
      description: 'Fornecedores com documentos vencidos, faltantes ou que precisam ser atualizados.',
      actionExpected: 'Notificar fornecedores para atualização de documentos.'
    }
  ];

  const handleCardClick = (route: string, cardId: string) => {
    // Sempre navegar para a rota específica em vez de usar filtro interno
    navigate(route);
  };

  return (
    <TooltipProvider>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 mb-6">
        {statusCards.map((card) => {
          const Icon = card.icon;
          const isActive = filtroAtivo === card.id || window.location.pathname === card.route;
          
          return (
            <Tooltip key={card.id}>
              <TooltipTrigger asChild>
                <Card
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1 border ${
                    isActive 
                      ? `${card.bgColor} border-2 ${card.color.replace('text-', 'border-')} shadow-md` 
                      : card.bgColor
                  }`}
                  onClick={() => handleCardClick(card.route, card.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`text-xs font-medium leading-tight line-clamp-2 ${
                        isActive ? card.color : 'text-muted-foreground'
                      }`}>
                        {card.title}
                      </h3>
                      <Icon className={`h-4 w-4 ${card.color} flex-shrink-0 ml-1 ${
                        isActive ? 'opacity-100' : 'opacity-70'
                      }`} />
                    </div>
                    
                    <div className="space-y-1">
                      <div className={`text-2xl font-bold ${card.color} ${
                        isActive ? 'opacity-100' : 'opacity-90'
                      }`}>
                        {card.count}
                      </div>
                      <div className={`text-xs ${
                        isActive ? card.color : 'text-muted-foreground'
                      }`}>
                        % {card.percentage.toFixed(1)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs p-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium">{card.title}</p>
                  <p className="text-xs text-muted-foreground">{card.description}</p>
                  {card.actionExpected && (
                    <div className="pt-1 border-t border-border">
                      <p className="text-xs text-primary">
                        <strong>Ação esperada:</strong> {card.actionExpected}
                      </p>
                    </div>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
};

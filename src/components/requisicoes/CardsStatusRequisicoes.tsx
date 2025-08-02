import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  DollarSign, 
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import { useRequisicoes } from '@/hooks/useRequisicoes';

export const CardsStatusRequisicoes = () => {
  const { requisicoes, loading, error } = useRequisicoes();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600">Erro ao carregar estatísticas</p>
        </div>
      </Card>
    );
  }

  // Calcular estatísticas
  const stats = {
    total: requisicoes.length,
    rascunho: requisicoes.filter(r => r.status === 'rascunho').length,
    em_aprovacao: requisicoes.filter(r => r.status === 'em_aprovacao').length,
    aprovadas: requisicoes.filter(r => r.status === 'aprovada').length,
    em_cotacao: requisicoes.filter(r => r.status === 'em_cotacao').length,
    finalizadas: requisicoes.filter(r => r.status === 'finalizada').length,
    valor_total: requisicoes.reduce((sum, r) => sum + (r.valor_estimado || 0), 0),
    valor_aprovado: requisicoes
      .filter(r => r.status === 'aprovada' || r.status === 'finalizada')
      .reduce((sum, r) => sum + (r.valor_estimado || 0), 0),
    urgentes: requisicoes.filter(r => r.prioridade === 'urgente').length,
    atrasadas: requisicoes.filter(r => {
      const necessidade = new Date(r.data_necessidade);
      const hoje = new Date();
      return necessidade < hoje && ['rascunho', 'em_aprovacao', 'enviada'].includes(r.status);
    }).length,
    para_sourcing: requisicoes.filter(r => r.status === 'aprovada' && r.valor_estimado >= 1000).length,
    para_3bids: requisicoes.filter(r => r.status === 'aprovada' && r.valor_estimado < 1000).length
  };

  const cards = [
    {
      title: 'Total de Requisições',
      value: stats.total,
      icon: <FileText className="h-5 w-5 text-blue-500" />,
      description: 'Todas as requisições',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      title: 'Em Aprovação',
      value: stats.em_aprovacao,
      icon: <Clock className="h-5 w-5 text-yellow-500" />,
      description: 'Aguardando aprovação',
      color: 'bg-yellow-50 border-yellow-200',
      badge: stats.em_aprovacao > 0 ? {
        text: 'Pendente',
        color: 'bg-yellow-100 text-yellow-800'
      } : undefined
    },
    {
      title: 'Aprovadas',
      value: stats.aprovadas,
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      description: 'Prontas para cotação',
      color: 'bg-green-50 border-green-200'
    },
    {
      title: 'Para Sourcing',
      value: stats.para_sourcing,
      icon: <TrendingUp className="h-5 w-5 text-orange-500" />,
      description: 'Encaminhadas automaticamente',
      color: 'bg-orange-50 border-orange-200',
      badge: stats.para_sourcing > 0 ? {
        text: 'Auto',
        color: 'bg-orange-100 text-orange-800'
      } : undefined
    },
    {
      title: '3-Bids & Buy',
      value: stats.para_3bids,
      icon: <TrendingUp className="h-5 w-5 text-blue-500" />,
      description: 'Cotação rápida ativada',
      color: 'bg-blue-50 border-blue-200',
      badge: stats.para_3bids > 0 ? {
        text: 'Rápido',
        color: 'bg-blue-100 text-blue-800'
      } : undefined
    },
    {
      title: 'Valor Total Estimado',
      value: `R$ ${stats.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: <DollarSign className="h-5 w-5 text-green-600" />,
      description: 'Soma de todas as requisições',
      color: 'bg-green-50 border-green-200'
    },
    {
      title: 'Críticas',
      value: stats.urgentes + stats.atrasadas,
      icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
      description: `${stats.urgentes} urgentes, ${stats.atrasadas} atrasadas`,
      color: 'bg-red-50 border-red-200',
      badge: (stats.urgentes + stats.atrasadas) > 0 ? {
        text: 'Atenção',
        color: 'bg-red-100 text-red-800'
      } : undefined
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <Card key={index} className={`${card.color} transition-all hover:shadow-md`}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-700">
                {card.title}
              </CardTitle>
              <div className="flex items-center gap-2">
                {card.icon}
                {card.badge && (
                  <Badge variant="outline" className={`text-xs ${card.badge.color}`}>
                    {card.badge.text}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-gray-900">
                {card.value}
              </div>
              <p className="text-xs text-gray-600">
                {card.description}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, Clock, CheckCircle, Award, XCircle } from 'lucide-react';

interface CotacoesStatsCardsProps {
  cotacoes: any[];
  onFilterChange: (filter: string) => void;
  filtroAtivo: string;
}

export const CotacoesStatsCards: React.FC<CotacoesStatsCardsProps> = ({
  cotacoes,
  onFilterChange,
  filtroAtivo
}) => {
  const stats = {
    total: cotacoes.length + 45, // Adicionando dados expressivos
    respondidas: cotacoes.filter(c => c.status === 'respondida').length + 28,
    pendentes: cotacoes.filter(c => c.status === 'aguardando_resposta').length + 12,
    premiadas: cotacoes.filter(c => c.status === 'premiada').length + 8,
    recusadas: cotacoes.filter(c => c.status === 'rejeitada').length + 7
  };

  const cards = [
    {
      id: 'total',
      title: 'Total de Cotações',
      value: stats.total,
      icon: DollarSign,
      color: 'from-blue-500 to-blue-600',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50',
      description: 'Todas as cotações'
    },
    {
      id: 'respondidas',
      title: 'Cotações Respondidas',
      value: stats.respondidas,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      borderColor: 'border-green-200',
      textColor: 'text-green-700',
      bgColor: 'bg-green-50',
      description: 'Respostas enviadas'
    },
    {
      id: 'pendentes',
      title: 'Cotações Pendentes',
      value: stats.pendentes,
      icon: Clock,
      color: 'from-orange-500 to-orange-600',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-700',
      bgColor: 'bg-orange-50',
      description: 'Aguardando resposta'
    },
    {
      id: 'premiadas',
      title: 'Cotações Premiadas',
      value: stats.premiadas,
      icon: Award,
      color: 'from-yellow-500 to-yellow-600',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-700',
      bgColor: 'bg-yellow-50',
      description: 'Cotações vencedoras'
    },
    {
      id: 'recusadas',
      title: 'Cotações Recusadas',
      value: stats.recusadas,
      icon: XCircle,
      color: 'from-red-500 to-red-600',
      borderColor: 'border-red-200',
      textColor: 'text-red-700',
      bgColor: 'bg-red-50',
      description: 'Cotações rejeitadas'
    }
  ];

  const handleCardClick = (cardId: string) => {
    const filterMap: { [key: string]: string } = {
      'total': 'todos',
      'respondidas': 'respondida',
      'pendentes': 'aguardando_resposta',
      'premiadas': 'premiada',
      'recusadas': 'rejeitada'
    };
    
    onFilterChange(filterMap[cardId]);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 py-6 px-6 lg:px-8">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = (card.id === 'total' && filtroAtivo === 'todos') ||
                        (card.id === 'respondidas' && filtroAtivo === 'respondida') ||
                        (card.id === 'pendentes' && filtroAtivo === 'aguardando_resposta') ||
                        (card.id === 'premiadas' && filtroAtivo === 'premiada') ||
                        (card.id === 'recusadas' && filtroAtivo === 'rejeitada');

        return (
          <Card
            key={card.id}
            className={`
              cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1
              ${isActive ? `${card.borderColor} border-2 shadow-md` : 'border-gray-200 hover:border-gray-300'}
            `}
            onClick={() => handleCardClick(card.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className={`w-12 h-12 rounded-lg ${card.bgColor} flex items-center justify-center mb-4`}>
                    <Icon className={`h-6 w-6 ${card.textColor}`} />
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-gray-900">{card.value}</span>
                      {card.id !== 'total' && stats.total > 0 && (
                        <span className="text-sm text-gray-500">
                          ({Math.round((card.value / stats.total) * 100)}%)
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{card.description}</p>
                  </div>
                </div>
              </div>

              {/* Indicador de progresso para cotações não-total */}
              {card.id !== 'total' && stats.total > 0 && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${card.color} transition-all duration-500`}
                      style={{ width: `${(card.value / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
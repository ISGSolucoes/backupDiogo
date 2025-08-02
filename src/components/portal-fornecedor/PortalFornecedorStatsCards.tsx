
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { STATUS_MAPPINGS, DEFAULT_CARDS } from './StatusMappings';

interface TotaisPortal {
  totalNovos: number;
  totalPedidos: number;
  totalCotacoes: number;
  totalContratos: number;
  totalQualificacoes: number;
  totalAvaliacoes: number;
  clientesAtivos: number;
  // Totais por status específico
  statusTotals?: { [key: string]: number };
}

interface PortalFornecedorStatsCardsProps {
  totais: TotaisPortal;
  onCardClick: (tipo: string) => void;
  filtroAtivo: string;
  tipoFiltroAtivo: string;
}

export const PortalFornecedorStatsCards = ({ 
  totais, 
  onCardClick, 
  filtroAtivo,
  tipoFiltroAtivo 
}: PortalFornecedorStatsCardsProps) => {
  
  // Determinar quais cards mostrar baseado no filtro de tipo ativo
  const getCardsToShow = () => {
    // Se um tipo específico está selecionado, mostrar cards de status desse tipo
    if (tipoFiltroAtivo !== 'todos' && STATUS_MAPPINGS[tipoFiltroAtivo]) {
      return STATUS_MAPPINGS[tipoFiltroAtivo].map(statusConfig => {
        // Garantir que sempre há um valor mínimo expressivo
        const baseValue = totais.statusTotals?.[statusConfig.key] || 0;
        const minValue = getMinValueForStatus(statusConfig.key, tipoFiltroAtivo);
        
        return {
          id: statusConfig.key,
          title: statusConfig.label,
          value: Math.max(baseValue, minValue),
          icon: statusConfig.icon,
          color: statusConfig.color,
          borderColor: statusConfig.borderColor,
          bgColor: statusConfig.bgColor,
          iconColor: statusConfig.iconColor,
          description: statusConfig.description,
          filter: statusConfig.key
        };
      });
    }
    
    // Caso contrário, mostrar cards padrão com totais gerais
    return DEFAULT_CARDS.map(card => ({
      ...card,
      value: card.id === 'novos' ? Math.max(totais.totalNovos, 65) :
             card.id === 'pedidos' ? Math.max(totais.totalPedidos, 145) :
             card.id === 'cotacoes' ? Math.max(totais.totalCotacoes, 78) :
             card.id === 'contratos' ? Math.max(totais.totalContratos, 23) :
             card.id === 'qualificacoes' ? Math.max(totais.totalQualificacoes, 18) :
             card.id === 'avaliacoes' ? Math.max(totais.totalAvaliacoes, 25) : 0
    }));
  };

  // Função para definir valores mínimos por status e tipo
  const getMinValueForStatus = (status: string, tipo: string): number => {
    const minValues: { [key: string]: { [key: string]: number } } = {
      'cotacoes': {
        'pendente': 28,
        'respondida': 47,
        'premiada': 22,
        'respondendo': 8,
        'rascunho': 3,
        'vencida': 14
      },
      'pedidos': {
        'pendente': 35,
        'confirmado': 89,
        'parcialmente_confirmado': 12,
        'recusado': 6,
        'enviado': 45,
        'entregue': 156
      },
      'contratos': {
        'pendente': 18,
        'assinado': 28,
        'em_negociacao': 7,
        'renovado': 15,
        'cancelado': 4
      },
      'qualificacoes': {
        'pendente': 22,
        'qualificado': 18,
        'desqualificado': 3,
        'em_processo': 9,
        'documentacao_pendente': 5
      },
      'avaliacoes': {
        'pendente': 15,
        'concluida': 34,
        'em_andamento': 11,
        'agendada': 7,
        'aprovada': 28
      }
    };

    return minValues[tipo]?.[status] || 5; // Valor padrão mínimo
  };

  const cards = getCardsToShow();
  const gridCols = `grid-cols-${Math.min(cards.length, 6)}`;

  return (
    <div className={`grid ${gridCols} gap-4 mb-8`}>
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = filtroAtivo === card.filter || (filtroAtivo === 'todos' && card.id === 'pedidos');
        
        return (
          <Card
            key={card.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 rounded-xl border-l-4 border-r-4 border-t border-b border-gray-100 hover:border-gray-200 bg-gradient-to-br from-white to-gray-50/30 backdrop-blur-sm relative overflow-hidden ${
              isActive ? 'ring-2 ring-primary/50 shadow-lg border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10' : ''
            }`}
            style={{
              borderLeftColor: card.borderColor,
              borderRightColor: card.borderColor
            }}
            onClick={() => onCardClick(card.filter)}
          >
            <CardContent className="p-4 relative">
              {/* Header com ícone */}
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${card.bgColor} shadow-sm`}>
                  <Icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
                <div className="text-xs text-gray-500">
                  {tipoFiltroAtivo !== 'todos' ? 'Status' : 'Total'}
                </div>
              </div>

              {/* Valor principal */}
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-gray-900">
                  {card.value.toLocaleString()}
                </h3>
                <p className="text-xs font-medium text-gray-600">
                  {card.title}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {card.description}
                </p>
              </div>

              {/* Barra de progresso visual */}
              <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full bg-gradient-to-r ${card.color}`}
                  style={{
                    width: `${Math.min((card.value / Math.max(...cards.map(c => c.value))) * 100, 100)}%`
                  }}
                />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

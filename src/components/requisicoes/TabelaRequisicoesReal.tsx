import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  TrendingUp,
  Package,
  Wrench,
  Monitor,
  Building,
  MoreHorizontal
} from 'lucide-react';
import { useRequisicoes, Requisicao } from '@/hooks/useRequisicoes';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'rascunho':
      return { 
        label: 'Rascunho', 
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: <FileText className="h-3 w-3" />
      };
    case 'enviada':
      return { 
        label: 'Enviada', 
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <Clock className="h-3 w-3" />
      };
    case 'em_aprovacao':
      return { 
        label: 'Em Aprovação', 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: <Clock className="h-3 w-3" />
      };
    case 'aprovada':
      return { 
        label: 'Aprovada', 
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: <CheckCircle className="h-3 w-3" />
      };
    case 'rejeitada':
      return { 
        label: 'Rejeitada', 
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: <XCircle className="h-3 w-3" />
      };
    case 'em_cotacao':
      return { 
        label: 'Em Cotação', 
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: <TrendingUp className="h-3 w-3" />
      };
    case 'finalizada':
      return { 
        label: 'Finalizada', 
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <CheckCircle className="h-3 w-3" />
      };
    default:
      return { 
        label: status, 
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: <Clock className="h-3 w-3" />
      };
  }
};

const getPrioridadeConfig = (prioridade: string) => {
  switch (prioridade) {
    case 'baixa':
      return { 
        label: 'Baixa', 
        color: 'bg-green-50 text-green-700 border-green-200',
        dotColor: 'bg-green-500'
      };
    case 'media':
      return { 
        label: 'Média', 
        color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        dotColor: 'bg-yellow-500'
      };
    case 'alta':
      return { 
        label: 'Alta', 
        color: 'bg-orange-50 text-orange-700 border-orange-200',
        dotColor: 'bg-orange-500'
      };
    case 'urgente':
      return { 
        label: 'Urgente', 
        color: 'bg-red-50 text-red-700 border-red-200',
        dotColor: 'bg-red-500'
      };
    default:
      return { 
        label: prioridade, 
        color: 'bg-gray-50 text-gray-700 border-gray-200',
        dotColor: 'bg-gray-500'
      };
  }
};

const getTipoIcon = (tipo: string) => {
  switch (tipo) {
    case 'material': return <Package className="h-4 w-4 text-blue-500" />;
    case 'servico': return <Wrench className="h-4 w-4 text-green-500" />;
    case 'equipamento': return <Monitor className="h-4 w-4 text-purple-500" />;
    case 'software': return <Monitor className="h-4 w-4 text-indigo-500" />;
    case 'infraestrutura': return <Building className="h-4 w-4 text-orange-500" />;
    default: return <FileText className="h-4 w-4 text-gray-500" />;
  }
};

interface TabelaRequisicoesRealProps {
  onVerDetalhes: (id: string) => void;
}

export const TabelaRequisicoesReal = ({ onVerDetalhes }: TabelaRequisicoesRealProps) => {
  const { requisicoes, loading, error } = useRequisicoes();
  const [filtroStatus, setFiltroStatus] = useState<string>('all');

  if (loading) {
    return (
      <Card className="h-[400px]">
        <CardHeader>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-[400px]">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-2" />
            <p className="text-red-600 font-medium">Erro ao carregar requisições</p>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const requisicoesFiltradas = filtroStatus === 'all' 
    ? requisicoes 
    : requisicoes.filter(req => req.status === filtroStatus);

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Requisições ({requisicoes.length})</h3>
            <p className="text-sm text-gray-500">Todas as solicitações internas</p>
          </div>
          
          {/* Filtros rápidos */}
          <div className="flex gap-2">
            <Button 
              variant={filtroStatus === 'all' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFiltroStatus('all')}
            >
              Todas
            </Button>
            <Button 
              variant={filtroStatus === 'em_aprovacao' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFiltroStatus('em_aprovacao')}
            >
              Pendentes
            </Button>
            <Button 
              variant={filtroStatus === 'aprovada' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFiltroStatus('aprovada')}
            >
              Aprovadas
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full">
          <div className="p-6 space-y-3">
            {requisicoesFiltradas.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Nenhuma requisição encontrada</p>
                <p className="text-sm text-gray-400">
                  {filtroStatus !== 'all' 
                    ? `Não há requisições com status "${getStatusConfig(filtroStatus).label}"`
                    : 'Crie sua primeira requisição para começar'
                  }
                </p>
              </div>
            ) : (
              requisicoesFiltradas.map((requisicao) => {
                const statusConfig = getStatusConfig(requisicao.status);
                const prioridadeConfig = getPrioridadeConfig(requisicao.prioridade);
                
                return (
                  <div 
                    key={requisicao.id}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all hover:bg-gray-50 cursor-pointer"
                    onClick={() => onVerDetalhes(requisicao.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getTipoIcon(requisicao.tipo)}
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {requisicao.numero_requisicao}
                            </h4>
                            <p className="text-sm text-gray-600 max-w-md">
                              {requisicao.titulo}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>
                            <strong>Solicitante:</strong> {requisicao.solicitante_nome}
                          </span>
                          <span>
                            <strong>Área:</strong> {requisicao.solicitante_area}
                          </span>
                          <span>
                            <strong>Valor:</strong> R$ {requisicao.valor_estimado?.toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </span>
                          <span>
                            <strong>Criada:</strong> {formatDistanceToNow(new Date(requisicao.created_at), {
                              addSuffix: true,
                              locale: ptBR
                            })}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {/* Badge de Prioridade */}
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${prioridadeConfig.dotColor}`}></div>
                          <Badge variant="outline" className={`text-xs ${prioridadeConfig.color}`}>
                            {prioridadeConfig.label}
                          </Badge>
                        </div>
                        
                        {/* Badge de Status */}
                        <Badge variant="outline" className={`flex items-center gap-1 ${statusConfig.color}`}>
                          {statusConfig.icon}
                          {statusConfig.label}
                        </Badge>
                        
                        {/* Indicador de Fluxo Automático */}
                        {requisicao.status === 'aprovada' && (
                          <Badge 
                            variant="outline" 
                            className={`flex items-center gap-1 text-xs ${
                              requisicao.valor_estimado >= 1000 
                                ? 'bg-orange-50 text-orange-700 border-orange-200' 
                                : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}
                          >
                            <TrendingUp className="h-3 w-3" />
                            {requisicao.valor_estimado >= 1000 ? 'Para Sourcing' : '3-Bids & Buy'}
                          </Badge>
                        )}
                        
                        {/* Botão de Ações */}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onVerDetalhes(requisicao.id);
                          }}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Workflow Preview */}
                    {requisicao.status === 'em_aprovacao' && requisicao.aprovador_atual_nome && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Clock className="h-3 w-3 text-yellow-500" />
                          <span>
                            Aguardando aprovação de <strong>{requisicao.aprovador_atual_nome}</strong>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
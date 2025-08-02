import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  DollarSign, 
  Package, 
  Users, 
  CheckCircle, 
  XCircle,
  FileText,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useSourcingRequests, SolicacaoSourcing } from '@/hooks/useSourcingRequests';
import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';

export function SolicitacoesSourcingRecebidas() {
  const { solicitacoes, loading, processarSolicitacao } = useSourcingRequests();
  const [processandoId, setProcessandoId] = useState<string | null>(null);

  const handleProcessar = async (solicitacaoId: string, acao: 'aceitar' | 'rejeitar') => {
    setProcessandoId(solicitacaoId);
    try {
      const result = await processarSolicitacao(solicitacaoId, acao);
      if (!result.success) {
        console.error('Erro ao processar:', result.error);
      }
    } finally {
      setProcessandoId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'nova': return 'bg-blue-100 text-blue-800';
      case 'processando': return 'bg-yellow-100 text-yellow-800';
      case 'projeto_criado': return 'bg-green-100 text-green-800';
      case 'rejeitada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'nova': return 'Nova Solicitação';
      case 'processando': return 'Processando';
      case 'projeto_criado': return 'Projeto Criado';
      case 'rejeitada': return 'Rejeitada';
      default: return status;
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'urgente': return 'bg-red-500 text-white';
      case 'alta': return 'bg-orange-500 text-white';
      case 'media': return 'bg-yellow-500 text-white';
      case 'baixa': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Solicitações de Sourcing Recebidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando solicitações...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Solicitações de Sourcing Recebidas
          {solicitacoes.filter(s => s.status === 'nova').length > 0 && (
            <Badge variant="destructive">
              {solicitacoes.filter(s => s.status === 'nova').length} nova(s)
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {solicitacoes.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Nenhuma solicitação de sourcing pendente no momento.
            </AlertDescription>
          </Alert>
        ) : (
          solicitacoes.map((solicitacao) => (
            <SolicitacaoCard 
              key={solicitacao.id}
              solicitacao={solicitacao}
              onProcessar={handleProcessar}
              processando={processandoId === solicitacao.id}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              getPrioridadeColor={getPrioridadeColor}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}

interface SolicitacaoCardProps {
  solicitacao: SolicacaoSourcing;
  onProcessar: (id: string, acao: 'aceitar' | 'rejeitar') => void;
  processando: boolean;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
  getPrioridadeColor: (prioridade: string) => string;
}

function SolicitacaoCard({ 
  solicitacao, 
  onProcessar, 
  processando,
  getStatusColor,
  getStatusText,
  getPrioridadeColor
}: SolicitacaoCardProps) {
  const req = solicitacao.requisicao;
  
  return (
    <div className="border rounded-lg p-4 space-y-4 hover:shadow-md transition-shadow">
      {/* Cabeçalho */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-lg">{req.titulo}</h4>
            <Badge className={getPrioridadeColor(req.prioridade)}>
              {req.prioridade.toUpperCase()}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>#{req.numero_requisicao}</span>
            <span>•</span>
            <span>{req.solicitante_nome}</span>
            <span>•</span>
            <span>{req.solicitante_area}</span>
          </div>
        </div>
        <Badge className={getStatusColor(solicitacao.status)}>
          {getStatusText(solicitacao.status)}
        </Badge>
      </div>

      {/* Informações principais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-green-600" />
          <div>
            <p className="text-sm text-muted-foreground">Valor Estimado</p>
            <p className="font-medium">{formatCurrency(req.valor_estimado)}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-blue-600" />
          <div>
            <p className="text-sm text-muted-foreground">Data Necessidade</p>
            <p className="font-medium">
              {new Date(req.data_necessidade).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-purple-600" />
          <div>
            <p className="text-sm text-muted-foreground">Tipo</p>
            <p className="font-medium capitalize">{req.tipo}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-orange-600" />
          <div>
            <p className="text-sm text-muted-foreground">Fornecedores</p>
            <p className="font-medium">
              {solicitacao.recomendacoes_fornecedores?.length || 0} sugeridos
            </p>
          </div>
        </div>
      </div>

      {/* Descrição */}
      {req.descricao && (
        <div>
          <p className="text-sm text-muted-foreground mb-1">Descrição:</p>
          <p className="text-sm">{req.descricao}</p>
        </div>
      )}

      {/* Recomendações de Fornecedores */}
      {solicitacao.recomendacoes_fornecedores && solicitacao.recomendacoes_fornecedores.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Fornecedores Recomendados pela IA:
          </p>
          <div className="space-y-2">
            {solicitacao.recomendacoes_fornecedores.slice(0, 3).map((fornecedor, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm bg-muted p-2 rounded">
                <div>
                  <span className="font-medium">{fornecedor.nome}</span>
                  <span className="text-muted-foreground ml-2">({fornecedor.razao})</span>
                </div>
                <Badge variant="outline">Score: {fornecedor.score}%</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      <Separator />

      {/* Ações */}
      {solicitacao.status === 'nova' && (
        <div className="flex gap-2 justify-end">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onProcessar(solicitacao.id, 'rejeitar')}
            disabled={processando}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Rejeitar
          </Button>
          <Button 
            size="sm"
            onClick={() => window.location.href = `/sourcing/projeto/configurar?req=${solicitacao.requisicao_id}`}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Configurar Projeto
          </Button>
        </div>
      )}

      {solicitacao.status === 'projeto_criado' && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Ver Projeto
          </Button>
        </div>
      )}
    </div>
  );
}
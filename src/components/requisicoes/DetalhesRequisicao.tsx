import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { BackButton } from '@/components/ui/back-button';
import { 
  ArrowLeft,
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  User,
  Calendar,
  DollarSign,
  Package,
  MessageSquare,
  Download,
  Send,
  Eye,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { 
  useRequisicoes, 
  useItensRequisicao, 
  useAprovacoesRequisicao, 
  useHistoricoRequisicao,
  useAcaoAprovacao
} from '@/hooks/useRequisicoes';
import { useUserProfile } from '@/hooks/useUserProfile';
import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'rascunho':
      return { 
        label: 'Rascunho', 
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: <FileText className="h-4 w-4" />
      };
    case 'enviada':
      return { 
        label: 'Enviada', 
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <Clock className="h-4 w-4" />
      };
    case 'em_aprovacao':
      return { 
        label: 'Em Aprovação', 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: <Clock className="h-4 w-4" />
      };
    case 'aprovada':
      return { 
        label: 'Aprovada', 
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: <CheckCircle className="h-4 w-4" />
      };
    case 'rejeitada':
      return { 
        label: 'Rejeitada', 
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: <XCircle className="h-4 w-4" />
      };
    default:
      return { 
        label: status, 
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: <Clock className="h-4 w-4" />
      };
  }
};

const getPrioridadeConfig = (prioridade: string) => {
  switch (prioridade) {
    case 'baixa':
      return { 
        label: 'Baixa', 
        color: 'bg-green-50 text-green-700 border-green-200'
      };
    case 'media':
      return { 
        label: 'Média', 
        color: 'bg-yellow-50 text-yellow-700 border-yellow-200'
      };
    case 'alta':
      return { 
        label: 'Alta', 
        color: 'bg-orange-50 text-orange-700 border-orange-200'
      };
    case 'urgente':
      return { 
        label: 'Urgente', 
        color: 'bg-red-50 text-red-700 border-red-200'
      };
    default:
      return { 
        label: prioridade, 
        color: 'bg-gray-50 text-gray-700 border-gray-200'
      };
  }
};

export const DetalhesRequisicao = () => {
  const { id } = useParams<{ id: string }>();
  const [comentario, setComentario] = useState('');
  const { profileData } = useUserProfile();
  const { requisicoes, loading: loadingReq } = useRequisicoes();
  const { itens, loading: loadingItens } = useItensRequisicao(id || '');
  const { aprovacoes, loading: loadingAprov } = useAprovacoesRequisicao(id || '');
  const { historico, loading: loadingHist } = useHistoricoRequisicao(id || '');
  const { aprovarRequisicao, rejeitarRequisicao, loading: loadingAcao } = useAcaoAprovacao();

  const requisicao = requisicoes.find(r => r.id === id);

  // Verificar se o usuário atual é aprovador de alguma etapa pendente
  const aprovacaoPendente = aprovacoes.find(
    aprov => aprov.status === 'pendente' && 
    profileData && 
    aprov.aprovador_nome === profileData.name
  );

  const podeAprovar = profileData && 
    (['aprovador_nivel_1', 'aprovador_nivel_2', 'gestor'].includes(profileData.profile)) &&
    aprovacaoPendente;

  if (loadingReq || loadingItens || loadingAprov || loadingHist) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!requisicao) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="p-6">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-2" />
            <p className="text-red-600 font-medium">Requisição não encontrada</p>
          </div>
        </Card>
      </div>
    );
  }

  const statusConfig = getStatusConfig(requisicao.status);
  const prioridadeConfig = getPrioridadeConfig(requisicao.prioridade);

  const handleAprovar = async (aprovacaoId: string) => {
    const result = await aprovarRequisicao(aprovacaoId, comentario);
    if (result.success) {
      toast.success('Requisição aprovada com sucesso!');
      setComentario('');
    } else {
      toast.error(result.error || 'Erro ao aprovar requisição');
    }
  };

  const handleRejeitar = async (aprovacaoId: string) => {
    if (!comentario.trim()) {
      toast.error('Por favor, adicione um motivo para a rejeição');
      return;
    }
    const result = await rejeitarRequisicao(aprovacaoId, comentario);
    if (result.success) {
      toast.success('Requisição rejeitada');
      setComentario('');
    } else {
      toast.error(result.error || 'Erro ao rejeitar requisição');
    }
  };

  // Componente do fluxo visual de aprovação
  const FluxoAprovacao = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Fluxo do Processo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Linha do progresso */}
          <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200"></div>
          
          <div className="space-y-6">
            {/* Solicitação Criada */}
            <div className="relative flex items-center gap-4">
              <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
                <CheckCircle2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-green-700">Solicitação criada</p>
                <p className="text-sm text-gray-600">
                  {formatDistanceToNow(new Date(requisicao.created_at), {
                    addSuffix: true,
                    locale: ptBR
                  })}
                </p>
              </div>
            </div>

            {/* Aprovações */}
            {aprovacoes.map((aprovacao, index) => {
              const isCompleted = aprovacao.status === 'aprovada';
              const isRejected = aprovacao.status === 'rejeitada';
              const isPending = aprovacao.status === 'pendente';
              const isCurrentStep = isPending && index === 0;
              
              return (
                <div key={aprovacao.id} className="relative flex items-center gap-4">
                  <div className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ${
                    isCompleted ? 'bg-green-500' :
                    isRejected ? 'bg-red-500' :
                    isCurrentStep ? 'bg-yellow-500' :
                    'bg-gray-300'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    ) : isRejected ? (
                      <XCircle className="h-5 w-5 text-white" />
                    ) : isPending ? (
                      <Clock className="h-5 w-5 text-white" />
                    ) : (
                      <Circle className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-medium ${
                          isCompleted ? 'text-green-700' :
                          isRejected ? 'text-red-700' :
                          isPending ? 'text-yellow-700' :
                          'text-gray-600'
                        }`}>
                          Nível {aprovacao.nivel} - {aprovacao.aprovador_nome}
                        </p>
                        <p className="text-sm text-gray-600">{aprovacao.aprovador_area}</p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`${
                          isCompleted ? 'bg-green-100 text-green-800' :
                          isRejected ? 'bg-red-100 text-red-800' :
                          isPending ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {isCompleted ? 'Aprovada' :
                         isRejected ? 'Rejeitada' : 
                         isPending ? 'Pendente' : 'Aguardando'}
                      </Badge>
                    </div>
                    {aprovacao.comentarios && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                        <p><strong>Comentário:</strong> {aprovacao.comentarios}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Finalização (se aprovada) */}
            {requisicao.status === 'aprovada' && (
              <div className="relative flex items-center gap-4">
                <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-blue-700">Novo fornecedor criado</p>
                  <p className="text-sm text-gray-600">Processo concluído</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center gap-4">
        <BackButton to="/requisicoes" label="Voltar para Requisições" />
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-800">
            {requisicao.numero_requisicao}
          </h1>
          <p className="text-slate-600">{requisicao.titulo}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`${prioridadeConfig.color}`}>
            {prioridadeConfig.label}
          </Badge>
          <Badge variant="outline" className={`flex items-center gap-1 ${statusConfig.color}`}>
            {statusConfig.icon}
            {statusConfig.label}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informações Gerais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Informações Gerais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Tipo</label>
                  <p className="font-medium capitalize">{requisicao.tipo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Centro de Custo</label>
                  <p className="font-medium">{requisicao.centro_custo || 'Não definido'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Data de Necessidade</label>
                  <p className="font-medium">
                    {format(new Date(requisicao.data_necessidade), 'dd/MM/yyyy', { locale: ptBR })}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Valor Estimado</label>
                  <p className="font-medium text-green-600">
                    R$ {requisicao.valor_estimado?.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Solicitante</label>
                <div className="flex items-center gap-2 mt-1">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{requisicao.solicitante_nome}</span>
                  <span className="text-gray-500">({requisicao.solicitante_area})</span>
                </div>
              </div>

              {requisicao.justificativa && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Justificativa</label>
                  <p className="text-gray-700 mt-1">{requisicao.justificativa}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Itens Solicitados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Itens Solicitados ({itens.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {itens.map((item, index) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium">{item.descricao}</p>
                        {item.especificacao && (
                          <p className="text-sm text-gray-600 mt-1">{item.especificacao}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>Qtd: {item.quantidade} {item.unidade}</span>
                          <span>Preço est.: R$ {item.preco_estimado?.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          R$ {item.valor_total_estimado?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Histórico e Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Histórico e Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {historico.map((evento) => (
                    <div key={evento.id} className="flex gap-3 pb-3 border-b border-gray-100 last:border-0">
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{evento.evento.replace('_', ' ')}</p>
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(evento.created_at), {
                              addSuffix: true,
                              locale: ptBR
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{evento.descricao}</p>
                        <p className="text-xs text-gray-500">por {evento.usuario_nome}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Coluna Lateral */}
        <div className="space-y-6">
          {/* Fluxo de Aprovação */}
          <FluxoAprovacao />

          {/* Painel de Aprovação (só para aprovadores) */}
          {podeAprovar && aprovacaoPendente && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <AlertTriangle className="h-5 w-5" />
                  Workflow de Aprovação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-orange-900">Nível {aprovacaoPendente.nivel}</p>
                    <p className="text-sm text-orange-700">{aprovacaoPendente.aprovador_nome}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Adicione um comentário..."
                      value={comentario}
                      onChange={(e) => setComentario(e.target.value)}
                      rows={3}
                      className="bg-white"
                    />
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleAprovar(aprovacaoPendente.id)}
                        disabled={loadingAcao}
                        className="bg-green-600 hover:bg-green-700 flex-1"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Aprovar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleRejeitar(aprovacaoPendente.id)}
                        disabled={loadingAcao}
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rejeitar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ações Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Exportar PDF
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Send className="h-4 w-4 mr-2" />
                Enviar por Email
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Eye className="h-4 w-4 mr-2" />
                Ver Anexos
              </Button>
            </CardContent>
          </Card>

          {/* Resumo Financeiro */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Resumo Financeiro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Valor Estimado</span>
                <span className="font-semibold">
                  R$ {requisicao.valor_estimado?.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
              </div>
              {requisicao.valor_aprovado && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Valor Aprovado</span>
                  <span className="font-semibold text-green-600">
                    R$ {requisicao.valor_aprovado.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
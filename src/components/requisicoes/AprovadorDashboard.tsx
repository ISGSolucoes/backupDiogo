
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, AlertTriangle, Eye, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRequisicoes } from '@/hooks/useRequisicoes';
import { UserProfileData } from '@/hooks/useUserProfile';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AprovadorDashboardProps {
  profileData: UserProfileData;
}

export const AprovadorDashboard = ({ profileData }: AprovadorDashboardProps) => {
  const navigate = useNavigate();
  const { requisicoes, loading } = useRequisicoes();

  // Filtrar requisições pendentes de aprovação para este aprovador
  const requisicoesPendentes = requisicoes.filter(req => 
    req.status === 'em_aprovacao' && 
    req.aprovador_atual_nome === profileData.name
  );

  // Estatísticas do aprovador
  const stats = {
    pendentes: requisicoesPendentes.length,
    urgentes: requisicoesPendentes.filter(r => r.prioridade === 'urgente').length,
    valorPendente: requisicoesPendentes.reduce((acc, r) => acc + (r.valor_estimado || 0), 0),
    maioresValores: requisicoesPendentes.filter(r => (r.valor_estimado || 0) > 10000).length
  };

  const getPrioridadeConfig = (prioridade: string) => {
    switch (prioridade) {
      case 'urgente':
        return { label: 'Urgente', color: 'bg-red-100 text-red-800', dotColor: 'bg-red-500' };
      case 'alta':
        return { label: 'Alta', color: 'bg-orange-100 text-orange-800', dotColor: 'bg-orange-500' };
      case 'media':
        return { label: 'Média', color: 'bg-yellow-100 text-yellow-800', dotColor: 'bg-yellow-500' };
      default:
        return { label: 'Baixa', color: 'bg-green-100 text-green-800', dotColor: 'bg-green-500' };
    }
  };

  const handleAprovar = (e: React.MouseEvent, requisicaoId: string) => {
    e.stopPropagation();
    // Implementar modal de aprovação
    console.log('Aprovar requisição:', requisicaoId);
  };

  const handleRejeitar = (e: React.MouseEvent, requisicaoId: string) => {
    e.stopPropagation();
    // Implementar modal de rejeição
    console.log('Rejeitar requisição:', requisicaoId);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Cabeçalho do Aprovador */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Central de Aprovação - {profileData.name} ⚡
          </h1>
          <p className="text-slate-600">
            {profileData.area} • {stats.pendentes} requisições aguardando sua aprovação
          </p>
        </div>
        
        {stats.urgentes > 0 && (
          <Badge className="bg-red-100 text-red-800 px-3 py-2">
            <AlertTriangle className="h-4 w-4 mr-1" />
            {stats.urgentes} Urgentes!
          </Badge>
        )}
      </div>

      {/* Cards de Status do Aprovador */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-yellow-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-600 flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendentes}</div>
          </CardContent>
        </Card>
        
        <Card className="border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-600 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Urgentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.urgentes}</div>
          </CardContent>
        </Card>
        
        <Card className="border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-600">Alto Valor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.maioresValores}</div>
            <p className="text-xs text-slate-500">Acima de R$ 10.000</p>
          </CardContent>
        </Card>
        
        <Card className="border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-600">Valor Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-blue-600">
              R$ {stats.valorPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Requisições Pendentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-600" />
            Requisições Pendentes de Aprovação ({requisicoesPendentes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-100 rounded animate-pulse"></div>
              ))}
            </div>
          ) : requisicoesPendentes.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Nenhuma requisição pendente! 🎉</p>
              <p className="text-sm text-gray-400">Todas as aprovações estão em dia</p>
            </div>
          ) : (
            <div className="space-y-3">
              {requisicoesPendentes
                .sort((a, b) => {
                  // Priorizar urgentes
                  if (a.prioridade === 'urgente' && b.prioridade !== 'urgente') return -1;
                  if (b.prioridade === 'urgente' && a.prioridade !== 'urgente') return 1;
                  // Depois por valor (maiores primeiro)
                  return (b.valor_estimado || 0) - (a.valor_estimado || 0);
                })
                .map((req) => {
                  const prioridadeConfig = getPrioridadeConfig(req.prioridade);
                  
                  return (
                    <div 
                      key={req.id}
                      className={`p-4 border rounded-lg hover:shadow-lg transition-all cursor-pointer ${
                        req.prioridade === 'urgente' ? 'border-red-200 bg-red-50' : 'border-gray-200'
                      }`}
                      onClick={() => navigate(`/requisicoes/${req.id}/detalhes`)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-900">
                              {req.numero_requisicao}
                            </h4>
                            <div className="flex items-center gap-1">
                              <div className={`w-2 h-2 rounded-full ${prioridadeConfig.dotColor}`}></div>
                              <Badge className={prioridadeConfig.color}>
                                {prioridadeConfig.label}
                              </Badge>
                            </div>
                            {req.valor_estimado && req.valor_estimado > 10000 && (
                              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                                Alto Valor
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-sm font-medium text-gray-800 mb-1">{req.titulo}</p>
                          <p className="text-xs text-gray-600 mb-2">{req.descricao}</p>
                          
                          <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                            <span><strong>Solicitante:</strong> {req.solicitante_nome}</span>
                            <span><strong>Área:</strong> {req.solicitante_area}</span>
                            <span>
                              <strong>Valor:</strong> R$ {req.valor_estimado?.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2
                              })}
                            </span>
                            <span>
                              Criada: {formatDistanceToNow(new Date(req.created_at), {
                                addSuffix: true,
                                locale: ptBR
                              })}
                            </span>
                          </div>
                          
                          {req.justificativa && (
                            <div className="bg-gray-50 p-2 rounded text-xs text-gray-700">
                              <strong>Justificativa:</strong> {req.justificativa}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/requisicoes/${req.id}/detalhes`);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-green-600 border-green-200 hover:bg-green-50"
                            onClick={(e) => handleAprovar(e, req.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Aprovar
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={(e) => handleRejeitar(e, req.id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Rejeitar
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Orientações para Aprovador */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="bg-amber-100 p-2 rounded-lg">
              <MessageSquare className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-900 mb-2">
                {profileData.profile === 'aprovador_nivel_1' ? 'Aprovador Nível 1' : 'Aprovador Nível 2'} - Orientações
              </h3>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>• Priorize requisições urgentes e de alto valor</li>
                <li>• Verifique justificativas e documentos anexos</li>
                <li>• Use comentários para comunicar condições</li>
                <li>• Delegue quando necessário para outros aprovadores</li>
                <li>• Considere prazos de necessidade dos solicitantes</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

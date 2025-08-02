
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Clock, CheckCircle, XCircle, FileText, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRequisicoes } from '@/hooks/useRequisicoes';
import { UserProfileData } from '@/hooks/useUserProfile';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SolicitanteDashboardProps {
  profileData: UserProfileData;
}

export const SolicitanteDashboard = ({ profileData }: SolicitanteDashboardProps) => {
  const navigate = useNavigate();
  const { requisicoes, loading } = useRequisicoes();

  // Filtrar apenas requisições do usuário atual
  const minhasRequisicoes = requisicoes.filter(req => 
    req.solicitante_nome === profileData.name
  );

  const stats = {
    total: minhasRequisicoes.length,
    pendentes: minhasRequisicoes.filter(r => r.status === 'em_aprovacao').length,
    aprovadas: minhasRequisicoes.filter(r => r.status === 'aprovada').length,
    rejeitadas: minhasRequisicoes.filter(r => r.status === 'rejeitada').length,
    valorTotal: minhasRequisicoes.reduce((acc, r) => acc + (r.valor_estimado || 0), 0)
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'em_aprovacao':
        return { label: 'Em Aprovação', color: 'bg-yellow-100 text-yellow-800', icon: Clock };
      case 'aprovada':
        return { label: 'Aprovada', color: 'bg-green-100 text-green-800', icon: CheckCircle };
      case 'rejeitada':
        return { label: 'Rejeitada', color: 'bg-red-100 text-red-800', icon: XCircle };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-800', icon: FileText };
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Cabeçalho Personalizado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Olá, {profileData.name}! 👋
          </h1>
          <p className="text-slate-600">
            Área: {profileData.area} • Suas requisições e solicitações
          </p>
        </div>
        
        <Button 
          onClick={() => navigate('/requisicoes/criar')}
          className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 text-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nova Requisição
        </Button>
      </div>

      {/* Cards de Status Pessoais */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-600">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-600">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendentes}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-600">Aprovadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.aprovadas}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-600">Rejeitadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejeitadas}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-600">Valor Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-slate-800">
              R$ {stats.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Minhas Requisições */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-amber-600" />
            Minhas Requisições ({minhasRequisicoes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded animate-pulse"></div>
              ))}
            </div>
          ) : minhasRequisicoes.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Nenhuma requisição encontrada</p>
              <p className="text-sm text-gray-400 mb-4">Crie sua primeira requisição</p>
              <Button onClick={() => navigate('/requisicoes/criar')}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Requisição
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {minhasRequisicoes.map((req) => {
                const statusConfig = getStatusConfig(req.status);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <div 
                    key={req.id}
                    className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer"
                    onClick={() => navigate(`/requisicoes/${req.id}/detalhes`)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900">
                            {req.numero_requisicao}
                          </h4>
                          <Badge className={statusConfig.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig.label}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{req.titulo}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>
                            Valor: R$ {req.valor_estimado?.toLocaleString('pt-BR', {
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
                      </div>
                      
                      <Button variant="ghost" size="sm">
                        Ver Detalhes
                      </Button>
                    </div>
                    
                    {/* Status do Workflow */}
                    {req.status === 'em_aprovacao' && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Clock className="h-3 w-3 text-yellow-500" />
                          <span>
                            Aguardando aprovação de <strong>{req.aprovador_atual_nome}</strong>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dicas para Solicitante */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Dicas para suas requisições</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Forneça descrições detalhadas para acelerar aprovações</li>
                <li>• Justifique adequadamente a necessidade da compra</li>
                <li>• Anexe orçamentos quando possível</li>
                <li>• Acompanhe o status pelo timeline de aprovação</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

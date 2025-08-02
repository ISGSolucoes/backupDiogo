
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, TrendingUp, Users, DollarSign, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRequisicoes } from '@/hooks/useRequisicoes';
import { UserProfileData } from '@/hooks/useUserProfile';

interface GestorDashboardProps {
  profileData: UserProfileData;
}

export const GestorDashboard = ({ profileData }: GestorDashboardProps) => {
  const navigate = useNavigate();
  const { requisicoes, loading } = useRequisicoes();

  // Métricas consolidadas
  const metricas = {
    total: requisicoes.length,
    pendentes: requisicoes.filter(r => r.status === 'em_aprovacao').length,
    aprovadas: requisicoes.filter(r => r.status === 'aprovada').length,
    rejeitadas: requisicoes.filter(r => r.status === 'rejeitada').length,
    urgentes: requisicoes.filter(r => r.prioridade === 'urgente').length,
    valorTotal: requisicoes.reduce((acc, r) => acc + (r.valor_estimado || 0), 0),
    valorMedio: requisicoes.length > 0 ? requisicoes.reduce((acc, r) => acc + (r.valor_estimado || 0), 0) / requisicoes.length : 0
  };

  // Análise por solicitantes
  const analisesolicitantes = requisicoes.reduce((acc, req) => {
    const key = `${req.solicitante_nome}-${req.solicitante_area}`;
    if (!acc[key]) {
      acc[key] = {
        nome: req.solicitante_nome,
        area: req.solicitante_area,
        total: 0,
        valor: 0,
        pendentes: 0
      };
    }
    acc[key].total++;
    acc[key].valor += req.valor_estimado || 0;
    if (req.status === 'em_aprovacao') acc[key].pendentes++;
    return acc;
  }, {} as Record<string, any>);

  const topSolicitantes = Object.values(analisesolicitantes)
    .sort((a: any, b: any) => b.valor - a.valor)
    .slice(0, 5);

  // Requisições que precisam de atenção
  const atencaoEspecial = requisicoes.filter(req => 
    req.prioridade === 'urgente' || 
    (req.valor_estimado || 0) > 15000 ||
    req.status === 'rejeitada'
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Cabeçalho do Gestor */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Dashboard Executivo - {profileData.name} 📊
          </h1>
          <p className="text-slate-600">
            Visão consolidada do processo de requisições • {profileData.area}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Relatórios
          </Button>
          <Button onClick={() => navigate('/requisicoes')}>
            Ver Todas
          </Button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-600">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{metricas.total}</div>
          </CardContent>
        </Card>
        
        <Card className="border-yellow-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-600 flex items-center gap-1">
              <Clock className="h-3 w-3 text-yellow-500" />
              Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{metricas.pendentes}</div>
          </CardContent>
        </Card>
        
        <Card className="border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-600 flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              Aprovadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metricas.aprovadas}</div>
          </CardContent>
        </Card>
        
        <Card className="border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-600 flex items-center gap-1">
              <XCircle className="h-3 w-3 text-red-500" />
              Rejeitadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metricas.rejeitadas}</div>
          </CardContent>
        </Card>
        
        <Card className="border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-600 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-orange-500" />
              Urgentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{metricas.urgentes}</div>
          </CardContent>
        </Card>
        
        <Card className="border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-600">Valor Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-blue-600">
              R$ {metricas.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-600">Valor Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-purple-600">
              R$ {metricas.valorMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Solicitantes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Top Solicitantes por Valor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topSolicitantes.map((solicitante: any, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium text-sm">{solicitante.nome}</p>
                    <p className="text-xs text-gray-500">{solicitante.area}</p>
                    <p className="text-xs text-gray-600">
                      {solicitante.total} requisições
                      {solicitante.pendentes > 0 && (
                        <span className="text-yellow-600"> • {solicitante.pendentes} pendentes</span>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">
                      R$ {solicitante.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Atenção Especial */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Requer Atenção ({atencaoEspecial.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {atencaoEspecial.slice(0, 10).map((req) => (
                <div 
                  key={req.id}
                  className="p-3 border rounded cursor-pointer hover:shadow-md transition-all"
                  onClick={() => navigate(`/requisicoes/${req.id}/detalhes`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm">{req.numero_requisicao}</p>
                        {req.prioridade === 'urgente' && (
                          <Badge className="bg-red-100 text-red-800 text-xs">Urgente</Badge>
                        )}
                        {(req.valor_estimado || 0) > 15000 && (
                          <Badge className="bg-purple-100 text-purple-800 text-xs">Alto Valor</Badge>
                        )}
                        {req.status === 'rejeitada' && (
                          <Badge className="bg-gray-100 text-gray-800 text-xs">Rejeitada</Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-600">{req.titulo}</p>
                      <p className="text-xs text-gray-500">
                        {req.solicitante_nome} • R$ {req.valor_estimado?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights Executivos */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-2">Insights Executivos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                <div className="space-y-2">
                  <p><strong>Taxa de Aprovação:</strong> {metricas.total > 0 ? Math.round((metricas.aprovadas / metricas.total) * 100) : 0}%</p>
                  <p><strong>Tempo Médio:</strong> Análise em desenvolvimento</p>
                  <p><strong>Eficiência:</strong> {metricas.pendentes < 5 ? 'Boa' : 'Atenção necessária'}</p>
                </div>
                <div className="space-y-2">
                  <p><strong>Maior Solicitante:</strong> {topSolicitantes[0]?.nome || 'N/A'}</p>
                  <p><strong>Área Mais Ativa:</strong> {topSolicitantes[0]?.area || 'N/A'}</p>
                  <p><strong>Requisições Urgentes:</strong> {metricas.urgentes > 3 ? 'Acima do normal' : 'Normal'}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

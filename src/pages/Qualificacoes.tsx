
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, FileCheck, Clock, AlertCircle, CheckCircle2, Users, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BackButton } from '@/components/ui/back-button';

interface Qualificacao {
  id: string;
  titulo: string;
  cliente: string;
  tipo: 'ESG' | 'Técnica' | 'Financeira' | 'Compliance';
  status: 'pendente' | 'em_andamento' | 'aprovada' | 'rejeitada';
  prazo: string;
  progresso: number;
  score?: number;
}

const Qualificacoes = () => {
  const navigate = useNavigate();
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [filtroTipo, setFiltroTipo] = useState('todos');

  const qualificacoes: Qualificacao[] = [
    {
      id: 'QUA-2024-0156',
      titulo: 'Requalificação ESG 2024',
      cliente: 'Petrobras S.A.',
      tipo: 'ESG',
      status: 'em_andamento',
      prazo: '05/06/2024',
      progresso: 45
    },
    {
      id: 'QUA-2024-0134',
      titulo: 'Qualificação Técnica Q1',
      cliente: 'Petrobras S.A.',
      tipo: 'Técnica',
      status: 'aprovada',
      prazo: '15/04/2024',
      progresso: 100,
      score: 9.2
    },
    {
      id: 'QUA-2024-0142',
      titulo: 'Avaliação Compliance',
      cliente: 'Vale S.A.',
      tipo: 'Compliance',
      status: 'pendente',
      prazo: '30/05/2024',
      progresso: 0
    }
  ];

  const getStatusStyle = (status: string) => {
    const styles = {
      pendente: 'bg-yellow-100 text-yellow-800',
      em_andamento: 'bg-blue-100 text-blue-800',
      aprovada: 'bg-green-100 text-green-800',
      rejeitada: 'bg-red-100 text-red-800'
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendente': return <Clock className="w-4 h-4" />;
      case 'em_andamento': return <AlertCircle className="w-4 h-4" />;
      case 'aprovada': return <CheckCircle2 className="w-4 h-4" />;
      case 'rejeitada': return <AlertCircle className="w-4 h-4" />;
      default: return <FileCheck className="w-4 h-4" />;
    }
  };

  const qualificacoesFiltradas = qualificacoes.filter(q => {
    const statusMatch = filtroStatus === 'todos' || q.status === filtroStatus;
    const tipoMatch = filtroTipo === 'todos' || q.tipo === filtroTipo;
    return statusMatch && tipoMatch;
  });

  const estatisticas = {
    total: qualificacoes.length,
    pendentes: qualificacoes.filter(q => q.status === 'pendente').length,
    emAndamento: qualificacoes.filter(q => q.status === 'em_andamento').length,
    aprovadas: qualificacoes.filter(q => q.status === 'aprovada').length
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BackButton to="/portal-fornecedor" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Star className="h-8 w-8 text-yellow-500" />
              Qualificações
            </h1>
            <p className="text-gray-600">Gerencie suas qualificações e certificações</p>
          </div>
        </div>
        
        <Button onClick={() => navigate('/qualificacoes/nova')} className="bg-blue-600 hover:bg-blue-700">
          Nova Qualificação
        </Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-yellow-600">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{estatisticas.pendentes}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-600">Em Andamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{estatisticas.emAndamento}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-600">Aprovadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{estatisticas.aprovadas}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="font-medium text-gray-700">Status:</label>
          <select 
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todos</option>
            <option value="pendente">Pendente</option>
            <option value="em_andamento">Em Andamento</option>
            <option value="aprovada">Aprovada</option>
            <option value="rejeitada">Rejeitada</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="font-medium text-gray-700">Tipo:</label>
          <select 
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todos</option>
            <option value="ESG">ESG</option>
            <option value="Técnica">Técnica</option>
            <option value="Financeira">Financeira</option>
            <option value="Compliance">Compliance</option>
          </select>
        </div>
      </div>

      {/* Lista de Qualificações */}
      <div className="space-y-4">
        {qualificacoesFiltradas.map((qualificacao) => (
          <Card key={qualificacao.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{qualificacao.titulo}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusStyle(qualificacao.status)}`}>
                      {getStatusIcon(qualificacao.status)}
                      {qualificacao.status.replace('_', ' ')}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {qualificacao.tipo}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-3">
                    <span className="font-medium">Cliente:</span> {qualificacao.cliente} • 
                    <span className="font-medium"> Prazo:</span> {qualificacao.prazo}
                    {qualificacao.score && (
                      <>
                        <span className="font-medium"> • Score:</span> 
                        <span className="text-green-600 font-bold"> {qualificacao.score}/10</span>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${qualificacao.progresso}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{qualificacao.progresso}%</span>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/qualificacoes/${qualificacao.id}`)}
                  >
                    Ver Detalhes
                  </Button>
                  {qualificacao.status === 'em_andamento' && (
                    <Button 
                      size="sm"
                      onClick={() => navigate(`/qualificacoes/${qualificacao.id}/continuar`)}
                    >
                      Continuar
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {qualificacoesFiltradas.length === 0 && (
        <div className="text-center py-12">
          <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma qualificação encontrada</h3>
          <p className="text-gray-500">Ajuste os filtros ou aguarde novas solicitações</p>
        </div>
      )}
    </div>
  );
};

export default Qualificacoes;

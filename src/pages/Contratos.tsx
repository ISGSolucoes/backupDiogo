
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Calendar, DollarSign, MapPin, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BackButton } from '@/components/ui/back-button';

interface Contrato {
  id: string;
  titulo: string;
  cliente: string;
  tipo: 'Anual' | 'Projeto' | 'Fornecimento' | 'Serviços';
  status: 'rascunho' | 'em_negociacao' | 'aguardando_assinatura' | 'vigente' | 'vencido';
  valor: string;
  dataInicio: string;
  dataFim: string;
  localizacao?: string;
  progresso: number;
}

const Contratos = () => {
  const navigate = useNavigate();
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [filtroTipo, setFiltroTipo] = useState('todos');

  const contratos: Contrato[] = [
    {
      id: 'CON-2024-0034',
      titulo: 'Contrato Anual - Peças Carajás',
      cliente: 'Vale S.A.',
      tipo: 'Anual',
      status: 'aguardando_assinatura',
      valor: 'R$ 2.5M/ano',
      dataInicio: '01/07/2024',
      dataFim: '30/06/2025',
      localizacao: 'Carajás/PA',
      progresso: 95
    },
    {
      id: 'CON-2024-0028',
      titulo: 'Fornecimento Equipamentos Offshore',
      cliente: 'Petrobras S.A.',
      tipo: 'Fornecimento',
      status: 'vigente',
      valor: 'R$ 1.8M',
      dataInicio: '15/03/2024',
      dataFim: '15/12/2024',
      progresso: 100
    },
    {
      id: 'CON-2024-0031',
      titulo: 'Serviços de Manutenção Aeronáutica',
      cliente: 'Embraer S.A.',
      tipo: 'Serviços',
      status: 'em_negociacao',
      valor: 'R$ 890K',
      dataInicio: '01/08/2024',
      dataFim: '31/07/2025',
      progresso: 60
    }
  ];

  const getStatusStyle = (status: string) => {
    const styles = {
      rascunho: 'bg-gray-100 text-gray-800',
      em_negociacao: 'bg-yellow-100 text-yellow-800',
      aguardando_assinatura: 'bg-blue-100 text-blue-800',
      vigente: 'bg-green-100 text-green-800',
      vencido: 'bg-red-100 text-red-800'
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'rascunho': return <FileText className="w-4 h-4" />;
      case 'em_negociacao': return <Clock className="w-4 h-4" />;
      case 'aguardando_assinatura': return <AlertTriangle className="w-4 h-4" />;
      case 'vigente': return <CheckCircle2 className="w-4 h-4" />;
      case 'vencido': return <AlertTriangle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const contratosFiltrados = contratos.filter(c => {
    const statusMatch = filtroStatus === 'todos' || c.status === filtroStatus;
    const tipoMatch = filtroTipo === 'todos' || c.tipo === filtroTipo;
    return statusMatch && tipoMatch;
  });

  const estatisticas = {
    total: contratos.length,
    vigentes: contratos.filter(c => c.status === 'vigente').length,
    emNegociacao: contratos.filter(c => c.status === 'em_negociacao').length,
    aguardandoAssinatura: contratos.filter(c => c.status === 'aguardando_assinatura').length
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BackButton to="/portal-fornecedor" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="h-8 w-8 text-purple-500" />
              Contratos
            </h1>
            <p className="text-gray-600">Gerencie seus contratos e acordos comerciais</p>
          </div>
        </div>
        
        <Button onClick={() => navigate('/contratos/novo')} className="bg-purple-600 hover:bg-purple-700">
          Novo Contrato
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
            <CardTitle className="text-sm font-medium text-green-600">Vigentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{estatisticas.vigentes}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-yellow-600">Em Negociação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{estatisticas.emNegociacao}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-600">Aguardando Assinatura</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{estatisticas.aguardandoAssinatura}</div>
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
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="todos">Todos</option>
            <option value="rascunho">Rascunho</option>
            <option value="em_negociacao">Em Negociação</option>
            <option value="aguardando_assinatura">Aguardando Assinatura</option>
            <option value="vigente">Vigente</option>
            <option value="vencido">Vencido</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="font-medium text-gray-700">Tipo:</label>
          <select 
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="todos">Todos</option>
            <option value="Anual">Anual</option>
            <option value="Projeto">Projeto</option>
            <option value="Fornecimento">Fornecimento</option>
            <option value="Serviços">Serviços</option>
          </select>
        </div>
      </div>

      {/* Lista de Contratos */}
      <div className="space-y-4">
        {contratosFiltrados.map((contrato) => (
          <Card key={contrato.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{contrato.titulo}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusStyle(contrato.status)}`}>
                      {getStatusIcon(contrato.status)}
                      {contrato.status.replace('_', ' ')}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {contrato.tipo}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-3 flex flex-wrap gap-4">
                    <span className="flex items-center gap-1">
                      <span className="font-medium">Cliente:</span> {contrato.cliente}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {contrato.valor}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {contrato.dataInicio} - {contrato.dataFim}
                    </span>
                    {contrato.localizacao && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {contrato.localizacao}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${contrato.progresso}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{contrato.progresso}%</span>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/contratos/${contrato.id}`)}
                  >
                    Ver Detalhes
                  </Button>
                  {contrato.status === 'aguardando_assinatura' && (
                    <Button 
                      size="sm"
                      onClick={() => navigate(`/contratos/${contrato.id}/assinar`)}
                    >
                      Assinar
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {contratosFiltrados.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum contrato encontrado</h3>
          <p className="text-gray-500">Ajuste os filtros ou aguarde novos contratos</p>
        </div>
      )}
    </div>
  );
};

export default Contratos;

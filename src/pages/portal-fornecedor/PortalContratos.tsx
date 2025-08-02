
import React, { useState } from 'react';
import { ArrowLeft, FileText, Calendar, DollarSign, MapPin, CheckCircle, Clock, PenTool } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const PortalContratos = () => {
  const navigate = useNavigate();
  const [filtroStatus, setFiltroStatus] = useState('todos');

  const contratos = [
    {
      id: 'CON-2024-0034',
      cliente: 'Vale S.A.',
      titulo: 'Contrato Anual - Peças Carajás',
      descricao: 'Renovação de contrato para fornecimento de peças para equipamentos de mineração.',
      valor: 'R$ 2.5M/ano',
      recebidoEm: '22/05/2024',
      prazo: '30/05/2024',
      local: 'Carajás/PA',
      status: 'aguardando_assinatura',
      vigencia: '12 meses',
      tipo: 'Renovação'
    },
    {
      id: 'CON-2024-0021',
      cliente: 'Petrobras S.A.',
      titulo: 'Fornecimento de Válvulas Industriais',
      descricao: 'Contrato para fornecimento trimestral de válvulas de alta pressão.',
      valor: 'R$ 890.000',
      recebidoEm: '15/05/2024',
      status: 'assinado',
      assinadoEm: '18/05/2024',
      vigencia: '6 meses',
      tipo: 'Novo Contrato',
      inicioVigencia: '01/06/2024'
    },
    {
      id: 'CON-2024-0012',
      cliente: 'Embraer S.A.',
      titulo: 'Componentes Aeronáuticos Q2',
      descricao: 'Contrato trimestral para fornecimento de componentes especializados.',
      valor: 'R$ 1.2M',
      recebidoEm: '10/05/2024',
      status: 'em_analise',
      vigencia: '3 meses',
      tipo: 'Aditivo'
    },
    {
      id: 'CON-2024-0003',
      cliente: 'Petrobras S.A.',
      titulo: 'Manutenção de Equipamentos Offshore',
      descricao: 'Contrato para serviços de manutenção preventiva e corretiva.',
      valor: 'R$ 3.1M/ano',
      recebidoEm: '01/04/2024',
      status: 'vigente',
      assinadoEm: '05/04/2024',
      inicioVigencia: '15/04/2024',
      fimVigencia: '14/04/2025',
      vigencia: '12 meses',
      tipo: 'Novo Contrato'
    }
  ];

  const getStatusBadge = (status: string) => {
    const configs = {
      aguardando_assinatura: { variant: 'destructive' as const, label: 'Aguardando Assinatura' },
      em_analise: { variant: 'outline' as const, label: 'Em Análise' },
      assinado: { variant: 'default' as const, label: 'Assinado' },
      vigente: { variant: 'default' as const, label: 'Vigente' },
      vencido: { variant: 'secondary' as const, label: 'Vencido' },
      cancelado: { variant: 'destructive' as const, label: 'Cancelado' }
    };
    return configs[status as keyof typeof configs] || { variant: 'secondary' as const, label: status };
  };

  const getTipoColor = (tipo: string) => {
    const cores = {
      'Novo Contrato': 'bg-blue-100 text-blue-800',
      'Renovação': 'bg-green-100 text-green-800',
      'Aditivo': 'bg-yellow-100 text-yellow-800'
    };
    return cores[tipo as keyof typeof cores] || 'bg-gray-100 text-gray-800';
  };

  const contratosFiltrados = contratos.filter(contrato => 
    filtroStatus === 'todos' || contrato.status === filtroStatus
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
      {/* Header */}
      <nav className="bg-white/95 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/portal-fornecedor")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar ao Portal
              </Button>
              <div className="text-2xl font-bold text-blue-900">🔗 SourceXpress Portal</div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-gray-700 font-medium">TechSupply Solutions</span>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                TS
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <FileText className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Meus Contratos</h1>
              <p className="text-gray-600">Gerencie seus contratos e documentos legais</p>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Button
              variant={filtroStatus === 'todos' ? 'default' : 'outline'}
              onClick={() => setFiltroStatus('todos')}
            >
              Todos ({contratos.length})
            </Button>
            <Button
              variant={filtroStatus === 'aguardando_assinatura' ? 'default' : 'outline'}
              onClick={() => setFiltroStatus('aguardando_assinatura')}
            >
              Aguardando ({contratos.filter(c => c.status === 'aguardando_assinatura').length})
            </Button>
            <Button
              variant={filtroStatus === 'vigente' ? 'default' : 'outline'}
              onClick={() => setFiltroStatus('vigente')}
            >
              Vigentes ({contratos.filter(c => c.status === 'vigente').length})
            </Button>
            <Button
              variant={filtroStatus === 'assinado' ? 'default' : 'outline'}
              onClick={() => setFiltroStatus('assinado')}
            >
              Assinados ({contratos.filter(c => c.status === 'assinado').length})
            </Button>
          </div>

          {/* Lista de Contratos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {contratosFiltrados.map((contrato) => {
              const statusConfig = getStatusBadge(contrato.status);
              return (
                <Card key={contrato.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{contrato.titulo}</CardTitle>
                        <p className="text-sm text-gray-600">{contrato.cliente}</p>
                        <p className="text-xs text-gray-500">#{contrato.id}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={statusConfig.variant}>
                          {statusConfig.label}
                        </Badge>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTipoColor(contrato.tipo)}`}>
                          {contrato.tipo}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{contrato.descricao}</p>

                    <div className="bg-blue-50 rounded-lg p-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700 text-sm">Valor do Contrato</span>
                        <span className="text-blue-900 font-bold text-lg">{contrato.valor}</span>
                      </div>
                      <div className="text-blue-600 text-sm mt-1">Vigência: {contrato.vigencia}</div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Recebido: {contrato.recebidoEm}</span>
                      </div>
                      {contrato.prazo && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>Prazo: {contrato.prazo}</span>
                        </div>
                      )}
                      {contrato.local && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{contrato.local}</span>
                        </div>
                      )}
                      {contrato.assinadoEm && (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          <span>Assinado: {contrato.assinadoEm}</span>
                        </div>
                      )}
                    </div>

                    {(contrato.inicioVigencia || contrato.fimVigencia) && (
                      <div className="bg-green-50 border-l-4 border-green-400 p-3 mb-4">
                        <p className="text-green-800 text-sm font-medium">📅 Período de Vigência:</p>
                        <p className="text-green-700 text-sm">
                          {contrato.inicioVigencia && `Início: ${contrato.inicioVigencia}`}
                          {contrato.fimVigencia && ` • Fim: ${contrato.fimVigencia}`}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {contrato.status === 'aguardando_assinatura' && (
                        <>
                          <Button size="sm" className="flex-1">
                            <PenTool className="w-4 h-4 mr-2" />
                            Assinar Digitalmente
                          </Button>
                          <Button variant="outline" size="sm">
                            Baixar Contrato
                          </Button>
                        </>
                      )}
                      {contrato.status === 'em_analise' && (
                        <Button variant="outline" size="sm" className="flex-1">
                          Acompanhar Análise
                        </Button>
                      )}
                      {(contrato.status === 'assinado' || contrato.status === 'vigente') && (
                        <>
                          <Button variant="outline" size="sm" className="flex-1">
                            Ver Contrato Completo
                          </Button>
                          <Button variant="outline" size="sm">
                            Baixar PDF
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalContratos;

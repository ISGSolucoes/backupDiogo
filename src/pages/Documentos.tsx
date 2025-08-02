
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Upload, Download, Eye, Search, Filter, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BackButton } from '@/components/ui/back-button';

interface Documento {
  id: string;
  nome: string;
  tipo: 'Contrato' | 'Certificado' | 'Fiscal' | 'Técnico' | 'Compliance';
  categoria: string;
  tamanho: string;
  dataUpload: string;
  status: 'aprovado' | 'pendente' | 'rejeitado' | 'expirado';
  cliente?: string;
  dataVencimento?: string;
}

const Documentos = () => {
  const navigate = useNavigate();
  const [termoBusca, setTermoBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroStatus, setFiltroStatus] = useState('todos');

  const documentos: Documento[] = [
    {
      id: 'DOC-001',
      nome: 'Contrato Fornecimento 2024 - Vale.pdf',
      tipo: 'Contrato',
      categoria: 'Comercial',
      tamanho: '2.4 MB',
      dataUpload: '15/05/2024',
      status: 'aprovado',
      cliente: 'Vale S.A.',
      dataVencimento: '15/05/2025'
    },
    {
      id: 'DOC-002',
      nome: 'Certificado ISO 9001.pdf',
      tipo: 'Certificado',
      categoria: 'Qualidade',
      tamanho: '1.2 MB',
      dataUpload: '10/04/2024',
      status: 'aprovado',
      dataVencimento: '10/04/2027'
    },
    {
      id: 'DOC-003',
      nome: 'Licença Ambiental.pdf',
      tipo: 'Compliance',
      categoria: 'Ambiental',
      tamanho: '3.1 MB',
      dataUpload: '20/03/2024',
      status: 'expirado',
      dataVencimento: '20/03/2024'
    },
    {
      id: 'DOC-004',
      nome: 'Especificação Técnica - Equipamentos.pdf',
      tipo: 'Técnico',
      categoria: 'Especificações',
      tamanho: '5.2 MB',
      dataUpload: '12/05/2024',
      status: 'pendente',
      cliente: 'Petrobras S.A.'
    }
  ];

  const getStatusStyle = (status: string) => {
    const styles = {
      aprovado: 'bg-green-100 text-green-800',
      pendente: 'bg-yellow-100 text-yellow-800',
      rejeitado: 'bg-red-100 text-red-800',
      expirado: 'bg-orange-100 text-orange-800'
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const getTipoColor = (tipo: string) => {
    const colors = {
      Contrato: 'text-purple-600',
      Certificado: 'text-green-600',
      Fiscal: 'text-blue-600',
      Técnico: 'text-orange-600',
      Compliance: 'text-red-600'
    };
    return colors[tipo as keyof typeof colors] || 'text-gray-600';
  };

  const documentosFiltrados = documentos.filter(doc => {
    const termoMatch = doc.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
                     doc.categoria.toLowerCase().includes(termoBusca.toLowerCase()) ||
                     (doc.cliente && doc.cliente.toLowerCase().includes(termoBusca.toLowerCase()));
    const tipoMatch = filtroTipo === 'todos' || doc.tipo === filtroTipo;
    const statusMatch = filtroStatus === 'todos' || doc.status === filtroStatus;
    return termoMatch && tipoMatch && statusMatch;
  });

  const estatisticas = {
    total: documentos.length,
    aprovados: documentos.filter(d => d.status === 'aprovado').length,
    pendentes: documentos.filter(d => d.status === 'pendente').length,
    expirados: documentos.filter(d => d.status === 'expirado').length
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BackButton to="/portal-fornecedor" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-500" />
              Documentos
            </h1>
            <p className="text-gray-600">Gerencie seus documentos e certificações</p>
          </div>
        </div>
        
        <Button onClick={() => navigate('/documentos/upload')} className="bg-blue-600 hover:bg-blue-700">
          <Upload className="w-4 h-4 mr-2" />
          Upload Documento
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
            <CardTitle className="text-sm font-medium text-green-600">Aprovados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{estatisticas.aprovados}</div>
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
            <CardTitle className="text-sm font-medium text-orange-600">Expirados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{estatisticas.expirados}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Busca */}
      <div className="flex flex-wrap gap-4 items-center bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar documentos..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select 
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todos os Tipos</option>
            <option value="Contrato">Contrato</option>
            <option value="Certificado">Certificado</option>
            <option value="Fiscal">Fiscal</option>
            <option value="Técnico">Técnico</option>
            <option value="Compliance">Compliance</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <select 
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todos os Status</option>
            <option value="aprovado">Aprovado</option>
            <option value="pendente">Pendente</option>
            <option value="rejeitado">Rejeitado</option>
            <option value="expirado">Expirado</option>
          </select>
        </div>
      </div>

      {/* Lista de Documentos */}
      <div className="space-y-4">
        {documentosFiltrados.map((documento) => (
          <Card key={documento.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FileText className={`w-6 h-6 ${getTipoColor(documento.tipo)}`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">{documento.nome}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusStyle(documento.status)}`}>
                        {documento.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <span className="font-medium">Tipo:</span> 
                        <span className={getTipoColor(documento.tipo)}>{documento.tipo}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="font-medium">Categoria:</span> {documento.categoria}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="font-medium">Tamanho:</span> {documento.tamanho}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {documento.dataUpload}
                      </span>
                      {documento.cliente && (
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {documento.cliente}
                        </span>
                      )}
                    </div>
                    
                    {documento.dataVencimento && (
                      <div className="text-sm text-gray-500 mt-1">
                        <span className="font-medium">Vencimento:</span> {documento.dataVencimento}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/documentos/${documento.id}/visualizar`)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {/* Download logic */}}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => navigate(`/documentos/${documento.id}`)}
                  >
                    Detalhes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {documentosFiltrados.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum documento encontrado</h3>
          <p className="text-gray-500">Ajuste os filtros de busca ou faça upload de novos documentos</p>
        </div>
      )}
    </div>
  );
};

export default Documentos;

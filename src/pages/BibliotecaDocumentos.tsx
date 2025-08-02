
import React, { useState } from 'react';
import { Upload, Search, Filter, Eye, Download, Edit, Trash2, Plus, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UploadDocumentoModal } from '@/components/biblioteca/UploadDocumentoModal';
import { useBibliotecaDocumentos } from '@/hooks/useBibliotecaDocumentos';
import { FiltrosBiblioteca } from '@/types/biblioteca-documentos';
import { FINALIDADES_BIBLIOTECA, AREAS_BIBLIOTECA, TIPOS_ARQUIVO, MODULOS_SISTEMA } from '@/constants/biblioteca-constantes';

const BibliotecaDocumentos = () => {
  const { documentos, loading, buscarDocumentos, baixarDocumento, aprovarDocumento, rejeitarDocumento } = useBibliotecaDocumentos();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [filtros, setFiltros] = useState<FiltrosBiblioteca>({});

  // Extrair valores únicos dos documentos para os filtros
  const areas = [...new Set(documentos.map(doc => doc.area))];
  const finalidades = [...new Set(documentos.map(doc => doc.finalidade))];

  const handleFiltroChange = (campo: keyof FiltrosBiblioteca, valor: string) => {
    const novosFiltros = { ...filtros, [campo]: valor };
    setFiltros(novosFiltros);
    buscarDocumentos(novosFiltros);
  };

  const limparFiltros = () => {
    setFiltros({});
    buscarDocumentos();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aprovado':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejeitado':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovado':
        return 'bg-green-100 text-green-800';
      case 'rejeitado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Biblioteca Central
          </h1>
          <p className="text-muted-foreground mt-1">
            Repositório central e geral de documentos da organização
          </p>
        </div>
        <Button onClick={() => setShowUploadModal(true)}>
          <Upload className="h-4 w-4 mr-2" />
          Enviar Documento
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documentos.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {documentos.filter(d => d.status === 'aprovado').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {documentos.filter(d => d.status === 'pendente').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rejeitados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {documentos.filter(d => d.status === 'rejeitado').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar documentos..."
                value={filtros.busca || ''}
                onChange={(e) => handleFiltroChange('busca', e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select
              value={filtros.modulo || 'all'}
              onValueChange={(value) => handleFiltroChange('modulo', value === 'all' ? '' : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os módulos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os módulos</SelectItem>
                {MODULOS_SISTEMA.map(modulo => (
                  <SelectItem key={modulo} value={modulo}>{modulo}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={filtros.area || 'all'}
              onValueChange={(value) => handleFiltroChange('area', value === 'all' ? '' : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas as áreas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as áreas</SelectItem>
                {AREAS_BIBLIOTECA.map(area => (
                  <SelectItem key={area} value={area}>{area}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filtros.finalidade || 'all'}
              onValueChange={(value) => handleFiltroChange('finalidade', value === 'all' ? '' : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas as finalidades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as finalidades</SelectItem>
                {FINALIDADES_BIBLIOTECA.map(finalidade => (
                  <SelectItem key={finalidade} value={finalidade}>{finalidade}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filtros.tipo_arquivo || 'all'}
              onValueChange={(value) => handleFiltroChange('tipo_arquivo', value === 'all' ? '' : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {TIPOS_ARQUIVO.map(tipo => (
                  <SelectItem key={tipo} value={tipo}>{tipo.toUpperCase()}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filtros.status || 'all'}
              onValueChange={(value) => handleFiltroChange('status', value === 'all' ? '' : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="aprovado">Aprovado</SelectItem>
                <SelectItem value="rejeitado">Rejeitado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={limparFiltros}>
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de documentos */}
      <Card>
        <CardHeader>
          <CardTitle>Documentos ({documentos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Carregando documentos...</p>
            </div>
          ) : documentos.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhum documento encontrado</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Documento</TableHead>
                  <TableHead>Módulo</TableHead>
                  <TableHead>Área</TableHead>
                  <TableHead>Finalidade</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Tamanho</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documentos.map((documento) => (
                  <TableRow key={documento.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{documento.nome_original}</p>
                        {documento.descricao && (
                          <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                            {documento.descricao}
                          </p>
                        )}
                        {documento.tags && documento.tags.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {documento.tags.slice(0, 2).map((tag, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {documento.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{documento.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{documento.modulo || 'Geral'}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{documento.area}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{documento.finalidade}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground uppercase">
                        {documento.tipo_arquivo}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatFileSize(documento.tamanho_bytes)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(documento.status)}
                        <Badge className={getStatusColor(documento.status)}>
                          {documento.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {new Date(documento.criado_em).toLocaleDateString('pt-BR')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => window.open(documento.url_arquivo, '_blank')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => baixarDocumento(documento)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        {documento.status === 'pendente' && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => aprovarDocumento(documento.id)}
                            >
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => rejeitarDocumento(documento.id, 'Rejeitado pelo usuário')}
                            >
                              <XCircle className="h-4 w-4 text-red-600" />
                            </Button>
                          </>
                        )}
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal de Upload */}
      <UploadDocumentoModal
        open={showUploadModal}
        onOpenChange={setShowUploadModal}
      />
    </div>
  );
};

export default BibliotecaDocumentos;

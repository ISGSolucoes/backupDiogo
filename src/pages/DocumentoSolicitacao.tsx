
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileText, Upload, Calendar, AlertCircle, CheckCircle2, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BackButton } from '@/components/ui/back-button';

interface SolicitacaoDocumento {
  id: string;
  titulo: string;
  cliente: string;
  tipoDocumento: string;
  descricao: string;
  prazo: string;
  status: 'pendente' | 'em_andamento' | 'enviado' | 'aprovado' | 'rejeitado';
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  dataRecebimento: string;
  observacoes?: string;
  arquivos?: string[];
}

const DocumentoSolicitacao = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(null);

  // Mock data - em um app real viria de uma API
  const solicitacao: SolicitacaoDocumento = {
    id: id || 'SOL-2024-001',
    titulo: 'Atualização Certificado ISO 14001',
    cliente: 'Petrobras S.A.',
    tipoDocumento: 'Certificado Ambiental',
    descricao: 'Solicitação de atualização do certificado ISO 14001 para conformidade com novos requisitos ambientais da empresa.',
    prazo: '15/06/2024',
    status: 'pendente',
    prioridade: 'alta',
    dataRecebimento: '20/05/2024',
    observacoes: 'Certificado atual vence em 30/06/2024. É necessário providenciar a renovação com urgência.',
    arquivos: []
  };

  const getStatusStyle = (status: string) => {
    const styles = {
      pendente: 'bg-yellow-100 text-yellow-800',
      em_andamento: 'bg-blue-100 text-blue-800',
      enviado: 'bg-purple-100 text-purple-800',
      aprovado: 'bg-green-100 text-green-800',
      rejeitado: 'bg-red-100 text-red-800'
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const getPrioridadeStyle = (prioridade: string) => {
    const styles = {
      baixa: 'bg-gray-100 text-gray-800',
      media: 'bg-yellow-100 text-yellow-800',
      alta: 'bg-orange-100 text-orange-800',
      urgente: 'bg-red-100 text-red-800'
    };
    return styles[prioridade as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendente': return <Clock className="w-4 h-4" />;
      case 'em_andamento': return <AlertCircle className="w-4 h-4" />;
      case 'enviado': return <Upload className="w-4 h-4" />;
      case 'aprovado': return <CheckCircle2 className="w-4 h-4" />;
      case 'rejeitado': return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const handleArquivoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = event.target.files?.[0];
    if (arquivo) {
      setArquivoSelecionado(arquivo);
    }
  };

  const handleEnviarDocumento = () => {
    if (arquivoSelecionado) {
      // Lógica para enviar o documento
      console.log('Enviando documento:', arquivoSelecionado.name);
      // Aqui você faria o upload e atualizaria o status
      navigate('/documentos');
    }
  };

  const diasRestantes = () => {
    const hoje = new Date();
    const prazoDate = new Date(solicitacao.prazo.split('/').reverse().join('-'));
    const diferenca = Math.ceil((prazoDate.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    return diferenca;
  };

  const dias = diasRestantes();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <BackButton to="/documentos" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="h-8 w-8 text-blue-500" />
            Solicitação de Documento
          </h1>
          <p className="text-gray-600">#{solicitacao.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações Principais */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{solicitacao.titulo}</span>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${getStatusStyle(solicitacao.status)}`}>
                    {getStatusIcon(solicitacao.status)}
                    {solicitacao.status.replace('_', ' ')}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPrioridadeStyle(solicitacao.prioridade)}`}>
                    {solicitacao.prioridade}
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Cliente</label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-900">{solicitacao.cliente}</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Tipo de Documento</label>
                  <div className="flex items-center gap-2 mt-1">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-900">{solicitacao.tipoDocumento}</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Data de Recebimento</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-900">{solicitacao.dataRecebimento}</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Prazo</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className={`font-medium ${dias <= 3 ? 'text-red-600' : dias <= 7 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {solicitacao.prazo} ({dias > 0 ? `${dias} dias restantes` : `${Math.abs(dias)} dias em atraso`})
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Descrição</label>
                <p className="mt-1 text-gray-900 bg-gray-50 p-3 rounded-md">{solicitacao.descricao}</p>
              </div>
              
              {solicitacao.observacoes && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Observações</label>
                  <p className="mt-1 text-gray-900 bg-yellow-50 p-3 rounded-md border border-yellow-200">
                    {solicitacao.observacoes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upload de Documento */}
          <Card>
            <CardHeader>
              <CardTitle>Enviar Documento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-gray-600">Arraste e solte o arquivo aqui ou</p>
                  <label className="cursor-pointer">
                    <span className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                      Selecionar Arquivo
                    </span>
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={handleArquivoChange}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Formatos aceitos: PDF, DOC, DOCX, JPG, PNG (max. 10MB)
                </p>
              </div>
              
              {arquivoSelecionado && (
                <div className="bg-blue-50 p-4 rounded-md">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-blue-600" />
                    <div className="flex-1">
                      <p className="font-medium text-blue-900">{arquivoSelecionado.name}</p>
                      <p className="text-sm text-blue-600">
                        {(arquivoSelecionado.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setArquivoSelecionado(null)}
                    >
                      Remover
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3">
                <Button 
                  onClick={handleEnviarDocumento}
                  disabled={!arquivoSelecionado}
                  className="flex-1"
                >
                  Enviar Documento
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/documentos')}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar com informações adicionais */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status da Solicitação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-md">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-800">Aguardando documento</p>
                    <p className="text-sm text-yellow-600">Pendente desde {solicitacao.dataRecebimento}</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-1 ${dias <= 3 ? 'text-red-600' : dias <= 7 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {dias > 0 ? dias : 0}
                  </div>
                  <p className="text-sm text-gray-600">
                    {dias > 0 ? 'dias restantes' : 'dias em atraso'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate(`/documentos/solicitacao/${solicitacao.id}/historico`)}
              >
                Ver Histórico
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate(`/documentos/solicitacao/${solicitacao.id}/comentarios`)}
              >
                Adicionar Comentário
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate(`/documentos/solicitacao/${solicitacao.id}/prorrogar`)}
              >
                Solicitar Prorrogação
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DocumentoSolicitacao;

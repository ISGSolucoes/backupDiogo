
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  RefreshCw, 
  Users, 
  FileText, 
  Clock, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Link
} from 'lucide-react';
import { usePortalIntegration } from '@/hooks/usePortalIntegration';
import { useDocumentIntegration } from '@/hooks/useDocumentIntegration';

export const DashboardIntegracao: React.FC = () => {
  const { metricas, isLoading: loadingMetricas, testarConexao } = usePortalIntegration();
  const { documentos, getDocumentosPendentes } = useDocumentIntegration();

  const documentosPendentes = getDocumentosPendentes();

  if (loadingMetricas) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Integração Meu Portal de Negócios</h2>
        <Button 
          onClick={() => testarConexao.mutate()}
          variant="outline"
          size="sm"
          disabled={testarConexao.isPending}
        >
          {testarConexao.isPending ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Link className="h-4 w-4 mr-2" />
          )}
          Testar Conexão
        </Button>
      </div>

      {/* Status Connection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Status da Conexão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {metricas?.statusConexao === 'conectado' ? (
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Conectado
              </Badge>
            ) : (
              <Badge variant="destructive">
                <AlertCircle className="h-3 w-3 mr-1" />
                {metricas?.statusConexao === 'erro' ? 'Erro' : 'Desconectado'}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Fornecedores Ativos</span>
            </div>
            <div className="text-2xl font-bold">{metricas?.fornecedoresAtivos}</div>
            <div className="text-xs text-gray-500">de {metricas?.totalFornecedores} total</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Documentos Recebidos</span>
            </div>
            <div className="text-2xl font-bold">{metricas?.documentosRecebidos}</div>
            <div className="text-xs text-gray-500">total processados</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium">Pendentes</span>
            </div>
            <div className="text-2xl font-bold">{documentosPendentes.length}</div>
            <div className="text-xs text-gray-500">aguardando sincronização</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Tempo Médio</span>
            </div>
            <div className="text-2xl font-bold">{metricas?.tempoMedioResposta}h</div>
            <div className="text-xs text-gray-500">resposta fornecedor</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Documentos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {documentos.slice(0, 5).map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <div>
                    <div className="font-medium">{doc.titulo}</div>
                    <div className="text-sm text-gray-500">{doc.fornecedorNome}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {doc.tipo}
                  </Badge>
                  {doc.sincronizado ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Clock className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

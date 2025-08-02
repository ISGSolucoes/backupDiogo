
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useDocumentFlow } from './DocumentFlowProvider';

export const IntegracaoStatus: React.FC = () => {
  const { sincronizarDocumentos, estatisticasIntegracao } = useDocumentFlow();
  const [sincronizando, setSincronizando] = React.useState(false);

  const handleSincronizar = async () => {
    setSincronizando(true);
    try {
      await sincronizarDocumentos();
    } catch (error) {
      console.error('Erro na sincronização:', error);
    } finally {
      setSincronizando(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Status da Integração - Meu Portal de Negócios
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium">Pendentes</span>
            </div>
            <div className="text-2xl font-bold text-yellow-600">
              {estatisticasIntegracao.documentosPendentes}
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Processados</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {estatisticasIntegracao.documentosProcessados}
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <RefreshCw className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Última Sync</span>
            </div>
            <div className="text-xs text-gray-600">
              {new Date(estatisticasIntegracao.ultimaSincronizacao).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Conectado
            </Badge>
          </div>
          
          <Button 
            onClick={handleSincronizar}
            disabled={sincronizando}
            variant="outline"
            size="sm"
          >
            {sincronizando ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {sincronizando ? 'Sincronizando...' : 'Sincronizar Agora'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

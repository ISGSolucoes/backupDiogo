import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Play, 
  CheckCircle, 
  TrendingUp, 
  Zap, 
  Clock, 
  AlertCircle,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const TesteFluxoAutomatico = () => {
  const [testando, setTestando] = useState(false);
  const [ultimoTeste, setUltimoTeste] = useState<any>(null);
  const { toast } = useToast();

  const simularAprovacao = async (valor: number, numero: string) => {
    setTestando(true);
    
    try {
      // Simular aprovação de uma requisição com o valor especificado
      const destino = valor >= 1000 ? 'sourcing' : '3bids';
      
      // Registrar no histórico para demonstração
      await supabase
        .from('historico_requisicao')
        .insert({
          requisicao_id: '00000000-0000-0000-0000-000000000000', // ID fake para teste
          evento: 'simulacao_aprovacao',
          descricao: `Simulação: Requisição ${numero} aprovada e direcionada para ${destino === 'sourcing' ? 'Sourcing' : '3-Bids and Buy'} (valor: R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})`,
          usuario_nome: 'Teste Automático',
          origem: 'simulacao'
        });

      // Mostrar notificação
      if (destino === 'sourcing') {
        toast({
          title: "🎯 Nova Solicitação de Sourcing",
          description: `Requisição ${numero} aprovada e enviada para Sourcing automaticamente.`,
          duration: 5000,
        });
      } else {
        toast({
          title: "⚡ Processo Rápido Ativado",
          description: `Requisição ${numero} direcionada para 3-Bids and Buy.`,
          duration: 5000,
        });
      }

      setUltimoTeste({
        numero,
        valor,
        destino,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Erro na simulação:', error);
      toast({
        title: "Erro na Simulação",
        description: "Falha ao simular o fluxo automático",
        variant: "destructive"
      });
    } finally {
      setTestando(false);
    }
  };

  const cenariosTeste = [
    {
      numero: 'REQ-TESTE-001',
      valor: 500,
      descricao: 'Material de escritório básico',
      destino: '3-Bids & Buy',
      cor: 'blue'
    },
    {
      numero: 'REQ-TESTE-002', 
      valor: 2500,
      descricao: 'Equipamentos de TI',
      destino: 'Sourcing',
      cor: 'orange'
    },
    {
      numero: 'REQ-TESTE-003',
      valor: 15000,
      descricao: 'Mobiliário corporativo',
      destino: 'Sourcing',
      cor: 'orange'
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5 text-green-600" />
          Teste do Fluxo Automático
        </CardTitle>
        <p className="text-sm text-gray-600">
          Simule a aprovação de requisições para ver o direcionamento automático funcionando
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Regras de Negócio */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Regras Ativas:</strong> Valores ≤ R$ 1.000 → 3-Bids &amp; Buy | Valores &gt; R$ 1.000 → Sourcing
          </AlertDescription>
        </Alert>

        {/* Cenários de Teste */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Cenários de Teste</h4>
          
          {cenariosTeste.map((cenario, index) => (
            <div 
              key={index}
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-medium text-gray-900">
                      {cenario.numero}
                    </span>
                    <Badge className={`${
                      cenario.cor === 'blue' 
                        ? 'bg-blue-100 text-blue-700 border-blue-200' 
                        : 'bg-orange-100 text-orange-700 border-orange-200'
                    }`}>
                      R$ {cenario.valor.toLocaleString('pt-BR')}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    {cenario.descricao}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs">
                    <ArrowRight className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-500">Será direcionado para:</span>
                    <Badge variant="outline" className={`${
                      cenario.cor === 'blue'
                        ? 'text-blue-700 border-blue-200'
                        : 'text-orange-700 border-orange-200'
                    }`}>
                      {cenario.cor === 'blue' ? (
                        <>
                          <Zap className="h-3 w-3 mr-1" /> 3-Bids &amp; Buy
                        </>
                      ) : (
                        <>
                          <TrendingUp className="h-3 w-3 mr-1" /> Sourcing
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
                
                <Button
                  onClick={() => simularAprovacao(cenario.valor, cenario.numero)}
                  disabled={testando}
                  size="sm"
                  className="gap-2"
                >
                  {testando ? (
                    <RefreshCw className="h-3 w-3 animate-spin" />
                  ) : (
                    <Play className="h-3 w-3" />
                  )}
                  Simular
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Resultado do Último Teste */}
        {ultimoTeste && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-green-800 mb-1">
                  Simulação Executada com Sucesso!
                </h4>
                <div className="text-sm text-green-700">
                  <p>
                    <strong>{ultimoTeste.numero}</strong> (R$ {ultimoTeste.valor.toLocaleString('pt-BR')}) 
                    foi direcionada para <strong>{ultimoTeste.destino === 'sourcing' ? 'Sourcing' : '3-Bids & Buy'}</strong>
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {new Date(ultimoTeste.timestamp).toLocaleTimeString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instruções */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Clique em "Simular" para testar cada cenário</p>
          <p>• Observe as notificações toast que aparecem</p>
          <p>• Veja o contador no menu de Sourcing se atualizar</p>
          <p>• Verifique os badges na tabela de requisições</p>
        </div>
      </CardContent>
    </Card>
  );
};
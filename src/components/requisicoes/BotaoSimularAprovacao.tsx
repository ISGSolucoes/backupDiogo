import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  CheckCircle, 
  X, 
  Clock, 
  AlertTriangle, 
  RefreshCw 
} from 'lucide-react';

interface Requisicao {
  id: string;
  numero_requisicao: string;
  status: string;
  valor_estimado: number;
}

export const BotaoSimularAprovacao = () => {
  const [carregando, setCarregando] = useState(false);
  const { toast } = useToast();

  const buscarRequisicaoPendente = async (): Promise<Requisicao | null> => {
    try {
      const { data, error } = await supabase
        .from('requisicoes')
        .select('id, numero_requisicao, status, valor_estimado')
        .eq('status', 'em_aprovacao')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erro ao buscar requisição:', error);
      return null;
    }
  };

  const aprovarRequisicao = async (requisicao: Requisicao) => {
    try {
      const { error } = await supabase
        .from('requisicoes')
        .update({ 
          status: 'aprovada',
          data_aprovacao: new Date().toISOString(),
          aprovador_atual_nome: 'Teste Automático'
        })
        .eq('id', requisicao.id);

      if (error) throw error;

      // Mostrar notificação baseada no valor
      const destino = requisicao.valor_estimado >= 1000 ? 'Sourcing' : '3-Bids & Buy';
      
      toast({
        title: destino === 'Sourcing' ? "🎯 Nova Solicitação de Sourcing" : "⚡ Processo Rápido Ativado",
        description: `${requisicao.numero_requisicao} aprovada e direcionada para ${destino}.`,
        duration: 5000,
      });

      return true;
    } catch (error) {
      console.error('Erro ao aprovar requisição:', error);
      toast({
        title: "Erro na Aprovação",
        description: "Falha ao aprovar a requisição",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleSimularAprovacao = async () => {
    setCarregando(true);
    
    try {
      const requisicao = await buscarRequisicaoPendente();
      
      if (!requisicao) {
        toast({
          title: "Nenhuma Requisição Pendente",
          description: "Não há requisições em aprovação para testar o fluxo",
          variant: "destructive"
        });
        return;
      }

      const sucesso = await aprovarRequisicao(requisicao);
      
      if (sucesso) {
        // Dar um tempo para ver a notificação antes de mostrar o resultado
        setTimeout(() => {
          toast({
            title: "✅ Teste Concluído",
            description: `Fluxo automático ativado para ${requisicao.numero_requisicao}`,
          });
        }, 1000);
      }
      
    } catch (error) {
      console.error('Erro na simulação:', error);
      toast({
        title: "Erro na Simulação",
        description: "Falha ao executar o teste",
        variant: "destructive"
      });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Button
      onClick={handleSimularAprovacao}
      disabled={carregando}
      className="gap-2 bg-green-600 hover:bg-green-700 text-white"
      size="sm"
    >
      {carregando ? (
        <RefreshCw className="h-4 w-4 animate-spin" />
      ) : (
        <CheckCircle className="h-4 w-4" />
      )}
      {carregando ? 'Testando...' : 'Simular Aprovação'}
    </Button>
  );
};
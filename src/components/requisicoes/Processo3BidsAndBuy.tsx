import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Zap, 
  Plus, 
  DollarSign, 
  Clock, 
  CheckCircle,
  X,
  FileText,
  Send
} from 'lucide-react';
import { useRequisicoes } from '@/hooks/useRequisicoes';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CotacaoRapida {
  fornecedor_nome: string;
  fornecedor_email: string;
  valor_cotado: number;
  prazo_entrega: string;
  observacoes?: string;
}

export const Processo3BidsAndBuy = () => {
  const { requisicoes } = useRequisicoes();
  const { toast } = useToast();
  const [requisicaoSelecionada, setRequisicaoSelecionada] = useState<string | null>(null);
  const [cotacoes, setCotacoes] = useState<CotacaoRapida[]>([]);
  const [novaColeta, setNovaColeta] = useState(false);
  const [processando, setProcessando] = useState(false);

  // Filtrar requisições aprovadas ≤ R$ 1.000
  const requisicoesElegiveis = requisicoes.filter(req => 
    req.status === 'aprovada' && 
    req.valor_estimado <= 1000 &&
    !req.observacoes?.includes('3bids_processado')
  );

  const adicionarCotacao = () => {
    setCotacoes([...cotacoes, {
      fornecedor_nome: '',
      fornecedor_email: '',
      valor_cotado: 0,
      prazo_entrega: '',
      observacoes: ''
    }]);
  };

  const atualizarCotacao = (index: number, campo: keyof CotacaoRapida, valor: any) => {
    const novasCotacoes = [...cotacoes];
    novasCotacoes[index] = { ...novasCotacoes[index], [campo]: valor };
    setCotacoes(novasCotacoes);
  };

  const removerCotacao = (index: number) => {
    setCotacoes(cotacoes.filter((_, i) => i !== index));
  };

  const finalizarCotacao = async () => {
    if (!requisicaoSelecionada || cotacoes.length < 3) {
      toast({
        title: "Erro",
        description: "Selecione uma requisição e adicione pelo menos 3 cotações",
        variant: "destructive"
      });
      return;
    }

    setProcessando(true);
    try {
      const requisicao = requisicoes.find(r => r.id === requisicaoSelecionada);
      if (!requisicao) throw new Error('Requisição não encontrada');

      // Encontrar melhor cotação
      const melhorCotacao = cotacoes.reduce((melhor, atual) => 
        atual.valor_cotado < melhor.valor_cotado ? atual : melhor
      );

      // Criar pedido automaticamente baseado na melhor cotação
      const { data: pedido, error: pedidoError } = await supabase
        .from('pedidos')
        .insert({
          origem_demanda: '3bids',
          requisicao_id: requisicaoSelecionada,
          fornecedor_id: melhorCotacao.fornecedor_email, // Usando email como ID temporário
          fornecedor_razao_social: melhorCotacao.fornecedor_nome,
          numero_pedido: `TMP-${Date.now()}`, // Será gerado automaticamente pelo trigger
          criado_por: requisicao.solicitante_id,
          centro_custo: requisicao.centro_custo,
          data_entrega_solicitada: new Date(Date.now() + parseInt(melhorCotacao.prazo_entrega) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          data_entrega_prevista: new Date(Date.now() + parseInt(melhorCotacao.prazo_entrega) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          observacoes: `Criado via 3-Bids & Buy. Cotações coletadas: ${cotacoes.length}`,
          status: 'rascunho',
          tipo: 'material',
          moeda: 'BRL',
          valor_total: melhorCotacao.valor_cotado
        })
        .select()
        .single();

      if (pedidoError) throw pedidoError;

      // Atualizar status da requisição
      await supabase
        .from('requisicoes')
        .update({ 
          status: 'em_cotacao',
          observacoes: (requisicao.observacoes || '') + ' #3bids_processado'
        })
        .eq('id', requisicaoSelecionada);

      // Registrar no histórico
      await supabase
        .from('historico_requisicao')
        .insert({
          requisicao_id: requisicaoSelecionada,
          evento: 'cotacao_3bids_finalizada',
          descricao: `3-Bids & Buy finalizado. Melhor cotação: ${melhorCotacao.fornecedor_nome} - R$ ${melhorCotacao.valor_cotado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
          usuario_nome: 'Sistema 3-Bids',
          origem: '3bids_automatico'
        });

      toast({
        title: "✅ 3-Bids & Buy Finalizado",
        description: `Pedido criado automaticamente com ${melhorCotacao.fornecedor_nome}`,
      });

      // Reset
      setRequisicaoSelecionada(null);
      setCotacoes([]);
      setNovaColeta(false);

    } catch (error) {
      console.error('Erro ao finalizar 3-Bids:', error);
      toast({
        title: "Erro",
        description: "Falha ao finalizar o processo 3-Bids",
        variant: "destructive"
      });
    } finally {
      setProcessando(false);
    }
  };

  if (requisicoesElegiveis.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Zap className="h-12 w-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            Nenhuma Requisição Elegível
          </h3>
          <p className="text-gray-500">
            Não há requisições aprovadas ≤ R$ 1.000 para processo 3-Bids & Buy
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            3-Bids & Buy - Cotação Rápida
          </CardTitle>
          <p className="text-sm text-gray-600">
            Processo acelerado para requisições até R$ 1.000
          </p>
        </CardHeader>
      </Card>

      {/* Seleção de Requisição */}
      {!novaColeta && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Selecionar Requisição</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {requisicoesElegiveis.map((req) => (
              <div 
                key={req.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  requisicaoSelecionada === req.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setRequisicaoSelecionada(req.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{req.numero_requisicao}</h4>
                    <p className="text-sm text-gray-600 mt-1">{req.titulo}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                      <span>Solicitante: {req.solicitante_nome}</span>
                      <span>Área: {req.solicitante_area}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-blue-100 text-blue-700 mb-2">
                      R$ {req.valor_estimado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Badge>
                    <p className="text-xs text-gray-500">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {new Date(req.data_necessidade).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            <Button 
              onClick={() => setNovaColeta(true)}
              disabled={!requisicaoSelecionada}
              className="w-full"
            >
              <Send className="h-4 w-4 mr-2" />
              Iniciar Coleta de Cotações
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Coleta de Cotações */}
      {novaColeta && requisicaoSelecionada && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Cotações Coletadas ({cotacoes.length}/3 mínimo)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cotacoes.map((cotacao, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <h5 className="font-medium">Cotação #{index + 1}</h5>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removerCotacao(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Fornecedor</Label>
                    <Input 
                      value={cotacao.fornecedor_nome}
                      onChange={(e) => atualizarCotacao(index, 'fornecedor_nome', e.target.value)}
                      placeholder="Nome do fornecedor"
                    />
                  </div>
                  <div>
                    <Label>E-mail</Label>
                    <Input 
                      type="email"
                      value={cotacao.fornecedor_email}
                      onChange={(e) => atualizarCotacao(index, 'fornecedor_email', e.target.value)}
                      placeholder="contato@fornecedor.com"
                    />
                  </div>
                  <div>
                    <Label>Valor Cotado (R$)</Label>
                    <Input 
                      type="number"
                      step="0.01"
                      value={cotacao.valor_cotado}
                      onChange={(e) => atualizarCotacao(index, 'valor_cotado', parseFloat(e.target.value) || 0)}
                      placeholder="0,00"
                    />
                  </div>
                  <div>
                    <Label>Prazo (dias)</Label>
                    <Input 
                      value={cotacao.prazo_entrega}
                      onChange={(e) => atualizarCotacao(index, 'prazo_entrega', e.target.value)}
                      placeholder="Ex: 5"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <Label>Observações</Label>
                  <Textarea 
                    value={cotacao.observacoes}
                    onChange={(e) => atualizarCotacao(index, 'observacoes', e.target.value)}
                    placeholder="Condições especiais, etc."
                    rows={2}
                  />
                </div>
              </div>
            ))}
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={adicionarCotacao}
                className="flex-1"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Cotação
              </Button>
              
              {cotacoes.length >= 3 && (
                <Button 
                  onClick={finalizarCotacao}
                  disabled={processando}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {processando ? 'Finalizando...' : 'Finalizar 3-Bids'}
                </Button>
              )}
            </div>
            
            <Button 
              variant="ghost" 
              onClick={() => {
                setNovaColeta(false);
                setCotacoes([]);
              }}
              className="w-full"
            >
              Voltar à Seleção
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
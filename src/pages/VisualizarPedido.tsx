import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Download, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Pedido, StatusPedido, StatusLabels, StatusColors, TipoLabels } from '@/types/pedido';
import { Skeleton } from '@/components/ui/skeleton';

export default function VisualizarPedido() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      carregarPedido();
    }
  }, [id]);

  const carregarPedido = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pedidos')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setPedido(data);
    } catch (error) {
      console.error('Erro ao carregar pedido:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o pedido",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBaixarPDF = () => {
    toast({
      title: "PDF",
      description: "Gerando PDF do pedido...",
    });
    // TODO: Implementar geração de PDF
  };

  const handleAlterarStatus = async (novoStatus: StatusPedido) => {
    try {
      const { error } = await supabase
        .from('pedidos')
        .update({ 
          status: novoStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Status alterado para ${StatusLabels[novoStatus]}`,
      });
      
      await carregarPedido();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-10 w-10" />
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Pedido não encontrado</h1>
          <Button onClick={() => navigate('/pedidos')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Pedidos
          </Button>
        </div>
      </div>
    );
  }

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const formatarDataHora = (data: string) => {
    return new Date(data).toLocaleString('pt-BR');
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/pedidos')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Detalhes do Pedido</h1>
            <p className="text-muted-foreground">
              {pedido.numero_pedido} • Fornecedor: {pedido.fornecedor_id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge className={StatusColors[pedido.status]}>
            {StatusLabels[pedido.status]}
          </Badge>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/pedidos/${id}/editar`)}
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              Editar
            </Button>
            
            <Button
              variant="outline"
              onClick={handleBaixarPDF}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Baixar PDF
            </Button>
            
            {pedido.status === 'rascunho' && (
              <Button
                onClick={() => handleAlterarStatus('aguardando_aprovacao')}
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                Enviar para Aprovação
              </Button>
            )}
            
            {pedido.status === 'aguardando_aprovacao' && (
              <Button
                onClick={() => handleAlterarStatus('aprovado')}
                className="gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                Aprovar
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Gerais</CardTitle>
            <CardDescription>
              Detalhes básicos do pedido
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Número do Pedido</label>
                <p className="text-lg font-medium mt-1">{pedido.numero_pedido}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Fornecedor</label>
                <p className="text-lg font-medium mt-1">{pedido.fornecedor_id}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tipo</label>
                <div className="mt-1">
                  <Badge variant="outline">
                    {TipoLabels[pedido.tipo]}
                  </Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  <Badge className={StatusColors[pedido.status]}>
                    {StatusLabels[pedido.status]}
                  </Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Valor Total</label>
                <p className="text-lg font-bold text-primary mt-1">
                  {formatarMoeda(pedido.valor_total)}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Moeda</label>
                <p className="text-lg font-medium mt-1">{pedido.moeda}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Datas Importantes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Data de Criação</label>
                <p className="mt-1">{formatarDataHora(pedido.data_criacao)}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Data de Entrega Solicitada</label>
                <p className="mt-1">{formatarData(pedido.data_entrega_solicitada)}</p>
              </div>
              
              {pedido.data_aprovacao && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Data de Aprovação</label>
                  <p className="mt-1">{formatarDataHora(pedido.data_aprovacao)}</p>
                </div>
              )}
              
              {pedido.data_envio_portal && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Data de Envio ao Portal</label>
                  <p className="mt-1">{formatarDataHora(pedido.data_envio_portal)}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações Comerciais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pedido.condicoes_pagamento && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Condições de Pagamento</label>
                  <p className="mt-1">{pedido.condicoes_pagamento}</p>
                </div>
              )}
              
              {pedido.centro_custo && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Centro de Custo</label>
                  <p className="mt-1">{pedido.centro_custo}</p>
                </div>
              )}
              
              {pedido.portal_pedido_id && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">ID no Portal</label>
                  <p className="mt-1">{pedido.portal_pedido_id}</p>
                </div>
              )}
              
              {pedido.status_portal && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status no Portal</label>
                  <p className="mt-1">{pedido.status_portal}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {pedido.observacoes && (
          <Card>
            <CardHeader>
              <CardTitle>Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {pedido.observacoes}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Placeholder para itens do pedido */}
        <Card>
          <CardHeader>
            <CardTitle>Itens do Pedido</CardTitle>
            <CardDescription>
              Lista dos itens incluídos neste pedido
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <p>Lista de itens será implementada aqui</p>
              <p className="text-sm mt-2">
                Incluirá tabela com produtos, quantidades, preços, etc.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  Check, 
  X, 
  Edit, 
  Calendar, 
  DollarSign, 
  Package, 
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useConfirmacaoPortal, ItemPedidoPortal, PedidoPortal } from "@/hooks/useConfirmacaoPortal";
import { useToast } from "@/hooks/use-toast";

interface ConfirmacaoPedidoProps {
  pedido: PedidoPortal;
  onPedidoAtualizado: () => void;
}

interface ConfirmacaoItemFormData {
  status: 'confirmado' | 'alterado' | 'recusado';
  prazo_proposto?: number;
  preco_proposto?: number;
  observacoes?: string;
}

export const ConfirmacaoPedido = ({ pedido, onPedidoAtualizado }: ConfirmacaoPedidoProps) => {
  const { confirmarItemPedido, confirmarPedidoCompleto } = useConfirmacaoPortal();
  const { toast } = useToast();
  const [itemEditando, setItemEditando] = useState<string | null>(null);
  const [formData, setFormData] = useState<ConfirmacaoItemFormData>({
    status: 'confirmado'
  });
  const [observacoesGerais, setObservacoesGerais] = useState('');
  const [processando, setProcessando] = useState(false);

  const handleConfirmarItem = async (item: ItemPedidoPortal, dados: ConfirmacaoItemFormData) => {
    try {
      const resultado = await confirmarItemPedido(pedido.id, item.id, dados);
      
      if (resultado.success) {
        toast({
          title: "Item Confirmado",
          description: `Item ${item.sequencia} foi ${dados.status === 'confirmado' ? 'confirmado' : dados.status === 'alterado' ? 'alterado' : 'recusado'} com sucesso.`
        });
        setItemEditando(null);
        onPedidoAtualizado();
      } else {
        throw new Error(resultado.error);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: `Erro ao confirmar item: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const handleConfirmarPedidoCompleto = async () => {
    setProcessando(true);
    try {
      const resultado = await confirmarPedidoCompleto(pedido.id, observacoesGerais);
      
      if (resultado.success) {
        toast({
          title: "Pedido Confirmado",
          description: "Pedido foi processado com sucesso!"
        });
        onPedidoAtualizado();
      } else {
        throw new Error(resultado.error);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: `Erro ao confirmar pedido: ${error.message}`,
        variant: "destructive"
      });
    }
    setProcessando(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmado':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'alterado':
        return <Edit className="h-4 w-4 text-amber-600" />;
      case 'recusado':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmado':
        return <Badge variant="default" className="bg-green-100 text-green-800">Confirmado</Badge>;
      case 'alterado':
        return <Badge variant="default" className="bg-amber-100 text-amber-800">Alterado</Badge>;
      case 'recusado':
        return <Badge variant="destructive">Recusado</Badge>;
      default:
        return <Badge variant="outline">Pendente</Badge>;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const itensConfirmados = pedido.itens.filter(item => item.status_confirmacao !== 'pendente').length;
  const progresso = (itensConfirmados / pedido.itens.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header do Pedido */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Pedido {pedido.numero_pedido}</span>
            <Badge variant={pedido.status === 'enviado' ? 'default' : 'secondary'}>
              {pedido.status}
            </Badge>
          </CardTitle>
          <CardDescription>
            Confirme cada item do pedido individualmente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Valor Total</p>
                <p className="font-semibold">{formatCurrency(pedido.valor_total)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Entrega Prevista</p>
                <p className="font-semibold">
                  {new Date(pedido.data_entrega_prevista).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Progresso</p>
                <p className="font-semibold">{itensConfirmados}/{pedido.itens.length} itens</p>
              </div>
            </div>
          </div>

          {/* Barra de Progresso */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progresso}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Itens */}
      <div className="space-y-4">
        {pedido.itens.map((item) => (
          <Card key={item.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  Item {item.sequencia}: {item.descricao}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {getStatusIcon(item.status_confirmacao)}
                  {getStatusBadge(item.status_confirmacao)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Quantidade</p>
                  <p className="font-medium">{item.quantidade}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Preço Unitário</p>
                  <p className="font-medium">{formatCurrency(item.preco_unitario)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                  <p className="font-medium">{formatCurrency(item.valor_total)}</p>
                </div>
              </div>

              {item.status_confirmacao === 'pendente' && (
                <div className="space-y-4">
                  {itemEditando === item.id ? (
                    <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor={`status-${item.id}`}>Ação</Label>
                          <select
                            id={`status-${item.id}`}
                            value={formData.status}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              status: e.target.value as any 
                            }))}
                            className="w-full p-2 border rounded-md"
                          >
                            <option value="confirmado">Confirmar</option>
                            <option value="alterado">Propor Alteração</option>
                            <option value="recusado">Recusar</option>
                          </select>
                        </div>

                        {formData.status === 'alterado' && (
                          <>
                            <div>
                              <Label htmlFor={`prazo-${item.id}`}>Novo Prazo (dias)</Label>
                              <Input
                                id={`prazo-${item.id}`}
                                type="number"
                                value={formData.prazo_proposto || ''}
                                onChange={(e) => setFormData(prev => ({ 
                                  ...prev, 
                                  prazo_proposto: parseInt(e.target.value) 
                                }))}
                                placeholder={item.prazo_entrega_original.toString()}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`preco-${item.id}`}>Novo Preço Unitário</Label>
                              <Input
                                id={`preco-${item.id}`}
                                type="number"
                                step="0.01"
                                value={formData.preco_proposto || ''}
                                onChange={(e) => setFormData(prev => ({ 
                                  ...prev, 
                                  preco_proposto: parseFloat(e.target.value) 
                                }))}
                                placeholder={item.preco_unitario.toString()}
                              />
                            </div>
                          </>
                        )}
                      </div>

                      <div>
                        <Label htmlFor={`obs-${item.id}`}>Observações</Label>
                        <Textarea
                          id={`obs-${item.id}`}
                          value={formData.observacoes || ''}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            observacoes: e.target.value 
                          }))}
                          placeholder="Observações sobre este item..."
                          rows={2}
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleConfirmarItem(item, formData)}
                          className="flex-1"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Confirmar
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setItemEditando(null);
                            setFormData({ status: 'confirmado' });
                          }}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleConfirmarItem(item, { status: 'confirmado' })}
                        className="flex-1"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Confirmar
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setItemEditando(item.id);
                          setFormData({ status: 'confirmado' });
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Alterar/Recusar
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {item.status_confirmacao !== 'pendente' && (
                <div className="space-y-2">
                  {item.prazo_proposto && (
                    <p className="text-sm">
                      <strong>Prazo Proposto:</strong> {item.prazo_proposto} dias
                    </p>
                  )}
                  {item.preco_proposto && (
                    <p className="text-sm">
                      <strong>Preço Proposto:</strong> {formatCurrency(item.preco_proposto)}
                    </p>
                  )}
                  {item.observacoes_fornecedor && (
                    <p className="text-sm">
                      <strong>Observações:</strong> {item.observacoes_fornecedor}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Finalização do Pedido */}
      {itensConfirmados === pedido.itens.length && (
        <Card>
          <CardHeader>
            <CardTitle>Finalizar Confirmação</CardTitle>
            <CardDescription>
              Todos os itens foram processados. Confirme o pedido para finalizar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="obs-gerais">Observações Gerais (opcional)</Label>
                <Textarea
                  id="obs-gerais"
                  value={observacoesGerais}
                  onChange={(e) => setObservacoesGerais(e.target.value)}
                  placeholder="Observações gerais sobre o pedido..."
                  rows={3}
                />
              </div>

              <Button
                onClick={handleConfirmarPedidoCompleto}
                disabled={processando}
                className="w-full"
                size="lg"
              >
                {processando ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirmar Pedido Completo
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
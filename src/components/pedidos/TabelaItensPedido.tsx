import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface ItemPedido {
  id?: string;
  sequencia: number;
  codigo_produto?: string;
  codigo_interno?: string;
  descricao: string;
  especificacao?: string;
  quantidade: number;
  unidade: string;
  preco_unitario: number;
  valor_total: number;
  data_entrega_item?: string;
  local_entrega?: string;
  categoria_familia?: string;
  projeto_atividade?: string;
  observacoes_tecnicas?: string;
  aceita_fracionamento?: boolean;
  tolerancia_atraso?: number;
  codigo_fornecedor?: string;
  especificacao_tecnica?: string;
  lote_serie?: string;
  centro_custo_item?: string;
}

interface TabelaItensPedidoProps {
  itens: ItemPedido[];
  onItemsChange: (itens: ItemPedido[]) => void;
  readonly?: boolean;
}

export function TabelaItensPedido({ itens, onItemsChange, readonly = false }: TabelaItensPedidoProps) {
  const [itemEdicao, setItemEdicao] = useState<ItemPedido | null>(null);
  const [dialogAberto, setDialogAberto] = useState(false);

  const novoItem = (): ItemPedido => ({
    sequencia: itens.length + 1,
    descricao: '',
    quantidade: 1,
    unidade: 'UN',
    preco_unitario: 0,
    valor_total: 0,
    aceita_fracionamento: false,
    tolerancia_atraso: 2
  });

  const adicionarItem = () => {
    setItemEdicao(novoItem());
    setDialogAberto(true);
  };

  const editarItem = (item: ItemPedido) => {
    setItemEdicao({ ...item });
    setDialogAberto(true);
  };

  const excluirItem = (sequencia: number) => {
    const novosItens = itens
      .filter(item => item.sequencia !== sequencia)
      .map((item, index) => ({ ...item, sequencia: index + 1 }));
    onItemsChange(novosItens);
  };

  const salvarItem = () => {
    if (!itemEdicao) return;

    const itemCompleto = {
      ...itemEdicao,
      valor_total: itemEdicao.quantidade * itemEdicao.preco_unitario
    };

    if (itemCompleto.id || itens.some(i => i.sequencia === itemCompleto.sequencia)) {
      // Editar item existente
      const novosItens = itens.map(item => 
        item.sequencia === itemCompleto.sequencia ? itemCompleto : item
      );
      onItemsChange(novosItens);
    } else {
      // Novo item
      onItemsChange([...itens, itemCompleto]);
    }

    setDialogAberto(false);
    setItemEdicao(null);
  };

  const calcularValorTotal = () => {
    return itens.reduce((total, item) => total + item.valor_total, 0);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Itens do Pedido</CardTitle>
          {!readonly && (
            <Button onClick={adicionarItem} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Item
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Seq.</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="w-20">Qtd</TableHead>
              <TableHead className="w-16">Un.</TableHead>
              <TableHead className="w-32">Preço Unit.</TableHead>
              <TableHead className="w-32">Total</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Centro Custo</TableHead>
              {!readonly && <TableHead className="w-24">Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {itens.map((item) => (
              <TableRow key={item.sequencia}>
                <TableCell>{item.sequencia}</TableCell>
                <TableCell>{item.codigo_produto || item.codigo_interno}</TableCell>
                <TableCell className="max-w-xs truncate" title={item.descricao}>
                  {item.descricao}
                </TableCell>
                <TableCell>{item.quantidade}</TableCell>
                <TableCell>{item.unidade}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(item.preco_unitario)}
                </TableCell>
                <TableCell>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(item.valor_total)}
                </TableCell>
                <TableCell>{item.categoria_familia}</TableCell>
                <TableCell>{item.centro_custo_item}</TableCell>
                {!readonly && (
                  <TableCell>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => editarItem(item)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => excluirItem(item.sequencia)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {itens.length === 0 && (
              <TableRow>
                <TableCell colSpan={readonly ? 9 : 10} className="text-center text-muted-foreground">
                  Nenhum item adicionado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {itens.length > 0 && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Geral:</span>
              <span className="text-lg font-bold">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(calcularValorTotal())}
              </span>
            </div>
          </div>
        )}

        {/* Dialog para edição de item */}
        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {itemEdicao?.id ? 'Editar Item' : 'Novo Item'}
              </DialogTitle>
            </DialogHeader>
            
            {itemEdicao && (
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Código do Produto</label>
                  <Input
                    value={itemEdicao.codigo_produto || ''}
                    onChange={(e) => setItemEdicao({
                      ...itemEdicao,
                      codigo_produto: e.target.value
                    })}
                    placeholder="Código do catálogo"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Código Interno</label>
                  <Input
                    value={itemEdicao.codigo_interno || ''}
                    onChange={(e) => setItemEdicao({
                      ...itemEdicao,
                      codigo_interno: e.target.value
                    })}
                    placeholder="Código interno"
                  />
                </div>
                
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-medium">Descrição *</label>
                  <Textarea
                    value={itemEdicao.descricao}
                    onChange={(e) => setItemEdicao({
                      ...itemEdicao,
                      descricao: e.target.value
                    })}
                    placeholder="Descrição do item"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quantidade *</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={itemEdicao.quantidade}
                    onChange={(e) => setItemEdicao({
                      ...itemEdicao,
                      quantidade: parseFloat(e.target.value) || 0,
                      valor_total: (parseFloat(e.target.value) || 0) * itemEdicao.preco_unitario
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Unidade *</label>
                  <Select
                    value={itemEdicao.unidade}
                    onValueChange={(value) => setItemEdicao({
                      ...itemEdicao,
                      unidade: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UN">Unidade</SelectItem>
                      <SelectItem value="KG">Quilograma</SelectItem>
                      <SelectItem value="M">Metro</SelectItem>
                      <SelectItem value="M2">Metro Quadrado</SelectItem>
                      <SelectItem value="M3">Metro Cúbico</SelectItem>
                      <SelectItem value="L">Litro</SelectItem>
                      <SelectItem value="CX">Caixa</SelectItem>
                      <SelectItem value="PC">Peça</SelectItem>
                      <SelectItem value="PAR">Par</SelectItem>
                      <SelectItem value="SERV">Serviço</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Preço Unitário *</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={itemEdicao.preco_unitario}
                    onChange={(e) => setItemEdicao({
                      ...itemEdicao,
                      preco_unitario: parseFloat(e.target.value) || 0,
                      valor_total: itemEdicao.quantidade * (parseFloat(e.target.value) || 0)
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Valor Total</label>
                  <Input
                    value={new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(itemEdicao.valor_total)}
                    disabled
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Categoria/Família</label>
                  <Input
                    value={itemEdicao.categoria_familia || ''}
                    onChange={(e) => setItemEdicao({
                      ...itemEdicao,
                      categoria_familia: e.target.value
                    })}
                    placeholder="Categoria do item"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Centro de Custo</label>
                  <Input
                    value={itemEdicao.centro_custo_item || ''}
                    onChange={(e) => setItemEdicao({
                      ...itemEdicao,
                      centro_custo_item: e.target.value
                    })}
                    placeholder="Centro de custo específico"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Projeto/Atividade</label>
                  <Input
                    value={itemEdicao.projeto_atividade || ''}
                    onChange={(e) => setItemEdicao({
                      ...itemEdicao,
                      projeto_atividade: e.target.value
                    })}
                    placeholder="Projeto ou atividade"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Data de Entrega</label>
                  <Input
                    type="date"
                    value={itemEdicao.data_entrega_item || ''}
                    onChange={(e) => setItemEdicao({
                      ...itemEdicao,
                      data_entrega_item: e.target.value
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Local de Entrega</label>
                  <Input
                    value={itemEdicao.local_entrega || ''}
                    onChange={(e) => setItemEdicao({
                      ...itemEdicao,
                      local_entrega: e.target.value
                    })}
                    placeholder="Local específico de entrega"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Código do Fornecedor</label>
                  <Input
                    value={itemEdicao.codigo_fornecedor || ''}
                    onChange={(e) => setItemEdicao({
                      ...itemEdicao,
                      codigo_fornecedor: e.target.value
                    })}
                    placeholder="Código no sistema do fornecedor"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Lote/Série</label>
                  <Input
                    value={itemEdicao.lote_serie || ''}
                    onChange={(e) => setItemEdicao({
                      ...itemEdicao,
                      lote_serie: e.target.value
                    })}
                    placeholder="Informações de lote ou série"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tolerância de Atraso (dias)</label>
                  <Input
                    type="number"
                    value={itemEdicao.tolerancia_atraso || 2}
                    onChange={(e) => setItemEdicao({
                      ...itemEdicao,
                      tolerancia_atraso: parseInt(e.target.value) || 2
                    })}
                  />
                </div>
                
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-medium">Especificação Técnica</label>
                  <Textarea
                    value={itemEdicao.especificacao_tecnica || ''}
                    onChange={(e) => setItemEdicao({
                      ...itemEdicao,
                      especificacao_tecnica: e.target.value
                    })}
                    placeholder="Especificações técnicas detalhadas"
                  />
                </div>
                
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-medium">Observações Técnicas</label>
                  <Textarea
                    value={itemEdicao.observacoes_tecnicas || ''}
                    onChange={(e) => setItemEdicao({
                      ...itemEdicao,
                      observacoes_tecnicas: e.target.value
                    })}
                    placeholder="Observações específicas do item"
                  />
                </div>
                
                <div className="col-span-2 flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Aceita Fracionamento</label>
                    <div className="text-sm text-muted-foreground">
                      Permite entrega em quantidades fracionadas
                    </div>
                  </div>
                  <Switch
                    checked={itemEdicao.aceita_fracionamento || false}
                    onCheckedChange={(checked) => setItemEdicao({
                      ...itemEdicao,
                      aceita_fracionamento: checked
                    })}
                  />
                </div>
                
                <div className="col-span-2 flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setDialogAberto(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={salvarItem}>
                    Salvar Item
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
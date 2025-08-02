import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Calendar as CalendarIcon,
  Save,
  Send
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CriarPedidoRequest, CriarItemPedidoRequest } from "@/types/pedido";

export default function CriarPedido() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [dataEntrega, setDataEntrega] = useState<Date>();
  
  // Estado do formulário
  const [formData, setFormData] = useState({
    fornecedor_id: "",
    condicoes_pagamento: "",
    observacoes: "",
    centro_custo: "",
    tipo: "material" as const
  });

  // Estado dos itens
  const [itens, setItens] = useState<CriarItemPedidoRequest[]>([
    {
      descricao: "",
      especificacao: "",
      quantidade: 1,
      unidade: "Unidade",
      preco_unitario: 0,
      observacoes: ""
    }
  ]);

  const adicionarItem = () => {
    setItens([...itens, {
      descricao: "",
      especificacao: "",
      quantidade: 1,
      unidade: "Unidade",
      preco_unitario: 0,
      observacoes: ""
    }]);
  };

  const removerItem = (index: number) => {
    if (itens.length > 1) {
      setItens(itens.filter((_, i) => i !== index));
    }
  };

  const atualizarItem = (index: number, campo: keyof CriarItemPedidoRequest, valor: any) => {
    const novosItens = [...itens];
    novosItens[index] = { ...novosItens[index], [campo]: valor };
    setItens(novosItens);
  };

  const calcularTotal = () => {
    return itens.reduce((total, item) => total + (item.quantidade * item.preco_unitario), 0);
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const validarFormulario = () => {
    if (!formData.fornecedor_id) {
      toast({
        title: "Erro",
        description: "Selecione um fornecedor",
        variant: "destructive",
      });
      return false;
    }

    if (!dataEntrega) {
      toast({
        title: "Erro", 
        description: "Selecione a data de entrega",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.centro_custo) {
      toast({
        title: "Erro",
        description: "Informe o centro de custo",
        variant: "destructive",
      });
      return false;
    }

    // Validar itens
    for (let i = 0; i < itens.length; i++) {
      const item = itens[i];
      if (!item.descricao) {
        toast({
          title: "Erro",
          description: `Item ${i + 1}: Descrição é obrigatória`,
          variant: "destructive",
        });
        return false;
      }
      if (item.quantidade <= 0) {
        toast({
          title: "Erro",
          description: `Item ${i + 1}: Quantidade deve ser maior que zero`,
          variant: "destructive",
        });
        return false;
      }
      if (item.preco_unitario <= 0) {
        toast({
          title: "Erro",
          description: `Item ${i + 1}: Preço deve ser maior que zero`,
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const salvarRascunho = async () => {
    if (!validarFormulario()) return;

    try {
      setLoading(true);
      
      // Criar pedido
      const { data: pedido, error: pedidoError } = await supabase
        .from('pedidos')
        .insert({
          fornecedor_id: formData.fornecedor_id,
          data_entrega_solicitada: dataEntrega!.toISOString().split('T')[0],
          condicoes_pagamento: formData.condicoes_pagamento || null,
          observacoes: formData.observacoes || null,
          centro_custo: formData.centro_custo,
          tipo: formData.tipo,
          status: 'rascunho',
          criado_por: crypto.randomUUID()
        } as any)
        .select()
        .single();

      if (pedidoError) throw pedidoError;

      // Criar itens
      const itensParaInserir = itens.map((item, index) => ({
        pedido_id: pedido.id,
        sequencia: index + 1,
        descricao: item.descricao,
        especificacao: item.especificacao,
        quantidade: item.quantidade,
        unidade: item.unidade,
        preco_unitario: item.preco_unitario,
        valor_total: item.quantidade * item.preco_unitario,
        observacoes: item.observacoes
      }));

      const { error: itensError } = await supabase
        .from('itens_pedido')
        .insert(itensParaInserir);

      if (itensError) throw itensError;

      toast({
        title: "Sucesso",
        description: `Pedido ${pedido.numero_pedido} salvo como rascunho!`,
      });

      navigate('/pedidos');
      
    } catch (error) {
      console.error('Erro ao salvar pedido:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o pedido",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const enviarParaAprovacao = async () => {
    if (!validarFormulario()) return;

    // Por enquanto, vamos apenas salvar como rascunho
    // TODO: Implementar lógica de aprovação
    await salvarRascunho();
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/pedidos')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Criar Pedido</h1>
          <p className="text-muted-foreground">
            Preencha os dados para criar um novo pedido de compra
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dados Básicos */}
          <Card>
            <CardHeader>
              <CardTitle>Dados Básicos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fornecedor">Fornecedor *</Label>
                  <Select 
                    value={formData.fornecedor_id} 
                    onValueChange={(value) => setFormData({...formData, fornecedor_id: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um fornecedor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Tech Solutions Ltda</SelectItem>
                      <SelectItem value="2">ABC Materiais de Escritório</SelectItem>
                      <SelectItem value="3">Equipamentos Industriais LTDA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tipo">Tipo do Pedido</Label>
                  <Select 
                    value={formData.tipo} 
                    onValueChange={(value: any) => setFormData({...formData, tipo: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="material">Material</SelectItem>
                      <SelectItem value="servico">Serviço</SelectItem>
                      <SelectItem value="misto">Misto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dataEntrega">Data de Entrega *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dataEntrega && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dataEntrega ? format(dataEntrega, "dd/MM/yyyy", { locale: ptBR }) : "Selecione a data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dataEntrega}
                        onSelect={setDataEntrega}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="centro_custo">Centro de Custo *</Label>
                  <Input
                    id="centro_custo"
                    value={formData.centro_custo}
                    onChange={(e) => setFormData({...formData, centro_custo: e.target.value})}
                    placeholder="Ex: CC001"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="condicoes_pagamento">Condições de Pagamento</Label>
                <Input
                  id="condicoes_pagamento"
                  value={formData.condicoes_pagamento}
                  onChange={(e) => setFormData({...formData, condicoes_pagamento: e.target.value})}
                  placeholder="Ex: 30 dias"
                />
              </div>

              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                  placeholder="Informações adicionais sobre o pedido..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Itens do Pedido */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Itens do Pedido</CardTitle>
                <Button onClick={adicionarItem} variant="outline" size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Adicionar Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {itens.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Item {index + 1}</h4>
                      {itens.length > 1 && (
                        <Button 
                          onClick={() => removerItem(index)}
                          variant="ghost" 
                          size="sm"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="md:col-span-2">
                        <Label>Descrição *</Label>
                        <Input
                          value={item.descricao}
                          onChange={(e) => atualizarItem(index, 'descricao', e.target.value)}
                          placeholder="Descrição do item"
                        />
                      </div>

                      <div>
                        <Label>Quantidade *</Label>
                        <Input
                          type="number"
                          min="1"
                          step="0.01"
                          value={item.quantidade}
                          onChange={(e) => atualizarItem(index, 'quantidade', parseFloat(e.target.value) || 0)}
                        />
                      </div>

                      <div>
                        <Label>Unidade</Label>
                        <Select 
                          value={item.unidade} 
                          onValueChange={(value) => atualizarItem(index, 'unidade', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Unidade">Unidade</SelectItem>
                            <SelectItem value="Pacote">Pacote</SelectItem>
                            <SelectItem value="Caixa">Caixa</SelectItem>
                            <SelectItem value="Kg">Kg</SelectItem>
                            <SelectItem value="Litro">Litro</SelectItem>
                            <SelectItem value="Metro">Metro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Preço Unitário *</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.preco_unitario}
                          onChange={(e) => atualizarItem(index, 'preco_unitario', parseFloat(e.target.value) || 0)}
                          placeholder="0,00"
                        />
                      </div>

                      <div>
                        <Label>Total</Label>
                        <Input
                          value={formatarMoeda(item.quantidade * item.preco_unitario)}
                          disabled
                          className="bg-muted"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label>Especificação</Label>
                        <Input
                          value={item.especificacao || ""}
                          onChange={(e) => atualizarItem(index, 'especificacao', e.target.value)}
                          placeholder="Especificações técnicas do item"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label>Observações</Label>
                        <Input
                          value={item.observacoes || ""}
                          onChange={(e) => atualizarItem(index, 'observacoes', e.target.value)}
                          placeholder="Observações específicas do item"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumo */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Itens:</span>
                  <span>{itens.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Quantidade Total:</span>
                  <span>{itens.reduce((total, item) => total + item.quantidade, 0)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Valor Total:</span>
                  <span className="text-primary">{formatarMoeda(calcularTotal())}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Button 
                  onClick={salvarRascunho} 
                  variant="outline" 
                  className="w-full gap-2"
                  disabled={loading}
                >
                  <Save className="h-4 w-4" />
                  {loading ? "Salvando..." : "Salvar Rascunho"}
                </Button>
                
                <Button 
                  onClick={enviarParaAprovacao} 
                  className="w-full gap-2"
                  disabled={loading}
                >
                  <Send className="h-4 w-4" />
                  {loading ? "Enviando..." : "Enviar para Aprovação"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
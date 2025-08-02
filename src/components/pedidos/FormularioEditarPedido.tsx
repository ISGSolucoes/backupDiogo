import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { CalendarIcon, Plus, Trash2, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Pedido } from '@/types/pedido';

interface FormularioEditarPedidoProps {
  pedido: Pedido;
  onSalvar: (dadosAtualizados: any) => void;
  loading?: boolean;
}

interface ItemPedido {
  id?: string;
  sequencia: number;
  codigo_produto: string;
  descricao: string;
  especificacao: string;
  quantidade: number;
  unidade: string;
  preco_unitario: number;
  valor_total: number;
  categoria_familia: string;
  centro_custo_item: string;
  observacoes_tecnicas: string;
  data_entrega_item?: Date;
}

export default function FormularioEditarPedido({ pedido, onSalvar, loading }: FormularioEditarPedidoProps) {
  const [dadosFormulario, setDadosFormulario] = useState({
    // Dados gerais
    tipo: pedido.tipo || 'material',
    origem_demanda: '',
    
    // Dados do fornecedor
    fornecedor_razao_social: '',
    fornecedor_cnpj: '',
    fornecedor_endereco: '',
    responsavel_comercial_nome: '',
    responsavel_comercial_email: '',
    
    // Condições comerciais
    condicao_pagamento: pedido.condicoes_pagamento || '',
    forma_pagamento: '',
    moeda: pedido.moeda || 'BRL',
    impostos: '',
    descontos_acrescimos: '',
    
    // Entrega e logística
    local_entrega: '',
    data_entrega_solicitada: new Date(pedido.data_entrega_solicitada),
    tipo_frete: 'CIF',
    transportadora: '',
    instrucoes_entrega: '',
    aceita_entrega_parcial: false,
    prazo_maximo_atraso: 2,
    
    // Observações
    observacoes: pedido.observacoes || '',
    observacoes_internas: '',
    
    // Vinculações
    requisicao_vinculada: '',
    cotacao_vinculada: '',
    contrato_vinculado: '',
    
    // Centro de custo
    centro_custo: pedido.centro_custo || '',
  });

  const [itens, setItens] = useState<ItemPedido[]>([
    {
      sequencia: 1,
      codigo_produto: '',
      descricao: '',
      especificacao: '',
      quantidade: 1,
      unidade: 'UN',
      preco_unitario: 0,
      valor_total: 0,
      categoria_familia: '',
      centro_custo_item: '',
      observacoes_tecnicas: '',
    }
  ]);

  const [activeTab, setActiveTab] = useState('dados-gerais');

  const handleInputChange = (campo: string, valor: any) => {
    setDadosFormulario(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const handleItemChange = (index: number, campo: string, valor: any) => {
    const novosItens = [...itens];
    novosItens[index] = {
      ...novosItens[index],
      [campo]: valor
    };
    
    // Recalcular valor total do item se mudou quantidade ou preço
    if (campo === 'quantidade' || campo === 'preco_unitario') {
      novosItens[index].valor_total = novosItens[index].quantidade * novosItens[index].preco_unitario;
    }
    
    setItens(novosItens);
  };

  const adicionarItem = () => {
    setItens(prev => [...prev, {
      sequencia: prev.length + 1,
      codigo_produto: '',
      descricao: '',
      especificacao: '',
      quantidade: 1,
      unidade: 'UN',
      preco_unitario: 0,
      valor_total: 0,
      categoria_familia: '',
      centro_custo_item: '',
      observacoes_tecnicas: '',
    }]);
  };

  const removerItem = (index: number) => {
    if (itens.length > 1) {
      setItens(prev => prev.filter((_, i) => i !== index));
    }
  };

  const calcularValorTotal = () => {
    return itens.reduce((total, item) => total + item.valor_total, 0);
  };

  // Carregar itens existentes quando há um pedido
  useEffect(() => {
    if (pedido?.id) {
      carregarItensExistentes();
    }
  }, [pedido?.id]);

  const carregarItensExistentes = async () => {
    if (!pedido?.id) return;

    try {
      const { data: itensExistentes, error } = await supabase
        .from('itens_pedido')
        .select('*')
        .eq('pedido_id', pedido.id)
        .order('sequencia');

      if (error) throw error;

      if (itensExistentes && itensExistentes.length > 0) {
        setItens(itensExistentes.map((item, index) => ({
          id: item.id,
          sequencia: item.sequencia || (index + 1),
          codigo_produto: item.codigo_produto || '',
          descricao: item.descricao || '',
          especificacao: item.especificacao || '',
          quantidade: item.quantidade || 0,
          unidade: item.unidade || 'UN',
          preco_unitario: item.preco_unitario || 0,
          valor_total: item.valor_total || 0,
          categoria_familia: '',
          centro_custo_item: item.centro_custo_item || '',
          observacoes_tecnicas: item.observacoes || ''
        })));
      }
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
    }
  };

  const handleSalvar = () => {
    const dadosCompletos = {
      dados_gerais: {
        ...dadosFormulario,
        data_entrega_solicitada: dadosFormulario.data_entrega_solicitada?.toISOString().split('T')[0]
      },
      comercial: {
        condicoes_pagamento: dadosFormulario.condicao_pagamento
      },
      itens: itens
    };
    onSalvar(dadosCompletos);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dados-gerais">Dados Gerais</TabsTrigger>
          <TabsTrigger value="itens">Itens</TabsTrigger>
          <TabsTrigger value="comercial">Comercial</TabsTrigger>
          <TabsTrigger value="entrega">Entrega</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
        </TabsList>

        {/* Dados Gerais e Fornecedor */}
        <TabsContent value="dados-gerais" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dados Gerais do Pedido</CardTitle>
              <CardDescription>Informações básicas e dados do fornecedor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="tipo">Tipo de Pedido</Label>
                  <Select value={dadosFormulario.tipo} onValueChange={(value) => handleInputChange('tipo', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="material">Material</SelectItem>
                      <SelectItem value="servico">Serviço</SelectItem>
                      <SelectItem value="misto">Misto</SelectItem>
                      <SelectItem value="contrato">Contrato</SelectItem>
                      <SelectItem value="reposicao">Reposição</SelectItem>
                      <SelectItem value="emergencial">Emergencial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="origem_demanda">Origem da Demanda</Label>
                  <Select value={dadosFormulario.origem_demanda} onValueChange={(value) => handleInputChange('origem_demanda', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a origem" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="requisicao">Requisição</SelectItem>
                      <SelectItem value="cotacao">Cotação</SelectItem>
                      <SelectItem value="contrato">Contrato</SelectItem>
                      <SelectItem value="reposicao">Reposição</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="centro_custo">Centro de Custo</Label>
                  <Input
                    id="centro_custo"
                    value={dadosFormulario.centro_custo}
                    onChange={(e) => handleInputChange('centro_custo', e.target.value)}
                    placeholder="Ex: TI001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fornecedor_razao_social">Razão Social do Fornecedor</Label>
                  <Input
                    id="fornecedor_razao_social"
                    value={dadosFormulario.fornecedor_razao_social}
                    onChange={(e) => handleInputChange('fornecedor_razao_social', e.target.value)}
                    placeholder="Razão social completa"
                  />
                </div>

                <div>
                  <Label htmlFor="fornecedor_cnpj">CNPJ</Label>
                  <Input
                    id="fornecedor_cnpj"
                    value={dadosFormulario.fornecedor_cnpj}
                    onChange={(e) => handleInputChange('fornecedor_cnpj', e.target.value)}
                    placeholder="00.000.000/0000-00"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="fornecedor_endereco">Endereço de Faturamento</Label>
                <Textarea
                  id="fornecedor_endereco"
                  value={dadosFormulario.fornecedor_endereco}
                  onChange={(e) => handleInputChange('fornecedor_endereco', e.target.value)}
                  placeholder="Endereço completo para faturamento"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="responsavel_comercial_nome">Responsável Comercial</Label>
                  <Input
                    id="responsavel_comercial_nome"
                    value={dadosFormulario.responsavel_comercial_nome}
                    onChange={(e) => handleInputChange('responsavel_comercial_nome', e.target.value)}
                    placeholder="Nome do responsável"
                  />
                </div>

                <div>
                  <Label htmlFor="responsavel_comercial_email">Email do Responsável</Label>
                  <Input
                    id="responsavel_comercial_email"
                    type="email"
                    value={dadosFormulario.responsavel_comercial_email}
                    onChange={(e) => handleInputChange('responsavel_comercial_email', e.target.value)}
                    placeholder="email@fornecedor.com"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="requisicao_vinculada">Nº Requisição Vinculada</Label>
                    <Input
                      id="requisicao_vinculada"
                      value={dadosFormulario.requisicao_vinculada}
                      onChange={(e) => handleInputChange('requisicao_vinculada', e.target.value)}
                      placeholder="REQ-2025-000001"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cotacao_vinculada">Nº Cotação Vinculada</Label>
                    <Input
                      id="cotacao_vinculada"
                      value={dadosFormulario.cotacao_vinculada}
                      onChange={(e) => handleInputChange('cotacao_vinculada', e.target.value)}
                      placeholder="COT-2025-000001"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contrato_vinculado">Nº Contrato Vinculado</Label>
                    <Input
                      id="contrato_vinculado"
                      value={dadosFormulario.contrato_vinculado}
                      onChange={(e) => handleInputChange('contrato_vinculado', e.target.value)}
                      placeholder="CONT-2025-000001"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Itens do Pedido */}
        <TabsContent value="itens" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Itens do Pedido</CardTitle>
                  <CardDescription>Adicione e configure os itens do pedido</CardDescription>
                </div>
                <Button onClick={adicionarItem} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Adicionar Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {itens.map((item, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold">Item {item.sequencia}</h4>
                      {itens.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removerItem(index)}
                          className="gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remover
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <Label>Código do Produto</Label>
                        <Input
                          value={item.codigo_produto}
                          onChange={(e) => handleItemChange(index, 'codigo_produto', e.target.value)}
                          placeholder="PROD001"
                        />
                      </div>

                      <div>
                        <Label>Categoria/Família</Label>
                        <Input
                          value={item.categoria_familia}
                          onChange={(e) => handleItemChange(index, 'categoria_familia', e.target.value)}
                          placeholder="Materiais de Escritório"
                        />
                      </div>

                      <div>
                        <Label>Centro de Custo Item</Label>
                        <Input
                          value={item.centro_custo_item}
                          onChange={(e) => handleItemChange(index, 'centro_custo_item', e.target.value)}
                          placeholder="TI001"
                        />
                      </div>

                      <div className="md:col-span-2 lg:col-span-3">
                        <Label>Descrição</Label>
                        <Input
                          value={item.descricao}
                          onChange={(e) => handleItemChange(index, 'descricao', e.target.value)}
                          placeholder="Descrição detalhada do item"
                        />
                      </div>

                      <div className="md:col-span-2 lg:col-span-3">
                        <Label>Especificação Técnica</Label>
                        <Textarea
                          value={item.especificacao}
                          onChange={(e) => handleItemChange(index, 'especificacao', e.target.value)}
                          placeholder="Especificações técnicas detalhadas"
                        />
                      </div>

                      <div>
                        <Label>Quantidade</Label>
                        <Input
                          type="number"
                          value={item.quantidade}
                          onChange={(e) => handleItemChange(index, 'quantidade', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                        />
                      </div>

                      <div>
                        <Label>Unidade</Label>
                        <Select value={item.unidade} onValueChange={(value) => handleItemChange(index, 'unidade', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="UN">Unidade</SelectItem>
                            <SelectItem value="KG">Quilograma</SelectItem>
                            <SelectItem value="M">Metro</SelectItem>
                            <SelectItem value="M2">Metro Quadrado</SelectItem>
                            <SelectItem value="M3">Metro Cúbico</SelectItem>
                            <SelectItem value="CX">Caixa</SelectItem>
                            <SelectItem value="LT">Litro</SelectItem>
                            <SelectItem value="HR">Hora</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Preço Unitário (R$)</Label>
                        <Input
                          type="number"
                          value={item.preco_unitario}
                          onChange={(e) => handleItemChange(index, 'preco_unitario', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                        />
                      </div>

                      <div className="md:col-span-2 lg:col-span-3">
                        <Label>Observações Técnicas</Label>
                        <Textarea
                          value={item.observacoes_tecnicas}
                          onChange={(e) => handleItemChange(index, 'observacoes_tecnicas', e.target.value)}
                          placeholder="Observações específicas do item (lote, série, prazo específico)"
                        />
                      </div>

                      <div className="md:col-span-2 lg:col-span-3 p-3 bg-muted rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Valor Total do Item:</span>
                          <span className="text-lg font-bold">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            }).format(item.valor_total)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}

                <div className="p-4 bg-primary/5 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">Valor Total do Pedido:</span>
                    <span className="text-2xl font-bold text-primary">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(calcularValorTotal())}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Condições Comerciais */}
        <TabsContent value="comercial" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Condições Comerciais</CardTitle>
              <CardDescription>Configure as condições de pagamento e comerciais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="condicao_pagamento">Condição de Pagamento</Label>
                  <Input
                    id="condicao_pagamento"
                    value={dadosFormulario.condicao_pagamento}
                    onChange={(e) => handleInputChange('condicao_pagamento', e.target.value)}
                    placeholder="Ex: 30/45/60 dias"
                  />
                </div>

                <div>
                  <Label htmlFor="forma_pagamento">Forma de Pagamento</Label>
                  <Select value={dadosFormulario.forma_pagamento} onValueChange={(value) => handleInputChange('forma_pagamento', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ted">TED</SelectItem>
                      <SelectItem value="boleto">Boleto</SelectItem>
                      <SelectItem value="cartao">Cartão</SelectItem>
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="moeda">Moeda</Label>
                  <Select value={dadosFormulario.moeda} onValueChange={(value) => handleInputChange('moeda', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">BRL - Real</SelectItem>
                      <SelectItem value="USD">USD - Dólar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="impostos">Impostos (ICMS/IPI)</Label>
                  <Textarea
                    id="impostos"
                    value={dadosFormulario.impostos}
                    onChange={(e) => handleInputChange('impostos', e.target.value)}
                    placeholder="Informações sobre impostos aplicáveis"
                  />
                </div>

                <div>
                  <Label htmlFor="descontos_acrescimos">Descontos ou Acréscimos</Label>
                  <Textarea
                    id="descontos_acrescimos"
                    value={dadosFormulario.descontos_acrescimos}
                    onChange={(e) => handleInputChange('descontos_acrescimos', e.target.value)}
                    placeholder="% por volume, adiantamento, logística"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Entrega e Logística */}
        <TabsContent value="entrega" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Entrega e Logística</CardTitle>
              <CardDescription>Configure as informações de entrega</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="local_entrega">Local de Entrega</Label>
                <Textarea
                  id="local_entrega"
                  value={dadosFormulario.local_entrega}
                  onChange={(e) => handleInputChange('local_entrega', e.target.value)}
                  placeholder="Endereço completo para entrega"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label>Data Prevista de Entrega</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dadosFormulario.data_entrega_solicitada && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dadosFormulario.data_entrega_solicitada ? (
                          format(dadosFormulario.data_entrega_solicitada, "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecione a data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dadosFormulario.data_entrega_solicitada}
                        onSelect={(date) => handleInputChange('data_entrega_solicitada', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="tipo_frete">Tipo de Frete</Label>
                  <Select value={dadosFormulario.tipo_frete} onValueChange={(value) => handleInputChange('tipo_frete', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CIF">CIF - Por conta do remetente</SelectItem>
                      <SelectItem value="FOB">FOB - Por conta do destinatário</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="transportadora">Transportadora</Label>
                  <Input
                    id="transportadora"
                    value={dadosFormulario.transportadora}
                    onChange={(e) => handleInputChange('transportadora', e.target.value)}
                    placeholder="Nome da transportadora"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="instrucoes_entrega">Instruções de Entrega</Label>
                <Textarea
                  id="instrucoes_entrega"
                  value={dadosFormulario.instrucoes_entrega}
                  onChange={(e) => handleInputChange('instrucoes_entrega', e.target.value)}
                  placeholder="Acesso restrito, paletização, janelas de horário"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="aceita_entrega_parcial"
                    checked={dadosFormulario.aceita_entrega_parcial}
                    onCheckedChange={(checked) => handleInputChange('aceita_entrega_parcial', checked)}
                  />
                  <Label htmlFor="aceita_entrega_parcial">Aceita Entrega Parcial</Label>
                </div>

                <div>
                  <Label htmlFor="prazo_maximo_atraso">Prazo Máximo de Atraso (dias)</Label>
                  <Input
                    id="prazo_maximo_atraso"
                    type="number"
                    value={dadosFormulario.prazo_maximo_atraso}
                    onChange={(e) => handleInputChange('prazo_maximo_atraso', parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documentos e Anexos */}
        <TabsContent value="documentos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Documentos e Anexos</CardTitle>
              <CardDescription>Anexe documentos relacionados ao pedido</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="observacoes">Observações Visíveis ao Fornecedor</Label>
                  <Textarea
                    id="observacoes"
                    value={dadosFormulario.observacoes}
                    onChange={(e) => handleInputChange('observacoes', e.target.value)}
                    placeholder="Informações que o fornecedor deve ver"
                  />
                </div>

                <div>
                  <Label htmlFor="observacoes_internas">Observações Internas</Label>
                  <Textarea
                    id="observacoes_internas"
                    value={dadosFormulario.observacoes_internas}
                    onChange={(e) => handleInputChange('observacoes_internas', e.target.value)}
                    placeholder="Observações apenas para equipe interna"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Anexos</Label>
                
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div className="mt-4">
                      <Button variant="secondary" className="gap-2">
                        <Upload className="h-4 w-4" />
                        Selecionar Arquivos
                      </Button>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Anexe cotação premiada, especificações técnicas, etc.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Tipos de anexos sugeridos:</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Cotação Premiada</Badge>
                    <Badge variant="outline">Termo Técnico</Badge>
                    <Badge variant="outline">Especificação</Badge>
                    <Badge variant="outline">Contrato</Badge>
                    <Badge variant="outline">Ordem de Serviço</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Botões de Ação */}
      <div className="flex justify-end gap-3 pt-6">
        <Button variant="outline" disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={handleSalvar} disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar Pedido'}
        </Button>
      </div>
    </div>
  );
}
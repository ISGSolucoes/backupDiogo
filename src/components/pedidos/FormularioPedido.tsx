import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Package, Building, FileText, Truck, CreditCard, AlertTriangle, Paperclip } from 'lucide-react';
import { StatusPedido } from '@/types/pedido';
import { TabelaItensPedido } from './TabelaItensPedido';
import { HistoricoPedido } from './HistoricoPedido';
import { ChecklistValidacao } from './ChecklistValidacao';
import { AnexosPedido } from './AnexosPedido';
import { supabase } from '@/integrations/supabase/client';

interface FormularioPedidoProps {
  pedido?: any;
  onSalvar: (dados: any) => void;
  onValidar?: (pedidoId: string) => Promise<any>;
  readonly?: boolean;
}

export function FormularioPedido({ 
  pedido, 
  onSalvar, 
  onValidar,
  readonly = false 
}: FormularioPedidoProps) {
  const [itens, setItens] = useState(pedido?.itens_pedido || []);
  const [anexos, setAnexos] = useState<any[]>([]);
  const [validacao, setValidacao] = useState<any>(null);
  
  const form = useForm({
    defaultValues: {
      // Dados gerais
      numero_pedido: pedido?.numero_pedido || '',
      data_emissao: pedido?.data_emissao || new Date().toISOString().split('T')[0],
      status: pedido?.status || 'rascunho',
      origem_demanda: pedido?.origem_demanda || '',
      tipo_detalhado: pedido?.tipo_detalhado || 'produto',
      
      // Fornecedor
      fornecedor_razao_social: pedido?.fornecedor_razao_social || '',
      fornecedor_cnpj: pedido?.fornecedor_cnpj || '',
      fornecedor_endereco_faturamento: pedido?.fornecedor_endereco_faturamento || '',
      fornecedor_responsavel_nome: pedido?.fornecedor_responsavel_nome || '',
      fornecedor_responsavel_email: pedido?.fornecedor_responsavel_email || '',
      fornecedor_status: pedido?.fornecedor_status || 'ativo',
      
      // Condições comerciais
      condicao_pagamento: pedido?.condicao_pagamento || '',
      forma_pagamento: pedido?.forma_pagamento || '',
      moeda: pedido?.moeda || 'BRL',
      descontos_acrescimos: pedido?.descontos_acrescimos || 0,
      
      // Entrega e logística
      local_entrega: pedido?.local_entrega || '',
      data_entrega_prevista: pedido?.data_entrega_prevista || '',
      tipo_frete: pedido?.tipo_frete || 'CIF',
      transportadora: pedido?.transportadora || '',
      instrucoes_entrega: pedido?.instrucoes_entrega || '',
      aceita_entrega_parcial: pedido?.aceita_entrega_parcial || false,
      prazo_maximo_atraso: pedido?.prazo_maximo_atraso || 2,
      
      // Vinculações
      requisicao_vinculada: pedido?.requisicao_vinculada || '',
      cotacao_vinculada: pedido?.cotacao_vinculada || '',
      contrato_vinculado: pedido?.contrato_vinculado || '',
      ordem_servico: pedido?.ordem_servico || '',
      
      // Responsável interno
      responsavel_interno_nome: pedido?.responsavel_interno_nome || '',
      centro_custo: pedido?.centro_custo || '',
      
      // Observações
      observacoes_internas: pedido?.observacoes_internas || '',
      observacoes_fornecedor: pedido?.observacoes_fornecedor || '',
      observacoes: pedido?.observacoes || '',

      // Novos campos conforme PRD
      projeto_atividade: pedido?.projeto_atividade || '',
      conta_contabil: pedido?.conta_contabil || '',
      responsavel_interno_email: pedido?.responsavel_interno_email || '',
      origem_id: pedido?.origem_id || '',
      permite_fracionamento: pedido?.permite_fracionamento || false,
    }
  });

  const validarPedido = async () => {
    if (pedido?.id && onValidar) {
      const resultado = await onValidar(pedido.id);
      setValidacao(resultado);
    }
  };

  const onSubmit = (dados: any) => {
    const pedidoCompleto = {
      ...dados,
      id: pedido?.id,
      valor_total: calcularValorTotal(),
      itens_pedido: itens
    };
    onSalvar(pedidoCompleto);
  };

  const calcularValorTotal = () => {
    return itens.reduce((total: number, item: any) => total + (item.valor_total || 0), 0);
  };

  const carregarAnexos = async () => {
    if (!pedido?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('anexos_pedido')
        .select('*')
        .eq('pedido_id', pedido.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnexos(data || []);
    } catch (error) {
      console.error('Erro ao carregar anexos:', error);
    }
  };

  useEffect(() => {
    if (pedido?.id) {
      validarPedido();
      carregarAnexos();
    }
  }, [pedido?.id]);

  const statusOptions: { value: StatusPedido; label: string; color: string }[] = [
    { value: 'rascunho', label: 'Rascunho', color: 'bg-gray-500' },
    { value: 'aguardando_aprovacao', label: 'Aguardando Aprovação', color: 'bg-yellow-500' },
    { value: 'aprovado', label: 'Aprovado', color: 'bg-blue-500' },
    { value: 'enviado', label: 'Enviado', color: 'bg-purple-500' },
    { value: 'confirmado', label: 'Confirmado', color: 'bg-green-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header com validação */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">
            {readonly ? 'Visualizar Pedido' : pedido?.id ? 'Editar Pedido' : 'Novo Pedido'}
          </h1>
          {pedido?.numero_pedido && (
            <p className="text-sm text-muted-foreground">
              Pedido: {pedido.numero_pedido}
            </p>
          )}
        </div>
        
        {validacao && !readonly && (
          <Card className={validacao.valido ? 'border-green-200' : 'border-red-200'}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                {validacao.valido ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm font-medium text-green-700">Pronto para envio</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium text-red-700">
                      {validacao.erros?.length} erro(s) encontrado(s)
                    </span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="geral" className="w-full">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="geral" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Geral
              </TabsTrigger>
              <TabsTrigger value="fornecedor" className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                Fornecedor
              </TabsTrigger>
              <TabsTrigger value="itens" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Itens
              </TabsTrigger>
              <TabsTrigger value="comercial" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Comercial
              </TabsTrigger>
              <TabsTrigger value="entrega" className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                Entrega
              </TabsTrigger>
              <TabsTrigger value="anexos" className="flex items-center gap-2">
                <Paperclip className="w-4 h-4" />
                Anexos
              </TabsTrigger>
              <TabsTrigger value="historico" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Histórico
              </TabsTrigger>
            </TabsList>

            {/* Aba Dados Gerais */}
            <TabsContent value="geral" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dados Gerais do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="numero_pedido"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número do Pedido</FormLabel>
                        <FormControl>
                          <Input {...field} disabled placeholder="Gerado automaticamente" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="data_emissao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Emissão *</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" disabled={readonly} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            {statusOptions.map((option) => (
                              option.value === field.value && (
                                <Badge key={option.value} className={option.color}>
                                  {option.label}
                                </Badge>
                              )
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="tipo_detalhado"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Pedido *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={readonly}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="produto">Produto</SelectItem>
                            <SelectItem value="servico">Serviço</SelectItem>
                            <SelectItem value="misto">Misto</SelectItem>
                            <SelectItem value="contrato">Contrato</SelectItem>
                            <SelectItem value="reposicao">Reposição</SelectItem>
                            <SelectItem value="emergencial">Emergencial</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="origem_demanda"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Origem da Demanda</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Link para requisição/cotação" disabled={readonly} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="centro_custo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Centro de Custo *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Centro de custo" disabled={readonly} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Responsável e Projeto</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="responsavel_interno_nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Responsável Interno *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nome do responsável" disabled={readonly} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="responsavel_interno_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email do Responsável</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="email@empresa.com" disabled={readonly} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="projeto_atividade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Projeto/Atividade</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Código do projeto" disabled={readonly} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="conta_contabil"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Conta Contábil</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Código da conta contábil" disabled={readonly} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Vinculações e Rastreabilidade</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="requisicao_vinculada"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nº da Requisição</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="REQ-2024-000001" disabled={readonly} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cotacao_vinculada"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nº da Cotação</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="COT-2024-000001" disabled={readonly} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="contrato_vinculado"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nº do Contrato</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="CONT-2024-000001" disabled={readonly} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="ordem_servico"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ordem de Serviço</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="OS-2024-000001" disabled={readonly} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba Fornecedor */}
            <TabsContent value="fornecedor" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dados do Fornecedor</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fornecedor_razao_social"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Razão Social *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nome da empresa" disabled={readonly} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="fornecedor_cnpj"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CNPJ *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="00.000.000/0001-00" disabled={readonly} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="fornecedor_endereco_faturamento"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Endereço de Faturamento *</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Endereço completo" disabled={readonly} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="fornecedor_responsavel_nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Responsável Comercial *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nome do responsável" disabled={readonly} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="fornecedor_responsavel_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email do Responsável *</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="email@empresa.com" disabled={readonly} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="fornecedor_status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status do Fornecedor</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={readonly}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ativo">Ativo</SelectItem>
                            <SelectItem value="em_avaliacao">Em Avaliação</SelectItem>
                            <SelectItem value="pre_homologado">Pré-homologado</SelectItem>
                            <SelectItem value="com_pendencia">Com Pendência</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba Itens */}
            <TabsContent value="itens" className="space-y-6">
              <TabelaItensPedido 
                itens={itens} 
                onItemsChange={setItens}
                readonly={readonly}
              />
            </TabsContent>

            {/* Aba Condições Comerciais */}
            <TabsContent value="comercial" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Condições Comerciais</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="condicao_pagamento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Condição de Pagamento *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ex: 30/45/60 dias" disabled={readonly} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="forma_pagamento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Forma de Pagamento</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={readonly}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ted">TED</SelectItem>
                            <SelectItem value="boleto">Boleto</SelectItem>
                            <SelectItem value="cartao">Cartão</SelectItem>
                            <SelectItem value="pix">PIX</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="moeda"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Moeda *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={readonly}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="BRL">BRL - Real</SelectItem>
                            <SelectItem value="USD">USD - Dólar</SelectItem>
                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="descontos_acrescimos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descontos/Acréscimos (%)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" step="0.01" disabled={readonly} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="col-span-2">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Valor Total do Pedido:</span>
                        <span className="text-lg font-bold">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: form.watch('moeda') || 'BRL'
                          }).format(calcularValorTotal())}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba Entrega */}
            <TabsContent value="entrega" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Entrega e Logística</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="local_entrega"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Local de Entrega *</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Endereço completo de entrega" disabled={readonly} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="data_entrega_prevista"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data Prevista de Entrega *</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" disabled={readonly} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="tipo_frete"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Frete *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={readonly}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CIF">CIF - Por conta do fornecedor</SelectItem>
                            <SelectItem value="FOB">FOB - Por conta do comprador</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="transportadora"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transportadora</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nome da transportadora" disabled={readonly} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="prazo_maximo_atraso"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prazo Máximo de Atraso (dias)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" disabled={readonly} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="aceita_entrega_parcial"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Aceita Entrega Parcial</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Permite entregas em lotes separados
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={readonly}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="instrucoes_entrega"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Instruções de Entrega</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Ex: acesso restrito, paletização, janelas de horário"
                            disabled={readonly}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba Anexos */}
            <TabsContent value="anexos" className="space-y-6">
              <AnexosPedido
                pedidoId={pedido?.id}
                anexos={anexos}
                onAnexosChange={setAnexos}
                readonly={readonly}
              />
            </TabsContent>

            {/* Aba Histórico */}
            <TabsContent value="historico" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {pedido?.id && <HistoricoPedido pedidoId={pedido.id} />}
                {validacao && <ChecklistValidacao validacao={validacao} />}
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Observações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="observacoes_internas"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observações Internas</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Visível apenas para o time de compras"
                            disabled={readonly}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="observacoes_fornecedor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observações para o Fornecedor</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Será exibido no portal do fornecedor"
                            disabled={readonly}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {!readonly && (
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => window.history.back()}>
                Cancelar
              </Button>
              <Button type="submit">
                {pedido?.id ? 'Atualizar Pedido' : 'Criar Pedido'}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
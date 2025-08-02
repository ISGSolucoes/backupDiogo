import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useProjetoSourcing } from '@/hooks/useProjetoSourcing';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Package, FileText, Users, Calendar, DollarSign, AlertCircle } from 'lucide-react';

interface DadosRequisicao {
  id: string;
  numero_requisicao: string;
  titulo: string;
  descricao?: string;
  tipo: string;
  valor_estimado: number;
  centro_custo?: string;
  data_necessidade: string;
  solicitante_nome: string;
  itens: Array<{
    id: string;
    descricao: string;
    especificacao?: string;
    quantidade: number;
    unidade: string;
    preco_estimado: number;
    categoria?: string;
  }>;
}

interface FormData {
  nome_projeto: string;
  descricao: string;
  tipo_evento: 'rfq' | 'rfp' | 'leilao';
  valor_estimado: number;
  data_limite_resposta: string;
  criterios_avaliacao: string;
  fornecedores_convidados: string;
  origem: 'requisicao' | 'avulso';
  requisicao_origem_id?: string;
}

export default function NovoProjeto() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { criarProjeto, loading } = useProjetoSourcing();
  
  const reqId = searchParams.get('req');
  const isConfigMode = window.location.pathname.includes('/configurar');
  const [dadosRequisicao, setDadosRequisicao] = useState<DadosRequisicao | null>(null);
  const [loadingRequisicao, setLoadingRequisicao] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    nome_projeto: '',
    descricao: '',
    tipo_evento: 'rfq',
    valor_estimado: 0,
    data_limite_resposta: '',
    criterios_avaliacao: '',
    fornecedores_convidados: '',
    origem: reqId ? 'requisicao' : 'avulso',
    requisicao_origem_id: reqId || undefined
  });

  // Buscar dados da requisição quando req estiver presente
  useEffect(() => {
    if (reqId) {
      buscarDadosRequisicao(reqId);
    }
  }, [reqId]);

  const buscarDadosRequisicao = async (requisicaoId: string) => {
    try {
      setLoadingRequisicao(true);
      
      // Buscar requisição
      const { data: requisicao, error: reqError } = await supabase
        .from('requisicoes')
        .select('*')
        .eq('id', requisicaoId)
        .single();

      if (reqError) throw reqError;

      // Buscar itens da requisição
      const { data: itens, error: itensError } = await supabase
        .from('itens_requisicao')
        .select('*')
        .eq('requisicao_id', requisicaoId)
        .order('sequencia');

      if (itensError) throw itensError;

      const dadosCompletos: DadosRequisicao = {
        ...requisicao,
        itens: itens || []
      };

      setDadosRequisicao(dadosCompletos);

      // Pré-preencher formulário com dados da requisição
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() + 15); // 15 dias a partir de hoje

      setFormData(prev => ({
        ...prev,
        nome_projeto: `Sourcing - ${requisicao.titulo}`,
        descricao: `Projeto criado a partir da requisição ${requisicao.numero_requisicao}\n\nDescrição original: ${requisicao.descricao || 'Não informada'}`,
        valor_estimado: requisicao.valor_estimado,
        data_limite_resposta: dataLimite.toISOString().split('T')[0],
        criterios_avaliacao: 'Critérios técnicos: 40%\nCritérios comerciais: 60%',
        tipo_evento: requisicao.valor_estimado > 50000 ? 'rfp' : 'rfq'
      }));

    } catch (error) {
      console.error('Erro ao buscar requisição:', error);
      toast({
        title: "Erro ao Carregar Requisição",
        description: "Não foi possível carregar os dados da requisição",
        variant: "destructive"
      });
    } finally {
      setLoadingRequisicao(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const resultado = await criarProjeto({
      nome_projeto: formData.nome_projeto,
      descricao: formData.descricao,
      tipo_evento: formData.tipo_evento,
      valor_estimado: formData.valor_estimado,
      data_limite_resposta: formData.data_limite_resposta,
      criterios_avaliacao: formData.criterios_avaliacao ? JSON.parse(`{"criterios": "${formData.criterios_avaliacao}"}`) : undefined,
      fornecedores_convidados: formData.fornecedores_convidados ? formData.fornecedores_convidados.split(',').map(f => ({ nome: f.trim() })) : []
    });

    if (resultado.success) {
      navigate('/sourcing');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };

  if (loadingRequisicao) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/sourcing')}
          className="p-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">
              {isConfigMode && reqId ? 'Configurar Projeto de Sourcing' : 'Novo Projeto de Sourcing'}
            </h1>
            <Badge variant={reqId ? "default" : "secondary"}>
              {isConfigMode && reqId ? "Configuração Automática" : reqId ? "Herdado de Requisição" : "Projeto Avulso"}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {isConfigMode && reqId 
              ? "Revise e ajuste as configurações automáticas do projeto baseado na requisição"
              : reqId 
              ? "Projeto criado automaticamente a partir de uma requisição aprovada" 
              : "Projeto criado manualmente pelo comprador"
            }
          </p>
        </div>
      </div>

      {/* Card de Origem - só aparece se for herdado */}
      {dadosRequisicao && (
        <Card className="border-l-4 border-l-primary bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Requisição de Origem
            </CardTitle>
            <CardDescription>
              Dados herdados da requisição {dadosRequisicao.numero_requisicao}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">TÍTULO</Label>
                <p className="font-medium">{dadosRequisicao.titulo}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">SOLICITANTE</Label>
                <p className="font-medium">{dadosRequisicao.solicitante_nome}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">VALOR ESTIMADO</Label>
                <p className="font-medium">{formatCurrency(dadosRequisicao.valor_estimado)}</p>
              </div>
            </div>
            
            {dadosRequisicao.itens.length > 0 && (
              <div className="mt-4">
                <Label className="text-xs text-muted-foreground">ITENS ({dadosRequisicao.itens.length})</Label>
                <div className="mt-2 space-y-2">
                  {dadosRequisicao.itens.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-background rounded">
                      <span className="text-sm">{item.descricao}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.quantidade} {item.unidade} × {formatCurrency(item.preco_estimado)}
                      </span>
                    </div>
                  ))}
                  {dadosRequisicao.itens.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                      +{dadosRequisicao.itens.length - 3} itens adicionais
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Formulário Principal */}
      <form onSubmit={handleSubmit}>
        {isConfigMode && reqId ? (
          // Modo Configuração Simplificado
          <Card>
            <CardHeader>
              <CardTitle>Configuração do Projeto</CardTitle>
              <CardDescription>
                Revise e ajuste as configurações automáticas do projeto baseado na requisição.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nome_projeto">Nome do Projeto *</Label>
                  <Input
                    id="nome_projeto"
                    value={formData.nome_projeto}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome_projeto: e.target.value }))}
                    placeholder="Nome do projeto"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tipo_evento">Tipo de Evento *</Label>
                  <Select 
                    value={formData.tipo_evento} 
                    onValueChange={(value: 'rfq' | 'rfp' | 'leilao') => 
                      setFormData(prev => ({ ...prev, tipo_evento: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rfq">RFQ - Cotação</SelectItem>
                      <SelectItem value="rfp">RFP - Proposta</SelectItem>
                      <SelectItem value="leilao">Leilão Eletrônico</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Sugerido automaticamente baseado no valor estimado
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="data_limite_resposta">Data Limite para Propostas *</Label>
                  <Input
                    id="data_limite_resposta"
                    type="date"
                    value={formData.data_limite_resposta}
                    onChange={(e) => setFormData(prev => ({ ...prev, data_limite_resposta: e.target.value }))}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Calculado automaticamente (+15 dias)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="valor_estimado">Orçamento Estimado</Label>
                  <Input
                    id="valor_estimado"
                    type="number"
                    step="0.01"
                    value={formData.valor_estimado}
                    onChange={(e) => setFormData(prev => ({ ...prev, valor_estimado: parseFloat(e.target.value) || 0 }))}
                    placeholder="R$ 0,00"
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    Herdado da requisição original
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="descricao">Observações</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                  placeholder="Observações adicionais para o projeto..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        ) : (
          // Modo Completo Original
          <Tabs defaultValue="basico" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basico" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Básico
              </TabsTrigger>
              <TabsTrigger value="evento" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Evento
              </TabsTrigger>
              <TabsTrigger value="fornecedores" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Fornecedores
              </TabsTrigger>
              <TabsTrigger value="criterios" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Critérios
              </TabsTrigger>
            </TabsList>

          <TabsContent value="basico">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>
                  Defina os dados fundamentais do projeto de sourcing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="nome_projeto">Nome do Projeto *</Label>
                  <Input
                    id="nome_projeto"
                    value={formData.nome_projeto}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome_projeto: e.target.value }))}
                    placeholder="Ex: Sourcing - Equipamentos de TI Q1 2024"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                    placeholder="Descreva o objetivo e escopo do projeto..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="valor_estimado">Valor Estimado (R$) *</Label>
                    <Input
                      id="valor_estimado"
                      type="number"
                      step="0.01"
                      value={formData.valor_estimado}
                      onChange={(e) => setFormData(prev => ({ ...prev, valor_estimado: parseFloat(e.target.value) || 0 }))}
                      placeholder="0,00"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="data_limite_resposta">Data Limite para Respostas *</Label>
                    <Input
                      id="data_limite_resposta"
                      type="date"
                      value={formData.data_limite_resposta}
                      onChange={(e) => setFormData(prev => ({ ...prev, data_limite_resposta: e.target.value }))}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="evento">
            <Card>
              <CardHeader>
                <CardTitle>Configuração do Evento</CardTitle>
                <CardDescription>
                  Escolha o tipo de evento e suas características
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="tipo_evento">Tipo de Evento *</Label>
                  <Select 
                    value={formData.tipo_evento} 
                    onValueChange={(value: 'rfq' | 'rfp' | 'leilao') => 
                      setFormData(prev => ({ ...prev, tipo_evento: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rfq">RFQ - Request for Quote (Cotação)</SelectItem>
                      <SelectItem value="rfp">RFP - Request for Proposal (Proposta)</SelectItem>
                      <SelectItem value="leilao">Leilão Eletrônico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.tipo_evento === 'rfq' && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">RFQ - Request for Quote</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          Ideal para produtos/serviços padronizados. Foco no preço e condições comerciais.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {formData.tipo_evento === 'rfp' && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-900">RFP - Request for Proposal</h4>
                        <p className="text-sm text-green-700 mt-1">
                          Para soluções complexas que requerem propostas técnicas detalhadas.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {formData.tipo_evento === 'leilao' && (
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-purple-900">Leilão Eletrônico</h4>
                        <p className="text-sm text-purple-700 mt-1">
                          Competição em tempo real entre fornecedores para obter o melhor preço.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fornecedores">
            <Card>
              <CardHeader>
                <CardTitle>Fornecedores Convidados</CardTitle>
                <CardDescription>
                  Liste os fornecedores que participarão do processo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="fornecedores_convidados">
                    Fornecedores (separados por vírgula)
                  </Label>
                  <Textarea
                    id="fornecedores_convidados"
                    value={formData.fornecedores_convidados}
                    onChange={(e) => setFormData(prev => ({ ...prev, fornecedores_convidados: e.target.value }))}
                    placeholder="Ex: Fornecedor Alpha, Fornecedor Beta, Fornecedor Gamma"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Digite os nomes dos fornecedores separados por vírgulas
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="criterios">
            <Card>
              <CardHeader>
                <CardTitle>Critérios de Avaliação</CardTitle>
                <CardDescription>
                  Defina como as propostas serão avaliadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="criterios_avaliacao">Critérios de Avaliação</Label>
                  <Textarea
                    id="criterios_avaliacao"
                    value={formData.criterios_avaliacao}
                    onChange={(e) => setFormData(prev => ({ ...prev, criterios_avaliacao: e.target.value }))}
                    placeholder="Ex: Critérios técnicos: 40%, Critérios comerciais: 60%"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        )}

        <Separator className="my-6" />

        {/* Botões de Ação */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/sourcing')}
          >
            Cancelar
          </Button>
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Criando...' : 
             isConfigMode && reqId ? 'Publicar Projeto' : 'Criar Projeto'}
          </Button>
        </div>
      </form>
    </div>
  );
}
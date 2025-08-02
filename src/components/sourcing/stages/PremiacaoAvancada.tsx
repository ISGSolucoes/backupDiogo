import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Award, 
  TrendingUp, 
  Users, 
  Package, 
  Download, 
  Send, 
  CheckCircle,
  AlertCircle,
  FileText,
  Calendar,
  DollarSign,
  Target,
  Clock
} from 'lucide-react';

interface FornecedorPremiado {
  id: string;
  nome: string;
  cnpj: string;
  valorTotal: number;
  score: number;
  rank: number;
  itensAdjudicados: ItemAdjudicado[];
  observacoes?: string;
  loteId?: string;
  percentualParticipacao: number;
}

interface ItemAdjudicado {
  id: string;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  lote: string;
  criterioSelecao: string;
}

interface LotePremiacao {
  id: string;
  nome: string;
  descricao: string;
  valorTotal: number;
  quantidadeItens: number;
  fornecedorVencedor: string;
  criterioAdjudicacao: 'menor_preco' | 'melhor_score' | 'melhor_tecnico';
  status: 'pendente' | 'adjudicado' | 'finalizado';
}

interface DocumentoGerado {
  tipo: 'ata_resultado' | 'contrato' | 'termo_adjudicacao' | 'propostas_vencedoras' | 'relatorio_economia';
  nome: string;
  descricao: string;
  obrigatorio: boolean;
  gerado: boolean;
  url?: string;
}

interface PremiacaoAvancadaData {
  fornecedoresVencedores: FornecedorPremiado[];
  lotes: LotePremiacao[];
  justificativaDecisao: string;
  condicoesContratacao: {
    prazoAssinatura: number;
    prazoValidadeProposta: number;
    condicoesPagamento: string;
    observacoesContrato: string;
    clausulasEspeciais: string[];
  };
  comunicacao: {
    notificarVencedores: boolean;
    notificarNaoVencedores: boolean;
    publicarResultados: boolean;
    textoVencedores: string;
    textoNaoVencedores: string;
    textoPublicacao: string;
  };
  documentos: DocumentoGerado[];
  aprovacao: {
    aprovadorResponsavel: string;
    dataAprovacao?: string;
    observacoesAprovacao: string;
  };
  economiaDetalhada: {
    valorEstimadoInicial: number;
    valorAdjudicado: number;
    economiaAbsoluta: number;
    percentualEconomia: number;
    economiaPorLote: { lote: string; economia: number }[];
  };
  finalizado: boolean;
}

interface PremiacaoAvancadaProps {
  data?: PremiacaoAvancadaData;
  onComplete: (data: PremiacaoAvancadaData & { finalizado: boolean }) => void;
  wizardData?: any;
}

export function PremiacaoAvancada({ data, onComplete, wizardData }: PremiacaoAvancadaProps) {
  const [formData, setFormData] = useState<PremiacaoAvancadaData>({
    fornecedoresVencedores: data?.fornecedoresVencedores || [],
    lotes: data?.lotes || [],
    justificativaDecisao: data?.justificativaDecisao || '',
    condicoesContratacao: data?.condicoesContratacao || {
      prazoAssinatura: 15,
      prazoValidadeProposta: 60,
      condicoesPagamento: '',
      observacoesContrato: '',
      clausulasEspeciais: []
    },
    comunicacao: data?.comunicacao || {
      notificarVencedores: true,
      notificarNaoVencedores: true,
      publicarResultados: true,
      textoVencedores: '',
      textoNaoVencedores: '',
      textoPublicacao: ''
    },
    documentos: data?.documentos || [
      { tipo: 'ata_resultado', nome: 'Ata de Resultado', descricao: 'Documento oficial do resultado', obrigatorio: true, gerado: false },
      { tipo: 'termo_adjudicacao', nome: 'Termo de Adjudicação', descricao: 'Formalização da adjudicação', obrigatorio: true, gerado: false },
      { tipo: 'contrato', nome: 'Minuta de Contrato', descricao: 'Modelo de contrato para assinatura', obrigatorio: false, gerado: false },
      { tipo: 'propostas_vencedoras', nome: 'Propostas Vencedoras', descricao: 'Compilação das propostas premiadas', obrigatorio: false, gerado: false },
      { tipo: 'relatorio_economia', nome: 'Relatório de Economia', descricao: 'Análise detalhada da economia obtida', obrigatorio: false, gerado: false }
    ],
    aprovacao: data?.aprovacao || {
      aprovadorResponsavel: '',
      observacoesAprovacao: ''
    },
    economiaDetalhada: data?.economiaDetalhada || {
      valorEstimadoInicial: 180000,
      valorAdjudicado: 145000,
      economiaAbsoluta: 35000,
      percentualEconomia: 19.44,
      economiaPorLote: []
    },
    finalizado: data?.finalizado || false
  });

  const [activeTab, setActiveTab] = useState('resumo');
  const [isValidated, setIsValidated] = useState(false);

  // Dados mockados dos fornecedores vencedores
  const fornecedoresVencedores: FornecedorPremiado[] = [
    {
      id: '1',
      nome: 'TechCorp Solutions',
      cnpj: '12.345.678/0001-90',
      valorTotal: 145000,
      score: 8.7,
      rank: 1,
      percentualParticipacao: 75.5,
      itensAdjudicados: [
        { id: '1', descricao: 'Sistema de Gestão', quantidade: 1, valorUnitario: 80000, valorTotal: 80000, lote: 'Lote 1', criterioSelecao: 'Melhor Score' },
        { id: '2', descricao: 'Implementação', quantidade: 1, valorUnitario: 45000, valorTotal: 45000, lote: 'Lote 1', criterioSelecao: 'Melhor Score' },
        { id: '3', descricao: 'Treinamento', quantidade: 1, valorUnitario: 20000, valorTotal: 20000, lote: 'Lote 2', criterioSelecao: 'Menor Preço' }
      ],
      observacoes: 'Vencedor por melhor pontuação técnica e comercial'
    },
    {
      id: '2',
      nome: 'InnovaTech Ltda',
      cnpj: '98.765.432/0001-10',
      valorTotal: 47000,
      score: 8.4,
      rank: 2,
      percentualParticipacao: 24.5,
      itensAdjudicados: [
        { id: '4', descricao: 'Suporte Técnico', quantidade: 12, valorUnitario: 3500, valorTotal: 42000, lote: 'Lote 3', criterioSelecao: 'Menor Preço' },
        { id: '5', descricao: 'Manutenção', quantidade: 1, valorUnitario: 5000, valorTotal: 5000, lote: 'Lote 3', criterioSelecao: 'Menor Preço' }
      ],
      observacoes: 'Vencedor por menor preço no lote de serviços'
    }
  ];

  const lotes: LotePremiacao[] = [
    {
      id: '1',
      nome: 'Lote 1 - Software',
      descricao: 'Sistema de gestão e implementação',
      valorTotal: 125000,
      quantidadeItens: 2,
      fornecedorVencedor: 'TechCorp Solutions',
      criterioAdjudicacao: 'melhor_score',
      status: 'adjudicado'
    },
    {
      id: '2',
      nome: 'Lote 2 - Treinamento',
      descricao: 'Capacitação de usuários',
      valorTotal: 20000,
      quantidadeItens: 1,
      fornecedorVencedor: 'TechCorp Solutions',
      criterioAdjudicacao: 'menor_preco',
      status: 'adjudicado'
    },
    {
      id: '3',
      nome: 'Lote 3 - Serviços',
      descricao: 'Suporte e manutenção',
      valorTotal: 47000,
      quantidadeItens: 2,
      fornecedorVencedor: 'InnovaTech Ltda',
      criterioAdjudicacao: 'menor_preco',
      status: 'adjudicado'
    }
  ];

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      fornecedoresVencedores,
      lotes
    }));
  }, []);

  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const isValid = 
      formData.fornecedoresVencedores.length > 0 &&
      formData.justificativaDecisao.trim() !== '' &&
      formData.condicoesContratacao.condicoesPagamento.trim() !== '' &&
      formData.aprovacao.aprovadorResponsavel.trim() !== '';
    
    setIsValidated(isValid);
    onComplete({ ...formData, finalizado: isValid });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const calcularEconomiaTotal = () => {
    const valorAdjudicado = formData.fornecedoresVencedores.reduce((sum, f) => sum + f.valorTotal, 0);
    const economia = formData.economiaDetalhada.valorEstimadoInicial - valorAdjudicado;
    return economia;
  };

  const calcularPercentualEconomia = () => {
    const economia = calcularEconomiaTotal();
    return (economia / formData.economiaDetalhada.valorEstimadoInicial) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Resumo da Premiação */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Economia Total</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(calcularEconomiaTotal())}
                </p>
                <p className="text-xs text-muted-foreground">
                  {calcularPercentualEconomia().toFixed(1)}% de economia
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Fornecedores Vencedores</p>
                <p className="text-2xl font-bold">{formData.fornecedoresVencedores.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Lotes Adjudicados</p>
                <p className="text-2xl font-bold">{formData.lotes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Valor Adjudicado</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(formData.fornecedoresVencedores.reduce((sum, f) => sum + f.valorTotal, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
          <TabsTrigger value="lotes">Lotes</TabsTrigger>
          <TabsTrigger value="fornecedores">Fornecedores</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
          <TabsTrigger value="finalizacao">Finalização</TabsTrigger>
        </TabsList>

        <TabsContent value="resumo">
          <div className="space-y-6">
            {/* Justificativa da Decisão */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Justificativa da Decisão
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Descreva a justificativa técnica e comercial para a decisão de premiação..."
                  value={formData.justificativaDecisao}
                  onChange={(e) => setFormData(prev => ({ ...prev, justificativaDecisao: e.target.value }))}
                  className="min-h-32"
                />
              </CardContent>
            </Card>

            {/* Economia Detalhada */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Análise de Economia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Valor Estimado Inicial</p>
                    <p className="text-xl font-bold">{formatCurrency(formData.economiaDetalhada.valorEstimadoInicial)}</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Valor Adjudicado</p>
                    <p className="text-xl font-bold">{formatCurrency(formData.fornecedoresVencedores.reduce((sum, f) => sum + f.valorTotal, 0))}</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-700">Economia Obtida</p>
                    <p className="text-xl font-bold text-green-700">{formatCurrency(calcularEconomiaTotal())}</p>
                    <p className="text-sm text-green-600">{calcularPercentualEconomia().toFixed(1)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="lotes">
          <Card>
            <CardHeader>
              <CardTitle>Adjudicação por Lotes</CardTitle>
              <CardDescription>Resultado da premiação organizado por lotes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formData.lotes.map((lote) => (
                  <Card key={lote.id} className="border-l-4 border-l-primary">
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <h4 className="font-medium">{lote.nome}</h4>
                          <p className="text-sm text-muted-foreground">{lote.descricao}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Valor Total</p>
                          <p className="font-medium">{formatCurrency(lote.valorTotal)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Fornecedor Vencedor</p>
                          <p className="font-medium">{lote.fornecedorVencedor}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Critério</p>
                          <Badge variant="outline">
                            {lote.criterioAdjudicacao === 'menor_preco' ? 'Menor Preço' :
                             lote.criterioAdjudicacao === 'melhor_score' ? 'Melhor Score' : 'Melhor Técnico'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fornecedores">
          <Card>
            <CardHeader>
              <CardTitle>Fornecedores Vencedores</CardTitle>
              <CardDescription>Detalhamento dos fornecedores premiados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {formData.fornecedoresVencedores.map((fornecedor) => (
                  <Card key={fornecedor.id}>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-lg">{fornecedor.nome}</h4>
                            <p className="text-sm text-muted-foreground">{fornecedor.cnpj}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold">{formatCurrency(fornecedor.valorTotal)}</p>
                            <p className="text-sm text-muted-foreground">
                              {fornecedor.percentualParticipacao.toFixed(1)}% do total
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Rank</p>
                            <p className="font-medium">{fornecedor.rank}º colocado</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Score</p>
                            <p className="font-medium">{fornecedor.score.toFixed(1)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Itens Adjudicados</p>
                            <p className="font-medium">{fornecedor.itensAdjudicados.length} itens</p>
                          </div>
                        </div>

                        {fornecedor.observacoes && (
                          <div className="p-3 bg-muted rounded-lg">
                            <p className="text-sm">{fornecedor.observacoes}</p>
                          </div>
                        )}

                        <Separator />

                        <div>
                          <h5 className="font-medium mb-2">Itens Adjudicados</h5>
                          <div className="space-y-2">
                            {fornecedor.itensAdjudicados.map((item) => (
                              <div key={item.id} className="flex justify-between items-center p-2 bg-muted rounded">
                                <div>
                                  <p className="font-medium">{item.descricao}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {item.lote} • {item.criterioSelecao}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">{formatCurrency(item.valorTotal)}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Qtd: {item.quantidade}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentos">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documentos a Gerar
              </CardTitle>
              <CardDescription>Selecione os documentos que devem ser gerados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formData.documentos.map((doc) => (
                  <div key={doc.tipo} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={doc.gerado}
                        disabled={doc.obrigatorio}
                        onCheckedChange={(checked) => {
                          setFormData(prev => ({
                            ...prev,
                            documentos: prev.documentos.map(d => 
                              d.tipo === doc.tipo ? { ...d, gerado: !!checked } : d
                            )
                          }));
                        }}
                      />
                      <div>
                        <p className="font-medium">{doc.nome}</p>
                        <p className="text-sm text-muted-foreground">{doc.descricao}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {doc.obrigatorio && (
                        <Badge variant="destructive" className="text-xs">Obrigatório</Badge>
                      )}
                      {doc.gerado && (
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finalizacao">
          <div className="space-y-6">
            {/* Condições de Contratação */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Condições de Contratação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="prazoAssinatura">Prazo para Assinatura (dias)</Label>
                    <Input
                      id="prazoAssinatura"
                      type="number"
                      value={formData.condicoesContratacao.prazoAssinatura}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        condicoesContratacao: {
                          ...prev.condicoesContratacao,
                          prazoAssinatura: parseInt(e.target.value) || 0
                        }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="prazoValidadeProposta">Prazo de Validade da Proposta (dias)</Label>
                    <Input
                      id="prazoValidadeProposta"
                      type="number"
                      value={formData.condicoesContratacao.prazoValidadeProposta}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        condicoesContratacao: {
                          ...prev.condicoesContratacao,
                          prazoValidadeProposta: parseInt(e.target.value) || 0
                        }
                      }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="condicoesPagamento">Condições de Pagamento</Label>
                  <Textarea
                    id="condicoesPagamento"
                    placeholder="Descreva as condições de pagamento..."
                    value={formData.condicoesContratacao.condicoesPagamento}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      condicoesContratacao: {
                        ...prev.condicoesContratacao,
                        condicoesPagamento: e.target.value
                      }
                    }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Aprovação */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Aprovação Final
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="aprovadorResponsavel">Aprovador Responsável</Label>
                  <Input
                    id="aprovadorResponsavel"
                    placeholder="Nome do responsável pela aprovação"
                    value={formData.aprovacao.aprovadorResponsavel}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      aprovacao: {
                        ...prev.aprovacao,
                        aprovadorResponsavel: e.target.value
                      }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="observacoesAprovacao">Observações da Aprovação</Label>
                  <Textarea
                    id="observacoesAprovacao"
                    placeholder="Observações sobre a aprovação..."
                    value={formData.aprovacao.observacoesAprovacao}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      aprovacao: {
                        ...prev.aprovacao,
                        observacoesAprovacao: e.target.value
                      }
                    }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Status Final */}
            {isValidated && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <h3 className="font-medium text-green-900">Premiação Finalizada</h3>
                      <p className="text-sm text-green-700">
                        Todos os dados foram validados e a premiação está pronta para ser efetivada.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Send className="h-4 w-4 mr-2" />
                      Efetivar Premiação
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Gerar Documentos
                    </Button>
                    <Button variant="outline">
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Notificações
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
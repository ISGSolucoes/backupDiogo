import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Clock, 
  Award, 
  Users, 
  BarChart3, 
  Download, 
  Share2,
  Target,
  AlertCircle,
  CheckCircle,
  Calendar,
  FileText,
  PieChart,
  Activity,
  Zap,
  Eye
} from 'lucide-react';

interface IndicadorOperacional {
  id: string;
  nome: string;
  valor: number;
  unidade: string;
  meta?: number;
  variacao: number;
  tendencia: 'up' | 'down' | 'stable';
  status: 'excelente' | 'bom' | 'atencao' | 'critico';
  descricao: string;
}

interface MetricaEconomia {
  valorEstimadoInicial: number;
  valorAdjudicado: number;
  economiaAbsoluta: number;
  percentualEconomia: number;
  economiaPorLote: { nome: string; economia: number; percentual: number }[];
  comparativoHistorico: { periodo: string; economia: number }[];
}

interface AnaliseParticipacao {
  totalFornecedores: number;
  fornecedoresParticipantes: number;
  taxaParticipacao: number;
  participacaoPorRegiao: { regiao: string; quantidade: number }[];
  participacaoPorPorte: { porte: string; quantidade: number }[];
  novosFornecedores: number;
  fornecedoresRecorrentes: number;
}

interface CicloEvento {
  etapa: string;
  dataInicio: string;
  dataFim: string;
  duracaoRealDias: number;
  duracaoPlnejadaDias: number;
  status: 'concluida' | 'em_andamento' | 'atrasada';
  responsavel: string;
  observacoes?: string;
}

interface InsightIA {
  id: string;
  tipo: 'economia' | 'prazo' | 'qualidade' | 'fornecedor' | 'processo';
  titulo: string;
  descricao: string;
  impacto: 'alto' | 'medio' | 'baixo';
  recomendacao: string;
  dadosSuportivos: Record<string, any>;
  confianca: number;
}

interface RelatorioDisponivel {
  id: string;
  nome: string;
  descricao: string;
  tipo: 'pdf' | 'excel' | 'powerpoint';
  categoria: 'economia' | 'fornecedores' | 'processo' | 'diretoria';
  gerado: boolean;
  url?: string;
}

interface IndicadoresData {
  indicadoresOperacionais: IndicadorOperacional[];
  metricas: MetricaEconomia;
  participacao: AnaliseParticipacao;
  cicloEvento: CicloEvento[];
  insights: InsightIA[];
  relatorios: RelatorioDisponivel[];
  configuracao: {
    periodoAnalise: string;
    departamentoOrigem: string;
    categoriaCompra: string;
  };
  finalizado: boolean;
}

interface IndicadoresProps {
  data?: IndicadoresData;
  onComplete: (data: IndicadoresData & { finalizado: boolean }) => void;
  wizardData?: any;
}

export function Indicadores({ data, onComplete, wizardData }: IndicadoresProps) {
  const [formData, setFormData] = useState<IndicadoresData>({
    indicadoresOperacionais: data?.indicadoresOperacionais || [],
    metricas: data?.metricas || {
      valorEstimadoInicial: 180000,
      valorAdjudicado: 145000,
      economiaAbsoluta: 35000,
      percentualEconomia: 19.44,
      economiaPorLote: [],
      comparativoHistorico: []
    },
    participacao: data?.participacao || {
      totalFornecedores: 15,
      fornecedoresParticipantes: 8,
      taxaParticipacao: 53.3,
      participacaoPorRegiao: [],
      participacaoPorPorte: [],
      novosFornecedores: 3,
      fornecedoresRecorrentes: 5
    },
    cicloEvento: data?.cicloEvento || [],
    insights: data?.insights || [],
    relatorios: data?.relatorios || [],
    configuracao: data?.configuracao || {
      periodoAnalise: '2024',
      departamentoOrigem: 'TI',
      categoriaCompra: 'Software'
    },
    finalizado: data?.finalizado || false
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [periodoComparativo, setPeriodoComparativo] = useState('ano_atual');

  // Dados mockados
  const indicadoresOperacionais: IndicadorOperacional[] = [
    {
      id: '1',
      nome: 'Economia Obtida',
      valor: 19.44,
      unidade: '%',
      meta: 15.0,
      variacao: 4.44,
      tendencia: 'up',
      status: 'excelente',
      descricao: 'Percentual de economia em relação ao valor estimado inicial'
    },
    {
      id: '2',
      nome: 'Prazo de Execução',
      valor: 45,
      unidade: 'dias',
      meta: 60,
      variacao: -15,
      tendencia: 'up',
      status: 'bom',
      descricao: 'Tempo total do processo de sourcing'
    },
    {
      id: '3',
      nome: 'Qualidade Técnica Média',
      valor: 8.7,
      unidade: 'nota',
      meta: 8.0,
      variacao: 0.7,
      tendencia: 'up',
      status: 'excelente',
      descricao: 'Média das avaliações técnicas das propostas vencedoras'
    },
    {
      id: '4',
      nome: 'Taxa de Participação',
      valor: 53.3,
      unidade: '%',
      meta: 60.0,
      variacao: -6.7,
      tendencia: 'down',
      status: 'atencao',
      descricao: 'Percentual de fornecedores que participaram do processo'
    },
    {
      id: '5',
      nome: 'Conformidade Documental',
      valor: 95.0,
      unidade: '%',
      meta: 100.0,
      variacao: -5.0,
      tendencia: 'stable',
      status: 'bom',
      descricao: 'Percentual de propostas com documentação completa'
    },
    {
      id: '6',
      nome: 'Satisfação Requisitante',
      valor: 9.2,
      unidade: 'nota',
      meta: 8.5,
      variacao: 0.7,
      tendencia: 'up',
      status: 'excelente',
      descricao: 'Avaliação do solicitante sobre o processo'
    }
  ];

  const cicloEvento: CicloEvento[] = [
    {
      etapa: 'Planejamento e Especificação',
      dataInicio: '2024-01-15',
      dataFim: '2024-01-25',
      duracaoRealDias: 10,
      duracaoPlnejadaDias: 12,
      status: 'concluida',
      responsavel: 'Equipe de Compras'
    },
    {
      etapa: 'Publicação e Divulgação',
      dataInicio: '2024-01-26',
      dataFim: '2024-01-30',
      duracaoRealDias: 4,
      duracaoPlnejadaDias: 5,
      status: 'concluida',
      responsavel: 'Equipe de Compras'
    },
    {
      etapa: 'Recebimento de Propostas',
      dataInicio: '2024-01-31',
      dataFim: '2024-02-14',
      duracaoRealDias: 14,
      duracaoPlnejadaDias: 15,
      status: 'concluida',
      responsavel: 'Sistema Automático'
    },
    {
      etapa: 'Análise e Julgamento',
      dataInicio: '2024-02-15',
      dataFim: '2024-02-28',
      duracaoRealDias: 13,
      duracaoPlnejadaDias: 10,
      status: 'concluida',
      responsavel: 'Comissão de Avaliação',
      observacoes: 'Atrasou 3 dias devido a esclarecimentos técnicos'
    },
    {
      etapa: 'Premiação e Adjudicação',
      dataInicio: '2024-03-01',
      dataFim: '2024-03-05',
      duracaoRealDias: 4,
      duracaoPlnejadaDias: 5,
      status: 'concluida',
      responsavel: 'Gestor do Processo'
    }
  ];

  const insights: InsightIA[] = [
    {
      id: '1',
      tipo: 'economia',
      titulo: 'Economia Acima da Meta',
      descricao: 'A economia obtida (19,44%) superou em 29% a meta estabelecida (15%)',
      impacto: 'alto',
      recomendacao: 'Considere aplicar a mesma estratégia em processos similares',
      dadosSuportivos: { metaOriginal: 15, resultadoObtido: 19.44 },
      confianca: 95
    },
    {
      id: '2',
      tipo: 'fornecedor',
      titulo: 'Baixa Participação de Fornecedores',
      descricao: 'A taxa de participação (53,3%) ficou abaixo da meta de 60%',
      impacto: 'medio',
      recomendacao: 'Ampliar a divulgação e revisar critérios de habilitação',
      dadosSuportivos: { taxaAtual: 53.3, meta: 60 },
      confianca: 88
    },
    {
      id: '3',
      tipo: 'prazo',
      titulo: 'Processo Eficiente',
      descricao: 'O processo foi concluído 15 dias antes do prazo previsto',
      impacto: 'alto',
      recomendacao: 'Documentar as boas práticas para replicar em outros processos',
      dadosSuportivos: { prazoReal: 45, prazoPrevisto: 60 },
      confianca: 100
    },
    {
      id: '4',
      tipo: 'qualidade',
      titulo: 'Excelente Qualidade Técnica',
      descricao: 'A nota média das propostas vencedoras (8,7) superou as expectativas',
      impacto: 'alto',
      recomendacao: 'Manter os critérios técnicos utilizados para futuras contratações',
      dadosSuportivos: { notaMedia: 8.7, benchmark: 8.0 },
      confianca: 92
    }
  ];

  const relatorios: RelatorioDisponivel[] = [
    {
      id: '1',
      nome: 'Relatório de Economia Detalhado',
      descricao: 'Análise completa da economia obtida com comparativos históricos',
      tipo: 'pdf',
      categoria: 'economia',
      gerado: false
    },
    {
      id: '2',
      nome: 'Dashboard Executivo',
      descricao: 'Resumo executivo com principais indicadores para diretoria',
      tipo: 'powerpoint',
      categoria: 'diretoria',
      gerado: false
    },
    {
      id: '3',
      nome: 'Análise de Fornecedores',
      descricao: 'Relatório detalhado sobre participação e desempenho dos fornecedores',
      tipo: 'excel',
      categoria: 'fornecedores',
      gerado: false
    },
    {
      id: '4',
      nome: 'Métricas de Processo',
      descricao: 'Indicadores operacionais e de eficiência do processo',
      tipo: 'pdf',
      categoria: 'processo',
      gerado: false
    }
  ];

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      indicadoresOperacionais,
      cicloEvento,
      insights,
      relatorios
    }));
  }, []);

  useEffect(() => {
    onComplete({ ...formData, finalizado: true });
  }, [formData, onComplete]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    const statusMap = {
      'excelente': 'text-green-600',
      'bom': 'text-blue-600',
      'atencao': 'text-yellow-600',
      'critico': 'text-red-600'
    };
    return statusMap[status as keyof typeof statusMap] || 'text-gray-600';
  };

  const getStatusIcon = (status: string) => {
    const iconMap = {
      'excelente': <CheckCircle className="h-4 w-4 text-green-600" />,
      'bom': <CheckCircle className="h-4 w-4 text-blue-600" />,
      'atencao': <AlertCircle className="h-4 w-4 text-yellow-600" />,
      'critico': <AlertCircle className="h-4 w-4 text-red-600" />
    };
    return iconMap[status as keyof typeof iconMap];
  };

  const getTendenciaIcon = (tendencia: string) => {
    const iconMap = {
      'up': <TrendingUp className="h-4 w-4 text-green-600" />,
      'down': <TrendingDown className="h-4 w-4 text-red-600" />,
      'stable': <Activity className="h-4 w-4 text-gray-600" />
    };
    return iconMap[tendencia as keyof typeof iconMap];
  };

  const getImpactoBadge = (impacto: string) => {
    const impactoMap = {
      'alto': { label: 'Alto Impacto', variant: 'destructive' as const },
      'medio': { label: 'Médio Impacto', variant: 'secondary' as const },
      'baixo': { label: 'Baixo Impacto', variant: 'outline' as const }
    };
    const config = impactoMap[impacto as keyof typeof impactoMap];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Resumo Executivo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Economia Total</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(formData.metricas.economiaAbsoluta)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formData.metricas.percentualEconomia.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Prazo Total</p>
                <p className="text-2xl font-bold">45 dias</p>
                <p className="text-xs text-green-600">15 dias antes do previsto</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Qualidade Média</p>
                <p className="text-2xl font-bold">8.7</p>
                <p className="text-xs text-green-600">Acima da meta (8.0)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Participação</p>
                <p className="text-2xl font-bold">53.3%</p>
                <p className="text-xs text-yellow-600">Abaixo da meta (60%)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="economia">Economia</TabsTrigger>
          <TabsTrigger value="participacao">Participação</TabsTrigger>
          <TabsTrigger value="processo">Processo</TabsTrigger>
          <TabsTrigger value="insights">Insights IA</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="space-y-6">
            {/* Indicadores Operacionais */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Indicadores Operacionais
                </CardTitle>
                <CardDescription>Principais métricas de desempenho do processo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {formData.indicadoresOperacionais.map((indicador) => (
                    <Card key={indicador.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">{indicador.nome}</h4>
                          {getStatusIcon(indicador.status)}
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className={`text-2xl font-bold ${getStatusColor(indicador.status)}`}>
                            {indicador.valor}{indicador.unidade}
                          </span>
                          {getTendenciaIcon(indicador.tendencia)}
                        </div>
                        {indicador.meta && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Meta: {indicador.meta}{indicador.unidade}</span>
                              <span>
                                {indicador.variacao > 0 ? '+' : ''}{indicador.variacao}{indicador.unidade}
                              </span>
                            </div>
                            <Progress 
                              value={Math.min((indicador.valor / indicador.meta) * 100, 100)} 
                              className="h-2" 
                            />
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground">{indicador.descricao}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Status Geral */}
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div>
                    <h3 className="font-medium text-green-900">Processo Concluído com Sucesso</h3>
                    <p className="text-sm text-green-700">
                      Todas as etapas foram finalizadas e os indicadores mostram excelente desempenho
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="economia">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Análise de Economia Detalhada
                </CardTitle>
                <CardDescription>Breakdown completo da economia obtida</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Valor Estimado Inicial</p>
                    <p className="text-2xl font-bold">{formatCurrency(formData.metricas.valorEstimadoInicial)}</p>
                  </div>
                  <div className="text-center p-6 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Valor Adjudicado</p>
                    <p className="text-2xl font-bold">{formatCurrency(formData.metricas.valorAdjudicado)}</p>
                  </div>
                  <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-700">Economia Obtida</p>
                    <p className="text-3xl font-bold text-green-700">{formatCurrency(formData.metricas.economiaAbsoluta)}</p>
                    <p className="text-lg font-medium text-green-600">{formData.metricas.percentualEconomia.toFixed(1)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Comparativo Histórico</CardTitle>
                <CardDescription>Economia em relação a processos anteriores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  [Gráfico de Linha - Evolução da Economia]
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="participacao">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Análise de Participação
                </CardTitle>
                <CardDescription>Estatísticas sobre a participação dos fornecedores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Convidados</p>
                    <p className="text-2xl font-bold">{formData.participacao.totalFornecedores}</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Participaram</p>
                    <p className="text-2xl font-bold">{formData.participacao.fornecedoresParticipantes}</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700">Taxa de Participação</p>
                    <p className="text-2xl font-bold text-blue-700">{formData.participacao.taxaParticipacao.toFixed(1)}%</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Novos Fornecedores</p>
                    <p className="text-2xl font-bold">{formData.participacao.novosFornecedores}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Participação por Região</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-center justify-center text-muted-foreground">
                    [Gráfico de Pizza - Distribuição Regional]
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Participação por Porte</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-center justify-center text-muted-foreground">
                    [Gráfico de Barras - Porte das Empresas]
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="processo">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Ciclo do Processo
              </CardTitle>
              <CardDescription>Timeline detalhado de todas as etapas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formData.cicloEvento.map((etapa, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{etapa.etapa}</h4>
                        <Badge variant={etapa.status === 'concluida' ? 'default' : etapa.status === 'atrasada' ? 'destructive' : 'secondary'}>
                          {etapa.status === 'concluida' ? 'Concluída' : etapa.status === 'atrasada' ? 'Atrasada' : 'Em Andamento'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Período</p>
                          <p>{new Date(etapa.dataInicio).toLocaleDateString('pt-BR')} - {new Date(etapa.dataFim).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Duração</p>
                          <p>{etapa.duracaoRealDias} dias ({etapa.duracaoRealDias - etapa.duracaoPlnejadaDias > 0 ? '+' : ''}{etapa.duracaoRealDias - etapa.duracaoPlnejadaDias})</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Responsável</p>
                          <p>{etapa.responsavel}</p>
                        </div>
                        <div>
                          <Progress 
                            value={etapa.status === 'concluida' ? 100 : 50} 
                            className="mt-2" 
                          />
                        </div>
                      </div>
                      {etapa.observacoes && (
                        <p className="text-xs text-muted-foreground mt-2 italic">{etapa.observacoes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Insights da Inteligência Artificial
                </CardTitle>
                <CardDescription>Análises automáticas e recomendações baseadas em dados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {formData.insights.map((insight) => (
                    <Card key={insight.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-grow">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium">{insight.titulo}</h4>
                              {getImpactoBadge(insight.impacto)}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{insight.descricao}</p>
                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <p className="text-sm text-blue-900">
                                <strong>Recomendação:</strong> {insight.recomendacao}
                              </p>
                            </div>
                          </div>
                          <div className="flex-shrink-0 ml-4">
                            <div className="text-center">
                              <p className="text-xs text-muted-foreground">Confiança</p>
                              <p className="text-lg font-bold text-primary">{insight.confianca}%</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Seção de Relatórios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Relatórios Disponíveis
          </CardTitle>
          <CardDescription>Gere relatórios detalhados para diferentes audiências</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.relatorios.map((relatorio) => (
              <div key={relatorio.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{relatorio.nome}</h4>
                    <p className="text-sm text-muted-foreground">{relatorio.descricao}</p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {relatorio.tipo.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Gerar
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ações Finais */}
      <div className="flex gap-4">
        <Button>
          <Share2 className="h-4 w-4 mr-2" />
          Compartilhar Dashboard
        </Button>
        <Button variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          Agendar Relatório Recorrente
        </Button>
        <Button variant="outline">
          <Eye className="h-4 w-4 mr-2" />
          Visualizar no Power BI
        </Button>
      </div>
    </div>
  );
}
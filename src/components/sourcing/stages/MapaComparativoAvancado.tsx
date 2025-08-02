import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowUpDown, 
  Download, 
  Filter, 
  BarChart3, 
  TrendingUp, 
  Award,
  Calculator,
  Target,
  Zap,
  FileText,
  Eye,
  Users
} from 'lucide-react';

interface PropostaDetalhada {
  id: string;
  fornecedor: string;
  cnpj: string;
  valorTotal: number;
  score: number;
  rank: number;
  status: 'classificada' | 'desclassificada' | 'em_analise';
  prazoEntrega: number;
  garantia: number;
  experiencia: number;
  capacidadeTecnica: number;
  criterios: {
    preco: number;
    qualidade: number;
    prazo: number;
    tecnico: number;
    comercial: number;
  };
  itens: {
    id: string;
    descricao: string;
    quantidade: number;
    valorUnitario: number;
    valorTotal: number;
    prazoEntrega: number;
  }[];
  documentos: string[];
  observacoes?: string;
}

interface CenarioSimulacao {
  id: string;
  nome: string;
  descricao: string;
  filtros: {
    criterio: string;
    peso: number;
  }[];
  recomendacao: string;
}

interface MapaComparativoAvancadoData {
  propostas: PropostaDetalhada[];
  baseline: {
    valorMedio: number;
    maiorValor: number;
    menorValor: number;
    economiaProjetada: number;
  };
  cenarios: CenarioSimulacao[];
  configuracao: {
    permitirEmpate: boolean;
    criterioDesempate: string;
    limiteClassificados: number;
  };
}

interface MapaComparativoAvancadoProps {
  data?: MapaComparativoAvancadoData;
  onComplete: (data: MapaComparativoAvancadoData & { finalizado: boolean }) => void;
  wizardData?: any;
}

const CENARIOS_PADRAO: CenarioSimulacao[] = [
  {
    id: 'menor_preco',
    nome: 'Menor Preço',
    descricao: 'Prioriza propostas com menor valor comercial',
    filtros: [
      { criterio: 'preco', peso: 70 },
      { criterio: 'qualidade', peso: 20 },
      { criterio: 'prazo', peso: 10 }
    ],
    recomendacao: 'Ideal para compras padronizadas com especificação técnica bem definida'
  },
  {
    id: 'melhor_score',
    nome: 'Melhor Score Técnico',
    descricao: 'Equilibra preço e qualidade técnica',
    filtros: [
      { criterio: 'tecnico', peso: 40 },
      { criterio: 'preco', peso: 35 },
      { criterio: 'qualidade', peso: 25 }
    ],
    recomendacao: 'Recomendado para projetos críticos que exigem alta qualidade'
  },
  {
    id: 'melhor_prazo',
    nome: 'Melhor Prazo',
    descricao: 'Prioriza fornecedores com menor prazo de entrega',
    filtros: [
      { criterio: 'prazo', peso: 50 },
      { criterio: 'preco', peso: 30 },
      { criterio: 'qualidade', peso: 20 }
    ],
    recomendacao: 'Para demandas urgentes onde o prazo é crítico'
  },
  {
    id: 'melhor_tco',
    nome: 'Melhor TCO',
    descricao: 'Considera custo total de propriedade',
    filtros: [
      { criterio: 'preco', peso: 40 },
      { criterio: 'qualidade', peso: 30 },
      { criterio: 'tecnico', peso: 20 },
      { criterio: 'comercial', peso: 10 }
    ],
    recomendacao: 'Melhor custo-benefício a longo prazo'
  }
];

export function MapaComparativoAvancado({ data, onComplete, wizardData }: MapaComparativoAvancadoProps) {
  const [formData, setFormData] = useState<MapaComparativoAvancadoData>({
    propostas: data?.propostas || [],
    baseline: data?.baseline || {
      valorMedio: 150000,
      maiorValor: 180000,
      menorValor: 120000,
      economiaProjetada: 25000
    },
    cenarios: data?.cenarios || CENARIOS_PADRAO,
    configuracao: data?.configuracao || {
      permitirEmpate: false,
      criterioDesempate: 'preco',
      limiteClassificados: 3
    }
  });

  const [activeTab, setActiveTab] = useState('detalhada');
  const [cenarioSelecionado, setCenarioSelecionado] = useState('melhor_score');
  const [filtroStatus, setFiltroStatus] = useState('todos');

  // Dados mockados das propostas
  const propostas: PropostaDetalhada[] = [
    {
      id: '1',
      fornecedor: 'TechCorp Solutions',
      cnpj: '12.345.678/0001-90',
      valorTotal: 145000,
      score: 8.7,
      rank: 1,
      status: 'classificada',
      prazoEntrega: 45,
      garantia: 24,
      experiencia: 8,
      capacidadeTecnica: 9,
      criterios: { preco: 8.5, qualidade: 9.0, prazo: 8.0, tecnico: 9.2, comercial: 8.8 },
      itens: [
        { id: '1', descricao: 'Sistema de Gestão', quantidade: 1, valorUnitario: 80000, valorTotal: 80000, prazoEntrega: 30 },
        { id: '2', descricao: 'Implementação', quantidade: 1, valorUnitario: 45000, valorTotal: 45000, prazoEntrega: 45 },
        { id: '3', descricao: 'Treinamento', quantidade: 1, valorUnitario: 20000, valorTotal: 20000, prazoEntrega: 15 }
      ],
      documentos: ['Proposta Técnica', 'Proposta Comercial', 'Certidões'],
      observacoes: 'Excelente histórico e referências sólidas'
    },
    {
      id: '2',
      fornecedor: 'InnovaTech Ltda',
      cnpj: '98.765.432/0001-10',
      valorTotal: 138000,
      score: 8.4,
      rank: 2,
      status: 'classificada',
      prazoEntrega: 60,
      garantia: 18,
      experiencia: 7,
      capacidadeTecnica: 8,
      criterios: { preco: 9.0, qualidade: 8.5, prazo: 7.0, tecnico: 8.0, comercial: 8.5 },
      itens: [
        { id: '1', descricao: 'Sistema de Gestão', quantidade: 1, valorUnitario: 75000, valorTotal: 75000, prazoEntrega: 45 },
        { id: '2', descricao: 'Implementação', quantidade: 1, valorUnitario: 43000, valorTotal: 43000, prazoEntrega: 60 },
        { id: '3', descricao: 'Treinamento', quantidade: 1, valorUnitario: 20000, valorTotal: 20000, prazoEntrega: 10 }
      ],
      documentos: ['Proposta Técnica', 'Proposta Comercial', 'Certidões'],
      observacoes: 'Menor preço com boa qualidade técnica'
    },
    {
      id: '3',
      fornecedor: 'Global Systems Inc',
      cnpj: '11.222.333/0001-44',
      valorTotal: 162000,
      score: 7.9,
      rank: 3,
      status: 'classificada',
      prazoEntrega: 30,
      garantia: 36,
      experiencia: 9,
      capacidadeTecnica: 8,
      criterios: { preco: 7.0, qualidade: 8.8, prazo: 9.5, tecnico: 8.5, comercial: 7.8 },
      itens: [
        { id: '1', descricao: 'Sistema de Gestão', quantidade: 1, valorUnitario: 90000, valorTotal: 90000, prazoEntrega: 20 },
        { id: '2', descricao: 'Implementação', quantidade: 1, valorUnitario: 50000, valorTotal: 50000, prazoEntrega: 30 },
        { id: '3', descricao: 'Treinamento', quantidade: 1, valorUnitario: 22000, valorTotal: 22000, prazoEntrega: 15 }
      ],
      documentos: ['Proposta Técnica', 'Proposta Comercial', 'Certidões', 'Referências'],
      observacoes: 'Melhor prazo de entrega e maior garantia'
    }
  ];

  useEffect(() => {
    setFormData(prev => ({ ...prev, propostas }));
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

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'classificada': { label: 'Classificada', variant: 'default' as const },
      'desclassificada': { label: 'Desclassificada', variant: 'destructive' as const },
      'em_analise': { label: 'Em Análise', variant: 'secondary' as const }
    };
    const config = statusMap[status as keyof typeof statusMap];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getRankBadge = (rank: number) => {
    const colors = ['bg-yellow-500', 'bg-gray-400', 'bg-yellow-600'];
    return (
      <div className={`w-8 h-8 rounded-full ${colors[rank - 1] || 'bg-gray-300'} text-white flex items-center justify-center text-sm font-bold`}>
        {rank}º
      </div>
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'text-green-600';
    if (score >= 7.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const PropostasProximasCombinadas = () => {
    const cenario = CENARIOS_PADRAO.find(c => c.id === cenarioSelecionado);
    const propostas = formData.propostas.filter(p => 
      filtroStatus === 'todos' || p.status === filtroStatus
    );

    return (
      <div className="space-y-6">
        {/* Controles de Filtro */}
        <div className="flex gap-4 items-center">
          <Select value={cenarioSelecionado} onValueChange={setCenarioSelecionado}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CENARIOS_PADRAO.map(cenario => (
                <SelectItem key={cenario.id} value={cenario.id}>
                  {cenario.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={filtroStatus} onValueChange={setFiltroStatus}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Status</SelectItem>
              <SelectItem value="classificada">Classificadas</SelectItem>
              <SelectItem value="em_analise">Em Análise</SelectItem>
              <SelectItem value="desclassificada">Desclassificadas</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros Avançados
          </Button>
        </div>

        {/* Recomendação do Cenário */}
        {cenario && (
          <Card className="border-primary/20">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h4 className="font-medium text-primary">{cenario.nome}</h4>
                  <p className="text-sm text-muted-foreground">{cenario.recomendacao}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabela de Propostas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Análise Comparativa Detalhada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Rank</th>
                    <th className="text-left p-3">Fornecedor</th>
                    <th className="text-left p-3">Valor Total</th>
                    <th className="text-left p-3">Score</th>
                    <th className="text-left p-3">Prazo</th>
                    <th className="text-left p-3">Garantia</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {propostas.map((proposta) => (
                    <tr key={proposta.id} className="border-b hover:bg-muted/50">
                      <td className="p-3">{getRankBadge(proposta.rank)}</td>
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{proposta.fornecedor}</div>
                          <div className="text-sm text-muted-foreground">{proposta.cnpj}</div>
                        </div>
                      </td>
                      <td className="p-3 font-medium">{formatCurrency(proposta.valorTotal)}</td>
                      <td className="p-3">
                        <span className={`font-medium ${getScoreColor(proposta.score)}`}>
                          {proposta.score.toFixed(1)}
                        </span>
                      </td>
                      <td className="p-3">{proposta.prazoEntrega} dias</td>
                      <td className="p-3">{proposta.garantia} meses</td>
                      <td className="p-3">{getStatusBadge(proposta.status)}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
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
                <p className="text-sm text-muted-foreground">Economia Projetada</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(formData.baseline.economiaProjetada)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Menor Proposta</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(formData.baseline.menorValor)}
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
                <p className="text-sm text-muted-foreground">Melhor Score</p>
                <p className="text-2xl font-bold">8.7</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Propostas Válidas</p>
                <p className="text-2xl font-bold">
                  {formData.propostas.filter(p => p.status === 'classificada').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navegação por Abas */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="detalhada">Tabela Detalhada</TabsTrigger>
          <TabsTrigger value="compacta">Tabela Compacta</TabsTrigger>
          <TabsTrigger value="criterios">Análise por Critérios</TabsTrigger>
          <TabsTrigger value="graficos">Gráficos</TabsTrigger>
        </TabsList>

        <TabsContent value="detalhada">
          <PropostasProximasCombinadas />
        </TabsContent>

        <TabsContent value="compacta">
          <Card>
            <CardHeader>
              <CardTitle>Visão Compacta</CardTitle>
              <CardDescription>Resumo das principais informações</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {formData.propostas.slice(0, 3).map((proposta, index) => (
                  <Card key={proposta.id} className={index === 0 ? 'border-primary' : ''}>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          {getRankBadge(proposta.rank)}
                          {getStatusBadge(proposta.status)}
                        </div>
                        <div>
                          <h4 className="font-medium">{proposta.fornecedor}</h4>
                          <p className="text-sm text-muted-foreground">{proposta.cnpj}</p>
                        </div>
                        <div className="text-2xl font-bold">{formatCurrency(proposta.valorTotal)}</div>
                        <div className="flex justify-between text-sm">
                          <span>Score: <strong className={getScoreColor(proposta.score)}>{proposta.score}</strong></span>
                          <span>Prazo: <strong>{proposta.prazoEntrega}d</strong></span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="criterios">
          <Card>
            <CardHeader>
              <CardTitle>Análise por Critérios</CardTitle>
              <CardDescription>Comparação detalhada dos critérios de avaliação</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {formData.propostas.map((proposta) => (
                  <div key={proposta.id} className="space-y-3">
                    <div className="flex items-center gap-3">
                      {getRankBadge(proposta.rank)}
                      <h4 className="font-medium">{proposta.fornecedor}</h4>
                      <Badge variant="outline">{formatCurrency(proposta.valorTotal)}</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {Object.entries(proposta.criterios).map(([criterio, score]) => (
                        <div key={criterio} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{criterio}</span>
                            <span className="font-medium">{score.toFixed(1)}</span>
                          </div>
                          <Progress value={score * 10} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="graficos">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Scores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  [Gráfico de Radar - Scores por Critério]
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Comparativo de Valores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  [Gráfico de Barras - Valores das Propostas]
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Ações */}
      <div className="flex gap-4">
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Exportar Relatório PDF
        </Button>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar Excel
        </Button>
        <Button variant="outline">
          <Target className="h-4 w-4 mr-2" />
          Simular Cenários
        </Button>
      </div>
    </div>
  );
}
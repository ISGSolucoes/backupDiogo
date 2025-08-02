import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, TrendingUp, Award, AlertTriangle, CheckCircle, Eye } from 'lucide-react';

interface PropostaComparativa {
  id: string;
  fornecedor: string;
  cnpj: string;
  valorTotal: number;
  prazoEntrega: number;
  scoreTotal: number;
  scoreTecnico: number;
  scoreComercial: number;
  rank: number;
  status: 'aprovada' | 'rejeitada' | 'pendente';
  observacoes?: string;
  criterios: Record<string, any>;
}

interface MapaComparativoData {
  propostas: PropostaComparativa[];
  analise: {
    menorPreco: number;
    maiorPreco: number;
    precoMedio: number;
    melhorScore: number;
    recomendacao: string;
  };
  filtros: {
    mostrarApenasValidas: boolean;
    ordenarPor: 'preco' | 'score' | 'prazo';
    direcao: 'asc' | 'desc';
  };
}

interface MapaComparativoProps {
  data: Partial<MapaComparativoData>;
  onComplete: (data: MapaComparativoData) => void;
  wizardData: any;
}

export function MapaComparativo({ data, onComplete, wizardData }: MapaComparativoProps) {
  const [formData, setFormData] = useState<MapaComparativoData>({
    propostas: [
      {
        id: '1',
        fornecedor: 'Fornecedor Alpha Ltda',
        cnpj: '12.345.678/0001-90',
        valorTotal: 85000,
        prazoEntrega: 15,
        scoreTotal: 8.7,
        scoreTecnico: 9.2,
        scoreComercial: 8.4,
        rank: 1,
        status: 'pendente',
        criterios: {
          preco: 8.5,
          qualidade: 9.2,
          prazo: 9.0,
          experiencia: 8.8,
          conformidade: 10.0
        }
      },
      {
        id: '2',
        fornecedor: 'Beta Suprimentos S.A.',
        cnpj: '98.765.432/0001-01',
        valorTotal: 79500,
        prazoEntrega: 20,
        scoreTotal: 8.9,
        scoreTecnico: 8.5,
        scoreComercial: 9.2,
        rank: 2,
        status: 'pendente',
        criterios: {
          preco: 9.5,
          qualidade: 8.0,
          prazo: 8.0,
          experiencia: 8.5,
          conformidade: 9.0
        }
      },
      {
        id: '3',
        fornecedor: 'Gamma Materiais Ltda',
        cnpj: '55.444.333/0001-22',
        valorTotal: 92000,
        prazoEntrega: 10,
        scoreTotal: 7.8,
        scoreTecnico: 8.0,
        scoreComercial: 7.6,
        rank: 3,
        status: 'pendente',
        criterios: {
          preco: 7.0,
          qualidade: 8.5,
          prazo: 10.0,
          experiencia: 7.5,
          conformidade: 8.0
        }
      }
    ],
    analise: {
      menorPreco: 79500,
      maiorPreco: 92000,
      precoMedio: 85500,
      melhorScore: 8.9,
      recomendacao: 'Beta Suprimentos S.A. apresenta a melhor relação custo-benefício'
    },
    filtros: {
      mostrarApenasValidas: false,
      ordenarPor: 'score',
      direcao: 'desc'
    },
    ...data
  });

  const [selectedTab, setSelectedTab] = useState('ranking');

  useEffect(() => {
    // Auto-complete quando há propostas para analisar
    if (formData.propostas.length > 0) {
      onComplete(formData);
    }
  }, [formData]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aprovada':
        return <Badge variant="default" className="bg-green-500">Aprovada</Badge>;
      case 'rejeitada':
        return <Badge variant="destructive">Rejeitada</Badge>;
      case 'pendente':
        return <Badge variant="secondary">Pendente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRankBadge = (rank: number) => {
    const colors = {
      1: 'bg-yellow-500 text-white',
      2: 'bg-gray-400 text-white',
      3: 'bg-amber-600 text-white'
    };
    
    return (
      <Badge className={colors[rank as keyof typeof colors] || 'bg-gray-300'}>
        {rank}º
      </Badge>
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 9) return 'text-green-600';
    if (score >= 8) return 'text-blue-600';
    if (score >= 7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const ordenarPropostas = () => {
    const { ordenarPor, direcao } = formData.filtros;
    
    return [...formData.propostas].sort((a, b) => {
      let valueA, valueB;
      
      switch (ordenarPor) {
        case 'preco':
          valueA = a.valorTotal;
          valueB = b.valorTotal;
          break;
        case 'score':
          valueA = a.scoreTotal;
          valueB = b.scoreTotal;
          break;
        case 'prazo':
          valueA = a.prazoEntrega;
          valueB = b.prazoEntrega;
          break;
        default:
          return 0;
      }
      
      return direcao === 'asc' ? valueA - valueB : valueB - valueA;
    });
  };

  const criterios = wizardData?.matriz?.criterios || [
    { id: 'preco', name: 'Preço', weight: 40 },
    { id: 'qualidade', name: 'Qualidade', weight: 25 },
    { id: 'prazo', name: 'Prazo', weight: 20 },
    { id: 'experiencia', name: 'Experiência', weight: 10 },
    { id: 'conformidade', name: 'Conformidade', weight: 5 }
  ];

  return (
    <div className="space-y-6">
      {/* Resumo Analítico */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(formData.analise.menorPreco)}
            </div>
            <div className="text-sm text-muted-foreground">Menor Preço</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <BarChart className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(formData.analise.precoMedio)}
            </div>
            <div className="text-sm text-muted-foreground">Preço Médio</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Award className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold text-purple-600">
              {formData.analise.melhorScore.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">Melhor Score</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-orange-500" />
            <div className="text-2xl font-bold text-orange-600">
              {formData.propostas.length}
            </div>
            <div className="text-sm text-muted-foreground">Propostas</div>
          </CardContent>
        </Card>
      </div>

      {/* Recomendação IA */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-600 mb-2">Recomendação do Sistema</h3>
              <p className="text-sm text-muted-foreground">
                {formData.analise.recomendacao}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs de Análise */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ranking">Ranking Geral</TabsTrigger>
          <TabsTrigger value="criterios">Análise por Critérios</TabsTrigger>
          <TabsTrigger value="comparativo">Comparativo Detalhado</TabsTrigger>
        </TabsList>

        {/* Ranking Geral */}
        <TabsContent value="ranking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Ranking das Propostas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Prazo (dias)</TableHead>
                    <TableHead>Score Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ordenarPropostas().map((proposta) => (
                    <TableRow key={proposta.id}>
                      <TableCell>{getRankBadge(proposta.rank)}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{proposta.fornecedor}</div>
                          <div className="text-sm text-muted-foreground">{proposta.cnpj}</div>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(proposta.valorTotal)}</TableCell>
                      <TableCell>{proposta.prazoEntrega}</TableCell>
                      <TableCell>
                        <span className={`font-semibold ${getScoreColor(proposta.scoreTotal)}`}>
                          {proposta.scoreTotal.toFixed(1)}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(proposta.status)}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Análise por Critérios */}
        <TabsContent value="criterios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Análise por Critérios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {criterios.map((criterio) => (
                  <div key={criterio.id}>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">{criterio.name}</h4>
                      <Badge variant="outline">Peso: {criterio.weight}%</Badge>
                    </div>
                    <div className="space-y-2">
                      {formData.propostas.map((proposta) => {
                        const score = proposta.criterios[criterio.id] || 0;
                        const percentage = (score / 10) * 100;
                        
                        return (
                          <div key={proposta.id} className="flex items-center gap-3">
                            <div className="w-48 text-sm">{proposta.fornecedor}</div>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <div className="w-12 text-sm font-medium text-right">
                              {score.toFixed(1)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comparativo Detalhado */}
        <TabsContent value="comparativo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Comparativo Técnico vs Comercial
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Score Técnico</TableHead>
                    <TableHead>Score Comercial</TableHead>
                    <TableHead>Score Total</TableHead>
                    <TableHead>Economia vs Média</TableHead>
                    <TableHead>Observações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formData.propostas.map((proposta) => {
                    const economia = formData.analise.precoMedio - proposta.valorTotal;
                    const economiaPercentual = (economia / formData.analise.precoMedio) * 100;
                    
                    return (
                      <TableRow key={proposta.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getRankBadge(proposta.rank)}
                            <span className="font-medium">{proposta.fornecedor}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={getScoreColor(proposta.scoreTecnico)}>
                            {proposta.scoreTecnico.toFixed(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={getScoreColor(proposta.scoreComercial)}>
                            {proposta.scoreComercial.toFixed(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`font-semibold ${getScoreColor(proposta.scoreTotal)}`}>
                            {proposta.scoreTotal.toFixed(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className={economia >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {formatCurrency(Math.abs(economia))}
                            <div className="text-xs">
                              ({economiaPercentual >= 0 ? '+' : ''}{economiaPercentual.toFixed(1)}%)
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {proposta.observacoes || 'Nenhuma observação'}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Próximos Passos */}
      <Card>
        <CardHeader>
          <CardTitle>Próximos Passos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">
              Exportar Análise
            </Button>
            <Button variant="outline">
              Solicitar Esclarecimentos
            </Button>
            <Button variant="outline">
              Agendar Apresentação
            </Button>
            <Button>
              Avançar para Premiação
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
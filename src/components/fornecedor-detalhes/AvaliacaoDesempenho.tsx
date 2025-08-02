import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  AlertTriangle, 
  Calendar,
  Download,
  RotateCcw,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { ExportarPDFPerformanceModal } from './performance/ExportarPDFPerformanceModal';
import { NovaAvaliacaoPerformanceModal } from './performance/NovaAvaliacaoPerformanceModal';
import { PlanoMelhoriaPerformanceModal } from './performance/PlanoMelhoriaPerformanceModal';
import { AgendarReuniaoPerformanceModal } from './performance/AgendarReuniaoPerformanceModal';

interface AvaliacaoDesempenhoProps {
  fornecedorId: string;
  fornecedorNome: string;
}

// Dados mockados para demonstração
const scoreMockData = {
  scoreAtual: 8.3,
  classificacao: "Satisfatório",
  ultimaAvaliacao: "01/07/2025",
  avaliador: "Carlos Souza",
  area: "Compras",
  totalAvaliacoes: 4,
  status: "aprovado" as const
};

const criteriosMockData = [
  {
    criterio: "Entrega no Prazo",
    peso: 30,
    nota: 7.5,
    observacao: "2 atrasos > 3 dias no último trimestre"
  },
  {
    criterio: "Qualidade",
    peso: 30,
    nota: 9.0,
    observacao: "0 devoluções; 1 não-conformidade leve"
  },
  {
    criterio: "Custo",
    peso: 10,
    nota: 6.5,
    observacao: "Aumento de 9% sobre o anterior, fora benchmark"
  },
  {
    criterio: "Relacionamento",
    peso: 20,
    nota: 8.0,
    observacao: "Boa comunicação, respostas ocasionalmente atrasadas"
  },
  {
    criterio: "ESG / Compliance",
    peso: 10,
    nota: 10.0,
    observacao: "Questionário preenchido e atualizado"
  }
];

const historicoMockData = [
  {
    id: "1",
    data: "01/07/2025",
    avaliador: "Carlos Souza",
    score: 8.3,
    status: "aprovado" as const,
    observacoes: "Fornecedor mantém bom desempenho geral"
  },
  {
    id: "2", 
    data: "01/04/2025",
    avaliador: "Ana Lima",
    score: 7.5,
    status: "atencao" as const,
    observacoes: "Alguns atrasos pontuais, mas qualidade mantida"
  },
  {
    id: "3",
    data: "05/01/2025",
    avaliador: "Carla Mendes",
    score: 8.0,
    status: "aprovado" as const,
    observacoes: "Boa recuperação após plano de ação"
  },
  {
    id: "4",
    data: "15/10/2024",
    avaliador: "José Martins",
    score: 6.9,
    status: "critico" as const,
    observacoes: "Problemas críticos de entrega - plano de ação criado"
  }
];

const evolutivoMockData = [
  { periodo: "Jan/2024", score: 7.8 },
  { periodo: "Abr/2024", score: 8.0 },
  { periodo: "Jul/2024", score: 8.3 },
  { periodo: "Out/2024", score: 7.2 },
  { periodo: "Jan/2025", score: 8.4 }
];

export const AvaliacaoDesempenho: React.FC<AvaliacaoDesempenhoProps> = ({
  fornecedorId,
  fornecedorNome
}) => {
  const [avaliacaoSelecionada, setAvaliacaoSelecionada] = useState<string | null>(null);
  const [showExportarPDF, setShowExportarPDF] = useState(false);
  const [showNovaAvaliacao, setShowNovaAvaliacao] = useState(false);
  const [showPlanoMelhoria, setShowPlanoMelhoria] = useState(false);
  const [showAgendarReuniao, setShowAgendarReuniao] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'atencao':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critico':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aprovado':
        return <CheckCircle className="h-4 w-4" />;
      case 'atencao':
        return <AlertCircle className="h-4 w-4" />;
      case 'critico':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleNovaAvaliacao = () => {
    toast.info("Abrindo formulário de nova avaliação...");
  };

  const handleReabrirAvaliacao = (avaliacaoId: string) => {
    setAvaliacaoSelecionada(avaliacaoId);
    toast.info(`Reabrindo avaliação ${avaliacaoId} para edição...`);
  };

  const handleVerDetalhes = (avaliacaoId: string) => {
    setAvaliacaoSelecionada(avaliacaoId);
    toast.info(`Visualizando detalhes da avaliação ${avaliacaoId}...`);
  };

  const handleExportarPDF = () => {
    toast.success("Gerando scorecard em PDF...");
  };

  const calcularScoreTotal = () => {
    const total = criteriosMockData.reduce((acc, criterio) => {
      return acc + (criterio.nota * criterio.peso / 100);
    }, 0);
    return total.toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Painel de Visão Geral */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl">📊 Avaliação de Desempenho</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Análise consolidada de performance do fornecedor
                </p>
              </div>
            </div>
            
            {/* Botões Principais do Header */}
            <div className="flex gap-3">
              <Button 
                onClick={() => setShowExportarPDF(true)}
                className="bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <FileText className="h-4 w-4 mr-2" />
                📤 Exportar PDF
              </Button>
              <Button 
                onClick={() => setShowNovaAvaliacao(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                📝 Nova Avaliação
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Score Atual */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Score Atual</p>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-primary">
                  ⭐ {scoreMockData.scoreAtual}
                </span>
                <span className="text-lg text-muted-foreground">/10</span>
              </div>
              <Badge variant="secondary" className={getStatusColor(scoreMockData.status)}>
                {getStatusIcon(scoreMockData.status)}
                <span className="ml-1">{scoreMockData.classificacao}</span>
              </Badge>
            </div>

            {/* Última Avaliação */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Última Avaliação</p>
              <div className="space-y-1">
                <p className="font-semibold">{scoreMockData.ultimaAvaliacao}</p>
                <p className="text-sm text-muted-foreground">
                  por {scoreMockData.avaliador}
                </p>
                <Badge variant="outline" className="text-xs">
                  {scoreMockData.area}
                </Badge>
              </div>
            </div>

            {/* Histórico */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Histórico</p>
              <div className="space-y-1">
                <p className="font-semibold">{scoreMockData.totalAvaliacoes} avaliações</p>
                <p className="text-sm text-muted-foreground">últimos 12 meses</p>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs">Tendência positiva</span>
                </div>
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Ações</p>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs"
                  onClick={() => setShowPlanoMelhoria(true)}
                >
                  🔄 Plano de Melhoria
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs"
                  onClick={() => setShowAgendarReuniao(true)}
                >
                  📞 Agendar Reunião
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Tabs para Scorecard e Histórico */}
      <Tabs defaultValue="scorecard" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scorecard">🔹 Scorecard Detalhado</TabsTrigger>
          <TabsTrigger value="historico">📆 Histórico das Avaliações</TabsTrigger>
          <TabsTrigger value="evolucao">📉 Evolução Histórica</TabsTrigger>
        </TabsList>

        {/* Scorecard Detalhado */}
        <TabsContent value="scorecard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Dimensões Avaliadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Critério</TableHead>
                    <TableHead className="text-center">Nota (0-10)</TableHead>
                    <TableHead className="text-center">Peso</TableHead>
                    <TableHead className="text-center">Contribuição</TableHead>
                    <TableHead>Observações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {criteriosMockData.map((item, index) => {
                    const contribuicao = (item.nota * item.peso / 100).toFixed(1);
                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.criterio}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span className="font-semibold">{item.nota}</span>
                            <Progress 
                              value={item.nota * 10} 
                              className="w-16 h-2"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{item.peso}%</TableCell>
                        <TableCell className="text-center font-semibold">
                          {contribuicao}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {item.observacao}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Ponderado:</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-primary">
                    {calcularScoreTotal()}/10
                  </span>
                  <Badge variant="secondary" className={getStatusColor(scoreMockData.status)}>
                    Calculado automaticamente
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Histórico das Avaliações */}
        <TabsContent value="historico" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Histórico das Avaliações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Avaliador</TableHead>
                    <TableHead className="text-center">Score</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead>Observações</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historicoMockData.map((avaliacao) => (
                    <TableRow key={avaliacao.id}>
                      <TableCell className="font-medium">{avaliacao.data}</TableCell>
                      <TableCell>{avaliacao.avaliador}</TableCell>
                      <TableCell className="text-center">
                        <span className="font-semibold">{avaliacao.score}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className={getStatusColor(avaliacao.status)}>
                          {getStatusIcon(avaliacao.status)}
                          <span className="ml-1 capitalize">{avaliacao.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-xs">
                        {avaliacao.observacoes}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVerDetalhes(avaliacao.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReabrirAvaliacao(avaliacao.id)}
                            className="h-8 w-8 p-0"
                          >
                            <RotateCcw className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  💡 <strong>Reabertura:</strong> Toda reabertura fica registrada na trilha auditável. 
                  Apenas usuários autorizados podem editar avaliações já finalizadas.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Evolução Histórica */}
        <TabsContent value="evolucao" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Evolução Histórica
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Gráfico Visual Simples */}
                <div className="grid grid-cols-5 gap-4 mb-6">
                  {evolutivoMockData.map((item, index) => (
                    <div key={index} className="text-center space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">
                        {item.periodo}
                      </div>
                      <div className="relative h-20 bg-gray-100 rounded-md flex items-end justify-center">
                        <div 
                          className="bg-primary rounded-t-sm w-8 transition-all duration-300"
                          style={{ height: `${(item.score / 10) * 100}%` }}
                        />
                      </div>
                      <div className="text-lg font-semibold">{item.score}</div>
                    </div>
                  ))}
                </div>

                {/* Insights da IA */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-purple-800">
                        🧠 IA Rê - Insights de Performance
                      </h4>
                      <div className="space-y-1 text-sm text-purple-700">
                        <p>• Fornecedor mantém consistência no score, com tendência de melhoria</p>
                        <p>• Queda pontual em Out/2024 foi rapidamente corrigida com plano de ação</p>
                        <p>• Critério "Entrega no Prazo" precisa de atenção contínua</p>
                        <p>• Recomenda-se manter frequência de avaliação trimestral</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ações Recomendadas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-yellow-800 mb-2">
                        🔄 Solicitar plano de melhoria de custo
                      </h4>
                      <p className="text-sm text-yellow-700">
                        Score de custo abaixo da média. Agendar reunião para revisão.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">
                        📞 Agendar reunião de alinhamento
                      </h4>
                      <p className="text-sm text-blue-700">
                        Discussão trimestral sobre expectativas e melhorias.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-green-800 mb-2">
                        📁 Anexar PDF da avaliação
                      </h4>
                      <p className="text-sm text-green-700">
                        Documentar formalmente a avaliação para compliance.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modais */}
      <ExportarPDFPerformanceModal
        open={showExportarPDF}
        onOpenChange={setShowExportarPDF}
        fornecedorNome={fornecedorNome}
      />

      <NovaAvaliacaoPerformanceModal
        open={showNovaAvaliacao}
        onOpenChange={setShowNovaAvaliacao}
        fornecedorNome={fornecedorNome}
      />

      <PlanoMelhoriaPerformanceModal
        open={showPlanoMelhoria}
        onOpenChange={setShowPlanoMelhoria}
        fornecedorNome={fornecedorNome}
      />

      <AgendarReuniaoPerformanceModal
        open={showAgendarReuniao}
        onOpenChange={setShowAgendarReuniao}
        fornecedorNome={fornecedorNome}
      />
    </div>
  );
};

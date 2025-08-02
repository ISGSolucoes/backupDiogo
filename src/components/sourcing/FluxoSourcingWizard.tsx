import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { ChevronLeft, ChevronRight, CheckCircle, ArrowLeft, FileText, Users, Target, Award, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSourcingRequests } from '@/hooks/useSourcingRequests';
import { useProjetoSourcing } from '@/hooks/useProjetoSourcing';
import { SourcingWizard } from './SourcingWizard';

interface FluxoSourcingWizardProps {
  solicitacaoId?: string;
}

const WIZARD_STAGES = [
  { 
    id: 'aceitar', 
    name: 'Aceitar Solicitação', 
    icon: FileText,
    description: 'Revisar e aceitar a solicitação de sourcing'
  },
  { 
    id: 'projeto', 
    name: 'Criar Projeto', 
    icon: Target,
    description: 'Configurar projeto de sourcing'
  },
  { 
    id: 'execucao', 
    name: 'Execução', 
    icon: Users,
    description: 'Executar evento de sourcing'
  },
  { 
    id: 'finalizacao', 
    name: 'Finalização', 
    icon: Award,
    description: 'Avaliar propostas e premiar'
  },
  { 
    id: 'pedido', 
    name: 'Pedido Gerado', 
    icon: BarChart3,
    description: 'Pedido criado automaticamente'
  }
];

export function FluxoSourcingWizard({ solicitacaoId }: FluxoSourcingWizardProps) {
  const navigate = useNavigate();
  const params = useParams();
  const { toast } = useToast();
  const { solicitacoes, processarSolicitacao } = useSourcingRequests();
  const { criarProjeto, finalizarProjeto } = useProjetoSourcing();
  
  const [currentStage, setCurrentStage] = useState(0);
  const [completedStages, setCompletedStages] = useState<Set<number>>(new Set());
  const [showSourcingWizard, setShowSourcingWizard] = useState(false);
  const [projetoId, setProjetoId] = useState<string | null>(null);
  const [solicitacao, setSolicitacao] = useState<any>(null);

  const currentSolicitacaoId = solicitacaoId || params.solicitacaoId;

  useEffect(() => {
    if (currentSolicitacaoId && solicitacoes.length > 0) {
      const found = solicitacoes.find(s => s.id === currentSolicitacaoId);
      setSolicitacao(found);
    }
  }, [currentSolicitacaoId, solicitacoes]);

  const progress = ((currentStage + 1) / WIZARD_STAGES.length) * 100;
  const currentStageInfo = WIZARD_STAGES[currentStage];

  const handleBack = () => {
    navigate('/sourcing');
  };

  const handleStageComplete = () => {
    setCompletedStages(prev => new Set([...prev, currentStage]));
    if (currentStage < WIZARD_STAGES.length - 1) {
      setCurrentStage(currentStage + 1);
    }
  };

  const handleAceitarSolicitacao = async () => {
    if (!solicitacao) return;
    
    try {
      await processarSolicitacao(solicitacao.id, 'aceitar');
      toast({
        title: "✅ Solicitação Aceita",
        description: "Projeto de sourcing será criado automaticamente",
      });
      handleStageComplete();
      setShowSourcingWizard(true);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao aceitar solicitação",
        variant: "destructive"
      });
    }
  };

  const handleProjetoComplete = (projetoData: any) => {
    setProjetoId(projetoData.id);
    handleStageComplete();
    toast({
      title: "🎯 Projeto Criado",
      description: `Projeto ${projetoData.codigo_projeto} criado com sucesso`,
    });
  };

  const handleFinalizarProjeto = async () => {
    if (!projetoId) return;
    
    try {
      await finalizarProjeto(projetoId, 'fornecedor-vencedor-1', { valor: 10000 });
      toast({
        title: "🏆 Projeto Finalizado",
        description: "Pedido será criado automaticamente",
      });
      handleStageComplete();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao finalizar projeto",
        variant: "destructive"
      });
    }
  };

  if (showSourcingWizard) {
    return (
      <SourcingWizard 
        onComplete={handleProjetoComplete}
        onCancel={() => setShowSourcingWizard(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Breadcrumb */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Fluxo de Sourcing
                </h1>
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/sourcing">Sourcing</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Fluxo Completo</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </div>
          </div>

          {/* Progress Stages */}
          <div className="space-y-4">
            <Progress value={progress} className="h-3" />
            <div className="flex justify-between items-center">
              {WIZARD_STAGES.map((stage, index) => {
                const Icon = stage.icon;
                const isActive = index === currentStage;
                const isCompleted = completedStages.has(index);
                const isAccessible = index <= currentStage;

                return (
                  <div 
                    key={stage.id}
                    className={`flex flex-col items-center gap-2 cursor-pointer transition-all ${
                      isAccessible ? 'hover:opacity-80' : 'opacity-50'
                    }`}
                    onClick={() => isAccessible && setCurrentStage(index)}
                  >
                    <div className={`p-3 rounded-full border-2 transition-all ${
                      isCompleted 
                        ? 'bg-success border-success text-success-foreground' 
                        : isActive 
                          ? 'bg-primary border-primary text-primary-foreground' 
                          : 'bg-background border-border'
                    }`}>
                      {isCompleted ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </div>
                    <div className="text-center">
                      <div className={`text-sm font-medium ${
                        isActive ? 'text-primary' : isCompleted ? 'text-success' : 'text-muted-foreground'
                      }`}>
                        {stage.name}
                      </div>
                      <div className="text-xs text-muted-foreground hidden md:block">
                        {stage.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Stage Content */}
      <div className="container mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Badge variant="outline">{currentStage + 1}</Badge>
              <currentStageInfo.icon className="h-6 w-6" />
              {currentStageInfo.name}
              {completedStages.has(currentStage) && (
                <CheckCircle className="h-5 w-5 text-success" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentStage === 0 && (
              <div className="space-y-6">
                <div className="bg-accent/50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Revisar Solicitação de Sourcing</h3>
                  {solicitacao && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Valor Estimado</p>
                        <p className="font-semibold">R$ {solicitacao.valor_estimado?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Categoria</p>
                        <p className="font-semibold">{solicitacao.categoria}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-muted-foreground">Observações</p>
                        <p>{solicitacao.observacoes}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleAceitarSolicitacao} className="gap-2">
                    Aceitar e Criar Projeto
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {currentStage === 1 && (
              <div className="space-y-6">
                <div className="bg-accent/50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Projeto em Configuração</h3>
                  <p className="text-muted-foreground">
                    O assistente de criação de projeto foi iniciado. Complete todas as etapas para configurar 
                    seu projeto de sourcing com base na solicitação recebida.
                  </p>
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => setShowSourcingWizard(true)} className="gap-2">
                    Continuar Configuração
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {currentStage === 2 && (
              <div className="space-y-6">
                <div className="bg-accent/50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Executar Evento de Sourcing</h3>
                  <p className="text-muted-foreground mb-4">
                    Projeto criado com sucesso. Agora execute o evento de sourcing (RFP, RFQ ou Leilão).
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-success rounded-full"></div>
                      <span className="text-sm">Fornecedores convidados</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-success rounded-full"></div>
                      <span className="text-sm">Documentos enviados</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-warning rounded-full"></div>
                      <span className="text-sm">Aguardando propostas</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleStageComplete} className="gap-2">
                    Prosseguir para Avaliação
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {currentStage === 3 && (
              <div className="space-y-6">
                <div className="bg-accent/50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Finalizar e Premiar</h3>
                  <p className="text-muted-foreground mb-4">
                    Avalie as propostas recebidas e selecione o fornecedor vencedor.
                  </p>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg bg-card">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Fornecedor Alpha</span>
                        <Badge variant="default">Melhor Proposta</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">R$ 10.500,00 - Entrega em 15 dias</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Fornecedor Beta</span>
                        <Badge variant="outline">Segunda Opção</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">R$ 11.200,00 - Entrega em 10 dias</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleFinalizarProjeto} className="gap-2">
                    Finalizar e Gerar Pedido
                    <Award className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {currentStage === 4 && (
              <div className="space-y-6">
                <div className="bg-success/10 border border-success/20 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="h-6 w-6 text-success" />
                    <h3 className="text-lg font-semibold text-success">Fluxo Concluído!</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    O pedido foi gerado automaticamente e enviado ao fornecedor vencedor.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Pedido:</span>
                      <span className="font-mono">PO-2025-000123</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fornecedor:</span>
                      <span>Fornecedor Alpha</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Valor:</span>
                      <span>R$ 10.500,00</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => navigate('/pedidos')} className="gap-2">
                    Ver Pedido
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => navigate('/sourcing')} className="gap-2">
                    Voltar ao Sourcing
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
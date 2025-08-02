import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { EstruturaProjeto } from './stages/EstruturaProjeto';
import { EscopoEstrategico } from './stages/EscopoEstrategico';
import { ItensCondicoes } from './stages/ItensCondicoes';

import { GerenciamentoFornecedores } from './stages/GerenciamentoFornecedores';
import { PublicacaoEvento } from './stages/PublicacaoEvento';
import { MonitoramentoTempo } from './stages/MonitoramentoTempo';
import { MapaComparativoAvancado } from './stages/MapaComparativoAvancado';
import { PremiacaoAvancada } from './stages/PremiacaoAvancada';
import { Indicadores } from './stages/Indicadores';

export interface SourcingWizardData {
  estrutura: any;
  escopo: any;
  itens: any[];
  criterios: any[];
  fornecedores: any[];
  publicacao: any;
  monitoramento: any;
  comparativo: any;
  premiacao: any;
  indicadores: any;
}

const STAGES = [
  { id: 'estrutura', name: 'Estrutura do Projeto', component: EstruturaProjeto },
  { id: 'escopo', name: 'Escopo Estratégico', component: EscopoEstrategico },
  { id: 'itens', name: 'Itens e Condições', component: ItensCondicoes },
  { id: 'matriz', name: 'Matriz de Avaliação', component: React.lazy(() => import('./stages/MatrizAvaliacao').then(m => ({ default: m.MatrizAvaliacao }))) },
  { id: 'fornecedores', name: 'Gerenciamento de Fornecedores', component: GerenciamentoFornecedores },
  { id: 'publicacao', name: 'Publicação do Evento', component: PublicacaoEvento },
  { id: 'monitoramento', name: 'Monitoramento em Tempo Real', component: MonitoramentoTempo },
  { id: 'comparativo', name: 'Mapa Comparativo Avançado', component: MapaComparativoAvancado },
  { id: 'premiacao', name: 'Premiação Avançada', component: PremiacaoAvancada },
  { id: 'indicadores', name: 'Indicadores e Relatórios', component: Indicadores }
];

interface SourcingWizardProps {
  projectId?: string;
  onComplete?: (data: SourcingWizardData) => void;
  onCancel?: () => void;
}

export function SourcingWizard({ projectId, onComplete, onCancel }: SourcingWizardProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [completedStages, setCompletedStages] = useState<Set<number>>(new Set());
  const [wizardData, setWizardData] = useState<SourcingWizardData>({
    estrutura: {},
    escopo: {},
    itens: [],
    criterios: [],
    fornecedores: [],
    publicacao: {},
    monitoramento: {},
    comparativo: {},
    premiacao: {},
    indicadores: {}
  });

  const currentStageInfo = STAGES[currentStage];
  const CurrentStageComponent = currentStageInfo.component;
  const progress = ((currentStage + 1) / STAGES.length) * 100;

  const handleStageComplete = (stageData: any) => {
    const updatedData = {
      ...wizardData,
      [currentStageInfo.id]: stageData
    };
    setWizardData(updatedData);
    setCompletedStages(prev => new Set([...prev, currentStage]));
  };

  const handleNext = () => {
    if (currentStage < STAGES.length - 1) {
      setCurrentStage(currentStage + 1);
    } else {
      onComplete?.(wizardData);
    }
  };

  const handlePrevious = () => {
    if (currentStage > 0) {
      setCurrentStage(currentStage - 1);
    }
  };

  const canProceed = true; // Permitir navegação livre para teste
  const isLastStage = currentStage === STAGES.length - 1;

  return (
    <div className="min-h-screen bg-background">
      {/* Header com Progress */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {currentStage === 0 ? 'Configurar Projeto de Sourcing' : 'Novo Projeto de Sourcing'}
              </h1>
              <p className="text-muted-foreground">
                Etapa {currentStage + 1} de {STAGES.length}: {currentStageInfo.name}
              </p>
            </div>
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              {STAGES.map((stage, index) => (
                <div 
                  key={stage.id} 
                  className={`flex items-center gap-1 cursor-pointer hover:text-primary transition-colors ${
                    index === currentStage ? 'text-primary font-medium' : ''
                  } ${
                    completedStages.has(index) ? 'text-success' : ''
                  }`}
                  onClick={() => setCurrentStage(index)}
                >
                  {completedStages.has(index) && (
                    <CheckCircle className="h-3 w-3" />
                  )}
                  <span className="hidden md:inline">{stage.name}</span>
                  <span className="md:hidden">{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stage Content */}
      <div className="container mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="outline">{currentStage + 1}</Badge>
              {currentStageInfo.name}
              {completedStages.has(currentStage) && (
                <CheckCircle className="h-5 w-5 text-success" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <React.Suspense fallback={<div className="flex items-center justify-center p-8">Carregando...</div>}>
              <CurrentStageComponent
                data={wizardData[currentStageInfo.id as keyof SourcingWizardData]}
                onComplete={handleStageComplete}
                wizardData={wizardData}
              />
            </React.Suspense>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStage === 0}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </Button>

          <div className="text-sm text-muted-foreground">
            {completedStages.size} de {STAGES.length} etapas concluídas
          </div>

          <Button
            onClick={handleNext}
            disabled={!canProceed}
            className="gap-2"
          >
            {isLastStage ? 'Finalizar Projeto' : 'Próxima Etapa'}
            {!isLastStage && <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
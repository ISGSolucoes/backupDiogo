
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import {
  CardDeStatus,
} from '@/components';

import { MinhasTarefasPendentes } from '@/components/dashboard/MinhasTarefasPendentes';
import { SugestoesInteligentes } from '@/components/dashboard/SugestoesInteligentes';
import { ProximosCompromissos } from '@/components/dashboard/ProximosCompromissos';
import { FeedDeAtividades } from '@/components/dashboard/FeedDeAtividades';
import { DeadlinesEAlertas } from '@/components/dashboard/DeadlinesEAlertas';
import { AcoesRapidas } from '@/components/dashboard/AcoesRapidas';

import { DashboardConfigModal } from '@/components/dashboard/DashboardConfigModal';
import { DraggableBlock } from '@/components/dashboard/DraggableBlock';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';

const Inicio = () => {
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const { 
    columns, 
    isEditing, 
    setIsEditing, 
    getBlocksByColumn, 
    toggleBlockVisibility 
  } = useDashboardLayout();

  // Mapeamento de componentes
  const componentMap = {
    'MinhasTarefasPendentes': MinhasTarefasPendentes,
    'SugestoesInteligentes': SugestoesInteligentes,
    'ProximosCompromissos': ProximosCompromissos,
    'DeadlinesEAlertas': DeadlinesEAlertas,
    'AcoesRapidas': AcoesRapidas,
    'FeedDeAtividades': FeedDeAtividades,
  };

  const renderBlock = (block: any) => {
    const Component = componentMap[block.component as keyof typeof componentMap];
    if (!Component) return null;

    return (
      <DraggableBlock
        key={block.id}
        id={block.id}
        title={block.title}
        isEditing={isEditing}
        onRemove={() => toggleBlockVisibility(block.id)}
      >
        <Component />
      </DraggableBlock>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold mb-1">Bom dia, Re Cardozo! 😊</h2>
          <p className="text-slate-600">Você tem <b>4 tarefas urgentes</b> e <b>3 compromissos hoje</b>.</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setConfigModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Personalizar Dashboard
          </Button>
          
          {isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              Concluir Edição
            </Button>
          )}
        </div>
      </div>

      {/* Indicadores Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <CardDeStatus titulo="Tarefas Pendentes" valor="7" tipo="warning" />
        <CardDeStatus titulo="Alertas Críticos" valor="3" tipo="default" />
      </div>
      
      {/* Dashboard Personalizado */}
      <div className={`grid gap-6 ${
        columns === 2 ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 lg:grid-cols-3'
      }`}>
        {Array.from({ length: columns }, (_, index) => (
          <div key={index} className="space-y-6">
            {getBlocksByColumn(index + 1).map(renderBlock)}
          </div>
        ))}
      </div>

      {/* Modal de Configuração */}
      <DashboardConfigModal 
        open={configModalOpen}
        onOpenChange={setConfigModalOpen}
      />
    </div>
  );
};

export default Inicio;

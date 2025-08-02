
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import { FeedPreferences } from '@/hooks/useFeedPreferences';

interface FeedOrdenacaoTabProps {
  preferences: FeedPreferences;
  onPreferenceChange: (preferences: Partial<FeedPreferences>) => void;
}

const tiposInfo = {
  economia: { nome: 'Economia', emoji: '💰', cor: 'bg-green-100 text-green-800' },
  alerta: { nome: 'Alerta', emoji: '⚠️', cor: 'bg-red-100 text-red-800' },
  sucesso: { nome: 'Sucesso', emoji: '✅', cor: 'bg-blue-100 text-blue-800' },
  acao: { nome: 'Ação', emoji: '📋', cor: 'bg-purple-100 text-purple-800' },
  contato: { nome: 'Contato', emoji: '👥', cor: 'bg-yellow-100 text-yellow-800' },
  atualizacao: { nome: 'Atualização', emoji: '📦', cor: 'bg-gray-100 text-gray-800' }
};

const criterios = [
  { id: 'tempo', nome: 'Tempo', descricao: 'Mais recentes primeiro' },
  { id: 'relevancia', nome: 'Relevância', descricao: 'Mais importantes primeiro' },
  { id: 'tipo', nome: 'Tipo', descricao: 'Baseado na ordem personalizada' }
];

export const FeedOrdenacaoTab = ({ preferences, onPreferenceChange }: FeedOrdenacaoTabProps) => {
  const handleCriterioChange = (criterio: 'tempo' | 'relevancia' | 'tipo') => {
    onPreferenceChange({
      ordenacao: {
        ...preferences.ordenacao,
        criterio
      }
    });
  };

  const handleDirecaoChange = (direcao: 'asc' | 'desc') => {
    onPreferenceChange({
      ordenacao: {
        ...preferences.ordenacao,
        direcao
      }
    });
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(preferences.ordenacao.tiposOrdem);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onPreferenceChange({
      ordenacao: {
        ...preferences.ordenacao,
        tiposOrdem: items
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Critério de Ordenação */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Critério de Ordenação</Label>
        <div className="grid gap-3">
          {criterios.map((criterio) => (
            <div
              key={criterio.id}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                preferences.ordenacao.criterio === criterio.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => handleCriterioChange(criterio.id as any)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">{criterio.nome}</div>
                  <div className="text-xs text-slate-500">{criterio.descricao}</div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${
                  preferences.ordenacao.criterio === criterio.id
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {preferences.ordenacao.criterio === criterio.id && (
                    <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Direção */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Direção</Label>
        <div className="flex gap-2">
          <Button
            variant={preferences.ordenacao.direcao === 'desc' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleDirecaoChange('desc')}
            className="flex items-center gap-2"
          >
            <ArrowDown className="h-4 w-4" />
            Decrescente
          </Button>
          <Button
            variant={preferences.ordenacao.direcao === 'asc' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleDirecaoChange('asc')}
            className="flex items-center gap-2"
          >
            <ArrowUp className="h-4 w-4" />
            Crescente
          </Button>
        </div>
      </div>

      {/* Ordem Personalizada por Tipo */}
      {preferences.ordenacao.criterio === 'tipo' && (
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Ordem de Prioridade dos Tipos
          </Label>
          <p className="text-xs text-slate-500 mb-3">
            Arraste para reordenar. Itens do topo aparecerão primeiro.
          </p>
          
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="tipos-ordem">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {preferences.ordenacao.tiposOrdem.map((tipo, index) => {
                    const info = tiposInfo[tipo as keyof typeof tiposInfo];
                    return (
                      <Draggable key={tipo} draggableId={tipo} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`flex items-center gap-3 p-3 border rounded-lg bg-white ${
                              snapshot.isDragging ? 'shadow-lg' : ''
                            }`}
                          >
                            <div
                              {...provided.dragHandleProps}
                              className="cursor-grab active:cursor-grabbing"
                            >
                              <GripVertical className="h-4 w-4 text-slate-400" />
                            </div>
                            <div className="flex items-center gap-2 flex-1">
                              <span className="text-lg">{info.emoji}</span>
                              <Badge className={info.cor}>{info.nome}</Badge>
                            </div>
                            <div className="text-xs text-slate-500">
                              Prioridade {index + 1}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}
    </div>
  );
};

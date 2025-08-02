
import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  Settings, 
  GripVertical, 
  Eye, 
  EyeOff, 
  RotateCcw,
  Save,
  X
} from 'lucide-react';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';

interface DashboardConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DashboardConfigModal = ({ open, onOpenChange }: DashboardConfigModalProps) => {
  const {
    blocks,
    columns,
    setColumns,
    saveLayout,
    resetLayout,
    moveBlock,
    toggleBlockVisibility,
    getBlocksByColumn,
    getHiddenBlocks
  } = useDashboardLayout();

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    // Se movendo dentro da mesma coluna
    if (source.droppableId === destination.droppableId) {
      const column = parseInt(source.droppableId.replace('column-', ''));
      moveBlock(draggableId, column, destination.index);
    } else {
      // Movendo entre colunas
      const newColumn = parseInt(destination.droppableId.replace('column-', ''));
      moveBlock(draggableId, newColumn, destination.index);
    }
  };

  const handleSave = () => {
    saveLayout();
    onOpenChange(false);
  };

  const handleReset = () => {
    resetLayout();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Personalizar Dashboard
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Configurações de Layout */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Layout</h3>
            <RadioGroup 
              value={columns.toString()} 
              onValueChange={(value) => setColumns(parseInt(value))}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id="2-cols" />
                <Label htmlFor="2-cols">2 Colunas</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3" id="3-cols" />
                <Label htmlFor="3-cols">3 Colunas</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Blocos Visíveis */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Organizar Blocos</h3>
            <p className="text-sm text-slate-600">
              Arraste os blocos para reorganizar ou use os interruptores para mostrar/ocultar
            </p>
            
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className={`grid gap-4 ${columns === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                {Array.from({ length: columns }, (_, index) => (
                  <Card key={index} className="min-h-[200px]">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Coluna {index + 1}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Droppable droppableId={`column-${index + 1}`}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`space-y-2 min-h-[100px] p-2 rounded-lg border-2 border-dashed transition-colors ${
                              snapshot.isDraggingOver 
                                ? 'border-blue-400 bg-blue-50' 
                                : 'border-slate-200'
                            }`}
                          >
                            {getBlocksByColumn(index + 1).map((block, blockIndex) => (
                              <Draggable
                                key={block.id}
                                draggableId={block.id}
                                index={blockIndex}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={`p-3 bg-white border border-slate-200 rounded-lg shadow-sm ${
                                      snapshot.isDragging ? 'shadow-lg' : ''
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <div
                                          {...provided.dragHandleProps}
                                          className="cursor-grab active:cursor-grabbing"
                                        >
                                          <GripVertical className="h-4 w-4 text-slate-400" />
                                        </div>
                                        <span className="text-sm font-medium">
                                          {block.title}
                                        </span>
                                      </div>
                                      <Switch
                                        checked={block.visible}
                                        onCheckedChange={() => toggleBlockVisibility(block.id)}
                                      />
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DragDropContext>
          </div>

          {/* Blocos Ocultos */}
          {getHiddenBlocks().length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Blocos Ocultos</h3>
                <div className="grid grid-cols-2 gap-2">
                  {getHiddenBlocks().map((block) => (
                    <div
                      key={block.id}
                      className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <EyeOff className="h-4 w-4 text-slate-400" />
                        <span className="text-sm">{block.title}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleBlockVisibility(block.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Ações */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Restaurar Padrão
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Salvar Layout
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

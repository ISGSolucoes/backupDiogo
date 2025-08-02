
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConfiguracaoColuna, PresetColunas } from '@/types/fornecedor';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical, Search, Eye, EyeOff, RotateCcw, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface PersonalizarColunasModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  colunas: ConfiguracaoColuna[];
  onSalvarConfiguracao: (colunas: ConfiguracaoColuna[]) => void;
}

const COLUNAS_DISPONIVEIS: Omit<ConfiguracaoColuna, 'visible' | 'order'>[] = [
  { key: 'nome', label: 'Razão Social', required: true },
  { key: 'cnpj', label: 'CNPJ', required: true },
  { key: 'cnpjRaiz', label: 'Raiz CNPJ' },
  { key: 'quantidadeFiliais', label: 'Qtd Filiais' },
  { key: 'dataCadastro', label: 'Data Cadastro' },
  { key: 'ultimaParticipacao', label: 'Última Participação' },
  { key: 'status', label: 'Status' },
  { key: 'tipoFornecedor', label: 'Tipo' },
  { key: 'classificacao', label: 'Classificação' },
  { key: 'categoria', label: 'Categoria' },
  { key: 'financeiro', label: 'Financeiro' },
  { key: 'segmento', label: 'Segmento' },
  { key: 'descricao', label: 'Descrição' },
  { key: 'porte', label: 'Porte' },
  { key: 'avaliacao', label: 'Avaliação' },
  { key: 'score', label: 'Score' },
  { key: 'transacional', label: 'Transacional' },
  { key: 'criticidade', label: 'Criticidade' },
  { key: 'cidade', label: 'Cidade' },
  { key: 'uf', label: 'UF' },
  { key: 'qualificado', label: 'Qualificado' },
  { key: 'preferido', label: 'Preferido' },
  // Novos campos de contato
  { key: 'email', label: 'E-mail', requiresApprovalForExport: true },
  { key: 'telefone', label: 'Telefone', requiresApprovalForExport: true },
  { key: 'endereco', label: 'Endereço', requiresApprovalForExport: true },
  { key: 'pais', label: 'País' },
  { key: 'estado', label: 'Estado' },
  { key: 'acoes', label: 'Ações', required: true }
];

const PRESETS_PADRAO: PresetColunas[] = [
  {
    id: 'basico',
    nome: 'Visualização Básica',
    descricao: 'Campos essenciais para visualização rápida',
    colunas: [
      { key: 'nome', label: 'Razão Social', visible: true, order: 0, required: true },
      { key: 'cnpj', label: 'CNPJ', visible: true, order: 1, required: true },
      { key: 'status', label: 'Status', visible: true, order: 2 },
      { key: 'categoria', label: 'Categoria', visible: true, order: 3 },
      { key: 'ultimaParticipacao', label: 'Última Participação', visible: true, order: 4 },
      { key: 'acoes', label: 'Ações', visible: true, order: 5, required: true }
    ]
  },
  {
    id: 'completo',
    nome: 'Visualização Completa',
    descricao: 'Todos os campos disponíveis',
    colunas: COLUNAS_DISPONIVEIS.map((col, index) => ({
      ...col,
      visible: true,
      order: index
    }))
  },
  {
    id: 'gerencial',
    nome: 'Visualização Gerencial',
    descricao: 'Campos importantes para gestores',
    colunas: [
      { key: 'nome', label: 'Razão Social', visible: true, order: 0, required: true },
      { key: 'cnpj', label: 'CNPJ', visible: true, order: 1, required: true },
      { key: 'quantidadeFiliais', label: 'Qtd Filiais', visible: true, order: 2 },
      { key: 'classificacao', label: 'Classificação', visible: true, order: 3 },
      { key: 'financeiro', label: 'Financeiro', visible: true, order: 4 },
      { key: 'score', label: 'Score', visible: true, order: 5 },
      { key: 'criticidade', label: 'Criticidade', visible: true, order: 6 },
      { key: 'transacional', label: 'Transacional', visible: true, order: 7 },
      { key: 'acoes', label: 'Ações', visible: true, order: 8, required: true }
    ]
  },
  {
    id: 'contato',
    nome: 'Dados de Contato',
    descricao: 'Informações de contato e localização',
    colunas: [
      { key: 'nome', label: 'Razão Social', visible: true, order: 0, required: true },
      { key: 'cnpj', label: 'CNPJ', visible: true, order: 1, required: true },
      { key: 'email', label: 'E-mail', visible: true, order: 2, requiresApprovalForExport: true },
      { key: 'telefone', label: 'Telefone', visible: true, order: 3, requiresApprovalForExport: true },
      { key: 'endereco', label: 'Endereço', visible: true, order: 4, requiresApprovalForExport: true },
      { key: 'cidade', label: 'Cidade', visible: true, order: 5 },
      { key: 'estado', label: 'Estado', visible: true, order: 6 },
      { key: 'pais', label: 'País', visible: true, order: 7 },
      { key: 'acoes', label: 'Ações', visible: true, order: 8, required: true }
    ]
  }
];

export const PersonalizarColunasModal = ({
  open,
  onOpenChange,
  colunas,
  onSalvarConfiguracao
}: PersonalizarColunasModalProps) => {
  const [colunasConfig, setColunasConfig] = useState<ConfiguracaoColuna[]>(colunas);
  const [busca, setBusca] = useState('');
  const [presetSelecionado, setPresetSelecionado] = useState<string>('');

  useEffect(() => {
    setColunasConfig(colunas);
  }, [colunas]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(colunasConfig);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Atualizar ordem
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));

    setColunasConfig(updatedItems);
  };

  const toggleColuna = (key: ConfiguracaoColuna['key']) => {
    setColunasConfig(prev => 
      prev.map(col => 
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const aplicarPreset = (presetId: string) => {
    const preset = PRESETS_PADRAO.find(p => p.id === presetId);
    if (preset) {
      setColunasConfig(preset.colunas);
      setPresetSelecionado(presetId);
      toast.success(`Preset "${preset.nome}" aplicado`);
    }
  };

  const resetarPadrao = () => {
    const configPadrao = COLUNAS_DISPONIVEIS.map((col, index) => ({
      ...col,
      visible: col.required || ['nome', 'cnpj', 'status', 'categoria'].includes(col.key as string),
      order: index
    }));
    setColunasConfig(configPadrao);
    setPresetSelecionado('');
    toast.success('Configuração resetada para o padrão');
  };

  const salvarConfiguracao = () => {
    onSalvarConfiguracao(colunasConfig);
    onOpenChange(false);
    toast.success('Configuração de colunas salva com sucesso');
  };

  const colunasFiltradas = colunasConfig.filter(col => 
    col.label.toLowerCase().includes(busca.toLowerCase()) ||
    col.key.toString().toLowerCase().includes(busca.toLowerCase())
  );

  const colunasVisiveis = colunasConfig.filter(col => col.visible).length;
  const totalColunas = colunasConfig.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Personalizar Colunas da Tabela
          </DialogTitle>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span>
              {colunasVisiveis} de {totalColunas} colunas visíveis
            </span>
            <Badge variant="outline">
              {Math.round((colunasVisiveis / totalColunas) * 100)}% da tabela
            </Badge>
          </div>
        </DialogHeader>

        <Tabs defaultValue="configurar" className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-2 flex-shrink-0">
            <TabsTrigger value="configurar">Configurar Colunas</TabsTrigger>
            <TabsTrigger value="presets">Presets Rápidos</TabsTrigger>
          </TabsList>

          <TabsContent value="configurar" className="flex-1 flex flex-col space-y-4 min-h-0">
            {/* Busca */}
            <div className="relative flex-shrink-0">
              <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
              <Input
                placeholder="Buscar colunas..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Lista de Colunas - Área com scroll */}
            <div className="flex-1 overflow-y-auto border rounded-md p-4 space-y-2 min-h-0">
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="colunas">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {colunasFiltradas
                        .sort((a, b) => a.order - b.order)
                        .map((coluna, index) => (
                          <Draggable
                            key={coluna.key}
                            draggableId={coluna.key.toString()}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`flex items-center gap-3 p-3 border rounded-md bg-white transition-all ${
                                  snapshot.isDragging ? 'shadow-lg' : ''
                                } ${coluna.visible ? 'border-blue-200 bg-blue-50' : 'border-slate-200'}`}
                              >
                                <div
                                  {...provided.dragHandleProps}
                                  className="text-slate-400 hover:text-slate-600"
                                >
                                  <GripVertical className="h-4 w-4" />
                                </div>
                                
                                <Checkbox
                                  checked={coluna.visible}
                                  onCheckedChange={() => toggleColuna(coluna.key)}
                                  disabled={coluna.required}
                                />
                                
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 font-medium text-slate-900">
                                    {coluna.label}
                                    {coluna.requiresApprovalForExport && (
                                      <Shield className="h-4 w-4 text-amber-600" />
                                    )}
                                  </div>
                                  <div className="text-sm text-slate-500 flex items-center gap-2">
                                    Campo: {coluna.key}
                                    {coluna.required && (
                                      <Badge variant="outline" className="text-xs">
                                        Obrigatório
                                      </Badge>
                                    )}
                                    {coluna.requiresApprovalForExport && (
                                      <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                                        Requer Aprovação
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                
                                {coluna.visible ? (
                                  <Eye className="h-4 w-4 text-blue-600" />
                                ) : (
                                  <EyeOff className="h-4 w-4 text-slate-400" />
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </TabsContent>

          <TabsContent value="presets" className="flex-1 overflow-y-auto space-y-4">
            <div className="text-sm text-slate-600 mb-4">
              Aplique configurações pré-definidas para diferentes cenários de uso.
            </div>
            
            <div className="space-y-3">
              {PRESETS_PADRAO.map((preset) => (
                <div
                  key={preset.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                    presetSelecionado === preset.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200'
                  }`}
                  onClick={() => aplicarPreset(preset.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-900">{preset.nome}</h4>
                      <p className="text-sm text-slate-600 mt-1">{preset.descricao}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {preset.colunas.filter(c => c.visible).length} colunas
                      </Badge>
                      {preset.colunas.some(c => c.requiresApprovalForExport && c.visible) && (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          <Shield className="h-3 w-3 mr-1" />
                          Requer Aprovação
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex-shrink-0 flex items-center justify-between">
          <Button variant="outline" onClick={resetarPadrao}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Resetar Padrão
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={salvarConfiguracao}>
              Salvar Configuração
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

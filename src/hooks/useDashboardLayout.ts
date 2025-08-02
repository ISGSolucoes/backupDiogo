
import { useState, useEffect } from 'react';

export interface DashboardBlock {
  id: string;
  component: string;
  title: string;
  column: number;
  position: number;
  visible: boolean;
  minHeight?: number;
}

const DEFAULT_BLOCKS: DashboardBlock[] = [
  { id: 'tarefas-pendentes', component: 'MinhasTarefasPendentes', title: 'Minhas Tarefas Pendentes', column: 1, position: 0, visible: true },
  { id: 'sugestoes-inteligentes', component: 'SugestoesInteligentes', title: 'Sugestões Inteligentes', column: 1, position: 1, visible: true },
  { id: 'proximos-compromissos', component: 'ProximosCompromissos', title: 'Próximos Compromissos', column: 2, position: 0, visible: true },
  { id: 'deadlines-alertas', component: 'DeadlinesEAlertas', title: 'Deadlines & Alertas', column: 2, position: 1, visible: true },
  { id: 'acoes-rapidas', component: 'AcoesRapidas', title: 'Ações Rápidas', column: 3, position: 0, visible: true },
  { id: 'feed-atividades', component: 'FeedDeAtividades', title: 'Feed de Atividades', column: 3, position: 1, visible: true },
];

export const useDashboardLayout = () => {
  const [blocks, setBlocks] = useState<DashboardBlock[]>(DEFAULT_BLOCKS);
  const [isEditing, setIsEditing] = useState(false);
  const [columns, setColumns] = useState(3);

  // Carregar layout salvo
  useEffect(() => {
    const saved = localStorage.getItem('dashboard-layout');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setBlocks(parsed.blocks || DEFAULT_BLOCKS);
        setColumns(parsed.columns || 3);
      } catch (error) {
        console.error('Erro ao carregar layout:', error);
      }
    }
  }, []);

  // Salvar layout
  const saveLayout = () => {
    const layout = { blocks, columns };
    localStorage.setItem('dashboard-layout', JSON.stringify(layout));
    setIsEditing(false);
  };

  // Resetar para layout padrão
  const resetLayout = () => {
    setBlocks(DEFAULT_BLOCKS);
    setColumns(3);
    localStorage.removeItem('dashboard-layout');
  };

  // Mover bloco
  const moveBlock = (blockId: string, newColumn: number, newPosition: number) => {
    setBlocks(prev => {
      const updated = prev.map(block => {
        if (block.id === blockId) {
          return { ...block, column: newColumn, position: newPosition };
        }
        return block;
      });
      
      // Reorganizar posições na coluna de destino
      const columnBlocks = updated.filter(b => b.column === newColumn && b.visible);
      columnBlocks.sort((a, b) => a.position - b.position);
      
      return updated.map(block => {
        if (block.column === newColumn && block.visible) {
          const index = columnBlocks.findIndex(b => b.id === block.id);
          return { ...block, position: index };
        }
        return block;
      });
    });
  };

  // Alternar visibilidade
  const toggleBlockVisibility = (blockId: string) => {
    setBlocks(prev => prev.map(block => 
      block.id === blockId 
        ? { ...block, visible: !block.visible }
        : block
    ));
  };

  // Obter blocos por coluna
  const getBlocksByColumn = (column: number) => {
    return blocks
      .filter(block => block.column === column && block.visible)
      .sort((a, b) => a.position - b.position);
  };

  // Obter blocos ocultos
  const getHiddenBlocks = () => {
    return blocks.filter(block => !block.visible);
  };

  return {
    blocks,
    columns,
    isEditing,
    setIsEditing,
    setColumns,
    saveLayout,
    resetLayout,
    moveBlock,
    toggleBlockVisibility,
    getBlocksByColumn,
    getHiddenBlocks
  };
};

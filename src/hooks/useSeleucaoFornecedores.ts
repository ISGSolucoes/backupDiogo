
import { useState, useCallback, useMemo } from 'react';
import { Fornecedor } from '@/types/fornecedor';

export const useSeleucaoFornecedores = (fornecedores: Fornecedor[]) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fornecedoresSelecionados = useMemo(() => {
    return fornecedores.filter(f => selectedIds.includes(f.id));
  }, [fornecedores, selectedIds]);

  const handleSelectionChange = useCallback((newSelection: string[]) => {
    setSelectedIds(newSelection);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(fornecedores.map(f => f.id));
  }, [fornecedores]);

  const toggleFornecedor = useCallback((fornecedorId: string) => {
    setSelectedIds(prev => 
      prev.includes(fornecedorId) 
        ? prev.filter(id => id !== fornecedorId)
        : [...prev, fornecedorId]
    );
  }, []);

  return {
    selectedIds,
    fornecedoresSelecionados,
    handleSelectionChange,
    clearSelection,
    selectAll,
    toggleFornecedor,
    hasSelection: selectedIds.length > 0,
    selectionCount: selectedIds.length
  };
};

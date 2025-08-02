
import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';

interface DocumentFlowContextType {
  sincronizarDocumentos: () => Promise<void>;
  estatisticasIntegracao: {
    documentosPendentes: number;
    documentosProcessados: number;
    ultimaSincronizacao: string;
  };
}

const DocumentFlowContext = createContext<DocumentFlowContextType | undefined>(undefined);

export const useDocumentFlow = () => {
  const context = useContext(DocumentFlowContext);
  if (!context) {
    throw new Error('useDocumentFlow must be used within a DocumentFlowProvider');
  }
  return context;
};

interface DocumentFlowProviderProps {
  children: ReactNode;
}

export const DocumentFlowProvider: React.FC<DocumentFlowProviderProps> = ({ children }) => {
  const { data: estatisticas, refetch } = useQuery({
    queryKey: ['integracoes', 'estatisticas'],
    queryFn: async () => {
      // Simulated API call - replace with actual integration
      return {
        documentosPendentes: 5,
        documentosProcessados: 234,
        ultimaSincronizacao: new Date().toISOString()
      };
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  const sincronizarDocumentos = async () => {
    try {
      console.log('Iniciando sincronização de documentos...');
      // Implement actual synchronization logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
      await refetch();
      console.log('Sincronização concluída com sucesso');
    } catch (error) {
      console.error('Erro na sincronização:', error);
      throw error;
    }
  };

  const value: DocumentFlowContextType = {
    sincronizarDocumentos,
    estatisticasIntegracao: estatisticas || {
      documentosPendentes: 0,
      documentosProcessados: 0,
      ultimaSincronizacao: new Date().toISOString()
    }
  };

  return (
    <DocumentFlowContext.Provider value={value}>
      {children}
    </DocumentFlowContext.Provider>
  );
};


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export type DocumentType = 'pedido' | 'cotacao' | 'qualificacao' | 'contrato';

export interface DocumentoIntegracao {
  id: string;
  tipo: DocumentType;
  fornecedorId: string;
  fornecedorNome: string;
  titulo: string;
  status: string;
  dadosOriginais: any;
  criadoEm: string;
  atualizadoEm: string;
  sincronizado: boolean;
}

export const useDocumentIntegration = () => {
  const queryClient = useQueryClient();

  const { data: documentos = [], isLoading } = useQuery({
    queryKey: ['integracoes', 'documentos'],
    queryFn: async (): Promise<DocumentoIntegracao[]> => {
      // Simulated API call - replace with actual integration
      return [
        {
          id: 'DOC-001',
          tipo: 'cotacao',
          fornecedorId: 'FORN-001',
          fornecedorNome: 'TechSupply Solutions',
          titulo: 'Cotação de Equipamentos Industriais',
          status: 'respondida',
          dadosOriginais: { valor: 125000, prazo: '2024-06-15' },
          criadoEm: '2024-05-20T10:00:00Z',
          atualizadoEm: '2024-05-21T14:30:00Z',
          sincronizado: true
        },
        {
          id: 'DOC-002',
          tipo: 'pedido',
          fornecedorId: 'FORN-001',
          fornecedorNome: 'TechSupply Solutions',
          titulo: 'Pedido de Válvulas Industriais',
          status: 'confirmado',
          dadosOriginais: { valor: 85000, dataEntrega: '2024-06-10' },
          criadoEm: '2024-05-22T09:15:00Z',
          atualizadoEm: '2024-05-22T09:15:00Z',
          sincronizado: false
        }
      ];
    },
    refetchInterval: 30000
  });

  const sincronizarDocumento = useMutation({
    mutationFn: async (documentoId: string) => {
      console.log(`Sincronizando documento ${documentoId}...`);
      // Implement actual synchronization logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integracoes', 'documentos'] });
      queryClient.invalidateQueries({ queryKey: ['integracoes', 'estatisticas'] });
    }
  });

  const processarDocumento = useMutation({
    mutationFn: async ({ documentoId, novoStatus }: { documentoId: string; novoStatus: string }) => {
      console.log(`Processando documento ${documentoId} para status ${novoStatus}...`);
      // Implement actual processing logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integracoes', 'documentos'] });
    }
  });

  const getDocumentosPorTipo = (tipo: DocumentType) => {
    return documentos.filter(doc => doc.tipo === tipo);
  };

  const getDocumentosPendentes = () => {
    return documentos.filter(doc => !doc.sincronizado);
  };

  return {
    documentos,
    isLoading,
    sincronizarDocumento,
    processarDocumento,
    getDocumentosPorTipo,
    getDocumentosPendentes
  };
};

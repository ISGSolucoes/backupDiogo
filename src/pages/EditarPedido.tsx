import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePedidos } from '@/hooks/usePedidos';
import { FormularioPedido } from '@/components/pedidos/FormularioPedido';
import { WorkflowButtons } from '@/components/pedidos/WorkflowButtons';
import { StatusPedido } from '@/types/pedido';
import { toast } from 'sonner';

export default function EditarPedido() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { buscarPedidoPorId, salvarPedido, validarPedido, alterarStatusPedido } = usePedidos();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      carregarPedido();
    }
  }, [id]);

  const carregarPedido = async () => {
    if (!id) return;
    
    setLoading(true);
    const pedidoData = await buscarPedidoPorId(id);
    setPedido(pedidoData);
    setLoading(false);
  };

  const handleSalvar = async (dados: any) => {
    await salvarPedido(dados);
    navigate('/pedidos');
  };

  const handleStatusChange = async (novoStatus: StatusPedido, justificativa?: string) => {
    if (!pedido) return;
    await alterarStatusPedido(pedido.id, novoStatus, justificativa);
    await carregarPedido(); // Recarregar dados
  };

  const handleGerarPDF = async () => {
    if (!pedido) return;
    
    toast.info('Gerando PDF do pedido...');
    try {
      const response = await fetch(`https://lktdauwdmadjdnfbwnge.supabase.co/functions/v1/gerar-pdf-pedido`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ pedido_id: pedido.id })
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Pedido-${pedido.numero_pedido}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success('PDF gerado com sucesso!');
      } else {
        throw new Error('Erro ao gerar PDF');
      }
    } catch (error) {
      toast.error('Erro ao gerar PDF do pedido');
    }
  };

  const handleEnviarPortal = async () => {
    if (!pedido) return;
    
    toast.info('Enviando pedido para o portal...');
    try {
      const response = await fetch(`https://lktdauwdmadjdnfbwnge.supabase.co/functions/v1/enviar-pedido-portal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ 
          pedido_id: pedido.id,
          fornecedor_id: pedido.fornecedor_id
        })
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success('Pedido enviado para o portal com sucesso!');
        await carregarPedido(); // Recarregar dados
      } else {
        throw new Error(result.error || 'Erro ao enviar pedido');
      }
    } catch (error) {
      toast.error('Erro ao enviar pedido para o portal');
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p>Pedido não encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FormularioPedido 
            pedido={pedido}
            onSalvar={handleSalvar}
            onValidar={validarPedido}
          />
        </div>
        <div className="lg:col-span-1">
          <WorkflowButtons
            pedido={pedido}
            onStatusChange={handleStatusChange}
            onGerarPDF={handleGerarPDF}
            onEnviarPortal={handleEnviarPortal}
          />
        </div>
      </div>
    </div>
  );
}
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, BarChart3 } from "lucide-react";
import { usePedidos } from "@/hooks/usePedidos";
import { PedidosDashboard } from "@/components/pedidos/PedidosDashboard";
import { FiltrosPedidos } from "@/components/pedidos/FiltrosPedidos";
import { TabelaPedidos } from "@/components/pedidos/TabelaPedidos";
import { useToast } from "@/hooks/use-toast";

export default function Pedidos() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    pedidos,
    loading,
    filtros,
    setFiltros,
    termoBusca,
    setTermoBusca,
    paginaAtual,
    setPaginaAtual,
    totalPaginas,
    totalRegistros,
    excluirPedido,
    alterarStatusPedido,
    estatisticas
  } = usePedidos();

  const handleNovoPedido = () => {
    navigate('/pedidos/criar');
  };

  const handleExportar = async () => {
    toast({
      title: "Exportação",
      description: "Iniciando exportação dos dados...",
    });
    
    try {
      const response = await fetch(`https://lktdauwdmadjdnfbwnge.supabase.co/functions/v1/exportar-pedidos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ 
          filtros,
          formato: 'xlsx'
        })
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Relatorio-Pedidos-${new Date().toISOString().split('T')[0]}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast({
          title: "Sucesso",
          description: "Exportação concluída com sucesso!",
        });
      } else {
        throw new Error('Erro na exportação');
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao exportar dados",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            Pedidos de Compra
          </h1>
          <p className="text-muted-foreground">
            Sistema completo de gestão de pedidos, aprovações e integrações
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2" onClick={() => navigate('/pedidos/relatorios')}>
            <TrendingUp className="h-4 w-4" />
            Relatórios
          </Button>
          <Button onClick={handleNovoPedido} className="gap-2 hover-scale">
            <Plus className="h-4 w-4" />
            Novo Pedido
          </Button>
        </div>
      </div>

      {/* Dashboard */}
      <PedidosDashboard estatisticas={estatisticas} />

      {/* Filtros */}
      <FiltrosPedidos
        filtros={filtros}
        setFiltros={setFiltros}
        termoBusca={termoBusca}
        setTermoBusca={setTermoBusca}
        onExportar={handleExportar}
        totalRegistros={totalRegistros}
      />

      {/* Tabela */}
      <TabelaPedidos
        pedidos={pedidos}
        loading={loading}
        onExcluir={excluirPedido}
        onAlterarStatus={alterarStatusPedido}
        paginaAtual={paginaAtual}
        totalPaginas={totalPaginas}
        onChangePage={setPaginaAtual}
        totalRegistros={totalRegistros}
      />
    </div>
  );
}
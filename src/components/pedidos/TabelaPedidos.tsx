import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { 
  Eye, 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  Download, 
  Send,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Copy,
  ExternalLink
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Pedido, StatusPedido, StatusColors, StatusLabels, TipoLabels } from "@/types/pedido";
import { useToast } from "@/hooks/use-toast";

interface TabelaPedidosProps {
  pedidos: Pedido[];
  loading: boolean;
  onExcluir: (id: string) => void;
  onAlterarStatus: (id: string, status: StatusPedido) => void;
  paginaAtual: number;
  totalPaginas: number;
  onChangePage: (page: number) => void;
  totalRegistros: number;
}

export function TabelaPedidos({ 
  pedidos, 
  loading, 
  onExcluir, 
  onAlterarStatus,
  paginaAtual,
  totalPaginas,
  onChangePage,
  totalRegistros
}: TabelaPedidosProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarData = (data: string) => {
    return format(new Date(data), "dd/MM/yyyy", { locale: ptBR });
  };

  const formatarDataHora = (data: string) => {
    return format(new Date(data), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  const getStatusIcon = (status: StatusPedido) => {
    switch (status) {
      case 'confirmado':
        return <CheckCircle2 className="h-3 w-3" />;
      case 'aguardando_aprovacao':
        return <Clock className="h-3 w-3" />;
      case 'cancelado':
        return <AlertTriangle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const copiarNumero = (numero: string) => {
    navigator.clipboard.writeText(numero);
    toast({
      title: "Copiado!",
      description: `Número ${numero} copiado para a área de transferência`,
    });
  };

  const handleBaixarPDF = async (pedidoId: string, numeroPedido: string) => {
    toast({
      title: "PDF",
      description: "Gerando PDF do pedido...",
    });
    
    try {
      const response = await fetch(`https://lktdauwdmadjdnfbwnge.supabase.co/functions/v1/gerar-pdf-pedido`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ pedido_id: pedidoId })
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Pedido-${numeroPedido}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast({
          title: "Sucesso",
          description: "PDF gerado com sucesso!",
        });
      } else {
        throw new Error('Erro ao gerar PDF');
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao gerar PDF do pedido",
        variant: "destructive"
      });
    }
  };

  const SkeletonRow = () => (
    <TableRow>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
      <TableCell><Skeleton className="h-8 w-8" /></TableCell>
    </TableRow>
  );

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Lista de Pedidos</CardTitle>
            <CardDescription>
              {totalRegistros} pedido{totalRegistros !== 1 ? 's' : ''} encontrado{totalRegistros !== 1 ? 's' : ''}
              {totalPaginas > 1 && ` - Página ${paginaAtual} de ${totalPaginas}`}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Data Criação</TableHead>
                <TableHead>Entrega</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <SkeletonRow key={index} />
                ))
              ) : pedidos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <div className="text-muted-foreground">
                        Nenhum pedido encontrado
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => navigate('/pedidos/criar')}
                        className="gap-2"
                      >
                        <Send className="h-4 w-4" />
                        Criar Primeiro Pedido
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                pedidos.map((pedido) => (
                  <TableRow key={pedido.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span 
                          className="cursor-pointer hover:text-primary transition-colors"
                          onClick={() => copiarNumero(pedido.numero_pedido)}
                          title="Clique para copiar"
                        >
                          {pedido.numero_pedido}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copiarNumero(pedido.numero_pedido)}
                          className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">Fornecedor #{pedido.fornecedor_id}</div>
                        <div className="text-sm text-muted-foreground">
                          ID: {pedido.fornecedor_id}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {TipoLabels[pedido.tipo]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${StatusColors[pedido.status]} gap-1`}>
                        {getStatusIcon(pedido.status)}
                        {StatusLabels[pedido.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatarMoeda(pedido.valor_total)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{formatarData(pedido.data_criacao)}</div>
                        <div className="text-muted-foreground text-xs">
                          {formatarDataHora(pedido.data_criacao)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatarData(pedido.data_entrega_solicitada)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem 
                            className="gap-2"
                            onClick={() => navigate(`/pedidos/${pedido.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="gap-2"
                            onClick={() => navigate(`/pedidos/${pedido.id}/editar`)}
                          >
                            <Edit className="h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="gap-2"
                            onClick={() => handleBaixarPDF(pedido.id, pedido.numero_pedido)}
                          >
                            <Download className="h-4 w-4" />
                            Baixar PDF
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          
                          {/* Alterações de Status */}
                          {pedido.status === 'rascunho' && (
                            <DropdownMenuItem 
                              className="gap-2"
                              onClick={() => onAlterarStatus(pedido.id, 'aguardando_aprovacao')}
                            >
                              <Send className="h-4 w-4" />
                              Enviar para Aprovação
                            </DropdownMenuItem>
                          )}
                          
                          {pedido.status === 'aguardando_aprovacao' && (
                            <DropdownMenuItem 
                              className="gap-2"
                              onClick={() => onAlterarStatus(pedido.id, 'aprovado')}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              Aprovar
                            </DropdownMenuItem>
                          )}
                          
                          {pedido.status === 'aprovado' && (
                            <DropdownMenuItem 
                              className="gap-2"
                              onClick={async () => {
                                toast({
                                  title: "Enviando",
                                  description: "Enviando pedido para o portal...",
                                });
                                
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
                                    toast({
                                      title: "Sucesso",
                                      description: "Pedido enviado para o portal!",
                                    });
                                    onAlterarStatus(pedido.id, 'enviado');
                                  } else {
                                    throw new Error(result.error || 'Erro ao enviar pedido');
                                  }
                                } catch (error) {
                                  toast({
                                    title: "Erro",
                                    description: "Erro ao enviar pedido para o portal",
                                    variant: "destructive"
                                  });
                                }
                              }}
                            >
                              <ExternalLink className="h-4 w-4" />
                              Enviar ao Fornecedor
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuSeparator />
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem 
                                className="gap-2 text-destructive focus:text-destructive"
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Trash2 className="h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir o pedido {pedido.numero_pedido}? 
                                  Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => onExcluir(pedido.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Paginação */}
        {totalPaginas > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Página {paginaAtual} de {totalPaginas} ({totalRegistros} registros)
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => paginaAtual > 1 && onChangePage(paginaAtual - 1)}
                    className={paginaAtual <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {/* Páginas */}
                {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                  const page = Math.max(1, Math.min(totalPaginas - 4, paginaAtual - 2)) + i;
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => onChangePage(page)}
                        isActive={page === paginaAtual}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => paginaAtual < totalPaginas && onChangePage(paginaAtual + 1)}
                    className={paginaAtual >= totalPaginas ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
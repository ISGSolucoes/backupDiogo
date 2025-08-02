import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  FileText,
  User,
  Calendar,
  Eye,
  Download,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  Users,
  Mail,
  Star,
  Activity
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface LogAuditoria {
  id: string;
  disparo_id: string;
  fornecedor_id: string;
  fornecedor_nome: string;
  tipo_acao: string;
  template_nome: string;
  status_final: string;
  detalhes: {
    template_id: string;
    conteudo_enviado: string;
    finalidade: string;
    fornecedor_dados: any;
    timestamp_envio: string;
    ip_origem?: string;
    usuario_nome?: string;
    usuario_cargo?: string;
  };
  executado_por?: string;
  executado_em: string;
  created_at: string;
}

interface LogsAuditoriaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const iconesPorTipo: Record<string, React.ComponentType<any>> = {
  comunicado: MessageSquare,
  pesquisa_cliente: Users,
  convite: Mail,
  avaliacao_interna: CheckCircle,
  requalificacao: Star
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'enviado':
      return <Badge className="bg-green-100 text-green-800">Enviado</Badge>;
    case 'aberto':
      return <Badge className="bg-blue-100 text-blue-800">Aberto</Badge>;
    case 'respondido':
      return <Badge className="bg-purple-100 text-purple-800">Respondido</Badge>;
    case 'falhou':
      return <Badge className="bg-red-100 text-red-800">Falhou</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export const LogsAuditoriaModal: React.FC<LogsAuditoriaModalProps> = ({
  open,
  onOpenChange
}) => {
  const [logs, setLogs] = useState<LogAuditoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [buscaTexto, setBuscaTexto] = useState('');
  const [logSelecionado, setLogSelecionado] = useState<LogAuditoria | null>(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('historico_acao_fornecedor')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        throw error;
      }

      console.log('Logs carregados:', data);
      
      // Transformar dados do banco para corresponder ao tipo
      const logsTransformados = (data || []).map(item => ({
        ...item,
        detalhes: (item.detalhes as any) || {}
      }));
      
      setLogs(logsTransformados);
    } catch (error) {
      console.error('Erro ao buscar logs:', error);
      toast.error('Erro ao carregar logs de auditoria');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchLogs();
    }
  }, [open]);

  const logsFiltrados = logs.filter(log => {
    const matchTipo = filtroTipo === 'todos' || log.tipo_acao === filtroTipo;
    const matchStatus = filtroStatus === 'todos' || log.status_final === filtroStatus;
    const matchTexto = !buscaTexto || 
      log.fornecedor_nome.toLowerCase().includes(buscaTexto.toLowerCase()) ||
      log.template_nome.toLowerCase().includes(buscaTexto.toLowerCase());
    
    return matchTipo && matchStatus && matchTexto;
  });

  const handleVisualizarConteudo = (log: LogAuditoria) => {
    setLogSelecionado(log);
  };

  const handleExportarLog = (log: LogAuditoria) => {
    const dadosExportacao = {
      id: log.id,
      disparo_id: log.disparo_id,
      fornecedor: {
        nome: log.fornecedor_nome,
        id: log.fornecedor_id
      },
      acao: {
        tipo: log.tipo_acao,
        template: log.template_nome,
        status: log.status_final
      },
      detalhes: log.detalhes,
      auditoria: {
        executado_por: log.executado_por,
        executado_em: log.executado_em,
        created_at: log.created_at
      }
    };

    const blob = new Blob([JSON.stringify(dadosExportacao, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `log-auditoria-${log.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Log exportado com sucesso');
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Logs de Auditoria - Ações Enviadas
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Estatísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{logs.length}</p>
                    <p className="text-sm text-muted-foreground">Total de Ações</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">
                      {logs.filter(l => l.status_final === 'enviado').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Enviadas</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-2xl font-bold">
                      {logs.filter(l => l.status_final === 'falhou').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Com Falha</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm font-bold">
                      {logs.length > 0 ? format(new Date(logs[0].created_at), 'dd/MM HH:mm', { locale: ptBR }) : '--'}
                    </p>
                    <p className="text-sm text-muted-foreground">Último Envio</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por fornecedor ou template..."
                    value={buscaTexto}
                    onChange={(e) => setBuscaTexto(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo de Ação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Tipos</SelectItem>
                  <SelectItem value="comunicado">Comunicado</SelectItem>
                  <SelectItem value="pesquisa_cliente">Pesquisa Cliente</SelectItem>
                  <SelectItem value="convite">Convite</SelectItem>
                  <SelectItem value="avaliacao_interna">Avaliação Interna</SelectItem>
                  <SelectItem value="requalificacao">Requalificação</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos Status</SelectItem>
                  <SelectItem value="enviado">Enviado</SelectItem>
                  <SelectItem value="aberto">Aberto</SelectItem>
                  <SelectItem value="respondido">Respondido</SelectItem>
                  <SelectItem value="falhou">Falhou</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tabela de Logs */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Ação</TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Executado Por</TableHead>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
                          Carregando logs...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : logsFiltrados.map((log) => {
                    const Icone = iconesPorTipo[log.tipo_acao] || MessageSquare;

                    return (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{log.fornecedor_nome}</p>
                            <p className="text-sm text-muted-foreground">ID: {log.fornecedor_id.substring(0, 8)}...</p>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Icone className="h-4 w-4" />
                            <span className="capitalize">{log.tipo_acao.replace('_', ' ')}</span>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div>
                            <p className="font-medium">{log.template_nome}</p>
                            {log.detalhes?.finalidade && (
                              <p className="text-sm text-muted-foreground">{log.detalhes.finalidade}</p>
                            )}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          {getStatusBadge(log.status_final)}
                        </TableCell>
                        
                        <TableCell>
                          <div className="text-sm">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {log.detalhes?.usuario_nome || 'Sistema'}
                            </div>
                            {log.detalhes?.usuario_cargo && (
                              <div className="text-muted-foreground">{log.detalhes.usuario_cargo}</div>
                            )}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(log.executado_em), 'dd/MM/yyyy', { locale: ptBR })}
                            </div>
                            <div className="text-muted-foreground">
                              {format(new Date(log.executado_em), 'HH:mm:ss', { locale: ptBR })}
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleVisualizarConteudo(log)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleExportarLog(log)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {logsFiltrados.length === 0 && !loading && (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum log encontrado com os filtros aplicados</p>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Detalhes do Log */}
      {logSelecionado && (
        <Dialog open={!!logSelecionado} onOpenChange={() => setLogSelecionado(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Detalhes da Ação Enviada
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Informações Gerais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Fornecedor</h4>
                  <p>{logSelecionado.fornecedor_nome}</p>
                  <p className="text-sm text-muted-foreground">ID: {logSelecionado.fornecedor_id}</p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">Template</h4>
                  <p>{logSelecionado.template_nome}</p>
                  <p className="text-sm text-muted-foreground">{logSelecionado.detalhes?.finalidade}</p>
                </div>
              </div>

              <Separator />

              {/* Conteúdo Enviado */}
              <div className="space-y-2">
                <h4 className="font-semibold">Conteúdo Enviado</h4>
                <div className="p-4 bg-muted rounded-lg max-h-64 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm">
                    {logSelecionado.detalhes?.conteudo_enviado || 'Conteúdo não disponível'}
                  </pre>
                </div>
              </div>

              <Separator />

              {/* Dados de Auditoria */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Enviado Por</h4>
                  <p>{logSelecionado.detalhes?.usuario_nome || 'Sistema'}</p>
                  <p className="text-sm text-muted-foreground">{logSelecionado.detalhes?.usuario_cargo}</p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">Data/Hora</h4>
                  <p>{format(new Date(logSelecionado.executado_em), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })}</p>
                  <p className="text-sm text-muted-foreground">IP: {logSelecionado.detalhes?.ip_origem || 'N/A'}</p>
                </div>
              </div>

              {/* Dados do Fornecedor */}
              {logSelecionado.detalhes?.fornecedor_dados && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-semibold">Dados do Fornecedor no Momento do Envio</h4>
                    <div className="p-4 bg-muted rounded-lg">
                      <pre className="text-sm">
                        {JSON.stringify(logSelecionado.detalhes.fornecedor_dados, null, 2)}
                      </pre>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => handleExportarLog(logSelecionado)}>
                <Download className="h-4 w-4 mr-2" />
                Exportar Log
              </Button>
              <Button variant="outline" onClick={() => setLogSelecionado(null)}>
                Fechar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
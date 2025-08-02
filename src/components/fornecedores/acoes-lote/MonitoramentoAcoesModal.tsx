import React, { useState, useEffect } from 'react';
import { LogsAuditoriaModal } from './LogsAuditoriaModal';
import { DetalhesDisparoModal } from './DetalhesDisparoModal';
import { supabase } from '@/integrations/supabase/client';
import { ExpandedDialog } from "@/components/ui/expanded-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Monitor, 
  Search, 
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  MessageSquare,
  Users,
  Mail,
  Settings,
  Star,
  Activity
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useFullscreenModal } from '@/hooks/useFullscreenModal';
import type { DisparoAcaoLote, MetricasDisparo, TipoAcaoLote, StatusDisparo } from '@/types/acoes-lote';

interface MonitoramentoAcoesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const mockDisparos: DisparoAcaoLote[] = [
  {
    id: '1',
    nome_disparo: 'Comunicado: Nova Política 2025',
    tipo_acao: 'comunicado',
    total_fornecedores: 87,
    enviados: 85,
    abertos: 61,
    respondidos: 0,
    falhas: 2,
    status: 'concluido',
    disparado_em: '2025-01-20T10:30:00Z',
    concluido_em: '2025-01-20T11:45:00Z',
    configuracoes: {},
    created_at: '2025-01-20T10:30:00Z'
  },
  {
    id: '2',
    nome_disparo: 'Pesquisa NPS ESG',
    tipo_acao: 'pesquisa_cliente',
    total_fornecedores: 35,
    enviados: 35,
    abertos: 28,
    respondidos: 22,
    falhas: 0,
    status: 'concluido',
    disparado_em: '2025-01-19T14:15:00Z',
    concluido_em: '2025-01-19T14:20:00Z',
    configuracoes: {},
    created_at: '2025-01-19T14:15:00Z'
  },
  {
    id: '3',
    nome_disparo: 'Convite Processo Hospital',
    tipo_acao: 'convite',
    total_fornecedores: 15,
    enviados: 12,
    abertos: 8,
    respondidos: 5,
    falhas: 3,
    status: 'enviando',
    disparado_em: '2025-01-20T16:00:00Z',
    configuracoes: {},
    created_at: '2025-01-20T16:00:00Z'
  }
];

const iconesPorTipo: Record<TipoAcaoLote, React.ComponentType<any>> = {
  comunicado: MessageSquare,
  pesquisa_cliente: Users,
  convite: Mail,
  avaliacao_interna: CheckCircle,
  requalificacao: Star
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'concluido':
      return <Badge className="bg-green-100 text-green-800">Concluído</Badge>;
    case 'enviando':
      return <Badge className="bg-blue-100 text-blue-800">Enviando</Badge>;
    case 'preparando':
      return <Badge className="bg-yellow-100 text-yellow-800">Preparando</Badge>;
    case 'falhou':
      return <Badge className="bg-red-100 text-red-800">Falhou</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const calcularMetricas = (disparo: DisparoAcaoLote): MetricasDisparo => {
  const taxa_abertura = disparo.enviados > 0 ? (disparo.abertos / disparo.enviados) * 100 : 0;
  const taxa_resposta = disparo.enviados > 0 ? (disparo.respondidos / disparo.enviados) * 100 : 0;
  
  return {
    total: disparo.total_fornecedores,
    enviados: disparo.enviados,
    abertos: disparo.abertos,
    respondidos: disparo.respondidos,
    falhas: disparo.falhas,
    taxa_abertura,
    taxa_resposta
  };
};

export const MonitoramentoAcoesModal: React.FC<MonitoramentoAcoesModalProps> = ({
  open,
  onOpenChange
}) => {
  const [disparos, setDisparos] = useState<DisparoAcaoLote[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [buscaTexto, setBuscaTexto] = useState('');
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [showDetalhesModal, setShowDetalhesModal] = useState(false);
  const [disparoSelecionado, setDisparoSelecionado] = useState<DisparoAcaoLote | null>(null);
  const { isFullscreen, toggleFullscreen } = useFullscreenModal(false);

  const disparosFiltrados = disparos.filter(disparo => {
    const matchTipo = filtroTipo === 'todos' || disparo.tipo_acao === filtroTipo;
    const matchStatus = filtroStatus === 'todos' || disparo.status === filtroStatus;
    const matchTexto = !buscaTexto || 
      disparo.nome_disparo.toLowerCase().includes(buscaTexto.toLowerCase());
    
    return matchTipo && matchStatus && matchTexto;
  });

  // Buscar disparos reais do banco
  const fetchDisparos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('disparo_acao_lote')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      console.log('Disparos carregados:', data);
      
      // Transformar dados do banco para corresponder ao tipo
      const disparosTransformados = (data || []).map(item => ({
        ...item,
        tipo_acao: item.tipo_acao as TipoAcaoLote,
        abertos: item.abertos || 0,
        respondidos: item.respondidos || 0,
        total_fornecedores: item.total_fornecedores || 0,
        enviados: item.enviados || 0,
        falhas: item.falhas || 0,
        status: (item.status as StatusDisparo) || 'preparando',
        disparado_em: item.disparado_em || item.created_at,
        configuracoes: (item.configuracoes as Record<string, any>) || {}
      }));
      
      setDisparos(disparosTransformados);
    } catch (error) {
      console.error('Erro ao buscar disparos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchDisparos();
    }
  }, [open]);

  // Estatísticas gerais
  const estatisticas = {
    total_disparos: disparos.length,
    fornecedores_atingidos: disparos.reduce((acc, d) => acc + (d.total_fornecedores || 0), 0),
    taxa_sucesso_media: disparos.length > 0 
      ? (disparos.reduce((acc, d) => acc + ((d.enviados || 0) / (d.total_fornecedores || 1)), 0) / disparos.length) * 100 
      : 0,
    disparos_ativos: disparos.filter(d => d.status === 'enviando' || d.status === 'preparando').length
  };

  return (
    <>
      <ExpandedDialog 
        open={open} 
        onOpenChange={onOpenChange}
        title="Monitoramento de Ações em Lote"
        fullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        className="overflow-y-auto"
      >
        <div className="space-y-6">
          {/* Estatísticas gerais */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{estatisticas.total_disparos}</p>
                  <p className="text-sm text-muted-foreground">Total de Disparos</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{estatisticas.fornecedores_atingidos}</p>
                  <p className="text-sm text-muted-foreground">Fornecedores Atingidos</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{estatisticas.taxa_sucesso_media.toFixed(1)}%</p>
                  <p className="text-sm text-muted-foreground">Taxa Sucesso Média</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">{estatisticas.disparos_ativos}</p>
                  <p className="text-sm text-muted-foreground">Disparos Ativos</p>
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
                  placeholder="Buscar por nome do disparo..."
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
                <SelectItem value="preparando">Preparando</SelectItem>
                <SelectItem value="enviando">Enviando</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
                <SelectItem value="falhou">Falhou</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabela de disparos */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Disparo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Fornecedores</TableHead>
                  <TableHead>Progresso</TableHead>
                  <TableHead>Métricas</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
                        Carregando disparos...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : disparosFiltrados.map((disparo) => {
                  const Icone = iconesPorTipo[disparo.tipo_acao] || MessageSquare;
                  const metricas = calcularMetricas(disparo);
                  const progressoEnvio = (disparo.total_fornecedores || 0) > 0 
                    ? ((disparo.enviados || 0) / disparo.total_fornecedores) * 100 
                    : 0;

                  return (
                    <TableRow key={disparo.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{disparo.nome_disparo}</p>
                          <p className="text-sm text-muted-foreground">ID: {disparo.id.substring(0, 8)}...</p>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Icone className="h-4 w-4" />
                          <span className="capitalize">{disparo.tipo_acao.replace('_', ' ')}</span>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        {getStatusBadge(disparo.status)}
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-sm">
                          <div>Total: {disparo.total_fornecedores || 0}</div>
                          <div className="text-muted-foreground">
                            Enviados: {disparo.enviados || 0} | Falhas: {disparo.falhas || 0}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>Envio</span>
                            <span>{progressoEnvio.toFixed(0)}%</span>
                          </div>
                          <Progress value={progressoEnvio} className="h-2" />
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-sm space-y-1">
                          {disparo.tipo_acao !== 'avaliacao_interna' && (
                            <>
                              <div>Abertura: {metricas.taxa_abertura.toFixed(1)}%</div>
                              {disparo.tipo_acao === 'pesquisa_cliente' && (
                                <div>Resposta: {metricas.taxa_resposta.toFixed(1)}%</div>
                              )}
                            </>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-sm">
                          <div>{format(new Date(disparo.disparado_em || disparo.created_at), 'dd/MM/yyyy', { locale: ptBR })}</div>
                          <div className="text-muted-foreground">
                            {format(new Date(disparo.disparado_em || disparo.created_at), 'HH:mm', { locale: ptBR })}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setDisparoSelecionado(disparo);
                            setShowDetalhesModal(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {disparosFiltrados.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              <Monitor className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum disparo encontrado com os filtros aplicados</p>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => setShowLogsModal(true)}
            className="flex items-center gap-2"
          >
            <Activity className="h-4 w-4" />
            Ver Logs de Auditoria
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </div>
      </ExpandedDialog>

      {/* Modal de Logs de Auditoria */}
      <LogsAuditoriaModal
        open={showLogsModal}
        onOpenChange={setShowLogsModal}
      />

      {/* Modal de Detalhes do Disparo */}
      <DetalhesDisparoModal
        open={showDetalhesModal}
        onOpenChange={setShowDetalhesModal}
        disparo={disparoSelecionado}
      />
    </>
  );
};

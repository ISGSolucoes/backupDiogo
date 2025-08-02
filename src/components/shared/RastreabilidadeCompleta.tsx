import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  FileText, 
  TrendingUp, 
  ShoppingCart, 
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface FluxoItem {
  id: string;
  modulo: 'requisicao' | 'sourcing' | 'pedido' | 'contrato';
  numero: string;
  status: string;
  valor?: number;
  data_criacao: string;
  data_finalizacao?: string;
}

interface RastreabilidadeData {
  requisicao?: FluxoItem;
  sourcing?: FluxoItem;
  pedido?: FluxoItem;
  contrato?: FluxoItem;
  historico: Array<{
    id: string;
    evento: string;
    descricao: string;
    data: string;
    origem: string;
    usuario: string;
  }>;
}

export const RastreabilidadeCompleta = ({ requisicaoId }: { requisicaoId?: string }) => {
  const [dados, setDados] = useState<RastreabilidadeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buscarRastreabilidade = async (reqId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Buscar requisição
      const { data: requisicao } = await supabase
        .from('requisicoes')
        .select('id, numero_requisicao, status, valor_estimado, created_at, updated_at')
        .eq('id', reqId)
        .single();

      // Buscar projeto de sourcing relacionado (usando any para evitar erro de tipos)
      const { data: sourcing } = await supabase
        .from('projetos_sourcing')
        .select('id, codigo_projeto, status, created_at, updated_at')
        .eq('id', 'temp') // Placeholder - ajustar conforme estrutura real
        .maybeSingle();

      // Buscar pedido relacionado
      const { data: pedido } = await supabase
        .from('pedidos')
        .select('id, numero_pedido, status, valor_total, created_at, updated_at')
        .eq('requisicao_id', reqId)
        .maybeSingle();

      // Buscar histórico
      const { data: historico } = await supabase
        .from('historico_requisicao')
        .select('id, evento, descricao, created_at, origem, usuario_nome')
        .eq('requisicao_id', reqId)
        .order('created_at', { ascending: true });

      // Montar dados consolidados
      const dadosConsolidados: RastreabilidadeData = {
        requisicao: requisicao ? {
          id: requisicao.id,
          modulo: 'requisicao',
          numero: requisicao.numero_requisicao,
          status: requisicao.status,
          valor: requisicao.valor_estimado,
          data_criacao: requisicao.created_at,
          data_finalizacao: requisicao.status === 'finalizada' ? requisicao.updated_at : undefined
        } : undefined,
        
        sourcing: sourcing ? {
          id: sourcing.id,
          modulo: 'sourcing',
          numero: sourcing.codigo_projeto,
          status: sourcing.status,
          data_criacao: sourcing.created_at,
          data_finalizacao: sourcing.status === 'finalizado' ? sourcing.updated_at : undefined
        } : undefined,
        
        pedido: pedido ? {
          id: pedido.id,
          modulo: 'pedido',
          numero: pedido.numero_pedido,
          status: pedido.status,
          valor: pedido.valor_total,
          data_criacao: pedido.created_at,
          data_finalizacao: pedido.status === 'finalizado' ? pedido.updated_at : undefined
        } : undefined,
        
        historico: (historico || []).map(h => ({
          id: h.id,
          evento: h.evento,
          descricao: h.descricao,
          data: h.created_at,
          origem: h.origem,
          usuario: h.usuario_nome
        }))
      };

      setDados(dadosConsolidados);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar rastreabilidade');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (requisicaoId) {
      buscarRastreabilidade(requisicaoId);
    }
  }, [requisicaoId]);

  const getModuleIcon = (modulo: string) => {
    switch (modulo) {
      case 'requisicao': return <FileText className="h-4 w-4" />;
      case 'sourcing': return <TrendingUp className="h-4 w-4" />;
      case 'pedido': return <ShoppingCart className="h-4 w-4" />;
      case 'contrato': return <CheckCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'finalizada':
      case 'finalizado':
      case 'entregue':
        return 'bg-green-100 text-green-800';
      case 'em_aprovacao':
      case 'processando':
      case 'ativo':
        return 'bg-yellow-100 text-yellow-800';
      case 'aprovada':
      case 'confirmado':
        return 'bg-blue-100 text-blue-800';
      case 'rejeitada':
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!requisicaoId) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">Selecione uma requisição para ver a rastreabilidade</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <RefreshCw className="h-8 w-8 text-blue-500 mx-auto mb-2 animate-spin" />
          <p className="text-gray-500">Carregando rastreabilidade...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600">{error}</p>
          <Button variant="outline" onClick={() => requisicaoId && buscarRastreabilidade(requisicaoId)} className="mt-2">
            Tentar Novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!dados) return null;

  return (
    <div className="space-y-6">
      {/* Fluxo Visual */}
      <Card>
        <CardHeader>
          <CardTitle>Fluxo Completo da Demanda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between space-x-4">
            {/* Requisição */}
            {dados.requisicao && (
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {getModuleIcon('requisicao')}
                  <span className="font-medium">Requisição</span>
                </div>
                <div className="text-sm text-gray-600 mb-1">{dados.requisicao.numero}</div>
                <Badge className={`text-xs ${getStatusColor(dados.requisicao.status)}`}>
                  {dados.requisicao.status}
                </Badge>
                {dados.requisicao.valor && (
                  <div className="text-xs text-gray-500 mt-1">
                    R$ {dados.requisicao.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                )}
              </div>
            )}

            {dados.requisicao && dados.sourcing && (
              <ArrowRight className="h-4 w-4 text-gray-400" />
            )}

            {/* Sourcing */}
            {dados.sourcing && (
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {getModuleIcon('sourcing')}
                  <span className="font-medium">Sourcing</span>
                </div>
                <div className="text-sm text-gray-600 mb-1">{dados.sourcing.numero}</div>
                <Badge className={`text-xs ${getStatusColor(dados.sourcing.status)}`}>
                  {dados.sourcing.status}
                </Badge>
              </div>
            )}

            {dados.sourcing && dados.pedido && (
              <ArrowRight className="h-4 w-4 text-gray-400" />
            )}

            {/* Pedido */}
            {dados.pedido && (
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {getModuleIcon('pedido')}
                  <span className="font-medium">Pedido</span>
                </div>
                <div className="text-sm text-gray-600 mb-1">{dados.pedido.numero}</div>
                <Badge className={`text-xs ${getStatusColor(dados.pedido.status)}`}>
                  {dados.pedido.status}
                </Badge>
                {dados.pedido.valor && (
                  <div className="text-xs text-gray-500 mt-1">
                    R$ {dados.pedido.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Histórico Detalhado */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Eventos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dados.historico.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhum evento registrado</p>
            ) : (
              dados.historico.map((evento) => (
                <div key={evento.id} className="flex items-start gap-4 p-3 border-l-2 border-blue-200 bg-gray-50 rounded-r">
                  <Clock className="h-4 w-4 text-blue-500 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{evento.evento}</span>
                      <Badge variant="outline" className="text-xs">
                        {evento.origem}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">{evento.descricao}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{new Date(evento.data).toLocaleString('pt-BR')}</span>
                      <span>Por: {evento.usuario}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
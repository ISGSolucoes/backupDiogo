import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  DollarSign
} from 'lucide-react';
import { useRequisicoes } from '@/hooks/useRequisicoes';
import { RastreabilidadeCompleta } from '@/components/shared/RastreabilidadeCompleta';

export const MonitorFluxoCompleto = () => {
  const { requisicoes } = useRequisicoes();
  const [requisicaoSelecionada, setRequisicaoSelecionada] = useState<string>('');
  const [filtroNumero, setFiltroNumero] = useState('');

  // Estatísticas do fluxo
  const stats = {
    total: requisicoes.length,
    para_sourcing: requisicoes.filter(r => r.status === 'aprovada' && r.valor_estimado >= 1000).length,
    para_3bids: requisicoes.filter(r => r.status === 'aprovada' && r.valor_estimado < 1000).length,
    em_cotacao: requisicoes.filter(r => r.status === 'em_cotacao').length,
    finalizadas: requisicoes.filter(r => r.status === 'finalizada').length
  };

  const requisicoesElegiveis = requisicoes.filter(req => 
    req.numero_requisicao.toLowerCase().includes(filtroNumero.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Estatísticas do Fluxo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-xs text-gray-500">Total Requisições</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.para_sourcing}</div>
            <div className="text-xs text-gray-500">Para Sourcing</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.para_3bids}</div>
            <div className="text-xs text-gray-500">3-Bids & Buy</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.em_cotacao}</div>
            <div className="text-xs text-gray-500">Em Cotação</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.finalizadas}</div>
            <div className="text-xs text-gray-500">Finalizadas</div>
          </CardContent>
        </Card>
      </div>

      {/* Seleção de Requisição */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Monitorar Fluxo Específico
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label>Buscar por Número da Requisição</Label>
              <Input 
                value={filtroNumero}
                onChange={(e) => setFiltroNumero(e.target.value)}
                placeholder="Ex: REQ-2025-000001"
              />
            </div>
          </div>

          {filtroNumero && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Requisições Encontradas:</h4>
              {requisicoesElegiveis.length === 0 ? (
                <p className="text-gray-500 text-sm">Nenhuma requisição encontrada</p>
              ) : (
                requisicoesElegiveis.map((req) => (
                  <div 
                    key={req.id}
                    className={`p-3 border rounded cursor-pointer transition-all ${
                      requisicaoSelecionada === req.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setRequisicaoSelecionada(req.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium">{req.numero_requisicao}</h5>
                        <p className="text-sm text-gray-600">{req.titulo}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className="text-xs">
                            {req.status}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            R$ {req.valor_estimado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant={requisicaoSelecionada === req.id ? "default" : "outline"}
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRequisicaoSelecionada(req.id);
                        }}
                      >
                        {requisicaoSelecionada === req.id ? 'Selecionada' : 'Selecionar'}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rastreabilidade */}
      {requisicaoSelecionada && (
        <RastreabilidadeCompleta requisicaoId={requisicaoSelecionada} />
      )}
    </div>
  );
};
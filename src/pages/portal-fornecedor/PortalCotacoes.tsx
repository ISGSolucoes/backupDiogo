
import React, { useState, useMemo } from 'react';
import { ArrowLeft, DollarSign, Calendar, Clock, CheckCircle, AlertCircle, Search, Filter, TrendingUp, Building2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { CotacoesStatsCards } from '@/components/portal-fornecedor/CotacoesStatsCards';

const PortalCotacoes = () => {
  const navigate = useNavigate();
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [ordenacao, setOrdenacao] = useState('mais_recentes');
  const [busca, setBusca] = useState('');

  const cotacoes = [
    {
      id: 'COT-2024-0089',
      cliente: 'Petrobras S.A.',
      titulo: 'Equipamentos de Perfuração Offshore',
      descricao: 'Solicitação de cotação para 15 equipamentos especializados para plataforma P-77.',
      valor: 'R$ 850.000',
      valorEstimado: 850000,
      recebidoEm: '25/05/2024',
      prazo: '28/05/2024',
      horasRestantes: 48,
      status: 'aguardando_resposta',
      urgente: true,
      cliente_logo: '🛢️',
      categoria: 'Equipamentos Industriais',
      itens: 15
    },
    {
      id: 'COT-2024-0078',
      cliente: 'Petrobras S.A.',
      titulo: 'Válvulas Industriais - PREMIADA! 🏆',
      descricao: 'Cotação para válvulas de alta pressão para refinaria.',
      valor: 'R$ 320.000',
      valorEstimado: 320000,
      recebidoEm: '20/05/2024',
      status: 'premiada',
      notaCliente: 'Parabéns! Sua cotação foi selecionada. Aguardando formalização do pedido.',
      cliente_logo: '🛢️',
      categoria: 'Válvulas',
      itens: 8,
      premiadaEm: '23/05/2024'
    },
    {
      id: 'COT-2024-0067',
      cliente: 'Vale S.A.',
      titulo: 'Peças para Equipamentos de Mineração',
      descricao: 'Cotação para peças de reposição para equipamentos de mineração em Carajás.',
      valor: 'R$ 125.000',
      valorEstimado: 125000,
      recebidoEm: '18/05/2024',
      status: 'respondida',
      respondidoEm: '19/05/2024',
      cliente_logo: '⛏️',
      categoria: 'Peças de Reposição',
      itens: 12
    },
    {
      id: 'COT-2024-0055',
      cliente: 'Embraer S.A.',
      titulo: 'Componentes Aeronáuticos Especiais',
      descricao: 'Solicitação para componentes certificados para aeronaves comerciais.',
      valor: 'R$ 480.000',
      valorEstimado: 480000,
      recebidoEm: '15/05/2024',
      prazo: '30/05/2024',
      horasRestantes: 120,
      status: 'aguardando_resposta',
      cliente_logo: '✈️',
      categoria: 'Aeronáutica',
      itens: 6,
      urgente: true
    },
    // Adicionando mais cotações para dados expressivos
    {
      id: 'COT-2024-0101',
      cliente: 'CSN',
      titulo: 'Equipamentos de Laminação',
      descricao: 'Cilindros e equipamentos para linha de laminação a frio.',
      valor: 'R$ 920.000',
      valorEstimado: 920000,
      recebidoEm: '29/05/2024',
      status: 'respondida',
      respondidoEm: '30/05/2024',
      cliente_logo: '🏭',
      categoria: 'Equipamentos Siderúrgicos',
      itens: 18
    },
    {
      id: 'COT-2024-0095',
      cliente: 'Gerdau',
      titulo: 'Refratários para Alto-Forno',
      descricao: 'Materiais refratários especiais para reforma de alto-forno.',
      valor: 'R$ 670.000',
      valorEstimado: 670000,
      recebidoEm: '27/05/2024',
      prazo: '10/06/2024',
      horasRestantes: 168,
      status: 'aguardando_resposta',
      cliente_logo: '🔥',
      categoria: 'Refratários',
      itens: 25
    },
    {
      id: 'COT-2024-0087',
      cliente: 'Braskem',
      titulo: 'Catalisadores Petroquímicos',
      descricao: 'Catalisadores para processo de craqueamento catalítico.',
      valor: 'R$ 1.200.000',
      valorEstimado: 1200000,
      recebidoEm: '25/05/2024',
      status: 'premiada',
      premiadaEm: '27/05/2024',
      notaCliente: 'Excelente proposta técnica e comercial. Parabéns pela cotação!',
      cliente_logo: '⚗️',
      categoria: 'Catalisadores',
      itens: 8
    },
    {
      id: 'COT-2024-0074',
      cliente: 'Suzano',
      titulo: 'Produtos Químicos Branqueamento',
      descricao: 'Reagentes para processo de branqueamento de celulose.',
      valor: 'R$ 340.000',
      valorEstimado: 340000,
      recebidoEm: '22/05/2024',
      status: 'respondida',
      respondidoEm: '24/05/2024',
      cliente_logo: '🌲',
      categoria: 'Produtos Químicos',
      itens: 12
    },
    {
      id: 'COT-2024-0061',
      cliente: 'WEG',
      titulo: 'Componentes para Motores',
      descricao: 'Bobinas e componentes elétricos para motores industriais.',
      valor: 'R$ 280.000',
      valorEstimado: 280000,
      recebidoEm: '19/05/2024',
      status: 'rejeitada',
      cliente_logo: '⚡',
      categoria: 'Componentes Elétricos',
      itens: 45
    }
  ];

  const getStatusBadge = (status: string) => {
    const configs = {
      aguardando_resposta: { variant: 'destructive' as const, label: 'Aguardando Resposta' },
      premiada: { variant: 'default' as const, label: 'Premiada' },
      respondida: { variant: 'secondary' as const, label: 'Respondida' },
      rejeitada: { variant: 'outline' as const, label: 'Rejeitada' }
    };
    return configs[status as keyof typeof configs] || { variant: 'secondary' as const, label: status };
  };

  const getStatusColor = (status: string) => {
    const colors = {
      aguardando_resposta: 'border-l-red-500',
      premiada: 'border-l-green-500',
      respondida: 'border-l-blue-500',
      rejeitada: 'border-l-gray-500'
    };
    return colors[status as keyof typeof colors] || 'border-l-gray-500';
  };

  // Lógica de filtragem e ordenação
  const cotacoesFiltradas = useMemo(() => {
    let resultado = cotacoes.filter(cotacao => {
      const matchStatus = filtroStatus === 'todos' || cotacao.status === filtroStatus;
      const matchBusca = busca === '' || 
        cotacao.titulo.toLowerCase().includes(busca.toLowerCase()) ||
        cotacao.cliente.toLowerCase().includes(busca.toLowerCase()) ||
        cotacao.categoria.toLowerCase().includes(busca.toLowerCase());
      return matchStatus && matchBusca;
    });

    // Ordenação
    resultado.sort((a, b) => {
      switch (ordenacao) {
        case 'mais_recentes':
          return new Date(b.recebidoEm.split('/').reverse().join('-')).getTime() - 
                 new Date(a.recebidoEm.split('/').reverse().join('-')).getTime();
        case 'maior_valor':
          return b.valorEstimado - a.valorEstimado;
        case 'menor_valor':
          return a.valorEstimado - b.valorEstimado;
        case 'prazo_urgente':
          return (a.horasRestantes || 999) - (b.horasRestantes || 999);
        default:
          return 0;
      }
    });

    return resultado;
  }, [cotacoes, filtroStatus, busca, ordenacao]);

  // Estatísticas
  const stats = useMemo(() => {
    const aguardando = cotacoes.filter(c => c.status === 'aguardando_resposta').length;
    const premiadas = cotacoes.filter(c => c.status === 'premiada').length;
    const valorTotal = cotacoes.reduce((acc, c) => acc + c.valorEstimado, 0);
    const urgentes = cotacoes.filter(c => c.urgente).length;
    
    return { aguardando, premiadas, valorTotal, urgentes };
  }, [cotacoes]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="w-full px-4 lg:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/portal-fornecedor")}
                className="gap-2 text-gray-600 hover:text-blue-600"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar ao Portal
              </Button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="text-xl font-bold text-blue-900">🔗 SourceXpress Portal</div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-gray-700 font-medium">TechSupply Solutions</span>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                TS
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Header da página */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <DollarSign className="h-10 w-10" />
          <div>
            <h1 className="text-3xl font-bold">Minhas Cotações</h1>
            <p className="opacity-90">Gerencie as cotações recebidas dos seus clientes</p>
          </div>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <CotacoesStatsCards 
        cotacoes={cotacoes}
        onFilterChange={setFiltroStatus}
        filtroAtivo={filtroStatus}
      />

      {/* Filtros e Busca */}
      <div className="py-6 px-4 lg:px-6 border-b bg-white shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Buscar por título, cliente ou categoria..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10 border-gray-200 focus:border-blue-500"
            />
          </div>
          
          <Select value={ordenacao} onValueChange={setOrdenacao}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Ordenar por..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mais_recentes">Mais Recentes</SelectItem>
              <SelectItem value="maior_valor">Maior Valor</SelectItem>
              <SelectItem value="menor_valor">Menor Valor</SelectItem>
              <SelectItem value="prazo_urgente">Prazo Urgente</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button
              variant={filtroStatus === 'todos' ? 'default' : 'outline'}
              onClick={() => setFiltroStatus('todos')}
              size="sm"
            >
              Todas ({cotacoes.length})
            </Button>
            <Button
              variant={filtroStatus === 'respondida' ? 'default' : 'outline'}
              onClick={() => setFiltroStatus('respondida')}
              size="sm"
              className={filtroStatus === 'respondida' ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              Respondidas ({cotacoes.filter(c => c.status === 'respondida').length})
            </Button>
            <Button
              variant={filtroStatus === 'aguardando_resposta' ? 'destructive' : 'outline'}
              onClick={() => setFiltroStatus('aguardando_resposta')}
              size="sm"
            >
              Pendentes ({stats.aguardando})
            </Button>
            <Button
              variant={filtroStatus === 'premiada' ? 'default' : 'outline'}
              onClick={() => setFiltroStatus('premiada')}
              size="sm"
              className={filtroStatus === 'premiada' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
            >
              Premiadas ({stats.premiadas})
            </Button>
            <Button
              variant={filtroStatus === 'rejeitada' ? 'outline' : 'outline'}
              onClick={() => setFiltroStatus('rejeitada')}
              size="sm"
              className={filtroStatus === 'rejeitada' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}
            >
              Recusadas ({cotacoes.filter(c => c.status === 'rejeitada').length})
            </Button>
          </div>
        </div>
      </div>

      {/* Lista de Cotações */}
      <div className="py-6 px-4 lg:px-6 bg-gray-50">
        {cotacoesFiltradas.length === 0 ? (
          <div className="text-center py-16">
            <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhuma cotação encontrada</h3>
            <p className="text-gray-500">
              {busca ? 'Tente ajustar os filtros de busca' : 'Não há cotações para os filtros selecionados'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {cotacoesFiltradas.map((cotacao) => {
              const statusConfig = getStatusBadge(cotacao.status);
              const isUrgent = cotacao.horasRestantes && cotacao.horasRestantes <= 72;
              
              return (
                <div 
                  key={cotacao.id} 
                  className={`bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border-l-4 ${getStatusColor(cotacao.status)}`}
                >
                  {/* Header da cotação */}
                  <div className="p-6 pb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-4 flex-1">
                        <span className="text-3xl">{cotacao.cliente_logo}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{cotacao.titulo}</h3>
                            {cotacao.status === 'premiada' && (
                              <span className="text-lg">🏆</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <Building2 className="w-4 h-4" />
                            <span className="font-medium">{cotacao.cliente}</span>
                            <span className="text-gray-400">•</span>
                            <span>#{cotacao.id}</span>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{cotacao.descricao}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2 ml-4">
                        <Badge variant={statusConfig.variant} className="text-sm px-3 py-1">
                          {statusConfig.label}
                        </Badge>
                        {cotacao.urgente && (
                          <Badge variant="destructive" className="text-xs animate-pulse">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Urgente
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Nota do cliente para premiadas */}
                  {cotacao.notaCliente && (
                    <div className="mx-6 mb-4">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          <div>
                            <p className="text-green-800 text-sm font-semibold mb-1">Nota do Cliente:</p>
                            <p className="text-green-700 text-sm">{cotacao.notaCliente}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Dados principais */}
                  <div className="px-6 pb-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Valor */}
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-900">Valor Estimado</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-900">{cotacao.valor}</div>
                      </div>
                      
                      {/* Detalhes */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Package className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">Detalhes</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <div className="font-semibold">{cotacao.categoria}</div>
                          <div>{cotacao.itens} itens</div>
                        </div>
                      </div>

                      {/* Cronograma */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">Recebido: <strong>{cotacao.recebidoEm}</strong></span>
                        </div>
                        
                        {cotacao.prazo && (
                          <div className={`flex items-center gap-2 text-sm ${
                            isUrgent ? 'text-red-600' : 'text-yellow-600'
                          }`}>
                            <Clock className="w-4 h-4" />
                            <span>Prazo: <strong>{cotacao.prazo}</strong></span>
                            {cotacao.horasRestantes && (
                              <span className="text-xs">({cotacao.horasRestantes}h)</span>
                            )}
                          </div>
                        )}
                        
                        {cotacao.respondidoEm && (
                          <div className="flex items-center gap-2 text-sm text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span>Respondido: <strong>{cotacao.respondidoEm}</strong></span>
                          </div>
                        )}
                        
                        {cotacao.premiadaEm && (
                          <div className="flex items-center gap-2 text-sm text-yellow-600">
                            <TrendingUp className="w-4 h-4" />
                            <span>Premiada: <strong>{cotacao.premiadaEm}</strong></span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex gap-3 mt-6">
                      {cotacao.status === 'aguardando_resposta' && (
                        <>
                          <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            📝 Responder Cotação
                          </Button>
                          <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                            💬 Solicitar Esclarecimentos
                          </Button>
                        </>
                      )}
                      {cotacao.status === 'premiada' && (
                        <>
                          <Button className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                            🏆 Ver Detalhes da Premiação
                          </Button>
                          <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
                            📄 Gerar Proposta
                          </Button>
                        </>
                      )}
                      {cotacao.status === 'respondida' && (
                        <Button variant="outline" className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50">
                          👁️ Ver Minha Resposta
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortalCotacoes;

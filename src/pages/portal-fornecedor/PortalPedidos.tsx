import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowLeft, Package, Calendar, MapPin, CheckCircle, Clock, Truck, Search, Building2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PedidosStatsCards } from '@/components/portal-fornecedor/PedidosStatsCards';
import { useNavigate } from 'react-router-dom';
import { isDocumentoNovo, diasDesdeRecebimento } from '@/utils/documentoUtils';

const PortalPedidos = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [ordenacao, setOrdenacao] = useState('mais_recentes');
  const [busca, setBusca] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const statusParam = searchParams.get('status');
    
    if (statusParam) {
      const statusMap = {
        'novo': 'aguardando_confirmacao',
        'pendente': 'aguardando_confirmacao'
      };
      
      setFiltroStatus(statusMap[statusParam as keyof typeof statusMap] || statusParam);
    }
  }, [location.search]);

  // Updated pedidos data with varied dates for testing the time-based logic
  const pedidos = [
    {
      id: 'PED-2024-0287',
      cliente: 'Petrobras S.A.',
      titulo: 'Materiais para Refinaria de Paulínia',
      descricao: 'Pedido confirmado de materiais para manutenção programada da refinaria.',
      valor: 'R$ 125.000',
      valorEstimado: 125000,
      recebidoEm: '23/05/2024',
      dataEntrega: '15/06/2024',
      local: 'Paulínia/SP',
      status: 'confirmado',
      cliente_logo: '🛢️',
      categoria: 'Materiais Industriais',
      itens: 45,
      urgente: false
    },
    {
      id: 'PED-2024-0256',
      cliente: 'Vale S.A.',
      titulo: 'Equipamentos de Segurança',
      descricao: 'Pedido de equipamentos de proteção individual para operações de mineração.',
      valor: 'R$ 85.000',
      valorEstimado: 85000,
      recebidoEm: '20/05/2024',
      dataEntrega: '10/06/2024',
      local: 'Carajás/PA',
      status: 'confirmado',
      confirmadoEm: '21/05/2024',
      cliente_logo: '⛏️',
      categoria: 'Equipamentos de Segurança',
      itens: 120
    },
    // New orders with recent dates (should be "novo")
    {
      id: 'PED-2024-0320',
      cliente: 'JBS S.A.',
      titulo: 'Equipamentos para Frigorífico',
      descricao: 'Sistema de refrigeração e equipamentos para nova unidade processamento.',
      valor: 'R$ 180.000',
      valorEstimado: 180000,
      recebidoEm: new Date().toLocaleDateString('pt-BR'), // Today - should be "novo"
      dataEntrega: '30/06/2024',
      local: 'Dourados/MS',
      status: 'aguardando_confirmacao',
      cliente_logo: '🥩',
      categoria: 'Equipamentos Refrigeração',
      itens: 18,
      urgente: true
    },
    {
      id: 'PED-2024-0321',
      cliente: 'Ambev',
      titulo: 'Equipamentos de Envase',
      descricao: 'Novo pedido de equipamentos para linha de envase de bebidas.',
      valor: 'R$ 320.000',
      valorEstimado: 320000,
      recebidoEm: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'), // Yesterday - should be "novo"
      dataEntrega: '15/07/2024',
      local: 'Guarulhos/SP',
      status: 'aguardando_confirmacao',
      cliente_logo: '🍺',
      categoria: 'Equipamentos Industriais',
      itens: 25,
      urgente: false
    },
    {
      id: 'PED-2024-0322',
      cliente: 'Gerdau',
      titulo: 'Estruturas Metálicas',
      descricao: 'Pedido de estruturas metálicas especiais.',
      valor: 'R$ 520.000',
      valorEstimado: 520000,
      recebidoEm: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'), // 2 days ago - should be "novo"
      dataEntrega: '20/07/2024',
      local: 'Belo Horizonte/MG',
      status: 'aguardando_confirmacao',
      cliente_logo: '🏗️',
      categoria: 'Estruturas Metálicas',
      itens: 42,
      urgente: true
    },
    // Orders older than 3 days (should be "pendente")
    {
      id: 'PED-2024-0298',
      cliente: 'WEG',
      titulo: 'Motores Elétricos Industriais',
      descricao: 'Motores de alta eficiência para automação industrial.',
      valor: 'R$ 220.000',
      valorEstimado: 220000,
      recebidoEm: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'), // 4 days ago - should be "pendente"
      dataEntrega: '20/06/2024',
      local: 'Jaraguá do Sul/SC',
      status: 'aguardando_confirmacao',
      cliente_logo: '⚡',
      categoria: 'Motores Elétricos',
      itens: 56,
      urgente: true
    },
    {
      id: 'PED-2024-0295',
      cliente: 'Suzano',
      titulo: 'Equipamentos de Celulose',
      descricao: 'Digestores e equipamentos para processamento de celulose.',
      valor: 'R$ 380.000',
      valorEstimado: 380000,
      recebidoEm: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'), // 5 days ago - should be "pendente"
      dataEntrega: '25/06/2024',
      local: 'Suzano/SP',
      status: 'aguardando_confirmacao',
      cliente_logo: '🌲',
      categoria: 'Equipamentos Celulose',
      itens: 34,
      urgente: false
    },
    {
      id: 'PED-2024-0234',
      cliente: 'Embraer S.A.',
      titulo: 'Componentes Aeronáuticos',
      descricao: 'Pedido de componentes especializados para linha de montagem de aeronaves.',
      valor: 'R$ 340.000',
      valorEstimado: 340000,
      recebidoEm: '15/05/2024',
      dataEntrega: '30/05/2024',
      local: 'São José dos Campos/SP',
      status: 'entregue',
      entregueEm: '28/05/2024',
      cliente_logo: '✈️',
      categoria: 'Componentes Aeronáuticos',
      itens: 15
    },
    {
      id: 'PED-2024-0198',
      cliente: 'Petrobras S.A.',
      titulo: 'Válvulas e Conexões Offshore',
      descricao: 'Pedido para plataforma marítima P-74 com especificações técnicas rigorosas.',
      valor: 'R$ 280.000',
      valorEstimado: 280000,
      recebidoEm: '10/05/2024',
      dataEntrega: '25/06/2024',
      local: 'Macaé/RJ',
      status: 'em_producao',
      cliente_logo: '🛢️',
      categoria: 'Válvulas Industriais',
      itens: 32
    },
    {
      id: 'PED-2024-0301',
      cliente: 'CSN',
      titulo: 'Peças de Reposição para Alto-Forno',
      descricao: 'Componentes críticos para manutenção preventiva do alto-forno 2.',
      valor: 'R$ 450.000',
      valorEstimado: 450000,
      recebidoEm: '25/05/2024',
      dataEntrega: '20/07/2024',
      local: 'Volta Redonda/RJ',
      status: 'questionado',
      cliente_logo: '🏭',
      categoria: 'Peças Industriais',
      itens: 28
    }
  ];

  const pedidosFiltrados = useMemo(() => {
    let resultado = pedidos.filter(pedido => {
      const matchStatus = filtroStatus === 'todos' || pedido.status === filtroStatus;
      const matchBusca = busca === '' || 
        pedido.titulo.toLowerCase().includes(busca.toLowerCase()) ||
        pedido.cliente.toLowerCase().includes(busca.toLowerCase()) ||
        pedido.categoria.toLowerCase().includes(busca.toLowerCase());
      
      // Apply time-based filtering for "novo" and "pendente"
      const searchParams = new URLSearchParams(location.search);
      const statusParam = searchParams.get('status');
      
      if (statusParam === 'novo' && pedido.status === 'aguardando_confirmacao') {
        return matchBusca && isDocumentoNovo('pedido', pedido.recebidoEm);
      }
      if (statusParam === 'pendente' && pedido.status === 'aguardando_confirmacao') {
        return matchBusca && !isDocumentoNovo('pedido', pedido.recebidoEm);
      }
      
      return matchStatus && matchBusca;
    });

    resultado.sort((a, b) => {
      switch (ordenacao) {
        case 'mais_recentes':
          return new Date(b.recebidoEm.split('/').reverse().join('-')).getTime() - 
                 new Date(a.recebidoEm.split('/').reverse().join('-')).getTime();
        case 'maior_valor':
          return b.valorEstimado - a.valorEstimado;
        case 'menor_valor':
          return a.valorEstimado - b.valorEstimado;
        case 'prazo_entrega':
          return new Date(a.dataEntrega.split('/').reverse().join('-')).getTime() - 
                 new Date(b.dataEntrega.split('/').reverse().join('-')).getTime();
        default:
          return 0;
      }
    });

    return resultado;
  }, [pedidos, filtroStatus, busca, ordenacao, location.search]);

  const stats = useMemo(() => {
    const aguardando = pedidos.filter(p => p.status === 'aguardando_confirmacao').length;
    const entregues = pedidos.filter(p => p.status === 'entregue').length;
    const valorTotal = pedidos.reduce((acc, p) => acc + p.valorEstimado, 0);
    
    return { aguardando, entregues, valorTotal };
  }, [pedidos]);

  const getStatusBadge = (status: string) => {
    const configs = {
      aguardando_confirmacao: { variant: 'destructive' as const, label: 'Aguardando Confirmação' },
      confirmado: { variant: 'default' as const, label: 'Confirmado' },
      em_producao: { variant: 'secondary' as const, label: 'Em Produção' },
      pronto_entrega: { variant: 'outline' as const, label: 'Pronto para Entrega' },
      entregue: { variant: 'default' as const, label: 'Entregue' },
      questionado: { variant: 'destructive' as const, label: 'Questionado' },
      rejeitado: { variant: 'destructive' as const, label: 'Rejeitado' }
    };
    return configs[status as keyof typeof configs] || { variant: 'secondary' as const, label: status };
  };

  const getStatusColor = (status: string) => {
    const colors = {
      aguardando_confirmacao: 'border-l-red-500',
      confirmado: 'border-l-blue-500',
      em_producao: 'border-l-yellow-500',
      pronto_entrega: 'border-l-purple-500',
      entregue: 'border-l-green-500',
      questionado: 'border-l-orange-500',
      rejeitado: 'border-l-red-600'
    };
    return colors[status as keyof typeof colors] || 'border-l-gray-500';
  };

  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 px-4 lg:px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-4">
            <Package className="h-10 w-10" />
            <div>
              <h1 className="text-3xl font-bold">Meus Pedidos</h1>
              <p className="opacity-90">Gerencie os pedidos recebidos dos seus clientes</p>
            </div>
          </div>
          
          <div className="flex gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(stats.valorTotal)}
              </div>
              <div className="text-sm opacity-80">Valor Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-200">{stats.entregues}</div>
              <div className="text-sm opacity-80">Entregues</div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-6 px-4 lg:px-6">
        <PedidosStatsCards 
          pedidos={pedidos} 
          onFilterChange={setFiltroStatus}
          filtroStatus={filtroStatus}
        />
      </div>

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
              <SelectItem value="prazo_entrega">Prazo de Entrega</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button
              variant={filtroStatus === 'todos' ? 'default' : 'outline'}
              onClick={() => setFiltroStatus('todos')}
              size="sm"
            >
              Todos
            </Button>
            <Button
              variant={filtroStatus === 'aguardando_confirmacao' ? 'destructive' : 'outline'}
              onClick={() => setFiltroStatus('aguardando_confirmacao')}
              size="sm"
            >
              Aguardando
            </Button>
            <Button
              variant={filtroStatus === 'confirmado' ? 'default' : 'outline'}
              onClick={() => setFiltroStatus('confirmado')}
              size="sm"
            >
              Confirmados
            </Button>
            <Button
              variant={filtroStatus === 'entregue' ? 'default' : 'outline'}
              onClick={() => setFiltroStatus('entregue')}
              size="sm"
              className={filtroStatus === 'entregue' ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              Entregues
            </Button>
          </div>
        </div>
      </div>

      <div className="py-6 px-4 lg:px-6 bg-gray-50">
        {pedidosFiltrados.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum pedido encontrado</h3>
            <p className="text-gray-500">
              {busca ? 'Tente ajustar os filtros de busca' : 'Não há pedidos para os filtros selecionados'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pedidosFiltrados.map((pedido) => {
              const statusConfig = getStatusBadge(pedido.status);
              const isNovo = pedido.status === 'aguardando_confirmacao' && isDocumentoNovo('pedido', pedido.recebidoEm);
              const diasRecebimento = diasDesdeRecebimento(pedido.recebidoEm);
              
              return (
                <div 
                  key={pedido.id} 
                  className={`bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border-l-4 ${getStatusColor(pedido.status)}`}
                >
                  <div className="p-6 pb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-4 flex-1">
                        <span className="text-3xl">{pedido.cliente_logo}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{pedido.titulo}</h3>
                            {pedido.urgente && (
                              <AlertTriangle className="w-5 h-5 text-red-500" />
                            )}
                            {isNovo && (
                              <Badge className="bg-green-100 text-green-800 text-xs">NOVO</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <Building2 className="w-4 h-4" />
                            <span className="font-medium">{pedido.cliente}</span>
                            <span className="text-gray-400">•</span>
                            <span>#{pedido.id}</span>
                            <span className="text-gray-400">•</span>
                            <span>Há {diasRecebimento} dias</span>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{pedido.descricao}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2 ml-4">
                        <Badge variant={statusConfig.variant} className="text-sm px-3 py-1">
                          {statusConfig.label}
                        </Badge>
                        {pedido.urgente && (
                          <Badge variant="destructive" className="text-xs animate-pulse">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Urgente
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="px-6 pb-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Package className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-900">Valor do Pedido</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-900">{pedido.valor}</div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Package className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">Detalhes</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <div className="font-semibold">{pedido.categoria}</div>
                          <div>{pedido.itens} itens</div>
                        </div>
                      </div>

                      <div className="bg-purple-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium text-purple-900">Local de Entrega</span>
                        </div>
                        <div className="text-sm font-semibold text-purple-900">{pedido.local}</div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">Recebido: <strong>{pedido.recebidoEm}</strong></span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-orange-600">
                          <Clock className="w-4 h-4" />
                          <span>Entrega: <strong>{pedido.dataEntrega}</strong></span>
                        </div>
                        
                        {pedido.confirmadoEm && (
                          <div className="flex items-center gap-2 text-sm text-blue-600">
                            <CheckCircle className="w-4 h-4" />
                            <span>Confirmado: <strong>{pedido.confirmadoEm}</strong></span>
                          </div>
                        )}
                        
                        {pedido.entregueEm && (
                          <div className="flex items-center gap-2 text-sm text-green-600">
                            <Truck className="w-4 h-4" />
                            <span>Entregue: <strong>{pedido.entregueEm}</strong></span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      {pedido.status === 'aguardando_confirmacao' && (
                        <>
                          <Button className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                            ✅ Confirmar Pedido
                          </Button>
                          <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                            📝 Solicitar Alteração
                          </Button>
                        </>
                      )}
                      {pedido.status === 'confirmado' && (
                        <>
                          <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            🔄 Atualizar Status
                          </Button>
                          <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                            👁️ Ver Detalhes
                          </Button>
                        </>
                      )}
                      {pedido.status === 'entregue' && (
                        <Button variant="outline" className="flex-1 border-green-200 text-green-700 hover:bg-green-50">
                          📄 Ver Comprovante de Entrega
                        </Button>
                      )}
                      {pedido.status === 'em_producao' && (
                        <>
                          <Button className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700">
                            🏭 Atualizar Produção
                          </Button>
                          <Button variant="outline" className="border-yellow-200 text-yellow-700 hover:bg-yellow-50">
                            📞 Contatar Cliente
                          </Button>
                        </>
                      )}
                      {pedido.status === 'questionado' && (
                        <>
                          <Button className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                            💬 Responder Questionamentos
                          </Button>
                          <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                            📞 Contatar Cliente
                          </Button>
                        </>
                      )}
                      {pedido.status === 'rejeitado' && (
                        <Button variant="outline" className="flex-1 border-red-200 text-red-700 hover:bg-red-50">
                          📄 Ver Motivo da Rejeição
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

export default PortalPedidos;

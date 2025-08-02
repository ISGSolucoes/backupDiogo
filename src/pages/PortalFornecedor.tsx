import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bell, Search, Filter, Brain, UserPlus, ExternalLink, ShoppingCart, FileText, Award, Package, TrendingUp } from 'lucide-react';
import { ClienteExpandivel } from '@/components/portal-fornecedor/ClienteExpandivel';
import { PortalFornecedorStatsCards } from '@/components/portal-fornecedor/PortalFornecedorStatsCards';
import { AlertasPortalFornecedor } from '@/components/portal-fornecedor/AlertasPortalFornecedor';
import { DadosFornecedor, ClientePortal, DocumentoTransacao } from '@/types/portal-fornecedor';
import { clientesData } from '@/data/clientesData';

const PortalFornecedor = () => {
  const navigate = useNavigate();
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroCliente, setFiltroCliente] = useState('todos');

  // Dados do fornecedor principal
  const dadosFornecedor: DadosFornecedor = {
    id: 'FORN-001',
    razaoSocial: 'TechSupply Solutions Ltda',
    nomeFantasia: 'TechSupply',
    cnpj: '12.345.678/0001-90',
    responsavelPrincipal: 'Carlos Silva',
    email: 'contato@techsupply.com.br',
    telefone: '(11) 99999-9999',
    endereco: 'Rua das Empresas, 123',
    cidade: 'São Paulo',
    uf: 'SP',
    scoreGeral: 9.2,
    clientesAtivos: 4,
    documentosPendentes: 35,
    volumeMensalTotal: 'R$ 8.5M',
    categoriaFornecedor: 'Equipamentos Industriais',
    certificacoes: ['ISO 9001', 'ISO 14001'],
    statusPortal: 'ativo'
  };

  // Usar dados dos clientes do arquivo separado
  const clientes: ClientePortal[] = clientesData;

  // Função para calcular totais de status específicos com valores expressivos GARANTIDOS
  const calcularStatusTotals = (tipoFiltro: string, clientesFiltrados: ClientePortal[]) => {
    const statusTotals: { [key: string]: number } = {};
    
    // Calcular baseado nos documentos existentes
    clientesFiltrados.forEach(cliente => {
      cliente.documentos.forEach(doc => {
        if (tipoFiltro === 'todos' || doc.tipo === tipoFiltro || 
            (tipoFiltro === 'cotacoes' && doc.tipo === 'cotacao') ||
            (tipoFiltro === 'pedidos' && doc.tipo === 'pedido') ||
            (tipoFiltro === 'contratos' && doc.tipo === 'contrato') ||
            (tipoFiltro === 'qualificacoes' && doc.tipo === 'qualificacao') ||
            (tipoFiltro === 'avaliacoes' && doc.tipo === 'avaliacao')) {
          statusTotals[doc.status] = (statusTotals[doc.status] || 0) + 1;
        }
      });
    });

    // SEMPRE adicionar valores expressivos baseados no tipo filtrado
    if (tipoFiltro === 'cotacoes' || tipoFiltro === 'cotacao') {
      statusTotals['pendente'] = (statusTotals['pendente'] || 0) + 28;
      statusTotals['respondida'] = (statusTotals['respondida'] || 0) + 47;
      statusTotals['premiada'] = (statusTotals['premiada'] || 0) + 22;
      statusTotals['respondendo'] = (statusTotals['respondendo'] || 0) + 8;
      statusTotals['rascunho'] = (statusTotals['rascunho'] || 0) + 3;
      statusTotals['vencida'] = (statusTotals['vencida'] || 0) + 14;
    } else if (tipoFiltro === 'pedidos' || tipoFiltro === 'pedido') {
      statusTotals['pendente'] = (statusTotals['pendente'] || 0) + 35;
      statusTotals['confirmado'] = (statusTotals['confirmado'] || 0) + 89;
      statusTotals['parcialmente_confirmado'] = (statusTotals['parcialmente_confirmado'] || 0) + 12;
      statusTotals['recusado'] = (statusTotals['recusado'] || 0) + 6;
      statusTotals['enviado'] = (statusTotals['enviado'] || 0) + 45;
      statusTotals['entregue'] = (statusTotals['entregue'] || 0) + 156;
    } else if (tipoFiltro === 'contratos' || tipoFiltro === 'contrato') {
      statusTotals['pendente'] = (statusTotals['pendente'] || 0) + 18;
      statusTotals['assinado'] = (statusTotals['assinado'] || 0) + 28;
      statusTotals['em_negociacao'] = (statusTotals['em_negociacao'] || 0) + 7;
      statusTotals['renovado'] = (statusTotals['renovado'] || 0) + 15;
      statusTotals['cancelado'] = (statusTotals['cancelado'] || 0) + 4;
    } else if (tipoFiltro === 'qualificacoes' || tipoFiltro === 'qualificacao') {
      statusTotals['pendente'] = (statusTotals['pendente'] || 0) + 22;
      statusTotals['qualificado'] = (statusTotals['qualificado'] || 0) + 18;
      statusTotals['desqualificado'] = (statusTotals['desqualificado'] || 0) + 3;
      statusTotals['em_processo'] = (statusTotals['em_processo'] || 0) + 9;
      statusTotals['documentacao_pendente'] = (statusTotals['documentacao_pendente'] || 0) + 5;
    } else if (tipoFiltro === 'avaliacoes' || tipoFiltro === 'avaliacao') {
      statusTotals['pendente'] = (statusTotals['pendente'] || 0) + 15;
      statusTotals['concluida'] = (statusTotals['concluida'] || 0) + 34;
      statusTotals['em_andamento'] = (statusTotals['em_andamento'] || 0) + 11;
      statusTotals['agendada'] = (statusTotals['agendada'] || 0) + 7;
      statusTotals['aprovada'] = (statusTotals['aprovada'] || 0) + 28;
    } else {
      // Para "todos" - adicionar valores base para status genéricos
      statusTotals['pendente'] = (statusTotals['pendente'] || 0) + 65;
      statusTotals['respondido'] = (statusTotals['respondido'] || 0) + 125;
      statusTotals['aprovado'] = (statusTotals['aprovado'] || 0) + 98;
      statusTotals['rejeitado'] = (statusTotals['rejeitado'] || 0) + 18;
      statusTotals['em_analise'] = (statusTotals['em_analise'] || 0) + 42;
    }

    return statusTotals;
  };

  // Calcular totais globais consolidados por tipo com valores expressivos
  const totaisGlobais = clientes.reduce((acc, cliente) => ({
    totalNovos: acc.totalNovos + cliente.documentos.filter(doc => doc.status === 'pendente').length,
    totalPedidos: acc.totalPedidos + cliente.estatisticas.pedidos.total,
    totalCotacoes: acc.totalCotacoes + cliente.estatisticas.cotacoes.total,
    totalContratos: acc.totalContratos + cliente.estatisticas.contratos.total,
    totalQualificacoes: acc.totalQualificacoes + cliente.estatisticas.qualificacoes.total,
    totalAvaliacoes: acc.totalAvaliacoes + cliente.estatisticas.avaliacoes.total,
    clientesAtivos: acc.clientesAtivos + (cliente.status === 'ativo' ? 1 : 0)
  }), { 
    totalNovos: 15,        // Documentos novos expressivos
    totalPedidos: 145,     // Pedidos expressivos
    totalCotacoes: 78,     // Cotações expressivas
    totalContratos: 23,    // Contratos expressivos
    totalQualificacoes: 18, // Qualificações expressivas
    totalAvaliacoes: 25,   // Avaliações expressivas
    clientesAtivos: 0 
  });

  const handleDocumentoClick = (documento: DocumentoTransacao) => {
    navigate(`/portal-fornecedor/documento/${documento.id}`);
  };

  const handleAcaoClick = (acao: string, documentoId: string) => {
    console.log(`Executando ação: ${acao} para documento: ${documentoId}`);
    // Implementar lógica específica para cada ação
  };

  const handleNavigateFromAlert = (tipo: string, clienteId?: string, filtro?: string) => {
    const statusParam = filtro ? `?status=${filtro}` : '';
    
    switch (tipo) {
      case 'urgente':
        // Navega para pedidos com filtro de urgentes
        navigate(`/portal-fornecedor/pedidos${statusParam || '?status=urgente'}`);
        break;
      case 'pedido':
        // Navega para página específica de pedidos
        navigate(`/portal-fornecedor/pedidos${statusParam || '?status=pendente'}`);
        break;
      case 'cotacao':
        // Navega para página específica de cotações
        navigate(`/portal-fornecedor/cotacoes${statusParam || '?status=pendente'}`);
        break;
      case 'qualificacao':
        // Navega para página específica de qualificações
        navigate(`/portal-fornecedor/qualificacoes${statusParam || '?status=pendente'}`);
        break;
      case 'sistema':
        // Navega para página de novidades (pode ser criada posteriormente)
        console.log('Navegar para novidades do sistema');
        break;
      default:
        // Para outros tipos, navega para dashboard geral com filtro
        setFiltroTipo(tipo);
        if (clienteId) {
          setFiltroCliente(clienteId);
        }
        break;
    }
  };

  const handleClienteCardStatClick = (tipo: string, status?: string, clienteId?: string) => {
    if (clienteId) {
      setFiltroCliente(clienteId);
    }
    
    switch (tipo) {
      case 'cotacao':
        navigate('/portal-fornecedor/cotacoes?status=pendente');
        break;
      case 'pedido':
        navigate('/portal-fornecedor/pedidos?status=pendente');
        break;
      case 'contrato':
        navigate('/portal-fornecedor/contratos?status=pendente');
        break;
      case 'qualificacao':
        navigate('/portal-fornecedor/qualificacoes?status=pendente');
        break;
      default:
        break;
    }
  };

  const clientesFiltrados = clientes.filter(cliente => {
    const matchBusca = cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
                      cliente.cnpj.includes(busca) ||
                      cliente.codigo.toLowerCase().includes(busca.toLowerCase());
    
    const matchCliente = filtroCliente === 'todos' || cliente.id === filtroCliente;
    
    return matchBusca && matchCliente;
  });

  // Filtrar totais quando cliente específico for selecionado
  const totaisFiltrados = filtroCliente === 'todos' 
    ? {
        ...totaisGlobais,
        statusTotals: calcularStatusTotals(filtroTipo, clientesFiltrados)
      }
    : clientes
        .filter(cliente => cliente.id === filtroCliente)
        .reduce((acc, cliente) => ({
          totalNovos: acc.totalNovos + cliente.documentos.filter(doc => doc.status === 'pendente').length,
          totalPedidos: acc.totalPedidos + cliente.estatisticas.pedidos.total,
          totalCotacoes: acc.totalCotacoes + cliente.estatisticas.cotacoes.total,
          totalContratos: acc.totalContratos + cliente.estatisticas.contratos.total,
          totalQualificacoes: acc.totalQualificacoes + cliente.estatisticas.qualificacoes.total,
          totalAvaliacoes: acc.totalAvaliacoes + cliente.estatisticas.avaliacoes.total,
          clientesAtivos: acc.clientesAtivos + (cliente.status === 'ativo' ? 1 : 0),
          statusTotals: calcularStatusTotals(filtroTipo, [cliente])
        }), { 
          totalNovos: 0,
          totalPedidos: 0, 
          totalCotacoes: 0, 
          totalContratos: 0, 
          totalQualificacoes: 0, 
          totalAvaliacoes: 0, 
          clientesAtivos: 0,
          statusTotals: {}
        });

  const handleCardClick = (filtro: string) => {
    // Se estamos visualizando um tipo específico (cotacoes, pedidos, etc.) 
    // e clicamos em um status, manter o contexto e não navegar
    if (filtroTipo !== 'todos') {
      // Verificar se é um status específico do tipo atual
      const isStatusClick = !['pedido', 'cotacao', 'contrato', 'qualificacao', 'novos'].includes(filtro);
      
      if (isStatusClick) {
        // Para status específicos, manter na mesma página mas poderia implementar
        // filtro adicional por status se necessário no futuro
        console.log(`Filtrar por status: ${filtro} dentro de ${filtroTipo}`);
        return;
      }
    }
    
    // Para cards de tipo geral (quando filtroTipo = 'todos'), navegar para páginas específicas
    switch (filtro) {
      case 'pedido':
        navigate('/portal-fornecedor/pedidos');
        break;
      case 'cotacao':
        navigate('/portal-fornecedor/cotacoes');
        break;
      case 'contrato':
        navigate('/portal-fornecedor/contratos');
        break;
      case 'qualificacao':
        navigate('/portal-fornecedor/qualificacoes');
        break;
      case 'novos':
        setFiltroTipo('todos');
        break;
      default:
        // Para filtros de tipo, atualizar o filtroTipo
        setFiltroTipo(filtro);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header fixo */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="text-2xl font-bold text-white">📄 Meu Portal de Negócios</div>
            </div>
            <div className="flex items-center space-x-4">
              <Bell className="w-6 h-6 text-white" />
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-white font-medium">{dadosFornecedor.nomeFantasia}</div>
                  <div className="text-white/80 text-sm">CNPJ: {dadosFornecedor.cnpj}</div>
                </div>
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-bold">
                  {dadosFornecedor.nomeFantasia.charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section com informações do fornecedor */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="text-white">
                <h1 className="text-4xl font-bold mb-2">Portal do Fornecedor</h1>
                <p className="text-white/90">
                  {dadosFornecedor.razaoSocial}<br />
                  <span className="text-sm">
                    Gerenciando {dadosFornecedor.clientesAtivos} clientes ativos • 
                    Score geral: {dadosFornecedor.scoreGeral}/10 • 
                    Status: {dadosFornecedor.statusPortal}
                  </span>
                </p>
              </div>
              
              <div className="flex items-center gap-8">
                <div className="text-center text-white">
                  <div className="text-3xl font-bold">{totaisGlobais.totalPedidos}</div>
                  <div className="text-white/80 text-sm">Pedidos</div>
                </div>
                <div className="text-center text-white">
                  <div className="text-3xl font-bold">{totaisGlobais.clientesAtivos}</div>
                  <div className="text-white/80 text-sm">Clientes Ativos</div>
                </div>
                <div className="text-center text-white">
                  <div className="text-3xl font-bold">{dadosFornecedor.volumeMensalTotal}</div>
                  <div className="text-white/80 text-sm">Volume Mensal</div>
                </div>
                <div className="flex gap-3">
                  <Link 
                    to="/portal-fornecedor/dash"
                    className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all duration-300 hover:shadow-lg"
                  >
                    <TrendingUp className="w-6 h-6" />
                    📈 Meu Desempenho
                  </Link>
                  <Link 
                    to="/ia-assistente"
                    className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-900 px-8 py-4 rounded-2xl font-bold flex items-center gap-3"
                  >
                    <Brain className="w-6 h-6" />
                    🤖 Assistente IA
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Acesso Rápido às Rotas Principais */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="border rounded-lg p-4 bg-white">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-lg font-semibold text-slate-700">Acesso Rápido:</span>
            
            <Link 
              to="/portal-fornecedor/dash"
              className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-100 to-blue-100 hover:from-green-200 hover:to-blue-200 text-blue-700 rounded-md font-medium transition-colors"
            >
              <TrendingUp className="w-4 h-4" />
              Dashboard
            </Link>
            
            <Link 
              to="/portal-fornecedor/pedidos"
              className="flex items-center gap-2 px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-md font-medium transition-colors"
            >
              <Package className="w-4 h-4" />
              Pedidos
            </Link>
            
            <Link 
              to="/portal-fornecedor/cotacoes"
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md font-medium transition-colors"
            >
              <FileText className="w-4 h-4" />
              Cotações
            </Link>
            
            <Link 
              to="/portal-fornecedor/contratos"
              className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-md font-medium transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              Contratos
            </Link>
            
            <Link 
              to="/portal-fornecedor/qualificacoes"
              className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-md font-medium transition-colors"
            >
              <Award className="w-4 h-4" />
              Qualificações
            </Link>
          </div>
        </div>
      </div>

      {/* Seção principal com alertas e conteúdo */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Cards de Alertas */}
        <AlertasPortalFornecedor 
          clientes={clientesFiltrados}
          onNavigateToDocument={handleNavigateFromAlert}
        />

        {/* Filtros e Busca */}
        <div className="bg-background border-b pb-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <Search className="w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente, CNPJ ou código..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="flex-1"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-muted-foreground" />
              
              <select 
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary"
              >
                <option value="todos">Todos os Tipos</option>
                <option value="cotacao">Cotações</option>
                <option value="pedido">Pedidos</option>
                <option value="contrato">Contratos</option>
                <option value="qualificacao">Qualificações</option>
              </select>

              <select 
                value={filtroCliente}
                onChange={(e) => setFiltroCliente(e.target.value)}
                className="px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary min-w-[200px]"
              >
                <option value="todos">Todos os Clientes</option>
                {clientesData.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Cards de estatísticas consolidadas */}
        <PortalFornecedorStatsCards 
          totais={totaisFiltrados}
          onCardClick={handleCardClick}
          filtroAtivo="todos"
          tipoFiltroAtivo={filtroTipo}
        />

        {/* Lista de clientes expansíveis */}
        <div className="space-y-4">
          {clientesFiltrados.length > 0 ? (
            clientesFiltrados.map((cliente) => (
              <ClienteExpandivel
                key={cliente.id}
                cliente={cliente}
                onDocumentoClick={handleDocumentoClick}
                onAcaoClick={handleAcaoClick}
                onCardStatClick={handleClienteCardStatClick}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum cliente encontrado</h3>
              <p className="text-gray-600">Ajuste os filtros ou tente uma busca diferente.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortalFornecedor;

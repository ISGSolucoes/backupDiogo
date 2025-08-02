import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Páginas principais que existem
import Inicio from '@/pages/Inicio';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Fornecedores from '@/pages/Fornecedores';
import FornecedorDetalhes from '@/pages/FornecedorDetalhes';
import Requisicoes from '@/pages/Requisicoes';
import CriarRequisicao from '@/pages/CriarRequisicao';
import DetalhesRequisicao from '@/pages/DetalhesRequisicao';
import Pedidos from '@/pages/Pedidos';
import VisualizarPedido from '@/pages/VisualizarPedido';
import EditarPedido from '@/pages/EditarPedido';
import CriarPedido from '@/pages/CriarPedido';
import Eventos from '@/pages/Eventos';
import SourcingProject from '@/pages/SourcingProject';
import AvaliacaoRFP from '@/pages/AvaliacaoRFP';
import { FluxoSourcingWizard } from '@/components/sourcing/FluxoSourcingWizard';
import NovoProjeto from '@/pages/NovoProjeto';
import Configuracoes from '@/pages/Configuracoes';
import PortalFornecedorDocumento from '@/pages/PortalFornecedorDocumento';
import PortalFornecedorEvento from '@/pages/PortalFornecedorEvento';
import PortalFornecedorProposta from '@/pages/PortalFornecedorProposta';
import PortalFornecedorInbox from '@/pages/PortalFornecedorInbox';
import PortalCadastro from '@/pages/PortalCadastro';
import PortalFornecedor from '@/pages/PortalFornecedor';
import PortalLogin from '@/pages/PortalLogin';
import AceitarConvite from '@/pages/AceitarConvite';
import CentralAprovacao from '@/pages/CentralAprovacao';

// Portal Fornecedor Pages
import PortalFornecedorDashboard from '@/pages/portal-fornecedor/PortalFornecedorDashboard';
import PortalPedidos from '@/pages/portal-fornecedor/PortalPedidos';
import PortalCotacoes from '@/pages/portal-fornecedor/PortalCotacoes';
import PortalContratos from '@/pages/portal-fornecedor/PortalContratos';
import PortalQualificacoes from '@/pages/portal-fornecedor/PortalQualificacoes';

// Core Module Pages
import Categorias from '@/pages/Categorias';
import Cleanse from '@/pages/Cleanse';
import Relatorios from '@/pages/Relatorios';
import ControleDocumental from '@/pages/ControleDocumental';
import Biblioteca from '@/pages/Biblioteca';
import BibliotecaDocumentos from '@/pages/BibliotecaDocumentos';
import Contratos from '@/pages/Contratos';
import MetasPerformance from '@/pages/MetasPerformance';
import Cotacoes from '@/pages/Cotacoes';
import Perfil from '@/pages/Perfil';
import IAAssistente from '@/pages/IAAssistente';
import Qualificacoes from '@/pages/Qualificacoes';

// Admin Pages  
import Admin from '@/pages/Admin';
import AdminModulos from '@/pages/AdminModulos';
import AdminFeatures from '@/pages/AdminFeatures';
import AdminUsuarios from '@/pages/AdminUsuarios';
import AdminPermissoes from '@/pages/AdminPermissoes';
import AdminTemplates from '@/pages/AdminTemplates';
import AdminWorkspace from '@/pages/AdminWorkspace';
import AdminRegras from '@/pages/AdminRegras';
import AdminGovernanca from '@/pages/AdminGovernanca';
import AdminOrcamentario from '@/pages/AdminOrcamentario';

// Fallback
import NotFound from '@/pages/NotFound';

// Páginas de fornecedores por status que existem
import FornecedoresConvidados from '@/pages/FornecedoresConvidados';
import FornecedoresEmRegistro from '@/pages/FornecedoresEmRegistro';
import FornecedoresRegistrados from '@/pages/FornecedoresRegistrados';
import FornecedoresEmQualificacao from '@/pages/FornecedoresEmQualificacao';
import FornecedoresQualificados from '@/pages/FornecedoresQualificados';
import FornecedoresPreferidos from '@/pages/FornecedoresPreferidos';
import FornecedoresInativos from '@/pages/FornecedoresInativos';
import FornecedoresRecentes from '@/pages/FornecedoresRecentes';
import FornecedoresAguardandoAcao from '@/pages/FornecedoresAguardandoAcao';
import FornecedoresPendenciasDocumentais from '@/pages/FornecedoresPendenciasDocumentais';
import FornecedoresPendentesAprovacao from '@/pages/FornecedoresPendentesAprovacao';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AuthProvider>
          <Router>
            <Routes>
              {/* Rotas públicas */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/portal-login" element={<PortalLogin />} />
              <Route path="/portal-cadastro" element={<PortalCadastro />} />
              
              {/* Rotas protegidas */}
              <Route path="/" element={<ProtectedRoute><Inicio /></ProtectedRoute>} />
              <Route path="/inicio" element={<ProtectedRoute><Inicio /></ProtectedRoute>} />
              
              {/* Fornecedores */}
              <Route path="/fornecedores" element={<ProtectedRoute><Fornecedores /></ProtectedRoute>} />
              <Route path="/fornecedores/:id" element={<ProtectedRoute><FornecedorDetalhes /></ProtectedRoute>} />
              
              {/* Fornecedores por status */}
              <Route path="/fornecedores/convidados" element={<ProtectedRoute><FornecedoresConvidados /></ProtectedRoute>} />
              <Route path="/fornecedores/em-registro" element={<ProtectedRoute><FornecedoresEmRegistro /></ProtectedRoute>} />
              <Route path="/fornecedores/registrados" element={<ProtectedRoute><FornecedoresRegistrados /></ProtectedRoute>} />
              <Route path="/fornecedores/em-qualificacao" element={<ProtectedRoute><FornecedoresEmQualificacao /></ProtectedRoute>} />
              <Route path="/fornecedores/pendentes-aprovacao" element={<ProtectedRoute><FornecedoresPendentesAprovacao /></ProtectedRoute>} />
              <Route path="/fornecedores/qualificados" element={<ProtectedRoute><FornecedoresQualificados /></ProtectedRoute>} />
              <Route path="/fornecedores/preferidos" element={<ProtectedRoute><FornecedoresPreferidos /></ProtectedRoute>} />
              <Route path="/fornecedores/inativos" element={<ProtectedRoute><FornecedoresInativos /></ProtectedRoute>} />
              <Route path="/fornecedores/recentes" element={<ProtectedRoute><FornecedoresRecentes /></ProtectedRoute>} />
              <Route path="/fornecedores/aguardando-acao" element={<ProtectedRoute><FornecedoresAguardandoAcao /></ProtectedRoute>} />
              <Route path="/fornecedores/pendencias-documentais" element={<ProtectedRoute><FornecedoresPendenciasDocumentais /></ProtectedRoute>} />
              
              {/* Requisições */}
              <Route path="/requisicoes" element={<ProtectedRoute><Requisicoes /></ProtectedRoute>} />
              <Route path="/requisicoes/nova" element={<ProtectedRoute><CriarRequisicao /></ProtectedRoute>} />
              <Route path="/requisicoes/criar" element={<ProtectedRoute><CriarRequisicao /></ProtectedRoute>} />
              <Route path="/requisicoes/:id/detalhes" element={<ProtectedRoute><DetalhesRequisicao /></ProtectedRoute>} />
              
              {/* Pedidos */}
              <Route path="/pedidos" element={<ProtectedRoute><Pedidos /></ProtectedRoute>} />
              <Route path="/pedidos/novo" element={<ProtectedRoute><CriarPedido /></ProtectedRoute>} />
              <Route path="/pedidos/:id" element={<ProtectedRoute><VisualizarPedido /></ProtectedRoute>} />
              <Route path="/pedidos/:id/editar" element={<ProtectedRoute><EditarPedido /></ProtectedRoute>} />
              
                 {/* Sourcing */}
                 <Route path="/eventos" element={<ProtectedRoute><Eventos /></ProtectedRoute>} />
                 <Route path="/sourcing" element={<ProtectedRoute><SourcingProject /></ProtectedRoute>} />
                 <Route path="/sourcing/projetos" element={<ProtectedRoute><SourcingProject /></ProtectedRoute>} />
                 <Route path="/sourcing/projetos/:id/avaliar" element={<ProtectedRoute><AvaliacaoRFP /></ProtectedRoute>} />
                  <Route path="/sourcing/fluxo/:solicitacaoId" element={<ProtectedRoute><FluxoSourcingWizard /></ProtectedRoute>} />
                  <Route path="/sourcing/projeto/novo" element={<ProtectedRoute><NovoProjeto /></ProtectedRoute>} />
                  <Route path="/sourcing/projeto/configurar" element={<ProtectedRoute><NovoProjeto /></ProtectedRoute>} />
              
              {/* Core Module Pages */}
              <Route path="/categorias" element={<ProtectedRoute><Categorias /></ProtectedRoute>} />
              <Route path="/cleanse" element={<ProtectedRoute><Cleanse /></ProtectedRoute>} />
              <Route path="/relatorios" element={<ProtectedRoute><Relatorios /></ProtectedRoute>} />
              <Route path="/controle-documental" element={<ProtectedRoute><ControleDocumental /></ProtectedRoute>} />
              <Route path="/biblioteca" element={<ProtectedRoute><Biblioteca /></ProtectedRoute>} />
              <Route path="/biblioteca-documentos" element={<ProtectedRoute><BibliotecaDocumentos /></ProtectedRoute>} />
              <Route path="/contratos" element={<ProtectedRoute><Contratos /></ProtectedRoute>} />
              <Route path="/metas-performance" element={<ProtectedRoute><MetasPerformance /></ProtectedRoute>} />
              <Route path="/cotacoes" element={<ProtectedRoute><Cotacoes /></ProtectedRoute>} />
              <Route path="/qualificacoes" element={<ProtectedRoute><Qualificacoes /></ProtectedRoute>} />
              
              {/* User Pages */}
              <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
              <Route path="/ia-assistente" element={<ProtectedRoute><IAAssistente /></ProtectedRoute>} />
              <Route path="/central-aprovacao" element={<ProtectedRoute><CentralAprovacao /></ProtectedRoute>} />
              <Route path="/aceitar-convite/:token" element={<AceitarConvite />} />
              
              {/* Portal e Outras páginas */}
              <Route path="/configuracoes" element={<ProtectedRoute><Configuracoes /></ProtectedRoute>} />
              
              {/* Portal Fornecedor - Completo */}
              <Route path="/portal-fornecedor" element={<ProtectedRoute><PortalFornecedor /></ProtectedRoute>} />
              <Route path="/portal-fornecedor/dashboard" element={<ProtectedRoute><PortalFornecedorDashboard /></ProtectedRoute>} />
              <Route path="/portal-fornecedor/pedidos" element={<ProtectedRoute><PortalPedidos /></ProtectedRoute>} />
              <Route path="/portal-fornecedor/cotacoes" element={<ProtectedRoute><PortalCotacoes /></ProtectedRoute>} />
              <Route path="/portal-fornecedor/contratos" element={<ProtectedRoute><PortalContratos /></ProtectedRoute>} />
              <Route path="/portal-fornecedor/qualificacoes" element={<ProtectedRoute><PortalQualificacoes /></ProtectedRoute>} />
              <Route path="/portal-fornecedor/inbox" element={<ProtectedRoute><PortalFornecedorInbox /></ProtectedRoute>} />
              <Route path="/portal-fornecedor/evento/:projetoId" element={<ProtectedRoute><PortalFornecedorEvento /></ProtectedRoute>} />
              <Route path="/portal-fornecedor/proposta/:projetoId" element={<ProtectedRoute><PortalFornecedorProposta /></ProtectedRoute>} />
              <Route path="/portal-fornecedor/documento/:id" element={<ProtectedRoute><PortalFornecedorDocumento /></ProtectedRoute>} />
              
              {/* Admin Routes - Accessed via user profile for admin users */}
              <Route path="/gerenciar-usuarios" element={<ProtectedRoute><AdminUsuarios /></ProtectedRoute>} />
              <Route path="/gerenciar-permissoes" element={<ProtectedRoute><AdminPermissoes /></ProtectedRoute>} />
              <Route path="/gerenciar-modulos" element={<ProtectedRoute><AdminModulos /></ProtectedRoute>} />
              <Route path="/configurar-features" element={<ProtectedRoute><AdminFeatures /></ProtectedRoute>} />
              <Route path="/templates-perfil" element={<ProtectedRoute><AdminTemplates /></ProtectedRoute>} />
              <Route path="/configurar-workspace/:workspaceId" element={<ProtectedRoute><AdminWorkspace /></ProtectedRoute>} />
              <Route path="/configurar-regras" element={<ProtectedRoute><AdminRegras /></ProtectedRoute>} />
              <Route path="/painel-governanca" element={<ProtectedRoute><AdminGovernanca /></ProtectedRoute>} />
              <Route path="/controle-orcamentario" element={<ProtectedRoute><AdminOrcamentario /></ProtectedRoute>} />
              
              {/* 404 Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
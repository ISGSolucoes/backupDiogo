
import { NavigationBar } from '@/components';
import { IAReButton } from '@/components';
import { ChatContainer } from '@/components/chat';
import { Outlet } from 'react-router-dom';
import { ModuleProvider } from '@/components/admin/ModuleDetector';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface AppLayoutProps {
  children?: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  console.log("🏗️ AppLayout rendering with children:", !!children);
  
  return (
    <ErrorBoundary>
      <ModuleProvider>
        <div className="min-h-screen flex flex-col bg-slate-50">
          <NavigationBar
            abas={[
              { nome: 'Início', rota: '/inicio' },
              { nome: 'Fornecedores', rota: '/fornecedores' },
              { nome: 'Requisições', rota: '/requisicoes' },
              { nome: 'Pedidos', rota: '/pedidos' },
              { nome: 'Sourcing', rota: '/eventos' },
              { nome: 'Cleanse', rota: '/cleanse' },
              { nome: 'Categorias', rota: '/categorias' },
              { nome: 'Relatórios', rota: '/relatorios' },
              { nome: 'Portal Fornecedor', rota: '/portal-fornecedor' },
              { nome: 'Biblioteca Central', rota: '/biblioteca' },
              { nome: 'Metas', rota: '/metas-performance' },
              { nome: 'Orçamentário', rota: '/admin-orcamentario' },
              { nome: 'Admin', rota: '/admin' },
            ]}
          />
          
          <main className="flex-1 p-6 md:p-8">
            <ErrorBoundary>
              {children || <Outlet />}
            </ErrorBoundary>
          </main>
          
          {/* Chat substituindo o IAReButton */}
          <ChatContainer />
        </div>
      </ModuleProvider>
    </ErrorBoundary>
  );
};

export default AppLayout;

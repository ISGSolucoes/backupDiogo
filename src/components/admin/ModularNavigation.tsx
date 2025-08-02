
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Building2, 
  FileText, 
  ShoppingCart, 
  Search, 
  Database, 
  FolderTree, 
  BarChart3, 
  FileCheck,
  Settings 
} from 'lucide-react';
import { useSourcingRequests } from '@/hooks/useSourcingRequests';
import { useModuleContext } from './ModuleDetector';
import { cn } from '@/lib/utils';

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  moduleType?: string;
  isCore?: boolean;
}

const navigationItems: NavigationItem[] = [
  { name: 'Início', href: '/inicio', icon: Home, isCore: true },
  { name: 'Fornecedores', href: '/fornecedores', icon: Building2, moduleType: 'fornecedores' },
  { name: 'Requisições', href: '/requisicoes', icon: FileText, moduleType: 'requisicoes' },
  { name: 'Pedidos', href: '/pedidos', icon: ShoppingCart, moduleType: 'pedidos' },
  { name: 'Sourcing', href: '/eventos', icon: Search, moduleType: 'sourcing' },
  { name: 'Data Cleanse', href: '/cleanse', icon: Database, moduleType: 'cleanse' },
  { name: 'Categorias', href: '/categorias', icon: FolderTree, moduleType: 'categorias' },
  { name: 'Relatórios', href: '/relatorios', icon: BarChart3, moduleType: 'relatorios' },
  { name: 'Documentos', href: '/controle-documental', icon: FileCheck, moduleType: 'documentos' },
  { name: 'Administração', href: '/admin', icon: Settings, isCore: true }
];

export const ModularNavigation = () => {
  const location = useLocation();
  const { isModuleActive } = useModuleContext();
  const { solicitacoes } = useSourcingRequests();

  const visibleItems = navigationItems.filter(item => {
    if (item.isCore) return true;
    if (item.moduleType) return isModuleActive(item.moduleType);
    return true;
  });

  return (
    <nav className="space-y-1">
      {visibleItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href || 
                        (item.href === '/admin' && location.pathname.startsWith('/admin'));
        
        return (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            )}
          >
            <Icon className="mr-3 h-5 w-5" />
            {item.name}
            {item.name === 'Sourcing' && solicitacoes.length > 0 && (
              <span className="ml-auto bg-orange-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                {solicitacoes.length}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
};

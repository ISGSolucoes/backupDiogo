
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';

interface PageNavigationProps {
  currentPage?: string;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  showBreadcrumb?: boolean;
  breadcrumbItems?: Array<{ label: string; path: string }>;
}

const PageNavigation: React.FC<PageNavigationProps> = ({
  currentPage,
  totalPages = 1,
  onPageChange,
  showBreadcrumb = true,
  breadcrumbItems = []
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentPageNumber = () => {
    if (currentPage) return parseInt(currentPage);
    const urlParams = new URLSearchParams(location.search);
    return parseInt(urlParams.get('page') || '1');
  };

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      const urlParams = new URLSearchParams(location.search);
      urlParams.set('page', page.toString());
      navigate(`${location.pathname}?${urlParams.toString()}`);
    }
  };

  const currentPageNum = getCurrentPageNumber();

  const renderBreadcrumb = () => {
    const defaultBreadcrumb = [
      { label: 'Início', path: '/inicio' },
      { label: getPageName(location.pathname), path: location.pathname }
    ];

    const items = breadcrumbItems.length > 0 ? breadcrumbItems : defaultBreadcrumb;

    return (
      <nav className="flex items-center space-x-2 text-sm text-slate-600 mb-4">
        <Home className="h-4 w-4" />
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRight className="h-4 w-4" />}
            <button
              onClick={() => navigate(item.path)}
              className={`hover:text-sourcexpress-blue transition-colors ${
                index === items.length - 1 ? 'text-slate-900 font-medium' : ''
              }`}
            >
              {item.label}
            </button>
          </React.Fragment>
        ))}
      </nav>
    );
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPageNum - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPageNum - 1)}
          disabled={currentPageNum <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>

        {startPage > 1 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
            >
              1
            </Button>
            {startPage > 2 && <span className="text-slate-400">...</span>}
          </>
        )}

        {pages.map((page) => (
          <Button
            key={page}
            variant={page === currentPageNum ? 'default' : 'outline'}
            size="sm"
            onClick={() => handlePageChange(page)}
            className={page === currentPageNum ? 'bg-sourcexpress-blue' : ''}
          >
            {page}
          </Button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="text-slate-400">...</span>}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
            >
              {totalPages}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPageNum + 1)}
          disabled={currentPageNum >= totalPages}
        >
          Próxima
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="w-full">
      {showBreadcrumb && renderBreadcrumb()}
      {renderPagination()}
      
      {totalPages > 1 && (
        <div className="flex justify-center mt-2">
          <Badge variant="secondary" className="text-xs">
            Página {currentPageNum} de {totalPages}
          </Badge>
        </div>
      )}
    </div>
  );
};

const getPageName = (pathname: string): string => {
  const routeNames: Record<string, string> = {
    '/inicio': 'Início',
    '/fornecedores': 'Fornecedores',
    '/requisicoes': 'Requisições',
    '/pedidos': 'Pedidos',
    '/eventos': 'Sourcing',
    '/cleanse': 'Cleanse',
    '/categorias': 'Categorias',
    '/biblioteca': 'Biblioteca Central',
    '/portal-fornecedor': 'Portal Fornecedor',
    '/metas-performance': 'Metas',
    '/admin-orcamentario': 'Orçamentário',
    '/admin': 'Admin',
    '/relatorios': 'Relatórios',
    '/ia-assistente': 'IA Assistente'
  };

  return routeNames[pathname] || 'Página';
};

export default PageNavigation;

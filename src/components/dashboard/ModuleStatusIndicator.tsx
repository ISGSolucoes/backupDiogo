
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings, Package } from 'lucide-react';
import { useModuleContext } from '@/components/admin/ModuleDetector';
import { Link } from 'react-router-dom';

export const ModuleStatusIndicator = () => {
  const { activeModules } = useModuleContext();

  const moduleTypeNames = {
    'core': 'Core',
    'fornecedores': 'Fornecedores',
    'requisicoes': 'Requisições', 
    'pedidos': 'Pedidos',
    'sourcing': 'Sourcing',
    'cleanse': 'Data Cleanse',
    'categorias': 'Categorias',
    'relatorios': 'Relatórios',
    'documentos': 'Documentos'
  };

  const activeCount = activeModules.filter(m => !m.is_core).length;
  const totalCount = Object.keys(moduleTypeNames).length - 1; // Excluindo core

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Status dos Módulos
          </div>
          <Badge variant="outline">
            {activeCount}/{totalCount} ativos
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {activeModules
            .filter(module => !module.is_core)
            .slice(0, 6)
            .map((module) => (
              <Badge 
                key={module.id} 
                variant="secondary" 
                className="justify-center text-xs"
              >
                {moduleTypeNames[module.type as keyof typeof moduleTypeNames] || module.name}
              </Badge>
            ))}
        </div>
        
        {activeModules.filter(m => !m.is_core).length > 6 && (
          <p className="text-xs text-slate-500 text-center">
            +{activeModules.filter(m => !m.is_core).length - 6} módulos ativos
          </p>
        )}

        <Link to="/admin-modular">
          <Button variant="outline" size="sm" className="w-full">
            <Settings className="h-4 w-4 mr-2" />
            Gerenciar Módulos
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

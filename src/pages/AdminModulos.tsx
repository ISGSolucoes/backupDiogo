
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { 
  Settings, 
  Package, 
  Workflow,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  ExternalLink
} from 'lucide-react';
import { useModules } from '@/hooks/useModules';
import { Link } from 'react-router-dom';

const AdminModulos = () => {
  const { modules, workspaces, loading, toggleModule } = useModules();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'bg-green-100 text-green-800';
      case 'inativo':
        return 'bg-gray-100 text-gray-800';
      case 'manutencao':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ativo':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'inativo':
        return <XCircle className="h-4 w-4 text-gray-600" />;
      case 'manutencao':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getModuleWorkspaces = (moduleId: string) => {
    return workspaces.filter(w => w.module_id === moduleId);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header com Breadcrumb */}
      <div className="space-y-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Administração</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Módulos</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Package className="h-8 w-8" />
              Gerenciamento de Módulos
            </h1>
            <p className="text-muted-foreground mt-2">
              Controle e configure os módulos do sistema
            </p>
          </div>
          
          <Button variant="outline" asChild>
            <Link to="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Admin
            </Link>
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total de Módulos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{modules.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Módulos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {modules.filter(m => m.status === 'ativo').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Em Manutenção</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {modules.filter(m => m.status === 'manutencao').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Workspaces</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workspaces.length}</div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Lista de Módulos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => {
          const moduleWorkspaces = getModuleWorkspaces(module.id);
          
          return (
            <Card key={module.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{module.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(module.status)}
                    <Badge variant="outline" className={getStatusColor(module.status)}>
                      {module.status}
                    </Badge>
                  </div>
                </div>
                {module.description && (
                  <CardDescription>{module.description}</CardDescription>
                )}
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Versão:</span>
                    <span className="font-medium">{module.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tipo:</span>
                    <Badge variant="secondary" className="text-xs">
                      {module.type}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">API:</span>
                    <span className="font-mono text-xs">{module.api_prefix}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Workspaces:</span>
                    <span className="font-medium">{moduleWorkspaces.length}</span>
                  </div>
                </div>

                {module.dependencies.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Dependências:</span>
                    <div className="flex flex-wrap gap-1">
                      {module.dependencies.map((dep, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {dep}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status do Módulo</span>
                    <Switch
                      checked={module.status === 'ativo'}
                      onCheckedChange={(checked) => toggleModule(module.id, checked)}
                      disabled={module.is_core}
                    />
                  </div>

                  {module.is_core && (
                    <p className="text-xs text-muted-foreground">
                      * Módulo core não pode ser desativado
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  {moduleWorkspaces.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Workspaces Configurados:</span>
                      {moduleWorkspaces.slice(0, 2).map((workspace) => (
                        <div key={workspace.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <span className="text-sm">{workspace.name}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant={workspace.is_active ? "default" : "secondary"} className="text-xs">
                              {workspace.is_active ? 'Ativo' : 'Inativo'}
                            </Badge>
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/admin/workspace/${workspace.id}`}>
                                <ExternalLink className="h-3 w-3" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                      {moduleWorkspaces.length > 2 && (
                        <p className="text-xs text-muted-foreground">
                          +{moduleWorkspaces.length - 2} workspace(s) adicional(is)
                        </p>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/admin/features">
                        <Settings className="h-3 w-3 mr-1" />
                        Features
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/admin/regras?module=${module.id}`}>
                        <Workflow className="h-3 w-3 mr-1" />
                        Regras
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdminModulos;

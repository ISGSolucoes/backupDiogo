import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Package, 
  Workflow, 
  ToggleLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Wrench,
  Cog
} from 'lucide-react';
import { useModules } from '@/hooks/useModules';
import { Module, ModuleWorkspace } from '@/types/modular';
import { WorkspaceConfigModal } from './WorkspaceConfigModal';
import { FeatureFlagConfig } from './FeatureFlagConfig';

export const ModuleManager = () => {
  const { modules, workspaces, featureFlags, loading, toggleModule, toggleFeatureFlag } = useModules();
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
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

  const getModuleWorkspaces = (moduleId: string): ModuleWorkspace[] => {
    return workspaces.filter(w => w.module_id === moduleId);
  };

  const getModuleFeatureFlags = (moduleId: string) => {
    return featureFlags.filter(f => f.module_id === moduleId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Administração Modular</h2>
          <p className="text-slate-600">Gerencie módulos, workspaces e configurações</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href="/admin/regras">
              <Cog className="h-4 w-4 mr-2" />
              Configurar Regras
            </a>
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configurações Globais
          </Button>
        </div>
      </div>

      <Tabs defaultValue="modules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="modules">Módulos</TabsTrigger>
          <TabsTrigger value="workspaces">Workspaces</TabsTrigger>
          <TabsTrigger value="features">Feature Flags</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((module) => (
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
                    <p className="text-sm text-slate-600">{module.description}</p>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Versão {module.version}</span>
                    <span className="text-xs text-slate-500">{module.api_prefix}</span>
                  </div>
                  
                  {module.dependencies.length > 0 && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Dependências:</p>
                      <div className="flex flex-wrap gap-1">
                        {module.dependencies.map((dep, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {dep}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm">Status do Módulo</span>
                    <Switch
                      checked={module.status === 'ativo'}
                      onCheckedChange={(checked) => toggleModule(module.id, checked)}
                      disabled={module.is_core}
                    />
                  </div>

                  <WorkspaceConfigModal
                    module={module}
                    trigger={
                      <Button variant="outline" size="sm" className="w-full">
                        <Package className="h-4 w-4 mr-2" />
                        Gerenciar Workspace
                      </Button>
                    }
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="workspaces" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {modules.map((module) => {
              const moduleWorkspaces = getModuleWorkspaces(module.id);
              
              return (
                <Card key={module.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Workflow className="h-5 w-5" />
                      {module.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {moduleWorkspaces.length > 0 ? (
                      moduleWorkspaces.map((workspace) => (
                        <div key={workspace.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{workspace.name}</h4>
                            <Badge variant={workspace.is_active ? "default" : "secondary"}>
                              {workspace.is_active ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </div>
                          {workspace.description && (
                            <p className="text-sm text-slate-600 mb-2">{workspace.description}</p>
                          )}
                          <WorkspaceConfigModal
                            module={module}
                            workspace={workspace}
                            trigger={
                              <Button variant="outline" size="sm">
                                <Settings className="h-4 w-4 mr-2" />
                                Configurar
                              </Button>
                            }
                          />
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">Nenhum workspace configurado</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {modules.map((module) => {
              const moduleFlags = getModuleFeatureFlags(module.id);
              
              return (
                <Card key={module.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ToggleLeft className="h-5 w-5" />
                      {module.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {moduleFlags.length > 0 ? (
                      moduleFlags.map((flag) => (
                        <div key={flag.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-medium">{flag.flag_name}</h4>
                              <p className="text-sm text-slate-600">Ambiente: {flag.environment}</p>
                            </div>
                            <Switch
                              checked={flag.is_enabled}
                              onCheckedChange={(checked) => toggleFeatureFlag(flag.id, checked)}
                            />
                          </div>
                          <FeatureFlagConfig
                            flag={flag}
                            onUpdate={toggleFeatureFlag}
                            trigger={
                              <Button variant="ghost" size="sm" className="w-full">
                                <Wrench className="h-4 w-4 mr-2" />
                                Configurar
                              </Button>
                            }
                          />
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">Nenhuma feature configurada</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

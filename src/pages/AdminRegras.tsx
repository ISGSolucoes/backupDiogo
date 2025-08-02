
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Settings, ArrowLeft, Search, Filter, RotateCcw, ShoppingCart, Users, FileText } from 'lucide-react';
import { useModules } from '@/hooks/useModules';
import { GranularRulesConfig } from '@/components/admin/GranularRulesConfig';

const AdminRegras = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedModuleId = searchParams.get('module') || '';
  
  const { modules, workspaces, loading } = useModules();
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar módulos e workspaces
  const availableModules = modules.filter(m => m.status === 'ativo');
  const selectedModule = availableModules.find(m => m.id === selectedModuleId);
  const moduleWorkspaces = workspaces.filter(w => w.module_id === selectedModuleId && w.is_active);

  const handleModuleChange = (moduleId: string) => {
    setSearchParams({ module: moduleId });
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearchTerm('');
  };

  const getModuleIcon = (moduleType: string) => {
    switch (moduleType) {
      case 'fornecedores':
        return Users;
      case 'pedidos':
        return ShoppingCart;
      case 'requisicoes':
        return FileText;
      default:
        return Settings;
    }
  };

  const getModuleDescription = (moduleType: string) => {
    switch (moduleType) {
      case 'fornecedores':
        return 'Regras para gestão completa do ciclo de vida dos fornecedores';
      case 'pedidos':
        return 'Regras para criação, aprovação, transmissão e gestão de pedidos + portal de negócios';
      case 'requisicoes':
        return 'Regras para processo de requisições e aprovações';
      default:
        return 'Configurações específicas do módulo';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

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
              <BreadcrumbPage>Configuração de Regras Granulares</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Settings className="h-8 w-8" />
              Configuração de Regras Granulares
            </h1>
            <p className="text-muted-foreground mt-2">
              Sistema avançado de configuração de regras de negócio por módulo e workspace
            </p>
          </div>
          
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>

      {/* Filtros e Controles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros e Seleção</CardTitle>
          <CardDescription>
            Selecione o módulo e workspace para configurar as regras específicas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Módulo</label>
              <Select value={selectedModuleId} onValueChange={handleModuleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um módulo" />
                </SelectTrigger>
                <SelectContent>
                  {availableModules.map((module) => {
                    const IconComponent = getModuleIcon(module.type);
                    return (
                      <SelectItem key={module.id} value={module.id}>
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4" />
                          <span>{module.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            v{module.version}
                          </Badge>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Buscar Regras</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Digite para buscar regras..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-end">
              <Button variant="outline" onClick={clearFilters} className="w-full">
                <RotateCcw className="h-4 w-4 mr-2" />
                Limpar Filtros
              </Button>
            </div>
          </div>

          {selectedModule && (
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                {(() => {
                  const IconComponent = getModuleIcon(selectedModule.type);
                  return <IconComponent className="h-5 w-5" />;
                })()}
                <Badge variant="default">{selectedModule.name}</Badge>
                <span className="text-sm text-muted-foreground">
                  {moduleWorkspaces.length} workspace(s) ativo(s)
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {getModuleDescription(selectedModule.type)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Conteúdo Principal */}
      {!selectedModuleId ? (
        <Card>
          <CardContent className="text-center py-12">
            <Filter className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Selecione um Módulo</h3>
            <p className="text-muted-foreground mb-4">
              Escolha um módulo acima para visualizar e configurar suas regras granulares
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mt-6">
              {availableModules.slice(0, 3).map((module) => {
                const IconComponent = getModuleIcon(module.type);
                return (
                  <Card key={module.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleModuleChange(module.id)}>
                    <CardContent className="p-4 text-center">
                      <IconComponent className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h4 className="font-medium">{module.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {getModuleDescription(module.type)}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ) : moduleWorkspaces.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Settings className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum Workspace Ativo</h3>
            <p className="text-muted-foreground">
              Este módulo não possui workspaces ativos. Configure um workspace primeiro.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {moduleWorkspaces.map((workspace) => (
            <div key={workspace.id} className="space-y-4">
              <div className="flex items-center gap-3 pb-2">
                <h2 className="text-xl font-semibold">{workspace.name}</h2>
                <Badge variant={workspace.is_active ? "default" : "secondary"}>
                  {workspace.is_active ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
              
              {workspace.description && (
                <p className="text-muted-foreground text-sm mb-4">
                  {workspace.description}
                </p>
              )}

              <GranularRulesConfig
                workspace={workspace}
                moduleId={selectedModuleId}
                searchTerm={searchTerm}
              />
            </div>
          ))}
        </div>
      )}

      {/* Footer Informativo */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground">
            <h4 className="font-medium mb-2">Sobre as Regras Granulares</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-1 list-disc list-inside">
                <li>Regras organizadas por categorias específicas de cada módulo</li>
                <li>Configuração independente por workspace</li>
                <li>Diferentes níveis de impacto: Baixo, Médio, Alto e Crítico</li>
                <li>Algumas regras podem requerer aprovação antes de serem ativadas</li>
              </ul>
              <ul className="space-y-1 list-disc list-inside">
                <li>Valores personalizados para regras numéricas</li>
                <li>Histórico completo de mudanças nas configurações</li>
                <li>Controle de conflitos e dependências entre regras</li>
                <li>Templates pré-configurados por tipo de negócio</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRegras;

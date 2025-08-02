
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Package, 
  Workflow, 
  ToggleLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Database,
  Users,
  Bell,
  BarChart3,
  Shield
} from 'lucide-react';
import { useModules } from '@/hooks/useModules';
import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { PermissionManagerSimple } from '@/components/admin/PermissionManagerSimple';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const permissionsRef = useRef<HTMLDivElement>(null);
  const { modules, workspaces, featureFlags, loading } = useModules();

  // Scroll automático quando abrir a seção de permissões
  useEffect(() => {
    if (activeTab === 'permissions' && permissionsRef.current) {
      setTimeout(() => {
        permissionsRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  }, [activeTab]);

  const handlePermissionsClick = () => {
    console.log('Botão de permissões clicado');
    console.log('Estado atual da aba:', activeTab);
    
    try {
      if (activeTab === 'permissions') {
        console.log('Fechando seção de permissões');
        setActiveTab('overview');
      } else {
        console.log('Abrindo seção de permissões');
        setActiveTab('permissions');
      }
    } catch (error) {
      console.error('Erro ao alterar aba:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const activeModules = modules.filter(m => m.status === 'ativo').length;
  const totalWorkspaces = workspaces.length;
  const activeWorkspaces = workspaces.filter(w => w.is_active).length;
  const enabledFeatures = featureFlags.filter(f => f.is_enabled).length;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="h-8 w-8" />
          Administração do Sistema
        </h1>
        <p className="text-muted-foreground mt-2">
          Centro de controle para gerenciar módulos, workspaces e configurações do sistema
        </p>
      </div>

      {/* Debug info - remover após testes */}
      <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
        Debug: Aba ativa = {activeTab}
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Módulos Ativos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeModules}</div>
            <p className="text-xs text-muted-foreground">
              de {modules.length} módulos totais
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workspaces</CardTitle>
            <Workflow className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeWorkspaces}</div>
            <p className="text-xs text-muted-foreground">
              de {totalWorkspaces} workspaces configurados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Features Ativas</CardTitle>
            <ToggleLeft className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enabledFeatures}</div>
            <p className="text-xs text-muted-foreground">
              de {featureFlags.length} features totais
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status Geral</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Saudável</div>
            <p className="text-xs text-muted-foreground">
              Sistema operacional
            </p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Navegação Rápida */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Áreas de Administração</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                Gerenciar Módulos
              </CardTitle>
              <CardDescription>
                Ativar, desativar e configurar módulos do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="outline">{modules.length} módulos</Badge>
                <Badge variant={activeModules > 0 ? "default" : "secondary"}>
                  {activeModules} ativos
                </Badge>
              </div>
              <Button asChild className="w-full">
                <Link to="/admin/modulos">
                  <Package className="h-4 w-4 mr-2" />
                  Gerenciar Módulos
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ToggleLeft className="h-5 w-5 text-purple-600" />
                Feature Flags
              </CardTitle>
              <CardDescription>
                Controlar features e funcionalidades por ambiente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="outline">{featureFlags.length} features</Badge>
                <Badge variant={enabledFeatures > 0 ? "default" : "secondary"}>
                  {enabledFeatures} ativas
                </Badge>
              </div>
              <Button asChild className="w-full">
                <Link to="/admin/features">
                  <ToggleLeft className="h-4 w-4 mr-2" />
                  Gerenciar Features
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-green-600" />
                Regras Granulares
              </CardTitle>
              <CardDescription>
                Configurar regras de negócio por módulo e workspace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="outline">Avançado</Badge>
                <Badge variant="default">Configurável</Badge>
              </div>
              <Button asChild className="w-full">
                <Link to="/admin/regras">
                  <Database className="h-4 w-4 mr-2" />
                  Configurar Regras
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className={`hover:shadow-md transition-all cursor-pointer ${
            activeTab === 'permissions' ? 'ring-2 ring-primary bg-primary/5' : ''
          }`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-600" />
                Permissões Multicamadas
                {activeTab === 'permissions' && (
                  <Badge variant="default" className="ml-auto text-xs">
                    Ativo
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Sistema completo de permissões por cargo e módulo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="outline">Novo</Badge>
                <Badge variant="default">Flexível</Badge>
              </div>
              <Button 
                className="w-full"
                variant={activeTab === 'permissions' ? 'secondary' : 'default'}
                onClick={handlePermissionsClick}
              >
                <Users className="h-4 w-4 mr-2" />
                {activeTab === 'permissions' ? 'Fechar Permissões' : 'Gerenciar Permissões'}
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                Governança & Auditoria
              </CardTitle>
              <CardDescription>
                Controles de segurança e conformidade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="outline">Crítico</Badge>
                <Badge variant="destructive">Imutável</Badge>
              </div>
              <Button asChild className="w-full">
                <Link to="/admin/governanca">
                  <Shield className="h-4 w-4 mr-2" />
                  Acessar Governança
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Status dos Módulos */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Status dos Módulos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.slice(0, 6).map((module) => (
            <Card key={module.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{module.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    {module.status === 'ativo' && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {module.status === 'inativo' && <XCircle className="h-4 w-4 text-gray-600" />}
                    {module.status === 'manutencao' && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                    <Badge 
                      variant={module.status === 'ativo' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {module.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-2">
                  v{module.version} • {module.api_prefix}
                </div>
                <div className="text-xs text-muted-foreground">
                  {workspaces.filter(w => w.module_id === module.id).length} workspace(s)
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {modules.length > 6 && (
          <div className="text-center mt-4">
            <Button variant="outline" asChild>
              <Link to="/admin/modulos">
                Ver todos os módulos ({modules.length})
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Seção de Permissões - Renderizada condicionalmente */}
      {activeTab === 'permissions' && (
        <div 
          ref={permissionsRef}
          className="animate-fade-in transition-all duration-300"
        >
          <Separator className="my-6" />
          <PermissionManagerSimple />
        </div>
      )}
    </div>
  );
};

export default Admin;

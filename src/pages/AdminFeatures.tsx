
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { 
  ToggleLeft,
  ArrowLeft,
  Search,
  Filter,
  RotateCcw,
  Settings
} from 'lucide-react';
import { useModules } from '@/hooks/useModules';
import { Link } from 'react-router-dom';

const AdminFeatures = () => {
  const { modules, featureFlags, loading, toggleFeatureFlag } = useModules();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedEnvironment, setSelectedEnvironment] = useState('');

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Filtros
  const filteredFlags = featureFlags.filter(flag => {
    const matchesSearch = flag.flag_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = !selectedModule || selectedModule === 'todos' || flag.module_id === selectedModule;
    const matchesEnvironment = !selectedEnvironment || selectedEnvironment === 'todos' || flag.environment === selectedEnvironment;
    
    return matchesSearch && matchesModule && matchesEnvironment;
  });

  const groupedFlags = filteredFlags.reduce((acc, flag) => {
    if (!acc[flag.module_id]) {
      acc[flag.module_id] = [];
    }
    acc[flag.module_id].push(flag);
    return acc;
  }, {} as Record<string, typeof featureFlags>);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedModule('todos');
    setSelectedEnvironment('todos');
  };

  const environments = [...new Set(featureFlags.map(f => f.environment))];
  const enabledCount = featureFlags.filter(f => f.is_enabled).length;

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
              <BreadcrumbPage>Feature Flags</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <ToggleLeft className="h-8 w-8" />
              Gerenciamento de Feature Flags
            </h1>
            <p className="text-muted-foreground mt-2">
              Controle funcionalidades e comportamentos do sistema por ambiente
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
            <CardTitle className="text-sm">Total Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{featureFlags.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Features Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{enabledCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Features Inativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {featureFlags.length - enabledCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Ambientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{environments.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
          <CardDescription>
            Filtre as feature flags por módulo, ambiente ou nome
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Buscar Feature</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nome da feature..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Módulo</label>
              <Select value={selectedModule} onValueChange={setSelectedModule}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os módulos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os módulos</SelectItem>
                  {modules.map((module) => (
                    <SelectItem key={module.id} value={module.id}>
                      {module.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Ambiente</label>
              <Select value={selectedEnvironment} onValueChange={setSelectedEnvironment}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os ambientes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os ambientes</SelectItem>
                  {environments.map((env) => (
                    <SelectItem key={env} value={env}>
                      {env}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" onClick={clearFilters} className="w-full">
                <RotateCcw className="h-4 w-4 mr-2" />
                Limpar Filtros
              </Button>
            </div>
          </div>

          {(searchTerm || selectedModule || selectedEnvironment) && (
            <div className="flex items-center gap-2 pt-2">
              <span className="text-sm text-muted-foreground">Filtros ativos:</span>
              {searchTerm && <Badge variant="secondary">Busca: {searchTerm}</Badge>}
              {selectedModule && (
                <Badge variant="secondary">
                  Módulo: {modules.find(m => m.id === selectedModule)?.name}
                </Badge>
              )}
              {selectedEnvironment && (
                <Badge variant="secondary">Ambiente: {selectedEnvironment}</Badge>
              )}
              <span className="text-sm text-muted-foreground">
                ({filteredFlags.length} resultado(s))
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Lista de Features Agrupadas por Módulo */}
      {Object.keys(groupedFlags).length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Filter className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma feature encontrada</h3>
            <p className="text-muted-foreground">
              Tente ajustar os filtros para encontrar as features desejadas
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedFlags).map(([moduleId, flags]) => {
            const module = modules.find(m => m.id === moduleId);
            
            return (
              <Card key={moduleId}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    {module?.name || 'Módulo Desconhecido'}
                  </CardTitle>
                  <CardDescription>
                    {flags.length} feature(s) configurada(s) para este módulo
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {flags.map((flag) => (
                    <div key={flag.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{flag.flag_name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {flag.environment}
                          </Badge>
                        </div>
                        {flag.config && Object.keys(flag.config).length > 0 && (
                          <div className="text-sm text-muted-foreground">
                            Configurações personalizadas disponíveis
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground">
                          Criado em: {new Date(flag.created_at).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {flag.is_enabled ? 'Ativada' : 'Desativada'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {flag.is_enabled ? 'Funcionalidade disponível' : 'Funcionalidade oculta'}
                          </div>
                        </div>
                        
                        <Switch
                          checked={flag.is_enabled}
                          onCheckedChange={(checked) => toggleFeatureFlag(flag.id, checked)}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminFeatures;

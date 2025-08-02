
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { 
  Workflow,
  ArrowLeft,
  Save,
  Package,
  Settings,
  Users,
  Bell,
  Database,
  ExternalLink
} from 'lucide-react';
import { useModules } from '@/hooks/useModules';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const AdminWorkspace = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { modules, workspaces, updateWorkspace, loading } = useModules();
  const [saving, setSaving] = useState(false);
  
  const workspace = workspaces.find(w => w.id === workspaceId);
  const module = workspace ? modules.find(m => m.id === workspace.module_id) : null;

  // Estado para configurações básicas
  const [basicConfig, setBasicConfig] = useState({
    name: '',
    description: '',
    is_active: true,
  });

  // Estado para configurações específicas do módulo
  const [moduleConfig, setModuleConfig] = useState<Record<string, any>>({});

  useEffect(() => {
    if (workspace) {
      setBasicConfig({
        name: workspace.name,
        description: workspace.description || '',
        is_active: workspace.is_active,
      });
      setModuleConfig(workspace.configuration || {});
    }
  }, [workspace]);

  const handleSave = async () => {
    if (!workspace) return;
    
    setSaving(true);
    try {
      await updateWorkspace(workspace.id, {
        ...basicConfig,
        configuration: moduleConfig
      });
      toast.success('Workspace atualizado com sucesso');
    } catch (error) {
      toast.error('Erro ao atualizar workspace');
    } finally {
      setSaving(false);
    }
  };

  const getModuleSpecificFields = () => {
    if (!module) return null;

    switch (module.type) {
      case 'fornecedores':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="debug_mode">Modo Debug</Label>
              <Switch
                id="debug_mode"
                checked={moduleConfig.debug_mode || false}
                onCheckedChange={(checked) => setModuleConfig(prev => ({ ...prev, debug_mode: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="test_data">Dados de Teste</Label>
              <Switch
                id="test_data"
                checked={moduleConfig.test_data || false}
                onCheckedChange={(checked) => setModuleConfig(prev => ({ ...prev, test_data: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="validation_strict">Validação Rigorosa</Label>
              <Switch
                id="validation_strict"
                checked={moduleConfig.validation_strict || false}
                onCheckedChange={(checked) => setModuleConfig(prev => ({ ...prev, validation_strict: checked }))}
              />
            </div>
          </div>
        );
        
      case 'requisicoes':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="auto_approval_limit">Limite Auto-aprovação (R$)</Label>
              <Input
                id="auto_approval_limit"
                type="number"
                value={moduleConfig.auto_approval_limit || ''}
                onChange={(e) => setModuleConfig(prev => ({ ...prev, auto_approval_limit: parseFloat(e.target.value) }))}
                placeholder="0.00"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="skip_manager_approval">Pular Aprovação de Gestor</Label>
              <Switch
                id="skip_manager_approval"
                checked={moduleConfig.skip_manager_approval || false}
                onCheckedChange={(checked) => setModuleConfig(prev => ({ ...prev, skip_manager_approval: checked }))}
              />
            </div>
          </div>
        );
        
      case 'pedidos':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="portal_enabled">Portal Habilitado</Label>
              <Switch
                id="portal_enabled"
                checked={moduleConfig.portal_enabled || false}
                onCheckedChange={(checked) => setModuleConfig(prev => ({ ...prev, portal_enabled: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="auto_sync">Sincronização Automática</Label>
              <Switch
                id="auto_sync"
                checked={moduleConfig.auto_sync || false}
                onCheckedChange={(checked) => setModuleConfig(prev => ({ ...prev, auto_sync: checked }))}
              />
            </div>
            
            <div>
              <Label htmlFor="notification_emails">E-mails de Notificação</Label>
              <Textarea
                id="notification_emails"
                value={Array.isArray(moduleConfig.notification_emails) ? moduleConfig.notification_emails.join('\n') : ''}
                onChange={(e) => setModuleConfig(prev => ({ 
                  ...prev, 
                  notification_emails: e.target.value.split('\n').filter(email => email.trim()) 
                }))}
                placeholder="Digite um e-mail por linha"
                rows={3}
              />
            </div>
          </div>
        );
        
      default:
        return (
          <div className="text-center py-8 text-muted-foreground">
            <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Configurações específicas não definidas para este módulo</p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!workspace || !module) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Workspace não encontrado</h3>
            <p className="text-muted-foreground mb-4">
              O workspace solicitado não existe ou foi removido
            </p>
            <Button asChild>
              <Link to="/admin">Voltar ao Admin</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header com Breadcrumb */}
      <div className="space-y-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Administração</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/modulos">Módulos</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Workspace: {workspace.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Workflow className="h-8 w-8" />
              {workspace.name}
            </h1>
            <p className="text-muted-foreground mt-2 flex items-center gap-2">
              Configuração do workspace para o módulo
              <Badge variant="outline">{module.name}</Badge>
            </p>
          </div>
          
          <Button variant="outline" asChild>
            <Link to="/admin/modulos">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar aos Módulos
            </Link>
          </Button>
        </div>
      </div>

      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Informações Básicas
          </CardTitle>
          <CardDescription>Configure as informações principais do workspace</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Nome do Workspace</Label>
            <Input
              id="name"
              value={basicConfig.name}
              onChange={(e) => setBasicConfig(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nome do workspace"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={basicConfig.description}
              onChange={(e) => setBasicConfig(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição do workspace"
              rows={3}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="is_active">Workspace Ativo</Label>
            <Switch
              id="is_active"
              checked={basicConfig.is_active}
              onCheckedChange={(checked) => setBasicConfig(prev => ({ ...prev, is_active: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Configurações Específicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações Específicas
          </CardTitle>
          <CardDescription>
            Configurações técnicas específicas para o módulo {module.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {getModuleSpecificFields()}
        </CardContent>
      </Card>

      {/* Regras de Negócio */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Regras Granulares
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to={`/admin/regras?module=${module.id}`}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Configurar Regras
              </Link>
            </Button>
          </CardTitle>
          <CardDescription>
            Configure regras de negócio específicas para este workspace
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Database className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Editor de Regras Dedicado</h3>
          <p className="text-muted-foreground mb-4">
            As regras granulares possuem uma interface dedicada com mais espaço e recursos avançados.
          </p>
          <Button asChild>
            <Link to={`/admin/regras?module=${module.id}`}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Abrir Editor de Regras
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Placeholder para funcionalidades futuras */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Controle de Acesso
            </CardTitle>
            <CardDescription>Gerencie permissões e acessos</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-sm text-muted-foreground">Em desenvolvimento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações
            </CardTitle>
            <CardDescription>Configure alertas e notificações</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-sm text-muted-foreground">Em desenvolvimento</p>
          </CardContent>
        </Card>
      </div>

      <Separator />
      
      {/* Ações */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" asChild>
          <Link to="/admin/modulos">Cancelar</Link>
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </div>
    </div>
  );
};

export default AdminWorkspace;

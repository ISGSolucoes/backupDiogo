import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useModules } from '@/hooks/useModules';
import { Module, ModuleWorkspace } from '@/types/modular';
import { Package, Settings, Users, Bell, CheckSquare, Database, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface WorkspaceConfigModalProps {
  module: Module;
  workspace?: ModuleWorkspace;
  trigger: React.ReactNode;
}

export const WorkspaceConfigModal = ({ module, workspace, trigger }: WorkspaceConfigModalProps) => {
  const { updateWorkspace } = useModules();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Estado para configurações básicas
  const [basicConfig, setBasicConfig] = useState({
    name: workspace?.name || '',
    description: workspace?.description || '',
    is_active: workspace?.is_active ?? true,
  });

  // Estado para configurações específicas do módulo
  const [moduleConfig, setModuleConfig] = useState(workspace?.configuration || {});

  const handleSave = async () => {
    if (!workspace) return;
    
    setLoading(true);
    try {
      await updateWorkspace(workspace.id, {
        ...basicConfig,
        ...moduleConfig
      });
      setOpen(false);
      toast.success('Workspace atualizado com sucesso');
    } catch (error) {
      toast.error('Erro ao atualizar workspace');
    } finally {
      setLoading(false);
    }
  };

  const getModuleSpecificFields = () => {
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
          <div className="text-center py-8 text-slate-500">
            <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Configurações específicas não definidas para este módulo</p>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] w-[95vw] max-h-[95vh] h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Configurar Workspace - {module.name}
          </DialogTitle>
          <DialogDescription>
            {workspace ? `Configurando workspace: ${workspace.name}` : 'Criar novo workspace'}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Básico</TabsTrigger>
            <TabsTrigger value="business-rules">Regras de Negócio</TabsTrigger>
            <TabsTrigger value="specific">Específico</TabsTrigger>
            <TabsTrigger value="permissions">Permissões</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações Básicas</CardTitle>
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
          </TabsContent>

          <TabsContent value="business-rules" className="space-y-4">
            {workspace ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <CheckSquare className="h-5 w-5" />
                      Regras de Negócio Granulares
                    </span>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/admin/regras?module=${module.id}`} target="_blank">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Abrir Editor Completo
                      </a>
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Configure regras específicas para este workspace. Para uma interface completa, 
                    use o editor dedicado.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center py-8">
                  <CheckSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Editor de Regras Dedicado</h3>
                  <p className="text-muted-foreground mb-4">
                    As regras granulares possuem uma interface dedicada com mais espaço e recursos avançados.
                  </p>
                  <Button asChild>
                    <a href={`/admin/regras?module=${module.id}`} target="_blank">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Abrir Editor de Regras
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Salve o workspace primeiro para configurar as regras de negócio</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="specific" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
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
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Controle de Acesso
                </CardTitle>
                <CardDescription>Gerencie permissões e acessos ao workspace</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-8 text-slate-500">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Sistema de permissões será implementado em breve</p>
                  <Badge variant="outline" className="mt-2">Em desenvolvimento</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Configurações de Notificação
                </CardTitle>
                <CardDescription>Configure alertas e notificações do workspace</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-8 text-slate-500">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Sistema de notificações será implementado em breve</p>
                  <Badge variant="outline" className="mt-2">Em desenvolvimento</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Separator />
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

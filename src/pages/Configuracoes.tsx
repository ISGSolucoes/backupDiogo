
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Settings, Lock, Bell, Eye, Shield, Palette } from 'lucide-react';
import { toast } from 'sonner';

const Configuracoes = () => {
  const { profile } = useAuth();
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    requisitionAlerts: true,
    approvalReminders: true,
    systemUpdates: false,
  });
  const [interfaceSettings, setInterfaceSettings] = useState({
    theme: 'light',
    language: 'pt-BR',
    dashboardLayout: 'default',
    itemsPerPage: '20',
  });
  const [privacySettings, setPrivacySettings] = useState({
    visibilityToColleagues: true,
    activityHistory: true,
    auditLogging: true,
    dataAnalytics: false,
  });

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    // Implementar mudança de senha
    toast.success('Senha alterada com sucesso');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handleNotificationSave = () => {
    // Implementar salvamento de notificações
    toast.success('Configurações de notificação salvas');
  };

  const handleInterfaceSave = () => {
    // Implementar salvamento de interface
    toast.success('Configurações de interface salvas');
  };

  const handlePrivacySave = () => {
    // Implementar salvamento de privacidade
    toast.success('Configurações de privacidade salvas');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Configurações</h1>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="account">Conta</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="interface">Interface</TabsTrigger>
          <TabsTrigger value="privacy">Privacidade</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Segurança da Conta
              </CardTitle>
              <CardDescription>
                Gerencie sua senha e configurações de segurança
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Senha Atual</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  />
                </div>
                <Button onClick={handlePasswordChange}>
                  Alterar Senha
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold">Autenticação de Dois Fatores</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Ativar 2FA</p>
                    <p className="text-sm text-muted-foreground">
                      Adicione uma camada extra de segurança à sua conta
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold">Sessões Ativas</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">Sessão Atual</p>
                      <p className="text-sm text-muted-foreground">
                        Chrome no Windows • {new Date().toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Encerrar Outras Sessões
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificações
              </CardTitle>
              <CardDescription>
                Configure como você deseja receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notificações por Email</p>
                    <p className="text-sm text-muted-foreground">
                      Receba notificações importantes por email
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, emailNotifications: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notificações Push</p>
                    <p className="text-sm text-muted-foreground">
                      Receba notificações push no navegador
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, pushNotifications: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Alertas de Requisição</p>
                    <p className="text-sm text-muted-foreground">
                      Seja notificado sobre novas requisições
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.requisitionAlerts}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, requisitionAlerts: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Lembretes de Aprovação</p>
                    <p className="text-sm text-muted-foreground">
                      Receba lembretes sobre aprovações pendentes
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.approvalReminders}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, approvalReminders: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Atualizações do Sistema</p>
                    <p className="text-sm text-muted-foreground">
                      Receba notificações sobre atualizações
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.systemUpdates}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, systemUpdates: checked})
                    }
                  />
                </div>
              </div>

              <Button onClick={handleNotificationSave}>
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interface">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Interface
              </CardTitle>
              <CardDescription>
                Personalize a aparência e comportamento do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tema</Label>
                  <Select
                    value={interfaceSettings.theme}
                    onValueChange={(value) => 
                      setInterfaceSettings({...interfaceSettings, theme: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="dark">Escuro</SelectItem>
                      <SelectItem value="system">Sistema</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Idioma</Label>
                  <Select
                    value={interfaceSettings.language}
                    onValueChange={(value) => 
                      setInterfaceSettings({...interfaceSettings, language: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Layout do Dashboard</Label>
                  <Select
                    value={interfaceSettings.dashboardLayout}
                    onValueChange={(value) => 
                      setInterfaceSettings({...interfaceSettings, dashboardLayout: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Padrão</SelectItem>
                      <SelectItem value="compact">Compacto</SelectItem>
                      <SelectItem value="expanded">Expandido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Itens por Página</Label>
                  <Select
                    value={interfaceSettings.itemsPerPage}
                    onValueChange={(value) => 
                      setInterfaceSettings({...interfaceSettings, itemsPerPage: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleInterfaceSave}>
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacidade e Dados
              </CardTitle>
              <CardDescription>
                Gerencie suas configurações de privacidade e dados corporativos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Visibilidade para Colegas</p>
                    <p className="text-sm text-muted-foreground">
                      Permitir que colegas vejam suas atividades e status
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.visibilityToColleagues}
                    onCheckedChange={(checked) => 
                      setPrivacySettings({...privacySettings, visibilityToColleagues: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Histórico de Atividades</p>
                    <p className="text-sm text-muted-foreground">
                      Manter registro das suas atividades no sistema
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.activityHistory}
                    onCheckedChange={(checked) => 
                      setPrivacySettings({...privacySettings, activityHistory: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Log de Auditoria</p>
                    <p className="text-sm text-muted-foreground">
                      Registrar ações para auditoria e compliance
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.auditLogging}
                    onCheckedChange={(checked) => 
                      setPrivacySettings({...privacySettings, auditLogging: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Análise de Dados</p>
                    <p className="text-sm text-muted-foreground">
                      Permitir uso de dados para análises e melhorias
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.dataAnalytics}
                    onCheckedChange={(checked) => 
                      setPrivacySettings({...privacySettings, dataAnalytics: checked})
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold">Gerenciamento de Dados</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    Exportar Meus Dados
                  </Button>
                  <Button variant="outline" className="w-full">
                    Limpar Histórico de Atividades
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold">Políticas Corporativas</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    Ver Política de Privacidade
                  </Button>
                  <Button variant="outline" className="w-full">
                    Ver Termos de Uso Corporativo
                  </Button>
                </div>
              </div>

              <Button onClick={handlePrivacySave}>
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Configuracoes;

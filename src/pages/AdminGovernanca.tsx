import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  Settings, 
  Users, 
  Activity,
  Clock,
  Ban,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const AdminGovernanca = () => {
  const [selectedTab, setSelectedTab] = useState('overview');

  // Buscar logs de auditoria
  const { data: auditLogs, isLoading: loadingAudit } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('global_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data;
    }
  });

  // Buscar alertas de segurança
  const { data: securityAlerts, isLoading: loadingAlerts } = useQuery({
    queryKey: ['security-alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('security_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data;
    }
  });

  // Buscar configurações protegidas
  const { data: protectedSettings, isLoading: loadingSettings } = useQuery({
    queryKey: ['protected-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('protected_settings')
        .select('*')
        .order('setting_key');
      
      if (error) throw error;
      return data;
    }
  });

  // Buscar intervenções da plataforma
  const { data: interventions, isLoading: loadingInterventions } = useQuery({
    queryKey: ['platform-interventions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('platform_interventions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data;
    }
  });

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getSeverityIcon = (level: string) => {
    switch (level) {
      case 'critical': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <CheckCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loadingAudit || loadingAlerts || loadingSettings || loadingInterventions) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Carregando dados de governança...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          Governança e Auditoria
        </h1>
        <p className="text-muted-foreground mt-2">
          Controles de segurança, auditoria e conformidade da plataforma
        </p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="audit">Logs de Auditoria</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
          <TabsTrigger value="interventions">Intervenções</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Eventos Críticos</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {auditLogs?.filter(log => log.risk_level === 'critical').length || 0}
                </div>
                <p className="text-xs text-muted-foreground">Últimas 24h</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Alertas Ativos</CardTitle>
                <Ban className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {securityAlerts?.filter(alert => !alert.auto_resolved && !alert.resolved_at).length || 0}
                </div>
                <p className="text-xs text-muted-foreground">Não resolvidos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Configurações Críticas</CardTitle>
                <Settings className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {protectedSettings?.filter(setting => setting.protection_level === 'critical').length || 0}
                </div>
                <p className="text-xs text-muted-foreground">Protegidas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Intervenções</CardTitle>
                <Eye className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {interventions?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">Total registradas</p>
              </CardContent>
            </Card>
          </div>

          {/* Alertas mais recentes */}
          <Card>
            <CardHeader>
              <CardTitle>Alertas Recentes</CardTitle>
              <CardDescription>Últimos 10 alertas de segurança</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {securityAlerts?.slice(0, 10).map((alert) => (
                  <Alert key={alert.id}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getSeverityIcon(alert.severity)}
                        <span className="font-medium">{alert.description}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getRiskBadgeColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(alert.created_at), 'dd/MM HH:mm', { locale: ptBR })}
                        </span>
                      </div>
                    </div>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Log de Auditoria Global</CardTitle>
              <CardDescription>
                Registro imutável de todas as ações críticas na plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Ação</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Risco</TableHead>
                    <TableHead>Detalhes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs?.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs">
                        {format(new Date(log.created_at), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.user_type}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{log.action}</TableCell>
                      <TableCell>{log.event_type}</TableCell>
                      <TableCell>
                        <Badge variant={getRiskBadgeColor(log.risk_level)}>
                          {log.risk_level}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {log.target_table && (
                          <span className="text-xs text-muted-foreground">
                            {log.target_table}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alertas de Segurança</CardTitle>
              <CardDescription>
                Monitoramento automático de atividades suspeitas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Severidade</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Workspace</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {securityAlerts?.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getSeverityIcon(alert.severity)}
                          <Badge variant={getRiskBadgeColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{alert.alert_type}</TableCell>
                      <TableCell className="max-w-md">{alert.description}</TableCell>
                      <TableCell>
                        {alert.workspace_id ? (
                          <Badge variant="outline">{alert.workspace_id.slice(0, 8)}...</Badge>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        {alert.resolved_at ? (
                          <Badge variant="secondary">Resolvido</Badge>
                        ) : (
                          <Badge variant="destructive">Ativo</Badge>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {format(new Date(alert.created_at), 'dd/MM HH:mm', { locale: ptBR })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Protegidas</CardTitle>
              <CardDescription>
                Configurações críticas do sistema que requerem permissões especiais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Chave</TableHead>
                    <TableHead>Valor Atual</TableHead>
                    <TableHead>Proteção</TableHead>
                    <TableHead>Super Admin</TableHead>
                    <TableHead>Última Alteração</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {protectedSettings?.map((setting) => (
                    <TableRow key={setting.id}>
                      <TableCell className="font-mono text-sm">{setting.setting_key}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {JSON.stringify(setting.setting_value)}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRiskBadgeColor(setting.protection_level)}>
                          {setting.protection_level}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {setting.requires_super_admin ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-gray-400" />
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {setting.last_changed_at ? 
                          format(new Date(setting.last_changed_at), 'dd/MM/yyyy', { locale: ptBR }) 
                          : 'Nunca'
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interventions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Intervenções da Plataforma</CardTitle>
              <CardDescription>
                Histórico de intervenções técnicas realizadas pela equipe SourceXpress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Workspace Alvo</TableHead>
                    <TableHead>Razão</TableHead>
                    <TableHead>Impacto</TableHead>
                    <TableHead>Cliente Notificado</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {interventions?.map((intervention) => (
                    <TableRow key={intervention.id}>
                      <TableCell>
                        <Badge variant="outline">{intervention.intervention_type}</Badge>
                      </TableCell>
                      <TableCell>
                        {intervention.target_workspace_id ? (
                          <Badge variant="secondary">
                            {intervention.target_workspace_id.slice(0, 8)}...
                          </Badge>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="max-w-md">{intervention.reason}</TableCell>
                      <TableCell>
                        <Badge variant={getRiskBadgeColor(intervention.impact_level)}>
                          {intervention.impact_level}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {intervention.client_notified ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {format(new Date(intervention.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminGovernanca;
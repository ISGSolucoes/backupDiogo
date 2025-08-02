
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ExpandedDialog } from '@/components/ui/expanded-dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User, Clock, Shield } from 'lucide-react';
import { useFullscreenModal } from '@/hooks/useFullscreenModal';

interface User {
  id: string;
  nome_completo: string;
  email: string;
  area: string;
  cargo?: string;
}

interface Props {
  user: User;
  onClose: () => void;
}

export const UserPermissionModal = ({ user, onClose }: Props) => {
  const { isFullscreen, toggleFullscreen } = useFullscreenModal();
  // Buscar permissões detalhadas do usuário
  const { data: permissions = [], isLoading } = useQuery({
    queryKey: ['user-permissions-detailed', user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('module_permissions')
        .select(`
          *,
          modules!inner(name, type)
        `)
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) throw error;
      return data;
    },
  });

  // Buscar histórico de mudanças (audit log)
  const { data: auditLog = [] } = useQuery({
    queryKey: ['user-audit-log', user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('global_audit_log')
        .select('*')
        .eq('user_id', user.id)
        .eq('event_type', 'permission_change')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
  });

  return (
    <ExpandedDialog
      open={true}
      onOpenChange={() => onClose()}
      title="Detalhes de Permissões"
      description={`Visualização completa das permissões de ${user.nome_completo}`}
      fullscreen={isFullscreen}
      onToggleFullscreen={toggleFullscreen}
    >

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6">
            {/* Informações do Usuário */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="font-semibold">{user.nome_completo}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline">{user.area}</Badge>
                {user.cargo && <Badge variant="secondary">{user.cargo}</Badge>}
              </div>
            </div>

            {/* Permissões Ativas */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Módulos com Acesso ({permissions.length})
              </h3>
              
              {isLoading ? (
                <div className="text-center py-4">Carregando permissões...</div>
              ) : permissions.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  Nenhuma permissão configurada
                </div>
              ) : (
                <div className="space-y-3">
                  {permissions.map((permission) => (
                    <div key={permission.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{permission.modules?.name}</div>
                        {permission.real_role && (
                          <Badge variant="outline">{permission.real_role}</Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-medium text-muted-foreground mb-1">
                            Permissões Funcionais:
                          </div>
                          <div className="space-y-1">
                            {Object.entries(permission.functional_permissions || {})
                              .filter(([_, value]) => value)
                              .map(([key]) => (
                                <Badge key={key} variant="secondary" className="text-xs mr-1 mb-1">
                                  {key.replace('_', ' ')}
                                </Badge>
                              ))}
                          </div>
                        </div>
                        
                        <div>
                          <div className="font-medium text-muted-foreground mb-1">
                            Escopo de Visibilidade:
                          </div>
                          <div className="space-y-1">
                            {Object.entries(permission.visibility_scope || {})
                              .map(([context, scope]) => (
                                <div key={context} className="text-xs">
                                  <Badge variant="outline" className="mr-1">
                                    {context}
                                  </Badge>
                                  {scope as string}
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>

                      {(permission.category_access?.length > 0 || permission.unit_access?.length > 0) && (
                        <div className="mt-3 pt-3 border-t">
                          {permission.category_access?.length > 0 && (
                            <div className="text-xs">
                              <span className="font-medium">Categorias: </span>
                              {permission.category_access.join(', ')}
                            </div>
                          )}
                          {permission.unit_access?.length > 0 && (
                            <div className="text-xs mt-1">
                              <span className="font-medium">Unidades: </span>
                              {permission.unit_access.join(', ')}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Histórico de Mudanças */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Histórico Recente
              </h3>
              
              {auditLog.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  Nenhuma mudança registrada
                </div>
              ) : (
                <div className="space-y-2">
                  {auditLog.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 bg-muted/30 rounded">
                      <div>
                        <div className="font-medium text-sm">{log.action}</div>
                        <div className="text-xs text-muted-foreground">
                          {log.risk_level && (
                            <Badge variant="outline" className="mr-2">
                              {log.risk_level}
                            </Badge>
                          )}
                          {new Date(log.created_at).toLocaleString('pt-BR')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
    </ExpandedDialog>
  );
};

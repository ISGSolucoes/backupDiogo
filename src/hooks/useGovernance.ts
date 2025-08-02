import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AuditEvent {
  id: string;
  event_type: string;
  action: string;
  user_id: string;
  user_type: string;
  workspace_id?: string;
  module_id?: string;
  target_table?: string;
  target_id?: string;
  old_data?: any;
  new_data?: any;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  created_at: string;
}

export interface SecurityAlert {
  id: string;
  alert_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  workspace_id?: string;
  user_id?: string;
  description: string;
  details?: any;
  auto_resolved: boolean;
  resolved_by?: string;
  resolved_at?: string;
  created_at: string;
}

export interface ProtectedSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  protection_level: 'low' | 'medium' | 'high' | 'critical';
  requires_confirmation: boolean;
  requires_super_admin: boolean;
  last_changed_by?: string;
  last_changed_at?: string;
  change_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface PlatformIntervention {
  id: string;
  intervention_type: string;
  super_admin_id: string;
  target_workspace_id?: string;
  target_user_id?: string;
  reason: string;
  actions_taken?: any;
  client_notified: boolean;
  notification_sent_at?: string;
  resolved_at?: string;
  impact_level: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
}

export const useGovernance = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar logs de auditoria
  const useAuditLogs = (filters?: {
    event_type?: string;
    risk_level?: string;
    user_type?: string;
    workspace_id?: string;
    limit?: number;
  }) => {
    return useQuery({
      queryKey: ['audit-logs', filters],
      queryFn: async () => {
        let query = supabase
          .from('global_audit_log')
          .select('*')
          .order('created_at', { ascending: false });

        if (filters?.event_type) {
          query = query.eq('event_type', filters.event_type);
        }
        if (filters?.risk_level) {
          query = query.eq('risk_level', filters.risk_level);
        }
        if (filters?.user_type) {
          query = query.eq('user_type', filters.user_type);
        }
        if (filters?.workspace_id) {
          query = query.eq('workspace_id', filters.workspace_id);
        }

        query = query.limit(filters?.limit || 100);

        const { data, error } = await query;
        if (error) throw error;
        return data as AuditEvent[];
      }
    });
  };

  // Buscar alertas de segurança
  const useSecurityAlerts = (filters?: {
    severity?: string;
    alert_type?: string;
    resolved?: boolean;
    workspace_id?: string;
  }) => {
    return useQuery({
      queryKey: ['security-alerts', filters],
      queryFn: async () => {
        let query = supabase
          .from('security_alerts')
          .select('*')
          .order('created_at', { ascending: false });

        if (filters?.severity) {
          query = query.eq('severity', filters.severity);
        }
        if (filters?.alert_type) {
          query = query.eq('alert_type', filters.alert_type);
        }
        if (filters?.resolved !== undefined) {
          if (filters.resolved) {
            query = query.not('resolved_at', 'is', null);
          } else {
            query = query.is('resolved_at', null);
          }
        }
        if (filters?.workspace_id) {
          query = query.eq('workspace_id', filters.workspace_id);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data as SecurityAlert[];
      }
    });
  };

  // Buscar configurações protegidas
  const useProtectedSettings = () => {
    return useQuery({
      queryKey: ['protected-settings'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('protected_settings')
          .select('*')
          .order('setting_key');
        
        if (error) throw error;
        return data as ProtectedSetting[];
      }
    });
  };

  // Buscar intervenções da plataforma
  const usePlatformInterventions = () => {
    return useQuery({
      queryKey: ['platform-interventions'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('platform_interventions')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data as PlatformIntervention[];
      }
    });
  };

  // Verificar se usuário é super admin
  const useIsSuperAdmin = () => {
    return useQuery({
      queryKey: ['is-super-admin'],
      queryFn: async () => {
        const { data, error } = await supabase.rpc('is_super_admin');
        if (error) throw error;
        return data as boolean;
      }
    });
  };

  // Registrar evento de auditoria
  const useRegisterAuditEvent = () => {
    return useMutation({
      mutationFn: async (params: {
        event_type: string;
        action: string;
        user_id: string;
        user_type: string;
        workspace_id?: string;
        module_id?: string;
        target_table?: string;
        target_id?: string;
        old_data?: any;
        new_data?: any;
        risk_level?: string;
      }) => {
        const { data, error } = await supabase.rpc('register_audit_event', {
          p_event_type: params.event_type,
          p_action: params.action,
          p_user_id: params.user_id,
          p_user_type: params.user_type,
          p_workspace_id: params.workspace_id,
          p_module_id: params.module_id,
          p_target_table: params.target_table,
          p_target_id: params.target_id,
          p_old_data: params.old_data,
          p_new_data: params.new_data,
          p_risk_level: params.risk_level || 'low'
        });
        
        if (error) throw error;
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
      }
    });
  };

  // Criar alerta de segurança
  const useCreateSecurityAlert = () => {
    return useMutation({
      mutationFn: async (params: {
        alert_type: string;
        severity: string;
        workspace_id?: string;
        user_id?: string;
        description: string;
        details?: any;
      }) => {
        const { data, error } = await supabase
          .from('security_alerts')
          .insert([params])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['security-alerts'] });
        toast({
          title: "Alerta criado",
          description: "Alerta de segurança registrado com sucesso.",
        });
      },
      onError: (error) => {
        toast({
          title: "Erro ao criar alerta",
          description: "Não foi possível registrar o alerta de segurança.",
          variant: "destructive",
        });
      }
    });
  };

  // Resolver alerta de segurança
  const useResolveSecurityAlert = () => {
    return useMutation({
      mutationFn: async (params: {
        alert_id: string;
        resolved_by: string;
      }) => {
        const { data, error } = await supabase
          .from('security_alerts')
          .update({
            resolved_by: params.resolved_by,
            resolved_at: new Date().toISOString()
          })
          .eq('id', params.alert_id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['security-alerts'] });
        toast({
          title: "Alerta resolvido",
          description: "Alerta de segurança marcado como resolvido.",
        });
      }
    });
  };

  // Verificar se pode alterar configuração
  const useCanChangeSetting = (settingKey: string) => {
    return useQuery({
      queryKey: ['can-change-setting', settingKey],
      queryFn: async () => {
        const { data, error } = await supabase.rpc('can_change_setting', {
          p_setting_key: settingKey
        });
        if (error) throw error;
        return data as boolean;
      },
      enabled: !!settingKey
    });
  };

  // Atualizar configuração protegida
  const useUpdateProtectedSetting = () => {
    return useMutation({
      mutationFn: async (params: {
        setting_key: string;
        setting_value: any;
        change_reason?: string;
      }) => {
        // Primeiro verificar se pode alterar
        const { data: canChange, error: checkError } = await supabase.rpc('can_change_setting', {
          p_setting_key: params.setting_key
        });
        
        if (checkError) throw checkError;
        if (!canChange) throw new Error('Permissão negada para alterar esta configuração');

        const { data, error } = await supabase
          .from('protected_settings')
          .update({
            setting_value: params.setting_value,
            change_reason: params.change_reason,
            last_changed_at: new Date().toISOString()
          })
          .eq('setting_key', params.setting_key)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['protected-settings'] });
        toast({
          title: "Configuração atualizada",
          description: "Configuração protegida alterada com sucesso.",
        });
      },
      onError: (error) => {
        toast({
          title: "Erro ao atualizar",
          description: error.message || "Não foi possível alterar a configuração.",
          variant: "destructive",
        });
      }
    });
  };

  return {
    useAuditLogs,
    useSecurityAlerts,
    useProtectedSettings,
    usePlatformInterventions,
    useIsSuperAdmin,
    useRegisterAuditEvent,
    useCreateSecurityAlert,
    useResolveSecurityAlert,
    useCanChangeSetting,
    useUpdateProtectedSetting
  };
};
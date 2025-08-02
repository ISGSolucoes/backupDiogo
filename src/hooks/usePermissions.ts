import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { FunctionalAction, VisibilityContext, UserPermissions } from '@/types/permissions';

export const usePermissions = () => {
  const { user } = useAuth();

  const { data: permissions = [], isLoading } = useQuery({
    queryKey: ['user-permissions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('module_permissions')
        .select(`
          *,
          modules!inner(name, type, status)
        `)
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) throw error;
      return data as any[];
    },
    enabled: !!user?.id,
  });

  const { data: userRoles = [], isLoading: isLoadingRoles } = useQuery({
    queryKey: ['user-roles', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: activeModules = [], isLoading: isLoadingModules } = useQuery({
    queryKey: ['active-modules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .eq('status', 'ativo');

      if (error) throw error;
      return data;
    },
  });

  // Verificar se pode executar uma ação específica
  const canDo = (action: FunctionalAction, moduleType?: string): boolean => {
    if (!permissions.length) return false;
    
    const relevantPermissions = moduleType 
      ? permissions.filter(p => p.modules?.type === moduleType)
      : permissions;

    return relevantPermissions.some(permission => 
      permission.functional_permissions?.[action] === true
    );
  };

  // Verificar escopo de visibilidade para um contexto
  const canSee = (context: VisibilityContext, scope: string = 'own_only', moduleType?: string): boolean => {
    if (!permissions.length) return false;
    
    const relevantPermissions = moduleType 
      ? permissions.filter(p => p.modules?.type === moduleType)
      : permissions;

    return relevantPermissions.some(permission => {
      const userScope = permission.visibility_scope?.[context];
      if (!userScope) return scope === 'own_only';
      
      // Hierarquia de escopos: own_only < unit_only < category_only < area_only < all
      const scopeHierarchy = ['own_only', 'unit_only', 'category_only', 'area_only', 'all'];
      const userLevel = scopeHierarchy.indexOf(userScope);
      const requiredLevel = scopeHierarchy.indexOf(scope);
      
      return userLevel >= requiredLevel;
    });
  };

  // Verificar se tem acesso a um módulo específico
  const hasModuleAccess = (moduleType: string): boolean => {
    return activeModules.some(module => module.type === moduleType) &&
           permissions.some(p => p.modules?.type === moduleType);
  };

  // Obter categorias acessíveis pelo usuário
  const getAccessibleCategories = (moduleType?: string): string[] => {
    const relevantPermissions = moduleType 
      ? permissions.filter(p => p.modules?.type === moduleType)
      : permissions;

    const categories = new Set<string>();
    relevantPermissions.forEach(permission => {
      permission.category_access?.forEach(cat => categories.add(cat));
    });
    
    return Array.from(categories);
  };

  // Obter unidades acessíveis pelo usuário
  const getAccessibleUnits = (moduleType?: string): string[] => {
    const relevantPermissions = moduleType 
      ? permissions.filter(p => p.modules?.type === moduleType)
      : permissions;

    const units = new Set<string>();
    relevantPermissions.forEach(permission => {
      permission.unit_access?.forEach(unit => units.add(unit));
    });
    
    return Array.from(units);
  };

  // Obter cargo real do usuário para um módulo
  const getRealRole = (moduleType: string): string | null => {
    const permission = permissions.find(p => p.modules?.type === moduleType);
    return permission?.real_role || null;
  };

  // Verificar se é admin do sistema
  const isAdmin = (): boolean => {
    return userRoles.some(role => role.role === 'admin');
  };

  return {
    permissions,
    activeModules,
    isLoading: isLoading || isLoadingModules || isLoadingRoles,
    canDo,
    canSee,
    hasModuleAccess,
    getAccessibleCategories,
    getAccessibleUnits,
    getRealRole,
    isAdmin
  };
};
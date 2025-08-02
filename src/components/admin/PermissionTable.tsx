
import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Search, Users, Settings2, Eye, AlertTriangle, RefreshCw, User } from 'lucide-react';
import { UserPermissionModal } from './UserPermissionModal';
import { BatchActionsModal } from './BatchActionsModal';
import { useAuth } from '@/contexts/AuthContext';

interface User {
  id: string;
  nome_completo: string;
  email: string;
  area: string;
  cargo?: string;
}

interface Module {
  id: string;
  name: string;
  type: string;
}

interface UserPermission {
  user_id: string;
  module_id: string;
  real_role?: string;
  is_active: boolean;
}

export const PermissionTable = () => {
  const { user: currentUser, profile: currentProfile, loading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [areaFilter, setAreaFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showBatchActions, setShowBatchActions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const queryClient = useQueryClient();

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL LOGIC

  // Verificar se o usuário atual tem permissões de admin
  const { data: isCurrentUserAdmin, isLoading: isLoadingAdmin, error: adminError } = useQuery({
    queryKey: ['is-admin', currentUser?.id],
    queryFn: async () => {
      if (!currentUser?.id) {
        console.log('No current user ID, returning false');
        return false;
      }
      
      console.log('Checking admin status for user:', currentUser.id);
      
      const { data, error } = await supabase.rpc('is_admin', { 
        _user_id: currentUser.id 
      });
      
      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
      
      console.log('Admin check result:', data);
      return data || false;
    },
    enabled: !!currentUser?.id && !authLoading,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Buscar usuários com tratamento de erro melhorado
  const { data: users = [], isLoading: isLoadingUsers, error: usersError } = useQuery({
    queryKey: ['users-permissions-table'],
    queryFn: async () => {
      console.log('Fetching users...');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, nome_completo, email, area, cargo')
        .order('nome_completo');

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      
      console.log('Users fetched:', data?.length || 0);
      return data as User[];
    },
    enabled: isCurrentUserAdmin === true,
    retry: 3,
    retryDelay: 1000,
  });

  // Buscar módulos ativos
  const { data: modules = [], isLoading: isLoadingModules, error: modulesError } = useQuery({
    queryKey: ['active-modules-table'],
    queryFn: async () => {
      console.log('Fetching modules...');
      
      const { data, error } = await supabase
        .from('modules')
        .select('id, name, type')
        .eq('status', 'ativo')
        .order('name');

      if (error) {
        console.error('Error fetching modules:', error);
        throw error;
      }
      
      console.log('Modules fetched:', data?.length || 0);
      return data as Module[];
    },
    enabled: isCurrentUserAdmin === true,
    retry: 3,
    retryDelay: 1000,
  });

  // Buscar todas as permissões
  const { data: allPermissions = [], isLoading: isLoadingPermissions, error: permissionsError } = useQuery({
    queryKey: ['all-user-permissions'],
    queryFn: async () => {
      console.log('Fetching permissions...');
      
      const { data, error } = await supabase
        .from('module_permissions')
        .select('user_id, module_id, real_role, is_active')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching permissions:', error);
        throw error;
      }
      
      console.log('Permissions fetched:', data?.length || 0);
      return data as UserPermission[];
    },
    enabled: isCurrentUserAdmin === true,
    retry: 3,
    retryDelay: 1000,
  });

  // Toggle permissão de usuário
  const togglePermissionMutation = useMutation({
    mutationFn: async ({ userId, moduleId, enable }: { userId: string; moduleId: string; enable: boolean }) => {
      if (enable) {
        const { error } = await supabase
          .from('module_permissions')
          .insert({
            user_id: userId,
            module_id: moduleId,
            role: 'user',
            functional_permissions: { read: true },
            visibility_scope: { suppliers: 'own_only' },
            real_role: 'Usuário'
          });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('module_permissions')
          .delete()
          .eq('user_id', userId)
          .eq('module_id', moduleId);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-user-permissions'] });
      toast.success('Permissão atualizada com sucesso!');
    },
    onError: (error) => {
      console.error('Permission toggle error:', error);
      toast.error('Erro ao atualizar permissão: ' + error.message);
    },
  });

  // Buscar áreas únicas
  const areas = useMemo(() => {
    const uniqueAreas = [...new Set(users.map(user => user.area))];
    return uniqueAreas.sort();
  }, [users]);

  // Filtrar usuários
  const filteredUsers = useMemo(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (areaFilter !== 'all') {
      filtered = filtered.filter(user => user.area === areaFilter);
    }

    return filtered;
  }, [users, searchTerm, areaFilter]);

  // Paginação
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Estados de carregamento e erro (AFTER ALL HOOKS)
  const isLoading = authLoading || isLoadingAdmin || isLoadingUsers || isLoadingModules || isLoadingPermissions;
  const hasError = adminError || usersError || modulesError || permissionsError;

  // Debug logs
  console.log('=== PermissionTable Debug ===');
  console.log('Current user:', currentUser?.id, currentUser?.email);
  console.log('Current profile:', currentProfile?.nome_completo);
  console.log('Auth loading:', authLoading);
  console.log('Is admin:', isCurrentUserAdmin);
  console.log('Is loading admin:', isLoadingAdmin);
  console.log('Admin error:', adminError);
  console.log('Final loading state:', isLoading);
  console.log('Has error:', hasError);

  // Aguardar carregamento da autenticação
  if (authLoading) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Carregando...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Verificando autenticação...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Aguardar verificação de admin
  if (isLoadingAdmin) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Verificando Permissões</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Verificando permissões administrativas...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mostrar erro se houver
  if (hasError) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Erro ao Carregar Dados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Não foi possível carregar os dados necessários. Verifique suas permissões e tente novamente.
              <br />
              <br />
              Detalhes do erro:
              <ul className="mt-2 list-disc list-inside">
                {adminError && <li>Erro ao verificar admin: {adminError.message}</li>}
                {usersError && <li>Erro ao carregar usuários: {usersError.message}</li>}
                {modulesError && <li>Erro ao carregar módulos: {modulesError.message}</li>}
                {permissionsError && <li>Erro ao carregar permissões: {permissionsError.message}</li>}
              </ul>
            </AlertDescription>
          </Alert>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
            variant="outline"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar Novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Mostrar informações se não for admin
  if (isCurrentUserAdmin === false) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Acesso Restrito
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Você não tem permissões administrativas para acessar esta página.
              <br />
              <br />
              Usuário atual: {currentProfile?.nome_completo || currentUser?.email}
              <br />
              Email: {currentUser?.email}
              <br />
              Status de admin: {isCurrentUserAdmin ? 'Sim' : 'Não'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Verificar se usuário tem permissão em módulo
  const hasPermission = (userId: string, moduleId: string) => {
    return allPermissions.some(p => p.user_id === userId && p.module_id === moduleId);
  };

  // Obter papel do usuário em módulo
  const getUserRole = (userId: string, moduleId: string) => {
    const permission = allPermissions.find(p => p.user_id === userId && p.module_id === moduleId);
    return permission?.real_role || '';
  };

  // Selecionar todos usuários visíveis
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(paginatedUsers.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  // Selecionar usuário individual
  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Debug info */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-sm">Debug Info</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <div>Usuário atual: {currentUser?.email}</div>
          <div>É admin: {isCurrentUserAdmin ? 'Sim' : 'Não'}</div>
          <div>Usuários carregados: {users.length}</div>
          <div>Módulos carregados: {modules.length}</div>
          <div>Permissões carregadas: {allPermissions.length}</div>
          <div>Carregando: {isLoading ? 'Sim' : 'Não'}</div>
        </CardContent>
      </Card>

      {/* Cabeçalho e Filtros */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Gerenciar Permissões</h1>
            <Badge variant="secondary">{filteredUsers.length} usuários</Badge>
          </div>
          
          {selectedUsers.length > 0 && (
            <Button 
              onClick={() => setShowBatchActions(true)}
              className="flex items-center gap-2"
            >
              <Settings2 className="h-4 w-4" />
              Ações em Lote ({selectedUsers.length})
            </Button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar usuário por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={areaFilter} onValueChange={setAreaFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por área" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as áreas</SelectItem>
              {areas.map((area) => (
                <SelectItem key={area} value={area}>{area}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabela ou Estado de Carregamento */}
      {isLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Carregando dados...</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Área</TableHead>
                <TableHead>Cargo</TableHead>
                {modules.map((module) => (
                  <TableHead key={module.id} className="text-center min-w-32">
                    {module.name}
                  </TableHead>
                ))}
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={modules.length + 5} className="text-center py-8">
                    Nenhum usuário encontrado
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.nome_completo}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{user.area}</TableCell>
                    <TableCell>{user.cargo || '-'}</TableCell>
                    {modules.map((module) => {
                      const hasAccess = hasPermission(user.id, module.id);
                      const role = getUserRole(user.id, module.id);
                      
                      return (
                        <TableCell key={module.id} className="text-center">
                          <div className="flex flex-col items-center gap-1">
                            <Switch
                              checked={hasAccess}
                              onCheckedChange={(checked) => 
                                togglePermissionMutation.mutate({
                                  userId: user.id,
                                  moduleId: module.id,
                                  enable: checked
                                })
                              }
                              disabled={togglePermissionMutation.isPending}
                            />
                            {role && (
                              <span className="text-xs text-muted-foreground truncate max-w-24">
                                {role}
                              </span>
                            )}
                          </div>
                        </TableCell>
                      );
                    })}
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedUser(user)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredUsers.length)} de {filteredUsers.length} usuários
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <div className="text-sm py-2 px-3">
              Página {currentPage} de {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}

      {/* Modais */}
      {selectedUser && (
        <UserPermissionModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}

      {showBatchActions && (
        <BatchActionsModal
          selectedUserIds={selectedUsers}
          modules={modules}
          onClose={() => setShowBatchActions(false)}
          onComplete={() => {
            setSelectedUsers([]);
            setShowBatchActions(false);
          }}
        />
      )}
    </div>
  );
};

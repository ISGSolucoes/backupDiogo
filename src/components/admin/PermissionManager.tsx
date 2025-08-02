import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Search, Users, Settings, Shield } from 'lucide-react';
import type { FunctionalPermissions, VisibilityScope, RoleTemplate } from '@/types/permissions';

interface User {
  id: string;
  nome_completo: string;
  email: string;
  area: string;
  cargo?: string;
}

export const PermissionManager = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  // Buscar usuários
  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users-for-permissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, nome_completo, email, area, cargo')
        .order('nome_completo');

      if (error) throw error;
      return data as User[];
    },
  });

  // Buscar módulos ativos
  const { data: modules = [] } = useQuery({
    queryKey: ['active-modules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .eq('status', 'ativo')
        .order('name');

      if (error) throw error;
      return data;
    },
  });

  // Buscar templates de cargo
  const { data: roleTemplates = [] } = useQuery({
    queryKey: ['role-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('role_templates')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data as RoleTemplate[];
    },
  });

  // Buscar permissões do usuário selecionado
  const { data: userPermissions = [] } = useQuery({
    queryKey: ['user-permissions-detailed', selectedUser?.id],
    queryFn: async () => {
      if (!selectedUser?.id) return [];
      
      const { data, error } = await supabase
        .from('module_permissions')
        .select(`
          *,
          modules!inner(name, type)
        `)
        .eq('user_id', selectedUser.id);

      if (error) throw error;
      return data;
    },
    enabled: !!selectedUser?.id,
  });

  // Aplicar template de cargo
  const applyTemplateMutation = useMutation({
    mutationFn: async ({ 
      userId, 
      moduleId, 
      templateId, 
      categoryAccess = [], 
      unitAccess = [] 
    }: {
      userId: string;
      moduleId: string;
      templateId: string;
      categoryAccess?: string[];
      unitAccess?: string[];
    }) => {
      const { error } = await supabase.rpc('apply_role_template', {
        _user_id: userId,
        _module_id: moduleId,
        _template_id: templateId,
        _category_access: categoryAccess,
        _unit_access: unitAccess
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Template aplicado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['user-permissions-detailed'] });
    },
    onError: (error) => {
      toast.error('Erro ao aplicar template: ' + error.message);
    },
  });

  const filteredUsers = users.filter(user =>
    user.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Gerenciar Permissões</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Usuários */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Selecionar Usuário
            </CardTitle>
            <CardDescription>
              Escolha um usuário para configurar suas permissões
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar usuário..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedUser?.id === user.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="font-medium">{user.nome_completo}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                    <div className="text-xs text-muted-foreground">{user.area}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuração de Permissões */}
        {selectedUser && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Templates de Cargo
                </CardTitle>
                <CardDescription>
                  Aplicar template pré-configurado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {modules.map((module) => (
                    <div key={module.id} className="space-y-2">
                      <Label className="font-medium">
                        Módulo: {module.name}
                      </Label>
                      <Select
                        onValueChange={(templateId) => {
                          const template = roleTemplates.find(t => t.id === templateId);
                          if (template) {
                            applyTemplateMutation.mutate({
                              userId: selectedUser.id,
                              moduleId: module.id,
                              templateId: template.id,
                            });
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar template" />
                        </SelectTrigger>
                        <SelectContent>
                          {roleTemplates
                            .filter(t => t.module_type === module.type)
                            .map((template) => (
                              <SelectItem key={template.id} value={template.id}>
                                {template.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Permissões Atuais</CardTitle>
                <CardDescription>
                  Permissões ativas para {selectedUser.nome_completo}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userPermissions.map((permission) => (
                    <div key={permission.id} className="p-4 border rounded-lg">
                      <div className="font-medium mb-2">
                        {permission.modules?.name}
                      </div>
                      {permission.real_role && (
                        <div className="text-sm text-primary mb-2">
                          Cargo: {permission.real_role}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        {Object.entries(permission.functional_permissions || {})
                          .filter(([_, value]) => value)
                          .map(([key]) => key)
                          .join(', ') || 'Nenhuma permissão'}
                      </div>
                    </div>
                  ))}
                  
                  {userPermissions.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      Nenhuma permissão configurada
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};
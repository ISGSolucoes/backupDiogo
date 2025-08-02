
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Lock, Unlock, Key } from 'lucide-react';
import { EditUserModal } from './EditUserModal';
import { toast } from 'sonner';

interface UsersListProps {
  searchTerm: string;
  selectedArea: string;
  selectedStatus: string;
}

export const UsersList = ({ searchTerm, selectedArea, selectedStatus }: UsersListProps) => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-users', searchTerm, selectedArea, selectedStatus],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select(`
          *,
          user_roles!user_roles_user_id_fkey(role)
        `)
        .order('nome_completo');

      if (searchTerm) {
        query = query.or(`nome_completo.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }

      if (selectedArea) {
        query = query.eq('area', selectedArea);
      }

      if (selectedStatus) {
        query = query.eq('status', selectedStatus as 'ativo' | 'inativo' | 'pendente_ativacao');
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ativo' ? 'inativo' : 'ativo';
    
    const { error } = await supabase
      .from('profiles')
      .update({ status: newStatus as 'ativo' | 'inativo' | 'pendente_ativacao' })
      .eq('id', userId);

    if (error) {
      toast.error('Erro ao alterar status do usuário');
      return;
    }

    toast.success(`Usuário ${newStatus === 'ativo' ? 'ativado' : 'desativado'} com sucesso`);
    refetch();
  };

  const handleResetPassword = async (userId: string, email: string) => {
    const { error } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email,
    });

    if (error) {
      toast.error('Erro ao gerar link de recuperação');
      return;
    }

    toast.success('Link de recuperação enviado por email');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <Badge variant="default" className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'inativo':
        return <Badge variant="secondary">Inativo</Badge>;
      case 'pendente_ativacao':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700">Pendente</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRolesBadges = (userRoles: any[]) => {
    return userRoles?.map((ur, index) => (
      <Badge key={index} variant="outline" className="text-xs">
        {ur.role}
      </Badge>
    )) || [];
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando usuários...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-4">Usuário</th>
                  <th className="text-left p-4">Área</th>
                  <th className="text-left p-4">Cargo</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Roles</th>
                  <th className="text-left p-4">Último Acesso</th>
                  <th className="text-right p-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar_url} />
                          <AvatarFallback>
                            {user.nome_completo?.split(' ').map(n => n[0]).join('') || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.nome_completo}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{user.area}</td>
                    <td className="p-4">{user.cargo || '-'}</td>
                    <td className="p-4">{getStatusBadge(user.status)}</td>
                    <td className="p-4">
                      <div className="flex gap-1 flex-wrap">
                        {getRolesBadges(user.user_roles)}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {user.ultimo_acesso 
                        ? new Date(user.ultimo_acesso).toLocaleDateString('pt-BR')
                        : 'Nunca'
                      }
                    </td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user);
                              setShowEditModal(true);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleStatus(user.id, user.status)}
                          >
                            {user.status === 'ativo' ? (
                              <>
                                <Lock className="h-4 w-4 mr-2" />
                                Desativar
                              </>
                            ) : (
                              <>
                                <Unlock className="h-4 w-4 mr-2" />
                                Ativar
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleResetPassword(user.id, user.email)}
                          >
                            <Key className="h-4 w-4 mr-2" />
                            Resetar Senha
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <EditUserModal
        user={selectedUser}
        open={showEditModal}
        onOpenChange={setShowEditModal}
        onUserUpdated={refetch}
      />
    </>
  );
};


import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const editUserSchema = z.object({
  nome_completo: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  area: z.string().min(1, 'Área é obrigatória'),
  cargo: z.string().optional(),
  centro_custo: z.string().optional(),
  telefone: z.string().optional(),
  status: z.enum(['ativo', 'inativo', 'pendente_ativacao']),
  roles: z.array(z.enum(['solicitante', 'aprovador_nivel_1', 'aprovador_nivel_2', 'gestor', 'admin'])).min(1, 'Selecione pelo menos um papel'),
});

type EditUserForm = z.infer<typeof editUserSchema>;

interface EditUserModalProps {
  user: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdated: () => void;
}

export const EditUserModal = ({ user, open, onOpenChange, onUserUpdated }: EditUserModalProps) => {
  const [loading, setLoading] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const form = useForm<EditUserForm>({
    resolver: zodResolver(editUserSchema),
  });

  const areas = ['TI', 'Compras', 'Financeiro', 'RH', 'Operações'];
  const availableRoles = [
    { value: 'solicitante', label: 'Solicitante' },
    { value: 'aprovador_nivel_1', label: 'Aprovador Nível 1' },
    { value: 'aprovador_nivel_2', label: 'Aprovador Nível 2' },
    { value: 'gestor', label: 'Gestor' },
    { value: 'admin', label: 'Administrador' },
  ];

  useEffect(() => {
    if (user && open) {
      form.reset({
        nome_completo: user.nome_completo || '',
        area: user.area || '',
        cargo: user.cargo || '',
        centro_custo: user.centro_custo || '',
        telefone: user.telefone || '',
        status: user.status || 'ativo',
        roles: user.user_roles?.map((ur: any) => ur.role) || ['solicitante'],
      });
      setSelectedRoles(user.user_roles?.map((ur: any) => ur.role) || ['solicitante']);
    }
  }, [user, open, form]);

  const handleRoleChange = (roleValue: string, checked: boolean) => {
    let newRoles;
    if (checked) {
      newRoles = [...selectedRoles, roleValue];
    } else {
      newRoles = selectedRoles.filter(r => r !== roleValue);
    }
    setSelectedRoles(newRoles);
    form.setValue('roles', newRoles as any);
  };

  const onSubmit = async (data: EditUserForm) => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // Atualizar perfil
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          nome_completo: data.nome_completo,
          area: data.area,
          cargo: data.cargo,
          centro_custo: data.centro_custo,
          telefone: data.telefone,
          status: data.status,
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Atualizar roles
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', user.id);

      const roleInserts = data.roles.map(role => ({
        user_id: user.id,
        role: role as 'solicitante' | 'aprovador_nivel_1' | 'aprovador_nivel_2' | 'gestor' | 'admin',
      }));

      const { error: rolesError } = await supabase
        .from('user_roles')
        .insert(roleInserts);

      if (rolesError) throw rolesError;

      toast.success('Usuário atualizado com sucesso!');
      onUserUpdated();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Erro ao atualizar usuário:', error);
      toast.error('Erro ao atualizar usuário: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome_completo">Nome Completo *</Label>
              <Input
                id="nome_completo"
                {...form.register('nome_completo')}
                placeholder="Digite o nome completo"
              />
              {form.formState.errors.nome_completo && (
                <p className="text-sm text-red-600">{form.formState.errors.nome_completo.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user.email} disabled className="bg-muted" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="area">Área *</Label>
              <Select 
                value={form.watch('area')} 
                onValueChange={(value) => form.setValue('area', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a área" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.area && (
                <p className="text-sm text-red-600">{form.formState.errors.area.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo</Label>
              <Input
                id="cargo"
                {...form.register('cargo')}
                placeholder="Digite o cargo"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="centro_custo">Centro de Custo</Label>
              <Input
                id="centro_custo"
                {...form.register('centro_custo')}
                placeholder="Digite o centro de custo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                {...form.register('telefone')}
                placeholder="Digite o telefone"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={form.watch('status')} 
              onValueChange={(value) => form.setValue('status', value as 'ativo' | 'inativo' | 'pendente_ativacao')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
                <SelectItem value="pendente_ativacao">Pendente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Papéis no Sistema *</Label>
            <div className="grid grid-cols-2 gap-2">
              {availableRoles.map((role) => (
                <div key={role.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={role.value}
                    checked={selectedRoles.includes(role.value)}
                    onCheckedChange={(checked) => handleRoleChange(role.value, checked as boolean)}
                  />
                  <Label htmlFor={role.value} className="text-sm">
                    {role.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

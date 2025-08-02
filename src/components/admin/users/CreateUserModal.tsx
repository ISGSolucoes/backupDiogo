
import React, { useState } from 'react';
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

const createUserSchema = z.object({
  nome_completo: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  area: z.string().min(1, 'Área é obrigatória'),
  cargo: z.string().optional(),
  centro_custo: z.string().optional(),
  telefone: z.string().optional(),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  sendEmail: z.boolean().default(true),
  roles: z.array(z.enum(['solicitante', 'aprovador_nivel_1', 'aprovador_nivel_2', 'gestor', 'admin'])).min(1, 'Selecione pelo menos um papel'),
});

type CreateUserForm = z.infer<typeof createUserSchema>;

interface CreateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateUserModal = ({ open, onOpenChange }: CreateUserModalProps) => {
  const [loading, setLoading] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(['solicitante']);

  const form = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      sendEmail: true,
      roles: ['solicitante'],
    },
  });

  const areas = ['TI', 'Compras', 'Financeiro', 'RH', 'Operações'];
  const availableRoles = [
    { value: 'solicitante', label: 'Solicitante' },
    { value: 'aprovador_nivel_1', label: 'Aprovador Nível 1' },
    { value: 'aprovador_nivel_2', label: 'Aprovador Nível 2' },
    { value: 'gestor', label: 'Gestor' },
    { value: 'admin', label: 'Administrador' },
  ];

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

  const onSubmit = async (data: CreateUserForm) => {
    setLoading(true);
    
    try {
      // Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
        user_metadata: {
          nome_completo: data.nome_completo,
          area: data.area,
        },
      });

      if (authError) throw authError;

      // Atualizar perfil
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          nome_completo: data.nome_completo,
          area: data.area,
          cargo: data.cargo,
          centro_custo: data.centro_custo,
          telefone: data.telefone,
          status: 'ativo',
        })
        .eq('id', authData.user.id);

      if (profileError) throw profileError;

      // Limpar roles existentes e adicionar novos
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', authData.user.id);

      const roleInserts = data.roles.map(role => ({
        user_id: authData.user.id,
        role: role as 'solicitante' | 'aprovador_nivel_1' | 'aprovador_nivel_2' | 'gestor' | 'admin',
      }));

      const { error: rolesError } = await supabase
        .from('user_roles')
        .insert(roleInserts);

      if (rolesError) throw rolesError;

      // Enviar email de boas-vindas se solicitado
      if (data.sendEmail) {
        const { error: emailError } = await supabase.auth.admin.generateLink({
          type: 'recovery',
          email: data.email,
        });

        if (emailError) {
          console.warn('Erro ao enviar email:', emailError);
          toast.success('Usuário criado com sucesso! Avise-o sobre as credenciais.');
        } else {
          toast.success('Usuário criado e email de boas-vindas enviado!');
        }
      } else {
        toast.success('Usuário criado com sucesso!');
      }

      form.reset();
      setSelectedRoles(['solicitante']);
      onOpenChange(false);
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);
      toast.error('Erro ao criar usuário: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Criar Novo Usuário</DialogTitle>
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
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...form.register('email')}
                placeholder="Digite o email"
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="area">Área *</Label>
              <Select onValueChange={(value) => form.setValue('area', value)}>
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
            <Label htmlFor="password">Senha Inicial *</Label>
            <Input
              id="password"
              type="password"
              {...form.register('password')}
              placeholder="Digite a senha inicial"
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-600">{form.formState.errors.password.message}</p>
            )}
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

          <div className="flex items-center space-x-2">
            <Checkbox
              id="sendEmail"
              {...form.register('sendEmail')}
              defaultChecked={true}
            />
            <Label htmlFor="sendEmail" className="text-sm">
              Enviar email de boas-vindas com link para definir senha
            </Label>
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
              {loading ? 'Criando...' : 'Criar Usuário'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

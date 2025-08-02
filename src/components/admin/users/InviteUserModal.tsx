
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
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const inviteUserSchema = z.object({
  email: z.string().email('Email inválido'),
  nome_completo: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  area: z.string().min(1, 'Área é obrigatória'),
  cargo: z.string().optional(),
  mensagem_personalizada: z.string().optional(),
});

type InviteUserForm = z.infer<typeof inviteUserSchema>;

interface InviteUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const InviteUserModal = ({ open, onOpenChange }: InviteUserModalProps) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<InviteUserForm>({
    resolver: zodResolver(inviteUserSchema),
  });

  const areas = ['TI', 'Compras', 'Financeiro', 'RH', 'Operações'];

  const onSubmit = async (data: InviteUserForm) => {
    setLoading(true);
    
    try {
      // Verificar se email já tem conta
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', data.email)
        .single();

      if (existingProfile) {
        toast.error('Este email já possui uma conta no sistema');
        return;
      }

      // Verificar se já existe convite pendente
      const { data: existingInvite } = await supabase
        .from('user_invites')
        .select('id')
        .eq('email', data.email)
        .eq('status', 'enviado')
        .single();

      if (existingInvite) {
        toast.error('Já existe um convite pendente para este email');
        return;
      }

      // Criar convite na tabela user_invites
      const { data: invite, error: inviteError } = await supabase
        .from('user_invites')
        .insert({
          email: data.email,
          nome_completo: data.nome_completo,
          area: data.area,
          cargo: data.cargo,
          mensagem_personalizada: data.mensagem_personalizada,
          token: crypto.randomUUID(),
          data_expiracao: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'criado',
        })
        .select()
        .single();

      if (inviteError) throw inviteError;

      // Enviar email via edge function
      const { error: emailError } = await supabase.functions.invoke('send-invite-email', {
        body: {
          inviteId: invite.id,
          email: data.email,
          nome_completo: data.nome_completo,
          area: data.area,
          cargo: data.cargo,
          mensagem_personalizada: data.mensagem_personalizada,
          token: invite.token,
        },
      });

      if (emailError) {
        console.error('Erro ao enviar email:', emailError);
        toast.error('Convite criado, mas erro ao enviar email');
      } else {
        toast.success('Convite enviado com sucesso!');
      }
      
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Erro ao enviar convite:', error);
      toast.error('Erro ao enviar convite: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Convidar Usuário</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              {...form.register('email')}
              placeholder="Digite o email do usuário"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
            )}
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="mensagem_personalizada">Mensagem Personalizada</Label>
            <Textarea
              id="mensagem_personalizada"
              {...form.register('mensagem_personalizada')}
              placeholder="Adicione uma mensagem personalizada para o convite (opcional)"
              rows={3}
            />
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
              {loading ? 'Enviando...' : 'Enviar Convite'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

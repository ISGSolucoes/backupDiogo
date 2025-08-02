
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RefreshCw, Mail, Trash2, Copy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Invite {
  id: string;
  email: string;
  nome_completo: string;
  area: string;
  cargo?: string;
  status: string;
  token: string;
  data_envio: string;
  data_expiracao: string;
  data_aceite?: string;
}

export const InvitesList = () => {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvites();
  }, []);

  const fetchInvites = async () => {
    try {
      const { data, error } = await supabase
        .from('user_invites')
        .select('*')
        .order('data_envio', { ascending: false });

      if (error) throw error;
      setInvites(data || []);
    } catch (error) {
      console.error('Erro ao buscar convites:', error);
      toast.error('Erro ao carregar convites');
    } finally {
      setLoading(false);
    }
  };

  const resendInvite = async (invite: Invite) => {
    try {
      const { error } = await supabase.functions.invoke('send-invite-email', {
        body: {
          inviteId: invite.id,
          email: invite.email,
          nome_completo: invite.nome_completo,
          area: invite.area,
          cargo: invite.cargo,
          token: invite.token,
        },
      });

      if (error) throw error;
      toast.success('Convite reenviado com sucesso!');
    } catch (error) {
      console.error('Erro ao reenviar convite:', error);
      toast.error('Erro ao reenviar convite');
    }
  };

  const copyInviteLink = (token: string) => {
    const link = `${window.location.origin}/convite/${token}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copiado para área de transferência');
  };

  const cancelInvite = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_invites')
        .update({ status: 'cancelado' })
        .eq('id', id);

      if (error) throw error;
      toast.success('Convite cancelado');
      fetchInvites();
    } catch (error) {
      console.error('Erro ao cancelar convite:', error);
      toast.error('Erro ao cancelar convite');
    }
  };

  const getStatusBadge = (status: string, dataExpiracao: string) => {
    const isExpired = new Date(dataExpiracao) < new Date();
    
    if (isExpired && status === 'enviado') {
      return <Badge variant="destructive">Expirado</Badge>;
    }
    
    switch (status) {
      case 'enviado':
        return <Badge variant="default">Enviado</Badge>;
      case 'aceito':
        return <Badge variant="secondary">Aceito</Badge>;
      case 'cancelado':
        return <Badge variant="outline">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Convites Enviados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Convites Enviados</CardTitle>
        <Button variant="outline" size="sm" onClick={fetchInvites}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </CardHeader>
      <CardContent>
        {invites.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            Nenhum convite enviado ainda
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Área</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Enviado em</TableHead>
                <TableHead>Expira em</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invites.map((invite) => (
                <TableRow key={invite.id}>
                  <TableCell>{invite.nome_completo}</TableCell>
                  <TableCell>{invite.email}</TableCell>
                  <TableCell>{invite.area}</TableCell>
                  <TableCell>
                    {getStatusBadge(invite.status, invite.data_expiracao)}
                  </TableCell>
                  <TableCell>
                    {format(new Date(invite.data_envio), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    {format(new Date(invite.data_expiracao), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {invite.status === 'enviado' && new Date(invite.data_expiracao) > new Date() && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => resendInvite(invite)}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyInviteLink(invite.token)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => cancelInvite(invite.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

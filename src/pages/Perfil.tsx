
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePermissions } from '@/hooks/usePermissions';
import { User, Shield, Settings, Activity } from 'lucide-react';
import { toast } from 'sonner';

const Perfil = () => {
  const { profile, updateProfile } = useAuth();
  const { permissions } = usePermissions();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome_completo: profile?.nome_completo || '',
    telefone: profile?.telefone || '',
    area: profile?.area || '',
    cargo: profile?.cargo || '',
  });

  const handleSave = async () => {
    const { error } = await updateProfile(formData);
    if (error) {
      toast.error('Erro ao atualizar perfil');
    } else {
      toast.success('Perfil atualizado com sucesso');
      setIsEditing(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-2 mb-6">
        <User className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Meu Perfil</h1>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">Informações Pessoais</TabsTrigger>
          <TabsTrigger value="permissions">Permissões</TabsTrigger>
          <TabsTrigger value="activity">Atividades</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Dados Pessoais
              </CardTitle>
              <CardDescription>
                Gerencie suas informações pessoais e de contato
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="text-lg">
                    {profile?.nome_completo ? getInitials(profile.nome_completo) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{profile?.nome_completo}</h3>
                  <p className="text-muted-foreground">{profile?.email}</p>
                  <Badge variant="outline" className="mt-1">
                    {profile?.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
                <Button variant="outline" size="sm">
                  Alterar Foto
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    value={formData.nome_completo}
                    onChange={(e) => setFormData({...formData, nome_completo: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={profile?.email || ''}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area">Área</Label>
                  <Input
                    id="area"
                    value={formData.area}
                    onChange={(e) => setFormData({...formData, area: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cargo">Cargo</Label>
                  <Input
                    id="cargo"
                    value={formData.cargo}
                    onChange={(e) => setFormData({...formData, cargo: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="centro_custo">Centro de Custo</Label>
                  <Input
                    id="centro_custo"
                    value={profile?.centro_custo || ''}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave}>Salvar</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>Editar</Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Permissões e Acessos
              </CardTitle>
              <CardDescription>
                Visualize suas permissões e níveis de acesso no sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Roles</Label>
                  <div className="flex flex-wrap gap-2">
                    {profile?.roles?.length > 0 ? (
                      profile.roles.map((role) => (
                        <Badge key={role} variant="secondary">
                          {role}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">Nenhum role encontrado</span>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Limite de Aprovação</Label>
                  <div className="text-sm">
                    {profile?.limite_aprovacao 
                      ? `R$ ${profile.limite_aprovacao.toLocaleString('pt-BR')}`
                      : 'Sem limite definido'
                    }
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Permissões Funcionais</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${profile?.pode_criar_requisicoes ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="text-sm">Criar Requisições</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${profile?.pode_aprovar_nivel_1 ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="text-sm">Aprovar Nível 1</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${profile?.pode_aprovar_nivel_2 ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="text-sm">Aprovar Nível 2</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${profile?.pode_ver_todos ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="text-sm">Ver Todos os Dados</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Módulos Acessíveis</Label>
                <div className="grid grid-cols-3 gap-2">
                  {permissions && permissions.length > 0 ? (
                    permissions.map((permission) => (
                      <Badge key={permission.id} variant="outline">
                        {permission.modules?.name || 'Módulo sem nome'}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">Nenhum módulo encontrado</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Atividades Recentes
              </CardTitle>
              <CardDescription>
                Histórico das suas atividades no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Histórico de atividades será implementado em breve</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Perfil;

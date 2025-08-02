
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Download, Upload, UserPlus, Mail } from 'lucide-react';
import { UsersList } from '@/components/admin/users/UsersList';
import { CreateUserModal } from '@/components/admin/users/CreateUserModal';
import { InviteUserModal } from '@/components/admin/users/InviteUserModal';
import { BulkImportModal } from '@/components/admin/users/BulkImportModal';
import { InvitesList } from '@/components/admin/users/InvitesList';

const AdminUsuarios = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);

  const areas = ['TI', 'Compras', 'Financeiro', 'RH', 'Operações'];
  const statuses = ['ativo', 'inativo', 'pendente_ativacao'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gerenciar Usuários</h1>
          <p className="text-muted-foreground">
            Crie, convide e gerencie usuários do sistema
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowBulkImportModal(true)}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Importar
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2"
          >
            <Mail className="h-4 w-4" />
            Convidar
          </Button>
          
          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Criar Usuário
          </Button>
        </div>
      </div>

      <Tabs defaultValue="usuarios" className="w-full">
        <TabsList>
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
          <TabsTrigger value="convites">Convites</TabsTrigger>
        </TabsList>
        
        <TabsContent value="usuarios" className="space-y-6">
          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar usuários..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Todas as áreas</option>
                  {areas.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
                
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Todos os status</option>
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status === 'ativo' ? 'Ativo' : 
                       status === 'inativo' ? 'Inativo' : 'Pendente'}
                    </option>
                  ))}
                </select>
                
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Usuários */}
          <UsersList
            searchTerm={searchTerm}
            selectedArea={selectedArea}
            selectedStatus={selectedStatus}
          />
        </TabsContent>
        
        <TabsContent value="convites">
          <InvitesList />
        </TabsContent>
      </Tabs>

      {/* Modais */}
      <CreateUserModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
      
      <InviteUserModal
        open={showInviteModal}
        onOpenChange={setShowInviteModal}
      />
      
      <BulkImportModal
        open={showBulkImportModal}
        onOpenChange={setShowBulkImportModal}
      />
    </div>
  );
};

export default AdminUsuarios;

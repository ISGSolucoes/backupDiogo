
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ExpandedDialog } from '@/components/ui/expanded-dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Settings2, Users, CheckCircle2 } from 'lucide-react';
import { useFullscreenModal } from '@/hooks/useFullscreenModal';

interface Module {
  id: string;
  name: string;
  type: string;
}

interface Props {
  selectedUserIds: string[];
  modules: Module[];
  onClose: () => void;
  onComplete: () => void;
}

export const BatchActionsModal = ({ selectedUserIds, modules, onClose, onComplete }: Props) => {
  const { isFullscreen, toggleFullscreen } = useFullscreenModal();
  const [actionType, setActionType] = useState<'apply_template' | 'remove_access' | 'copy_permissions'>('apply_template');
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [sourceUserId, setSourceUserId] = useState<string>('');

  const queryClient = useQueryClient();

  // Buscar usuários selecionados
  const { data: selectedUsers = [] } = useQuery({
    queryKey: ['selected-users', selectedUserIds],
    queryFn: async () => {
      if (selectedUserIds.length === 0) return [];
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, nome_completo, email')
        .in('id', selectedUserIds);

      if (error) throw error;
      return data;
    },
    enabled: selectedUserIds.length > 0,
  });

  // Buscar templates disponíveis
  const { data: templates = [] } = useQuery({
    queryKey: ['role-templates-batch'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('role_templates')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      return data;
    },
  });

  // Executar ação em lote
  const batchActionMutation = useMutation({
    mutationFn: async () => {
      switch (actionType) {
        case 'apply_template':
          if (!selectedModule || !selectedTemplate) {
            throw new Error('Selecione um módulo e template');
          }

          // Aplicar template para todos os usuários selecionados
          for (const userId of selectedUserIds) {
            const { error } = await supabase.rpc('apply_role_template', {
              _user_id: userId,
              _module_id: selectedModule,
              _template_id: selectedTemplate,
            });
            if (error) throw error;
          }
          break;

        case 'remove_access':
          if (selectedModules.length === 0) {
            throw new Error('Selecione pelo menos um módulo');
          }

          // Remover acesso aos módulos selecionados
          const { error: removeError } = await supabase
            .from('module_permissions')
            .delete()
            .in('user_id', selectedUserIds)
            .in('module_id', selectedModules);

          if (removeError) throw removeError;
          break;

        case 'copy_permissions':
          if (!sourceUserId) {
            throw new Error('Selecione um usuário de origem');
          }

          // Buscar permissões do usuário origem
          const { data: sourcePermissions, error: fetchError } = await supabase
            .from('module_permissions')
            .select('*')
            .eq('user_id', sourceUserId)
            .eq('is_active', true);

          if (fetchError) throw fetchError;

          // Copiar para cada usuário selecionado
          for (const userId of selectedUserIds) {
            if (userId === sourceUserId) continue; // Pular o próprio usuário origem

            for (const permission of sourcePermissions || []) {
              const { error: insertError } = await supabase
                .from('module_permissions')
                .upsert({
                  user_id: userId,
                  module_id: permission.module_id,
                  role: permission.role,
                  functional_permissions: permission.functional_permissions,
                  visibility_scope: permission.visibility_scope,
                  category_access: permission.category_access,
                  unit_access: permission.unit_access,
                  real_role: permission.real_role,
                });

              if (insertError) throw insertError;
            }
          }
          break;
      }
    },
    onSuccess: () => {
      toast.success(`Ação aplicada com sucesso para ${selectedUserIds.length} usuários!`);
      queryClient.invalidateQueries({ queryKey: ['all-user-permissions'] });
      onComplete();
    },
    onError: (error) => {
      toast.error('Erro ao executar ação: ' + error.message);
    },
  });

  const handleModuleToggle = (moduleId: string, checked: boolean) => {
    if (checked) {
      setSelectedModules([...selectedModules, moduleId]);
    } else {
      setSelectedModules(selectedModules.filter(id => id !== moduleId));
    }
  };

  return (
    <ExpandedDialog
      open={true}
      onOpenChange={() => onClose()}
      title="Ações em Lote"
      description={`Aplicar mudanças para ${selectedUserIds.length} usuários selecionados`}
      fullscreen={isFullscreen}
      onToggleFullscreen={toggleFullscreen}
    >

        <div className="space-y-6">
          {/* Usuários Selecionados */}
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Usuários Selecionados ({selectedUserIds.length})
            </h3>
            <ScrollArea className="h-24 border rounded p-2">
              <div className="space-y-1">
                {selectedUsers.map((user) => (
                  <div key={user.id} className="text-sm">
                    {user.nome_completo} ({user.email})
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Tipo de Ação */}
          <div>
            <label className="font-semibold mb-2 block">Tipo de Ação</label>
            <Select value={actionType} onValueChange={(value) => setActionType(value as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apply_template">Aplicar Template de Cargo</SelectItem>
                <SelectItem value="remove_access">Remover Acesso a Módulos</SelectItem>
                <SelectItem value="copy_permissions">Copiar Permissões de Outro Usuário</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Configurações por Tipo de Ação */}
          {actionType === 'apply_template' && (
            <div className="space-y-4">
              <div>
                <label className="font-medium mb-2 block">Módulo</label>
                <Select value={selectedModule} onValueChange={setSelectedModule}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar módulo" />
                  </SelectTrigger>
                  <SelectContent>
                    {modules.map((module) => (
                      <SelectItem key={module.id} value={module.id}>
                        {module.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="font-medium mb-2 block">Template de Cargo</label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates
                      .filter(t => selectedModule ? t.module_type === modules.find(m => m.id === selectedModule)?.type : true)
                      .map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                          {template.description && (
                            <span className="text-muted-foreground"> - {template.description}</span>
                          )}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {actionType === 'remove_access' && (
            <div>
              <label className="font-medium mb-2 block">Módulos para Remover Acesso</label>
              <div className="space-y-2 border rounded p-3">
                {modules.map((module) => (
                  <div key={module.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={module.id}
                      checked={selectedModules.includes(module.id)}
                      onCheckedChange={(checked) => handleModuleToggle(module.id, checked as boolean)}
                    />
                    <label htmlFor={module.id} className="text-sm font-medium">
                      {module.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {actionType === 'copy_permissions' && (
            <div>
              <label className="font-medium mb-2 block">Copiar Permissões de:</label>
              <Select value={sourceUserId} onValueChange={setSourceUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar usuário origem" />
                </SelectTrigger>
                <SelectContent>
                  {selectedUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.nome_completo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Preview da Ação */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span className="font-medium">Preview da Ação:</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {actionType === 'apply_template' && selectedModule && selectedTemplate && (
                <>
                  Aplicar template "{templates.find(t => t.id === selectedTemplate)?.name}" 
                  no módulo "{modules.find(m => m.id === selectedModule)?.name}" 
                  para {selectedUserIds.length} usuários.
                </>
              )}
              {actionType === 'remove_access' && selectedModules.length > 0 && (
                <>
                  Remover acesso aos módulos: {selectedModules.map(id => modules.find(m => m.id === id)?.name).join(', ')} 
                  de {selectedUserIds.length} usuários.
                </>
              )}
              {actionType === 'copy_permissions' && sourceUserId && (
                <>
                  Copiar todas as permissões de "{selectedUsers.find(u => u.id === sourceUserId)?.nome_completo}" 
                  para {selectedUserIds.length - 1} outros usuários.
                </>
              )}
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={() => batchActionMutation.mutate()}
              disabled={batchActionMutation.isPending}
            >
              {batchActionMutation.isPending ? 'Executando...' : 'Executar Ação'}
            </Button>
          </div>
        </div>
    </ExpandedDialog>
  );
};

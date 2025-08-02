
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Filter, Layout, ArrowUpDown } from 'lucide-react';
import { FeedPreferences, useFeedPreferences } from '@/hooks/useFeedPreferences';
import { FeedFiltrosTab } from './config/FeedFiltrosTab';
import { FeedLayoutTab } from './config/FeedLayoutTab';
import { FeedOrdenacaoTab } from './config/FeedOrdenacaoTab';

interface FeedConfigModalProps {
  onPreferencesChange?: (preferences: FeedPreferences) => void;
}

export const FeedConfigModal = ({ onPreferencesChange }: FeedConfigModalProps) => {
  const { preferences, updatePreferences, resetPreferences } = useFeedPreferences();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('filtros');

  const handlePreferenceChange = (newPreferences: Partial<FeedPreferences>) => {
    updatePreferences(newPreferences);
    onPreferencesChange?.(preferences);
  };

  const handleReset = () => {
    resetPreferences();
    onPreferencesChange?.(preferences);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-xs">
          <Settings className="h-4 w-4 mr-1" />
          Configurar Feed
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Personalizar Feed de Atividades
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="filtros" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </TabsTrigger>
            <TabsTrigger value="layout" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Layout
            </TabsTrigger>
            <TabsTrigger value="ordenacao" className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4" />
              Ordenação
            </TabsTrigger>
          </TabsList>

          <TabsContent value="filtros" className="space-y-4">
            <FeedFiltrosTab 
              preferences={preferences}
              onPreferenceChange={handlePreferenceChange}
            />
          </TabsContent>

          <TabsContent value="layout" className="space-y-4">
            <FeedLayoutTab 
              preferences={preferences}
              onPreferenceChange={handlePreferenceChange}
            />
          </TabsContent>

          <TabsContent value="ordenacao" className="space-y-4">
            <FeedOrdenacaoTab 
              preferences={preferences}
              onPreferenceChange={handlePreferenceChange}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={handleReset}>
            Restaurar Padrões
          </Button>
          <Button onClick={() => setOpen(false)}>
            Salvar Configurações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

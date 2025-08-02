
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, Settings, BarChart3, FileSpreadsheet } from 'lucide-react';
import { ControleOrcamentarioConfig } from '@/components/orcamentario/ControleOrcamentarioConfig';
import { GestaoOrcamentos } from '@/components/orcamentario/GestaoOrcamentos';
import { DashboardOrcamentario } from '@/components/orcamentario/DashboardOrcamentario';
import { RelatoriosOrcamentario } from '@/components/orcamentario/RelatoriosOrcamentario';

export default function AdminOrcamentario() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <DollarSign className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Controle Orçamentário</h1>
          <p className="text-muted-foreground">
            Configure e gerencie o controle orçamentário para requisições
          </p>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="orcamentos" className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Orçamentos
          </TabsTrigger>
          <TabsTrigger value="relatorios" className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Relatórios
          </TabsTrigger>
          <TabsTrigger value="configuracao" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configuração
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <DashboardOrcamentario />
        </TabsContent>

        <TabsContent value="orcamentos" className="space-y-6">
          <GestaoOrcamentos />
        </TabsContent>

        <TabsContent value="relatorios" className="space-y-6">
          <RelatoriosOrcamentario />
        </TabsContent>

        <TabsContent value="configuracao" className="space-y-6">
          <ControleOrcamentarioConfig />
        </TabsContent>
      </Tabs>
    </div>
  );
}

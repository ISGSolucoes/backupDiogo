import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, FileText, Users, TrendingUp, Settings } from 'lucide-react';
import { SecaoContextual } from '@/components/dashboard/SecaoContextual';
import { SourcingWizard } from '@/components/sourcing/SourcingWizard';
import { SolicitacoesSourcingRecebidas } from '@/components/sourcing/SolicitacoesSourcingRecebidas';
import { NotificacaoNovasSolicitacoes } from '@/components/sourcing/NotificacaoNovasSolicitacoes';
import { TesteFluxoAutomatico } from '@/components/requisicoes/TesteFluxoAutomatico';
import { useSourcingToPedidosTrigger } from '@/hooks/useSourcingToPedidosTrigger';

import { MonitorFluxoCompleto } from '@/components/admin/MonitorFluxoCompleto';

interface SourcingProjectData {
  id: string;
  name: string;
  type: 'cotacao' | 'leilao' | 'rfp';
  status: 'rascunho' | 'ativo' | 'finalizado' | 'cancelado';
  created_at: string;
  deadline?: string;
  suppliers_count: number;
  proposals_count: number;
}

export default function SourcingProject() {
  const [activeTab, setActiveTab] = useState('projetos');
  const [showWizard, setShowWizard] = useState(false);
  
  // Ativar trigger para criação automática de pedidos
  useSourcingToPedidosTrigger();
  const [projects] = useState<SourcingProjectData[]>([
    {
      id: '1',
      name: 'Cotação de Material de Escritório',
      type: 'cotacao',
      status: 'ativo',
      created_at: '2024-01-15',
      deadline: '2024-02-15',
      suppliers_count: 8,
      proposals_count: 5
    },
    {
      id: '2', 
      name: 'Leilão de Equipamentos TI',
      type: 'leilao',
      status: 'rascunho',
      created_at: '2024-01-20',
      deadline: '2024-03-01',
      suppliers_count: 12,
      proposals_count: 0
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'rascunho': return 'bg-yellow-100 text-yellow-800';
      case 'finalizado': return 'bg-blue-100 text-blue-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'cotacao': return 'Cotação';
      case 'leilao': return 'Leilão';
      case 'rfp': return 'RFP';
      default: return type;
    }
  };

  const handleWizardComplete = (data: any) => {
    console.log('Projeto criado:', data);
    setShowWizard(false);
    // Aqui você integraria com o backend para salvar o projeto
  };

  if (showWizard) {
    return (
      <SourcingWizard
        onComplete={handleWizardComplete}
        onCancel={() => setShowWizard(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Notificação de novas solicitações */}
      <NotificacaoNovasSolicitacoes />
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Sourcing Avançado</h1>
          <p className="text-slate-600 mt-1">
            Gerencie cotações, leilões e processos de sourcing
          </p>
        </div>
        <Button className="gap-2" onClick={() => setShowWizard(true)}>
          <Plus className="h-4 w-4" />
          Novo Projeto
        </Button>
      </div>

      {/* Métricas Resumidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="icon-container icon-container-blue">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Projetos Ativos</p>
                <p className="text-2xl font-bold text-slate-800">
                  {projects.filter(p => p.status === 'ativo').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="icon-container icon-container-green">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Fornecedores</p>
                <p className="text-2xl font-bold text-slate-800">
                  {projects.reduce((acc, p) => acc + p.suppliers_count, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="icon-container icon-container-purple">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Propostas</p>
                <p className="text-2xl font-bold text-slate-800">
                  {projects.reduce((acc, p) => acc + p.proposals_count, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="icon-container icon-container-orange">
                <Settings className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Em Análise</p>
                <p className="text-2xl font-bold text-slate-800">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conteúdo Principal */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="teste">Teste Fluxo</TabsTrigger>
          <TabsTrigger value="monitor">Monitor</TabsTrigger>
          <TabsTrigger value="solicitacoes">Solicitações</TabsTrigger>
          <TabsTrigger value="projetos">Projetos</TabsTrigger>
          <TabsTrigger value="criterios">Critérios</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="teste" className="space-y-4">
          <TesteFluxoAutomatico />
        </TabsContent>

        <TabsContent value="monitor" className="space-y-4">
          <MonitorFluxoCompleto />
        </TabsContent>

        <TabsContent value="solicitacoes" className="space-y-4">
          <SolicitacoesSourcingRecebidas />
        </TabsContent>

        <TabsContent value="projetos" className="space-y-4">
          <SecaoContextual
            titulo="Projetos de Sourcing"
            icone={FileText}
            contador={projects.length}
          >
            <div className="grid gap-4">
              {projects.map((project) => (
                <Card key={project.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-slate-800">
                            {project.name}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {getTypeLabel(project.type)}
                          </Badge>
                          <Badge className={`text-xs ${getStatusColor(project.status)}`}>
                            {project.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600">
                          <div>
                            <span className="font-medium">Criado em:</span>
                            <br />
                            {new Date(project.created_at).toLocaleDateString('pt-BR')}
                          </div>
                          {project.deadline && (
                            <div>
                              <span className="font-medium">Prazo:</span>
                              <br />
                              {new Date(project.deadline).toLocaleDateString('pt-BR')}
                            </div>
                          )}
                          <div>
                            <span className="font-medium">Fornecedores:</span>
                            <br />
                            {project.suppliers_count}
                          </div>
                          <div>
                            <span className="font-medium">Propostas:</span>
                            <br />
                            {project.proposals_count}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Visualizar
                        </Button>
                        <Button size="sm">
                          Editar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {projects.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-600 mb-2">
                      Nenhum projeto encontrado
                    </h3>
                    <p className="text-slate-500 mb-4">
                      Crie seu primeiro projeto de sourcing para começar
                    </p>
                    <Button className="gap-2" onClick={() => setShowWizard(true)}>
                      <Plus className="h-4 w-4" />
                      Criar Primeiro Projeto
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </SecaoContextual>
        </TabsContent>

        <TabsContent value="fornecedores" className="space-y-4">
          <SecaoContextual
            titulo="Gestão de Fornecedores"
            icone={Users}
          >
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-600 mb-2">
                  Gestão de Fornecedores
                </h3>
                <p className="text-slate-500 mb-4">
                  Em breve: ferramentas avançadas para gestão de fornecedores
                </p>
                <Button variant="outline">
                  Ver Fornecedores Cadastrados
                </Button>
              </CardContent>
            </Card>
          </SecaoContextual>
        </TabsContent>

        <TabsContent value="criterios" className="space-y-4">
          <SecaoContextual
            titulo="Critérios de Avaliação"
            icone={TrendingUp}
          >
            <Card>
              <CardContent className="p-12 text-center">
                <TrendingUp className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-600 mb-2">
                  Critérios de Avaliação
                </h3>
                <p className="text-slate-500 mb-4">
                  Configure critérios personalizados para avaliação de propostas
                </p>
                <Button variant="outline">
                  Configurar Critérios
                </Button>
              </CardContent>
            </Card>
          </SecaoContextual>
        </TabsContent>

        <TabsContent value="relatorios" className="space-y-4">
          <SecaoContextual
            titulo="Relatórios e Analytics"
            icone={Settings}
          >
            <Card>
              <CardContent className="p-12 text-center">
                <Settings className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-600 mb-2">
                  Relatórios e Analytics
                </h3>
                <p className="text-slate-500 mb-4">
                  Análises detalhadas de performance e economia
                </p>
                <Button variant="outline">
                  Ver Relatórios
                </Button>
              </CardContent>
            </Card>
          </SecaoContextual>
        </TabsContent>
      </Tabs>
    </div>
  );
}
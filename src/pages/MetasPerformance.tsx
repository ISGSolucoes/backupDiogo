import React, { useState } from 'react';
import { Plus, Target, TrendingUp, Users, AlertTriangle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MetaCard } from '@/components/metas/MetaCard';
import { CriarMetaModal } from '@/components/metas/CriarMetaModal';
import { FiltrosMetas } from '@/components/metas/FiltrosMetas';
import { DashboardMetas } from '@/components/metas/DashboardMetas';

const MetasPerformance = () => {
  const [modalCriarAberto, setModalCriarAberto] = useState(false);
  const [abaSelecionada, setAbaSelecionada] = useState('dashboard');

  // Dados mockados
  const indicadoresGerais = [
    { titulo: 'Metas Ativas', valor: '12', tipo: 'default' as const },
    { titulo: 'Metas no Prazo', valor: '8', tipo: 'success' as const },
    { titulo: 'Metas em Risco', valor: '3', tipo: 'warning' as const },
    { titulo: 'Metas Críticas', valor: '1', tipo: 'danger' as const },
  ];

  const metasRecentes = [
    {
      id: '1',
      titulo: 'Saving Trimestral Q3',
      categoria: 'Sourcing',
      responsavel: 'João Silva',
      valorMeta: 500000,
      valorAtual: 328000,
      status: 'amarelo' as const,
      periodo: '01/07/2025 - 30/09/2025',
      progresso: 65.6
    },
    {
      id: '2',
      titulo: 'SLA Aprovação Requisições',
      categoria: 'Requisições',
      responsavel: 'Maria Santos',
      valorMeta: 85,
      valorAtual: 92,
      status: 'verde' as const,
      periodo: '01/07/2025 - 31/07/2025',
      progresso: 108.2
    },
    {
      id: '3',
      titulo: 'Qualificação Fornecedores',
      categoria: 'Fornecedores',
      responsavel: 'Equipe Sourcing',
      valorMeta: 50,
      valorAtual: 23,
      status: 'vermelho' as const,
      periodo: '01/06/2025 - 31/08/2025',
      progresso: 46
    }
  ];

  const abas = [
    { id: 'dashboard', nome: 'Dashboard', icone: TrendingUp },
    { id: 'metas', nome: 'Minhas Metas', icone: Target },
    { id: 'equipe', nome: 'Equipe', icone: Users },
    { id: 'alertas', nome: 'Alertas', icone: AlertTriangle }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Metas & Performance</h1>
            <p className="text-slate-600 mt-1">Acompanhe e gerencie metas da área de suprimentos</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Este Mês
            </Button>
            <Button onClick={() => setModalCriarAberto(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Nova Meta
            </Button>
          </div>
        </div>

        {/* Navegação por Abas */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 border border-slate-200">
          {abas.map((aba) => (
            <button
              key={aba.id}
              onClick={() => setAbaSelecionada(aba.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                abaSelecionada === aba.id
                  ? 'bg-primary text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <aba.icone className="h-4 w-4" />
              {aba.nome}
            </button>
          ))}
        </div>

        {/* Indicadores Principais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {indicadoresGerais.map((indicador, index) => (
            <Card key={index} className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{indicador.titulo}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{indicador.valor}</p>
                  </div>
                  <div className={`p-3 rounded-full ${
                    indicador.tipo === 'success' ? 'bg-green-100 text-green-600' :
                    indicador.tipo === 'warning' ? 'bg-amber-100 text-amber-600' :
                    indicador.tipo === 'danger' ? 'bg-red-100 text-red-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <Target className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Conteúdo baseado na aba selecionada */}
        {abaSelecionada === 'dashboard' && (
          <DashboardMetas />
        )}

        {abaSelecionada === 'metas' && (
          <div className="space-y-6">
            <FiltrosMetas />
            
            {/* Lista de Metas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {metasRecentes.map((meta) => (
                <MetaCard key={meta.id} meta={meta} />
              ))}
            </div>
          </div>
        )}

        {abaSelecionada === 'equipe' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Ranking da Equipe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['João Silva - 95%', 'Maria Santos - 87%', 'Pedro Costa - 76%'].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-slate-400' : 'bg-orange-500'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="font-medium">{item}</span>
                    </div>
                    <Badge variant={index === 0 ? 'default' : 'secondary'}>
                      {index === 0 ? '🏆 Líder' : index === 1 ? '🥈' : '🥉'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {abaSelecionada === 'alertas' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Alertas e Notificações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border-l-4 border-red-500 bg-red-50 rounded-r-lg">
                  <p className="font-medium text-red-800">Meta Crítica: Qualificação Fornecedores</p>
                  <p className="text-sm text-red-600 mt-1">46% da meta alcançada - Ação imediata necessária</p>
                </div>
                <div className="p-4 border-l-4 border-amber-500 bg-amber-50 rounded-r-lg">
                  <p className="font-medium text-amber-800">Meta em Risco: Saving Trimestral Q3</p>
                  <p className="text-sm text-amber-600 mt-1">65.6% da meta alcançada - Atenção requerida</p>
                </div>
                <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded-r-lg">
                  <p className="font-medium text-green-800">Meta Batida: SLA Aprovação Requisições</p>
                  <p className="text-sm text-green-600 mt-1">108.2% da meta alcançada - Parabéns! 🎉</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Modal de Criação */}
        <CriarMetaModal 
          aberto={modalCriarAberto}
          onFechar={() => setModalCriarAberto(false)}
        />
      </div>
    </div>
  );
};

export default MetasPerformance;
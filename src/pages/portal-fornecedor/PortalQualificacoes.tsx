
import React, { useState } from 'react';
import { ArrowLeft, Star, Calendar, CheckCircle, Clock, FileText, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import QualificacoesStatsCards from '@/components/portal-fornecedor/QualificacoesStatsCards';

const PortalQualificacoes = () => {
  const navigate = useNavigate();
  const [filtroStatus, setFiltroStatus] = useState('todos');

  const qualificacoes = [
    {
      id: 'QUA-2024-0156',
      cliente: 'Petrobras S.A.',
      titulo: 'Requalificação ESG 2024',
      descricao: 'Questionário anual obrigatório sobre práticas ambientais, sociais e de governança.',
      recebidoEm: '20/05/2024',
      prazo: '05/06/2024',
      progresso: 45,
      status: 'em_andamento',
      categoria: 'ESG'
    },
    {
      id: 'QUA-2024-0134',
      cliente: 'Petrobras S.A.',
      titulo: 'Qualificação Técnica Q1 - APROVADA! ⭐',
      descricao: 'Avaliação técnica trimestral concluída com excelência.',
      recebidoEm: '15/04/2024',
      status: 'aprovada',
      notaCliente: 'Qualificação aprovada com nota 9.2/10. Excelente performance técnica.',
      score: '9.2/10',
      categoria: 'Técnica',
      certificadoDisponivel: true
    },
    {
      id: 'QUA-2024-0089',
      cliente: 'Vale S.A.',
      titulo: 'Qualificação de Segurança',
      descricao: 'Avaliação dos procedimentos de segurança no trabalho.',
      recebidoEm: '10/05/2024',
      prazo: '25/05/2024',
      status: 'pendente',
      categoria: 'Segurança'
    },
    {
      id: 'QUA-2024-0067',
      cliente: 'Embraer S.A.',
      titulo: 'Certificação Aeronáutica',
      descricao: 'Processo de certificação para fornecimento de componentes aeronáuticos.',
      recebidoEm: '01/05/2024',
      status: 'em_analise',
      categoria: 'Certificação',
      respondidoEm: '05/05/2024'
    },
    // Adicionando mais qualificações para dados expressivos
    {
      id: 'QUA-2024-0178',
      cliente: 'CSN',
      titulo: 'Qualificação Siderúrgica',
      descricao: 'Avaliação técnica para fornecimento de equipamentos siderúrgicos.',
      recebidoEm: '28/05/2024',
      status: 'aprovada',
      notaCliente: 'Qualificação aprovada com destaque. Score: 9.4/10',
      score: '9.4/10',
      categoria: 'Técnica',
      certificadoDisponivel: true
    },
    {
      id: 'QUA-2024-0165',
      cliente: 'Braskem',
      titulo: 'Certificação Petroquímica',
      descricao: 'Processo de habilitação para fornecimento de produtos químicos.',
      recebidoEm: '25/05/2024',
      prazo: '15/06/2024',
      progresso: 75,
      status: 'em_andamento',
      categoria: 'Certificação'
    },
    {
      id: 'QUA-2024-0152',
      cliente: 'Gerdau',
      titulo: 'Avaliação de Fornecedores',
      descricao: 'Qualificação anual de fornecedores estratégicos.',
      recebidoEm: '22/05/2024',
      status: 'aprovada',
      notaCliente: 'Fornecedor qualificado como estratégico. Excelente performance.',
      score: '8.9/10',
      categoria: 'ESG',
      certificadoDisponivel: true
    },
    {
      id: 'QUA-2024-0143',
      cliente: 'Suzano',
      titulo: 'Qualificação Ambiental',
      descricao: 'Avaliação de práticas ambientais e sustentabilidade.',
      recebidoEm: '18/05/2024',
      prazo: '08/06/2024',
      status: 'pendente',
      categoria: 'ESG'
    },
    {
      id: 'QUA-2024-0128',
      cliente: 'WEG',
      titulo: 'Certificação ISO 9001',
      descricao: 'Processo de certificação para sistema de gestão de qualidade.',
      recebidoEm: '15/05/2024',
      status: 'reprovada',
      categoria: 'Certificação'
    }
  ];

  const getStatusBadge = (status: string) => {
    const configs = {
      pendente: { variant: 'destructive' as const, label: 'Pendente' },
      em_andamento: { variant: 'outline' as const, label: 'Em Andamento' },
      em_analise: { variant: 'secondary' as const, label: 'Em Análise' },
      aprovada: { variant: 'default' as const, label: 'Aprovada' },
      reprovada: { variant: 'destructive' as const, label: 'Reprovada' }
    };
    return configs[status as keyof typeof configs] || { variant: 'secondary' as const, label: status };
  };

  const getCategoriaColor = (categoria: string) => {
    const cores = {
      'ESG': 'bg-green-100 text-green-800',
      'Técnica': 'bg-blue-100 text-blue-800',
      'Segurança': 'bg-red-100 text-red-800',
      'Certificação': 'bg-purple-100 text-purple-800'
    };
    return cores[categoria as keyof typeof cores] || 'bg-gray-100 text-gray-800';
  };

  const qualificacoesFiltradas = qualificacoes.filter(qual => 
    filtroStatus === 'todos' || qual.status === filtroStatus
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="w-full px-4 lg:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/portal-fornecedor")}
                className="gap-2 text-gray-600 hover:text-blue-600"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar ao Portal
              </Button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="text-xl font-bold text-blue-900">🔗 SourceXpress Portal</div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-gray-700 font-medium">TechSupply Solutions</span>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                TS
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Header da página */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <Star className="h-10 w-10" />
          <div>
            <h1 className="text-3xl font-bold">Minhas Qualificações</h1>
            <p className="opacity-90">Gerencie suas qualificações e certificações</p>
          </div>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="py-6 px-4 lg:px-6">
        <QualificacoesStatsCards qualificacoes={qualificacoes} />
      </div>

      {/* Filtros */}
      <div className="py-6 px-4 lg:px-6 border-b bg-white shadow-sm">
        <div className="flex flex-wrap gap-4">
          <Button
            variant={filtroStatus === 'todos' ? 'default' : 'outline'}
            onClick={() => setFiltroStatus('todos')}
            size="sm"
          >
            Todas ({qualificacoes.length})
          </Button>
          <Button
            variant={filtroStatus === 'pendente' ? 'destructive' : 'outline'}
            onClick={() => setFiltroStatus('pendente')}
            size="sm"
          >
            Pendentes ({qualificacoes.filter(q => q.status === 'pendente').length})
          </Button>
          <Button
            variant={filtroStatus === 'em_andamento' ? 'outline' : 'outline'}
            onClick={() => setFiltroStatus('em_andamento')}
            size="sm"
            className={filtroStatus === 'em_andamento' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : ''}
          >
            Em Andamento ({qualificacoes.filter(q => q.status === 'em_andamento').length})
          </Button>
          <Button
            variant={filtroStatus === 'aprovada' ? 'default' : 'outline'}
            onClick={() => setFiltroStatus('aprovada')}
            size="sm"
            className={filtroStatus === 'aprovada' ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            Aprovadas ({qualificacoes.filter(q => q.status === 'aprovada').length})
          </Button>
          <Button
            variant={filtroStatus === 'reprovada' ? 'outline' : 'outline'}
            onClick={() => setFiltroStatus('reprovada')}
            size="sm"
            className={filtroStatus === 'reprovada' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}
          >
            Reprovadas ({qualificacoes.filter(q => q.status === 'reprovada').length})
          </Button>
        </div>
      </div>

      {/* Lista de Qualificações */}
      <div className="py-6 px-4 lg:px-6 bg-gray-50">
        {qualificacoesFiltradas.length === 0 ? (
          <div className="text-center py-16">
            <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhuma qualificação encontrada</h3>
            <p className="text-gray-500">
              Não há qualificações para os filtros selecionados
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {qualificacoesFiltradas.map((qualificacao) => {
              const statusConfig = getStatusBadge(qualificacao.status);
              return (
                <div key={qualificacao.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{qualificacao.titulo}</h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <span className="font-medium">{qualificacao.cliente}</span>
                          <span className="text-gray-400">•</span>
                          <span>#{qualificacao.id}</span>
                        </div>
                        <p className="text-gray-700">{qualificacao.descricao}</p>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2 ml-4">
                        <Badge variant={statusConfig.variant}>
                          {statusConfig.label}
                        </Badge>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoriaColor(qualificacao.categoria)}`}>
                          {qualificacao.categoria}
                        </span>
                      </div>
                    </div>
                    
                    {qualificacao.notaCliente && (
                      <div className="bg-green-50 border-l-4 border-green-400 p-3 mb-4">
                        <p className="text-green-800 text-sm font-medium">📝 Nota do Cliente:</p>
                        <p className="text-green-700 text-sm">{qualificacao.notaCliente}</p>
                        {qualificacao.score && (
                          <p className="text-green-900 text-sm font-bold mt-1">Score: {qualificacao.score}</p>
                        )}
                      </div>
                    )}

                    {qualificacao.progresso !== undefined && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progresso</span>
                          <span>{qualificacao.progresso}%</span>
                        </div>
                        <Progress value={qualificacao.progresso} className="w-full" />
                      </div>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Recebido: {qualificacao.recebidoEm}</span>
                      </div>
                      {qualificacao.prazo && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>Prazo: {qualificacao.prazo}</span>
                        </div>
                      )}
                      {qualificacao.respondidoEm && (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          <span>Respondido: {qualificacao.respondidoEm}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {qualificacao.status === 'pendente' && (
                        <Button size="sm" className="flex-1">
                          Iniciar Qualificação
                        </Button>
                      )}
                      {qualificacao.status === 'em_andamento' && (
                        <>
                          <Button size="sm" className="flex-1">
                            Continuar Preenchimento
                          </Button>
                          <Button variant="outline" size="sm">
                            Salvar Rascunho
                          </Button>
                        </>
                      )}
                      {qualificacao.status === 'aprovada' && qualificacao.certificadoDisponivel && (
                        <>
                          <Button size="sm" className="flex-1">
                            <Award className="w-4 h-4 mr-2" />
                            Ver Certificado
                          </Button>
                          <Button variant="outline" size="sm">
                            <FileText className="w-4 h-4 mr-2" />
                            Baixar Relatório
                          </Button>
                        </>
                      )}
                      {qualificacao.status === 'em_analise' && (
                        <Button variant="outline" size="sm" className="flex-1">
                          Ver Minha Resposta
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortalQualificacoes;

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, Users, FileText, AlertCircle, CheckCircle, Zap } from 'lucide-react';

interface MonitoramentoTempoData {
  evento: {
    status: 'agendado' | 'ativo' | 'finalizado' | 'cancelado';
    dataInicio: string;
    dataFim: string;
    tempoRestante: number;
    participantes: number;
    propostas: number;
  };
  estatisticas: {
    acessos: number;
    downloads: number;
    duvidas: number;
    propostas: Array<{
      fornecedor: string;
      dataEnvio: string;
      status: 'recebida' | 'analise' | 'aprovada' | 'rejeitada';
    }>;
  };
  alertas: Array<{
    id: string;
    tipo: 'prazo' | 'proposta' | 'sistema' | 'fornecedor';
    severidade: 'info' | 'warning' | 'error';
    titulo: string;
    descricao: string;
    timestamp: string;
  }>;
}

interface MonitoramentoTempoProps {
  data: Partial<MonitoramentoTempoData>;
  onComplete: (data: MonitoramentoTempoData) => void;
  wizardData: any;
}

export function MonitoramentoTempo({ data, onComplete, wizardData }: MonitoramentoTempoProps) {
  const [formData, setFormData] = useState<MonitoramentoTempoData>({
    evento: {
      status: 'ativo',
      dataInicio: new Date().toISOString(),
      dataFim: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      tempoRestante: 7 * 24 * 60 * 60 * 1000,
      participantes: 8,
      propostas: 3
    },
    estatisticas: {
      acessos: 24,
      downloads: 12,
      duvidas: 2,
      propostas: [
        {
          fornecedor: 'Fornecedor Alpha Ltda',
          dataEnvio: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'recebida'
        },
        {
          fornecedor: 'Beta Suprimentos S.A.',
          dataEnvio: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'analise'
        },
        {
          fornecedor: 'Gamma Materiais Ltda',
          dataEnvio: new Date().toISOString(),
          status: 'recebida'
        }
      ]
    },
    alertas: [
      {
        id: '1',
        tipo: 'prazo',
        severidade: 'warning',
        titulo: 'Prazo se aproximando',
        descricao: 'Restam apenas 7 dias para o encerramento das propostas',
        timestamp: new Date().toISOString()
      },
      {
        id: '2',
        tipo: 'fornecedor',
        severidade: 'info',
        titulo: 'Nova proposta recebida',
        descricao: 'Gamma Materiais Ltda enviou sua proposta',
        timestamp: new Date().toISOString()
      }
    ],
    ...data
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Atualizar tempo restante
      const agora = new Date().getTime();
      const fim = new Date(formData.evento.dataFim).getTime();
      const tempoRestante = Math.max(0, fim - agora);
      
      setFormData(prev => ({
        ...prev,
        evento: {
          ...prev.evento,
          tempoRestante
        }
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [formData.evento.dataFim]);

  useEffect(() => {
    // Auto-complete quando o evento estiver ativo
    if (formData.evento.status === 'ativo') {
      onComplete(formData);
    }
  }, [formData]);

  const formatTempo = (milliseconds: number) => {
    const dias = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    const horas = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    
    if (dias > 0) {
      return `${dias}d ${horas}h ${minutos}m`;
    } else if (horas > 0) {
      return `${horas}h ${minutos}m`;
    } else {
      return `${minutos}m`;
    }
  };

  const progressoPorcentagem = () => {
    const inicio = new Date(formData.evento.dataInicio).getTime();
    const fim = new Date(formData.evento.dataFim).getTime();
    const agora = new Date().getTime();
    
    const duracao = fim - inicio;
    const decorrido = agora - inicio;
    
    return Math.min(100, Math.max(0, (decorrido / duracao) * 100));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'agendado':
        return <Badge variant="secondary">Agendado</Badge>;
      case 'ativo':
        return <Badge variant="default" className="bg-green-500">Ativo</Badge>;
      case 'finalizado':
        return <Badge variant="outline">Finalizado</Badge>;
      case 'cancelado':
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getSeveridadeIcon = (severidade: string) => {
    switch (severidade) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Principal do Evento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Status do Evento
            {getStatusBadge(formData.evento.status)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cronômetro Principal */}
            <div className="text-center">
              <div className="mb-4">
                <Clock className="h-12 w-12 mx-auto text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary mb-2">
                {formatTempo(formData.evento.tempoRestante)}
              </div>
              <div className="text-sm text-muted-foreground">
                Tempo restante
              </div>
              <div className="mt-4">
                <Progress value={progressoPorcentagem()} className="h-2" />
                <div className="text-xs text-muted-foreground mt-1">
                  {progressoPorcentagem().toFixed(1)}% concluído
                </div>
              </div>
            </div>

            {/* Participação */}
            <div className="text-center">
              <div className="mb-4">
                <Users className="h-12 w-12 mx-auto text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-blue-500 mb-2">
                {formData.evento.participantes}
              </div>
              <div className="text-sm text-muted-foreground">
                Fornecedores convidados
              </div>
              <div className="mt-2">
                <Badge variant="outline">
                  {((formData.evento.propostas / formData.evento.participantes) * 100).toFixed(0)}% 
                  responderam
                </Badge>
              </div>
            </div>

            {/* Propostas */}
            <div className="text-center">
              <div className="mb-4">
                <FileText className="h-12 w-12 mx-auto text-green-500" />
              </div>
              <div className="text-2xl font-bold text-green-500 mb-2">
                {formData.evento.propostas}
              </div>
              <div className="text-sm text-muted-foreground">
                Propostas recebidas
              </div>
              <div className="mt-2">
                <Badge variant="outline">
                  {formData.evento.participantes - formData.evento.propostas} pendentes
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas Detalhadas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {formData.estatisticas.acessos}
            </div>
            <div className="text-sm text-muted-foreground">
              Acessos ao edital
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {formData.estatisticas.downloads}
            </div>
            <div className="text-sm text-muted-foreground">
              Downloads de anexos
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {formData.estatisticas.duvidas}
            </div>
            <div className="text-sm text-muted-foreground">
              Dúvidas enviadas
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {formData.estatisticas.propostas.length}
            </div>
            <div className="text-sm text-muted-foreground">
              Propostas válidas
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Propostas Recebidas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Propostas Recebidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {formData.estatisticas.propostas.map((proposta, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{proposta.fornecedor}</div>
                  <div className="text-sm text-muted-foreground">
                    Enviada em {new Date(proposta.dataEnvio).toLocaleDateString('pt-BR')} às{' '}
                    {new Date(proposta.dataEnvio).toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
                <div>
                  <Badge 
                    variant={
                      proposta.status === 'aprovada' ? 'default' :
                      proposta.status === 'analise' ? 'secondary' :
                      proposta.status === 'rejeitada' ? 'destructive' : 'outline'
                    }
                  >
                    {proposta.status === 'recebida' && 'Recebida'}
                    {proposta.status === 'analise' && 'Em Análise'}
                    {proposta.status === 'aprovada' && 'Aprovada'}
                    {proposta.status === 'rejeitada' && 'Rejeitada'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alertas e Notificações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Alertas e Notificações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {formData.alertas.map((alerta) => (
              <div key={alerta.id} className="flex items-start gap-3 p-3 border rounded-lg">
                {getSeveridadeIcon(alerta.severidade)}
                <div className="flex-1">
                  <div className="font-medium">{alerta.titulo}</div>
                  <div className="text-sm text-muted-foreground">{alerta.descricao}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(alerta.timestamp).toLocaleString('pt-BR')}
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {alerta.tipo}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              Enviar Lembrete
            </Button>
            <Button variant="outline" size="sm">
              Estender Prazo
            </Button>
            <Button variant="outline" size="sm">
              Exportar Relatório
            </Button>
            <Button variant="outline" size="sm">
              Ver Detalhes das Propostas
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { ExpandedDialog } from "@/components/ui/expanded-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Mail, 
  MailOpen, 
  MessageSquare, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp,
  AlertTriangle,
  Eye,
  Reply
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { DisparoAcaoLote, DisparoFornecedor } from '@/types/acoes-lote';

interface DetalhesDisparoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disparo: DisparoAcaoLote | null;
}

// Mock data para demonstração
const mockFornecedores: DisparoFornecedor[] = [
  {
    id: '1',
    disparo_id: '1',
    fornecedor_id: 'F001',
    fornecedor_nome: 'TechCorp Solutions',
    fornecedor_cnpj: '12.345.678/0001-90',
    fornecedor_email: 'contato@techcorp.com',
    status_envio: 'respondido',
    data_envio: '2025-01-20T10:35:00Z',
    data_abertura: '2025-01-20T11:20:00Z',
    data_resposta: '2025-01-20T14:30:00Z',
    token_rastreio: 'abc123',
    created_at: '2025-01-20T10:35:00Z',
    updated_at: '2025-01-20T14:30:00Z'
  },
  {
    id: '2',
    disparo_id: '1',
    fornecedor_id: 'F002',
    fornecedor_nome: 'Industrial Peças Ltda',
    fornecedor_cnpj: '98.765.432/0001-10',
    fornecedor_email: 'comercial@industrialpecas.com',
    status_envio: 'aberto',
    data_envio: '2025-01-20T10:35:00Z',
    data_abertura: '2025-01-20T16:45:00Z',
    token_rastreio: 'def456',
    created_at: '2025-01-20T10:35:00Z',
    updated_at: '2025-01-20T16:45:00Z'
  },
  {
    id: '3',
    disparo_id: '1',
    fornecedor_id: 'F003',
    fornecedor_nome: 'Materiais São Paulo',
    fornecedor_cnpj: '11.222.333/0001-44',
    fornecedor_email: 'vendas@materiaissp.com.br',
    status_envio: 'enviado',
    data_envio: '2025-01-20T10:35:00Z',
    token_rastreio: 'ghi789',
    created_at: '2025-01-20T10:35:00Z',
    updated_at: '2025-01-20T10:35:00Z'
  },
  {
    id: '4',
    disparo_id: '1',
    fornecedor_id: 'F004',
    fornecedor_nome: 'Serviços Gerais ME',
    fornecedor_cnpj: '55.666.777/0001-88',
    fornecedor_email: 'email-invalido@dominio-inexistente.com',
    status_envio: 'falhou',
    data_envio: '2025-01-20T10:35:00Z',
    token_rastreio: 'jkl012',
    erro_envio: 'Email inválido - domínio não existe',
    created_at: '2025-01-20T10:35:00Z',
    updated_at: '2025-01-20T10:35:00Z'
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'respondido':
      return <Badge className="bg-green-100 text-green-800"><Reply className="w-3 h-3 mr-1" />Respondido</Badge>;
    case 'aberto':
      return <Badge className="bg-blue-100 text-blue-800"><Eye className="w-3 h-3 mr-1" />Aberto</Badge>;
    case 'enviado':
      return <Badge className="bg-yellow-100 text-yellow-800"><Mail className="w-3 h-3 mr-1" />Enviado</Badge>;
    case 'falhou':
      return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Falhou</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export const DetalhesDisparoModal: React.FC<DetalhesDisparoModalProps> = ({
  open,
  onOpenChange,
  disparo
}) => {
  const [fornecedores, setFornecedores] = useState<DisparoFornecedor[]>([]);

  useEffect(() => {
    if (disparo) {
      // Simular carregamento dos fornecedores
      setFornecedores(mockFornecedores);
    }
  }, [disparo]);

  if (!disparo) return null;

  // Calcular métricas detalhadas
  const total = disparo.total_fornecedores || 0;
  const enviados = disparo.enviados || 0;
  const abertos = disparo.abertos || 0;
  const respondidos = disparo.respondidos || 0;
  const falhas = disparo.falhas || 0;
  
  const taxaEntrega = total > 0 ? ((enviados / total) * 100) : 0;
  const taxaAbertura = enviados > 0 ? ((abertos / enviados) * 100) : 0;
  const taxaResposta = enviados > 0 ? ((respondidos / enviados) * 100) : 0;
  const emailsValidos = enviados;
  const emailsInvalidos = falhas;

  return (
    <ExpandedDialog 
      open={open} 
      onOpenChange={onOpenChange}
      title={`Detalhes: ${disparo.nome_disparo}`}
      className="overflow-y-auto max-w-6xl"
    >
      <Tabs defaultValue="metricas" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="metricas">Métricas</TabsTrigger>
          <TabsTrigger value="fornecedores">Fornecedores ({total})</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="metricas" className="space-y-6">
          {/* Métricas principais */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Entrega</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{taxaEntrega.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  {enviados} de {total} enviados
                </p>
                <Progress value={taxaEntrega} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Abertura</CardTitle>
                <MailOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{taxaAbertura.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  {abertos} de {enviados} abertos
                </p>
                <Progress value={taxaAbertura} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Resposta</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{taxaResposta.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  {respondidos} de {enviados} responderam
                </p>
                <Progress value={taxaResposta} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Emails Válidos</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{emailsValidos}</div>
                <p className="text-xs text-muted-foreground">
                  {emailsInvalidos} inválidos/falhas
                </p>
                <div className="flex gap-1 mt-2">
                  <div className="flex-1 h-2 bg-green-200 rounded"></div>
                  {emailsInvalidos > 0 && <div className="w-4 h-2 bg-red-200 rounded"></div>}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detalhamento por status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Distribuição por Status
              </CardTitle>
              <CardDescription>
                Detalhamento do status atual de cada fornecedor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{enviados}</div>
                  <div className="text-sm text-muted-foreground">Enviados</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{abertos}</div>
                  <div className="text-sm text-muted-foreground">Abertos</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">{respondidos}</div>
                  <div className="text-sm text-muted-foreground">Respondidos</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl font-bold text-red-600">{falhas}</div>
                  <div className="text-sm text-muted-foreground">Falhas</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas de tempo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Estatísticas de Tempo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Tempo de Disparo</p>
                  <p className="text-lg">
                    {disparo.concluido_em ? 
                      `${Math.round((new Date(disparo.concluido_em).getTime() - new Date(disparo.disparado_em).getTime()) / (1000 * 60))} min` :
                      'Em andamento'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Última Atividade</p>
                  <p className="text-lg">
                    {format(new Date(disparo.created_at), 'HH:mm dd/MM', { locale: ptBR })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fornecedores" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Fornecedores</CardTitle>
              <CardDescription>
                Status detalhado de cada fornecedor no disparo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fornecedor</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Enviado</TableHead>
                      <TableHead>Aberto</TableHead>
                      <TableHead>Respondido</TableHead>
                      <TableHead>Observações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fornecedores.map((fornecedor) => (
                      <TableRow key={fornecedor.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{fornecedor.fornecedor_nome}</p>
                            <p className="text-sm text-muted-foreground">{fornecedor.fornecedor_cnpj}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {fornecedor.fornecedor_email}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(fornecedor.status_envio)}
                        </TableCell>
                        <TableCell>
                          {fornecedor.data_envio ? 
                            format(new Date(fornecedor.data_envio), 'dd/MM HH:mm', { locale: ptBR }) : 
                            '-'
                          }
                        </TableCell>
                        <TableCell>
                          {fornecedor.data_abertura ? 
                            format(new Date(fornecedor.data_abertura), 'dd/MM HH:mm', { locale: ptBR }) : 
                            '-'
                          }
                        </TableCell>
                        <TableCell>
                          {fornecedor.data_resposta ? 
                            format(new Date(fornecedor.data_resposta), 'dd/MM HH:mm', { locale: ptBR }) : 
                            '-'
                          }
                        </TableCell>
                        <TableCell>
                          {fornecedor.erro_envio && (
                            <div className="flex items-center gap-1 text-red-600">
                              <AlertTriangle className="h-4 w-4" />
                              <span className="text-xs">{fornecedor.erro_envio}</span>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Timeline do Disparo</CardTitle>
              <CardDescription>
                Cronologia de eventos do disparo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Disparo Iniciado</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(disparo.disparado_em), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </p>
                    <p className="text-sm">Configuração carregada e envios iniciados</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Primeiros Envios</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(disparo.disparado_em), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </p>
                    <p className="text-sm">{enviados} emails enviados com sucesso</p>
                  </div>
                </div>

                {abertos > 0 && (
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Primeiras Aberturas</p>
                      <p className="text-sm text-muted-foreground">
                        Aproximadamente 1h após envio
                      </p>
                      <p className="text-sm">{abertos} fornecedores abriram o email</p>
                    </div>
                  </div>
                )}

                {respondidos > 0 && (
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Primeiras Respostas</p>
                      <p className="text-sm text-muted-foreground">
                        Aproximadamente 4h após envio
                      </p>
                      <p className="text-sm">{respondidos} fornecedores responderam</p>
                    </div>
                  </div>
                )}

                {disparo.concluido_em && (
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-gray-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Disparo Concluído</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(disparo.concluido_em), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </p>
                      <p className="text-sm">Todos os envios processados</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end mt-6">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Fechar
        </Button>
      </div>
    </ExpandedDialog>
  );
};
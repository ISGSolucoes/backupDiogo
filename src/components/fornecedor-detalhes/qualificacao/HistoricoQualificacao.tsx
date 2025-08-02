
import React, { useState } from 'react';
import { Calendar, FileCheck, MessageSquare, Settings, History } from 'lucide-react';
import { ExpandedDialog } from '@/components/ui/expanded-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HistoricoFornecedor } from '@/types/fornecedor';

import { useFullscreenModal } from '@/hooks/useFullscreenModal';

interface HistoricoQualificacaoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fornecedorId: string;
}

export const HistoricoQualificacao = ({ open, onOpenChange, fornecedorId }: HistoricoQualificacaoProps) => {
  const { isFullscreen, toggleFullscreen } = useFullscreenModal();
  const [filter, setFilter] = useState('todos');
  const [historico, setHistorico] = useState<HistoricoFornecedor[]>([
    {
      id: '1',
      fornecedor_id: fornecedorId,
      data: '2023-11-13T10:30:00',
      tipoEvento: 'qualificacao',
      descricao: 'Qualificação finalizada',
      usuario: 'João Souza',
      detalhes: {
        status: 'Qualificado',
        score: 8.7,
        sla: '2 dias'
      }
    },
    {
      id: '2',
      fornecedor_id: fornecedorId,
      data: '2023-11-10T14:22:00',
      tipoEvento: 'documento',
      descricao: 'Documento substituído',
      usuario: 'Fornecedor (Portal)',
      detalhes: {
        documento: 'Certidão FGTS'
      }
    },
    {
      id: '3',
      fornecedor_id: fornecedorId,
      data: '2023-11-08T09:15:00',
      tipoEvento: 'avaliacao',
      descricao: 'Questionário respondido',
      usuario: 'Fornecedor (Portal)',
      detalhes: {
        tipo: 'TI',
        cobertura: 'Nacional'
      }
    },
    {
      id: '4',
      fornecedor_id: fornecedorId,
      data: '2023-11-07T16:45:00',
      tipoEvento: 'mensagem',
      descricao: 'Solicitação de qualificação',
      usuario: 'Ana Freitas',
      detalhes: {
        mensagem: 'Fornecedor foi convidado para responder formulário'
      }
    },
    {
      id: '5',
      fornecedor_id: fornecedorId,
      data: '2023-11-05T08:30:00',
      tipoEvento: 'sistema',
      descricao: 'Status alterado manualmente',
      usuario: 'Sistema',
      detalhes: {
        de: 'Inativo',
        para: 'Em Registro'
      }
    }
  ]);

  const formatarData = (dataString: string) => {
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString("pt-BR") + " " + data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    } catch (e) {
      return dataString;
    }
  };

  const getTipoEvento = (tipo: string) => {
    switch (tipo) {
      case "qualificacao":
        return {
          badge: (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Qualificação
            </Badge>
          ),
          icon: <History className="h-4 w-4 text-blue-600" />,
        };
      case "documento":
        return {
          badge: (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Documento
            </Badge>
          ),
          icon: <FileCheck className="h-4 w-4 text-green-600" />,
        };
      case "mensagem":
        return {
          badge: (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              Mensagem
            </Badge>
          ),
          icon: <MessageSquare className="h-4 w-4 text-amber-600" />,
        };
      case "avaliacao":
        return {
          badge: (
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              Avaliação
            </Badge>
          ),
          icon: <Calendar className="h-4 w-4 text-purple-600" />,
        };
      case "sistema":
        return {
          badge: (
            <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
              Sistema
            </Badge>
          ),
          icon: <Settings className="h-4 w-4 text-slate-600" />,
        };
      default:
        return {
          badge: (
            <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
              Outro
            </Badge>
          ),
          icon: <Settings className="h-4 w-4 text-slate-600" />,
        };
    }
  };

  const renderDetalhes = (detalhes: any) => {
    if (!detalhes) return null;
    
    return (
      <div className="text-xs text-slate-500 mt-1">
        {Object.entries(detalhes).map(([key, value]) => (
          <span key={key} className="mr-2">
            {key.charAt(0).toUpperCase() + key.slice(1)}: <strong>{value as string}</strong> •{' '}
          </span>
        ))}
      </div>
    );
  };

  const historicoFiltrado = historico.filter((item) => {
    return filter === 'todos' || item.tipoEvento === filter;
  });

  return (
    <ExpandedDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Histórico de Qualificação"
      fullscreen={isFullscreen}
      onToggleFullscreen={toggleFullscreen}
    >

        <Tabs defaultValue="todos" className="w-full" onValueChange={setFilter}>
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="qualificacao">Qualificações</TabsTrigger>
            <TabsTrigger value="documento">Documentos</TabsTrigger>
            <TabsTrigger value="mensagem">Mensagens</TabsTrigger>
            <TabsTrigger value="sistema">Ajustes manuais</TabsTrigger>
          </TabsList>

          <TabsContent value="todos" className="mt-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Ação</TableHead>
                    <TableHead>Responsável</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historicoFiltrado.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-slate-500">
                        Nenhum registro encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    historicoFiltrado.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="whitespace-nowrap">{formatarData(item.data)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTipoEvento(item.tipoEvento).icon}
                            {getTipoEvento(item.tipoEvento).badge}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            {item.descricao}
                            {renderDetalhes(item.detalhes)}
                          </div>
                        </TableCell>
                        <TableCell>{item.usuario}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* As outras tabs usam o mesmo conteúdo, apenas com filtros diferentes aplicados */}
          <TabsContent value="qualificacao" className="mt-4">
            {/* Mesmo conteúdo da tabela, mas com filter="qualificacao" */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Ação</TableHead>
                    <TableHead>Responsável</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historicoFiltrado.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-slate-500">
                        Nenhum registro encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    historicoFiltrado.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="whitespace-nowrap">{formatarData(item.data)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTipoEvento(item.tipoEvento).icon}
                            {getTipoEvento(item.tipoEvento).badge}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            {item.descricao}
                            {renderDetalhes(item.detalhes)}
                          </div>
                        </TableCell>
                        <TableCell>{item.usuario}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Repeat for other tabs with appropriate filters */}
          <TabsContent value="documento" className="mt-4">
            {/* Same table structure but filtered for documents */}
            <div className="overflow-x-auto">
              {/* ... similar table structure ... */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Ação</TableHead>
                    <TableHead>Responsável</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historicoFiltrado.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-slate-500">
                        Nenhum registro encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    historicoFiltrado.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="whitespace-nowrap">{formatarData(item.data)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTipoEvento(item.tipoEvento).icon}
                            {getTipoEvento(item.tipoEvento).badge}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            {item.descricao}
                            {renderDetalhes(item.detalhes)}
                          </div>
                        </TableCell>
                        <TableCell>{item.usuario}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="mensagem" className="mt-4">
            {/* Same table structure but filtered for messages */}
            <div className="overflow-x-auto">
              {/* ... similar table structure ... */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Ação</TableHead>
                    <TableHead>Responsável</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historicoFiltrado.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-slate-500">
                        Nenhum registro encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    historicoFiltrado.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="whitespace-nowrap">{formatarData(item.data)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTipoEvento(item.tipoEvento).icon}
                            {getTipoEvento(item.tipoEvento).badge}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            {item.descricao}
                            {renderDetalhes(item.detalhes)}
                          </div>
                        </TableCell>
                        <TableCell>{item.usuario}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="sistema" className="mt-4">
            {/* Same table structure but filtered for system actions */}
            <div className="overflow-x-auto">
              {/* ... similar table structure ... */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Ação</TableHead>
                    <TableHead>Responsável</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historicoFiltrado.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-slate-500">
                        Nenhum registro encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    historicoFiltrado.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="whitespace-nowrap">{formatarData(item.data)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTipoEvento(item.tipoEvento).icon}
                            {getTipoEvento(item.tipoEvento).badge}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            {item.descricao}
                            {renderDetalhes(item.detalhes)}
                          </div>
                        </TableCell>
                        <TableCell>{item.usuario}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
    </ExpandedDialog>
  );
};

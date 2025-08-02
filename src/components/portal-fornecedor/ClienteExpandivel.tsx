
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, FileText, DollarSign, Users, Star, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ClientePortal, DocumentoTransacao } from '@/types/portal-fornecedor';

interface ClienteExpandivelProps {
  cliente: ClientePortal;
  onDocumentoClick: (documento: DocumentoTransacao) => void;
  onAcaoClick: (acao: string, documentoId: string) => void;
  onCardStatClick: (tipo: string, status?: string, clienteId?: string) => void;
}

export const ClienteExpandivel = ({ cliente, onDocumentoClick, onAcaoClick, onCardStatClick }: ClienteExpandivelProps) => {
  const [expandido, setExpandido] = useState(false);

  const getStatusColor = (status: string) => {
    const colors = {
      pendente: 'bg-orange-100 text-orange-800',
      respondido: 'bg-blue-100 text-blue-800',
      aprovado: 'bg-green-100 text-green-800',
      rejeitado: 'bg-red-100 text-red-800',
      em_analise: 'bg-purple-100 text-purple-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPrioridadeColor = (prioridade: string) => {
    const colors = {
      alta: 'border-l-red-500',
      media: 'border-l-yellow-500',
      baixa: 'border-l-green-500'
    };
    return colors[prioridade as keyof typeof colors] || 'border-l-gray-500';
  };

  const documentosPendentes = cliente.documentos.filter(doc => doc.status === 'pendente');
  const documentosUrgentes = cliente.documentos.filter(doc => 
    doc.status === 'pendente' && doc.prioridade === 'alta'
  );

  return (
    <Card className="mb-4 shadow-sm border-l-4 border-l-blue-500">
      <CardHeader 
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setExpandido(!expandido)}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {cliente.nome.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">{cliente.nome}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>CNPJ: {cliente.cnpj}</span>
                  <span>•</span>
                  <span>Cliente desde {cliente.relacionamentoDesde}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{cliente.scoreRelacionamento}/10</span>
                  </div>
                </div>
              </div>
            </div>
            
            {documentosUrgentes.length > 0 && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {documentosUrgentes.length} Urgente{documentosUrgentes.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-6">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-orange-600">{cliente.documentosPendentes}</div>
                <div className="text-xs text-muted-foreground">Pendentes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{cliente.documentosRespondidos}</div>
                <div className="text-xs text-muted-foreground">Respondidos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{cliente.documentosAprovados}</div>
                <div className="text-xs text-muted-foreground">Aprovados</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{cliente.volumeMensal}</div>
                <div className="text-xs text-muted-foreground">Vol. Mensal</div>
              </div>
            </div>
            
            <Button variant="ghost" size="icon">
              {expandido ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      {expandido && (
        <CardContent className="pt-0">
          {/* Estatísticas Detalhadas */}
          <div className="bg-muted/20 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-4 gap-4">
              <div 
                className="text-center p-3 bg-white rounded-lg border-l-4 border-l-red-500 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onCardStatClick('cotacao', 'pendente', cliente.id)}
              >
                <div className="text-lg font-bold text-gray-900">{cliente.estatisticas.cotacoes.total}</div>
                <div className="text-sm text-gray-600">Cotações</div>
                <div className="text-xs text-gray-500">
                  {cliente.estatisticas.cotacoes.pendentes} pendentes
                </div>
              </div>
              <div 
                className="text-center p-3 bg-white rounded-lg border-l-4 border-l-blue-500 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onCardStatClick('pedido', 'pendente', cliente.id)}
              >
                <div className="text-lg font-bold text-gray-900">{cliente.estatisticas.pedidos.total}</div>
                <div className="text-sm text-gray-600">Pedidos</div>
                <div className="text-xs text-gray-500">
                  {cliente.estatisticas.pedidos.pendentes} pendentes
                </div>
              </div>
              <div 
                className="text-center p-3 bg-white rounded-lg border-l-4 border-l-purple-500 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onCardStatClick('contrato', 'pendente', cliente.id)}
              >
                <div className="text-lg font-bold text-gray-900">{cliente.estatisticas.contratos.total}</div>
                <div className="text-sm text-gray-600">Contratos</div>
                <div className="text-xs text-gray-500">
                  {cliente.estatisticas.contratos.pendentes} pendentes
                </div>
              </div>
              <div 
                className="text-center p-3 bg-white rounded-lg border-l-4 border-l-green-500 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onCardStatClick('qualificacao', 'pendente', cliente.id)}
              >
                <div className="text-lg font-bold text-gray-900">{cliente.estatisticas.qualificacoes.total}</div>
                <div className="text-sm text-gray-600">Qualificações</div>
                <div className="text-xs text-gray-500">
                  {cliente.estatisticas.qualificacoes.pendentes} pendentes
                </div>
              </div>
            </div>
          </div>

          {/* Documentos Pendentes */}
          {documentosPendentes.length > 0 ? (
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Documentos Pendentes ({documentosPendentes.length})
              </h4>
              
              {documentosPendentes.map((documento) => (
                <div 
                  key={documento.id}
                  className={`bg-background border rounded-lg p-4 border-l-4 ${getPrioridadeColor(documento.prioridade)} hover:shadow-md transition-shadow cursor-pointer`}
                  onClick={() => onDocumentoClick(documento)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-semibold text-foreground">{documento.titulo}</h5>
                        <Badge className={getStatusColor(documento.status)}>
                          {documento.status}
                        </Badge>
                        {documento.prioridade === 'alta' && (
                          <Badge variant="destructive" className="text-xs">
                            URGENTE
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{documento.descricao}</p>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Recebido: {documento.dataRecebimento}
                        </span>
                        {documento.prazoResposta && (
                          <span className="flex items-center gap-1 text-orange-600">
                            <AlertCircle className="w-3 h-3" />
                            Prazo: {documento.prazoResposta}
                          </span>
                        )}
                        {documento.valor && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {documento.valor}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      {documento.acoes.map((acao, index) => (
                        <Button
                          key={index}
                          size="sm"
                          variant={acao.includes('Responder') || acao.includes('Aprovar') ? 'default' : 'outline'}
                          onClick={(e) => {
                            e.stopPropagation();
                            onAcaoClick(acao, documento.id);
                          }}
                        >
                          {acao}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-foreground mb-2">✅ Tudo em dia!</h4>
              <p className="text-muted-foreground">Não há documentos pendentes para este cliente.</p>
            </div>
          )}

          {/* Contatos do Cliente */}
          {cliente.contatos.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                <Users className="w-4 h-4" />
                Contatos ({cliente.contatos.length})
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {cliente.contatos.slice(0, 4).map((contato) => (
                  <div key={contato.id} className="flex items-center gap-3 p-2 bg-muted/20 rounded-lg">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">
                      {contato.nome.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{contato.nome}</div>
                      <div className="text-xs text-muted-foreground truncate">{contato.cargo}</div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {contato.perfil}
                    </Badge>
                  </div>
                ))}
              </div>
              {cliente.contatos.length > 4 && (
                <div className="text-center mt-2">
                  <Button variant="ghost" size="sm">
                    Ver todos os contatos (+{cliente.contatos.length - 4})
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

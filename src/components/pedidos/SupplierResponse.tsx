import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Clock, 
  CheckCircle, 
  HelpCircle, 
  Edit, 
  XCircle, 
  Calendar,
  FileText
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Pedido, Questionamento, AlteracaoProposta } from "@/types/pedido";

interface SupplierResponseProps {
  pedido: Pedido;
  onProcessarResposta?: (acao: string) => void;
}

export const SupplierResponse: React.FC<SupplierResponseProps> = ({ 
  pedido, 
  onProcessarResposta 
}) => {
  // Simular resposta do fornecedor baseada no status
  const resposta = pedido.status === 'questionado' || pedido.status === 'confirmado' 
    ? {
        tipo_resposta: pedido.status === 'confirmado' ? 'aceitar' : 'questionar',
        data_resposta: new Date().toISOString(),
        confirmacao_prazo: pedido.status === 'confirmado' ? pedido.data_entrega_solicitada : undefined,
        observacoes: pedido.status === 'confirmado' 
          ? "Pedido confirmado conforme especificações" 
          : "Temos algumas dúvidas sobre as especificações",
        questionamentos: pedido.status === 'questionado' ? [
          {
            campo: "Especificação Técnica",
            pergunta: "Poderia esclarecer se o material deve atender a norma ABNT NBR 15270?",
            urgencia: 'media' as const,
            prazo_resposta: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
          }
        ] : [],
        alteracoes_propostas: [] as AlteracaoProposta[],
        anexos: []
      } 
    : null;

  if (!resposta && pedido.status !== 'enviado' && pedido.status !== 'visualizado') {
    return (
      <Card className="p-4">
        <div className="flex items-center text-muted-foreground">
          <Clock className="h-4 w-4 mr-2" />
          <span>Pedido ainda não foi enviado ao fornecedor</span>
        </div>
      </Card>
    );
  }

  if (!resposta) {
    return (
      <Card className="p-4">
        <div className="flex items-center text-muted-foreground">
          <Clock className="h-4 w-4 mr-2" />
          <span>Aguardando resposta do fornecedor via portal</span>
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          Enviado em: {pedido.data_envio_portal && format(new Date(pedido.data_envio_portal), "dd/MM/yyyy HH:mm", { locale: ptBR })}
        </div>
      </Card>
    );
  }

  const getTipoRespostaConfig = (tipo: string) => {
    const configs = {
      'aceitar': { 
        icon: CheckCircle, 
        color: 'default', 
        label: 'Pedido Aceito' 
      },
      'questionar': { 
        icon: HelpCircle, 
        color: 'secondary', 
        label: 'Questionamentos Enviados' 
      },
      'alterar': { 
        icon: Edit, 
        color: 'secondary', 
        label: 'Alterações Propostas' 
      },
      'recusar': { 
        icon: XCircle, 
        color: 'destructive', 
        label: 'Pedido Recusado' 
      }
    } as const;
    return configs[tipo as keyof typeof configs] || { icon: HelpCircle, color: 'secondary' as const, label: tipo };
  };

  const config = getTipoRespostaConfig(resposta.tipo_resposta);
  const Icon = config.icon;

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          Resposta do Fornecedor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Header da resposta */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={config.color}>
              <Icon className="h-3 w-3 mr-1" />
              {config.label}
            </Badge>
          </div>
          <span className="text-sm text-muted-foreground">
            {format(new Date(resposta.data_resposta), "dd/MM/yyyy HH:mm", { locale: ptBR })}
          </span>
        </div>

        {/* Confirmação de prazo */}
        {resposta.confirmacao_prazo && (
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800">
                Prazo confirmado: {format(new Date(resposta.confirmacao_prazo), "dd/MM/yyyy", { locale: ptBR })}
              </span>
            </div>
          </div>
        )}

        {/* Observações */}
        {resposta.observacoes && (
          <div>
            <h4 className="text-sm font-medium mb-1">Observações do Fornecedor:</h4>
            <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
              {resposta.observacoes}
            </p>
          </div>
        )}

        {/* Questionamentos */}
        {resposta.questionamentos && resposta.questionamentos.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Questionamentos:</h4>
            <div className="space-y-2">
              {resposta.questionamentos.map((q, index) => (
                <div key={index} className="border border-yellow-200 bg-yellow-50 p-3 rounded">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-800">
                        {q.campo}
                      </p>
                      <p className="text-sm text-yellow-700 mt-1">
                        {q.pergunta}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {q.urgencia}
                    </Badge>
                  </div>
                  {q.prazo_resposta && (
                    <div className="mt-2 text-xs text-yellow-600">
                      Resposta até: {format(new Date(q.prazo_resposta), "dd/MM/yyyy", { locale: ptBR })}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-3 flex gap-2">
              <Button 
                size="sm"
                onClick={() => onProcessarResposta?.('responder_questionamentos')}
              >
                Responder Questionamentos
              </Button>
            </div>
          </div>
        )}

        {/* Alterações propostas */}
        {resposta.alteracoes_propostas && resposta.alteracoes_propostas.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Alterações Propostas:</h4>
            <div className="space-y-2">
              {resposta.alteracoes_propostas.map((alt, index) => (
                <div key={index} className="border border-blue-200 bg-blue-50 p-3 rounded">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Tipo:</span>
                      <span className="ml-2 capitalize">{alt.tipo}</span>
                    </div>
                    <div>
                      <span className="font-medium">Item:</span>
                      <span className="ml-2">{alt.item_id || 'Geral'}</span>
                    </div>
                    <div>
                      <span className="font-medium">De:</span>
                      <span className="ml-2">{alt.valor_atual}</span>
                    </div>
                    <div>
                      <span className="font-medium">Para:</span>
                      <span className="ml-2 font-semibold">{alt.valor_proposto}</span>
                    </div>
                  </div>
                  
                  {alt.justificativa && (
                    <div className="mt-2">
                      <span className="text-sm font-medium">Justificativa:</span>
                      <p className="text-sm text-blue-700 mt-1">{alt.justificativa}</p>
                    </div>
                  )}
                  
                  {alt.impacto_valor && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Impacto no valor:</span>
                      <span className={`ml-2 ${alt.impacto_valor > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {alt.impacto_valor > 0 ? '+' : ''}{formatarMoeda(alt.impacto_valor)}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-3 flex gap-2">
              <Button 
                size="sm"
                onClick={() => onProcessarResposta?.('aceitar_alteracoes')}
              >
                Aceitar Alterações
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onProcessarResposta?.('rejeitar_alteracoes')}
              >
                Rejeitar
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onProcessarResposta?.('negociar_alteracoes')}
              >
                Negociar
              </Button>
            </div>
          </div>
        )}

        {/* Motivo de recusa */}
        {resposta.tipo_resposta === 'recusar' && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Pedido Recusado</AlertTitle>
            <AlertDescription>
              {resposta.observacoes || "O fornecedor recusou este pedido."}
            </AlertDescription>
          </Alert>
        )}

        {/* Anexos do fornecedor */}
        {resposta.anexos && resposta.anexos.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Documentos do Fornecedor:</h4>
            <div className="flex flex-wrap gap-2">
              {resposta.anexos.map((anexo, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => {/* downloadAnexo(anexo) */}}
                  className="gap-2"
                >
                  <FileText className="h-3 w-3" />
                  Anexo {index + 1}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
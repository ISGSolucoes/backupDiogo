
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { usePortalIntegration } from "@/hooks/usePortalIntegration";
import { 
  Send, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Building,
  ArrowRight
} from "lucide-react";
import { Pedido } from "@/types/pedido";

interface IntegracaoFornecedorProps {
  pedido: Pedido;
}

const fornecedoresMock = [
  { id: "1", nome: "TechSupply Solutions", cnpj: "12.345.678/0001-90" },
  { id: "2", nome: "Industrial Parts Ltda", cnpj: "98.765.432/0001-10" },
  { id: "3", nome: "MetalWorks Corp", cnpj: "11.222.333/0001-44" }
];

export const IntegracaoFornecedor: React.FC<IntegracaoFornecedorProps> = ({ pedido }) => {
  const { toast } = useToast();
  const { enviarPedidoPortal } = usePortalIntegration();
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState("");
  const [mensagemPersonalizada, setMensagemPersonalizada] = useState("");
  const [enviandoPedido, setEnviandoPedido] = useState(false);
  const [statusIntegracao, setStatusIntegracao] = useState<string | null>(null);

  const podeEnviar = pedido.status === 'aprovado' && !pedido.data_envio_portal;
  const jaEnviado = pedido.data_envio_portal !== null;

  const handleEnviarParaFornecedor = async () => {
    if (!fornecedorSelecionado) {
      toast({
        title: "Erro",
        description: "Selecione um fornecedor antes de enviar",
        variant: "destructive",
      });
      return;
    }

    setEnviandoPedido(true);
    
    try {
      // Usar integração real com portal do fornecedor
      await enviarPedidoPortal.mutateAsync({
        ...pedido,
        fornecedor_id: fornecedorSelecionado,
        observacoes_portal: mensagemPersonalizada,
        data_envio: new Date().toISOString()
      });
      
      setStatusIntegracao('enviado');
      
      toast({
        title: "Sucesso",
        description: `Pedido enviado para ${fornecedoresMock.find(f => f.id === fornecedorSelecionado)?.nome}`,
      });

    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao enviar pedido para o fornecedor",
        variant: "destructive",
      });
    } finally {
      setEnviandoPedido(false);
    }
  };

  const getStatusBadge = () => {
    if (!jaEnviado && !statusIntegracao) {
      return (
        <Badge variant="secondary">
          <Clock className="h-3 w-3 mr-1" />
          Pronto para Envio
        </Badge>
      );
    }
    
    if (statusIntegracao === 'enviado' || jaEnviado) {
      return (
        <Badge variant="default">
          <CheckCircle className="h-3 w-3 mr-1" />
          Enviado ao Fornecedor
        </Badge>
      );
    }

    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Integração com Fornecedor
          </div>
          {getStatusBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!podeEnviar && !jaEnviado && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center text-yellow-800">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <span className="text-sm">
                Pedido precisa estar aprovado para ser enviado ao fornecedor
              </span>
            </div>
          </div>
        )}

        {jaEnviado && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center text-green-800">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span className="text-sm">
                Pedido enviado em: {new Date(pedido.data_envio_portal!).toLocaleString('pt-BR')}
              </span>
            </div>
          </div>
        )}

        {podeEnviar && !statusIntegracao && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Selecionar Fornecedor:</label>
              <Select value={fornecedorSelecionado} onValueChange={setFornecedorSelecionado}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha o fornecedor..." />
                </SelectTrigger>
                <SelectContent>
                  {fornecedoresMock.map((fornecedor) => (
                    <SelectItem key={fornecedor.id} value={fornecedor.id}>
                      <div>
                        <div className="font-medium">{fornecedor.nome}</div>
                        <div className="text-xs text-muted-foreground">{fornecedor.cnpj}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Mensagem Personalizada (Opcional):</label>
              <Textarea
                placeholder="Adicione instruções específicas ou observações para o fornecedor..."
                value={mensagemPersonalizada}
                onChange={(e) => setMensagemPersonalizada(e.target.value)}
                rows={3}
              />
            </div>

            <Button 
              onClick={handleEnviarParaFornecedor}
              disabled={enviandoPedido || !fornecedorSelecionado}
              className="w-full gap-2"
            >
              {enviandoPedido ? (
                <>
                  <Clock className="h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Enviar para Meu Portal de Negócios
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </>
        )}

        {(statusIntegracao === 'enviado' || jaEnviado) && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Próximos Passos:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• O fornecedor receberá o pedido em seu portal</li>
              <li>• Você será notificado quando houver uma resposta</li>
              <li>• Acompanhe o status na aba de integrações</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

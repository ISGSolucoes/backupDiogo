import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface ValidacaoPedido {
  valido: boolean;
  erros: string[];
  alertas: string[];
}

interface ChecklistValidacaoProps {
  validacao: ValidacaoPedido;
}

export function ChecklistValidacao({ validacao }: ChecklistValidacaoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {validacao.valido ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500" />
          )}
          Checklist de Validação
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status geral */}
        <div className="flex items-center gap-2">
          <Badge 
            variant={validacao.valido ? "default" : "destructive"}
            className={validacao.valido ? "bg-green-500" : "bg-red-500"}
          >
            {validacao.valido ? 'Válido para Envio' : 'Requer Correções'}
          </Badge>
        </div>

        {/* Erros bloqueantes */}
        {validacao.erros && validacao.erros.length > 0 && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-medium">Erros que impedem o envio:</p>
                <ul className="list-disc list-inside space-y-1">
                  {validacao.erros.map((erro, index) => (
                    <li key={index} className="text-sm">{erro}</li>
                  ))}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Alertas informativos */}
        {validacao.alertas && validacao.alertas.length > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-medium">Alertas informativos:</p>
                <ul className="list-disc list-inside space-y-1">
                  {validacao.alertas.map((alerta, index) => (
                    <li key={index} className="text-sm">{alerta}</li>
                  ))}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Checklist visual */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Verificações Obrigatórias:</h4>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {!validacao.erros?.includes('CNPJ do fornecedor é obrigatório') ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm">CNPJ do fornecedor válido</span>
            </div>
            
            <div className="flex items-center gap-2">
              {!validacao.erros?.includes('Local de entrega é obrigatório') ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm">Local de entrega definido</span>
            </div>
            
            <div className="flex items-center gap-2">
              {!validacao.erros?.includes('Data de entrega é obrigatória') ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm">Data de entrega definida</span>
            </div>
            
            <div className="flex items-center gap-2">
              {!validacao.erros?.includes('Condição de pagamento é obrigatória') ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm">Condição de pagamento definida</span>
            </div>
            
            <div className="flex items-center gap-2">
              {!validacao.erros?.includes('Pedido deve ter pelo menos um item') ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm">Itens adicionados ao pedido</span>
            </div>
          </div>
        </div>

        {validacao.valido && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-medium text-green-700">
                ✅ Pedido pronto para envio ao fornecedor!
              </p>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
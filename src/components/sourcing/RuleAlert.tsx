import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Info, AlertTriangle, XCircle, Settings } from "lucide-react";

interface RuleAlert {
  tipo: 'info' | 'warning' | 'error';
  mensagem: string;
  origem: 'setor' | 'categoria' | 'cliente';
}

interface RuleAlertProps {
  alertas: RuleAlert[];
  regrasAplicadas: string[];
  className?: string;
}

export function RuleAlert({ alertas, regrasAplicadas, className }: RuleAlertProps) {
  if (!alertas.length && !regrasAplicadas.length) return null;

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case 'info': return <Info className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'error': return <XCircle className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const getVariant = (tipo: string) => {
    switch (tipo) {
      case 'warning': return 'destructive' as const;
      case 'error': return 'destructive' as const;
      default: return 'default' as const;
    }
  };

  const getBadgeVariant = (origem: string) => {
    switch (origem) {
      case 'setor': return 'secondary' as const;
      case 'categoria': return 'outline' as const;
      case 'cliente': return 'default' as const;
      default: return 'secondary' as const;
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Resumo das regras aplicadas */}
      {regrasAplicadas.length > 0 && (
        <Alert>
          <Settings className="h-4 w-4" />
          <AlertTitle>Configurações Aplicadas</AlertTitle>
          <AlertDescription>
            <div className="flex flex-wrap gap-2 mt-2">
              {regrasAplicadas.map((regra, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {regra}
                </Badge>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Alertas específicos */}
      {alertas.map((alerta, index) => (
        <Alert key={index} variant={getVariant(alerta.tipo)}>
          {getIcon(alerta.tipo)}
          <AlertTitle className="flex items-center gap-2">
            Regra Aplicada
            <Badge variant={getBadgeVariant(alerta.origem)} className="text-xs">
              {alerta.origem}
            </Badge>
          </AlertTitle>
          <AlertDescription>{alerta.mensagem}</AlertDescription>
        </Alert>
      ))}
    </div>
  );
}
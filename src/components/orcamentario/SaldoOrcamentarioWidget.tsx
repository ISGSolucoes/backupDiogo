
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import { useControleOrcamentario } from '@/hooks/useControleOrcamentario';
import type { SaldoOrcamentario } from '@/types/orcamento';

interface SaldoOrcamentarioWidgetProps {
  centroCusto: string;
  projeto?: string;
  categoria?: string;
  valorRequisicao?: number;
  className?: string;
}

export const SaldoOrcamentarioWidget = ({ 
  centroCusto, 
  projeto, 
  categoria, 
  valorRequisicao = 0,
  className 
}: SaldoOrcamentarioWidgetProps) => {
  const { obterSaldoOrcamentario } = useControleOrcamentario();
  const [saldo, setSaldo] = useState<SaldoOrcamentario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarSaldo = async () => {
      if (!centroCusto) return;
      
      setLoading(true);
      const saldoData = await obterSaldoOrcamentario(centroCusto, projeto, categoria);
      setSaldo(saldoData);
      setLoading(false);
    };

    carregarSaldo();
  }, [centroCusto, projeto, categoria, obterSaldoOrcamentario]);

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-2 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!saldo) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="text-center text-muted-foreground">
            <DollarSign className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Orçamento não encontrado</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const saldoAposRequisicao = saldo.valor_disponivel - valorRequisicao;
  const teraSaldoSuficiente = saldoAposRequisicao >= 0;

  const StatusIcon = () => {
    if (!teraSaldoSuficiente) return <XCircle className="h-4 w-4 text-destructive" />;
    if (saldo.status_alerta === 'critico') return <AlertTriangle className="h-4 w-4 text-destructive" />;
    if (saldo.status_alerta === 'atencao') return <AlertTriangle className="h-4 w-4 text-warning" />;
    return <CheckCircle className="h-4 w-4 text-success" />;
  };

  const getStatusColor = () => {
    if (!teraSaldoSuficiente) return 'destructive';
    if (saldo.status_alerta === 'critico') return 'destructive';
    if (saldo.status_alerta === 'atencao') return 'secondary';
    return 'default';
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Saldo Orçamentário
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Disponível:</span>
          <span className={`text-sm font-medium ${
            saldo.valor_disponivel <= 0 ? 'text-destructive' : 'text-foreground'
          }`}>
            R$ {saldo.valor_disponivel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>

        {valorRequisicao > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Após requisição:</span>
            <span className={`text-sm font-medium ${
              saldoAposRequisicao < 0 ? 'text-destructive' : 'text-foreground'
            }`}>
              R$ {saldoAposRequisicao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <StatusIcon />
          <Badge variant={getStatusColor()}>
            {!teraSaldoSuficiente ? 'Saldo Insuficiente' :
             saldo.status_alerta === 'critico' ? 'Saldo Crítico' :
             saldo.status_alerta === 'atencao' ? 'Atenção' : 'Saldo OK'}
          </Badge>
        </div>

        {!teraSaldoSuficiente && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-2">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
              <div className="text-xs">
                <p className="font-medium text-destructive">Orçamento Insuficiente</p>
                <p className="text-destructive/80">
                  Excesso: R$ {Math.abs(saldoAposRequisicao).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

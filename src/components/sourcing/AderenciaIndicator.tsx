import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { useSmartRules } from '@/hooks/useSmartRules';

interface AderenciaIndicatorProps {
  setor?: string;
  categoria?: string;
  clienteId?: string;
  criteriosDefinidos: string[];
  camposPreenchidos: string[];
}

export function AderenciaIndicator({ 
  setor, 
  categoria, 
  clienteId, 
  criteriosDefinidos, 
  camposPreenchidos 
}: AderenciaIndicatorProps) {
  const { recommendation } = useSmartRules(setor, categoria, clienteId);

  const calcularAderencia = () => {
    // Critérios técnicos recomendados
    const criteriosRecomendados = recommendation?.criteriosPadrao || [];
    const criteriosAtendidos = criteriosDefinidos.filter(c => 
      criteriosRecomendados.includes(c)
    ).length;
    
    // Campos obrigatórios
    const camposObrigatorios = recommendation?.camposObrigatorios || [];
    const camposAtendidos = camposPreenchidos.filter(c => 
      camposObrigatorios.includes(c)
    ).length;

    // Cálculo da aderência
    const totalRecomendado = criteriosRecomendados.length + camposObrigatorios.length;
    const totalAtendido = criteriosAtendidos + camposAtendidos;
    
    if (totalRecomendado === 0) return { percentual: 100, detalhes: null };
    
    const percentual = Math.round((totalAtendido / totalRecomendado) * 100);
    
    return {
      percentual,
      detalhes: {
        criteriosRecomendados: criteriosRecomendados.length,
        criteriosAtendidos,
        camposObrigatorios: camposObrigatorios.length,
        camposAtendidos,
        faltandoCriterios: criteriosRecomendados.filter(c => !criteriosDefinidos.includes(c)),
        faltandoCampos: camposObrigatorios.filter(c => !camposPreenchidos.includes(c))
      }
    };
  };

  const { percentual, detalhes } = calcularAderencia();

  const getStatusConfig = (percent: number) => {
    if (percent >= 90) {
      return {
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        icon: CheckCircle,
        status: 'Excelente',
        message: 'Configuração completa seguindo as melhores práticas!'
      };
    } else if (percent >= 70) {
      return {
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        icon: TrendingUp,
        status: 'Bom',
        message: 'Algumas melhorias podem ser aplicadas.'
      };
    } else {
      return {
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        icon: AlertCircle,
        status: 'Precisa melhorar',
        message: 'Configuração incompleta. Revise as recomendações.'
      };
    }
  };

  const config = getStatusConfig(percentual);
  const Icon = config.icon;

  if (!setor && !categoria) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className={`h-5 w-5 ${config.color}`} />
          Indicador de Aderência Técnica
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1 rounded-full ${config.bgColor}`}>
                <span className={`font-semibold ${config.color}`}>
                  {percentual}%
                </span>
              </div>
              <Badge variant={percentual >= 70 ? 'secondary' : 'destructive'}>
                {config.status}
              </Badge>
            </div>
          </div>
          
          <Progress value={percentual} className="h-3" />
          
          <p className="text-sm text-muted-foreground">
            {config.message}
          </p>
          
          {detalhes && (
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div>
                <span className="font-medium">Critérios Técnicos:</span>
                <span className="ml-2 text-muted-foreground">
                  {detalhes.criteriosAtendidos}/{detalhes.criteriosRecomendados}
                </span>
              </div>
              <div>
                <span className="font-medium">Campos Obrigatórios:</span>
                <span className="ml-2 text-muted-foreground">
                  {detalhes.camposAtendidos}/{detalhes.camposObrigatorios}
                </span>
              </div>
            </div>
          )}
          
          {detalhes && (detalhes.faltandoCriterios.length > 0 || detalhes.faltandoCampos.length > 0) && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Sugestões de Melhoria:</h4>
              {detalhes.faltandoCriterios.length > 0 && (
                <p className="text-xs text-muted-foreground mb-1">
                  <strong>Critérios recomendados:</strong> {detalhes.faltandoCriterios.join(', ')}
                </p>
              )}
              {detalhes.faltandoCampos.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  <strong>Campos pendentes:</strong> {detalhes.faltandoCampos.join(', ')}
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
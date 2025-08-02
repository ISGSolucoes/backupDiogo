import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Building2, Tag, Users } from 'lucide-react';
import { useSmartRules } from '@/hooks/useSmartRules';

interface ModeloBannerProps {
  setor?: string;
  categoria?: string;
  clienteId?: string;
  tipoEvento?: string;
  departamento?: string;
}

export function ModeloBanner({ setor, categoria, clienteId, tipoEvento, departamento }: ModeloBannerProps) {
  const { recommendation } = useSmartRules(setor, categoria, clienteId, departamento);

  if (!setor && !categoria && !clienteId) {
    return null;
  }

  return (
    <Card className="mb-6 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Brain className="h-5 w-5 text-primary" />
          <span className="font-semibold text-primary">Modelo Aplicado</span>
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          {tipoEvento && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {tipoEvento.toUpperCase()}
            </Badge>
          )}
          
          {setor && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              Setor: {setor}
            </Badge>
          )}
          
          {categoria && (
            <Badge variant="outline">
              Categoria: {categoria}
            </Badge>
          )}
          
          {clienteId && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              Cliente: {clienteId}
            </Badge>
          )}
          
          {departamento && (
            <Badge variant="outline">
              Departamento: {departamento}
            </Badge>
          )}
        </div>
        
        {recommendation?.regrasAplicadas && recommendation.regrasAplicadas.length > 0 && (
          <div className="mt-3 text-sm text-muted-foreground">
            <span className="font-medium">{recommendation.regrasAplicadas.length}</span> regras aplicadas automaticamente
          </div>
        )}
      </CardContent>
    </Card>
  );
}
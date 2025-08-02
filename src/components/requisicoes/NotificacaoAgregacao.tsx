import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Zap, DollarSign, Calendar, Users, CheckCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SugestaoAgregacao {
  id: string;
  categorias: string[];
  requisicoes: Array<{
    id: string;
    numero: string;
    valor: number;
    solicitante: string;
  }>;
  valor_total: number;
  economia_estimada: number;
  tipo_sugerido: 'cotacao' | 'leilao';
  prazo_sugerido: number;
  justificativa: string;
}

interface NotificacaoAgregacaoProps {
  sugestoes: SugestaoAgregacao[];
  onAcceptSuggestion: (sugestao: SugestaoAgregacao) => void;
  onDismiss: (sugestaoId: string) => void;
}

export const NotificacaoAgregacao = ({ 
  sugestoes, 
  onAcceptSuggestion, 
  onDismiss 
}: NotificacaoAgregacaoProps) => {
  const { toast } = useToast();
  const [processando, setProcessando] = useState<string | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleAccept = async (sugestao: SugestaoAgregacao) => {
    setProcessando(sugestao.id);
    try {
      await onAcceptSuggestion(sugestao);
      toast({
        title: "Evento de Sourcing Criado",
        description: `Agregação aceita - ${sugestao.requisicoes.length} requisições consolidadas`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao criar evento de agregação",
        variant: "destructive"
      });
    }
    setProcessando(null);
  };

  const handleDismiss = (sugestaoId: string) => {
    onDismiss(sugestaoId);
    toast({
      title: "Sugestão descartada",
      description: "A sugestão de agregação foi removida",
    });
  };

  if (sugestoes.length === 0) return null;

  return (
    <div className="space-y-4">
      {sugestoes.map((sugestao) => (
        <Alert key={sugestao.id} className="border-l-4 border-l-primary bg-primary/5">
          <Zap className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg mb-2">
                    🤖 Oportunidade de Agregação Detectada
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {sugestao.justificativa}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDismiss(sugestao.id)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Valor Total</p>
                    <p className="font-semibold">{formatCurrency(sugestao.valor_total)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Economia Est.</p>
                    <p className="font-semibold text-green-600">
                      {formatCurrency(sugestao.economia_estimada)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Requisições</p>
                    <p className="font-semibold">{sugestao.requisicoes.length}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Prazo Sugerido</p>
                    <p className="font-semibold">{sugestao.prazo_sugerido} dias</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Categorias:</p>
                <div className="flex flex-wrap gap-2">
                  {sugestao.categorias.map((categoria, index) => (
                    <Badge key={index} variant="secondary">
                      {categoria}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Requisições incluídas:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {sugestao.requisicoes.map((req) => (
                    <div key={req.id} className="flex justify-between items-center text-sm bg-white p-2 rounded border">
                      <span>{req.numero}</span>
                      <span className="font-medium">{formatCurrency(req.valor)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={sugestao.tipo_sugerido === 'leilao' ? 'destructive' : 'default'}
                  >
                    {sugestao.tipo_sugerido === 'leilao' ? 'Leilão Eletrônico' : 'Cotação Eletrônica'}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Tipo de evento recomendado
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDismiss(sugestao.id)}
                  >
                    Não Agregar
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAccept(sugestao)}
                    disabled={processando === sugestao.id}
                  >
                    {processando === sugestao.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Criando...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Criar Evento Agregado
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
};
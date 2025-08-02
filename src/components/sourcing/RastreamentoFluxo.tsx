import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Target, 
  ShoppingCart, 
  ArrowRight, 
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface RastreamentoFluxoProps {
  requisicaoId?: string;
  solicitacaoId?: string;
  projetoId?: string;
  pedidoId?: string;
  className?: string;
}

interface FluxoItem {
  id: string;
  tipo: 'requisicao' | 'solicitacao' | 'projeto' | 'pedido';
  titulo: string;
  status: string;
  data: string;
  valor?: number;
  link?: string;
  icon: React.ComponentType<any>;
  color: string;
}

export function RastreamentoFluxo({
  requisicaoId,
  solicitacaoId,
  projetoId,
  pedidoId,
  className
}: RastreamentoFluxoProps) {
  
  // Mock data - in real implementation, fetch from API
  const fluxoItems: FluxoItem[] = [
    {
      id: requisicaoId || 'req-001',
      tipo: 'requisicao',
      titulo: 'REQ-2025-000002 - Licenças Microsoft Office 365',
      status: 'Aprovada',
      data: '19/07/2025',
      valor: 12800,
      link: `/requisicoes/${requisicaoId}`,
      icon: FileText,
      color: 'text-success'
    },
    {
      id: solicitacaoId || 'sol-001',
      tipo: 'solicitacao',
      titulo: 'Solicitação de Sourcing Criada',
      status: solicitacaoId ? 'Aceita' : 'Pendente',
      data: '19/07/2025',
      link: `/sourcing/solicitacoes/${solicitacaoId}`,
      icon: Target,
      color: solicitacaoId ? 'text-success' : 'text-warning'
    },
    ...(projetoId ? [{
      id: projetoId,
      tipo: 'projeto' as const,
      titulo: `SRC-2025-000001 - Projeto de Sourcing`,
      status: pedidoId ? 'Finalizado' : 'Em Execução',
      data: '19/07/2025',
      link: `/sourcing/projetos/${projetoId}`,
      icon: Target,
      color: pedidoId ? 'text-success' : 'text-primary'
    }] : []),
    ...(pedidoId ? [{
      id: pedidoId,
      tipo: 'pedido' as const,
      titulo: `PO-2025-000123 - Pedido Gerado`,
      status: 'Criado',
      data: '19/07/2025',
      valor: 10500,
      link: `/pedidos/${pedidoId}`,
      icon: ShoppingCart,
      color: 'text-success'
    }] : [])
  ];

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aprovada':
      case 'aceita':
      case 'finalizado':
      case 'criado':
        return <CheckCircle className="h-4 w-4" />;
      case 'pendente':
      case 'em execução':
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aprovada':
      case 'aceita':
      case 'finalizado':
      case 'criado':
        return 'text-success';
      case 'pendente':
      case 'em execução':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRight className="h-5 w-5" />
          Rastreamento do Fluxo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {fluxoItems.map((item, index) => {
            const Icon = item.icon;
            
            return (
              <div key={item.id}>
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-full bg-background border-2 ${
                    item.color === 'text-success' ? 'border-success bg-success/10' :
                    item.color === 'text-warning' ? 'border-warning bg-warning/10' :
                    item.color === 'text-primary' ? 'border-primary bg-primary/10' :
                    'border-border'
                  }`}>
                    <Icon className={`h-4 w-4 ${item.color}`} />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{item.titulo}</h4>
                      {item.link && (
                        <Button variant="ghost" size="sm" className="h-8 gap-1">
                          Ver Detalhes
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        {getStatusIcon(item.status)}
                        <Badge 
                          variant="outline" 
                          className={`${getStatusColor(item.status)} border-current`}
                        >
                          {item.status}
                        </Badge>
                      </div>
                      
                      <span>{item.data}</span>
                      
                      {item.valor && (
                        <span className="font-medium">
                          R$ {item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {index < fluxoItems.length - 1 && (
                  <div className="ml-6 mt-2 mb-2">
                    <Separator orientation="vertical" className="h-4" />
                  </div>
                )}
              </div>
            );
          })}
          
          {fluxoItems.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p>Nenhum dado de rastreamento disponível</p>
            </div>
          )}
          
          {!pedidoId && projetoId && (
            <div className="mt-4 p-3 bg-accent/50 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-primary" />
                <span>Próximo passo: Finalizar projeto para gerar pedido automaticamente</span>
              </div>
            </div>
          )}
          
          {!projetoId && solicitacaoId && (
            <div className="mt-4 p-3 bg-accent/50 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-primary" />
                <span>Próximo passo: Aceitar solicitação para criar projeto</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
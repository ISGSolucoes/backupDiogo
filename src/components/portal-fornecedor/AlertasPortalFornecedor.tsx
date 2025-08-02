import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Clock, 
  FileText, 
  ShoppingCart, 
  Bell,
  ArrowRight,
  Calendar,
  Package
} from 'lucide-react';
import { ClientePortal } from '@/types/portal-fornecedor';
import { isDocumentoNovo } from '@/utils/documentoUtils';

interface AlertasPortalFornecedorProps {
  clientes: ClientePortal[];
  onNavigateToDocument: (tipo: string, clienteId?: string, filtro?: string) => void;
}

interface AlertaItem {
  id: string;
  tipo: 'urgente' | 'novo_pedido' | 'nova_cotacao' | 'pendente' | 'sistema';
  titulo: string;
  descricao: string;
  contador: number;
  novos?: number;
  pendentes?: number;
  prazo?: string;
  prioridade: 'alta' | 'media' | 'baixa';
  acao: string;
  clienteNome?: string;
  clienteId?: string;
}

export const AlertasPortalFornecedor = ({ clientes, onNavigateToDocument }: AlertasPortalFornecedorProps) => {
  
  const calcularAlertas = (): AlertaItem[] => {
    const alertas: AlertaItem[] = [];
    
    // Contar usando a lógica de tempo real
    let novosPedidos = 0;
    let pendentesPedidos = 0;
    let novasCotacoes = 0;
    let pendentesCotacoes = 0;
    let novasQualificacoes = 0;
    let pendentesQualificacoes = 0;
    
    clientes.forEach(cliente => {
      cliente.documentos.forEach(doc => {
        if (doc.status === 'pendente') {
          if (doc.tipo === 'pedido') {
            if (isDocumentoNovo('pedido', doc.dataRecebimento)) {
              novosPedidos++;
            } else {
              pendentesPedidos++;
            }
          } else if (doc.tipo === 'cotacao') {
            if (isDocumentoNovo('cotacao', doc.dataRecebimento)) {
              novasCotacoes++;
            } else {
              pendentesCotacoes++;
            }
          } else if (doc.tipo === 'qualificacao') {
            if (isDocumentoNovo('qualificacao', doc.dataRecebimento)) {
              novasQualificacoes++;
            } else {
              pendentesQualificacoes++;
            }
          }
        }
      });
    });
    
    // Garantir valores mínimos expressivos para demonstração
    novosPedidos = Math.max(novosPedidos, 8);
    pendentesPedidos = Math.max(pendentesPedidos, 15);
    novasCotacoes = Math.max(novasCotacoes, 5);
    pendentesCotacoes = Math.max(pendentesCotacoes, 12);
    novasQualificacoes = Math.max(novasQualificacoes, 3);
    pendentesQualificacoes = Math.max(pendentesQualificacoes, 8);
    
    // Card consolidado de Pedidos
    if (novosPedidos > 0 || pendentesPedidos > 0) {
      alertas.push({
        id: 'pedidos_consolidado',
        tipo: 'novo_pedido',
        titulo: 'Pedidos',
        descricao: `• Novos (até 3 dias): ${novosPedidos} • Pendentes (>3 dias): ${pendentesPedidos}`,
        contador: novosPedidos + pendentesPedidos,
        novos: novosPedidos,
        pendentes: pendentesPedidos,
        prioridade: 'media',
        acao: 'Ver Pedidos'
      });
    }
    
    // Card consolidado de Cotações
    if (novasCotacoes > 0 || pendentesCotacoes > 0) {
      alertas.push({
        id: 'cotacoes_consolidado',
        tipo: 'nova_cotacao',
        titulo: 'Cotações',
        descricao: `• Novas (até 1 dia): ${novasCotacoes} • Pendentes (>1 dia): ${pendentesCotacoes}`,
        contador: novasCotacoes + pendentesCotacoes,
        novos: novasCotacoes,
        pendentes: pendentesCotacoes,
        prioridade: 'media',
        acao: 'Ver Cotações'
      });
    }
    
    // Card consolidado de Qualificações
    if (novasQualificacoes > 0 || pendentesQualificacoes > 0) {
      alertas.push({
        id: 'qualificacoes_consolidado',
        tipo: 'pendente',
        titulo: 'Qualificações',
        descricao: `• Novas (até 3 dias): ${novasQualificacoes} • Pendentes (>3 dias): ${pendentesQualificacoes}`,
        contador: novasQualificacoes + pendentesQualificacoes,
        novos: novasQualificacoes,
        pendentes: pendentesQualificacoes,
        prioridade: 'baixa',
        acao: 'Ver Todos'
      });
    }
    
    // Alerta de sistema (exemplo)
    alertas.push({
      id: 'sistema',
      tipo: 'sistema',
      titulo: 'Atualização do Sistema',
      descricao: 'Nova versão do portal disponível com melhorias',
      contador: 1,
      prioridade: 'baixa',
      acao: 'Saiba Mais'
    });
    
    return alertas;
  };
  
  const getAlertConfig = (tipo: AlertaItem['tipo']) => {
    switch (tipo) {
      case 'urgente':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconColor: 'text-red-600',
          badgeColor: 'bg-red-100 text-red-800',
          buttonColor: 'bg-red-600 hover:bg-red-700'
        };
      case 'novo_pedido':
        return {
          icon: Package,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconColor: 'text-green-600',
          badgeColor: 'bg-green-100 text-green-800',
          buttonColor: 'bg-green-600 hover:bg-green-700'
        };
      case 'nova_cotacao':
        return {
          icon: FileText,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-600',
          badgeColor: 'bg-blue-100 text-blue-800',
          buttonColor: 'bg-blue-600 hover:bg-blue-700'
        };
      case 'pendente':
        return {
          icon: Clock,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          iconColor: 'text-yellow-600',
          badgeColor: 'bg-yellow-100 text-yellow-800',
          buttonColor: 'bg-yellow-600 hover:bg-yellow-700'
        };
      case 'sistema':
        return {
          icon: Bell,
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          iconColor: 'text-purple-600',
          badgeColor: 'bg-purple-100 text-purple-800',
          buttonColor: 'bg-purple-600 hover:bg-purple-700'
        };
      default:
        return {
          icon: Bell,
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          iconColor: 'text-gray-600',
          badgeColor: 'bg-gray-100 text-gray-800',
          buttonColor: 'bg-gray-600 hover:bg-gray-700'
        };
    }
  };

  const handleSpecificNavigation = (alerta: AlertaItem, filtro: 'novo' | 'pendente') => {
    const tipoMap = {
      'novo_pedido': 'pedido',
      'nova_cotacao': 'cotacao',
      'pendente': 'qualificacao'
    };
    
    const tipo = tipoMap[alerta.tipo as keyof typeof tipoMap] || alerta.tipo;
    onNavigateToDocument(tipo, undefined, filtro);
  };
  
  const handleAlertClick = (alerta: AlertaItem) => {
    switch (alerta.tipo) {
      case 'urgente':
        onNavigateToDocument('urgente');
        break;
      case 'novo_pedido':
        onNavigateToDocument('pedido');
        break;
      case 'nova_cotacao':
        onNavigateToDocument('cotacao');
        break;
      case 'pendente':
        onNavigateToDocument('qualificacao');
        break;
      case 'sistema':
        console.log('Navegar para novidades do sistema');
        break;
    }
  };
  
  const alertas = calcularAlertas();
  
  if (alertas.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="w-5 h-5 text-orange-600" />
        <h3 className="text-lg font-semibold text-gray-900">Alertas e Ações Urgentes</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {alertas.map((alerta) => {
          const config = getAlertConfig(alerta.tipo);
          const Icon = config.icon;
          
          return (
            <Card 
              key={alerta.id} 
              className={`${config.bgColor} ${config.borderColor} border-l-4 hover:shadow-md transition-all duration-200`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-white shadow-sm`}>
                      <Icon className={`h-5 w-5 ${config.iconColor}`} />
                    </div>
                    <h4 className="font-semibold text-gray-900 text-lg">
                      {alerta.titulo}
                    </h4>
                  </div>
                  <Badge className={`${config.badgeColor} text-sm font-medium`}>
                    {alerta.contador}
                  </Badge>
                </div>
                
                {alerta.novos !== undefined && alerta.pendentes !== undefined ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div 
                        className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border hover:border-green-300 hover:bg-green-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSpecificNavigation(alerta, 'novo');
                        }}
                      >
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-600 mb-1">
                            {alerta.novos}
                          </div>
                          <div className="text-sm text-gray-600 font-medium">
                            Novos
                          </div>
                        </div>
                      </div>
                      
                      <div 
                        className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border hover:border-orange-300 hover:bg-orange-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSpecificNavigation(alerta, 'pendente');
                        }}
                      >
                        <div className="text-center">
                          <div className="text-3xl font-bold text-orange-600 mb-1">
                            {alerta.pendentes}
                          </div>
                          <div className="text-sm text-gray-600 font-medium">
                            Pendentes
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {alerta.prazo && (
                      <div className="flex items-center gap-1 text-xs text-red-600">
                        <Calendar className="w-3 h-3" />
                        <span>Prazo: {alerta.prazo}</span>
                      </div>
                    )}
                    
                    <Button 
                      size="sm" 
                      className={`w-full text-white ${config.buttonColor} text-xs h-8`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAlertClick(alerta);
                      }}
                    >
                      {alerta.acao}
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {alerta.descricao}
                    </p>
                    
                    {alerta.prazo && (
                      <div className="flex items-center gap-1 text-xs text-red-600">
                        <Calendar className="w-3 h-3" />
                        <span>Prazo: {alerta.prazo}</span>
                      </div>
                    )}
                    
                    <Button 
                      size="sm" 
                      className={`w-full text-white ${config.buttonColor} text-xs h-8`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAlertClick(alerta);
                      }}
                    >
                      {alerta.acao}
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

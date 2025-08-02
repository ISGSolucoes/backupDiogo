import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  DollarSign,
  ShoppingCart,
  Calendar,
  Target
} from "lucide-react";

interface PedidosDashboardProps {
  estatisticas: {
    total: number;
    rascunho: number;
    aguardando_aprovacao: number;
    aprovado: number;
    enviado: number;
    confirmado: number;
    valor_total: number;
    valor_medio: number;
  };
}

export function PedidosDashboard({ estatisticas }: PedidosDashboardProps) {
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const calcularPercentual = (valor: number, total: number) => {
    return total > 0 ? (valor / total) * 100 : 0;
  };

  const cards = [
    {
      title: "Total de Pedidos",
      value: estatisticas.total,
      description: "pedidos este mês",
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      trend: "+12% vs mês anterior"
    },
    {
      title: "Valor Total",
      value: formatarMoeda(estatisticas.valor_total),
      description: "em pedidos ativos",
      icon: DollarSign,
      color: "text-green-600", 
      bgColor: "bg-green-100",
      trend: "+8.2% vs mês anterior"
    },
    {
      title: "Valor Médio",
      value: formatarMoeda(estatisticas.valor_medio),
      description: "por pedido",
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      trend: "-2.1% vs mês anterior"
    },
    {
      title: "Aguardando Aprovação",
      value: estatisticas.aguardando_aprovacao,
      description: "pedidos pendentes",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      trend: estatisticas.aguardando_aprovacao > 5 ? "Atenção necessária" : "Dentro do normal"
    }
  ];

  const statusData = [
    { 
      status: "Confirmados", 
      count: estatisticas.confirmado, 
      color: "bg-green-500",
      percentage: calcularPercentual(estatisticas.confirmado, estatisticas.total)
    },
    { 
      status: "Enviados", 
      count: estatisticas.enviado, 
      color: "bg-blue-500",
      percentage: calcularPercentual(estatisticas.enviado, estatisticas.total)
    },
    { 
      status: "Aprovados", 
      count: estatisticas.aprovado, 
      color: "bg-indigo-500",
      percentage: calcularPercentual(estatisticas.aprovado, estatisticas.total)
    },
    { 
      status: "Aguardando", 
      count: estatisticas.aguardando_aprovacao, 
      color: "bg-yellow-500",
      percentage: calcularPercentual(estatisticas.aguardando_aprovacao, estatisticas.total)
    },
    { 
      status: "Rascunho", 
      count: estatisticas.rascunho, 
      color: "bg-gray-500",
      percentage: calcularPercentual(estatisticas.rascunho, estatisticas.total)
    }
  ];

  return (
    <div className="space-y-6">
      {/* Cards de Métricas Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {card.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {card.description}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">
                    {card.trend}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Distribuição por Status */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Distribuição por Status
            </CardTitle>
            <CardDescription>
              Visualização do pipeline de pedidos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {statusData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-sm font-medium">{item.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {item.count}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {item.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <Progress 
                  value={item.percentage} 
                  className="h-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Alertas e Ações Requeridas */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Alertas & Ações
            </CardTitle>
            <CardDescription>
              Itens que requerem atenção imediata
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {estatisticas.aguardando_aprovacao > 0 && (
                <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-amber-800">
                      {estatisticas.aguardando_aprovacao} pedidos aguardando aprovação
                    </p>
                    <p className="text-xs text-amber-600">
                      Revise e aprove para acelerar o processo
                    </p>
                  </div>
                </div>
              )}

              {estatisticas.rascunho > 3 && (
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-800">
                      {estatisticas.rascunho} rascunhos em aberto
                    </p>
                    <p className="text-xs text-blue-600">
                      Finalize os pedidos em andamento
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800">
                    Sistema funcionando normalmente
                  </p>
                  <p className="text-xs text-green-600">
                    Última sincronização: há 2 minutos
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                <Calendar className="h-4 w-4 text-indigo-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-indigo-800">
                    3 pedidos vencem hoje
                  </p>
                  <p className="text-xs text-indigo-600">
                    Acompanhe as datas de entrega
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
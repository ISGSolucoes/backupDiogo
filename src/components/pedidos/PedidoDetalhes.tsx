import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Calendar, User, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IntegracaoFornecedor } from "@/components/pedidos/IntegracaoFornecedor";
import { PortalIntegrationStatus } from "@/components/pedidos/PortalIntegrationStatus";
import { SupplierResponse } from "@/components/pedidos/SupplierResponse";
import { StatusLabels, StatusColors } from "@/types/pedido";

// Mock data para demonstração
const pedidoMock = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  numero_pedido: "PO-2024-000123",
  fornecedor_id: "fornecedor-1",
  status: "aprovado" as const,
  tipo: "material" as const,
  data_criacao: "2024-01-20T10:00:00Z",
  data_aprovacao: "2024-01-21T14:30:00Z",
  data_envio_portal: null,
  data_resposta_fornecedor: null,
  data_entrega_solicitada: "2024-02-15",
  valor_total: 125000,
  moeda: "BRL",
  condicoes_pagamento: "30 dias",
  observacoes: "Entrega prioritária necessária",
  centro_custo: "CC-001",
  portal_pedido_id: null,
  status_portal: null,
  criado_por: "user-123",
  aprovado_por: "user-456",
  empresa_id: "empresa-1",
  versao: 1,
  created_at: "2024-01-20T10:00:00Z",
  updated_at: "2024-01-21T14:30:00Z",
  cotacao_id: null,
  requisicao_id: "req-789",
  deleted_at: null
};

export default function PedidoDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Em um cenário real, você buscaria os dados do pedido pelo ID
  const pedido = pedidoMock;

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/pedidos")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Package className="h-8 w-8 text-primary" />
              {pedido.numero_pedido}
            </h1>
            <p className="text-muted-foreground">
              Detalhes completos do pedido de compra
            </p>
          </div>
        </div>
        <Badge 
          variant="secondary" 
          className={StatusColors[pedido.status]}
        >
          {StatusLabels[pedido.status]}
        </Badge>
      </div>

      {/* Informações Básicas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Datas Importantes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium">Criado em:</p>
              <p className="text-sm text-muted-foreground">{formatarData(pedido.data_criacao)}</p>
            </div>
            {pedido.data_aprovacao && (
              <div>
                <p className="text-sm font-medium">Aprovado em:</p>
                <p className="text-sm text-muted-foreground">{formatarData(pedido.data_aprovacao)}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium">Entrega solicitada:</p>
              <p className="text-sm text-muted-foreground">{formatarData(pedido.data_entrega_solicitada)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Responsáveis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium">Criado por:</p>
              <p className="text-sm text-muted-foreground">João Silva</p>
            </div>
            {pedido.aprovado_por && (
              <div>
                <p className="text-sm font-medium">Aprovado por:</p>
                <p className="text-sm text-muted-foreground">Maria Santos</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium">Centro de custo:</p>
              <p className="text-sm text-muted-foreground">{pedido.centro_custo}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Informações Comerciais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium">Valor total:</p>
              <p className="text-lg font-bold text-green-600">{formatarMoeda(pedido.valor_total)}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Condições de pagamento:</p>
              <p className="text-sm text-muted-foreground">{pedido.condicoes_pagamento}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Tipo do pedido:</p>
              <p className="text-sm text-muted-foreground capitalize">{pedido.tipo}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Observações */}
      {pedido.observacoes && (
        <Card>
          <CardHeader>
            <CardTitle>Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{pedido.observacoes}</p>
          </CardContent>
        </Card>
      )}

      {/* Tabs com informações detalhadas */}
      <Tabs defaultValue="integracao" className="space-y-4">
        <TabsList>
          <TabsTrigger value="integracao">Integração com Fornecedor</TabsTrigger>
          <TabsTrigger value="status">Status da Integração</TabsTrigger>
          <TabsTrigger value="resposta">Resposta do Fornecedor</TabsTrigger>
        </TabsList>

        <TabsContent value="integracao">
          <IntegracaoFornecedor pedido={pedido} />
        </TabsContent>

        <TabsContent value="status">
          <PortalIntegrationStatus pedido={pedido} />
        </TabsContent>

        <TabsContent value="resposta">
          <SupplierResponse pedido={pedido} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

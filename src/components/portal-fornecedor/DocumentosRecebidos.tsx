
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Package, 
  DollarSign, 
  Star,
  Calendar,
  Building,
  Clock,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

interface DocumentoRecebido {
  id: string;
  tipo: 'pedido' | 'cotacao' | 'qualificacao' | 'contrato';
  numero: string;
  cliente: string;
  clienteCnpj: string;
  titulo: string;
  descricao: string;
  dataRecebimento: string;
  prazoResposta?: string;
  valor?: number;
  status: 'novo' | 'visualizado' | 'respondido' | 'vencido';
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  anexos?: string[];
  observacoes?: string;
}

const documentosMock: DocumentoRecebido[] = [
  {
    id: "1",
    tipo: "pedido",
    numero: "PO-2024-000123",
    cliente: "Petrobras S.A.",
    clienteCnpj: "33.000.167/0001-01",
    titulo: "Equipamentos de Perfuração Offshore",
    descricao: "Pedido para fornecimento de 15 equipamentos especializados para plataforma P-77, incluindo válvulas de alta pressão e componentes de segurança.",
    dataRecebimento: "2024-01-21T10:30:00",
    prazoResposta: "2024-01-25T17:00:00",
    valor: 850000,
    status: "novo",
    prioridade: "alta",
    anexos: ["especificacoes_tecnicas.pdf", "desenhos_tecnicos.dwg"],
    observacoes: "Entrega urgente necessária para atender cronograma da plataforma"
  },
  {
    id: "2",
    tipo: "cotacao",
    numero: "COT-2024-000089",
    cliente: "Vale S.A.",
    clienteCnpj: "33.592.510/0001-54",
    titulo: "Peças de Reposição para Equipamentos de Mineração",
    descricao: "Solicitação de cotação para peças de reposição diversos equipamentos de mineração em operação na mina de Carajás.",
    dataRecebimento: "2024-01-20T14:15:00",
    prazoResposta: "2024-01-27T12:00:00",
    status: "visualizado",
    prioridade: "media",
    anexos: ["lista_pecas.xlsx", "especificacoes.pdf"]
  },
  {
    id: "3",
    tipo: "qualificacao",
    numero: "QUA-2024-000156",
    cliente: "Embraer S.A.",
    clienteCnpj: "07.689.002/0001-20",
    titulo: "Requalificação Anual de Fornecedor - Componentes Aeronáuticos",
    descricao: "Processo de requalificação anual obrigatório para fornecedores de componentes críticos da aviação civil.",
    dataRecebimento: "2024-01-19T09:00:00",
    prazoResposta: "2024-02-05T17:00:00",
    status: "novo",
    prioridade: "media",
    anexos: ["questionario_qualificacao.pdf", "certificacoes_requeridas.pdf"]
  }
];

export const DocumentosRecebidos: React.FC = () => {
  const [documentos] = useState<DocumentoRecebido[]>(documentosMock);
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");

  const getIconeTipo = (tipo: string) => {
    const icones = {
      pedido: Package,
      cotacao: DollarSign,
      qualificacao: Star,
      contrato: FileText
    };
    return icones[tipo as keyof typeof icones] || FileText;
  };

  const getCorStatus = (status: string): "default" | "destructive" | "secondary" | "outline" => {
    const cores = {
      novo: "destructive" as const,
      visualizado: "secondary" as const, 
      respondido: "default" as const,
      vencido: "destructive" as const
    };
    return cores[status as keyof typeof cores] || "secondary";
  };

  const getCorPrioridade = (prioridade: string) => {
    const cores = {
      baixa: "bg-blue-100 text-blue-800",
      media: "bg-yellow-100 text-yellow-800", 
      alta: "bg-orange-100 text-orange-800",
      urgente: "bg-red-100 text-red-800"
    };
    return cores[prioridade as keyof typeof cores] || "bg-gray-100 text-gray-800";
  };

  const documentosFiltrados = filtroTipo === "todos" 
    ? documentos 
    : documentos.filter(doc => doc.tipo === filtroTipo);

  const contadores = {
    total: documentos.length,
    novos: documentos.filter(d => d.status === 'novo').length,
    pendentes: documentos.filter(d => d.status === 'novo' || d.status === 'visualizado').length,
    urgentes: documentos.filter(d => d.prioridade === 'urgente' || d.prioridade === 'alta').length
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  return (
    <div className="space-y-6">
      {/* Resumo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{contadores.total}</p>
            </div>
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Novos</p>
              <p className="text-2xl font-bold text-red-600">{contadores.novos}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">{contadores.pendentes}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Urgentes</p>
              <p className="text-2xl font-bold text-orange-600">{contadores.urgentes}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Filtros */}
      <Tabs value={filtroTipo} onValueChange={setFiltroTipo}>
        <TabsList>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="pedido">Pedidos</TabsTrigger>
          <TabsTrigger value="cotacao">Cotações</TabsTrigger>
          <TabsTrigger value="qualificacao">Qualificações</TabsTrigger>
          <TabsTrigger value="contrato">Contratos</TabsTrigger>
        </TabsList>

        <TabsContent value={filtroTipo} className="space-y-4 mt-6">
          {documentosFiltrados.map((documento) => {
            const IconeTipo = getIconeTipo(documento.tipo);
            
            return (
              <Card key={documento.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <IconeTipo className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{documento.titulo}</h3>
                          <Badge variant={getCorStatus(documento.status)}>
                            {documento.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{documento.numero}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Building className="h-4 w-4" />
                          <span>{documento.cliente}</span>
                          <span>•</span>
                          <span>{documento.clienteCnpj}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className={`px-2 py-1 rounded text-xs font-medium ${getCorPrioridade(documento.prioridade)}`}>
                        {documento.prioridade}
                      </div>
                      {documento.valor && (
                        <div className="text-lg font-bold text-green-600">
                          {formatarMoeda(documento.valor)}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{documento.descricao}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Recebido: {formatarData(documento.dataRecebimento)}</span>
                    </div>
                    {documento.prazoResposta && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Prazo: {formatarData(documento.prazoResposta)}</span>
                      </div>
                    )}
                  </div>

                  {documento.anexos && documento.anexos.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Anexos:</p>
                      <div className="flex flex-wrap gap-2">
                        {documento.anexos.map((anexo, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {anexo}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {documento.observacoes && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                      <p className="text-sm text-yellow-800">
                        <strong>Observações:</strong> {documento.observacoes}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                    <Button size="sm">
                      Responder
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
};

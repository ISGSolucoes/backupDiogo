import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Calendar,
  Building,
  Clock,
  AlertTriangle,
  CheckCircle,
  Target,
  DollarSign,
  Award
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ConviteSourcing {
  id: string;
  projetoId: string;
  tipoEvento: 'rfp' | 'rfq' | 'rfi' | 'leilao';
  titulo: string;
  empresa: string;
  empresaCnpj: string;
  categoria: string;
  dataConvite: string;
  dataLimite: string;
  localEntrega: string;
  avaliacao: {
    tecnico: number;
    comercial: number;
  };
  status: 'novo' | 'visualizado' | 'proposta_enviada' | 'vencido';
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  valorEstimado?: number;
  descricaoBreve: string;
  documentosObrigatorios: string[];
  observacoes?: string;
}

const convitesMock: ConviteSourcing[] = [
  {
    id: "1",
    projetoId: "SRC-2024-000001",
    tipoEvento: "rfp",
    titulo: "RFP – ERP e Serviços de Implementação",
    empresa: "Cliente GOV123",
    empresaCnpj: "12.345.678/0001-90",
    categoria: "ERP Corporativo",
    dataConvite: "2024-01-21T10:30:00",
    dataLimite: "2025-08-12T17:00:00",
    localEntrega: "São Paulo/SP",
    avaliacao: {
      tecnico: 60,
      comercial: 40
    },
    status: "novo",
    prioridade: "alta",
    valorEstimado: 2500000,
    descricaoBreve: "Implementação completa de sistema ERP com módulos financeiro, estoque, RH e serviços de implementação.",
    documentosObrigatorios: ["Proposta Técnica", "Proposta Comercial", "Referências", "Certidões"],
    observacoes: "Favor incluir plano de implantação detalhado"
  },
  {
    id: "2", 
    projetoId: "SRC-2024-000002",
    tipoEvento: "rfq",
    titulo: "Equipamentos de Segurança Industrial",
    empresa: "Petrobras S.A.",
    empresaCnpj: "33.000.167/0001-01",
    categoria: "Equipamentos Industriais",
    dataConvite: "2024-01-20T14:15:00",
    dataLimite: "2025-02-15T12:00:00",
    localEntrega: "Rio de Janeiro/RJ",
    avaliacao: {
      tecnico: 40,
      comercial: 60
    },
    status: "visualizado",
    prioridade: "media",
    descricaoBreve: "Fornecimento de equipamentos de proteção individual e coletiva para plataformas offshore.",
    documentosObrigatorios: ["Proposta Comercial", "Catálogo Técnico", "Certificações"]
  }
];

export const ConvitesRecebidos: React.FC = () => {
  const [convites] = useState<ConviteSourcing[]>(convitesMock);
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const navigate = useNavigate();

  const getIconeTipo = (tipo: string) => {
    const icones = {
      rfp: FileText,
      rfq: DollarSign,
      rfi: Target,
      leilao: Award
    };
    return icones[tipo as keyof typeof icones] || FileText;
  };

  const getCorStatus = (status: string): "default" | "destructive" | "secondary" | "outline" => {
    const cores = {
      novo: "destructive" as const,
      visualizado: "secondary" as const,
      proposta_enviada: "default" as const,
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

  const convitesFiltrados = filtroStatus === "todos"
    ? convites
    : convites.filter(conv => conv.status === filtroStatus);

  const contadores = {
    total: convites.length,
    novos: convites.filter(c => c.status === 'novo').length,
    pendentes: convites.filter(c => c.status === 'novo' || c.status === 'visualizado').length,
    enviados: convites.filter(c => c.status === 'proposta_enviada').length
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

  const handleVerDetalhes = (convite: ConviteSourcing) => {
    navigate(`/portal-fornecedor/evento/${convite.projetoId}`);
  };

  const handleEnviarProposta = (convite: ConviteSourcing) => {
    navigate(`/portal-fornecedor/proposta/${convite.projetoId}`);
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
              <p className="text-sm text-muted-foreground">Enviados</p>
              <p className="text-2xl font-bold text-green-600">{contadores.enviados}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </Card>
      </div>

      {/* Filtros */}
      <Tabs value={filtroStatus} onValueChange={setFiltroStatus}>
        <TabsList>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="novo">Novos</TabsTrigger>
          <TabsTrigger value="visualizado">Visualizados</TabsTrigger>
          <TabsTrigger value="proposta_enviada">Enviados</TabsTrigger>
          <TabsTrigger value="vencido">Vencidos</TabsTrigger>
        </TabsList>

        <TabsContent value={filtroStatus} className="space-y-4 mt-6">
          {convitesFiltrados.map((convite) => {
            const IconeTipo = getIconeTipo(convite.tipoEvento);

            return (
              <Card key={convite.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <IconeTipo className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{convite.titulo}</h3>
                          <Badge variant={getCorStatus(convite.status)}>
                            {convite.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{convite.projetoId}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Building className="h-4 w-4" />
                          <span>{convite.empresa}</span>
                          <span>•</span>
                          <span>{convite.categoria}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>📍 {convite.localEntrega}</span>
                          <span>⚖️ Técnica ({convite.avaliacao.tecnico}%) + Preço ({convite.avaliacao.comercial}%)</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className={`px-2 py-1 rounded text-xs font-medium ${getCorPrioridade(convite.prioridade)}`}>
                        {convite.prioridade}
                      </div>
                      {convite.valorEstimado && (
                        <div className="text-sm text-muted-foreground">
                          Est. {formatarMoeda(convite.valorEstimado)}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded p-3">
                    <p className="text-sm">
                      🧠 <strong>Evento:</strong> {convite.tipoEvento.toUpperCase()} – {convite.titulo}<br/>
                      🏢 <strong>Empresa:</strong> {convite.empresa}<br/>
                      📅 <strong>Data limite:</strong> {formatarData(convite.dataLimite)}<br/>
                      📎 <strong>Categoria:</strong> {convite.categoria}<br/>
                      📍 <strong>Local de entrega:</strong> {convite.localEntrega}<br/>
                      💡 <strong>Avaliação:</strong> Técnica ({convite.avaliacao.tecnico}%) + Preço ({convite.avaliacao.comercial}%)<br/>
                      🔒 <strong>Tipo de evento:</strong> {convite.tipoEvento.toUpperCase()} {convite.tipoEvento !== 'leilao' ? '(sem leilão direto)' : '(com leilão)'}
                    </p>
                  </div>

                  <p className="text-sm">{convite.descricaoBreve}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Convite: {formatarData(convite.dataConvite)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Limite: {formatarData(convite.dataLimite)}</span>
                    </div>
                  </div>

                  {convite.documentosObrigatorios && convite.documentosObrigatorios.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Documentos Obrigatórios:</p>
                      <div className="flex flex-wrap gap-2">
                        {convite.documentosObrigatorios.map((doc, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {doc}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {convite.observacoes && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                      <p className="text-sm text-yellow-800">
                        <strong>Observações:</strong> {convite.observacoes}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleVerDetalhes(convite)}
                    >
                      Ver Detalhes
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleEnviarProposta(convite)}
                      disabled={convite.status === 'vencido'}
                    >
                      Enviar Proposta
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
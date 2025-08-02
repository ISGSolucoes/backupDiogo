import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Star,
  Building,
  AlertCircle,
  Eye,
  User
} from "lucide-react";

interface FornecedorPendente {
  id: string;
  nome: string;
  cnpj: string;
  tipo: "registro" | "qualificacao" | "documentos" | "requalificacao";
  status: string;
  dataSolicitacao: string;
  urgencia: "baixa" | "media" | "alta";
  motivo?: string;
  documentosPendentes?: string[];
}

interface PendentesAprovacaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PendentesAprovacaoModal = ({
  open,
  onOpenChange
}: PendentesAprovacaoModalProps) => {
  const [activeTab, setActiveTab] = useState("registro");

  // Mock data - em produção viria da API
  const fornecedoresPendentes: FornecedorPendente[] = [
    {
      id: "1",
      nome: "TechSolutions Ltda",
      cnpj: "12.345.678/0001-90",
      tipo: "registro",
      status: "Aguardando Aprovação",
      dataSolicitacao: "2024-01-15",
      urgencia: "alta",
      motivo: "Solicitação de cadastro via formulário público"
    },
    {
      id: "2",
      nome: "Construção Brasil S.A.",
      cnpj: "98.765.432/0001-10",
      tipo: "registro",
      status: "Aguardando Documentos",
      dataSolicitacao: "2024-01-14",
      urgencia: "media",
      motivo: "Documentos incompletos"
    },
    {
      id: "3",
      nome: "ServiTech LTDA",
      cnpj: "11.222.333/0001-44",
      tipo: "qualificacao",
      status: "Aguardando Qualificação",
      dataSolicitacao: "2024-01-12",
      urgencia: "media",
      motivo: "Processo de qualificação iniciado"
    },
    {
      id: "4",
      nome: "Logística Express",
      cnpj: "55.666.777/0001-88",
      tipo: "documentos",
      status: "Documentos Vencidos",
      dataSolicitacao: "2024-01-10",
      urgencia: "alta",
      documentosPendentes: ["Alvará", "Certificado ISO"]
    },
    {
      id: "5",
      nome: "Materiais Prime",
      cnpj: "33.444.555/0001-22",
      tipo: "requalificacao",
      status: "Requalificação Pendente",
      dataSolicitacao: "2024-01-08",
      urgencia: "baixa",
      motivo: "Ciclo de requalificação anual"
    }
  ];

  const filtrarPorTipo = (tipo: string) => {
    return fornecedoresPendentes.filter(f => f.tipo === tipo);
  };

  const getUrgenciaColor = (urgencia: string) => {
    switch (urgencia) {
      case "alta": return "bg-red-100 text-red-800 border-red-200";
      case "media": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "baixa": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getUrgenciaIcon = (urgencia: string) => {
    switch (urgencia) {
      case "alta": return <AlertCircle className="h-3 w-3" />;
      case "media": return <Clock className="h-3 w-3" />;
      case "baixa": return <CheckCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "registro": return <User className="h-4 w-4" />;
      case "qualificacao": return <Star className="h-4 w-4" />;
      case "documentos": return <FileText className="h-4 w-4" />;
      case "requalificacao": return <Building className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleAprovar = (fornecedor: FornecedorPendente) => {
    toast.success(`${fornecedor.nome} aprovado para ${fornecedor.tipo}`);
  };

  const handleRejeitar = (fornecedor: FornecedorPendente) => {
    toast.error(`${fornecedor.nome} rejeitado para ${fornecedor.tipo}`);
  };

  const handleVisualizar = (fornecedor: FornecedorPendente) => {
    toast.info(`Visualizando detalhes de ${fornecedor.nome}`);
  };

  const contarPorTipo = (tipo: string) => {
    return filtrarPorTipo(tipo).length;
  };

  const FornecedorCard = ({ fornecedor }: { fornecedor: FornecedorPendente }) => (
    <Card className="mb-3">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {getTipoIcon(fornecedor.tipo)}
            <div>
              <CardTitle className="text-base">{fornecedor.nome}</CardTitle>
              <p className="text-sm text-muted-foreground">{fornecedor.cnpj}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={getUrgenciaColor(fornecedor.urgencia)}
            >
              {getUrgenciaIcon(fornecedor.urgencia)}
              <span className="ml-1 capitalize">{fornecedor.urgencia}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="text-sm">
            <span className="font-medium">Status:</span> {fornecedor.status}
          </div>
          <div className="text-sm">
            <span className="font-medium">Data:</span> {new Date(fornecedor.dataSolicitacao).toLocaleDateString()}
          </div>
          {fornecedor.motivo && (
            <div className="text-sm">
              <span className="font-medium">Motivo:</span> {fornecedor.motivo}
            </div>
          )}
          {fornecedor.documentosPendentes && (
            <div className="text-sm">
              <span className="font-medium">Docs Pendentes:</span> {fornecedor.documentosPendentes.join(", ")}
            </div>
          )}
          
          <div className="flex gap-2 pt-2">
            <Button 
              size="sm" 
              onClick={() => handleAprovar(fornecedor)}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Aprovar
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleRejeitar(fornecedor)}
              className="border-red-200 hover:bg-red-50 text-red-700"
            >
              <XCircle className="h-3 w-3 mr-1" />
              Rejeitar
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleVisualizar(fornecedor)}
            >
              <Eye className="h-3 w-3 mr-1" />
              Ver Detalhes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Pendentes de Aprovação
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="registro" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Registro ({contarPorTipo("registro")})
            </TabsTrigger>
            <TabsTrigger value="qualificacao" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Qualificação ({contarPorTipo("qualificacao")})
            </TabsTrigger>
            <TabsTrigger value="documentos" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documentos ({contarPorTipo("documentos")})
            </TabsTrigger>
            <TabsTrigger value="requalificacao" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Requalificação ({contarPorTipo("requalificacao")})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="registro" className="mt-6">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                <h3 className="font-semibold">Fornecedores Pendentes de Registro</h3>
                {filtrarPorTipo("registro").map((fornecedor) => (
                  <FornecedorCard key={fornecedor.id} fornecedor={fornecedor} />
                ))}
                {filtrarPorTipo("registro").length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhum fornecedor pendente de registro
                  </p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="qualificacao" className="mt-6">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                <h3 className="font-semibold">Fornecedores Pendentes de Qualificação</h3>
                {filtrarPorTipo("qualificacao").map((fornecedor) => (
                  <FornecedorCard key={fornecedor.id} fornecedor={fornecedor} />
                ))}
                {filtrarPorTipo("qualificacao").length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhum fornecedor pendente de qualificação
                  </p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="documentos" className="mt-6">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                <h3 className="font-semibold">Fornecedores com Documentos Pendentes</h3>
                {filtrarPorTipo("documentos").map((fornecedor) => (
                  <FornecedorCard key={fornecedor.id} fornecedor={fornecedor} />
                ))}
                {filtrarPorTipo("documentos").length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhum fornecedor com documentos pendentes
                  </p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="requalificacao" className="mt-6">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                <h3 className="font-semibold">Fornecedores Pendentes de Requalificação</h3>
                {filtrarPorTipo("requalificacao").map((fornecedor) => (
                  <FornecedorCard key={fornecedor.id} fornecedor={fornecedor} />
                ))}
                {filtrarPorTipo("requalificacao").length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhum fornecedor pendente de requalificação
                  </p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { useFullscreenModal } from "@/hooks/useFullscreenModal";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  Globe,
  Monitor,
  Maximize2,
  Minimize2
} from "lucide-react";

interface SolicitacaoRecebida {
  id: string;
  nomeEmpresa: string;
  cnpj: string;
  emailContato: string;
  telefone: string;
  categoria: string;
  localizacao: string;
  porte: string;
  site?: string;
  dataEnvio: string;
  status: string;
  documentos: string[];
  avaliacaoPrevia: {
    cnpjValido: boolean;
    categoriaAtende: "sim" | "parcial" | "nao";
    emailCorporativo: boolean;
    documentosCompletos: boolean;
    historicoBlacklist: boolean;
  };
}

interface SolicitacaoRecebidaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SolicitacaoRecebidaModal = ({
  open,
  onOpenChange
}: SolicitacaoRecebidaModalProps) => {
  const [selectedSolicitacao, setSelectedSolicitacao] = useState<SolicitacaoRecebida | null>(null);
  const [comentario, setComentario] = useState("");
  const [showComplementoModal, setShowComplementoModal] = useState(false);
  const [showRejeicaoModal, setShowRejeicaoModal] = useState(false);
  const { isFullscreen, toggleFullscreen } = useFullscreenModal();

  // Mock data - em produção viria da API
  const solicitacoes: SolicitacaoRecebida[] = [
    {
      id: "1",
      nomeEmpresa: "TechSolutions Ltda",
      cnpj: "12.345.678/0001-90",
      emailContato: "contato@techsolutions.com.br",
      telefone: "(11) 99999-9999",
      categoria: "Tecnologia da Informação",
      localizacao: "São Paulo - SP",
      porte: "Médio",
      site: "www.techsolutions.com.br",
      dataEnvio: "2024-01-15",
      status: "Aguardando Análise",
      documentos: ["Contrato Social", "Certificado Digital"],
      avaliacaoPrevia: {
        cnpjValido: true,
        categoriaAtende: "sim",
        emailCorporativo: true,
        documentosCompletos: false,
        historicoBlacklist: false
      }
    },
    {
      id: "2",
      nomeEmpresa: "Construção Brasil S.A.",
      cnpj: "98.765.432/0001-10",
      emailContato: "comercial@construcaobrasil.com",
      telefone: "(21) 88888-8888",
      categoria: "Construção Civil",
      localizacao: "Rio de Janeiro - RJ",
      porte: "Grande",
      dataEnvio: "2024-01-14",
      status: "Aguardando Análise",
      documentos: ["Contrato Social", "Alvará", "Certificado CREA"],
      avaliacaoPrevia: {
        cnpjValido: true,
        categoriaAtende: "parcial",
        emailCorporativo: true,
        documentosCompletos: true,
        historicoBlacklist: false
      }
    }
  ];

  const handleAprovarQualificacao = (solicitacao: SolicitacaoRecebida) => {
    toast.success(`${solicitacao.nomeEmpresa} aprovado para qualificação`);
    onOpenChange(false);
  };

  const handleAdicionarBanco = (solicitacao: SolicitacaoRecebida) => {
    toast.success(`${solicitacao.nomeEmpresa} adicionado ao banco de fornecedores`);
    onOpenChange(false);
  };

  const handleSolicitarComplemento = () => {
    if (!comentario.trim()) {
      toast.error("Adicione um comentário sobre os dados/documentos necessários");
      return;
    }
    toast.success(`Solicitação de complemento enviada para ${selectedSolicitacao?.nomeEmpresa}`);
    setComentario("");
    setShowComplementoModal(false);
    onOpenChange(false);
  };

  const handleRejeitar = () => {
    if (!comentario.trim()) {
      toast.error("Adicione um motivo para a rejeição");
      return;
    }
    toast.success(`Solicitação de ${selectedSolicitacao?.nomeEmpresa} rejeitada`);
    setComentario("");
    setShowRejeicaoModal(false);
    onOpenChange(false);
  };

  const getStatusIcon = (criterio: string, valor: any) => {
    if (typeof valor === "boolean") {
      return valor ? (
        <CheckCircle className="h-4 w-4 text-green-600" />
      ) : (
        <XCircle className="h-4 w-4 text-red-600" />
      );
    }
    
    if (valor === "sim") return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (valor === "parcial") return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    if (valor === "nao") return <XCircle className="h-4 w-4 text-red-600" />;
    
    return <XCircle className="h-4 w-4 text-red-600" />;
  };

  const getStatusText = (valor: any) => {
    if (typeof valor === "boolean") return valor ? "Sim" : "Não";
    if (valor === "sim") return "Sim";
    if (valor === "parcial") return "Parcial";
    if (valor === "nao") return "Não";
    return "Não";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={isFullscreen ? "w-screen h-screen max-w-none max-h-none" : "max-w-6xl max-h-[90vh]"}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Solicitações Recebidas
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="p-1 h-8 w-8 hover:bg-gray-100"
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-hidden">
          {/* Lista de Solicitações */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Pendentes de Análise</h3>
            <ScrollArea className={isFullscreen ? "h-[calc(100vh-200px)] pr-4" : "h-[500px] pr-4"}>
              <div className="space-y-2">
                {solicitacoes.map((solicitacao) => (
                  <Card 
                    key={solicitacao.id}
                    className={`cursor-pointer transition-colors ${
                      selectedSolicitacao?.id === solicitacao.id 
                        ? "border-blue-500 bg-blue-50" 
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedSolicitacao(solicitacao)}
                  >
                    <CardHeader className="pb-2 pt-3">
                      <div className="flex justify-between items-center">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-sm font-medium">{solicitacao.nomeEmpresa}</CardTitle>
                          <p className="text-xs text-muted-foreground">{solicitacao.cnpj}</p>
                        </div>
                        <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">{solicitacao.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 pb-3">
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{solicitacao.emailContato}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          <span className="truncate">{solicitacao.categoria}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(solicitacao.dataEnvio).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Detalhes da Solicitação */}
          <div className="flex flex-col h-full">
            {selectedSolicitacao ? (
              <>
                <div className="mb-4">
                  <h3 className="font-semibold text-lg">Detalhes da Solicitação</h3>
                </div>
                
                {/* Área de Scroll com Detalhes */}
                <div className="flex-1 overflow-hidden">
                  <ScrollArea className={`${isFullscreen ? "h-[calc(100vh-400px)]" : "h-[300px]"} pr-4 [&>div>div[style]]:!pr-6 [&_[data-radix-scroll-area-viewport]]:scrollbar-thumb-gray-400 [&_[data-radix-scroll-area-viewport]]:scrollbar-track-gray-200`}>
                    <div className="space-y-6">
                      {/* Dados do Fornecedor */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">📌 Dados Fornecidos</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <label className="font-medium">Empresa:</label>
                              <p>{selectedSolicitacao.nomeEmpresa}</p>
                            </div>
                            <div>
                              <label className="font-medium">CNPJ:</label>
                              <p>{selectedSolicitacao.cnpj}</p>
                            </div>
                            <div>
                              <label className="font-medium">E-mail:</label>
                              <p>{selectedSolicitacao.emailContato}</p>
                            </div>
                            <div>
                              <label className="font-medium">Telefone:</label>
                              <p>{selectedSolicitacao.telefone}</p>
                            </div>
                            <div>
                              <label className="font-medium">Categoria:</label>
                              <p>{selectedSolicitacao.categoria}</p>
                            </div>
                            <div>
                              <label className="font-medium">Localização:</label>
                              <p>{selectedSolicitacao.localizacao}</p>
                            </div>
                            <div>
                              <label className="font-medium">Porte:</label>
                              <p>{selectedSolicitacao.porte}</p>
                            </div>
                            {selectedSolicitacao.site && (
                              <div>
                                <label className="font-medium">Site:</label>
                                <p className="flex items-center gap-1">
                                  <Globe className="h-3 w-3" />
                                  {selectedSolicitacao.site}
                                </p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Avaliação Preliminar */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">🧠 Avaliação Preliminar</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">CNPJ válido</span>
                              <div className="flex items-center gap-2">
                                {getStatusIcon("cnpj", selectedSolicitacao.avaliacaoPrevia.cnpjValido)}
                                <span className="text-sm">
                                  {getStatusText(selectedSolicitacao.avaliacaoPrevia.cnpjValido)}
                                </span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Categoria atende demanda</span>
                              <div className="flex items-center gap-2">
                                {getStatusIcon("categoria", selectedSolicitacao.avaliacaoPrevia.categoriaAtende)}
                                <span className="text-sm">
                                  {getStatusText(selectedSolicitacao.avaliacaoPrevia.categoriaAtende)}
                                </span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">E-mail corporativo</span>
                              <div className="flex items-center gap-2">
                                {getStatusIcon("email", selectedSolicitacao.avaliacaoPrevia.emailCorporativo)}
                                <span className="text-sm">
                                  {getStatusText(selectedSolicitacao.avaliacaoPrevia.emailCorporativo)}
                                </span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Documentos obrigatórios</span>
                              <div className="flex items-center gap-2">
                                {getStatusIcon("docs", selectedSolicitacao.avaliacaoPrevia.documentosCompletos)}
                                <span className="text-sm">
                                  {getStatusText(selectedSolicitacao.avaliacaoPrevia.documentosCompletos)}
                                </span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Histórico em blacklist</span>
                              <div className="flex items-center gap-2">
                                {getStatusIcon("blacklist", !selectedSolicitacao.avaliacaoPrevia.historicoBlacklist)}
                                <span className="text-sm">
                                  {selectedSolicitacao.avaliacaoPrevia.historicoBlacklist ? "Encontrado" : "Não encontrado"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </ScrollArea>
                </div>

                {/* Separador visual */}
                <Separator className="my-4" />

                {/* Seção de Opções de Ação */}
                <div className="bg-gray-50/50 rounded-lg p-4 border">
                  <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                    📁 Opções de Ação
                  </h4>
                  
                  <div className="space-y-2">
                    <Button 
                      onClick={() => handleAprovarQualificacao(selectedSolicitacao)}
                      className="w-full bg-green-600 hover:bg-green-700 text-sm justify-start"
                      size="sm"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Aprovar e Enviar para Qualificação
                    </Button>
                    
                    <Button 
                      onClick={() => handleAdicionarBanco(selectedSolicitacao)}
                      variant="outline"
                      className="w-full border-blue-200 hover:bg-blue-50 text-sm justify-start"
                      size="sm"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Adicionar ao Banco (sem qualificar)
                    </Button>
                    
                    <Button 
                      onClick={() => setShowComplementoModal(true)}
                      variant="outline"
                      className="w-full border-yellow-200 hover:bg-yellow-50 text-sm justify-start"
                      size="sm"
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Solicitar Complemento de Dados
                    </Button>
                    
                    <Button 
                      onClick={() => setShowRejeicaoModal(true)}
                      variant="outline"
                      className="w-full border-red-200 hover:bg-red-50 text-red-700 text-sm justify-start"
                      size="sm"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Rejeitar Solicitação
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className={`flex items-center justify-center text-muted-foreground ${isFullscreen ? "h-[calc(100vh-200px)]" : "h-[500px]"}`}>
                <div className="text-center">
                  <Monitor className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Selecione uma solicitação para ver os detalhes</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>

      {/* Modal para Solicitar Complemento */}
      <Dialog open={showComplementoModal} onOpenChange={setShowComplementoModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Solicitar Complemento de Dados
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Informe quais dados ou documentos são necessários para prosseguir com a análise:
            </p>
            
            <Textarea
              placeholder="Ex: Necessário enviar Alvará atualizado e comprovante de endereço..."
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              rows={4}
            />
            
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowComplementoModal(false);
                  setComentario("");
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSolicitarComplemento}
                className="bg-yellow-600 hover:bg-yellow-700"
                disabled={!comentario.trim()}
              >
                Enviar Solicitação
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para Rejeitar */}
      <Dialog open={showRejeicaoModal} onOpenChange={setShowRejeicaoModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              Rejeitar Solicitação
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Informe o motivo da rejeição da solicitação:
            </p>
            
            <Textarea
              placeholder="Ex: Empresa não atende aos critérios de conformidade exigidos..."
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              rows={4}
            />
            
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejeicaoModal(false);
                  setComentario("");
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleRejeitar}
                variant="destructive"
                disabled={!comentario.trim()}
              >
                Rejeitar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

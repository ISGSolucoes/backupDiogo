import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { 
  Award, 
  Download, 
  FileText, 
  MessageCircle, 
  Calendar, 
  CheckCircle, 
  XCircle,
  Eye,
  Printer,
  Mail
} from "lucide-react";
import { PropostaComparacao, RFPData } from "@/hooks/useProposalComparison";
import { useToast } from "@/hooks/use-toast";

interface AcoesCompradorProps {
  propostas: PropostaComparacao[];
  rfpData: RFPData;
}

export function AcoesComprador({ propostas, rfpData }: AcoesCompradorProps) {
  const [selectedProposta, setSelectedProposta] = useState<string | null>(null);
  const [justificativa, setJustificativa] = useState("");
  const { toast } = useToast();

  const handleAprovarVencedor = (propostaId: string) => {
    const proposta = propostas.find(p => p.id === propostaId);
    toast({
      title: "Vencedor Aprovado",
      description: `${proposta?.fornecedor.nome} foi aprovado como vencedor da RFP.`,
    });
  };

  const handleRejeitarProposta = (propostaId: string) => {
    const proposta = propostas.find(p => p.id === propostaId);
    toast({
      title: "Proposta Rejeitada",
      description: `Proposta de ${proposta?.fornecedor.nome} foi rejeitada.`,
    });
  };

  const handleSolicitarEsclarecimento = () => {
    toast({
      title: "Esclarecimento Solicitado",
      description: "E-mail de solicitação de esclarecimento enviado aos fornecedores selecionados.",
    });
  };

  const handleExportarRelatorio = (tipo: string) => {
    toast({
      title: "Relatório Exportado",
      description: `Relatório ${tipo} foi gerado e está sendo baixado.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovada': return 'bg-green-100 text-green-800';
      case 'rejeitada': return 'bg-red-100 text-red-800';
      case 'analise': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Ações do Comprador
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Solicitar Esclarecimento
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Solicitar Esclarecimento</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Fornecedores:</label>
                    <div className="mt-2 space-y-2">
                      {propostas.map((proposta) => (
                        <div key={proposta.id} className="flex items-center space-x-2">
                          <input type="checkbox" id={proposta.id} />
                          <label htmlFor={proposta.id} className="text-sm">
                            {proposta.fornecedor.nome}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Mensagem:</label>
                    <Textarea 
                      placeholder="Descreva as informações adicionais necessárias..."
                      className="mt-1"
                    />
                  </div>
                  <Button onClick={handleSolicitarEsclarecimento} className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    Enviar Solicitação
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" className="w-full gap-2">
              <Calendar className="h-4 w-4" />
              Agendar Apresentação
            </Button>

            <Button variant="outline" className="w-full gap-2" 
              onClick={() => handleExportarRelatorio('completo')}>
              <Download className="h-4 w-4" />
              Exportar Análise
            </Button>

            <Button variant="outline" className="w-full gap-2" 
              onClick={() => handleExportarRelatorio('comparativo')}>
              <Printer className="h-4 w-4" />
              Imprimir Relatório
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Gestão de Propostas */}
      <Card>
        <CardHeader>
          <CardTitle>Gestão de Propostas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {propostas.map((proposta) => (
              <div key={proposta.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h4 className="font-medium">{proposta.fornecedor.nome}</h4>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>Ranking: {proposta.ranking}º</span>
                        <span>•</span>
                        <span>Nota: {proposta.notaFinal.toFixed(1)}</span>
                        <span>•</span>
                        <span>
                          {(proposta.valorComImpostos || proposta.valorTotal).toLocaleString('pt-BR', { 
                            style: 'currency', 
                            currency: 'BRL' 
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(proposta.status)}>
                      {proposta.status}
                    </Badge>
                    
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {proposta.ranking === 1 && proposta.status === 'enviada' && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" className="gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Aprovar como Vencedor
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Aprovar Vencedor</AlertDialogTitle>
                          <AlertDialogDescription>
                            Confirma a aprovação de {proposta.fornecedor.nome} como vencedor desta RFP?
                            Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleAprovarVencedor(proposta.id)}>
                            Confirmar Aprovação
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}

                  {proposta.status === 'enviada' && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                          <XCircle className="h-4 w-4" />
                          Rejeitar
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Rejeitar Proposta</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            Informe o motivo da rejeição da proposta de {proposta.fornecedor.nome}:
                          </p>
                          <Textarea 
                            placeholder="Justificativa para rejeição..."
                            value={justificativa}
                            onChange={(e) => setJustificativa(e.target.value)}
                          />
                          <Button 
                            onClick={() => handleRejeitarProposta(proposta.id)}
                            variant="destructive" 
                            className="w-full"
                          >
                            Confirmar Rejeição
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  <Button variant="ghost" size="sm" className="gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Comentar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Próximos Passos */}
      <Card>
        <CardHeader>
          <CardTitle>Próximos Passos Sugeridos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <div className="font-medium">Análise Técnica Concluída</div>
                <div className="text-sm text-muted-foreground">
                  Todas as propostas foram avaliadas tecnicamente
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border rounded-lg bg-blue-50">
              <Calendar className="h-5 w-5 text-blue-500" />
              <div>
                <div className="font-medium">Agendar Apresentações</div>
                <div className="text-sm text-muted-foreground">
                  Agendar apresentações com os 2 melhores classificados
                </div>
              </div>
              <Button size="sm" className="ml-auto">
                Agendar
              </Button>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <Award className="h-5 w-5 text-yellow-500" />
              <div>
                <div className="font-medium">Homologação Final</div>
                <div className="text-sm text-muted-foreground">
                  Aprovar vencedor e iniciar processo de contratação
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Relatórios Disponíveis */}
      <Card>
        <CardHeader>
          <CardTitle>Relatórios Disponíveis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start gap-2" 
              onClick={() => handleExportarRelatorio('técnico')}>
              <FileText className="h-4 w-4" />
              Relatório Técnico Detalhado
            </Button>
            
            <Button variant="outline" className="justify-start gap-2" 
              onClick={() => handleExportarRelatorio('comercial')}>
              <FileText className="h-4 w-4" />
              Análise Comercial
            </Button>
            
            <Button variant="outline" className="justify-start gap-2" 
              onClick={() => handleExportarRelatorio('comparativo')}>
              <FileText className="h-4 w-4" />
              Mapa Comparativo
            </Button>
            
            <Button variant="outline" className="justify-start gap-2" 
              onClick={() => handleExportarRelatorio('ata')}>
              <FileText className="h-4 w-4" />
              Ata de Julgamento
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
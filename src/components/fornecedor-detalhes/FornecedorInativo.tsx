
import React, { useState } from "react";
import { AlertTriangle, Calendar, User, FileText, RotateCcw, Download, Eye, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Fornecedor, HistoricoFornecedor as HistoricoFornecedorType } from "@/types/fornecedor";
import { Documento } from "@/types/documentos";
import { getMotivoInativacaoTexto, getMotivoInativacaoIcon } from "@/utils/statusUtils";
import { formatarData } from "@/utils/dateUtils";

interface FornecedorInativoProps {
  fornecedor: Fornecedor;
  historico?: HistoricoFornecedorType[];
  documentos?: Documento[];
}

export const FornecedorInativo = ({ fornecedor, historico = [], documentos = [] }: FornecedorInativoProps) => {
  const [motivoReativacao, setMotivoReativacao] = useState("");
  const [isReativandoDialogOpen, setIsReativandoDialogOpen] = useState(false);

  const handleReativar = () => {
    if (!motivoReativacao.trim()) {
      toast.error("Por favor, informe o motivo da reativação");
      return;
    }

    // Simular reativação
    toast.success(`Fornecedor ${fornecedor.nome} reativado com sucesso!`);
    setIsReativandoDialogOpen(false);
    setMotivoReativacao("");
    
    // Em produção, aqui seria uma chamada à API para reativar
    console.log(`Reativando fornecedor ${fornecedor.id} com motivo: ${motivoReativacao}`);
  };

  const handleExportarHistorico = () => {
    toast.info(`Exportando histórico completo de ${fornecedor.nome}...`);
    // Em produção, geraria/baixaria o arquivo
  };

  const handleVerAuditoria = () => {
    toast.info(`Abrindo logs de auditoria para ${fornecedor.nome}...`);
    // Em produção, abriria modal ou página de auditoria
  };

  const motivoTexto = getMotivoInativacaoTexto(
    fornecedor.motivoInativacao, 
    fornecedor.dataInativacao, 
    fornecedor.usuarioInativacao
  );
  const motivoIcon = getMotivoInativacaoIcon(fornecedor.motivoInativacao);

  const documentosValidos = documentos.filter(doc => doc.status === "valido").length;
  const documentosVencidos = documentos.filter(doc => doc.status === "vencido").length;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Cabeçalho com alerta de inativação */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                <CardTitle className="text-2xl text-red-900">{fornecedor.nome}</CardTitle>
                <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">
                  <span className="mr-1">{motivoIcon}</span>
                  Inativo
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">CNPJ:</span>
                  <p className="text-slate-600">{fornecedor.cnpj}</p>
                </div>
                <div>
                  <span className="font-medium">Localização:</span>
                  <p className="text-slate-600">{fornecedor.cidade} - {fornecedor.uf}</p>
                </div>
                <div>
                  <span className="font-medium">Porte:</span>
                  <p className="text-slate-600 capitalize">{fornecedor.porte} ({fornecedor.tipoEmpresa.toUpperCase()})</p>
                </div>
                <div>
                  <span className="font-medium">Categoria:</span>
                  <p className="text-slate-600">{fornecedor.categoria}</p>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Detalhes da inativação */}
      <Card className="border-amber-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800">
            <AlertTriangle className="h-5 w-5" />
            Motivo da Inativação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-amber-600" />
              <div>
                <p className="text-sm font-medium">Data da Inativação</p>
                <p className="text-slate-600">{fornecedor.dataInativacao ? formatarData(fornecedor.dataInativacao) : "N/A"}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-amber-600" />
              <div>
                <p className="text-sm font-medium">Responsável</p>
                <p className="text-slate-600">{fornecedor.usuarioInativacao || "Sistema"}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-amber-600" />
              <div>
                <p className="text-sm font-medium">Tipo</p>
                <p className="text-slate-600 capitalize">{fornecedor.motivoInativacao?.replace('_', ' ') || "Não especificado"}</p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <p className="text-sm font-medium mb-2">Descrição do motivo:</p>
            <p className="text-slate-700 bg-amber-50 p-3 rounded-md border border-amber-200">
              {motivoTexto}
            </p>
            {fornecedor.observacaoInativacao && (
              <p className="text-sm text-slate-600 mt-2 italic">
                Obs: {fornecedor.observacaoInativacao}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Ações disponíveis */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Disponíveis</CardTitle>
          <CardDescription>
            Ações permitidas para fornecedores inativos (funcionalidades operacionais estão bloqueadas)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <AlertDialog open={isReativandoDialogOpen} onOpenChange={setIsReativandoDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Reativar Fornecedor
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reativar Fornecedor</AlertDialogTitle>
                  <AlertDialogDescription>
                    Deseja realmente reativar o fornecedor {fornecedor.nome}? 
                    Esta ação alterará o status para "Ativo" e habilitará todas as funcionalidades.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                
                <div className="space-y-2">
                  <Label htmlFor="motivo">Motivo da reativação (obrigatório)</Label>
                  <Textarea
                    id="motivo"
                    placeholder="Informe o motivo para reativar este fornecedor..."
                    value={motivoReativacao}
                    onChange={(e) => setMotivoReativacao(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReativar}>
                    Confirmar Reativação
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button variant="outline" onClick={handleExportarHistorico} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exportar Histórico
            </Button>

            <Button variant="outline" onClick={handleVerAuditoria} className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Ver Logs de Auditoria
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resumo de informações históricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Válidos:</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {documentosValidos}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Vencidos:</span>
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  {documentosVencidos}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Total:</span>
                <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
                  {documentos.length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Histórico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Participações:</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {historico.filter(h => h.tipoEvento === "participacao").length}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Última atividade:</span>
                <span className="text-sm text-slate-600">{fornecedor.ultimaParticipacao}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Cadastrado em:</span>
                <span className="text-sm text-slate-600">{formatarData(fornecedor.dataCadastro)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium">Inativo</span>
              </div>
              <p className="text-xs text-slate-600">
                Todas as funcionalidades operacionais estão bloqueadas até a reativação
              </p>
              <div className="mt-3 p-2 bg-slate-50 rounded border">
                <p className="text-xs text-slate-600">
                  <strong>Bloqueado:</strong> Upload de documentos, qualificação, participação em eventos, edição de cadastro
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Histórico simplificado (somente leitura) */}
      {historico.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Últimas Atividades (Somente Leitura)</CardTitle>
            <CardDescription>
              Histórico das últimas atividades antes da inativação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {historico.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded border">
                  <div>
                    <p className="text-sm font-medium">{item.descricao}</p>
                    <p className="text-xs text-slate-600">{item.data} • {item.usuario}</p>
                  </div>
                  <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200 capitalize">
                    {item.tipoEvento}
                  </Badge>
                </div>
              ))}
              {historico.length > 5 && (
                <p className="text-sm text-slate-500 text-center pt-2">
                  + {historico.length - 5} atividades anteriores (disponíveis no histórico exportado)
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

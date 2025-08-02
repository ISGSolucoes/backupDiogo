
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart, 
  Plus, 
  UserPlus, 
  Upload,
  FileText,
  Download,
  RefreshCw,
  Mail,
  Award,
  UserX,
  UserCheck,
  Brain,
  FolderCheck
} from "lucide-react";
import { BotaoAcoesRecomendadas } from "./BotaoAcoesRecomendadas";
import { SolicitarRegistro } from "./SolicitarRegistro";
import { SolicitacaoRecebidaModal } from "./SolicitacaoRecebidaModal";
import { CadastroFornecedorModal } from "./CadastroFornecedorModal";
import { AvaliarDesempenhoModal } from "./avaliacao/AvaliarDesempenhoModal";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface AcoesRapidasReorganizadasProps {
  onNovoFornecedorClick?: () => void;
  onImportarClick?: () => void;
  onAvaliarClick?: () => void;
  onControleDocumentalClick?: () => void;
  onExportarClick?: () => void;
  onAtualizarClick?: () => void;
  onConvidarClick?: () => void;
  onRequalificarClick?: () => void;
  onInativarClick?: (fornecedorIds: string[]) => void;
  onReativarClick?: (fornecedorIds: string[]) => void;
  selectedFornecedores?: string[];
  fornecedoresSelecionados?: Array<{id: string, nome: string, status: string}>;
  hasSelectedSuppliers?: boolean;
  pendingActionsCount?: number;
}

export const AcoesRapidasReorganizadas = ({
  onNovoFornecedorClick,
  onImportarClick,
  onAvaliarClick,
  onControleDocumentalClick,
  onExportarClick,
  onAtualizarClick,
  onConvidarClick,
  onRequalificarClick,
  // Removemos as props relacionadas a inativar/reativar pois foram movidas
  hasSelectedSuppliers = false,
  pendingActionsCount = 4
}: AcoesRapidasReorganizadasProps) => {
  
  const [showCadastroModal, setShowCadastroModal] = useState(false);
  const [showSolicitacoesModal, setShowSolicitacoesModal] = useState(false);
  const [showAvaliacaoModal, setShowAvaliacaoModal] = useState(false);

  const handleNovoFornecedor = () => {
    setShowCadastroModal(true);
    if (onNovoFornecedorClick) onNovoFornecedorClick();
  };

  const handleAvaliar = () => {
    setShowAvaliacaoModal(true);
    if (onAvaliarClick) onAvaliarClick();
  };

  const handleAvaliacaoCompleta = () => {
    console.log("Avaliação completada com sucesso");
  };

  const handleImportar = () => {
    toast.info("Funcionalidade de importação em desenvolvimento");
    if (onImportarClick) onImportarClick();
  };

  const handleControleDocumental = () => {
    toast.info("Funcionalidade de controle documental em desenvolvimento");
    if (onControleDocumentalClick) onControleDocumentalClick();
  };

  const handleExportar = () => {
    toast.info("Funcionalidade de exportação em desenvolvimento");
    if (onExportarClick) onExportarClick();
  };

  const handleAtualizar = () => {
    toast.info("Funcionalidade de atualização em desenvolvimento");
    if (onAtualizarClick) onAtualizarClick();
  };

  const handleConvidar = () => {
    toast.info("Funcionalidade de convite em desenvolvimento");
    if (onConvidarClick) onConvidarClick();
  };

  const handleRequalificar = () => {
    toast.info("Funcionalidade de requalificação em desenvolvimento");
    if (onRequalificarClick) onRequalificarClick();
  };

  return (
    <TooltipProvider>
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="space-y-6">
            
            {/* 🤖 Ações Inteligentes (IA) - Destacado no topo */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-purple-700">
                <Brain className="h-4 w-4" />
                <span>🤖 Ações Inteligentes (IA)</span>
              </div>
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-lg border border-purple-200">
                <BotaoAcoesRecomendadas />
              </div>
            </div>

            <Separator className="bg-slate-200" />

            {/* 🔵 Adicionar Fornecedores */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-blue-700">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>🔵 Adicionar Fornecedores</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={handleNovoFornecedor}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Fornecedor
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Cadastro direto interno feito pelo analista</p>
                  </TooltipContent>
                </Tooltip>

                <SolicitarRegistro />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={() => setShowSolicitacoesModal(true)}
                      variant="outline"
                      className="border-blue-200 hover:bg-blue-50"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      📝 Solicitação Recebida
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Gerenciar solicitações de cadastro recebidas</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            <Separator className="bg-slate-200" />

            {/* 🟣 Qualificar e Avaliar */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-purple-700">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>🟣 Qualificar e Avaliar</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={handleAvaliar}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-medium"
                    >
                      <BarChart className="h-4 w-4 mr-2" />
                      📊 Avaliar Fornecedor
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Abrir avaliação técnica/documental</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={handleRequalificar}
                      variant="outline"
                      className="border-purple-200 hover:bg-purple-50"
                    >
                      <Award className="h-4 w-4 mr-2" />
                      🔁 Requalificar
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Atualizar qualificação após nova avaliação</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            <Separator className="bg-slate-200" />

            {/* 📂 Cadastro e Documentação */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-green-700">
                <FolderCheck className="h-4 w-4" />
                <span>📂 Cadastro e Documentação</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" asChild className="border-green-200 hover:bg-green-50">
                      <Link to="/controle-documental">
                        <FolderCheck className="h-4 w-4 mr-2" />
                        📁 Controle Documental
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Gerenciar certificados, alvarás etc.</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={handleImportar}
                      variant="outline"
                      className="border-green-200 hover:bg-green-50"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      ⬇️ Importar
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Subir base em lote</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={handleExportar}
                      variant="outline"
                      className="border-green-200 hover:bg-green-50"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      📤 Exportar
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Baixar dados da base</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={handleAtualizar}
                      variant="outline"
                      className="border-green-200 hover:bg-green-50"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      ♻️ Atualizar Dados
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Atualização manual ou automática via integração</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Informação sobre seleção de fornecedores para ações de status */}
            {!hasSelectedSuppliers && (
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                <p className="text-xs text-amber-700 italic">
                  💡 Para ações de inativação/reativação, selecione fornecedores na tabela abaixo
                </p>
              </div>
            )}

          </div>
        </CardContent>
      </Card>

      {/* Modal de Cadastro */}
      <CadastroFornecedorModal 
        open={showCadastroModal}
        onOpenChange={setShowCadastroModal}
      />
      
      {/* Modal de Solicitações Recebidas */}
      <SolicitacaoRecebidaModal 
        open={showSolicitacoesModal}
        onOpenChange={setShowSolicitacoesModal}
      />
      
      {/* Modal de Avaliação de Fornecedor */}
      <AvaliarDesempenhoModal
        open={showAvaliacaoModal}
        onOpenChange={setShowAvaliacaoModal}
        onComplete={handleAvaliacaoCompleta}
      />
    </TooltipProvider>
  );
};

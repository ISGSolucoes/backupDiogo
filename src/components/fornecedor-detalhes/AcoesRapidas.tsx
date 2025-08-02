
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  UserPlus, 
  RefreshCw, 
  Ban, 
  Check,
  Download,
  Power
} from "lucide-react";
import { Fornecedor } from "@/types/fornecedor";
import { ExportarPDFModal } from "./ExportarPDFModal";
import { ConvidarFornecedorModal } from "./ConvidarFornecedorModal";
import { RequalificarFornecedorModal } from "./RequalificarFornecedorModal";
import { AtualizarFornecedorModal } from "./AtualizarFornecedorModal";
import { InativarFornecedorModal } from "./InativarFornecedorModal";
import { ReativarFornecedorModal } from "./ReativarFornecedorModal";
import { AtivarFornecedorModal } from "./AtivarFornecedorModal";

interface AcoesRapidasProps {
  fornecedor: Fornecedor;
}

export const AcoesRapidas = ({ fornecedor }: AcoesRapidasProps) => {
  const [showExportarPDFModal, setShowExportarPDFModal] = useState(false);
  const [showConvidarModal, setShowConvidarModal] = useState(false);
  const [showRequalificarModal, setShowRequalificarModal] = useState(false);
  const [showAtualizarModal, setShowAtualizarModal] = useState(false);
  const [showInativarModal, setShowInativarModal] = useState(false);
  const [showReativarModal, setShowReativarModal] = useState(false);
  const [showAtivarModal, setShowAtivarModal] = useState(false);

  const isInativo = fornecedor.status === "inativo";
  const isEmRegistro = fornecedor.status === "em_registro";

  return (
    <Card className="shadow-sm border border-slate-200">
      <CardHeader className="pb-3 pt-4 px-6">
        <h3 className="text-lg font-semibold text-slate-700">Ações Rápidas</h3>
      </CardHeader>
      
      <CardContent className="px-6 pb-6">
        <TooltipProvider>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setShowConvidarModal(true)}
                  className="h-12 flex flex-col items-center justify-center gap-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <UserPlus className="h-4 w-4" />
                  <span className="text-xs font-medium">Convidar</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Convidar fornecedor para iniciar ou atualizar cadastro na plataforma</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setShowRequalificarModal(true)}
                  className="h-12 flex flex-col items-center justify-center gap-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span className="text-xs font-medium">Requalificar</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Acionar processo de requalificação documental ou técnica</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setShowAtualizarModal(true)}
                  className="h-12 flex flex-col items-center justify-center gap-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span className="text-xs font-medium">Atualizar</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Atualização cadastral direta - mudanças de dados, sincronização</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setShowExportarPDFModal(true)}
                  className="h-12 flex flex-col items-center justify-center gap-1 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <Download className="h-4 w-4" />
                  <span className="text-xs font-medium">Exportar</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Gerar relatório ou ficha do fornecedor em PDF/Excel</p>
              </TooltipContent>
            </Tooltip>

            {/* Botão Ativar - aparece apenas para fornecedores em registro */}
            {isEmRegistro && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setShowAtivarModal(true)}
                    className="h-12 flex flex-col items-center justify-center gap-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    <Power className="h-4 w-4" />
                    <span className="text-xs font-medium">Ativar</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ativar fornecedor após validação de documentos e compliance</p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* Botão Inativar/Reativar */}
            {!isInativo ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setShowInativarModal(true)}
                    className="h-12 flex flex-col items-center justify-center gap-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    <Ban className="h-4 w-4" />
                    <span className="text-xs font-medium">Inativar</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Desabilitar fornecedor para novos processos (requer justificativa)</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setShowReativarModal(true)}
                    className="h-12 flex flex-col items-center justify-center gap-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    <Check className="h-4 w-4" />
                    <span className="text-xs font-medium">Reativar</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reintegrar fornecedor anteriormente inativado</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </TooltipProvider>

        {/* Modais */}
        <ConvidarFornecedorModal 
          open={showConvidarModal}
          onOpenChange={setShowConvidarModal}
          fornecedor={fornecedor}
        />

        <RequalificarFornecedorModal 
          open={showRequalificarModal}
          onOpenChange={setShowRequalificarModal}
          fornecedor={fornecedor}
        />

        <AtualizarFornecedorModal 
          open={showAtualizarModal}
          onOpenChange={setShowAtualizarModal}
          fornecedor={fornecedor}
        />

        <InativarFornecedorModal 
          open={showInativarModal}
          onOpenChange={setShowInativarModal}
          fornecedor={fornecedor}
        />

        <ReativarFornecedorModal 
          open={showReativarModal}
          onOpenChange={setShowReativarModal}
          fornecedor={fornecedor}
        />

        <AtivarFornecedorModal 
          open={showAtivarModal}
          onOpenChange={setShowAtivarModal}
          fornecedor={fornecedor}
        />

        <ExportarPDFModal
          open={showExportarPDFModal}
          onOpenChange={setShowExportarPDFModal}
          fornecedorNome={fornecedor.nome}
        />
      </CardContent>
    </Card>
  );
};

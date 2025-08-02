
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Lock, Unlock } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface StatusCicloVidaActionsProps {
  onInativarClick?: (fornecedorIds: string[]) => void;
  onReativarClick?: (fornecedorIds: string[]) => void;
  selectedFornecedores?: string[];
  fornecedoresSelecionados?: Array<{id: string, nome: string, status: string}>;
  hasSelectedSuppliers?: boolean;
}

export const StatusCicloVidaActions = ({
  onInativarClick,
  onReativarClick,
  selectedFornecedores = [],
  fornecedoresSelecionados = [],
  hasSelectedSuppliers = false
}: StatusCicloVidaActionsProps) => {
  
  const [showInativarDialog, setShowInativarDialog] = useState(false);
  const [showReativarDialog, setShowReativarDialog] = useState(false);
  
  // Filtrar fornecedores por status para habilitar/desabilitar botões
  const fornecedoresAtivos = fornecedoresSelecionados.filter(f => f.status === 'ativo' || f.status === 'qualificado' || f.status === 'registrado');
  const fornecedoresInativos = fornecedoresSelecionados.filter(f => f.status === 'inativo');
  
  const podeInativar = fornecedoresAtivos.length > 0;
  const podeReativar = fornecedoresInativos.length > 0;

  const handleConfirmarInativar = () => {
    if (onInativarClick && fornecedoresAtivos.length > 0) {
      onInativarClick(fornecedoresAtivos.map(f => f.id));
      toast.success(`${fornecedoresAtivos.length} fornecedor(es) inativado(s) com sucesso`);
    }
    setShowInativarDialog(false);
  };

  const handleConfirmarReativar = () => {
    if (onReativarClick && fornecedoresInativos.length > 0) {
      onReativarClick(fornecedoresInativos.map(f => f.id));
      toast.success(`${fornecedoresInativos.length} fornecedor(es) reativado(s) com sucesso`);
    }
    setShowReativarDialog(false);
  };

  // Mostrar sempre o componente, mas com estado diferente quando não há seleção
  if (!hasSelectedSuppliers) {
    return (
      <TooltipProvider>
        <Card className="bg-gradient-to-br from-purple-100 to-violet-100 border-2 border-purple-300 shadow-lg">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full animate-pulse"></div>
                <span className="text-lg font-bold text-purple-800 tracking-wide drop-shadow-sm">
                  🔄 Ações de Status e Ciclo de Vida
                </span>
              </div>
              <p className="text-base font-medium text-purple-700 bg-white/60 px-4 py-2 rounded-lg shadow-sm">
                ✨ Selecione fornecedores na tabela acima para habilitar as ações de inativar/reativar
              </p>
            </div>
          </CardContent>
        </Card>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Card className="bg-gradient-to-br from-purple-100 via-pink-50 to-red-100 border-2 border-purple-300 shadow-xl">
        <CardContent className="p-6">
          <div className="space-y-4">
            
            {/* Header da seção */}
            <div className="flex items-center gap-3 text-lg font-bold text-purple-800 drop-shadow-sm">
              <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse shadow-lg"></div>
              <span className="tracking-wide">🔴 Ações de Status e Ciclo de Vida</span>
            </div>
            
            {/* Botões de ação */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    onClick={() => setShowInativarDialog(true)}
                    variant="outline"
                    className="border-2 border-red-400 hover:bg-red-100 bg-red-50 text-red-800 font-bold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 text-base py-6"
                    disabled={!podeInativar}
                  >
                    <Lock className="h-5 w-5 mr-2" />
                    🔒 Inativar
                    {fornecedoresAtivos.length > 0 && (
                      <Badge variant="outline" className="ml-2 bg-red-200 text-red-800 border-red-400 font-bold text-sm px-2">
                        {fornecedoresAtivos.length}
                      </Badge>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {podeInativar 
                      ? `Inativar ${fornecedoresAtivos.length} fornecedor(es) ativo(s)` 
                      : "Selecione fornecedores ativos para inativar"}
                  </p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    onClick={() => setShowReativarDialog(true)}
                    variant="outline"
                    className="border-2 border-green-400 hover:bg-green-100 bg-green-50 text-green-800 font-bold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 text-base py-6"
                    disabled={!podeReativar}
                  >
                    <Unlock className="h-5 w-5 mr-2" />
                    🔓 Reativar
                    {fornecedoresInativos.length > 0 && (
                      <Badge variant="outline" className="ml-2 bg-green-200 text-green-800 border-green-400 font-bold text-sm px-2">
                        {fornecedoresInativos.length}
                      </Badge>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {podeReativar 
                      ? `Reativar ${fornecedoresInativos.length} fornecedor(es) inativo(s)` 
                      : "Selecione fornecedores inativos para reativar"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            
            {/* Informação sobre seleção */}
            <div className="text-sm font-bold text-blue-800 bg-gradient-to-r from-blue-100 to-cyan-100 p-4 rounded-lg border-2 border-blue-300 shadow-md">
              ✅ {selectedFornecedores.length} fornecedor(es) selecionado(s) na tabela acima
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Dialog de Confirmação - Inativar */}
      <AlertDialog open={showInativarDialog} onOpenChange={setShowInativarDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Inativação</AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a inativar {fornecedoresAtivos.length} fornecedor(es):
              <div className="mt-2 p-3 bg-slate-50 rounded border">
                {fornecedoresAtivos.map((fornecedor, index) => (
                  <div key={fornecedor.id} className="text-sm">
                    {index + 1}. {fornecedor.nome}
                  </div>
                ))}
              </div>
              <p className="mt-2">Esta ação pode ser revertida posteriormente. Deseja continuar?</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmarInativar}
              className="bg-red-600 hover:bg-red-700"
            >
              Inativar Fornecedores
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de Confirmação - Reativar */}
      <AlertDialog open={showReativarDialog} onOpenChange={setShowReativarDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Reativação</AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a reativar {fornecedoresInativos.length} fornecedor(es):
              <div className="mt-2 p-3 bg-slate-50 rounded border">
                {fornecedoresInativos.map((fornecedor, index) => (
                  <div key={fornecedor.id} className="text-sm">
                    {index + 1}. {fornecedor.nome}
                  </div>
                ))}
              </div>
              <p className="mt-2">Estes fornecedores voltarão ao status ativo. Deseja continuar?</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmarReativar}
              className="bg-green-600 hover:bg-green-700"
            >
              Reativar Fornecedores
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
};

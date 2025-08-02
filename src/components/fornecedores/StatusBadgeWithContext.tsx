
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { StatusFornecedor, MotivoInativacao } from "@/types/fornecedor";
import { getMotivoInativacaoTexto, getMotivoInativacaoIcon } from "@/utils/statusUtils";

interface StatusBadgeWithContextProps {
  status: StatusFornecedor;
  motivoInativacao?: MotivoInativacao;
  dataInativacao?: string;
  usuarioInativacao?: string;
  observacaoInativacao?: string;
  showTooltip?: boolean;
}

export const StatusBadgeWithContext = ({ 
  status, 
  motivoInativacao, 
  dataInativacao, 
  usuarioInativacao, 
  observacaoInativacao,
  showTooltip = true 
}: StatusBadgeWithContextProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Registrado</Badge>;
      case 'inativo':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Inativo</Badge>;
      case 'em_registro':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Em Registro</Badge>;
      case 'pendente':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Pendente</Badge>;
      case 'qualificado':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Qualificado</Badge>;
      case 'preferido':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Preferido</Badge>;
      default:
        return <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">Desconhecido</Badge>;
    }
  };

  // Se não for inativo ou não tiver tooltip habilitado, renderiza badge simples
  if (status !== 'inativo' || !showTooltip) {
    return getStatusBadge(status);
  }

  // Badge inativo com contexto adicional
  const motivoTexto = getMotivoInativacaoTexto(motivoInativacao, dataInativacao, usuarioInativacao);
  const motivoIcon = getMotivoInativacaoIcon(motivoInativacao);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1">
            {getStatusBadge(status)}
            <span className="text-xs">{motivoIcon}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-1">
            <p className="font-medium">Motivo da inativação:</p>
            <p className="text-sm">{motivoTexto}</p>
            {observacaoInativacao && (
              <p className="text-xs text-slate-500 mt-2">
                Obs: {observacaoInativacao}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

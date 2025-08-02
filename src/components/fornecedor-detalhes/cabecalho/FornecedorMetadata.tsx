
import React from "react";
import { 
  Building2, Briefcase, HelpCircle, MapPin, Users, CreditCard, FileText 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TipoEmpresa, TipoFornecedor } from "@/types/fornecedor";

interface FornecedorMetadataProps {
  cnpj: string;
  tipoEmpresa: TipoEmpresa;
  cidade: string;
  uf: string;
  tipoFornecedor: TipoFornecedor;
  categoria?: string;
  subcategoria?: string;
  porte?: string;
  funcionarios?: number | string;
  faturamento?: number | string;
  cnae?: string;
}

export const FornecedorMetadata = ({
  cnpj,
  tipoEmpresa,
  cidade,
  uf,
  tipoFornecedor,
  categoria,
  subcategoria,
  porte,
  funcionarios,
  faturamento,
  cnae
}: FornecedorMetadataProps) => {
  
  const getTipoFornecedorIcon = () => {
    switch (tipoFornecedor) {
      case 'industria':
        return <Building2 className="h-4 w-4" />;
      case 'servico':
        return <Briefcase className="h-4 w-4" />;
      default:
        return <HelpCircle className="h-4 w-4" />;
    }
  };

  const getTipoEmpresaFormatado = () => {
    switch (tipoEmpresa) {
      case 'ltda':
        return 'LTDA';
      case 'sa':
        return 'S.A.';
      case 'mei':
        return 'MEI';
      default:
        return tipoEmpresa.toUpperCase();
    }
  };

  const getPorteFormatado = () => {
    switch (porte) {
      case 'pequeno':
        return 'Pequena';
      case 'medio':
        return 'Média';
      case 'grande':
        return 'Grande';
      default:
        return 'Não informado';
    }
  };
  
  return (
    <>
      {/* CNPJ, Localização, Tipo */}
      <div className="flex flex-col md:flex-row gap-2 md:gap-4 text-sm text-slate-700">
        <div className="flex items-center gap-1">
          <span className="font-semibold">CNPJ:</span>
          <span>{cnpj}</span>
          <Badge variant="outline" className="ml-1 text-xs">
            {tipoEmpresa === 'sa' ? 'Matriz' : 'Filial'}
          </Badge>
        </div>

        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4 text-slate-500" />
          <span>{cidade} - {uf}</span>
        </div>
        
        <div className="flex items-center gap-1">
          {getTipoFornecedorIcon()}
          <span>
            {tipoFornecedor || 'Não especificado'} 
            {categoria && ` • ${categoria}`}
            {subcategoria && ` • ${subcategoria}`}
          </span>
        </div>
      </div>

      {/* Tipo Jurídico, Porte, Funcionários, Faturamento */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-700">
        <div className="flex items-center gap-1">
          <Building2 className="h-4 w-4 text-slate-500" />
          <span className="font-medium">Tipo Jurídico:</span>
          <span>{getTipoEmpresaFormatado()}</span>
        </div>
        
        {porte && (
          <div className="flex items-center gap-1">
            <Briefcase className="h-4 w-4 text-slate-500" />
            <span className="font-medium">Porte:</span>
            <span>{getPorteFormatado()}</span>
          </div>
        )}
        
        {funcionarios && (
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-slate-500" />
            <span className="font-medium">Funcionários:</span>
            <span>{funcionarios || 'Não informado'}</span>
          </div>
        )}
        
        {faturamento && (
          <div className="flex items-center gap-1">
            <CreditCard className="h-4 w-4 text-slate-500" />
            <span className="font-medium">Faturamento:</span>
            <span>{faturamento || 'Não informado'}</span>
          </div>
        )}
      </div>

      {/* CNAE */}
      {cnae && (
        <div className="flex items-center gap-1 text-sm text-slate-700">
          <FileText className="h-4 w-4 text-slate-500" />
          <span className="font-medium">CNAE:</span>
          <span>{cnae}</span>
        </div>
      )}
    </>
  );
};

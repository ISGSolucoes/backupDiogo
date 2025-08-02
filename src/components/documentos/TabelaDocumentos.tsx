
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  FileUp,
  Trash2,
  AlertCircle,
  History,
  Download
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Documento } from "@/types/documentos";
import { format, isValid, parse, parseISO, isAfter, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

export interface TabelaDocumentosProps {
  documentos: Documento[];
  onVisualizar?: (documento: Documento) => void;
  onSubstituir?: (documento: Documento) => void;
  onExcluir?: (documento: Documento) => void;
  onVerVersoes?: (documento: Documento) => void;
  onDelete?: (id: string) => void;
  onDownload?: (doc: Documento) => void;
}

export const TabelaDocumentos = ({ 
  documentos, 
  onVisualizar,
  onSubstituir,
  onExcluir,
  onVerVersoes,
  onDelete,
  onDownload
}: TabelaDocumentosProps) => {
  const formatData = (dataStr: string): string => {
    if (!dataStr) return "-";
    
    try {
      // Primeiro tenta interpretar como data no formato DD/MM/YYYY
      const parsedDateDDMMYYYY = parse(dataStr, "dd/MM/yyyy", new Date());
      if (isValid(parsedDateDDMMYYYY)) {
        return format(parsedDateDDMMYYYY, "dd/MM/yyyy", { locale: ptBR });
      }
      
      // Tenta interpretar como data no formato YYYY-MM-DD
      const parsedDateISO = parse(dataStr, "yyyy-MM-dd", new Date());
      if (isValid(parsedDateISO)) {
        return format(parsedDateISO, "dd/MM/yyyy", { locale: ptBR });
      }
      
      // Tenta interpretar como ISO string completo (com hora)
      try {
        const isoDate = parseISO(dataStr);
        if (isValid(isoDate)) {
          return format(isoDate, "dd/MM/yyyy", { locale: ptBR });
        }
      } catch (e) {
        // Se falhar, continua tentando outros formatos
      }
      
      // Tenta interpretar como timestamp
      const timestamp = Date.parse(dataStr);
      if (!isNaN(timestamp)) {
        return format(new Date(timestamp), "dd/MM/yyyy", { locale: ptBR });
      }
    } catch (e) {
      console.error("Erro ao formatar data:", dataStr, e);
    }
    
    return "-"; // Retorna um traço se não conseguir formatar
  };

  const getStatusBadge = (documento: Documento) => {
    if (!documento.validade) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Sem validade</span>;
    }

    const hoje = new Date();
    
    // Verificar formato da validade e converter para Date
    let dataValidade: Date | null = null;
    try {
      // Tentar analisar como data DD/MM/YYYY
      const parsedDateDDMMYYYY = parse(documento.validade, "dd/MM/yyyy", new Date());
      if (isValid(parsedDateDDMMYYYY)) {
        dataValidade = parsedDateDDMMYYYY;
      } 
      
      // Tentar analisar como data YYYY-MM-DD
      if (!dataValidade) {
        const parsedDateISO = parse(documento.validade, "yyyy-MM-dd", new Date());
        if (isValid(parsedDateISO)) {
          dataValidade = parsedDateISO;
        }
      }
      
      // Tentar como ISO string
      if (!dataValidade) {
        const parsedISO = parseISO(documento.validade);
        if (isValid(parsedISO)) {
          dataValidade = parsedISO;
        }
      }
      
      // Tentar como timestamp
      if (!dataValidade) {
        const timestamp = Date.parse(documento.validade);
        if (!isNaN(timestamp)) {
          dataValidade = new Date(timestamp);
        }
      }
      
    } catch (e) {
      console.error("Erro ao analisar data de validade:", documento.validade, e);
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Data inválida</span>;
    }
    
    if (!dataValidade || !isValid(dataValidade)) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Data inválida</span>;
    }
    
    const trintaDiasAFrente = addDays(hoje, 30);
    
    if (isAfter(hoje, dataValidade)) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">❌ Vencido</span>;
    } else if (isAfter(trintaDiasAFrente, dataValidade)) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
          <AlertCircle className="h-3 w-3" />
          ⚠️ Vence em breve
        </span>
      );
    }
    
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Válido</span>;
  };

  const getTipoLabel = (tipo: string): string => {
    const tipos = {
      'certidao': 'Certidão',
      'contrato': 'Contrato',
      'formulario': 'Formulário',
      'outro': 'Outro'
    };
    return tipos[tipo as keyof typeof tipos] || tipo;
  };

  const handleExcluir = (documento: Documento) => {
    if (onExcluir) {
      onExcluir(documento);
    }
    if (onDelete) {
      onDelete(documento.id);
    }
  };

  const handleDownload = (documento: Documento) => {
    if (onDownload) {
      onDownload(documento);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 card-shadow">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome do Documento</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data de Envio</TableHead>
              <TableHead>Validade</TableHead>
              <TableHead>Versão</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documentos.length > 0 ? (
              documentos.map((documento) => (
                <TableRow key={documento.id}>
                  <TableCell>
                    <div className="font-medium">{documento.nome}</div>
                  </TableCell>
                  <TableCell>{getTipoLabel(documento.tipo)}</TableCell>
                  <TableCell>{getStatusBadge(documento)}</TableCell>
                  <TableCell>{formatData(documento.upload_data)}</TableCell>
                  <TableCell>{documento.validade ? formatData(documento.validade) : '-'}</TableCell>
                  <TableCell>v{documento.versao}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onVisualizar && onVisualizar(documento)}
                        className="h-8 px-2"
                      >
                        <FileText className="h-4 w-4 mr-1" /> Ver
                      </Button>
                      
                      {onVerVersoes && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => onVerVersoes(documento)}
                          className="h-8 px-2"
                        >
                          <History className="h-4 w-4 mr-1" /> Versões
                        </Button>
                      )}
                      
                      {(onSubstituir || onDownload) && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            if (onSubstituir) onSubstituir(documento);
                            else if (onDownload) handleDownload(documento);
                          }}
                          className="h-8 px-2"
                        >
                          {onSubstituir ? (
                            <><FileUp className="h-4 w-4 mr-1" /> Substituir</>
                          ) : (
                            <><Download className="h-4 w-4 mr-1" /> Download</>
                          )}
                        </Button>
                      )}
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleExcluir(documento)}
                        className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                  Nenhum documento encontrado. Faça o upload do primeiro documento.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

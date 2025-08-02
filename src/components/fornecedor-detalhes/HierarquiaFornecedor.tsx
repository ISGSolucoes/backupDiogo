
import React, { useState } from "react";
import { Check, Download, FileSearch, X, Loader } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { HierarquiaItem } from "@/types/fornecedor";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

interface HierarquiaFornecedorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  raizCnpj: string;
  nomeGrupo: string;
  hierarquia: HierarquiaItem[];
}

export const HierarquiaFornecedor = ({
  open,
  onOpenChange,
  raizCnpj,
  nomeGrupo,
  hierarquia,
}: HierarquiaFornecedorProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const navigate = useNavigate();

  // Function to handle row click - navigate to the supplier detail page
  const handleRowClick = (fornecedorId: string) => {
    navigate(`/fornecedores/${fornecedorId}`);
    onOpenChange(false); // Close the dialog after navigation
  };

  // Function to convert the data to CSV format
  const convertToCSV = (items: HierarquiaItem[]) => {
    // Define headers for all required columns
    const headers = [
      "fornecedor_id",
      "Nome da Empresa",
      "CNPJ Completo",
      "CNPJ Raiz",
      "Tipo de Unidade",
      "Status",
      "Estado",
      "Cidade",
      "Categoria",
      "Data de Cadastro",
      "Contato: Nome",
      "Contato: E-mail",
      "Contato: Telefone"
    ].join(",");

    // Map each item to a row
    const rows = items.map(item => {
      // For demo purposes, we're using placeholder data for missing fields
      // In a real implementation, these would come from the database
      const categoria = "Tecnologia"; // Placeholder
      const contato = {
        nome: item.status.toLowerCase() === "inativo" ? "—" : "Contato Principal",
        email: item.status.toLowerCase() === "inativo" ? "—" : `contato@${item.nome.toLowerCase().replace(/\s+/g, '')}.com`,
        telefone: item.status.toLowerCase() === "inativo" ? "—" : "(11) 99999-9999"
      };
      
      // Generate a mock registration date - in a real app this would come from the database
      const dataCadastro = item.dataCadastro || 
        new Date(new Date().setDate(new Date().getDate() - Math.floor(Math.random() * 365))).toLocaleDateString('pt-BR');
      
      // Create the row with all required columns
      return [
        item.id,
        item.nome,
        item.cnpj,
        raizCnpj,
        item.tipoUnidade,
        item.status,
        item.uf,
        item.cidade,
        categoria,
        dataCadastro,
        contato.nome,
        contato.email,
        contato.telefone
      ].join(",");
    });

    // Combine headers and rows
    return [headers, ...rows].join("\n");
  };

  const handleExportarHierarquia = () => {
    try {
      setIsExporting(true);
      
      // Convert the hierarchy data to CSV
      const csvContent = convertToCSV(hierarquia);
      
      // Create a Blob with the CSV data
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      
      // Create a download link and trigger the download
      const link = document.createElement('a');
      
      // Create a URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Set link properties
      link.setAttribute('href', url);
      link.setAttribute('download', `hierarquia_${raizCnpj.replace(/[^\d]/g, '')}_${new Date().toISOString().slice(0,10)}.csv`);
      
      // Append the link to the document
      document.body.appendChild(link);
      
      // Trigger the download
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("Exportação concluída com sucesso");
    } catch (error) {
      console.error("Erro ao exportar hierarquia:", error);
      toast.error("Erro ao exportar hierarquia. Tente novamente.");
    } finally {
      setIsExporting(false);
    }
  };

  const renderStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "ativo":
        return <Check className="h-4 w-4 text-green-600" />;
      case "inativo":
        return <X className="h-4 w-4 text-red-600" />;
      case "em_registro":
      case "em registro":
        return <Loader className="h-4 w-4 text-amber-600" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            🏢 Hierarquia – Grupo: {nomeGrupo} (CNPJ Raiz: {raizCnpj})
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex justify-end mb-4">
          <Button 
            variant="outline" 
            onClick={handleExportarHierarquia}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Exportando...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Exportar hierarquia (CSV)
              </>
            )}
          </Button>
        </div>
        
        <div className="overflow-auto max-h-[60vh]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-32">Tipo de Unidade</TableHead>
                <TableHead>Nome da Empresa</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead className="w-28">Status</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Última Participação</TableHead>
                <TableHead className="w-28 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hierarquia.map((item) => (
                <TableRow 
                  key={item.id}
                  className="cursor-pointer hover:bg-slate-100"
                  onClick={() => handleRowClick(item.id)}
                >
                  <TableCell className="font-medium">
                    {item.tipoUnidade}
                  </TableCell>
                  <TableCell>{item.nome}</TableCell>
                  <TableCell>{item.cnpj}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {renderStatusIcon(item.status)}
                      <Badge
                        variant="outline"
                        className={`${
                          item.status.toLowerCase() === "ativo"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : item.status.toLowerCase() === "inativo"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {item.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.cidade} - {item.uf}
                  </TableCell>
                  <TableCell>{item.ultimaParticipacao}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      asChild 
                      size="sm" 
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click event
                      }}
                    >
                      <Link to={`/fornecedores/${item.id}`}>
                        <FileSearch className="h-4 w-4 mr-1" /> Ver ficha
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {hierarquia.some(item => item.status.toLowerCase() === "inativo") && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-start gap-2">
              <div className="text-blue-700 font-semibold">🧠 IA Rê sugere:</div>
              <div>
                "Há filiais inativas há mais de 6 meses. Considere arquivá-las para otimizar sua visualização."
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};



import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

export type RequisicaoItem = {
  id: string;
  nome: string;
  data: string;
  solicitante: string;
  area: string;
  status: string;
  prazo: string;
  valor: number;
};

interface TabelaRequisicoesProps {
  requisicoes: RequisicaoItem[];
  onVerDetalhes: (id: string) => void;
}

export const TabelaRequisicoes = ({ requisicoes, onVerDetalhes }: TabelaRequisicoesProps) => {
  // Função para obter a classe de estilo com base no status
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pendente":
        return "bg-amber-100 text-amber-800";
      case "aprovada":
        return "bg-blue-100 text-blue-800";
      case "em_cotacao":
        return "bg-purple-100 text-purple-800";
      case "finalizada":
        return "bg-green-100 text-green-800";
      case "atrasada":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Função para obter o texto do status
  const getStatusText = (status: string) => {
    switch (status) {
      case "pendente":
        return "Aguardando aprovação";
      case "aprovada":
        return "Aprovada";
      case "em_cotacao":
        return "Em cotação";
      case "finalizada":
        return "Finalizada";
      case "atrasada":
        return "Atrasada";
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Requisição #</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Solicitante</TableHead>
              <TableHead>Área</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Prazo</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requisicoes.map((req) => (
              <TableRow key={req.id} className="hover:bg-slate-50">
                <TableCell className="font-medium">{req.id}</TableCell>
                <TableCell>{req.nome}</TableCell>
                <TableCell>{req.solicitante}</TableCell>
                <TableCell>{req.area}</TableCell>
                <TableCell>{new Date(req.data).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(req.status)}`}>
                    {getStatusText(req.status)}
                  </span>
                </TableCell>
                <TableCell>{new Date(req.prazo).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(req.valor)}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onVerDetalhes(req.id)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

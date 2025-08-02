
import React, { useState } from "react";
import { History, MessageSquare, FileCheck, Calendar, Settings } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HistoricoFornecedor as HistoricoFornecedorType } from "@/types/fornecedor";

interface HistoricoFornecedorProps {
  historico: HistoricoFornecedorType[];
}

export const HistoricoFornecedor = ({ historico }: HistoricoFornecedorProps) => {
  const [filtro, setFiltro] = useState<string>("todos");

  const formatarData = (dataString: string) => {
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString("pt-BR") + " " + data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    } catch (e) {
      return dataString;
    }
  };

  const getTipoEvento = (tipo: string) => {
    switch (tipo) {
      case "participacao":
        return {
          badge: (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Participação
            </Badge>
          ),
          icon: <Calendar className="h-4 w-4 text-blue-600" />,
        };
      case "documento":
        return {
          badge: (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Documento
            </Badge>
          ),
          icon: <FileCheck className="h-4 w-4 text-green-600" />,
        };
      case "mensagem":
        return {
          badge: (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              Mensagem
            </Badge>
          ),
          icon: <MessageSquare className="h-4 w-4 text-amber-600" />,
        };
      case "avaliacao":
        return {
          badge: (
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              Avaliação
            </Badge>
          ),
          icon: <History className="h-4 w-4 text-purple-600" />,
        };
      case "sistema":
        return {
          badge: (
            <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
              Sistema
            </Badge>
          ),
          icon: <Settings className="h-4 w-4 text-slate-600" />,
        };
      default:
        return {
          badge: (
            <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
              Outro
            </Badge>
          ),
          icon: <Settings className="h-4 w-4 text-slate-600" />,
        };
    }
  };

  const historicoFiltrado = historico.filter((item) => {
    return filtro === "todos" || item.tipoEvento === filtro;
  });

  const participacoes = historico.filter((item) => item.tipoEvento === "participacao");
  const documentos = historico.filter((item) => item.tipoEvento === "documento");
  const mensagens = historico.filter((item) => item.tipoEvento === "mensagem");
  const avaliacoes = historico.filter((item) => item.tipoEvento === "avaliacao");

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4 md:mb-0">
          <History className="h-5 w-5" /> Histórico Completo
        </h2>

        <Select value={filtro} onValueChange={setFiltro}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo de Evento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os eventos</SelectItem>
            <SelectItem value="participacao">Participações</SelectItem>
            <SelectItem value="documento">Documentos</SelectItem>
            <SelectItem value="mensagem">Mensagens</SelectItem>
            <SelectItem value="avaliacao">Avaliações</SelectItem>
            <SelectItem value="sistema">Sistema</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="todos" className="w-full">
        <TabsList>
          <TabsTrigger value="todos">Todos ({historico.length})</TabsTrigger>
          <TabsTrigger value="participacoes">Participações ({participacoes.length})</TabsTrigger>
          <TabsTrigger value="documentos">Documentos ({documentos.length})</TabsTrigger>
          <TabsTrigger value="mensagens">Mensagens ({mensagens.length})</TabsTrigger>
          <TabsTrigger value="avaliacoes">Avaliações ({avaliacoes.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="todos">
          <TabelaHistorico historico={historicoFiltrado} getTipoEvento={getTipoEvento} formatarData={formatarData} />
        </TabsContent>

        <TabsContent value="participacoes">
          <TabelaHistorico historico={participacoes} getTipoEvento={getTipoEvento} formatarData={formatarData} />
        </TabsContent>

        <TabsContent value="documentos">
          <TabelaHistorico historico={documentos} getTipoEvento={getTipoEvento} formatarData={formatarData} />
        </TabsContent>

        <TabsContent value="mensagens">
          <TabelaHistorico historico={mensagens} getTipoEvento={getTipoEvento} formatarData={formatarData} />
        </TabsContent>

        <TabsContent value="avaliacoes">
          <TabelaHistorico historico={avaliacoes} getTipoEvento={getTipoEvento} formatarData={formatarData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface TabelaHistoricoProps {
  historico: HistoricoFornecedorType[];
  getTipoEvento: (tipo: string) => { badge: JSX.Element; icon: JSX.Element };
  formatarData: (dataString: string) => string;
}

const TabelaHistorico = ({ historico, getTipoEvento, formatarData }: TabelaHistoricoProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Usuário</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {historico.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                Nenhum registro encontrado
              </TableCell>
            </TableRow>
          ) : (
            historico.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{formatarData(item.data)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getTipoEvento(item.tipoEvento).icon}
                    {getTipoEvento(item.tipoEvento).badge}
                  </div>
                </TableCell>
                <TableCell>{item.descricao}</TableCell>
                <TableCell>{item.usuario}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

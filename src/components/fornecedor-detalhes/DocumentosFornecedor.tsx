
import React, { useState } from "react";
import { FileText, Upload, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Documento } from "@/types/documentos";

interface DocumentosFornecedorProps {
  fornecedorId: string;
  documentos: Documento[];
  onVisualizarClick: (doc: Documento) => void;
  onSubstituirClick: (doc: Documento) => void;
  onExcluirClick: (doc: Documento) => void;
  onNovoClick: () => void;
}

export const DocumentosFornecedor = ({
  fornecedorId,
  documentos,
  onVisualizarClick,
  onSubstituirClick,
  onExcluirClick,
  onNovoClick,
}: DocumentosFornecedorProps) => {
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [busca, setBusca] = useState<string>("");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "valido":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Válido
          </Badge>
        );
      case "vencido":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Vencido
          </Badge>
        );
      case "pendente":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Pendente
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
            Desconhecido
          </Badge>
        );
    }
  };

  const formatarData = (dataString?: string) => {
    if (!dataString) return "-";
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString("pt-BR");
    } catch (e) {
      return dataString;
    }
  };

  const filtrarDocumentos = () => {
    return documentos.filter((doc) => {
      // Filtrar por tipo
      const tipoMatch = filtroTipo === "todos" || doc.tipo === filtroTipo;

      // Filtrar por status
      const statusMatch = filtroStatus === "todos" || doc.status === filtroStatus;

      // Filtrar por busca
      const buscaLower = busca.toLowerCase();
      const buscaMatch = busca === "" || doc.nome.toLowerCase().includes(buscaLower);

      return tipoMatch && statusMatch && buscaMatch;
    });
  };

  const documentosFiltrados = filtrarDocumentos();

  // Separar documentos por tipo para as tabs
  const certidoes = documentosFiltrados.filter((doc) => doc.tipo === "certidao");
  const contratos = documentosFiltrados.filter((doc) => doc.tipo === "contrato");
  const formularios = documentosFiltrados.filter((doc) => doc.tipo === "formulario");
  const outros = documentosFiltrados.filter((doc) => doc.tipo === "outro");

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4 sm:mb-0">
          <FileText className="h-5 w-5" /> Documentos
        </h2>

        <Button onClick={onNovoClick}>
          <Upload className="h-4 w-4 mr-2" /> Novo Documento
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar documentos..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo de Documento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                <SelectItem value="certidao">Certidão</SelectItem>
                <SelectItem value="contrato">Contrato</SelectItem>
                <SelectItem value="formulario">Formulário</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="valido">Válidos</SelectItem>
                <SelectItem value="vencido">Vencidos</SelectItem>
                <SelectItem value="pendente">Pendentes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="todos" className="w-full">
          <TabsList>
            <TabsTrigger value="todos">Todos ({documentosFiltrados.length})</TabsTrigger>
            <TabsTrigger value="certidoes">Certidões ({certidoes.length})</TabsTrigger>
            <TabsTrigger value="contratos">Contratos ({contratos.length})</TabsTrigger>
            <TabsTrigger value="formularios">Formulários ({formularios.length})</TabsTrigger>
            <TabsTrigger value="outros">Outros ({outros.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="todos">
            <DocumentosTabela
              documentos={documentosFiltrados}
              onVisualizarClick={onVisualizarClick}
              onSubstituirClick={onSubstituirClick}
              onExcluirClick={onExcluirClick}
              getStatusBadge={getStatusBadge}
              formatarData={formatarData}
            />
          </TabsContent>

          <TabsContent value="certidoes">
            <DocumentosTabela
              documentos={certidoes}
              onVisualizarClick={onVisualizarClick}
              onSubstituirClick={onSubstituirClick}
              onExcluirClick={onExcluirClick}
              getStatusBadge={getStatusBadge}
              formatarData={formatarData}
            />
          </TabsContent>

          <TabsContent value="contratos">
            <DocumentosTabela
              documentos={contratos}
              onVisualizarClick={onVisualizarClick}
              onSubstituirClick={onSubstituirClick}
              onExcluirClick={onExcluirClick}
              getStatusBadge={getStatusBadge}
              formatarData={formatarData}
            />
          </TabsContent>

          <TabsContent value="formularios">
            <DocumentosTabela
              documentos={formularios}
              onVisualizarClick={onVisualizarClick}
              onSubstituirClick={onSubstituirClick}
              onExcluirClick={onExcluirClick}
              getStatusBadge={getStatusBadge}
              formatarData={formatarData}
            />
          </TabsContent>

          <TabsContent value="outros">
            <DocumentosTabela
              documentos={outros}
              onVisualizarClick={onVisualizarClick}
              onSubstituirClick={onSubstituirClick}
              onExcluirClick={onExcluirClick}
              getStatusBadge={getStatusBadge}
              formatarData={formatarData}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

interface DocumentosTabelaProps {
  documentos: Documento[];
  onVisualizarClick: (doc: Documento) => void;
  onSubstituirClick: (doc: Documento) => void;
  onExcluirClick: (doc: Documento) => void;
  getStatusBadge: (status: string) => JSX.Element;
  formatarData: (dataString?: string) => string;
}

const DocumentosTabela = ({
  documentos,
  onVisualizarClick,
  onSubstituirClick,
  onExcluirClick,
  getStatusBadge,
  formatarData,
}: DocumentosTabelaProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Versão</TableHead>
            <TableHead>Validade</TableHead>
            <TableHead>Enviado por</TableHead>
            <TableHead>Data de Envio</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documentos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                Nenhum documento encontrado
              </TableCell>
            </TableRow>
          ) : (
            documentos.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>
                  <div className="font-medium">{doc.nome}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {doc.tipo === "certidao" && "Certidão"}
                    {doc.tipo === "contrato" && "Contrato"}
                    {doc.tipo === "formulario" && "Formulário"}
                    {doc.tipo === "outro" && "Outro"}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(doc.status)}</TableCell>
                <TableCell>v{doc.versao}</TableCell>
                <TableCell>{formatarData(doc.validade)}</TableCell>
                <TableCell>{doc.upload_por}</TableCell>
                <TableCell>{formatarData(doc.upload_data)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onVisualizarClick(doc)}
                    >
                      Ver
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onSubstituirClick(doc)}
                    >
                      Substituir
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => onExcluirClick(doc)}
                    >
                      Excluir
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};


import React, { useState, useMemo } from "react";
import { 
  FileText, 
  Users, 
  Download, 
  Mail, 
  AlertCircle,
  Calendar,
  Filter,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { BackButton } from "@/components/ui/back-button";
import { Documento } from "@/types/documentos";

// Mock de documentos expandido para simular múltiplos fornecedores
const mockDocumentosGlobais: (Documento & { 
  fornecedor_nome: string; 
  fornecedor_cnpj: string;
})[] = [
  {
    id: "doc1",
    fornecedor_id: "1",
    fornecedor_nome: "Tech Solutions Ltda",
    fornecedor_cnpj: "12.345.678/0001-90",
    tipo: "certidao",
    nome: "Certidão Negativa de Débitos",
    versao: "1.0",
    validade: "2023-12-31",
    status: "vencido",
    upload_por: "João Silva",
    upload_data: "2023-01-15T10:30:00Z",
    tamanho: 1.2,
    formato: "PDF",
    arquivo_url: "/docs/certidao_negativa.pdf",
    ativo: true
  },
  {
    id: "doc2",
    fornecedor_id: "2",
    fornecedor_nome: "ABC Materiais",
    fornecedor_cnpj: "98.765.432/0001-10",
    tipo: "certidao",
    nome: "Certidão Negativa de Débitos",
    versao: "1.0",
    validade: "2023-11-30",
    status: "vencido",
    upload_por: "Maria Santos",
    upload_data: "2023-02-20T14:15:00Z",
    tamanho: 1.1,
    formato: "PDF",
    arquivo_url: "/docs/certidao_negativa_2.pdf",
    ativo: true
  },
  {
    id: "doc3",
    fornecedor_id: "3",
    fornecedor_nome: "Transportes Rápidos SA",
    fornecedor_cnpj: "45.678.912/0001-34",
    tipo: "certidao",
    nome: "Certidão Negativa de Débitos",
    versao: "1.0",
    validade: "2023-10-15",
    status: "vencido",
    upload_por: "Carlos Silva",
    upload_data: "2023-01-10T09:45:00Z",
    tamanho: 1.3,
    formato: "PDF",
    arquivo_url: "/docs/certidao_negativa_3.pdf",
    ativo: true
  },
  {
    id: "doc4",
    fornecedor_id: "1",
    fornecedor_nome: "Tech Solutions Ltda",
    fornecedor_cnpj: "12.345.678/0001-90",
    tipo: "contrato",
    nome: "Contrato de Fornecimento",
    versao: "2.1",
    validade: "2024-06-30",
    status: "valido",
    upload_por: "João Silva",
    upload_data: "2023-03-22T14:15:00Z",
    tamanho: 3.5,
    formato: "PDF",
    arquivo_url: "/docs/contrato_fornecimento.pdf",
    ativo: true
  },
  {
    id: "doc5",
    fornecedor_id: "4",
    fornecedor_nome: "Consultoria ME",
    fornecedor_cnpj: "23.456.789/0001-21",
    tipo: "formulario",
    nome: "Formulário de Qualificação",
    versao: "1.2",
    validade: "2023-05-10",
    status: "vencido",
    upload_por: "Ana Costa",
    upload_data: "2022-05-10T09:45:00Z",
    tamanho: 0.8,
    formato: "DOCX",
    arquivo_url: "/docs/form_qualificacao.docx",
    ativo: true
  },
  {
    id: "doc6",
    fornecedor_id: "5",
    fornecedor_nome: "Equipamentos Industriais",
    fornecedor_cnpj: "34.567.890/0001-12",
    tipo: "formulario",
    nome: "Formulário de Qualificação",
    versao: "1.2",
    validade: "2023-04-20",
    status: "vencido",
    upload_por: "Pedro Lima",
    upload_data: "2022-04-20T11:30:00Z",
    tamanho: 0.9,
    formato: "DOCX",
    arquivo_url: "/docs/form_qualificacao_2.docx",
    ativo: true
  }
];

interface DocumentoAgrupado {
  nome: string;
  tipo: string;
  status: string;
  quantidade_fornecedores: number;
  proxima_validade: string;
  documentos: (Documento & { fornecedor_nome: string; fornecedor_cnpj: string })[];
}

export const ControleDocumental = () => {
  const [filtroTermo, setFiltroTermo] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [modalAberto, setModalAberto] = useState(false);
  const [documentoSelecionado, setDocumentoSelecionado] = useState<DocumentoAgrupado | null>(null);
  const [fornecedoresSelecionados, setFornecedoresSelecionados] = useState<string[]>([]);

  // Agrupar documentos por nome + tipo + status
  const documentosAgrupados = useMemo(() => {
    let documentosFiltrados = mockDocumentosGlobais;

    // Aplicar filtros
    if (filtroTermo) {
      const termo = filtroTermo.toLowerCase();
      documentosFiltrados = documentosFiltrados.filter(doc =>
        doc.nome.toLowerCase().includes(termo) ||
        doc.fornecedor_nome.toLowerCase().includes(termo) ||
        doc.fornecedor_cnpj.includes(termo) ||
        // Incluir busca por CPF para pessoas físicas
        (doc.fornecedor_cnpj.length === 14 && doc.fornecedor_cnpj.replace(/\D/g, '').includes(termo.replace(/\D/g, '')))
      );
    }

    if (filtroTipo !== "todos") {
      documentosFiltrados = documentosFiltrados.filter(doc => doc.tipo === filtroTipo);
    }

    if (filtroStatus !== "todos") {
      documentosFiltrados = documentosFiltrados.filter(doc => doc.status === filtroStatus);
    }

    // Agrupar por nome + tipo + status
    const grupos = documentosFiltrados.reduce((acc, doc) => {
      const chave = `${doc.nome}|${doc.tipo}|${doc.status}`;
      if (!acc[chave]) {
        acc[chave] = [];
      }
      acc[chave].push(doc);
      return acc;
    }, {} as Record<string, typeof documentosFiltrados>);

    // Converter para array de DocumentoAgrupado
    return Object.entries(grupos).map(([chave, documentos]) => {
      const [nome, tipo, status] = chave.split('|');
      const validadesDatas = documentos
        .filter(d => d.validade)
        .map(d => new Date(d.validade!))
        .sort((a, b) => a.getTime() - b.getTime());
      
      return {
        nome,
        tipo,
        status,
        quantidade_fornecedores: documentos.length,
        proxima_validade: validadesDatas.length > 0 
          ? validadesDatas[0].toLocaleDateString('pt-BR')
          : '-',
        documentos
      };
    }).sort((a, b) => {
      // Ordenar por status (vencido primeiro) e depois por quantidade
      if (a.status === 'vencido' && b.status !== 'vencido') return -1;
      if (a.status !== 'vencido' && b.status === 'vencido') return 1;
      return b.quantidade_fornecedores - a.quantidade_fornecedores;
    });
  }, [filtroTermo, filtroTipo, filtroStatus]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "vencido":
        return <Badge variant="destructive">Vencido</Badge>;
      case "valido":
        return <Badge variant="default" className="bg-green-100 text-green-800">Válido</Badge>;
      case "pendente":
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800">Pendente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTipoLabel = (tipo: string) => {
    const tipos = {
      'certidao': 'Certidão',
      'contrato': 'Contrato', 
      'formulario': 'Formulário',
      'outro': 'Outro'
    };
    return tipos[tipo as keyof typeof tipos] || tipo;
  };

  const handleVerFornecedores = (documento: DocumentoAgrupado) => {
    setDocumentoSelecionado(documento);
    setFornecedoresSelecionados([]);
    setModalAberto(true);
  };

  const handleSelecionarFornecedor = (documentoId: string, selecionado: boolean) => {
    if (selecionado) {
      setFornecedoresSelecionados([...fornecedoresSelecionados, documentoId]);
    } else {
      setFornecedoresSelecionados(fornecedoresSelecionados.filter(id => id !== documentoId));
    }
  };

  const handleSolicitarAtualizacao = (documento: DocumentoAgrupado) => {
    toast.success(`Solicitação de atualização enviada para ${documento.quantidade_fornecedores} fornecedores`);
  };

  const handleBaixarTodos = (documento: DocumentoAgrupado) => {
    toast.success(`Iniciando download de ${documento.quantidade_fornecedores} documentos`);
  };

  const handleSolicitarSelecionados = () => {
    if (fornecedoresSelecionados.length === 0) {
      toast.error("Selecione pelo menos um fornecedor");
      return;
    }
    
    // Simular envio de email/notificação para os fornecedores selecionados
    const fornecedoresInfo = documentoSelecionado?.documentos
      .filter(doc => fornecedoresSelecionados.includes(doc.id))
      .map(doc => doc.fornecedor_nome)
      .join(", ");
    
    toast.promise(
      // Simular chamada de API
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 2000);
      }),
      {
        loading: `Enviando solicitação para ${fornecedoresSelecionados.length} fornecedores...`,
        success: `✅ Solicitação de reenvio enviada com sucesso para: ${fornecedoresInfo}`,
        error: "❌ Erro ao enviar solicitação"
      }
    );
    
    // Limpar seleção e fechar modal após sucesso
    setTimeout(() => {
      setFornecedoresSelecionados([]);
      setModalAberto(false);
    }, 2500);
  };

  const handleBaixarSelecionados = () => {
    if (fornecedoresSelecionados.length === 0) {
      toast.error("Selecione pelo menos um documento");
      return;
    }
    toast.success(`Iniciando download de ${fornecedoresSelecionados.length} documentos`);
  };

  // Estatísticas gerais e por tipo
  const stats = {
    totalGrupos: documentosAgrupados.length,
    totalDocumentos: documentosAgrupados.reduce((acc, grupo) => acc + grupo.quantidade_fornecedores, 0),
    vencidos: documentosAgrupados.filter(d => d.status === 'vencido').length,
    pendentes: documentosAgrupados.filter(d => d.status === 'pendente').length,
    validos: documentosAgrupados.filter(d => d.status === 'valido').length,
  };

  // Estatísticas por tipo
  const statsPorTipo = useMemo(() => {
    const tipos = ['certidao', 'contrato', 'formulario', 'outro'];
    return tipos.map(tipo => {
      const documentosTipo = mockDocumentosGlobais.filter(d => d.tipo === tipo);
      return {
        tipo,
        label: getTipoLabel(tipo),
        quantidade: documentosTipo.length,
        color: tipo === 'certidao' ? 'bg-blue-500' : 
               tipo === 'contrato' ? 'bg-green-500' :
               tipo === 'formulario' ? 'bg-purple-500' : 'bg-orange-500'
      };
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Botão Voltar */}
      <div className="mb-4">
        <BackButton to="/fornecedores" label="Voltar para Fornecedores" />
      </div>
      
      {/* Seção de Resumo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resumo de Documentos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Resumo de Documentos
            </CardTitle>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar Lista
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-slate-600">Total de documentos:</div>
                <div className="text-2xl font-bold text-slate-800">{stats.totalDocumentos}</div>
              </div>
              <div>
                <div className="text-sm text-slate-600">Tamanho total:</div>
                <div className="text-2xl font-bold text-slate-800">7.20 MB</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Documentos válidos:</span>
                <span className="text-sm font-medium text-green-600">{stats.validos}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Documentos vencidos:</span>
                <span className="text-sm font-medium text-red-600">{stats.vencidos}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Documentos pendentes:</span>
                <span className="text-sm font-medium text-amber-600">{stats.pendentes}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documentos por Tipo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Documentos por Tipo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {statsPorTipo.map((stat) => (
              <div key={stat.tipo} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded ${stat.color}`}></div>
                  <span className="text-sm font-medium">{stat.label}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2 max-w-32">
                    <div 
                      className={`h-2 rounded-full ${stat.color}`}
                      style={{ width: `${(stat.quantidade / stats.totalDocumentos) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-medium">{stat.quantidade}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Filtros por Status */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filtroStatus === "todos" ? "default" : "outline"}
              size="sm"
              onClick={() => setFiltroStatus("todos")}
            >
              Todos <Badge variant="secondary" className="ml-2">{stats.totalGrupos}</Badge>
            </Button>
            <Button
              variant={filtroStatus === "valido" ? "default" : "outline"}
              size="sm"
              onClick={() => setFiltroStatus("valido")}
            >
              Válidos <Badge variant="secondary" className="ml-2">{stats.validos}</Badge>
            </Button>
            <Button
              variant={filtroStatus === "vencido" ? "default" : "outline"}
              size="sm"
              onClick={() => setFiltroStatus("vencido")}
            >
              Vencidos <Badge variant="secondary" className="ml-2">{stats.vencidos}</Badge>
            </Button>
            <Button
              variant={filtroStatus === "pendente" ? "default" : "outline"}
              size="sm"
              onClick={() => setFiltroStatus("pendente")}
            >
              Pendentes <Badge variant="secondary" className="ml-2">{stats.pendentes}</Badge>
            </Button>
            <Button
              variant={filtroStatus === "vence_em_breve" ? "default" : "outline"}
              size="sm"
              onClick={() => setFiltroStatus("vence_em_breve")}
            >
              Vence em Breve <Badge variant="secondary" className="ml-2">0</Badge>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas detalhadas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Controle Documental Global
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">{stats.totalGrupos}</div>
              <div className="text-sm text-slate-600">Grupos de Documentos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">{stats.totalDocumentos}</div>
              <div className="text-sm text-slate-600">Total de Documentos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.vencidos}</div>
              <div className="text-sm text-slate-600">Grupos Vencidos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">{stats.pendentes}</div>
              <div className="text-sm text-slate-600">Grupos Pendentes</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtros de busca aprimorados */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Buscar por documento, fornecedor, CNPJ ou CPF..."
                value={filtroTermo}
                onChange={(e) => setFiltroTermo(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os tipos" />
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
              <SelectTrigger>
                <SelectValue placeholder="Status do Documento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="valido">Válidos</SelectItem>
                <SelectItem value="vencido">Vencidos</SelectItem>
                <SelectItem value="pendente">Pendentes</SelectItem>
                <SelectItem value="vence_em_breve">Vence em breve</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de documentos agrupados */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Documento</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Fornecedores</TableHead>
                  <TableHead>Próxima Validade</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documentosAgrupados.length > 0 ? (
                  documentosAgrupados.map((grupo, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="font-medium">{grupo.nome}</div>
                        {grupo.quantidade_fornecedores > 1 && (
                          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            Múltiplos fornecedores
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{getTipoLabel(grupo.tipo)}</TableCell>
                      <TableCell>{getStatusBadge(grupo.status)}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="font-mono">
                          {grupo.quantidade_fornecedores}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {grupo.status === 'vencido' && <AlertCircle className="h-4 w-4 text-red-500" />}
                          {grupo.proxima_validade}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleVerFornecedores(grupo)}
                            className="h-8 px-2"
                          >
                            <Users className="h-4 w-4 mr-1" />
                            Ver ({grupo.quantidade_fornecedores})
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSolicitarAtualizacao(grupo)}
                            className="h-8 px-2"
                          >
                            <Mail className="h-4 w-4 mr-1" />
                            Solicitar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleBaixarTodos(grupo)}
                            className="h-8 px-2"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Baixar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                      Nenhum documento encontrado com os filtros aplicados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de fornecedores do documento */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {documentoSelecionado?.nome}
            </DialogTitle>
            <DialogDescription>
              Tipo: {documentoSelecionado && getTipoLabel(documentoSelecionado.tipo)} | 
              Status: {documentoSelecionado?.status} | 
              Fornecedores: {documentoSelecionado?.quantidade_fornecedores}
            </DialogDescription>
          </DialogHeader>

          {documentoSelecionado && (
            <div className="space-y-4">
              {/* Ações em massa */}
              <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-lg">
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={handleSolicitarSelecionados}
                  disabled={fornecedoresSelecionados.length === 0}
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Solicitar Reenvio ({fornecedoresSelecionados.length})
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleBaixarSelecionados}
                  disabled={fornecedoresSelecionados.length === 0}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Baixar PDFs ({fornecedoresSelecionados.length})
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const todosIds = documentoSelecionado.documentos.map(d => d.id);
                    setFornecedoresSelecionados(
                      fornecedoresSelecionados.length === todosIds.length ? [] : todosIds
                    );
                  }}
                >
                  {fornecedoresSelecionados.length === documentoSelecionado.documentos.length 
                    ? "Desmarcar Todos" 
                    : "Selecionar Todos"
                  }
                </Button>
              </div>

              {/* Lista de fornecedores */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10"></TableHead>
                      <TableHead>Fornecedor</TableHead>
                      <TableHead>CNPJ</TableHead>
                      <TableHead>Data de Envio</TableHead>
                      <TableHead>Validade</TableHead>
                      <TableHead>Versão</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documentoSelecionado.documentos.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>
                          <Checkbox
                            checked={fornecedoresSelecionados.includes(doc.id)}
                            onCheckedChange={(checked) => 
                              handleSelecionarFornecedor(doc.id, !!checked)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{doc.fornecedor_nome}</div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{doc.fornecedor_cnpj}</TableCell>
                        <TableCell>{new Date(doc.upload_data).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {doc.status === 'vencido' && <AlertCircle className="h-4 w-4 text-red-500" />}
                            {doc.validade ? new Date(doc.validade).toLocaleDateString('pt-BR') : '-'}
                          </div>
                        </TableCell>
                        <TableCell>v{doc.versao}</TableCell>
                        <TableCell>{getStatusBadge(doc.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

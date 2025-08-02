import React, { useState } from "react";
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { FormularioDocumento } from "@/components/documentos/FormularioDocumento";
import { FiltroDocumentos } from "@/components/documentos/FiltroDocumentos";
import { TabelaDocumentos } from "@/components/documentos/TabelaDocumentos";
import { BackButton } from "@/components/ui/back-button";
import type { Documento, DocumentoFormData, TipoDocumento, FiltrosDocumentos } from "@/types/documentos";
import { formatarData } from "@/utils/dateUtils";

// Mock de documentos para a página com dados formatados corretamente
const mockDocumentos: Documento[] = [
  {
    id: "doc1",
    fornecedor_id: "1",
    tipo: "certidao",
    nome: "Certidão Negativa de Débitos",
    versao: "1.0",
    validade: "2023-12-31",
    status: "valido",
    upload_por: "João Silva",
    upload_data: "2023-01-15T10:30:00Z",
    dataUpload: "2023-01-15",
    tamanho: 1.2,
    formato: "PDF",
    arquivo_url: "/docs/certidao_negativa.pdf",
    ativo: true
  },
  {
    id: "doc2",
    fornecedor_id: "1",
    tipo: "contrato",
    nome: "Contrato de Fornecimento",
    versao: "2.1",
    validade: "2024-06-30",
    status: "valido",
    upload_por: "Maria Santos",
    upload_data: "2023-03-22T14:15:00Z",
    dataUpload: "2023-03-22",
    tamanho: 3.5,
    formato: "PDF",
    arquivo_url: "/docs/contrato_fornecimento.pdf",
    ativo: true
  },
  {
    id: "doc3",
    fornecedor_id: "1",
    tipo: "formulario",
    nome: "Formulário de Qualificação",
    versao: "1.2",
    validade: "2023-05-10",
    status: "vencido",
    upload_por: "Carlos Ferreira",
    upload_data: "2022-05-10T09:45:00Z",
    dataUpload: "2022-05-10",
    tamanho: 0.8,
    formato: "DOCX",
    arquivo_url: "/docs/form_qualificacao.docx",
    ativo: true
  },
  {
    id: "doc4",
    fornecedor_id: "1",
    tipo: "outro",
    nome: "Política de Compliance",
    versao: "3.0",
    status: "pendente",
    upload_por: "Ana Oliveira",
    upload_data: "2023-04-05T16:20:00Z",
    dataUpload: "2023-04-05",
    tamanho: 1.7,
    formato: "PDF",
    arquivo_url: "/docs/politica_compliance.pdf",
    ativo: true
  }
];

const DocumentosFornecedor = () => {
  const [documentos, setDocumentos] = useState<Documento[]>(mockDocumentos);
  const [filtros, setFiltros] = useState<FiltrosDocumentos>({});
  const [showForm, setShowForm] = useState(false);
  
  const handleFiltragem = (novosFiltros: FiltrosDocumentos) => {
    setFiltros(novosFiltros);
  };
  
  const documentosFiltrados = documentos.filter(doc => {
    // Filtro por termo de busca
    if (filtros.termo && !doc.nome.toLowerCase().includes(filtros.termo.toLowerCase())) {
      return false;
    }
    
    // Filtro por tipo
    if (filtros.tipo && doc.tipo !== filtros.tipo) {
      return false;
    }
    
    // Filtro por status
    if (filtros.status && doc.status !== filtros.status) {
      return false;
    }
    
    return true;
  });
  
  // Contagem de documentos por status para exibir nos badges
  const contarPorStatus = (status: string) => {
    return documentos.filter(doc => doc.status === status).length;
  };
  
  const handleAddDocumento = (data: DocumentoFormData) => {
    if (!data.arquivo) {
      toast.error("É necessário selecionar um arquivo");
      return;
    }
    
    // Verificar se já existe documento com o mesmo nome e tipo
    const docExistente = documentos.find(
      doc => doc.nome === data.nome && doc.tipo === data.tipo
    );
    
    const dataAtual = new Date().toISOString();
    let novoDocumento: Documento;
    
    if (docExistente) {
      // Se já existe, incrementa a versão
      // Obtém a última versão como string e converte para número para incrementar
      const ultimaVersao = parseFloat(docExistente.versao);
      
      novoDocumento = {
        id: `doc${documentos.length + 1}`,
        fornecedor_id: "1", // Mock ID
        tipo: data.tipo,
        nome: data.nome,
        versao: String(ultimaVersao + 1), // Convertendo explicitamente para string
        validade: data.validade,
        upload_por: "Admin", // Mock usuário
        upload_data: dataAtual,
        dataUpload: formatarData(dataAtual),
        status: "valido",
        tamanho: data.arquivo.size / (1024 * 1024), // Converte bytes para MB
        formato: data.arquivo.name.split('.').pop()?.toUpperCase() || "DESCONHECIDO",
        arquivo_url: URL.createObjectURL(data.arquivo),
        ativo: true
      };
      
      toast.success(`Nova versão (${novoDocumento.versao}) adicionada com sucesso!`);
    } else {
      // Se é documento novo
      novoDocumento = {
        id: `doc${documentos.length + 1}`,
        fornecedor_id: "1", // Mock ID
        tipo: data.tipo,
        nome: data.nome,
        versao: "1", // Já estava como string
        validade: data.validade,
        upload_por: "Admin", // Mock usuário
        upload_data: dataAtual,
        dataUpload: formatarData(dataAtual),
        status: "valido",
        tamanho: data.arquivo.size / (1024 * 1024), // Converte bytes para MB
        formato: data.arquivo.name.split('.').pop()?.toUpperCase() || "DESCONHECIDO",
        arquivo_url: URL.createObjectURL(data.arquivo),
        ativo: true
      };
      
      toast.success("Novo documento adicionado com sucesso!");
    }
    
    setDocumentos([novoDocumento, ...documentos]);
    setShowForm(false);
  };
  
  const handleDeleteDocumento = (id: string) => {
    // Confirmar exclusão
    if (confirm("Tem certeza que deseja excluir este documento?")) {
      setDocumentos(documentos.filter(doc => doc.id !== id));
      toast.success("Documento excluído com sucesso");
    }
  };
  
  const handleDownloadDocumento = (doc: Documento) => {
    // Simulação de download
    toast.success(`Iniciando download de ${doc.nome}`);
    
    // Em um ambiente real, isso seria um link para a API que serve o arquivo
    const link = document.createElement('a');
    link.href = doc.arquivo_url;
    link.download = `${doc.nome}.${doc.formato.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calcula o tamanho total dos documentos em MB
  const calcularTamanhoTotal = () => {
    return documentos.reduce((total, doc) => total + doc.tamanho, 0).toFixed(2);
  };
  
  return (
    <div className="space-y-6">
      {/* Botão Voltar */}
      <div className="mb-4">
        <BackButton to="/fornecedores" label="Voltar para Fornecedores" />
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2 mb-1">
            <FileText className="h-6 w-6 text-amber-600" />
            Documentos do Fornecedor
          </h1>
          <p className="text-slate-500">
            Gerencie documentos, certificações e contratos
          </p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)} 
          className="bg-amber-600 hover:bg-amber-700"
        >
          <Plus className="h-4 w-4 mr-1" /> 
          {showForm ? "Cancelar" : "Adicionar Documento"}
        </Button>
      </div>
      
      {showForm && (
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">Novo Documento</h2>
            <FormularioDocumento onSubmit={handleAddDocumento} />
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-4">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <Tabs defaultValue="todos" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="todos">
                    Todos <Badge variant="secondary" className="ml-2">{documentos.length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="validos">
                    Válidos <Badge variant="secondary" className="ml-2">{contarPorStatus('valido')}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="vencidos">
                    Vencidos <Badge variant="secondary" className="ml-2">{contarPorStatus('vencido')}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="pendentes">
                    Pendentes <Badge variant="secondary" className="ml-2">{contarPorStatus('pendente')}</Badge>
                  </TabsTrigger>
                </TabsList>

                <FiltroDocumentos onFiltrar={handleFiltragem} />
                
                <TabsContent value="todos" className="mt-4">
                  <TabelaDocumentos 
                    documentos={documentosFiltrados} 
                    onDelete={handleDeleteDocumento}
                    onDownload={handleDownloadDocumento}
                  />
                </TabsContent>
                
                <TabsContent value="validos" className="mt-4">
                  <TabelaDocumentos 
                    documentos={documentosFiltrados.filter(d => d.status === 'valido')} 
                    onDelete={handleDeleteDocumento}
                    onDownload={handleDownloadDocumento}
                  />
                </TabsContent>
                
                <TabsContent value="vencidos" className="mt-4">
                  <TabelaDocumentos 
                    documentos={documentosFiltrados.filter(d => d.status === 'vencido')} 
                    onDelete={handleDeleteDocumento}
                    onDownload={handleDownloadDocumento}
                  />
                </TabsContent>
                
                <TabsContent value="pendentes" className="mt-4">
                  <TabelaDocumentos 
                    documentos={documentosFiltrados.filter(d => d.status === 'pendente')} 
                    onDelete={handleDeleteDocumento}
                    onDownload={handleDownloadDocumento}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Resumo de Documentos</h3>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" /> Exportar Lista
              </Button>
            </div>
            
            <div className="mt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Total de documentos:</span>
                <span className="font-semibold">{documentos.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Documentos válidos:</span>
                <span className="font-semibold text-green-600">{contarPorStatus('valido')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Documentos vencidos:</span>
                <span className="font-semibold text-red-600">{contarPorStatus('vencido')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Documentos pendentes:</span>
                <span className="font-semibold text-amber-600">{contarPorStatus('pendente')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Tamanho total:</span>
                <span className="font-semibold">{calcularTamanhoTotal()} MB</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Documentos por Tipo</h3>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Certidões</span>
                  <span>{documentos.filter(d => d.tipo === 'certidao').length}</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full mt-1">
                  <div 
                    className="h-2 bg-blue-500 rounded-full" 
                    style={{ width: `${(documentos.filter(d => d.tipo === 'certidao').length / documentos.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm">
                  <span>Contratos</span>
                  <span>{documentos.filter(d => d.tipo === 'contrato').length}</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full mt-1">
                  <div 
                    className="h-2 bg-green-500 rounded-full" 
                    style={{ width: `${(documentos.filter(d => d.tipo === 'contrato').length / documentos.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm">
                  <span>Formulários</span>
                  <span>{documentos.filter(d => d.tipo === 'formulario').length}</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full mt-1">
                  <div 
                    className="h-2 bg-purple-500 rounded-full" 
                    style={{ width: `${(documentos.filter(d => d.tipo === 'formulario').length / documentos.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm">
                  <span>Outros</span>
                  <span>{documentos.filter(d => d.tipo === 'outro').length}</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full mt-1">
                  <div 
                    className="h-2 bg-amber-500 rounded-full" 
                    style={{ width: `${(documentos.filter(d => d.tipo === 'outro').length / documentos.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DocumentosFornecedor;

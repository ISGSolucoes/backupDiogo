import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Upload,
  CheckCircle2,
  AlertCircle,
  Package,
  DollarSign,
  Clock,
  Target,
  X
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { ImpostosSection } from "./ImpostosSection";
import { useTaxCalculation } from "@/hooks/useTaxCalculation";
import { 
  RegimeTributario, 
  TributosDetalhados, 
  FonteValorTributo 
} from "@/types/impostos";

interface ItemProposta {
  id: string;
  codigo: string;
  descricao: string;
  especificacao: string;
  quantidade: number;
  unidade: string;
  precoUnitario: number;
  precoTotal: number;
  observacoes: string;
  preenchido: boolean;
  
  // Campos de impostos
  regimeTributario: RegimeTributario;
  impostos: TributosDetalhados;
  valorSemImpostos: number;
  fonteDoValorTributo: FonteValorTributo;
}

interface DocumentoUpload {
  id: string;
  nome: string;
  obrigatorio: boolean;
  arquivo?: File;
  enviado: boolean;
}

interface ChecklistItem {
  id: string;
  categoria: string;
  titulo: string;
  concluido: boolean;
  obrigatorio: boolean;
}

export const PropostaFornecedor: React.FC = () => {
  const { projetoId } = useParams();
  const navigate = useNavigate();
  const { createEmptyTributos, calculateTotalWithTaxes } = useTaxCalculation();

  const [itens, setItens] = useState<ItemProposta[]>([
    {
      id: "1",
      codigo: "SW-001",
      descricao: "Sistema de Gestão ERP",
      especificacao: "Deve incluir módulos: financeiro, estoque, RH",
      quantidade: 1,
      unidade: "Licença",
      precoUnitario: 0,
      precoTotal: 0,
      observacoes: "",
      preenchido: false,
      regimeTributario: null,
      impostos: createEmptyTributos(),
      valorSemImpostos: 0,
      fonteDoValorTributo: 'fornecedor'
    },
    {
      id: "2",
      codigo: "SW-002", 
      descricao: "Implementação ERP",
      especificacao: "Deve incluir migração de dados e testes finais",
      quantidade: 1,
      unidade: "Projeto",
      precoUnitario: 0,
      precoTotal: 0,
      observacoes: "",
      preenchido: false,
      regimeTributario: null,
      impostos: createEmptyTributos(),
      valorSemImpostos: 0,
      fonteDoValorTributo: 'fornecedor'
    },
    {
      id: "3",
      codigo: "TR-001",
      descricao: "Treinamento de Usuários", 
      especificacao: "Preferencialmente presencial",
      quantidade: 50,
      unidade: "Usuário",
      precoUnitario: 0,
      precoTotal: 0,
      observacoes: "",
      preenchido: false,
      regimeTributario: null,
      impostos: createEmptyTributos(),
      valorSemImpostos: 0,
      fonteDoValorTributo: 'fornecedor'
    },
    {
      id: "4",
      codigo: "SP-001",
      descricao: "Suporte Técnico Anual",
      especificacao: "24/7, 1º ano incluso, com SLA", 
      quantidade: 12,
      unidade: "Mês",
      precoUnitario: 0,
      precoTotal: 0,
      observacoes: "",
      preenchido: false,
      regimeTributario: null,
      impostos: createEmptyTributos(),
      valorSemImpostos: 0,
      fonteDoValorTributo: 'fornecedor'
    }
  ]);

  const [documentos, setDocumentos] = useState<DocumentoUpload[]>([
    { id: "1", nome: "Proposta Técnica Detalhada", obrigatorio: true, enviado: false },
    { id: "2", nome: "Proposta Comercial", obrigatorio: true, enviado: false },
    { id: "3", nome: "Referências Comerciais", obrigatorio: true, enviado: false },
    { id: "4", nome: "Certidões Negativas", obrigatorio: true, enviado: false },
    { id: "5", nome: "Cronograma de Implantação", obrigatorio: true, enviado: false }
  ]);

  const impostosConcluidos = itens.every(item => 
    item.preenchido ? item.regimeTributario !== null : true
  );

  const checklist: ChecklistItem[] = [
    { id: "1", categoria: "Preços", titulo: "Todos os preços preenchidos", concluido: itens.every(item => item.preenchido), obrigatorio: true },
    { id: "2", categoria: "Impostos", titulo: "Regime tributário informado", concluido: impostosConcluidos, obrigatorio: false },
    { id: "3", categoria: "Documentos", titulo: "Documentos obrigatórios enviados", concluido: documentos.filter(d => d.obrigatorio).every(d => d.enviado), obrigatorio: true },
    { id: "4", categoria: "Revisão", titulo: "Proposta revisada", concluido: false, obrigatorio: false }
  ];

  const progresso = (checklist.filter(item => item.concluido).length / checklist.length) * 100;
  const podeEnviar = checklist.filter(item => item.obrigatorio).every(item => item.concluido);

  const handlePrecoChange = (itemId: string, preco: number) => {
    setItens(prev => prev.map(item => {
      if (item.id === itemId) {
        const precoTotal = item.quantidade * preco;
        const valorSemImpostos = precoTotal;
        return {
          ...item,
          precoUnitario: preco,
          precoTotal,
          valorSemImpostos,
          preenchido: preco > 0
        };
      }
      return item;
    }));
  };

  const handleRegimeChange = (itemId: string, regime: RegimeTributario) => {
    setItens(prev => prev.map(item => 
      item.id === itemId ? { ...item, regimeTributario: regime } : item
    ));
  };

  const handleImpostosChange = (itemId: string, impostos: TributosDetalhados) => {
    setItens(prev => prev.map(item => 
      item.id === itemId ? { 
        ...item, 
        impostos,
        fonteDoValorTributo: 'fornecedor'
      } : item
    ));
  };

  const handleObservacaoChange = (itemId: string, observacao: string) => {
    setItens(prev => prev.map(item => 
      item.id === itemId ? { ...item, observacoes: observacao } : item
    ));
  };

  const handleFileUpload = (docId: string, file: File) => {
    setDocumentos(prev => prev.map(doc => 
      doc.id === docId ? { ...doc, arquivo: file, enviado: true } : doc
    ));
  };

  const removeFile = (docId: string) => {
    setDocumentos(prev => prev.map(doc => 
      doc.id === docId ? { ...doc, arquivo: undefined, enviado: false } : doc
    ));
  };

  const calcularTotal = () => {
    return itens.reduce((acc, item) => {
      const valorComImpostos = calculateTotalWithTaxes(item.valorSemImpostos, item.impostos);
      return acc + valorComImpostos;
    }, 0);
  };

  const calcularTotalSemImpostos = () => {
    return itens.reduce((acc, item) => acc + item.valorSemImpostos, 0);
  };

  const calcularTotalImpostos = () => {
    return calcularTotal() - calcularTotalSemImpostos();
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const handleEnviarProposta = () => {
    if (podeEnviar) {
      // Simular envio
      alert('Proposta enviada com sucesso!');
      navigate('/portal-fornecedor/inbox');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold">Enviar Proposta</h1>
              <p className="text-muted-foreground">{projetoId} - RFP – ERP e Serviços de Implementação</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <Progress value={progresso} className="w-32" />
                <span className="text-sm text-muted-foreground">{Math.round(progresso)}%</span>
              </div>
              <p className="text-sm text-muted-foreground">Progresso da proposta</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Checklist Lateral */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {checklist.map((item) => (
                <div key={item.id} className="flex items-start gap-2">
                  {item.concluido ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <div className={`h-5 w-5 rounded-full border-2 mt-0.5 ${item.obrigatorio ? 'border-red-300' : 'border-gray-300'}`} />
                  )}
                  <div className="space-y-1">
                    <p className={`text-sm font-medium ${item.concluido ? 'text-green-700' : item.obrigatorio ? 'text-red-700' : 'text-gray-700'}`}>
                      {item.titulo}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {item.categoria}
                    </Badge>
                    {item.obrigatorio && !item.concluido && (
                      <p className="text-xs text-red-600">Obrigatório</p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Conteúdo Principal */}
        <div className="lg:col-span-3 space-y-6">
          {/* Preenchimento de Preços */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Preços dos Itens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {itens.map((item) => (
                  <div key={item.id} className="border rounded p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.descricao}</h4>
                        <p className="text-sm text-muted-foreground">{item.codigo} - {item.especificacao}</p>
                        <p className="text-sm">Quantidade: {item.quantidade} {item.unidade}</p>
                      </div>
                      <Badge variant={item.preenchido ? "default" : "destructive"}>
                        {item.preenchido ? "Preenchido" : "Pendente"}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="text-sm font-medium">Preço Unitário</label>
                        <Input
                          type="number"
                          placeholder="0,00"
                          value={item.precoUnitario || ''}
                          onChange={(e) => handlePrecoChange(item.id, parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Preço Total (sem impostos)</label>
                        <Input
                          value={formatarMoeda(item.precoTotal)}
                          disabled
                          className="bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Observações (opcional)</label>
                        <Input
                          placeholder="Comentários do item"
                          value={item.observacoes}
                          onChange={(e) => handleObservacaoChange(item.id, e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Seção de Impostos */}
                    <ImpostosSection
                      valor={item.precoTotal}
                      regimeTributario={item.regimeTributario}
                      impostos={item.impostos}
                      onRegimeChange={(regime) => handleRegimeChange(item.id, regime)}
                      onImpostosChange={(impostos) => handleImpostosChange(item.id, impostos)}
                      categoria="software"
                      tipo="servico"
                    />
                  </div>
                ))}
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total sem impostos:</span>
                    <span className="text-lg font-medium">{formatarMoeda(calcularTotalSemImpostos())}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total de impostos:</span>
                    <span className="text-lg font-medium text-orange-600">{formatarMoeda(calcularTotalImpostos())}</span>
                  </div>
                  <div className="flex justify-between items-center border-t pt-2">
                    <span className="text-lg font-semibold">Total da Proposta:</span>
                    <span className="text-2xl font-bold text-green-600">{formatarMoeda(calcularTotal())}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upload de Documentos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documentos Obrigatórios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documentos.map((doc) => (
                  <div key={doc.id} className="border rounded p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{doc.nome}</span>
                        {doc.obrigatorio && (
                          <Badge variant="destructive" className="text-xs">Obrigatório</Badge>
                        )}
                        {doc.enviado && (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      {doc.enviado && doc.arquivo && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(doc.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    {doc.enviado && doc.arquivo ? (
                      <div className="flex items-center gap-2 text-sm text-green-700">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>{doc.arquivo.name}</span>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center">
                        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">Clique para selecionar arquivo</p>
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(doc.id, file);
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement).files?.[0];
                              if (file) handleFileUpload(doc.id, file);
                            };
                            input.click();
                          }}
                        >
                          Selecionar Arquivo
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Preview da Submissão */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Resumo da Proposta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Itens Cotados:</p>
                    <p>{itens.filter(i => i.preenchido).length}/{itens.length}</p>
                  </div>
                  <div>
                    <p className="font-medium">Documentos Enviados:</p>
                    <p>{documentos.filter(d => d.enviado).length}/{documentos.filter(d => d.obrigatorio).length}</p>
                  </div>
                  <div>
                    <p className="font-medium">Valor Total (com impostos):</p>
                    <p className="text-lg font-bold text-green-600">{formatarMoeda(calcularTotal())}</p>
                  </div>
                  <div>
                    <p className="font-medium">Status:</p>
                    <Badge variant={podeEnviar ? "default" : "destructive"}>
                      {podeEnviar ? "Pronto para envio" : "Pendente"}
                    </Badge>
                  </div>
                </div>

                {!podeEnviar && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <p className="text-sm text-yellow-800 font-medium">Itens pendentes:</p>
                    </div>
                    <ul className="text-sm text-yellow-700 mt-1 list-disc list-inside">
                      {!itens.every(item => item.preenchido) && (
                        <li>Preencher preços de todos os itens</li>
                      )}
                      {!documentos.filter(d => d.obrigatorio).every(d => d.enviado) && (
                        <li>Enviar todos os documentos obrigatórios</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Botão de Envio */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Voltar
            </Button>
            <Button 
              size="lg" 
              onClick={handleEnviarProposta}
              disabled={!podeEnviar}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Enviar Proposta
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
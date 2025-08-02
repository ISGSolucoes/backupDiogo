
import React from "react";
import { Search, ArrowLeft, FileText, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

// Dados mock para fornecedores em qualificação
const fornecedoresEmQualificacao = [
  {
    id: "1",
    nome: "ABC Materiais Ltda",
    cnpj: "12.345.678/0001-01",
    categoria: "Matérias-Primas",
    inicioQualificacao: "2024-01-10",
    etapaAtual: "Análise Documental",
    progresso: 65,
    prazoFinal: "2024-02-10",
    diasRestantes: 15,
    documentosPendentes: 2,
    areaResponsavel: "Compras",
    prioridade: "alta",
    ultimaAtualizacao: "2024-01-20"
  },
  {
    id: "2",
    nome: "Tech Solutions SA",
    cnpj: "98.765.432/0001-02",
    categoria: "Tecnologia",
    inicioQualificacao: "2024-01-15",
    etapaAtual: "Avaliação Técnica",
    progresso: 40,
    prazoFinal: "2024-02-15",
    diasRestantes: 20,
    documentosPendentes: 1,
    areaResponsavel: "TI",
    prioridade: "media",
    ultimaAtualizacao: "2024-01-18"
  },
  {
    id: "3",
    nome: "Serviços Especializados ME",
    cnpj: "11.222.333/0001-03",
    categoria: "Serviços",
    inicioQualificacao: "2024-01-05",
    etapaAtual: "Aprovação Final",
    progresso: 90,
    prazoFinal: "2024-02-05",
    diasRestantes: 5,
    documentosPendentes: 0,
    areaResponsavel: "Compliance",
    prioridade: "alta",
    ultimaAtualizacao: "2024-01-22"
  }
];

const FornecedoresEmQualificacao = () => {
  const handleAprovarEtapa = (fornecedor: any) => {
    toast.success(`Etapa aprovada para ${fornecedor.nome}`);
  };

  const handleSolicitarDocumento = (fornecedor: any) => {
    toast.info(`Solicitação de documento enviada para ${fornecedor.nome}`);
  };

  const getPrioridadeStyle = (prioridade: string) => {
    switch(prioridade) {
      case "alta": return "border-red-200 bg-red-50";
      case "media": return "border-amber-200 bg-amber-50";
      default: return "border-blue-200 bg-blue-50";
    }
  };

  const getPrioridadeBadge = (prioridade: string) => {
    switch(prioridade) {
      case "alta": return <Badge variant="destructive">Alta</Badge>;
      case "media": return <Badge variant="secondary" className="bg-amber-100 text-amber-800">Média</Badge>;
      default: return <Badge variant="outline">Normal</Badge>;
    }
  };

  const getProgressColor = (progresso: number) => {
    if (progresso >= 80) return "bg-green-500";
    if (progresso >= 50) return "bg-blue-500";
    return "bg-amber-500";
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/fornecedores">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Search className="h-6 w-6 text-amber-600" />
                Fornecedores em Qualificação
              </h1>
              <p className="text-slate-500 mt-1">
                Fornecedores em processo de avaliação e qualificação
              </p>
            </div>
          </div>
        </div>

        {/* Estatísticas Resumidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total em Qualificação</p>
                  <p className="text-2xl font-bold">{fornecedoresEmQualificacao.length}</p>
                </div>
                <Search className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Prioridade Alta</p>
                  <p className="text-2xl font-bold text-red-600">
                    {fornecedoresEmQualificacao.filter(f => f.prioridade === "alta").length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Próximos ao Final</p>
                  <p className="text-2xl font-bold text-green-600">
                    {fornecedoresEmQualificacao.filter(f => f.progresso >= 80).length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Documentos Pendentes</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {fornecedoresEmQualificacao.reduce((sum, f) => sum + f.documentosPendentes, 0)}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Fornecedores */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Fornecedores em Processo</h2>
          
          {fornecedoresEmQualificacao.map((fornecedor) => (
            <Card key={fornecedor.id} className={`${getPrioridadeStyle(fornecedor.prioridade)} transition-all hover:shadow-md`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <CardTitle className="text-lg">{fornecedor.nome}</CardTitle>
                      <p className="text-sm text-slate-600">{fornecedor.cnpj}</p>
                    </div>
                    {getPrioridadeBadge(fornecedor.prioridade)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSolicitarDocumento(fornecedor)}
                      disabled={fornecedor.documentosPendentes === 0}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Solicitar Docs
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAprovarEtapa(fornecedor)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Aprovar Etapa
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Categoria:</span>
                      <span className="text-slate-600">{fornecedor.categoria}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Etapa Atual:</span>
                      <span className="text-slate-600">{fornecedor.etapaAtual}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Área Responsável:</span>
                      <span className="text-slate-600">{fornecedor.areaResponsavel}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Início:</span>
                      <span className="text-slate-600">{fornecedor.inicioQualificacao}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Prazo Final:</span>
                      <span className={`font-medium ${fornecedor.diasRestantes <= 7 ? 'text-red-600' : 'text-slate-600'}`}>
                        {fornecedor.prazoFinal} ({fornecedor.diasRestantes} dias)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Docs Pendentes:</span>
                      <span className={`font-medium ${fornecedor.documentosPendentes > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                        {fornecedor.documentosPendentes}
                      </span>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">Progresso:</span>
                        <span className="text-slate-600">{fornecedor.progresso}%</span>
                      </div>
                      <Progress 
                        value={fornecedor.progresso} 
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FornecedoresEmQualificacao;
